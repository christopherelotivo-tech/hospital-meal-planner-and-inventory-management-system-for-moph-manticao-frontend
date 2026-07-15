<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center space-x-4 mb-2">
      <div class="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
        <CalendarDays :size="24" />
      </div>
      <div>
        <h1 class="text-2xl font-bold text-gray-800 tracking-tight">Hospital Menu Calendar</h1>
        <p class="text-sm text-gray-500">Plan and schedule the hospital daily menu dishes. Click a date to add, view, or remove scheduled dishes.</p>
      </div>
    </div>

    <!-- Month Navigation -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <button @click="prevMonth" class="w-9 h-9 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors">
          <ChevronLeft :size="18" />
        </button>
        <div class="text-center">
          <h2 class="text-lg font-bold text-gray-900">{{ monthName }} {{ currentYear }}</h2>
          <p class="text-xs text-gray-500">{{ totalMealsThisMonth }} planned dish entries this month</p>
        </div>
        <button @click="nextMonth" class="w-9 h-9 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors">
          <ChevronRight :size="18" />
        </button>
      </div>

      <!-- Day Labels -->
      <div class="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
        <div v-for="day in dayLabels" :key="day" class="px-2 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
          {{ day }}
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="grid grid-cols-7">
        <div v-for="n in firstDayOfMonth" :key="'empty-' + n" class="min-h-[110px] border-b border-r border-gray-100 bg-gray-50/30" />

        <div
          v-for="day in daysInMonth"
          :key="day"
          class="min-h-[110px] border-b border-r border-gray-100 p-2 cursor-pointer transition-colors relative group"
          :class="{
            'bg-blue-50/70 ring-2 ring-inset ring-blue-300': isToday(day),
            'bg-teal-50/20 hover:bg-teal-50/60': getMenuForDay(day).length > 0 && !isToday(day),
            'hover:bg-gray-50': getMenuForDay(day).length === 0 && !isToday(day)
          }"
          @click="openDayModal(day)"
        >
          <span class="text-xs font-bold inline-flex items-center justify-center w-6 h-6 rounded-full" :class="isToday(day) ? 'bg-blue-600 text-white' : 'text-gray-700'">
            {{ day }}
          </span>

          <!-- Add icon on hover for empty days -->
          <div v-if="getMenuForDay(day).length === 0" class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity mt-4">
            <Plus :size="16" class="text-teal-500" />
          </div>

          <!-- Scheduled dish indicators -->
          <div class="mt-1.5 space-y-1">
            <div v-for="menu in getMenuForDay(day).slice(0, 3)" :key="menu.id" class="text-[9px] px-1.5 py-0.5 rounded font-semibold truncate leading-tight flex items-center space-x-1" :class="getMealTypeBadge(menu.mealType)">
              <span>{{ getMealTypeEmoji(menu.mealType) }}</span>
              <span class="truncate">{{ menu.dishName }}</span>
            </div>
            <div v-if="getMenuForDay(day).length > 3" class="text-[8px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-bold text-center">
              +{{ getMenuForDay(day).length - 3 }} more dishes
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-center space-x-4">
        <div class="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
          <Utensils :size="18" />
        </div>
        <div>
          <h3 class="text-2xl font-bold text-teal-700 leading-none mb-1">{{ totalMealsThisMonth }}</h3>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Dishes Scheduled</p>
        </div>
      </div>
      <div class="bg-[#f0fdf4] rounded-xl p-5 border border-[#dcfce7] shadow-sm flex items-center space-x-4">
        <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
          <ChefHat :size="18" />
        </div>
        <div>
          <h3 class="text-2xl font-bold text-green-700 leading-none mb-1">{{ uniqueDishesScheduledThisMonth }}</h3>
          <p class="text-xs font-semibold text-green-700 uppercase tracking-wide">Distinct Dishes Used</p>
        </div>
      </div>
      <div class="bg-[#fffbeb] rounded-xl p-5 border border-[#fef3c7] shadow-sm flex items-center space-x-4">
        <div class="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600">
          <CalendarDays :size="18" />
        </div>
        <div>
          <h3 class="text-2xl font-bold text-yellow-700 leading-none mb-1">{{ daysWithMealsThisMonth }}</h3>
          <p class="text-xs font-semibold text-yellow-700 uppercase tracking-wide">Planned Calendar Days</p>
        </div>
      </div>
    </div>

    <!-- Day Modal -->
    <transition name="fade">
      <div v-if="isDayModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" @click.stop>
          
          <!-- Modal Header -->
          <div class="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                {{ selectedDay }}
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900">{{ monthName }} {{ selectedDay }}, {{ currentYear }}</h2>
                <p class="text-sm text-gray-500">{{ getMenuForDay(selectedDay).length }} planned dish(es) • Add or modify scheduled dishes below</p>
              </div>
            </div>
            <button @click="closeDayModal" class="text-gray-400 hover:text-gray-600 transition-colors">
              <X :size="22" />
            </button>
          </div>

          <div class="overflow-y-auto flex-1">
            <!-- Scheduled Dishes for this Day -->
            <div class="p-5 border-b border-gray-100">
              <h3 class="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Planned Daily Menu</h3>
              
              <div v-if="getMenuForDay(selectedDay).length === 0" class="text-sm text-gray-400 italic py-6 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                No dishes scheduled for this date yet. Use the form below to plan dishes!
              </div>
              
              <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div v-for="type in ['Breakfast', 'Lunch', 'Dinner']" :key="type" class="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
                  <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2.5 flex items-center space-x-1">
                    <span>{{ getMealTypeEmoji(type) }}</span>
                    <span>{{ type }}</span>
                  </h4>
                  <div class="space-y-2">
                    <div 
                      v-for="item in getMenuForDay(selectedDay).filter(m => m.mealType === type)" 
                      :key="item.id" 
                      class="bg-white border border-gray-200/80 rounded-lg p-2.5 flex items-center justify-between text-xs shadow-sm hover:border-red-200 transition-colors group/item"
                    >
                      <div class="min-w-0 flex-1 pr-2">
                        <p class="font-semibold text-gray-800 truncate">{{ item.dishName }}</p>
                        <p class="text-[10px] text-gray-400 mt-0.5 font-medium">{{ item.calories }} kcal • {{ item.dietCategory }}</p>
                      </div>
                      <button @click="removeDishFromDay(item.id)" class="text-gray-400 hover:text-red-500 transition-colors focus:outline-none shrink-0" title="Remove Dish">
                        <Trash2 :size="14" />
                      </button>
                    </div>
                    <div v-if="getMenuForDay(selectedDay).filter(m => m.mealType === type).length === 0" class="text-[10px] text-gray-400 italic py-1">
                      No dish planned
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Add Dish to This Day -->
            <div class="p-5">
              <h3 class="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Add Dish to This Day's Menu</h3>
              <form @submit.prevent="addDishToDay" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Meal Type -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Meal Type <span class="text-red-500">*</span></label>
                    <select v-model="addForm.mealType" required class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-teal-600 outline-none text-sm bg-white transition-all">
                      <option value="Breakfast">Breakfast</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Dinner">Dinner</option>
                    </select>
                  </div>

                  <!-- Select Dish -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Select Dish <span class="text-red-500">*</span></label>
                    <select v-model="addForm.dishId" required class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-teal-600 outline-none text-sm bg-white transition-all">
                      <option value="">Choose Dish</option>
                      <option v-for="d in filteredDishCatalog" :key="d.id" :value="d.id">{{ d.name }} ({{ d.dietCategories[0] }} - ₱{{ d.cost }})</option>
                    </select>
                  </div>
                </div>

                <div v-if="addFormSuccess" class="flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                  <CheckCircle :size="14" />
                  <span>Dish successfully scheduled!</span>
                </div>

                <div class="flex justify-end space-x-3 pt-2">
                  <button type="button" @click="closeDayModal" class="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm">Cancel</button>
                  <button type="submit" class="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold flex items-center space-x-2 text-sm shadow-sm transition-colors">
                    <Plus :size="16" />
                    <span>Add to Menu</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>

import { ref, computed } from 'vue';
import { useDataStore } from '@/stores/dataStore';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Utensils,
  ChefHat,
  Plus,
  X,
  Trash2,
  CheckCircle } from
'lucide-vue-next';

const dataStore = useDataStore();

const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());

const selectedDay = ref(null);
const isDayModalOpen = ref(false);
const addFormSuccess = ref(false);

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const addForm = ref({
  mealType: 'Breakfast',
  dishId: ''
});

const filteredDishCatalog = computed(() => {
  return dataStore.dishes.filter((d) => d.mealType === addForm.value.mealType);
});

const monthName = computed(() => new Date(currentYear.value, currentMonth.value, 1).toLocaleString('en-US', { month: 'long' }));
const daysInMonth = computed(() => new Date(currentYear.value, currentMonth.value + 1, 0).getDate());
const firstDayOfMonth = computed(() => new Date(currentYear.value, currentMonth.value, 1).getDay());

function prevMonth() {
  if (currentMonth.value === 0) {currentMonth.value = 11;currentYear.value--;} else
  currentMonth.value--;
}
function nextMonth() {
  if (currentMonth.value === 11) {currentMonth.value = 0;currentYear.value++;} else
  currentMonth.value++;
}

function isToday(day) {
  return day === today.getDate() && currentMonth.value === today.getMonth() && currentYear.value === today.getFullYear();
}

function getMenuForDay(day) {
  const dateStr = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return dataStore.menuCalendar.filter((m) => m.date === dateStr);
}

function openDayModal(day) {
  selectedDay.value = day;
  addFormSuccess.value = false;
  resetAddForm();
  isDayModalOpen.value = true;
}

function closeDayModal() {
  isDayModalOpen.value = false;
  selectedDay.value = null;
}

function resetAddForm() {
  addForm.value = {
    mealType: 'Breakfast',
    dishId: ''
  };
}

function addDishToDay() {
  if (!selectedDay.value || !addForm.value.dishId) return;

  const dish = dataStore.dishes.find((d) => d.id === addForm.value.dishId);
  if (!dish) return;

  const dateStr = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(selectedDay.value).padStart(2, '0')}`;

  const newEntry = {
    id: `MC${Date.now()}`,
    date: dateStr,
    dishId: dish.id,
    dishName: dish.name,
    mealType: addForm.value.mealType,
    dietCategory: dish.dietCategories[0],
    cost: dish.cost,
    calories: dish.calories
  };

  dataStore.addMenuCalendarEntry(newEntry);
  addFormSuccess.value = true;
  resetAddForm();
  setTimeout(() => {addFormSuccess.value = false;}, 2000);
}

function removeDishFromDay(id) {
  dataStore.deleteMenuCalendarEntry(id);
}

function getMealTypeEmoji(type) {
  const map = { Breakfast: '🌅', Lunch: '☀️', Dinner: '🌙' };
  return map[type] || '🍽️';
}

function getMealTypeBadge(type) {
  const map = {
    Breakfast: 'bg-yellow-50 text-yellow-800 border border-yellow-100/70',
    Lunch: 'bg-orange-50 text-orange-800 border border-orange-100/70',
    Dinner: 'bg-blue-50 text-blue-800 border border-blue-100/70'
  };
  return map[type] || 'bg-gray-50 text-gray-700';
}

// Stats computations
const thisMonthMenuEntries = computed(() => {
  return dataStore.menuCalendar.filter((m) => {
    const d = new Date(m.date);
    return d.getMonth() === currentMonth.value && d.getFullYear() === currentYear.value;
  });
});

const totalMealsThisMonth = computed(() => thisMonthMenuEntries.value.length);
const uniqueDishesScheduledThisMonth = computed(() => new Set(thisMonthMenuEntries.value.map((m) => m.dishId)).size);
const daysWithMealsThisMonth = computed(() => new Set(thisMonthMenuEntries.value.map((m) => m.date)).size);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
