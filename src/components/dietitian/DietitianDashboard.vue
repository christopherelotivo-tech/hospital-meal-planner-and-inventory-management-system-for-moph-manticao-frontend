<template>
  <div class="space-y-6 w-full max-w-full overflow-x-hidden pb-8">
    
    <!-- Zone 1: Top Context Header -->
    <div class="w-full rounded-2xl shadow-sm px-6 py-8 flex justify-between items-center text-white mb-6 bg-gradient-to-r from-emerald-600 to-teal-500">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">Welcome back, Dietitian!</h2>
        <p class="text-emerald-50 text-sm mt-1">Menu Cycle: Week 2</p>
      </div>
      <div class="text-right hidden sm:block">
        <p class="font-medium">{{ currentDate }}</p>
      </div>
    </div>

    <!-- Zone 2: KPI & Census Metric Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      
      <!-- Card 1: Active Meal Census & Budget Controller -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col justify-center border-l-4 border-l-emerald-500">
        <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Active Meal Census</p>
        <h3 class="text-3xl font-bold text-slate-800 mb-2">{{ activePatients }} <span class="text-lg text-slate-500 font-medium">Active Meals</span></h3>
        <div class="bg-emerald-100 text-emerald-800 rounded-md px-2 py-1 text-xs font-bold self-start mt-auto">
          Daily Budget Pool: ₱{{ (activePatients * 150).toLocaleString() }}
        </div>
      </div>

      <!-- Card 2: Active Prescriptions -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col justify-center">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Active Prescriptions</p>
            <h3 class="text-3xl font-bold text-slate-800">{{ activePrescriptions }}</h3>
          </div>
          <div class="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <ClipboardList :size="24" />
          </div>
        </div>
      </div>

      <!-- Card 3: Today's Meal Plans -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col justify-center">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Today's Meal Plans</p>
            <h3 class="text-3xl font-bold text-slate-800">{{ todayMealPlans }}</h3>
          </div>
          <div class="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CalendarDays :size="24" />
          </div>
        </div>
      </div>

      <!-- Card 4: Special Diet Patients -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col justify-center">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Special Diets</p>
            <h3 class="text-3xl font-bold text-slate-800">{{ specialDiets }}</h3>
          </div>
          <div class="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <AlertTriangle :size="24" />
          </div>
        </div>
      </div>

    </div>

    <!-- Zone 3: Quick Actions Row -->
    <div class="flex flex-wrap gap-4 mt-6">
      <button @click="$emit('navigate', 'prescriptions')" class="px-5 py-2.5 rounded-lg text-white font-medium shadow-sm hover:shadow-md transition-all active:scale-95 bg-emerald-600 hover:bg-emerald-700 flex items-center space-x-2">
        <ClipboardList :size="18" />
        <span>View Prescriptions</span>
      </button>
      <button @click="$emit('navigate', 'meals')" class="px-5 py-2.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all active:scale-95 bg-white border border-emerald-600 text-emerald-700 hover:bg-emerald-50 flex items-center space-x-2">
        <Utensils :size="18" />
        <span>Assign Meals</span>
      </button>
      <button @click="$emit('navigate', 'history')" class="px-5 py-2.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all active:scale-95 bg-white border border-emerald-600 text-emerald-700 hover:bg-emerald-50 flex items-center space-x-2">
        <History :size="18" />
        <span>Service History</span>
      </button>
    </div>

    <!-- Zone 4: Primary Content Grid Workspace -->
    <div class="mt-6 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <h3 class="font-bold text-slate-800">Recent Diet Prescriptions</h3>
        <button class="text-emerald-600 text-sm font-medium hover:underline">View All</button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-white border-b border-slate-100 text-sm text-slate-500">
              <th class="py-3 px-5 font-semibold">Date</th>
              <th class="py-3 px-5 font-semibold">Patient</th>
              <th class="py-3 px-5 font-semibold">Diet Type & Restrictions</th>
              <th class="py-3 px-5 font-semibold">Prescribing Doctor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="prescription in recentPrescriptions" :key="prescription.id" class="border-b border-slate-50 hover:bg-slate-50 transition-colors">
              <td class="py-3 px-5 text-sm text-slate-500 whitespace-nowrap">{{ formatDate(prescription.createdAt) }}</td>
              <td class="py-3 px-5 text-sm font-medium text-slate-800">{{ prescription.patientName }}</td>
              <td class="py-3 px-5 text-sm text-slate-600">
                <span class="font-semibold">{{ prescription.dietType }}</span>
                <div v-if="prescription.allergies.length > 0" class="flex flex-wrap gap-1 mt-1">
                  <span v-for="allergy in prescription.allergies" :key="allergy" class="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {{ allergy }}
                  </span>
                </div>
              </td>
              <td class="py-3 px-5 text-sm text-slate-500">Dr. {{ prescription.doctorName.split(' ').pop() }}</td>
            </tr>
            <tr v-if="recentPrescriptions.length === 0">
              <td colspan="4" class="py-8 text-center text-sm text-slate-400">No recent prescriptions</td>
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
  ClipboardList,
  CalendarDays,
  Users,
  AlertTriangle,
  Utensils,
  History,
  FileText } from 'lucide-vue-next';

const dataStore = useDataStore();
const currentDate = ref(new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

const activePrescriptions = computed(() => {
  return dataStore.prescriptions.filter((p) => p.status === 'Active').length;
});

const todayMealPlans = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return dataStore.mealAssignments.filter((m) => m.date === today).length;
});

const activePatients = computed(() => {
  return dataStore.patients.filter((p) => p.status === 'Active').length;
});

const specialDiets = computed(() => {
  const specialDietTypes = ['Diabetic Diet', 'Renal Diet', 'Cardiac Diet', 'Liquid Diet'];
  return dataStore.prescriptions.filter((p) =>
  p.status === 'Active' && specialDietTypes.includes(p.dietType)
  ).length;
});

const newPrescriptions = computed(() => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dataStore.prescriptions.filter((p) =>
  new Date(p.createdAt) > yesterday
  ).length;
});

const recentPrescriptions = computed(() => {
  return [...dataStore.prescriptions].
  sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).
  slice(0, 3);
});

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
</script>
