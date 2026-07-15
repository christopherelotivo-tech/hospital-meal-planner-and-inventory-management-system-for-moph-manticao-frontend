<template>
  <div class="space-y-6 w-full max-w-full overflow-x-hidden pb-8">
    
    <!-- Zone 1: Top Context Header -->
    <div class="w-full rounded-2xl shadow-sm px-6 py-8 flex justify-between items-center text-white mb-6 bg-gradient-to-r from-blue-600 to-blue-500">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">Welcome, {{ authStore.currentUser?.name || 'Dr. Santos' }}!</h2>
        <p class="text-blue-50 text-sm mt-1">Global Status: Active</p>
      </div>
      <div class="text-right hidden sm:block">
        <p class="font-medium">{{ currentDate }}</p>
      </div>
    </div>

    <!-- Zone 2: KPI & Census Metric Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      
      <!-- Card 1: Pending Action Alert -->
      <div class="bg-amber-50 rounded-xl shadow-sm border border-amber-200 p-5 flex flex-col justify-center">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm font-semibold text-amber-700 uppercase tracking-wider flex items-center space-x-2">
            <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Pending Action Alert</span>
          </p>
          <div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <AlertCircle :size="20" />
          </div>
        </div>
        <h3 class="text-2xl font-bold text-amber-900 mb-1">{{ activePrescriptions }}</h3>
        <p class="text-sm text-amber-800">Patients Awaiting Diet Orders</p>
      </div>

      <!-- Card 2: Total Assigned Patients -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col justify-center">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Assigned Patients</p>
            <h3 class="text-3xl font-bold text-slate-800">{{ myPatients }}</h3>
          </div>
          <div class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <Users :size="24" />
          </div>
        </div>
      </div>

      <!-- Card 3: Prescribed Patients -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col justify-center">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Prescribed Patients</p>
            <h3 class="text-3xl font-bold text-slate-800">{{ prescribedPatients }}</h3>
          </div>
          <div class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <CheckCircle :size="24" />
          </div>
        </div>
      </div>

    </div>

    <!-- Zone 3: Quick Actions Row -->
    <div class="flex flex-wrap gap-4 mt-6">
      <button @click="$emit('navigate', 'patients')" class="px-5 py-2.5 rounded-lg text-white font-medium shadow-sm hover:shadow-md transition-all active:scale-95 bg-blue-600 hover:bg-blue-700 flex items-center space-x-2">
        <FileText :size="18" />
        <span>Issue New Prescription</span>
      </button>
      <button class="px-5 py-2.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all active:scale-95 bg-white border border-blue-600 text-blue-700 hover:bg-blue-50 flex items-center space-x-2">
        <Search :size="18" />
        <span>Search Patient Directory</span>
      </button>
    </div>

    <!-- Zone 4: Primary Content Grid Workspace -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      
      <!-- Left Column: Recently Added Patients -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
        <h3 class="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Recently Added Patients</h3>
        <div class="space-y-4 flex-1">
          <div v-for="patient in recentPatients" :key="patient.id" class="flex items-center justify-between">
            <div>
              <h4 class="font-bold text-slate-800 text-sm">{{ patient.name }}</h4>
              <p class="text-xs text-slate-500 mt-0.5">Room {{ patient.room }} - {{ patient.condition }}</p>
            </div>
            <button @click="$emit('navigate', 'patients')" class="text-blue-600 text-xs font-semibold hover:underline bg-blue-50 px-3 py-1.5 rounded-md">
              + Prescription
            </button>
          </div>
          <div v-if="recentPatients.length === 0" class="text-sm text-slate-500 text-center py-4">
            No recently added patients
          </div>
        </div>
      </div>

      <!-- Right Column: Pending Prescriptions -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
        <h3 class="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3 flex items-center">
          <Clock :size="18" class="text-amber-500 mr-2" />
          Pending Prescriptions
        </h3>
        <div class="space-y-3 flex-1">
          <div v-for="patient in pendingPatients" :key="patient.id" class="p-4 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between">
            <div>
              <h4 class="font-bold text-slate-800 text-sm">{{ patient.name }}</h4>
              <p class="text-xs text-slate-500 mt-0.5">Room {{ patient.room }} - {{ patient.condition }}</p>
            </div>
            <div class="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded">
              Needs Order
            </div>
          </div>
          <div v-if="pendingPatients.length === 0" class="text-sm text-slate-500 text-center py-4">
            All caught up! No pending prescriptions.
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useDataStore } from '@/stores/dataStore';
import { useAuthStore } from '@/stores/authStore';
import {
  Users,
  Clock,
  Sparkles,
  CheckCircle,
  TrendingUp,
  FileText,
  AlertCircle,
  Search } from 'lucide-vue-next';

const dataStore = useDataStore();
const authStore = useAuthStore();
const currentDate = ref(new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

const myPatients = computed(() => {
  const currentDoc = authStore.currentUser?.name || 'Dr. Santos';
  return dataStore.patients.filter((p) => p.status === 'Active' && p.physician === currentDoc).length;
});

const pendingPatients = computed(() => {
  const currentDoc = authStore.currentUser?.name || 'Dr. Santos';
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
