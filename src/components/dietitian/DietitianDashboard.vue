<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card-elegant p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <ClipboardList :size="24" class="text-purple-600" />
          </div>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-1">{{ activePrescriptions }}</h3>
        <p class="text-gray-600">Active Prescriptions</p>
      </div>

      <div class="card-elegant p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <CalendarDays :size="24" class="text-blue-600" />
          </div>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-1">{{ todayMealPlans }}</h3>
        <p class="text-gray-600">Today's Meal Plans</p>
      </div>

      <div class="card-elegant p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Users :size="24" class="text-green-600" />
          </div>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-1">{{ activePatients }}</h3>
        <p class="text-gray-600">Active Patients</p>
      </div>

      <div class="card-elegant p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <AlertTriangle :size="24" class="text-yellow-600" />
          </div>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-1">{{ specialDiets }}</h3>
        <p class="text-gray-600">Special Diet Patients</p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card-elegant p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          @click="$emit('navigate', 'prescriptions')"
          class="btn-gradient-green text-white p-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-3"
        >
          <ClipboardList :size="20" />
          <span>View Prescriptions</span>
        </button>

        <button
          @click="$emit('navigate', 'meals')"
          class="bg-purple-600 text-white p-4 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg"
        >
          <Utensils :size="20" />
          <span>Assign Meals</span>
        </button>

        <button
          @click="$emit('navigate', 'history')"
          class="bg-white border-2 border-purple-600 text-purple-600 p-4 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-300 flex items-center justify-center space-x-3"
        >
          <History :size="20" />
          <span>Service History</span>
        </button>
      </div>
    </div>

    <!-- Pending Prescriptions Alert -->
    <div v-if="newPrescriptions > 0" class="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
      <div class="flex items-center space-x-3">
        <AlertTriangle :size="24" class="text-yellow-600" />
        <div>
          <h3 class="font-bold text-gray-900">{{ newPrescriptions }} New Diet Prescription{{ newPrescriptions > 1 ? 's' : '' }}</h3>
          <p class="text-sm text-gray-700">New diet orders are waiting for meal planning</p>
        </div>
      </div>
    </div>

    <!-- Recent Prescriptions -->
    <div class="card-elegant p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-gray-900">Recent Diet Prescriptions</h2>
        <button class="text-purple-600 hover:text-purple-700 text-sm font-semibold">View All</button>
      </div>

      <div class="space-y-3">
        <div
          v-for="prescription in recentPrescriptions"
          :key="prescription.id"
          class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <FileText :size="24" class="text-purple-600" />
            </div>
            <div>
              <h4 class="font-semibold text-gray-900">{{ prescription.patientName }}</h4>
              <p class="text-sm text-gray-600">{{ prescription.dietType }}</p>
              <div v-if="prescription.allergies.length > 0" class="flex flex-wrap gap-1 mt-1">
                <span
                  v-for="allergy in prescription.allergies"
                  :key="allergy"
                  class="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs"
                >
                  {{ allergy }}
                </span>
              </div>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm font-semibold text-gray-900">{{ formatDate(prescription.createdAt) }}</p>
            <p class="text-xs text-gray-500">Dr. {{ prescription.doctorName.split(' ').pop() }}</p>
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
  ClipboardList,
  CalendarDays,
  Users,
  AlertTriangle,
  Utensils,
  History,
  FileText } from
'lucide-vue-next';

const dataStore = useDataStore();

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
  // Mock: count prescriptions created in last 24 hours
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
