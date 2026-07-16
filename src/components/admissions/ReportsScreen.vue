<template>
  <div class="space-y-6 w-full max-w-full overflow-x-hidden pb-8">

    <!-- Header -->
    <div class="w-full rounded-2xl shadow-sm px-6 py-8 flex flex-wrap justify-between items-center gap-4 text-white bg-gradient-to-r from-[#007a5e] to-[#00c49a]">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">Hospital Reports</h2>
        <p class="text-green-100 text-sm mt-1">Patient census, dietary compliance, and activity overview</p>
      </div>
      <button @click="printReport" class="flex items-center space-x-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold text-sm transition-all border border-white/30">
        <Printer :size="16" />
        <span>Print Report</span>
      </button>
    </div>

    <!-- Patient Census Cards -->
    <div>
      <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Patient Census</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 border-l-4 border-l-[#00a67e]">
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Active</p>
          <h3 class="text-3xl font-bold text-[#00a67e]">{{ activePatients }}</h3>
          <p class="text-xs text-slate-400 mt-1">Currently admitted</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 border-l-4 border-l-amber-400">
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Pending</p>
          <h3 class="text-3xl font-bold text-amber-500">{{ pendingPatients }}</h3>
          <p class="text-xs text-slate-400 mt-1">Pending discharge</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 border-l-4 border-l-slate-400">
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Discharged</p>
          <h3 class="text-3xl font-bold text-slate-500">{{ dischargedPatients }}</h3>
          <p class="text-xs text-slate-400 mt-1">Total discharged</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 border-l-4 border-l-blue-400">
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Records</p>
          <h3 class="text-3xl font-bold text-blue-500">{{ totalPatients }}</h3>
          <p class="text-xs text-slate-400 mt-1">All time patients</p>
        </div>
      </div>
    </div>

    <!-- Diet Compliance + User Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <!-- Diet Compliance -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 class="font-bold text-slate-800 mb-4 flex items-center space-x-2">
          <ClipboardList :size="18" class="text-[#00a67e]" />
          <span>Dietary Compliance</span>
        </h3>
        <div class="space-y-4">
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="text-slate-600 font-medium">With Active Prescription</span>
              <span class="font-bold text-[#00a67e]">{{ withPrescription }} patients</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2.5">
              <div class="bg-[#00a67e] h-2.5 rounded-full transition-all duration-500" :style="{ width: prescriptionRate + '%' }"></div>
            </div>
            <p class="text-xs text-slate-400 mt-1">{{ prescriptionRate }}% of active patients</p>
          </div>
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="text-slate-600 font-medium">With Meal Assignment Today</span>
              <span class="font-bold text-blue-600">{{ withMealToday }} patients</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2.5">
              <div class="bg-blue-500 h-2.5 rounded-full transition-all duration-500" :style="{ width: mealRate + '%' }"></div>
            </div>
            <p class="text-xs text-slate-400 mt-1">{{ mealRate }}% of active patients</p>
          </div>
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="text-slate-600 font-medium">No Prescription Yet</span>
              <span class="font-bold text-red-500">{{ withoutPrescription }} patients</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2.5">
              <div class="bg-red-400 h-2.5 rounded-full transition-all duration-500" :style="{ width: (100 - prescriptionRate) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- User Summary -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 class="font-bold text-slate-800 mb-4 flex items-center space-x-2">
          <Users :size="18" class="text-[#00a67e]" />
          <span>Staff Accounts</span>
        </h3>
        <div class="space-y-3">
          <div v-for="role in roleBreakdown" :key="role.name" class="flex items-center justify-between p-3 rounded-lg bg-slate-50">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" :style="{ background: role.color }">
                {{ role.name.charAt(0) }}
              </div>
              <span class="text-sm font-medium text-slate-700">{{ role.name }}</span>
            </div>
            <span class="text-sm font-bold text-slate-800 bg-white border border-slate-200 px-3 py-1 rounded-full">{{ role.count }}</span>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-slate-100 flex justify-between">
          <span class="text-sm font-bold text-slate-600">Total Staff</span>
          <span class="text-sm font-bold text-[#00a67e]">{{ totalUsers }}</span>
        </div>
      </div>
    </div>

    <!-- Activity Log -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <h3 class="font-bold text-slate-800 flex items-center space-x-2">
          <ActivityIcon :size="18" class="text-[#00a67e]" />
          <span>Recent Activity Log</span>
        </h3>
        <span class="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">{{ activityLogs.length }} entries</span>
      </div>
      <div class="divide-y divide-slate-50 max-h-80 overflow-y-auto">
        <div v-for="log in activityLogs.slice(0, 20)" :key="log.id" class="flex items-center space-x-4 px-5 py-3 hover:bg-slate-50 transition-colors">
          <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0" :class="log.type === 'admission' ? 'bg-green-100 text-green-600' : log.type === 'discharge' ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-blue-600'">
            <UserCheck v-if="log.type === 'admission'" :size="14" />
            <LogOut v-else-if="log.type === 'discharge'" :size="14" />
            <RefreshCw v-else :size="14" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-slate-800 truncate">{{ log.name }}</p>
            <p class="text-xs text-slate-500">{{ log.action }}</p>
          </div>
          <p class="text-xs text-slate-400 shrink-0">{{ formatTime(log.time) }}</p>
        </div>
        <div v-if="activityLogs.length === 0" class="py-8 text-center text-sm text-slate-400">No activity recorded yet.</div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useDataStore } from '@/stores/dataStore';
import { Printer, ClipboardList, Users, UserCheck, LogOut, RefreshCw } from 'lucide-vue-next';
import { Activity as ActivityIcon } from 'lucide-vue-next';

const dataStore = useDataStore();

const totalPatients = computed(() => dataStore.patients.length);
const activePatients = computed(() => dataStore.patients.filter(function(p) { return p.status === 'Active'; }).length);
const pendingPatients = computed(() => dataStore.patients.filter(function(p) { return p.status === 'Pending'; }).length);
const dischargedPatients = computed(() => dataStore.patients.filter(function(p) { return p.status === 'Discharged'; }).length);

const activePatientsIds = computed(() => dataStore.patients.filter(function(p) { return p.status === 'Active'; }).map(function(p) { return p.id; }));

const withPrescription = computed(() => {
  const ids = new Set(dataStore.prescriptions.filter(function(rx) { return rx.status === 'Active'; }).map(function(rx) { return rx.patientId; }));
  return activePatientsIds.value.filter(function(id) { return ids.has(id); }).length;
});

const withoutPrescription = computed(() => activePatients.value - withPrescription.value);

const prescriptionRate = computed(() => activePatients.value === 0 ? 0 : Math.round((withPrescription.value / activePatients.value) * 100));

const withMealToday = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  const ids = new Set(dataStore.mealAssignments.filter(function(m) { return m.date === today; }).map(function(m) { return m.patientId; }));
  return activePatientsIds.value.filter(function(id) { return ids.has(id); }).length;
});

const mealRate = computed(() => activePatients.value === 0 ? 0 : Math.round((withMealToday.value / activePatients.value) * 100));

const totalUsers = computed(() => dataStore.users.length);

const roleBreakdown = computed(() => {
  const roles = ['Doctor', 'Dietitian', 'Purchasing Officer', 'Kitchen Staff', 'Food Server'];
  const colors = ['#3b82f6', '#8b5cf6', '#4f46e5', '#ef4444', '#f59e0b'];
  return roles.map(function(role, i) {
    return {
      name: role,
      count: dataStore.users.filter(function(u) { return u.role === role; }).length,
      color: colors[i]
    };
  });
});

const activityLogs = computed(() => dataStore.activityLogs || []);

function formatTime(timeStr) {
  if (!timeStr) return '';
  const d = new Date(timeStr);
  return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });
}

function printReport() {
  window.print();
}
</script>
