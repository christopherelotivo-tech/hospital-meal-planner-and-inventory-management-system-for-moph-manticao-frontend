<template>
  <div class="space-y-6 max-w-full overflow-hidden pb-8">
    <!-- Search and Filter -->
    <div class="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
      <div class="relative w-full md:max-w-md">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search :size="18" class="text-gray-400" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name, room, or diagnosis..."
          class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00a67e] focus:ring-1 focus:ring-[#00a67e] transition-colors"
        />
      </div>
      <button @click="showAdmitModal = true" class="bg-[#00a67e] hover:bg-[#008a61] text-white px-5 py-2.5 rounded-xl flex items-center justify-center space-x-2 text-sm font-medium transition-colors shadow-sm whitespace-nowrap w-full md:w-auto">
        <UserPlus :size="18" />
        <span>Admit New Patient</span>
      </button>
    </div>

    <!-- Patients Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-50">
        <h2 class="text-base font-medium text-gray-800">Admitted Patients List</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr class="bg-white border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <th class="px-6 py-4">Patient Name</th>
              <th class="px-6 py-4">Age</th>
              <th class="px-6 py-4">Room & Bed</th>
              <th class="px-6 py-4">Attending Physician</th>
              <th class="px-6 py-4">Diagnosis</th>
              <th class="px-6 py-4">Admission Date & Time</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="patient in filteredPatients" :key="patient.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <button @click="viewPatientDetails(patient)" class="font-bold text-[#00a67e] text-sm hover:underline text-left focus:outline-none">
                  {{ patient.name }}
                </button>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ patient.age }}
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold bg-[#e6f4f1] text-[#00a67e]">
                  {{ patient.room }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 font-medium">
                {{ patient.physician }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ patient.condition }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ formatDateTime(patient.admissionDate) }}
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold"
                  :class="{
                    'bg-[#e6f4f1] text-[#00a67e]': patient.status === 'Active',
                    'bg-yellow-50 text-yellow-600': patient.status === 'Pending',
                    'bg-gray-100 text-gray-600': patient.status === 'Discharged'
                  }"
                >
                  <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="{
                    'bg-[#00a67e]': patient.status === 'Active',
                    'bg-yellow-500': patient.status === 'Pending',
                    'bg-gray-400': patient.status === 'Discharged'
                  }"></span>
                  {{ patient.status === 'Active' ? 'Admitted' : patient.status }}
                </span>
              </td>
              <td class="px-6 py-4">
                <button
                  v-if="patient.status === 'Active'"
                  @click="markPending(patient.id)"
                  class="bg-[#d97706] hover:bg-[#b45309] text-white px-5 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm text-center leading-tight whitespace-nowrap min-w-[100px]"
                >
                  Mark<br/>Pending
                </button>
                <button
                  v-else-if="patient.status === 'Pending'"
                  @click="dischargePatient(patient.id)"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm text-center leading-tight whitespace-nowrap min-w-[100px]"
                >
                  Discharge
                </button>
                <span v-else class="text-gray-400 text-xs font-bold italic block text-center min-w-[100px]">
                  Discharged
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredPatients.length === 0" class="p-12 text-center">
        <Users :size="48" class="mx-auto mb-4 text-gray-300" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">No patients found</h3>
        <p class="text-gray-600">Try adjusting your search</p>
      </div>
    </div>

    <PatientRegistration 
      :show="showAdmitModal" 
      :patientToEdit="selectedPatientToEdit"
      @close="closeRegistration" 
      @admitted="handleAdmitted" 
      @updated="handleUpdated"
    />

    <PatientDetailsModal 
      :show="showDetailsModal"
      :patient="selectedPatient"
      @close="showDetailsModal = false"
      @edit="openEditModal"
    />
  </div>
</template>

<script setup>

import { ref, computed } from 'vue';
import { useDataStore } from '@/stores/dataStore';

import { Search, UserPlus, Users } from 'lucide-vue-next';
import PatientRegistration from './PatientRegistration.vue';
import PatientDetailsModal from './PatientDetailsModal.vue';

const dataStore = useDataStore();

const searchQuery = ref('');
const statusFilter = ref('all');
const showAdmitModal = ref(false);
const showDetailsModal = ref(false);
const selectedPatient = ref(null);
const selectedPatientToEdit = ref(null);

const filteredPatients = computed(() => {
  let patients = dataStore.patients;

  if (statusFilter.value !== 'all') {
    patients = patients.filter((p) => p.status === statusFilter.value);
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    patients = patients.filter((p) =>
    p.name.toLowerCase().includes(query) ||
    p.id.toLowerCase().includes(query) ||
    p.room.toLowerCase().includes(query) ||
    p.condition.toLowerCase().includes(query) ||
    p.physician && p.physician.toLowerCase().includes(query)
    );
  }

  return patients;
});

function formatDateTime(dateString) {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return `${formattedDate} • ${formattedTime}`;
}

function markPending(patientId) {
  dataStore.updatePatient(patientId, { status: 'Pending' });
}

function dischargePatient(patientId) {
  dataStore.updatePatient(patientId, { status: 'Discharged' });
}

function handleAdmitted() {
  // Option to show a toast or notification here
  closeRegistration();
}

function handleUpdated() {
  closeRegistration();
}

function viewPatientDetails(patient) {
  selectedPatient.value = patient;
  showDetailsModal.value = true;
}

function openEditModal() {
  showDetailsModal.value = false;
  selectedPatientToEdit.value = selectedPatient.value;
  showAdmitModal.value = true;
}

function closeRegistration() {
  showAdmitModal.value = false;
  selectedPatientToEdit.value = null;
}
</script>
