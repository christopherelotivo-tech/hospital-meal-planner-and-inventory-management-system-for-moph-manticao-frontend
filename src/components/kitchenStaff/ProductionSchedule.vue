<template>
  <div class="space-y-6 w-full max-w-full overflow-x-hidden pb-8">
    
    <!-- Zone 1: Top Context Header -->
    <div class="w-full rounded-2xl shadow-sm px-6 py-8 flex justify-between items-center text-white mb-6 bg-gradient-to-r from-orange-600 to-red-500">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">Kitchen Operations</h2>
        <p class="text-orange-100 text-sm mt-1">Shift: Morning</p>
      </div>
      <div class="text-right hidden sm:block">
        <p class="font-medium">{{ currentDate }}</p>
      </div>
    </div>

    <!-- Zone 2: KPI & Census Metric Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      
      <!-- Card 1: Meal Production Headcount -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col justify-center border-l-4 border-l-orange-500">
        <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Meal Production Headcount</p>
        <div class="flex items-center space-x-2 md:space-x-4 mt-2">
          <div class="text-center">
            <p class="text-xs text-slate-500 mb-1">Breakfast</p>
            <h3 class="text-xl font-bold text-slate-800">{{ breakfastCount }}</h3>
          </div>
          <div class="h-8 w-px bg-slate-200"></div>
          <div class="text-center">
            <p class="text-xs text-slate-500 mb-1">Lunch</p>
            <h3 class="text-xl font-bold text-slate-800">{{ lunchCount }}</h3>
          </div>
          <div class="h-8 w-px bg-slate-200"></div>
          <div class="text-center">
            <p class="text-xs text-slate-500 mb-1">Dinner</p>
            <h3 class="text-xl font-bold text-slate-800">{{ dinnerCount }}</h3>
          </div>
        </div>
      </div>

      <!-- Card 2: In Progress -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col justify-center">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">In Progress</p>
            <h3 class="text-3xl font-bold text-amber-600">{{ inProgressCount }}</h3>
            <p class="text-xs text-slate-400 mt-1">Meals being prepped</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
            <Clock :size="24" />
          </div>
        </div>
      </div>

      <!-- Card 3: Completed -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col justify-center">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Completed</p>
            <h3 class="text-3xl font-bold text-green-600">{{ completedCount }}</h3>
            <p class="text-xs text-slate-400 mt-1">Ready for dispatch</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500">
            <CheckCircle :size="24" />
          </div>
        </div>
      </div>

    </div>

    <!-- Zone 3: Quick Actions Row -->
    <div class="flex flex-wrap gap-4 mt-6">
      <button @click="isPrepSheetModalOpen = true" class="px-5 py-2.5 rounded-lg text-white font-medium shadow-sm hover:shadow-md transition-all active:scale-95 bg-orange-600 hover:bg-orange-700 flex items-center space-x-2">
        <Printer :size="18" />
        <span>Print Kitchen Prep Sheet</span>
      </button>
      <button class="px-5 py-2.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all active:scale-95 bg-white border border-orange-600 text-orange-700 hover:bg-orange-50 flex items-center space-x-2">
        <ChefHat :size="18" />
        <span>View Master Recipes Matrix</span>
      </button>
    </div>

    <!-- Zone 4: Primary Content Grid Workspace -->
    <div class="flex flex-col gap-6 mt-6">
      
      <!-- Breakfast Orders -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="bg-orange-50 border-b border-orange-100 p-5 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
              <span class="text-xl">🍳</span>
            </div>
            <div>
              <h3 class="font-bold text-slate-800 text-lg">Breakfast Orders</h3>
              <p class="text-xs text-slate-500">{{ breakfastCompleted ? 'All completed' : '1 pending order' }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-xs text-slate-500 uppercase font-semibold">Servings</p>
            <p class="text-2xl font-bold text-orange-600">{{ breakfastCount }}</p>
          </div>
        </div>
        <div class="p-5" :class="{ 'bg-slate-50': breakfastCompleted }">
          
          <div v-if="!breakfastCompleted" class="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-white shadow-sm hover:border-orange-300 transition-colors cursor-pointer" @click="markBreakfastComplete">
            <div class="flex items-center space-x-4">
              <div class="w-6 h-6 rounded border-2 border-slate-300 flex items-center justify-center group-hover:border-orange-500 transition-colors"></div>
              <div>
                <h4 class="font-bold text-slate-800">Scrambled Eggs</h4>
                <p class="text-sm text-purple-600 font-medium">DM (Diabetic Mellitus) Diet</p>
              </div>
            </div>
            <span class="text-sm font-semibold text-slate-500">{{ breakfastCount }} Servings</span>
          </div>
          
          <div v-else class="flex items-center justify-between p-4 border border-green-200 rounded-lg bg-green-50 shadow-sm">
            <div class="flex items-center space-x-4">
              <div class="w-6 h-6 rounded bg-green-500 flex items-center justify-center text-white">
                <CheckCircle :size="16" />
              </div>
              <div>
                <div class="flex items-center space-x-2">
                  <h4 class="font-bold line-through text-slate-500">Scrambled Eggs</h4>
                  <span class="text-[10px] bg-green-200 text-green-800 px-2 py-0.5 rounded uppercase font-bold">Done</span>
                </div>
                <p class="text-sm text-slate-500 mt-0.5">Completed at {{ breakfastTime }}</p>
              </div>
            </div>
          </div>

          <div v-if="!breakfastCompleted" class="mt-4 flex justify-end">
            <button @click="markBreakfastComplete" class="bg-orange-600 text-white px-5 py-2 rounded-lg font-medium shadow-sm hover:bg-orange-700 transition-colors flex items-center space-x-2">
              <CheckCircle :size="18" />
              <span>Complete Breakfast Production</span>
            </button>
          </div>
          <div v-else class="mt-4 text-sm text-green-700 bg-green-100 border border-green-200 p-3 rounded-lg flex items-center space-x-2">
            <CheckCircle :size="18" />
            <span>Breakfast production completed! Raw ingredients (Eggs, Butter, Milk) have been automatically deducted.</span>
          </div>
        </div>
      </div>

      <!-- Lunch Orders -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="bg-blue-50 border-b border-blue-100 p-5 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <span class="text-xl">🍗</span>
            </div>
            <div>
              <h3 class="font-bold text-slate-800 text-lg">Lunch Orders</h3>
              <p class="text-xs text-slate-500">{{ lunchCompleted ? 'All completed' : '1 pending order' }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-xs text-slate-500 uppercase font-semibold">Servings</p>
            <p class="text-2xl font-bold text-blue-600">{{ lunchCount }}</p>
          </div>
        </div>
        <div class="p-5" :class="{ 'bg-slate-50': lunchCompleted }">
          
          <div v-if="!lunchCompleted" class="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-white shadow-sm hover:border-blue-300 transition-colors cursor-pointer" @click="markLunchComplete">
            <div class="flex items-center space-x-4">
              <div class="w-6 h-6 rounded border-2 border-slate-300 flex items-center justify-center group-hover:border-blue-500 transition-colors"></div>
              <div>
                <h4 class="font-bold text-slate-800">Vegetable Soup</h4>
                <p class="text-sm text-purple-600 font-medium">DM (Diabetic Mellitus) Diet</p>
              </div>
            </div>
            <span class="text-sm font-semibold text-slate-500">{{ lunchCount }} Servings</span>
          </div>
          
          <div v-else class="flex items-center justify-between p-4 border border-green-200 rounded-lg bg-green-50 shadow-sm">
            <div class="flex items-center space-x-4">
              <div class="w-6 h-6 rounded bg-green-500 flex items-center justify-center text-white">
                <CheckCircle :size="16" />
              </div>
              <div>
                <div class="flex items-center space-x-2">
                  <h4 class="font-bold line-through text-slate-500">Vegetable Soup</h4>
                  <span class="text-[10px] bg-green-200 text-green-800 px-2 py-0.5 rounded uppercase font-bold">Done</span>
                </div>
                <p class="text-sm text-slate-500 mt-0.5">Completed at {{ lunchTime }}</p>
              </div>
            </div>
          </div>

          <div v-if="!lunchCompleted" class="mt-4 flex justify-end">
            <button @click="markLunchComplete" class="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium shadow-sm hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <CheckCircle :size="18" />
              <span>Complete Lunch Production</span>
            </button>
          </div>
          <div v-else class="mt-4 text-sm text-green-700 bg-green-100 border border-green-200 p-3 rounded-lg flex items-center space-x-2">
            <CheckCircle :size="18" />
            <span>Lunch production completed! Raw ingredients (Vegetables, Cooking Oil, Potatoes) have been automatically deducted.</span>
          </div>
        </div>
      </div>

      <!-- Dinner Orders -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="bg-red-50 border-b border-red-100 p-5 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
              <span class="text-xl">🍽️</span>
            </div>
            <div>
              <h3 class="font-bold text-slate-800 text-lg">Dinner Orders</h3>
              <p class="text-xs text-slate-500">{{ dinnerCompleted ? 'All completed' : '1 pending order' }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-xs text-slate-500 uppercase font-semibold">Servings</p>
            <p class="text-2xl font-bold text-red-600">{{ dinnerCount }}</p>
          </div>
        </div>
        <div class="p-5" :class="{ 'bg-slate-50': dinnerCompleted }">
          
          <div v-if="!dinnerCompleted" class="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-white shadow-sm hover:border-red-300 transition-colors cursor-pointer" @click="markDinnerComplete">
            <div class="flex items-center space-x-4">
              <div class="w-6 h-6 rounded border-2 border-slate-300 flex items-center justify-center group-hover:border-red-500 transition-colors"></div>
              <div>
                <h4 class="font-bold text-slate-800">Chicken Stew</h4>
                <p class="text-sm text-purple-600 font-medium">Regular Diet</p>
              </div>
            </div>
            <span class="text-sm font-semibold text-slate-500">{{ dinnerCount }} Servings</span>
          </div>
          
          <div v-else class="flex items-center justify-between p-4 border border-green-200 rounded-lg bg-green-50 shadow-sm">
            <div class="flex items-center space-x-4">
              <div class="w-6 h-6 rounded bg-green-500 flex items-center justify-center text-white">
                <CheckCircle :size="16" />
              </div>
              <div>
                <div class="flex items-center space-x-2">
                  <h4 class="font-bold line-through text-slate-500">Chicken Stew</h4>
                  <span class="text-[10px] bg-green-200 text-green-800 px-2 py-0.5 rounded uppercase font-bold">Done</span>
                </div>
                <p class="text-sm text-slate-500 mt-0.5">Completed at {{ dinnerTime }}</p>
              </div>
            </div>
          </div>

          <div v-if="!dinnerCompleted" class="mt-4 flex justify-end">
            <button @click="markDinnerComplete" class="bg-red-600 text-white px-5 py-2 rounded-lg font-medium shadow-sm hover:bg-red-700 transition-colors flex items-center space-x-2">
              <CheckCircle :size="18" />
              <span>Complete Dinner Production</span>
            </button>
          </div>
          <div v-else class="mt-4 text-sm text-green-700 bg-green-100 border border-green-200 p-3 rounded-lg flex items-center space-x-2">
            <CheckCircle :size="18" />
            <span>Dinner production completed! Raw ingredients (Chicken, Rice, Onions) have been automatically deducted.</span>
          </div>
        </div>
      </div>
    </div>
    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- Kitchen Prep Sheet Modal -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <transition name="fade">
      <div v-if="isPrepSheetModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden" @click.stop>
          <div class="p-5 border-b border-gray-100 flex justify-between items-center bg-orange-50">
            <div>
              <h2 class="text-lg font-bold text-gray-900">Daily Kitchen Prep Sheet</h2>
              <p class="text-sm text-gray-500">Aggregated pull list for today's production ({{ currentDate }})</p>
            </div>
            <button @click="isPrepSheetModalOpen = false" class="text-gray-400 hover:text-gray-600"><X :size="22" /></button>
          </div>
          
          <div class="p-6 bg-white flex-1 overflow-y-auto max-h-[60vh]">
            <div class="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
              <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">Ingredient Pull Checklist</h3>
              <span class="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded">{{ totalPatientsToPrep }} Patients</span>
            </div>
            
            <div v-if="aggregatedIngredients.length > 0" class="space-y-2">
              <div v-for="(ing, idx) in aggregatedIngredients" :key="idx" class="flex items-center justify-between p-3 border border-gray-200 rounded-lg" :class="{'bg-red-50 border-red-200': ing.isLowStock}">
                <div class="flex items-center space-x-3">
                  <div class="w-5 h-5 rounded border-2 border-gray-300"></div>
                  <span class="font-semibold text-gray-800 text-sm">{{ ing.name }}</span>
                </div>
                <div class="text-right">
                  <span class="font-bold text-gray-900">{{ ing.totalQty.toFixed(2) }}</span>
                  <span class="text-gray-500 text-xs ml-1">{{ ing.unit }}</span>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-6 border border-dashed border-gray-200 rounded-lg">
              <p class="text-sm text-gray-500">No ingredients required or meals not dispatched yet.</p>
            </div>

            <div v-if="hasLowStock" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
              <AlertTriangle :size="16" class="text-red-600 mt-0.5 shrink-0" />
              <p class="text-xs text-red-700 font-semibold leading-relaxed">
                ⚠️ WARNING: Inventory for some items is Low. Request stock from Purchasing immediately.
              </p>
            </div>
          </div>
          
          <div class="p-4 border-t border-gray-100 flex justify-end items-center bg-gray-50 space-x-3">
            <button @click="isPrepSheetModalOpen = false" class="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">Close</button>
            <button class="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-bold transition-colors flex items-center space-x-2">
              <Printer :size="16" />
              <span>Print Sheet</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useDataStore } from '@/stores/dataStore';
import { Utensils, Clock, CheckCircle, Zap, Printer, ChefHat, X, AlertTriangle } from 'lucide-vue-next';

const dataStore = useDataStore();
const currentDate = ref(new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

// Active patients and assignments
const activePatients = computed(() => dataStore.patients.filter(p => p.status === 'Active'));
const todayStr = new Date().toISOString().split('T')[0];

const breakfastCount = computed(() => {
  const count = dataStore.mealAssignments.filter(m => m.date === todayStr && m.breakfast).length;
  return count > 0 ? count : activePatients.value.length;
});

const lunchCount = computed(() => {
  const count = dataStore.mealAssignments.filter(m => m.date === todayStr && m.lunch).length;
  return count > 0 ? count : activePatients.value.length;
});

const dinnerCount = computed(() => {
  const count = dataStore.mealAssignments.filter(m => m.date === todayStr && m.dinner).length;
  return count > 0 ? count : activePatients.value.length;
});

// Production states
const breakfastCompleted = ref(false);
const breakfastTime = ref('');
const lunchCompleted = ref(false);
const lunchTime = ref('');
const dinnerCompleted = ref(false);
const dinnerTime = ref('');

const inProgressCount = computed(() => {
  let count = 0;
  if (!breakfastCompleted.value) count++;
  if (!lunchCompleted.value) count++;
  if (!dinnerCompleted.value) count++;
  return count;
});

const completedCount = computed(() => {
  let count = 0;
  if (breakfastCompleted.value) count++;
  if (lunchCompleted.value) count++;
  if (dinnerCompleted.value) count++;
  return count;
});

function getAggregatedIngredientsForMeal(mealSlotKey) {
  const map = {};
  todaysAssignments.value.forEach(assignment => {
    const dishes = [];
    if (mealSlotKey === 'breakfast') {
      dishes.push({ name: assignment.breakfastCarb, portion: assignment.breakfastPortion || 1.0 });
      dishes.push({ name: assignment.breakfastProtein, portion: assignment.breakfastPortion || 1.0 });
      dishes.push({ name: assignment.breakfastSide, portion: assignment.breakfastPortion || 1.0 });
    } else if (mealSlotKey === 'lunch') {
      dishes.push({ name: assignment.lunchCarb, portion: assignment.lunchPortion || 1.0 });
      dishes.push({ name: assignment.lunchProtein, portion: assignment.lunchPortion || 1.0 });
      dishes.push({ name: assignment.lunchSide, portion: assignment.lunchPortion || 1.0 });
    } else if (mealSlotKey === 'dinner') {
      dishes.push({ name: assignment.dinnerCarb, portion: assignment.dinnerPortion || 1.0 });
      dishes.push({ name: assignment.dinnerProtein, portion: assignment.dinnerPortion || 1.0 });
      dishes.push({ name: assignment.dinnerSide, portion: assignment.dinnerPortion || 1.0 });
    }
    
    dishes.filter(d => d.name).forEach(item => {
      const dish = dataStore.dishes.find(d => d.name === item.name);
      if (dish && dish.ingredients) {
        dish.ingredients.forEach(ing => {
          const key = `${ing.name}_${ing.unit}`;
          if (!map[key]) {
            map[key] = {
              name: ing.name,
              unit: ing.unit,
              quantity: 0
            };
          }
          map[key].quantity += (ing.qty * item.portion);
        });
      }
    });
  });
  return Object.values(map);
}

// Complete Breakfast
function markBreakfastComplete() {
  if (breakfastCompleted.value) return;
  breakfastCompleted.value = true;
  const now = new Date();
  breakfastTime.value = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const ingredients = getAggregatedIngredientsForMeal('breakfast');

  // Deduct ingredients from stock
  ingredients.forEach(ing => {
    dataStore.deductStock(ing.name, ing.quantity);
  });

  // Log in backflush history
  dataStore.addBackflushHistory({
    id: `BF${Date.now()}`,
    mealName: 'Breakfast Service',
    completedAt: now.toISOString(),
    ingredients: ingredients
  });
}

// Complete Lunch
function markLunchComplete() {
  if (lunchCompleted.value) return;
  lunchCompleted.value = true;
  const now = new Date();
  lunchTime.value = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const ingredients = getAggregatedIngredientsForMeal('lunch');

  // Deduct ingredients from stock
  ingredients.forEach(ing => {
    dataStore.deductStock(ing.name, ing.quantity);
  });

  // Log in backflush history
  dataStore.addBackflushHistory({
    id: `BF${Date.now()}`,
    mealName: 'Lunch Service',
    completedAt: now.toISOString(),
    ingredients: ingredients
  });
}

// Complete Dinner
function markDinnerComplete() {
  if (dinnerCompleted.value) return;
  dinnerCompleted.value = true;
  const now = new Date();
  dinnerTime.value = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const ingredients = getAggregatedIngredientsForMeal('dinner');

  // Deduct ingredients from stock
  ingredients.forEach(ing => {
    dataStore.deductStock(ing.name, ing.quantity);
  });

  // Log in backflush history
  dataStore.addBackflushHistory({
    id: `BF${Date.now()}`,
    mealName: 'Dinner Service',
    completedAt: now.toISOString(),
    ingredients: ingredients
  });
}

// ── Kitchen Prep Sheet Logic ──────────────────────────────────────────────
const isPrepSheetModalOpen = ref(false);

const todaysAssignments = computed(() => {
  const todayStr = new Date().toISOString().split('T')[0];
  return dataStore.mealAssignments.filter(m => m.date === todayStr);
});

const totalPatientsToPrep = computed(() => todaysAssignments.value.length);

const aggregatedIngredients = computed(() => {
  const map = {};
  
  todaysAssignments.value.forEach(assignment => {
    // Collect dish names assigned to this patient along with their portion multipliers
    const dishes = [
      { name: assignment.breakfastCarb, portion: assignment.breakfastPortion || 1.0 },
      { name: assignment.breakfastProtein, portion: assignment.breakfastPortion || 1.0 },
      { name: assignment.breakfastSide, portion: assignment.breakfastPortion || 1.0 },
      { name: assignment.lunchCarb, portion: assignment.lunchPortion || 1.0 },
      { name: assignment.lunchProtein, portion: assignment.lunchPortion || 1.0 },
      { name: assignment.lunchSide, portion: assignment.lunchPortion || 1.0 },
      { name: assignment.dinnerCarb, portion: assignment.dinnerPortion || 1.0 },
      { name: assignment.dinnerProtein, portion: assignment.dinnerPortion || 1.0 },
      { name: assignment.dinnerSide, portion: assignment.dinnerPortion || 1.0 }
    ].filter(d => d.name);
    
    dishes.forEach(item => {
      // Find the dish in dataStore
      const dish = dataStore.dishes.find(d => d.name === item.name);
      if (dish && dish.ingredients) {
        dish.ingredients.forEach(ing => {
          const key = `${ing.name}_${ing.unit}`;
          if (!map[key]) {
            // Check inventory status
            const invItem = dataStore.inventory.find(i => i.name.toLowerCase() === ing.name.toLowerCase());
            map[key] = {
              name: ing.name,
              unit: ing.unit,
              totalQty: 0,
              isLowStock: false,
              invItem
            };
          }
          map[key].totalQty += (ing.qty * item.portion); // Scale by portion multiplier!
        });
      }
    });
  });

  // Second pass: compute low stock after all qty is aggregated
  Object.values(map).forEach(ingObj => {
    if (ingObj.invItem) {
      ingObj.isLowStock = (ingObj.invItem.quantity - ingObj.totalQty) <= ingObj.invItem.reorderLevel;
    } else {
      ingObj.isLowStock = true; // Not in inventory
    }
  });

  return Object.values(map).sort((a, b) => b.totalQty - a.totalQty);
});

const hasLowStock = computed(() => aggregatedIngredients.value.some(i => i.isLowStock));

</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
