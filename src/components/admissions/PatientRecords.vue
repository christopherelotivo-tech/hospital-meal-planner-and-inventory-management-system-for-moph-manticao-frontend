<template>
  <div class="space-y-6 max-w-full overflow-hidden pb-8">
    <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
      <h2 class="text-xl font-bold text-gray-800 mb-6">Patient Record History</h2>
      
      <div class="space-y-4">
        <div 
          v-for="patient in patients" 
          :key="patient.id"
          @click="viewPatientDetails(patient)"
          class="border border-gray-100 rounded-xl p-5 hover:bg-gray-50 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between shadow-sm"
        >
          <div class="space-y-1">
            <h3 class="text-[15px] font-bold text-gray-800">{{ patient.name }}</h3>
            <p class="text-[13px] text-gray-500">{{ patient.age }} years old • {{ patient.gender }} • Room {{ patient.room }}</p>
            <p class="text-[13px] text-gray-500">Diagnosis: {{ patient.condition }}</p>
            <p class="text-[11px] text-gray-400 mt-1">
              Admitted: {{ formatDateTime(patient.admissionDate) }}
              <span v-if="patient.status === 'Discharged'"> • Discharged: {{ formatDateTime(new Date().toISOString()) }}</span>
            </p>
          </div>
          
          <div class="mt-4 md:mt-0 flex shrink-0">
            <span
              class="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold w-28"
              :class="{
                'bg-[#e6f4f1] text-[#00a67e]': patient.status === 'Active',
                'bg-yellow-50 text-yellow-600': patient.status === 'Pending',
                'bg-red-50 text-red-500': patient.status === 'Discharged'
              }"
            >
              {{ patient.status === 'Active' ? 'Admitted' : patient.status }}
            </span>
          </div>
        </div>

        <div v-if="patients.length === 0" class="p-12 text-center border border-gray-100 rounded-xl bg-gray-50/50">
          <p class="text-gray-500">No patient records found.</p>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <PatientDetailsModal 
      :show="showDetailsModal"
      :patient="selectedPatient"
      @close="showDetailsModal = false"
      @edit="openEditModal"
    />

    <PatientRegistration 
      :show="showAdmitModal" 
      :patientToEdit="selectedPatientToEdit"
      @close="closeRegistration" 
      @updated="handleUpdated"
    />
  </div>
</template>

<script setup>

import { ref, computed } from 'vue';
import { useDataStore } from '@/stores/dataStore';

import PatientDetailsModal from './PatientDetailsModal.vue';
import PatientRegistration from './PatientRegistration.vue';

const dataStore = useDataStore();

const patients = computed(() => {
  return dataStore.patients;
});

const showDetailsModal = ref(false);
const showAdmitModal = ref(false);
const selectedPatient = ref(null);
const selectedPatientToEdit = ref(null);

function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return `${formattedDate} • ${formattedTime}`;
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

function handleUpdated() {
  closeRegistration();
}
</script>
