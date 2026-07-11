<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center space-x-4 mb-2">
      <div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
        <FileText :size="24" />
      </div>
      <div>
        <h1 class="text-2xl font-bold text-gray-800 tracking-tight">Patient Dietary History</h1>
        <p class="text-sm text-gray-500">View meals served to patients with delivery verification</p>
      </div>
    </div>

    <!-- Main Card -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <!-- Card Header & Search -->
      <div class="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-lg font-bold text-gray-900">Select a Patient</h2>
          <p class="text-sm text-gray-500 mt-0.5">Choose a patient to view their meal service history</p>
        </div>
        <div class="relative w-full md:w-72">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search :size="16" class="text-gray-400" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search patients..."
            class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
          />
        </div>
      </div>

      <!-- Data Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-700">
              <th class="px-6 py-4">Patient Name</th>
              <th class="px-6 py-4">Room & Bed</th>
              <th class="px-6 py-4">Diagnosis</th>
              <th class="px-6 py-4">Prescribed Diet</th>
              <th class="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr 
              v-for="item in filteredPatients" 
              :key="item.patient.id"
              class="hover:bg-gray-50/50 transition-colors"
            >
              <td class="px-6 py-4 text-sm font-medium text-gray-900">
                {{ item.patient.name }}
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#e6fcf5] text-[#00a67e] border border-[#a7f3d0]">
                  {{ formatRoom(item.patient.room) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ item.patient.condition }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ item.prescription?.dietType || 'Not prescribed' }}
              </td>
              <td class="px-6 py-4">
                <button 
                  @click="openHistoryModal(item.patient)"
                  class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <FileText :size="16" class="mr-2" />
                  View History
                </button>
              </td>
            </tr>
            <tr v-if="filteredPatients.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                <Search :size="48" class="mx-auto mb-4 text-gray-300" />
                <p>No patients found matching your search.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- History Modal -->
    <transition name="fade">
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" @click.stop>
          
          <!-- Modal Header -->
          <div class="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50 shrink-0">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User :size="24" class="text-blue-600" />
              </div>
              <div>
                <h2 class="text-xl font-bold text-gray-900">{{ selectedPatient?.name }}</h2>
                <div class="flex flex-wrap gap-3 mt-1 text-xs text-gray-500 font-medium">
                  <span class="flex items-center">
                    <Home :size="12" class="mr-1" />
                    Room {{ selectedPatient?.room }}
                  </span>
                  <span class="flex items-center">
                    <Calendar :size="12" class="mr-1" />
                    {{ selectedPatient?.age }}y {{ selectedPatient?.gender[0] }}
                  </span>
                  <span class="flex items-center">
                    <FileText :size="12" class="mr-1" />
                    {{ selectedPatient?.condition }}
                  </span>
                </div>
              </div>
            </div>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1 border border-gray-200">
              <X :size="20" />
            </button>
          </div>
          
          <!-- Timeline Content -->
          <div class="p-6 overflow-y-auto bg-white flex-1">
            <h3 class="text-lg font-bold text-gray-900 mb-6">Complete Dietary Timeline</h3>

            <div v-if="patientHistory.length === 0" class="text-center py-10">
              <History :size="48" class="mx-auto mb-3 text-gray-300" />
              <p class="text-gray-500 text-sm">No dietary history available for this patient.</p>
            </div>

            <div v-else class="relative pl-6 border-l-2 border-gray-100 space-y-8 py-2">
              <div
                v-for="(event, index) in patientHistory"
                :key="index"
                class="relative"
              >
                <!-- Timeline Dot -->
                <div
                  class="absolute -left-[33px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  :class="getTimelineDotClass(event.type)"
                ></div>

                <!-- Event Card -->
                <div class="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div class="flex items-start justify-between mb-3">
                    <div>
                      <h4 class="font-bold text-gray-900">{{ event.title }}</h4>
                      <p class="text-xs text-gray-500 mt-0.5">{{ formatDateTime(event.timestamp) }}</p>
                    </div>
                    <span
                      class="px-2.5 py-1 rounded-full text-xs font-semibold"
                      :class="getEventBadgeClass(event.type)"
                    >
                      {{ event.type }}
                    </span>
                  </div>

                  <div class="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                    <component :is="getEventContent(event)" :event="event" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>

import { ref, computed, h } from 'vue';
import { useDataStore } from '@/stores/dataStore';
import { useAuthStore } from '@/stores/authStore';
import {
  User,
  Home,
  Calendar,
  FileText,
  History,
  Search,
  X } from
'lucide-vue-next';

const dataStore = useDataStore();
const authStore = useAuthStore();

const searchQuery = ref('');
const isModalOpen = ref(false);
const selectedPatient = ref(null);

// Get all active patients assigned to the current doctor
const activePatients = computed(() => {
  const currentDoc = authStore.currentUser?.name || 'Dr. Santos';
  return dataStore.patients.filter((p) => p.status === 'Active' && p.physician === currentDoc);
});

// Map patients to include their active prescription for the table
const tableData = computed(() => {
  return activePatients.value.map((patient) => {
    const prescription = dataStore.prescriptions.find(
      (rx) => rx.patientId === patient.id && rx.status === 'Active'
    );
    return {
      patient,
      prescription
    };
  }).sort((a, b) => new Date(b.patient.admissionDate).getTime() - new Date(a.patient.admissionDate).getTime());
});

// Filter based on search query
const filteredPatients = computed(() => {
  const q = searchQuery.value.toLowerCase();
  if (!q) return tableData.value;

  return tableData.value.filter((item) => {
    return item.patient.name.toLowerCase().includes(q) ||
    item.patient.room.toLowerCase().includes(q) ||
    item.patient.condition.toLowerCase().includes(q) ||
    (item.prescription?.dietType || 'Not prescribed').toLowerCase().includes(q);
  });
});

function formatRoom(roomString) {
  const parts = roomString.split('-');
  if (parts.length === 2) {
    return `Room ${parts[0]} • Bed ${parts[1]}`;
  }
  return `Room ${roomString}`;
}

function openHistoryModal(patient) {
  selectedPatient.value = patient;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  setTimeout(() => {
    selectedPatient.value = null;
  }, 200);
}

// Timeline Logic
const patientHistory = computed(() => {
  if (!selectedPatient.value) return [];

  const history = [];

  // Add prescriptions
  const prescriptions = dataStore.prescriptions.filter((p) => p.patientId === selectedPatient.value?.id);
  prescriptions.forEach((prescription) => {
    history.push({
      type: 'Prescription',
      title: `Diet Prescription: ${prescription.dietType}`,
      timestamp: prescription.createdAt,
      data: prescription
    });
  });

  // Add meal assignments
  const meals = dataStore.mealAssignments.filter((m) => m.patientId === selectedPatient.value?.id);
  meals.forEach((meal) => {
    history.push({
      type: 'Meal Assignment',
      title: 'Meal Plan Assigned',
      timestamp: meal.assignedAt,
      data: meal
    });
  });

  // Sort by timestamp descending
  return history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
});

function getTimelineDotClass(type) {
  const classes = {
    'Prescription': 'bg-green-500',
    'Meal Assignment': 'bg-purple-500',
    'Meal Served': 'bg-blue-500'
  };
  return classes[type] || 'bg-gray-400';
}

function getEventBadgeClass(type) {
  const classes = {
    'Prescription': 'bg-green-100 text-green-800',
    'Meal Assignment': 'bg-purple-100 text-purple-800',
    'Meal Served': 'bg-blue-100 text-blue-800'
  };
  return classes[type] || 'bg-gray-100 text-gray-800';
}

function getEventContent(event) {
  if (event.type === 'Prescription') {
    return h('div', { class: 'space-y-1.5' }, [
    h('p', {}, [
    h('span', { class: 'font-semibold text-gray-900' }, 'Diet Type: '),
    h('span', {}, event.data.dietType)]
    ),
    event.data.allergies.length > 0 && h('p', {}, [
    h('span', { class: 'font-semibold text-gray-900' }, 'Allergies: '),
    h('span', {}, event.data.allergies.join(', '))]
    ),
    h('p', {}, [
    h('span', { class: 'font-semibold text-gray-900' }, 'Prescribed by: '),
    h('span', {}, event.data.doctorName)]
    )]
    );
  }

  if (event.type === 'Meal Assignment') {
    return h('div', { class: 'space-y-1.5' }, [
    h('p', {}, [
    h('span', { class: 'font-semibold text-gray-900' }, 'Date: '),
    h('span', {}, event.data.date)]
    ),
    h('p', {}, [
    h('span', { class: 'font-semibold text-gray-900' }, 'Breakfast: '),
    h('span', {}, event.data.breakfast || 'N/A')]
    ),
    h('p', {}, [
    h('span', { class: 'font-semibold text-gray-900' }, 'Lunch: '),
    h('span', {}, event.data.lunch || 'N/A')]
    ),
    h('p', {}, [
    h('span', { class: 'font-semibold text-gray-900' }, 'Dinner: '),
    h('span', {}, event.data.dinner || 'N/A')]
    ),
    h('p', {}, [
    h('span', { class: 'font-semibold text-gray-900' }, 'Total Cost: '),
    h('span', {}, `₱${event.data.totalCost.toFixed(2)}`)]
    )]
    );
  }

  return h('p', {}, 'Event details');
}

function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
