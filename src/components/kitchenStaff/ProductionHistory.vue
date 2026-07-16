<template>
  <div class="space-y-6">
    <!-- Backflush History Section -->
    <div v-if="backflushHistory.length > 0" class="space-y-4">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Backflush History</h2>
        <p class="text-sm text-gray-600 mt-1">View all completed production items and their backflushed ingredients</p>
      </div>

      <div v-for="history in backflushHistory" :key="history.id" class="bg-white rounded-lg shadow overflow-hidden border border-green-200">
        <!-- Header with meal name and completion time -->
        <div class="bg-green-600 text-white p-6 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <CheckCircle :size="32" class="flex-shrink-0" />
            <div>
              <h3 class="text-xl font-bold">{{ history.mealName }}</h3>
              <p class="text-sm text-green-100">Production Completed</p>
            </div>
          </div>
          <div class="text-right">
            <Clock :size="20" class="inline-block mr-2" />
            <span class="text-sm">{{ history.completedAt }}</span>
          </div>
        </div>

        <!-- Backflushed Ingredients -->
        <div class="p-6">
          <div class="flex items-center space-x-2 mb-4">
            <Zap :size="18" class="text-gray-700" />
            <h4 class="font-semibold text-gray-900">Backflushed Ingredients ({{ history.ingredients.length }} items)</h4>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-for="ingredient in history.ingredients" :key="ingredient.id" class="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition">
              <div class="flex items-start justify-between mb-3">
                <h5 class="font-semibold text-gray-900">{{ ingredient.name }}</h5>
                <span class="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Deducted</span>
              </div>
              <div class="space-y-2">
                <div>
                  <p class="text-xs text-gray-600">Quantity:</p>
                  <p class="text-lg font-bold text-red-600">{{ ingredient.quantity }} {{ ingredient.unit }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-600">By:</p>
                  <p class="text-sm text-gray-900">{{ ingredient.deductedBy }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Divider if backflush history exists -->
    <div v-if="backflushHistory.length > 0" class="border-t border-gray-200"></div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-bold text-gray-900 mb-4">Filter Production History</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Meal Type</label>
          <select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
            <option>All Meals</option>
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
            <option>Snacks</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <input type="date" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
            <option>All Status</option>
            <option>Completed</option>
            <option>In Progress</option>
            <option>Pending</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Production History Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-bold text-gray-900">Production History</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date & Time</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Meal Type</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Prepared For</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Quantity</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Prepared By</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Notes</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="history in backflushHistory" :key="'table-' + history.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-600">{{ new Date(history.completedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }}</td>
              <td class="px-6 py-4 text-sm text-gray-900 font-medium">{{ history.mealName }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">All Wards</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ history.ingredients.length }} ingredients</td>
              <td class="px-6 py-4 text-sm"><span class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Completed</span></td>
              <td class="px-6 py-4 text-sm text-gray-600">System (Auto)</td>
              <td class="px-6 py-4 text-sm text-gray-600">Stock Deducted</td>
            </tr>
            <tr v-if="backflushHistory.length === 0">
              <td colspan="7" class="px-6 py-8 text-center text-sm text-gray-500">No production history found yet. Complete a meal in the Production Schedule to see it here.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { CheckCircle, Clock, Zap } from 'lucide-vue-next';
import { useDataStore } from '../../stores/dataStore';

const dataStore = useDataStore();
const backflushHistory = computed(() => dataStore.backflushHistory.value || []);
</script>

<style scoped>
</style>
