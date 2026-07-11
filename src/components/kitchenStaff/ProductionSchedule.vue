<template>
  <div class="space-y-6">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-600 text-sm font-medium">Today's Meals</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">12</p>
            <p class="text-sm text-red-600 font-medium mt-1">To Prepare</p>
          </div>
          <Utensils class="text-red-400 bg-red-50 p-2 rounded-full" :size="32" />
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-amber-500">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-600 text-sm font-medium">In Progress</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">5</p>
            <p class="text-sm text-amber-600 font-medium mt-1">Being Prepared</p>
          </div>
          <Clock class="text-amber-400 bg-amber-50 p-2 rounded-full" :size="32" />
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-600 text-sm font-medium">Completed</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">7</p>
            <p class="text-sm text-green-600 font-medium mt-1">Ready to Serve</p>
          </div>
          <CheckCircle class="text-green-400 bg-green-50 p-2 rounded-full" :size="32" />
        </div>
      </div>
    </div>

    <!-- Meal Orders Section -->
    <div class="space-y-4">
      <!-- Breakfast Orders -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="bg-orange-500 text-white p-6 flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="text-4xl">🍳</div>
            <div>
              <h3 class="text-2xl font-bold">Breakfast Orders</h3>
              <p class="text-sm text-orange-100">1 dish • {{ breakfastCompleted ? 'All completed' : '1 pending' }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm font-semibold">Total Servings</p>
            <p class="text-4xl font-bold">1</p>
          </div>
        </div>

        <div class="p-6 space-y-4" :class="{ 'bg-green-50': breakfastCompleted }">
          <!-- Breakfast Dish Item - Pending -->
          <div v-if="!breakfastCompleted" class="flex items-start justify-between p-4 border border-yellow-200 rounded-lg bg-yellow-50">
            <div class="flex items-start space-x-4">
              <div class="text-4xl">⏰</div>
              <div>
                <h4 class="font-semibold text-gray-900">Scrambled Eggs</h4>
                <p class="text-sm text-purple-600 font-medium">DM (Diabetic Mellitus) Diet</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600 mb-2">Required</p>
              <p class="text-3xl font-bold text-orange-500">1</p>
              <p class="text-sm text-gray-600">Servings</p>
            </div>
          </div>

          <!-- Breakfast Dish Item - Completed -->
          <div v-else class="flex items-start justify-between p-4 border border-green-200 rounded-lg bg-white">
            <div class="flex items-start space-x-4">
              <div class="bg-green-100 text-green-600 rounded-lg p-3 flex items-center justify-center w-12 h-12 flex-shrink-0">
                <CheckCircle2 :size="24" />
              </div>
              <div>
                <div class="flex items-center space-x-2 mb-1">
                  <h4 class="font-semibold text-gray-900">Scrambled Eggs</h4>
                  <span class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">✓ Completed</span>
                </div>
                <p class="text-sm text-purple-600 font-medium mb-1">DM (Diabetic Mellitus) Diet</p>
                <p class="text-sm text-gray-600">Completed at {{ breakfastTime }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600 mb-2">Required</p>
              <p class="text-3xl font-bold text-orange-500">1</p>
              <p class="text-sm text-gray-600">Servings</p>
            </div>
          </div>

          <!-- Breakfast Action Button -->
          <button v-if="!breakfastCompleted" @click="markBreakfastComplete" class="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors">
            <CheckCircle :size="20" />
            <span>Mark Breakfast Production Complete</span>
          </button>

          <!-- Breakfast Success Message -->
          <div v-else class="bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-lg flex items-center space-x-3">
            <CheckCircle :size="24" />
            <span class="font-semibold text-lg">All Breakfast Production Completed! 🎉</span>
          </div>

          <div v-if="!breakfastCompleted" class="flex items-start space-x-2 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <Zap class="text-orange-500 mt-1 flex-shrink-0" :size="18" />
            <p class="text-sm text-gray-700">This will automatically backflush 1 dish and deduct ingredients from inventory</p>
          </div>
        </div>
      </div>

      <!-- Lunch Orders -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="bg-blue-600 text-white p-6 flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="text-4xl">🍗</div>
            <div>
              <h3 class="text-2xl font-bold">Lunch Orders</h3>
              <p class="text-sm text-blue-100">1 dish • {{ lunchCompleted ? 'All completed' : '1 pending' }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm font-semibold">Total Servings</p>
            <p class="text-4xl font-bold">1</p>
          </div>
        </div>

        <div class="p-6 space-y-4" :class="{ 'bg-green-50': lunchCompleted }">
          <!-- Lunch Dish Item - Pending -->
          <div v-if="!lunchCompleted" class="flex items-start justify-between p-4 border border-yellow-200 rounded-lg bg-yellow-50">
            <div class="flex items-start space-x-4">
              <div class="text-4xl">⏰</div>
              <div>
                <h4 class="font-semibold text-gray-900">Vegetable Soup</h4>
                <p class="text-sm text-purple-600 font-medium">DM (Diabetic Mellitus) Diet</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600 mb-2">Required</p>
              <p class="text-3xl font-bold text-orange-500">1</p>
              <p class="text-sm text-gray-600">Servings</p>
            </div>
          </div>

          <!-- Lunch Dish Item - Completed -->
          <div v-else class="flex items-start justify-between p-4 border border-green-200 rounded-lg bg-white">
            <div class="flex items-start space-x-4">
              <div class="bg-green-100 text-green-600 rounded-lg p-3 flex items-center justify-center w-12 h-12 flex-shrink-0">
                <CheckCircle2 :size="24" />
              </div>
              <div>
                <div class="flex items-center space-x-2 mb-1">
                  <h4 class="font-semibold text-gray-900">Vegetable Soup</h4>
                  <span class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">✓ Completed</span>
                </div>
                <p class="text-sm text-purple-600 font-medium mb-1">DM (Diabetic Mellitus) Diet</p>
                <p class="text-sm text-gray-600">Completed at {{ lunchTime }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600 mb-2">Required</p>
              <p class="text-3xl font-bold text-orange-500">1</p>
              <p class="text-sm text-gray-600">Servings</p>
            </div>
          </div>

          <!-- Lunch Action Button -->
          <button v-if="!lunchCompleted" @click="markLunchComplete" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors">
            <CheckCircle :size="20" />
            <span>Mark Lunch Production Complete</span>
          </button>

          <!-- Lunch Success Message -->
          <div v-else class="bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-lg flex items-center space-x-3">
            <CheckCircle :size="24" />
            <span class="font-semibold text-lg">All Lunch Production Completed! 🎉</span>
          </div>

          <div v-if="!lunchCompleted" class="flex items-start space-x-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Zap class="text-blue-600 mt-1 flex-shrink-0" :size="18" />
            <p class="text-sm text-gray-700">This will automatically backflush 1 dish and deduct ingredients from inventory</p>
          </div>
        </div>
      </div>

      <!-- Dinner Orders -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="bg-red-600 text-white p-6 flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="text-4xl">🍽️</div>
            <div>
              <h3 class="text-2xl font-bold">Dinner Orders</h3>
              <p class="text-sm text-red-100">1 dish • {{ dinnerCompleted ? 'All completed' : '1 pending' }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm font-semibold">Total Servings</p>
            <p class="text-4xl font-bold">1</p>
          </div>
        </div>

        <div class="p-6 space-y-4" :class="{ 'bg-green-50': dinnerCompleted }">
          <!-- Dinner Dish Item - Pending -->
          <div v-if="!dinnerCompleted" class="flex items-start justify-between p-4 border border-yellow-200 rounded-lg bg-yellow-50">
            <div class="flex items-start space-x-4">
              <div class="text-4xl">⏰</div>
              <div>
                <h4 class="font-semibold text-gray-900">Chicken Stew</h4>
                <p class="text-sm text-purple-600 font-medium">Regular Diet</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600 mb-2">Required</p>
              <p class="text-3xl font-bold text-orange-500">1</p>
              <p class="text-sm text-gray-600">Servings</p>
            </div>
          </div>

          <!-- Dinner Dish Item - Completed -->
          <div v-else class="flex items-start justify-between p-4 border border-green-200 rounded-lg bg-white">
            <div class="flex items-start space-x-4">
              <div class="bg-green-100 text-green-600 rounded-lg p-3 flex items-center justify-center w-12 h-12 flex-shrink-0">
                <CheckCircle2 :size="24" />
              </div>
              <div>
                <div class="flex items-center space-x-2 mb-1">
                  <h4 class="font-semibold text-gray-900">Chicken Stew</h4>
                  <span class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">✓ Completed</span>
                </div>
                <p class="text-sm text-purple-600 font-medium mb-1">Regular Diet</p>
                <p class="text-sm text-gray-600">Completed at {{ dinnerTime }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600 mb-2">Required</p>
              <p class="text-3xl font-bold text-orange-500">1</p>
              <p class="text-sm text-gray-600">Servings</p>
            </div>
          </div>

          <!-- Dinner Action Button -->
          <button v-if="!dinnerCompleted" @click="markDinnerComplete" class="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors">
            <CheckCircle :size="20" />
            <span>Mark Dinner Production Complete</span>
          </button>

          <!-- Dinner Success Message -->
          <div v-else class="bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-lg flex items-center space-x-3">
            <CheckCircle :size="24" />
            <span class="font-semibold text-lg">All Dinner Production Completed! 🎉</span>
          </div>

          <div v-if="!dinnerCompleted" class="flex items-start space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <Zap class="text-red-600 mt-1 flex-shrink-0" :size="18" />
            <p class="text-sm text-gray-700">This will automatically backflush 1 dish and deduct ingredients from inventory</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Production Schedule Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-bold text-gray-900">Today's Production Schedule</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Meal Type</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Prepared For</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Quantity</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Serving Time</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Assigned To</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-900 font-medium">Breakfast</td>
              <td class="px-6 py-4 text-sm text-gray-600">Ward A - General</td>
              <td class="px-6 py-4 text-sm text-gray-900">45 portions</td>
              <td class="px-6 py-4 text-sm text-gray-600">07:00 AM</td>
              <td class="px-6 py-4 text-sm"><span class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Completed</span></td>
              <td class="px-6 py-4 text-sm text-gray-600">Rosa Lopez</td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-900 font-medium">Mid-Morning Snack</td>
              <td class="px-6 py-4 text-sm text-gray-600">Ward A - General</td>
              <td class="px-6 py-4 text-sm text-gray-900">45 portions</td>
              <td class="px-6 py-4 text-sm text-gray-600">10:00 AM</td>
              <td class="px-6 py-4 text-sm"><span class="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">In Progress</span></td>
              <td class="px-6 py-4 text-sm text-gray-600">Maria Santos</td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-900 font-medium">Lunch (Regular Diet)</td>
              <td class="px-6 py-4 text-sm text-gray-600">Ward A - General</td>
              <td class="px-6 py-4 text-sm text-gray-900">40 portions</td>
              <td class="px-6 py-4 text-sm text-gray-600">12:00 PM</td>
              <td class="px-6 py-4 text-sm"><span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Pending</span></td>
              <td class="px-6 py-4 text-sm text-gray-600">Carlos Diaz</td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-900 font-medium">Lunch (Soft Diet)</td>
              <td class="px-6 py-4 text-sm text-gray-600">Ward B - Post-Op</td>
              <td class="px-6 py-4 text-sm text-gray-900">15 portions</td>
              <td class="px-6 py-4 text-sm text-gray-600">12:00 PM</td>
              <td class="px-6 py-4 text-sm"><span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Pending</span></td>
              <td class="px-6 py-4 text-sm text-gray-600">Rosa Lopez</td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-900 font-medium">Afternoon Snack</td>
              <td class="px-6 py-4 text-sm text-gray-600">All Wards</td>
              <td class="px-6 py-4 text-sm text-gray-900">80 portions</td>
              <td class="px-6 py-4 text-sm text-gray-600">03:00 PM</td>
              <td class="px-6 py-4 text-sm"><span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Pending</span></td>
              <td class="px-6 py-4 text-sm text-gray-600">Maria Santos</td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-900 font-medium">Dinner (Regular Diet)</td>
              <td class="px-6 py-4 text-sm text-gray-600">Ward A - General</td>
              <td class="px-6 py-4 text-sm text-gray-900">40 portions</td>
              <td class="px-6 py-4 text-sm text-gray-600">06:00 PM</td>
              <td class="px-6 py-4 text-sm"><span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Pending</span></td>
              <td class="px-6 py-4 text-sm text-gray-600">Carlos Diaz</td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-900 font-medium">Dinner (Liquid Diet)</td>
              <td class="px-6 py-4 text-sm text-gray-600">Ward C - ICU</td>
              <td class="px-6 py-4 text-sm text-gray-900">8 portions</td>
              <td class="px-6 py-4 text-sm text-gray-600">06:00 PM</td>
              <td class="px-6 py-4 text-sm"><span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Pending</span></td>
              <td class="px-6 py-4 text-sm text-gray-600">Rosa Lopez</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref } from 'vue';
import { Utensils, Clock, CheckCircle, CheckCircle2, Zap } from 'lucide-vue-next';
import { useDataStore } from '../../stores/dataStore';

const dataStore = useDataStore();

// Breakfast state
const breakfastCompleted = ref(false);
const breakfastTime = ref('');

// Lunch state
const lunchCompleted = ref(false);
const lunchTime = ref('');

// Dinner state
const dinnerCompleted = ref(false);
const dinnerTime = ref('');

// Define backflush ingredients for each meal
const breakfastIngredients = [
{ name: 'Eggs', quantity: '2', unit: 'pieces', deductedBy: 'Chef Maria' },
{ name: 'Butter', quantity: '50', unit: 'g', deductedBy: 'Chef Maria' },
{ name: 'Milk', quantity: '100', unit: 'ml', deductedBy: 'Chef Maria' }];


const lunchIngredients = [
{ name: 'Vegetables', quantity: '0.3', unit: 'kg', deductedBy: 'Chef Pedro' },
{ name: 'Cooking Oil', quantity: '0.03', unit: 'liters', deductedBy: 'Chef Pedro' },
{ name: 'Potatoes', quantity: '0.2', unit: 'kg', deductedBy: 'Chef Pedro' }];


const dinnerIngredients = [
{ name: 'Chicken', quantity: '0.5', unit: 'kg', deductedBy: 'Chef Carlos' },
{ name: 'Rice', quantity: '0.4', unit: 'kg', deductedBy: 'Chef Carlos' },
{ name: 'Onions', quantity: '0.15', unit: 'kg', deductedBy: 'Chef Carlos' }];


// Mark breakfast as complete
function markBreakfastComplete() {
  breakfastCompleted.value = true;
  const now = new Date();
  breakfastTime.value = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // Add to backflush history
  const backflushEntry = {
    id: `BF${Date.now()}`,
    mealName: 'Scrambled Eggs',
    completedAt: now.toLocaleString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    ingredients: breakfastIngredients.map((ing, index) => ({
      id: `ING${Date.now()}-${index}`,
      ...ing
    }))
  };
  dataStore.addBackflushHistory(backflushEntry);
}

// Mark lunch as complete
function markLunchComplete() {
  lunchCompleted.value = true;
  const now = new Date();
  lunchTime.value = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // Add to backflush history
  const backflushEntry = {
    id: `BF${Date.now()}`,
    mealName: 'Vegetable Soup',
    completedAt: now.toLocaleString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    ingredients: lunchIngredients.map((ing, index) => ({
      id: `ING${Date.now()}-${index}`,
      ...ing
    }))
  };
  dataStore.addBackflushHistory(backflushEntry);
}

// Mark dinner as complete
function markDinnerComplete() {
  dinnerCompleted.value = true;
  const now = new Date();
  dinnerTime.value = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // Add to backflush history
  const backflushEntry = {
    id: `BF${Date.now()}`,
    mealName: 'Chicken Stew',
    completedAt: now.toLocaleString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    ingredients: dinnerIngredients.map((ing, index) => ({
      id: `ING${Date.now()}-${index}`,
      ...ing
    }))
  };
  dataStore.addBackflushHistory(backflushEntry);
}
</script>

<style scoped>
</style>
