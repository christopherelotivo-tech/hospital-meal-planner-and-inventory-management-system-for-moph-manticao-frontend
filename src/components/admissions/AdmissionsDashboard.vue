<template>
  <div class="space-y-6 w-full max-w-full overflow-x-hidden pb-8">
    
    <!-- Zone 1: Top Context Header -->
    <div class="w-full rounded-2xl shadow-sm px-6 py-8 flex justify-between items-center text-white mb-6 bg-gradient-to-r from-green-600 to-green-500">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">Good morning, Admissions!</h2>
        <p class="text-green-50 text-sm mt-1">System Status: Online</p>
      </div>
      <div class="text-right hidden sm:block">
        <p class="font-medium">{{ currentDate }}</p>
      </div>
    </div>

    <!-- Zone 2: KPI & Census Metric Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      
      <!-- Card 1: Logistical Occupancy Census -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col justify-center border-l-4 border-l-green-500">
        <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Logistical Occupancy Census</p>
        <h3 class="text-2xl font-bold text-slate-800 mb-3">{{ activePatients }} / 100 Beds Occupied</h3>
        <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div class="bg-green-500 h-full rounded-full transition-all duration-500" :style="`width: ${(activePatients/100)*100}%`"></div>
        </div>
      </div>

      <!-- Card 2: Pending Discharges -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col justify-center">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Pending Discharges</p>
            <h3 class="text-3xl font-bold text-slate-800">{{ pendingDischarges }}</h3>
          </div>
          <div class="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <Clock :size="24" />
          </div>
        </div>
      </div>

      <!-- Card 3: Total Patients Today -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col justify-center">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Patients Today</p>
            <h3 class="text-3xl font-bold text-slate-800">{{ totalPatients }}</h3>
          </div>
          <div class="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <ClipboardList :size="24" />
          </div>
        </div>
      </div>

      <!-- Card 4: New Admissions Today -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col justify-center">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">New Admissions</p>
            <h3 class="text-3xl font-bold text-slate-800">{{ newAdmissionsToday }}</h3>
          </div>
          <div class="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <TrendingUp :size="24" />
          </div>
        </div>
      </div>

    </div>

    <!-- Zone 3: Quick Actions Row -->
    <div class="flex flex-wrap gap-4 mt-6">
      <button @click="$emit('navigate', 'register')" class="px-5 py-2.5 rounded-lg text-white font-medium shadow-sm hover:shadow-md transition-all active:scale-95 bg-green-600 hover:bg-green-700 flex items-center space-x-2">
        <UserPlus :size="18" />
        <span>Admit New Patient</span>
      </button>
      <button class="px-5 py-2.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all active:scale-95 bg-white border border-green-600 text-green-700 hover:bg-green-50 flex items-center space-x-2">
        <Clock :size="18" />
        <span>Process Discharge</span>
      </button>
      <button class="px-5 py-2.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all active:scale-95 bg-white border border-green-600 text-green-700 hover:bg-green-50 flex items-center space-x-2">
        <FileText :size="18" />
        <span>Generate Census Report</span>
      </button>
    </div>

    <!-- Zone 4: Primary Content Grid Workspace -->
    <div class="mt-6 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <h3 class="font-bold text-slate-800">Recent Activity Log</h3>
        <button class="text-green-600 text-sm font-medium hover:underline">View All</button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-white border-b border-slate-100 text-sm text-slate-500">
              <th class="py-3 px-5 font-semibold">Time</th>
              <th class="py-3 px-5 font-semibold">Patient Name</th>
              <th class="py-3 px-5 font-semibold">Action</th>
              <th class="py-3 px-5 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(log, idx) in activityLogs" :key="idx" class="border-b border-slate-50 hover:bg-slate-50 transition-colors">
              <td class="py-3 px-5 text-sm text-slate-500 whitespace-nowrap">{{ formatLogTime(log.time) }}</td>
              <td class="py-3 px-5 text-sm font-medium text-slate-800">{{ log.name }}</td>
              <td class="py-3 px-5 text-sm text-slate-600">{{ log.action }}</td>
              <td class="py-3 px-5 text-sm">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" :class="log.type === 'admission' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'">
                  {{ log.type === 'admission' ? 'Admitted' : 'Discharged' }}
                </span>
              </td>
            </tr>
            <tr v-if="!activityLogs || activityLogs.length === 0">
              <td colspan="4" class="py-8 text-center text-sm text-slate-400">No recent activity</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useDataStore } from '@/stores/dataStore';
import {
  Users,
  UserPlus,
  Clock,
  TrendingUp,
  ClipboardList,
  Activity,
  LogOut,
  Sparkles,
  FileText } from 'lucide-vue-next';

const dataStore = useDataStore();
const currentDate = ref(new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

const activePatients = computed(() => {
  return dataStore.patients.filter((p) => p.status === 'Active').length;
});

const totalPatients = computed(() => {
  return dataStore.patients.length;
});

const pendingDischarges = computed(() => {
  return dataStore.patients.filter((p) => p.status === 'Pending').length;
});

const newAdmissionsToday = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return dataStore.patients.filter((p) => p.admissionDate === today).length;
});

const activityLogs = computed(() => {
  return dataStore.activityLogs.slice(0, 5); // Show top 5 recent
});

function formatLogTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}
</script>
