<template>
  <div class="space-y-6 w-full max-w-full overflow-x-hidden pb-8">
    <!-- Greeting Banner -->
    <div class="bg-[#00b37e] rounded-xl p-6 md:p-8 text-white relative overflow-hidden shadow-sm">
      <div class="flex items-center space-x-2 mb-2 relative z-10">
        <Sparkles class="text-yellow-300 w-5 h-5 md:w-6 md:h-6" />
        <h2 class="text-2xl md:text-3xl font-semibold tracking-tight">Good afternoon, Admin Santos!</h2>
      </div>
      <p class="text-teal-50 mb-5 md:mb-6 text-sm relative z-10">Building better healthcare, one admission at a time</p>
      <div class="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-8 text-sm font-medium relative z-10">
        <div class="flex items-center space-x-2">
          <Users :size="16" />
          <span>{{ activePatients }} Active Admissions</span>
        </div>
        <div class="flex items-center space-x-2">
          <Clock :size="16" />
          <span>{{ pendingDischarges }} Pending Discharges</span>
        </div>
        <div class="flex items-center space-x-2">
          <TrendingUp :size="16" />
          <span>{{ newAdmissionsToday }} New Today</span>
        </div>
      </div>
      <!-- Background subtle gradient/shape if needed, but solid color is fine -->
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center justify-between border-l-4 border-l-[#00b37e]">
        <div>
          <p class="text-xs text-gray-500 mb-1 font-medium">Active Admissions</p>
          <h3 class="text-2xl font-bold text-gray-800">{{ activePatients }}</h3>
        </div>
        <div class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-[#00b37e]">
          <Users :size="20" />
        </div>
      </div>

      <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center justify-between border-l-4 border-l-yellow-400">
        <div>
          <p class="text-xs text-gray-500 mb-1 font-medium">Pending Discharges</p>
          <h3 class="text-2xl font-bold text-gray-800">{{ pendingDischarges }}</h3>
        </div>
        <div class="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-500">
          <Clock :size="20" />
        </div>
      </div>

      <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center justify-between border-l-4 border-l-teal-400">
        <div>
          <p class="text-xs text-gray-500 mb-1 font-medium">Total Patients Today</p>
          <h3 class="text-2xl font-bold text-gray-800">{{ totalPatients }}</h3>
        </div>
        <div class="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-500">
          <ClipboardList :size="20" />
        </div>
      </div>

      <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center justify-between border-l-4 border-l-blue-400">
        <div>
          <p class="text-xs text-gray-500 mb-1 font-medium">New Admissions Today</p>
          <h3 class="text-2xl font-bold text-gray-800">{{ newAdmissionsToday }}</h3>
        </div>
        <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
          <TrendingUp :size="20" />
        </div>
      </div>
    </div>

    <!-- Recent Activity Log -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 overflow-hidden">
      <div class="flex items-center justify-between mb-4 md:mb-6">
        <div class="flex items-center space-x-2">
          <Activity :size="20" class="text-[#00b37e]" />
          <h2 class="text-md font-bold text-gray-800">Recent Activity Log</h2>
        </div>
        <button class="text-blue-500 hover:text-blue-600 text-xs font-semibold whitespace-nowrap">View All</button>
      </div>

      <div class="space-y-0 overflow-x-auto">
        <div class="flex items-center justify-between py-4 border-b border-gray-50 last:border-0 min-w-[320px]" v-for="(log, idx) in activityLogs" :key="idx">
          <div class="flex items-center space-x-3 md:space-x-4">
            <div :class="`w-8 h-8 md:w-10 md:h-10 rounded-full flex shrink-0 items-center justify-center ${log.type === 'admission' ? 'bg-green-50 text-[#00b37e]' : 'bg-red-50 text-red-500'}`">
              <component :is="log.type === 'admission' ? UserPlus : LogOut" class="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div>
              <h4 class="font-semibold text-gray-800 text-sm">{{ log.name }}</h4>
              <p class="text-xs text-gray-500 mt-0.5">{{ log.action }}</p>
            </div>
          </div>
          <div class="text-right text-[10px] md:text-xs text-gray-400 font-medium ml-4 shrink-0">
            {{ formatLogTime(log.time) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Section: Quick Actions & System Summary -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <!-- Quick Actions -->
      <div class="bg-[#f0fbf7] rounded-xl shadow-sm border border-[#d1f0e4] p-5 md:p-6">
        <h2 class="text-sm font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div class="space-y-3">
          <button
            @click="$emit('navigate', 'register')"
            class="w-full bg-[#008a61] hover:bg-[#00704e] text-white p-3 md:p-3.5 rounded-lg font-medium transition-colors flex items-center justify-start space-x-3 text-sm shadow-sm"
          >
            <UserPlus :size="18" />
            <span>Admit New Patient</span>
          </button>
          
          <button
            @click="$emit('navigate', 'patients')"
            class="w-full bg-white border border-[#00b37e] text-[#00b37e] hover:bg-gray-50 p-3 md:p-3.5 rounded-lg font-medium transition-colors flex items-center justify-start space-x-3 text-sm"
          >
            <Users :size="18" />
            <span>View All Patients</span>
          </button>
        </div>
      </div>

      <!-- System Summary -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6">
        <h2 class="text-sm font-bold text-gray-800 mb-4">System Summary</h2>
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 md:p-3.5 bg-green-50/50 rounded-lg">
            <span class="text-sm font-medium text-gray-600">Currently Admitted</span>
            <span class="text-sm font-bold text-[#00b37e]">{{ activePatients }} patients</span>
          </div>
          <div class="flex items-center justify-between p-3 md:p-3.5 bg-yellow-50/50 rounded-lg">
            <span class="text-sm font-medium text-gray-600">Awaiting Discharge</span>
            <span class="text-sm font-bold text-yellow-600">{{ pendingDischarges }} patients</span>
          </div>
          <div class="flex items-center justify-between p-3 md:p-3.5 bg-blue-50/50 rounded-lg">
            <span class="text-sm font-medium text-gray-600">New Today</span>
            <span class="text-sm font-bold text-blue-500">{{ newAdmissionsToday }} admissions</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { computed } from 'vue';
import { useDataStore } from '@/stores/dataStore';
import {
  Users,
  UserPlus,
  Clock,
  TrendingUp,
  ClipboardList,
  Activity,
  LogOut,
  Sparkles } from
'lucide-vue-next';

const dataStore = useDataStore();

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

