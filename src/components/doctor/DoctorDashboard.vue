<template>
  <div class="space-y-6">
    <!-- Greeting Banner -->
    <div class="bg-[#2563eb] rounded-xl p-6 md:p-8 text-white relative overflow-hidden shadow-sm">
      <div class="flex items-center space-x-2 mb-2 relative z-10">
        <Sparkles class="text-yellow-300 w-5 h-5 md:w-6 md:h-6" />
        <h2 class="text-2xl md:text-3xl font-semibold tracking-tight">Good afternoon, {{ authStore.currentUser?.name || 'Dr. Santos' }}!</h2>
      </div>
      <p class="text-blue-100 mb-5 md:mb-6 text-sm relative z-10">You have {{ activePrescriptions }} patients waiting for diet prescriptions.</p>
      <div class="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-8 text-sm font-medium relative z-10">
        <div class="flex items-center space-x-2">
          <Users :size="16" />
          <span>{{ myPatients }} Active Patients</span>
        </div>
        <div class="flex items-center space-x-2">
          <Clock :size="16" />
          <span>{{ activePrescriptions }} Pending Prescriptions</span>
        </div>
      </div>
      <!-- Subtle background decoration -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-[#fffbeb] rounded-xl p-6 border border-[#fef3c7] shadow-sm relative overflow-hidden">
        <div class="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
          <Clock :size="18" class="text-yellow-600" />
        </div>
        <h3 class="text-3xl font-bold text-gray-800 mb-1">{{ activePrescriptions }}</h3>
        <p class="text-sm font-semibold text-gray-800">Pending Prescriptions</p>
        <p class="text-xs text-gray-500">Awaiting diet orders</p>
      </div>

      <div class="bg-[#eff6ff] rounded-xl p-6 border border-[#dbeafe] shadow-sm relative overflow-hidden">
        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-4">
          <Users :size="18" class="text-blue-600" />
        </div>
        <h3 class="text-3xl font-bold text-gray-800 mb-1">{{ myPatients }}</h3>
        <p class="text-sm font-semibold text-gray-800">Total Patients</p>
        <p class="text-xs text-gray-500">Currently admitted</p>
      </div>

      <div class="bg-[#f0fdf4] rounded-xl p-6 border border-[#dcfce7] shadow-sm relative overflow-hidden">
        <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle :size="18" class="text-green-600" />
        </div>
        <h3 class="text-3xl font-bold text-gray-800 mb-1">{{ prescribedPatients }}</h3>
        <p class="text-sm font-semibold text-gray-800">Prescribed Patients</p>
        <p class="text-xs text-gray-500">With diet plans</p>
      </div>
    </div>

    <!-- Middle Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recently Added Patients -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center space-x-2 mb-6">
          <TrendingUp :size="20" class="text-blue-600" />
          <h2 class="text-md font-bold text-gray-800">Recently Added Patients</h2>
        </div>

        <div class="space-y-0">
          <div
            v-for="patient in recentPatients"
            :key="patient.id"
            class="py-4 border-b border-gray-50 last:border-0 flex items-center justify-between"
          >
            <div>
              <h4 class="font-bold text-gray-800 text-sm">{{ patient.name }}</h4>
              <p class="text-xs text-gray-500 mt-0.5">Room {{ patient.room }} - {{ patient.condition }}</p>
            </div>
            <div class="text-xs text-gray-400">
              {{ formatDate(patient.admissionDate) }}
            </div>
          </div>
          <div v-if="recentPatients.length === 0" class="text-sm text-gray-500 text-center py-4">
            No recently added patients
          </div>
        </div>
      </div>

      <!-- Pending Prescriptions -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center space-x-2 mb-6">
          <Clock :size="20" class="text-yellow-500" />
          <h2 class="text-md font-bold text-gray-800">Pending Prescriptions</h2>
        </div>

        <div class="space-y-3">
          <div
            v-for="patient in pendingPatients"
            :key="patient.id"
            class="p-4 bg-[#fffdf0] border-l-4 border-l-yellow-400 rounded-r-lg flex items-center justify-between shadow-sm"
          >
            <div>
              <h4 class="font-bold text-gray-800 text-sm">{{ patient.name }}</h4>
              <p class="text-xs text-gray-500 mt-0.5">Room {{ patient.room }} - {{ patient.condition }}</p>
            </div>
            <div class="text-[11px] font-bold text-yellow-600">
              No Prescription
            </div>
          </div>
          <div v-if="pendingPatients.length === 0" class="text-sm text-gray-500 text-center py-4">
            All caught up! No pending prescriptions.
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 class="text-md font-bold text-gray-800 mb-4">Quick Actions</h2>
      <div class="max-w-md">
        <button
          @click="$emit('navigate', 'patients')"
          class="w-full text-left p-5 rounded-xl border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all group bg-[#f8fafc]"
        >
          <div class="flex items-start space-x-4">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <FileText :size="20" />
            </div>
            <div>
              <h3 class="font-bold text-gray-800 text-sm mb-1">Diet Prescriptions</h3>
              <p class="text-xs text-gray-500 mb-3">Manage patient diet prescriptions and medical nutrition order</p>
              <span class="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded-md">
                <Clock :size="10" class="mr-1" />
                {{ activePrescriptions }} pending
              </span>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>

import { computed } from 'vue';
import { useDataStore } from '@/stores/dataStore';
import { useAuthStore } from '@/stores/authStore';
import {
  Users,
  Clock,
  Sparkles,
  CheckCircle,
  TrendingUp,
  FileText } from
'lucide-vue-next';

const dataStore = useDataStore();
const authStore = useAuthStore();

const myPatients = computed(() => {
  const currentDoc = authStore.currentUser?.name || 'Dr. Santos';
  return dataStore.patients.filter((p) => p.status === 'Active' && p.physician === currentDoc).length;
});

const pendingPatients = computed(() => {
  const currentDoc = authStore.currentUser?.name || 'Dr. Santos';
  // Patients who are active, assigned to this doctor, and don't have an active prescription
  return dataStore.patients.filter((p) => {
    if (p.status !== 'Active') return false;
    if (p.physician !== currentDoc) return false;

    const hasActivePrescription = dataStore.prescriptions.some(
      (rx) => rx.patientId === p.id && rx.status === 'Active'
    );
    return !hasActivePrescription;
  });
});

const activePrescriptions = computed(() => {
  return pendingPatients.value.length;
});

const prescribedPatients = computed(() => {
  return myPatients.value - activePrescriptions.value;
});

const recentPatients = computed(() => {
  const currentDoc = authStore.currentUser?.name || 'Dr. Santos';
  return dataStore.patients.
  filter((p) => p.status === 'Active' && p.physician === currentDoc).
  sort((a, b) => new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime()).
  slice(0, 3);
});

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}
</script>
