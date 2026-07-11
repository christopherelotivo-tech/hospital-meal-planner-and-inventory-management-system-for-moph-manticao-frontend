<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center space-x-4 mb-2">
      <div class="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
        <History :size="24" />
      </div>
      <div>
        <h1 class="text-2xl font-bold text-gray-800 tracking-tight">Meal Service History</h1>
        <p class="text-sm text-gray-500">Track meals served by food servers with timestamps and verification</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div class="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div class="flex items-center space-x-2 mb-1">
          <Utensils :size="14" class="text-blue-600" />
          <span class="text-xs font-semibold text-blue-600 uppercase tracking-wide">Total Served</span>
        </div>
        <p class="text-3xl font-bold text-gray-900">{{ totalServed }}</p>
      </div>

      <div class="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div class="flex items-center space-x-2 mb-1">
          <TrendingUp :size="14" class="text-purple-600" />
          <span class="text-xs font-semibold text-purple-600 uppercase tracking-wide">Today</span>
        </div>
        <p class="text-3xl font-bold text-gray-900">{{ todayCount }}</p>
      </div>

      <div class="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div class="flex items-center space-x-2 mb-1">
          <CheckCircle2 :size="14" class="text-green-600" />
          <span class="text-xs font-semibold text-green-600 uppercase tracking-wide">Perfect Match</span>
        </div>
        <p class="text-3xl font-bold text-gray-900">{{ perfectMatchCount }}</p>
      </div>

      <div class="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div class="flex items-center space-x-2 mb-1">
          <AlertCircle :size="14" class="text-yellow-600" />
          <span class="text-xs font-semibold text-yellow-600 uppercase tracking-wide">Partial</span>
        </div>
        <p class="text-3xl font-bold text-gray-900">{{ partialCount }}</p>
      </div>

      <div class="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div class="flex items-center space-x-2 mb-1">
          <XCircle :size="14" class="text-red-500" />
          <span class="text-xs font-semibold text-red-500 uppercase tracking-wide">Mismatch</span>
        </div>
        <p class="text-3xl font-bold text-gray-900">{{ mismatchCount }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <div class="flex items-center space-x-2 mb-4">
        <Filter :size="16" class="text-gray-500" />
        <span class="text-sm font-bold text-gray-700">Filters</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-1.5">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search :size="14" class="text-gray-400" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Patient, room, meal..."
              class="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none text-sm transition-all"
            />
          </div>
        </div>

        <!-- Date Range -->
        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-1.5">Date Range</label>
          <select v-model="dateRange" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none text-sm bg-white">
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
            <option value="custom">Custom Date</option>
          </select>
          <input v-if="dateRange === 'custom'" v-model="customDate" type="date" class="mt-2 w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-600 outline-none text-sm" />
        </div>

        <!-- Match Status -->
        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-1.5">Match Status</label>
          <select v-model="matchStatusFilter" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none text-sm bg-white">
            <option value="">All Status</option>
            <option value="perfect">Perfect Match</option>
            <option value="partial">Partial</option>
            <option value="mismatch">Mismatch</option>
            <option value="unverified">Not Yet Verified</option>
          </select>
        </div>

        <!-- Meal Type -->
        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-1.5">Meal Type</label>
          <select v-model="mealTypeFilter" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none text-sm bg-white">
            <option value="">All Meals</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
        </div>
      </div>
    </div>

    <!-- History Table -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-700 uppercase tracking-wide">
              <th class="px-6 py-3">Date</th>
              <th class="px-6 py-3">Patient</th>
              <th class="px-6 py-3">🌅 Breakfast</th>
              <th class="px-6 py-3">☀️ Lunch</th>
              <th class="px-6 py-3">🌙 Dinner</th>
              <th class="px-6 py-3">Match Status</th>
              <th class="px-6 py-3">Total Cost</th>
              <th class="px-6 py-3">Assigned By</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="item in filteredAssignments" :key="item.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{{ formatDate(item.date) }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center space-x-2.5">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xs shrink-0">
                    {{ item.patientName[0] }}
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900 text-sm">{{ item.patientName }}</p>
                    <p class="text-xs text-gray-400">{{ getPatientRoom(item.patientId) }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div v-if="item.breakfast && (!mealTypeFilter || mealTypeFilter === 'breakfast')">
                  <p class="text-sm font-medium text-gray-800">{{ item.breakfast }}</p>
                  <p class="text-xs text-gray-400">₱{{ item.breakfastCost.toFixed(2) }}</p>
                </div>
                <span v-else class="text-xs text-gray-400 italic">N/A</span>
              </td>
              <td class="px-6 py-4">
                <div v-if="item.lunch && (!mealTypeFilter || mealTypeFilter === 'lunch')">
                  <p class="text-sm font-medium text-gray-800">{{ item.lunch }}</p>
                  <p class="text-xs text-gray-400">₱{{ item.lunchCost.toFixed(2) }}</p>
                </div>
                <span v-else class="text-xs text-gray-400 italic">N/A</span>
              </td>
              <td class="px-6 py-4">
                <div v-if="item.dinner && (!mealTypeFilter || mealTypeFilter === 'dinner')">
                  <p class="text-sm font-medium text-gray-800">{{ item.dinner }}</p>
                  <p class="text-xs text-gray-400">₱{{ item.dinnerCost.toFixed(2) }}</p>
                </div>
                <span v-else class="text-xs text-gray-400 italic">N/A</span>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold" :class="getMatchBadgeClass(getMatchStatus(item))">
                  <component :is="getMatchIcon(getMatchStatus(item))" :size="11" />
                  <span>{{ getMatchLabel(getMatchStatus(item)) }}</span>
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-bold" :class="item.totalCost > 150 ? 'text-red-600' : 'text-green-700'">
                  ₱{{ item.totalCost.toFixed(2) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ item.assignedBy }}</td>
            </tr>
            <tr v-if="filteredAssignments.length === 0">
              <td colspan="8" class="px-6 py-14 text-center">
                <History :size="48" class="mx-auto mb-3 text-gray-300" />
                <p class="text-gray-500 text-sm font-medium">No meal history found</p>
                <p class="text-gray-400 text-xs mt-1">Try adjusting your filters</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Summary Footer -->
      <div v-if="filteredAssignments.length > 0" class="px-6 py-3 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-6 text-sm">
        <span class="text-gray-500">Showing <strong class="text-gray-800">{{ filteredAssignments.length }}</strong> records</span>
        <span class="text-gray-500">Total Cost: <strong class="text-gray-800">₱{{ totalCost.toFixed(2) }}</strong></span>
        <span class="text-gray-500">Avg/Day: <strong class="text-gray-800">₱{{ averageCost.toFixed(2) }}</strong></span>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, computed } from 'vue';
import { useDataStore } from '@/stores/dataStore';
import {
  Search,
  History,
  Utensils,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Filter } from
'lucide-vue-next';

const dataStore = useDataStore();

const searchQuery = ref('');
const dateRange = ref('today');
const customDate = ref('');
const matchStatusFilter = ref('');
const mealTypeFilter = ref('');

const today = new Date().toISOString().split('T')[0];

function getPatientRoom(patientId) {
  const p = dataStore.patients.find((p) => p.id === patientId);
  return p ? `Room ${p.room}` : '';
}

// Determine match status based on whether assigned meals match what the doctor prescribed
function getMatchStatus(item) {
  const prescription = dataStore.prescriptions.find((rx) => rx.patientId === item.patientId && rx.status === 'Active');
  if (!prescription) return 'unverified';
  const mealsAssigned = [item.breakfast, item.lunch, item.dinner].filter(Boolean).length;
  if (mealsAssigned === 3) return 'perfect';
  if (mealsAssigned >= 1) return 'partial';
  return 'mismatch';
}

function getMatchBadgeClass(status) {
  const map = {
    perfect: 'bg-green-100 text-green-800',
    partial: 'bg-yellow-100 text-yellow-800',
    mismatch: 'bg-red-100 text-red-700',
    unverified: 'bg-gray-100 text-gray-600'
  };
  return map[status] || 'bg-gray-100 text-gray-600';
}

function getMatchLabel(status) {
  const map = {
    perfect: 'Perfect Match',
    partial: 'Partial',
    mismatch: 'Mismatch',
    unverified: 'Not Verified'
  };
  return map[status] || status;
}

function getMatchIcon(status) {
  const map = {
    perfect: CheckCircle2,
    partial: AlertCircle,
    mismatch: XCircle,
    unverified: AlertCircle
  };
  return map[status] || AlertCircle;
}

const filteredAssignments = computed(() => {
  let items = [...dataStore.mealAssignments];

  // Date range filter
  if (dateRange.value === 'today') {
    items = items.filter((a) => a.date === today);
  } else if (dateRange.value === 'week') {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    items = items.filter((a) => new Date(a.date) >= weekAgo);
  } else if (dateRange.value === 'month') {
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    items = items.filter((a) => new Date(a.date) >= monthAgo);
  } else if (dateRange.value === 'custom' && customDate.value) {
    items = items.filter((a) => a.date === customDate.value);
  }

  // Search filter
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    items = items.filter((a) =>
    a.patientName.toLowerCase().includes(q) ||
    (a.breakfast || '').toLowerCase().includes(q) ||
    (a.lunch || '').toLowerCase().includes(q) ||
    (a.dinner || '').toLowerCase().includes(q) ||
    getPatientRoom(a.patientId).toLowerCase().includes(q)
    );
  }

  // Match status filter
  if (matchStatusFilter.value) {
    items = items.filter((a) => getMatchStatus(a) === matchStatusFilter.value);
  }

  // Meal type filter (only show records that have the selected meal type)
  if (mealTypeFilter.value === 'breakfast') items = items.filter((a) => !!a.breakfast);else
  if (mealTypeFilter.value === 'lunch') items = items.filter((a) => !!a.lunch);else
  if (mealTypeFilter.value === 'dinner') items = items.filter((a) => !!a.dinner);

  return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

// Stats (all data, not just filtered)
const allAssignments = computed(() => dataStore.mealAssignments);
const totalServed = computed(() => allAssignments.value.length);
const todayCount = computed(() => allAssignments.value.filter((a) => a.date === today).length);
const perfectMatchCount = computed(() => allAssignments.value.filter((a) => getMatchStatus(a) === 'perfect').length);
const partialCount = computed(() => allAssignments.value.filter((a) => getMatchStatus(a) === 'partial').length);
const mismatchCount = computed(() => allAssignments.value.filter((a) => getMatchStatus(a) === 'mismatch').length);

const totalCost = computed(() => filteredAssignments.value.reduce((s, a) => s + a.totalCost, 0));
const averageCost = computed(() => filteredAssignments.value.length === 0 ? 0 : totalCost.value / filteredAssignments.value.length);

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
</script>
