<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div class="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
          <ChefHat :size="24" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-800 tracking-tight">Dish Menu</h1>
          <p class="text-sm text-gray-500">Manage hospital meal options and nutritional information</p>
        </div>
      </div>
      <button
        @click="openAddModal"
        class="inline-flex items-center space-x-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-sm shadow-sm transition-colors"
      >
        <Plus :size="18" />
        <span>Add Dish</span>
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div class="flex items-center space-x-2 mb-1">
          <Utensils :size="14" class="text-orange-500" />
          <span class="text-xs font-semibold text-orange-500 uppercase tracking-wide">Total Dishes</span>
        </div>
        <p class="text-3xl font-bold text-gray-900">{{ dishes.length }}</p>
      </div>
      <div class="bg-[#f0fdf4] rounded-xl p-4 border border-[#dcfce7] shadow-sm">
        <div class="flex items-center space-x-2 mb-1">
          <Sun :size="14" class="text-green-600" />
          <span class="text-xs font-semibold text-green-600 uppercase tracking-wide">Breakfast</span>
        </div>
        <p class="text-3xl font-bold text-green-700">{{ countByType('Breakfast') }}</p>
      </div>
      <div class="bg-[#fffbeb] rounded-xl p-4 border border-[#fef3c7] shadow-sm">
        <div class="flex items-center space-x-2 mb-1">
          <Coffee :size="14" class="text-yellow-600" />
          <span class="text-xs font-semibold text-yellow-600 uppercase tracking-wide">Lunch</span>
        </div>
        <p class="text-3xl font-bold text-yellow-700">{{ countByType('Lunch') }}</p>
      </div>
      <div class="bg-[#eff6ff] rounded-xl p-4 border border-[#dbeafe] shadow-sm">
        <div class="flex items-center space-x-2 mb-1">
          <Moon :size="14" class="text-blue-600" />
          <span class="text-xs font-semibold text-blue-600 uppercase tracking-wide">Dinner</span>
        </div>
        <p class="text-3xl font-bold text-blue-700">{{ countByType('Dinner') }}</p>
      </div>
    </div>

    <!-- Filter & Search Bar -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col md:flex-row gap-3">
      <div class="relative flex-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search :size="15" class="text-gray-400" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search dishes..."
          class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition-all"
        />
      </div>
      <div class="flex items-center gap-3">
        <select v-model="typeFilter" class="px-3 py-2 border border-gray-200 rounded-xl focus:border-orange-500 outline-none text-sm bg-white">
          <option value="">All Types</option>
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
        </select>
        <select v-model="dietFilter" class="px-3 py-2 border border-gray-200 rounded-xl focus:border-orange-500 outline-none text-sm bg-white">
          <option value="">All Diets</option>
          <option v-for="diet in dietTypeOptions" :key="diet" :value="diet">{{ diet }}</option>
        </select>
      </div>
    </div>

    <!-- Dish Table -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-700 uppercase tracking-wide">
              <th class="px-6 py-3">Dish Name</th>
              <th class="px-6 py-3">Meal Type</th>
              <th class="px-6 py-3">Diet Category</th>
              <th class="px-6 py-3">Nutrition</th>
              <th class="px-6 py-3">Cost</th>
              <th class="px-6 py-3">Allergens</th>
              <th class="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="dish in filteredDishes" :key="dish.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm" :class="getMealTypeBg(dish.mealType)">
                    {{ getMealTypeEmoji(dish.mealType) }}
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900 text-sm">{{ dish.name }}</p>
                    <p class="text-xs text-gray-400 mt-0.5 max-w-[180px] truncate">{{ dish.description }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="px-2.5 py-1 rounded-full text-xs font-semibold" :class="getMealTypeBadge(dish.mealType)">
                  {{ dish.mealType }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="d in dish.dietCategories"
                    :key="d"
                    class="px-2 py-0.5 bg-gray-100 text-gray-600 border border-gray-200 rounded-full text-[10px] font-semibold"
                  >{{ d }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-semibold text-gray-800 text-sm">{{ dish.calories }} kcal</div>
                <div class="mt-1 flex items-center space-x-1.5 text-[10px] text-gray-400">
                  <span>P: <strong class="text-gray-600 font-bold">{{ dish.protein }}g</strong></span>
                  <span>•</span>
                  <span>C: <strong class="text-gray-600 font-bold">{{ dish.carbs }}g</strong></span>
                  <span>•</span>
                  <span>F: <strong class="text-gray-600 font-bold">{{ dish.fat }}g</strong></span>
                </div>
                <div class="text-[10px] text-gray-400 mt-0.5">Sodium: <strong class="text-gray-600 font-bold">{{ dish.sodium }}mg</strong></div>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm font-bold text-green-700">₱{{ dish.cost.toFixed(2) }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span v-if="dish.allergens.length === 0" class="text-xs text-gray-400 italic">None</span>
                  <span
                    v-for="a in dish.allergens"
                    :key="a"
                    class="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded-full text-[10px] font-semibold"
                  >{{ a }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-center space-x-2">
                  <button @click="openEditModal(dish)" class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors" title="Edit">
                    <Pencil :size="14" />
                  </button>
                  <button @click="deleteDish(dish.id)" class="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors" title="Delete">
                    <Trash2 :size="14" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredDishes.length === 0">
              <td colspan="7" class="px-6 py-14 text-center">
                <ChefHat :size="48" class="mx-auto mb-3 text-gray-300" />
                <p class="text-gray-500 text-sm font-medium">No dishes found</p>
                <p class="text-gray-400 text-xs mt-1">Try adjusting your filters or add a new dish</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Dish Modal -->
    <transition name="fade">
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden" @click.stop>
          <div class="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
            <div>
              <h2 class="text-lg font-bold text-gray-900">{{ editingDish ? 'Edit Dish' : 'Add New Dish' }}</h2>
              <p class="text-sm text-gray-500">{{ editingDish ? 'Update dish information' : 'Add a new dish to the menu' }}</p>
            </div>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600"><X :size="22" /></button>
          </div>

          <div class="p-5 overflow-y-auto flex-1 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Dish Name <span class="text-red-500">*</span></label>
                <input v-model="form.name" type="text" required placeholder="e.g. Grilled Chicken with Rice" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition-all" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Meal Type <span class="text-red-500">*</span></label>
                <select v-model="form.mealType" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-orange-500 outline-none text-sm bg-white">
                  <option value="">Select type</option>
                  <option>Breakfast</option>
                  <option>Lunch</option>
                  <option>Dinner</option>
                </select>
              </div>
              <div class="col-span-2">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Diet Categories <span class="text-xs text-gray-400 font-normal ml-1">(Select multiple)</span>
                </label>
                <div class="border border-gray-200 rounded-xl p-3 focus-within:border-orange-500 transition-all bg-white">
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="diet in dietTypeOptions"
                      :key="diet"
                      type="button"
                      @click="toggleDietCategory(diet)"
                      class="px-2.5 py-1 rounded-md text-xs font-medium border transition-all"
                      :class="form.dietCategories.includes(diet)
                        ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-orange-300 hover:bg-orange-50'"
                    >
                      {{ diet }}
                    </button>
                  </div>
                </div>
                <p v-if="form.dietCategories.length === 0" class="text-xs text-red-500 mt-1">Please select at least one diet category.</p>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Cost (₱) <span class="text-red-500">*</span></label>
                <input v-model.number="form.cost" type="number" min="0" step="0.01" placeholder="0.00" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-orange-500 outline-none text-sm" />
              </div>
              <!-- Nutrition Information Section -->
              <div class="col-span-2 bg-gray-50/50 rounded-xl p-4 border border-gray-200/60">
                <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Nutrition Information (per serving)</h3>
                <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Calories (kcal)</label>
                    <input v-model.number="form.calories" type="number" min="0" placeholder="0" class="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:border-orange-500 outline-none text-xs" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Protein (g)</label>
                    <input v-model.number="form.protein" type="number" min="0" placeholder="0" class="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:border-orange-500 outline-none text-xs" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Carbs (g)</label>
                    <input v-model.number="form.carbs" type="number" min="0" placeholder="0" class="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:border-orange-500 outline-none text-xs" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Fat (g)</label>
                    <input v-model.number="form.fat" type="number" min="0" placeholder="0" class="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:border-orange-500 outline-none text-xs" />
                  </div>
                  <div class="col-span-2 sm:col-span-1">
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Sodium (mg)</label>
                    <input v-model.number="form.sodium" type="number" min="0" placeholder="0" class="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:border-orange-500 outline-none text-xs" />
                  </div>
                </div>
              </div>
              <div class="col-span-2">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea v-model="form.description" rows="2" placeholder="Brief description of the dish..." class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-orange-500 outline-none text-sm resize-none transition-all"></textarea>
              </div>
              <div class="col-span-2">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Allergens</label>
                <div class="flex flex-wrap gap-2 mb-2">
                  <label v-for="allergen in allergenOptions" :key="allergen" class="flex items-center space-x-1.5 cursor-pointer text-sm">
                    <input type="checkbox" :value="allergen" v-model="form.allergens" class="rounded accent-orange-500" />
                    <span class="text-gray-700">{{ allergen }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div v-if="formSuccess" class="flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
              <CheckCircle :size="14" /><span>Dish {{ editingDish ? 'updated' : 'added' }} successfully!</span>
            </div>

            <div class="flex justify-end space-x-3 pt-2 border-t border-gray-100">
              <button @click="closeModal" class="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 text-sm">Cancel</button>
              <button @click="handleSubmit" class="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold flex items-center space-x-2 text-sm shadow-sm transition-colors">
                <Save :size="16" /><span>{{ editingDish ? 'Update' : 'Add' }} Dish</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>

import { ref, computed, watch } from 'vue';
import { useDataStore } from '@/stores/dataStore';
import {
  ChefHat, Plus, Search, Utensils, Sun, Coffee, Moon,
  Pencil, Trash2, X, Save, CheckCircle } from
'lucide-vue-next';

const dataStore = useDataStore();

const allergenOptions = ['Gluten', 'Dairy', 'Eggs', 'Shellfish', 'Nuts', 'Soy', 'Fish', 'Peanuts'];

const dishes = computed(() => dataStore.dishes);

const searchQuery = ref('');
const typeFilter = ref('');
const dietFilter = ref('');
const isModalOpen = ref(false);
const editingDish = ref(null);
const formSuccess = ref(false);

const dietTypeOptions = [
'Normal Diet',
'Soft Diet',
'Full Liquid Diet',
'Bland Diet',
'DM (Diabetic Mellitus) Diet',
'Low Salt/Low Fat',
'Low Purine',
'Carbohydrate',
'High Protein',
'High Fiber'];


function toggleDietCategory(diet) {
  const idx = form.value.dietCategories.indexOf(diet);
  if (idx === -1) {
    form.value.dietCategories.push(diet);
  } else {
    form.value.dietCategories.splice(idx, 1);
  }
}

const defaultForm = () => ({
  name: '',
  mealType: '',
  dietCategories: [],
  cost: 0,
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  sodium: 0,
  description: '',
  allergens: []
});

const form = ref(defaultForm());

// Auto-populate nutrition information based on name keywords when adding a new dish
watch(() => form.value.name, (newName) => {
  // Only auto-populate when creating a new dish (not editing) to avoid overwriting dietitian adjustments
  if (editingDish.value) return;

  if (!newName) {
    // Reset if empty
    form.value.calories = 0;
    form.value.protein = 0;
    form.value.carbs = 0;
    form.value.fat = 0;
    form.value.sodium = 0;
    return;
  }

  const query = newName.toLowerCase();

  // Keyword database for typical ingredient nutrition properties per serving
  const items = [
  { keys: ['chicken', 'tinola', 'adobo'], calories: 200, protein: 28, carbs: 2, fat: 8, sodium: 350 },
  { keys: ['fish', 'fillet', 'sinigang na isda'], calories: 140, protein: 22, carbs: 0, fat: 4, sodium: 180 },
  { keys: ['beef', 'stew', 'bulalo'], calories: 280, protein: 25, carbs: 3, fat: 18, sodium: 450 },
  { keys: ['pork', 'menudo'], calories: 260, protein: 24, carbs: 2, fat: 16, sodium: 420 },
  { keys: ['egg', 'scrambled', 'omelet'], calories: 90, protein: 7, carbs: 1, fat: 6, sodium: 120 },
  { keys: ['oatmeal', 'oats'], calories: 150, protein: 5, carbs: 27, fat: 2.5, sodium: 10 },
  { keys: ['rice', 'lugaw', 'porridge'], calories: 130, protein: 3, carbs: 28, fat: 0.5, sodium: 5 },
  { keys: ['pancake', 'toast', 'bread', 'waffle'], calories: 180, protein: 5, carbs: 35, fat: 3, sodium: 280 },
  { keys: ['tofu', 'soy'], calories: 90, protein: 10, carbs: 3, fat: 5, sodium: 15 },
  { keys: ['vegetable', 'salad', 'stir fry', 'sayote'], calories: 60, protein: 2, carbs: 10, fat: 1, sodium: 80 },
  { keys: ['fruit', 'banana', 'apple', 'orange', 'mango'], calories: 70, protein: 1, carbs: 18, fat: 0.2, sodium: 2 },
  { keys: ['soup', 'broth'], calories: 50, protein: 2, carbs: 8, fat: 1, sodium: 320 }];


  let totalCal = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalSodium = 0;
  let matched = false;

  // Scan keywords and accumulate nutrition properties
  items.forEach((item) => {
    const hasKeyword = item.keys.some((k) => query.includes(k));
    if (hasKeyword) {
      totalCal += item.calories;
      totalProtein += item.protein;
      totalCarbs += item.carbs;
      totalFat += item.fat;
      totalSodium += item.sodium;
      matched = true;
    }
  });

  // If matched, populate, otherwise keep defaults
  if (matched) {
    form.value.calories = totalCal;
    form.value.protein = totalProtein;
    form.value.carbs = totalCarbs;
    form.value.fat = totalFat;
    form.value.sodium = totalSodium;
  }
});


const filteredDishes = computed(() => {
  let list = [...dishes.value];
  if (typeFilter.value) list = list.filter((d) => d.mealType === typeFilter.value);
  if (dietFilter.value) list = list.filter((d) => d.dietCategories.includes(dietFilter.value));
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter((d) =>
    d.name.toLowerCase().includes(q) ||
    d.description.toLowerCase().includes(q) ||
    d.dietCategories.some((cat) => cat.toLowerCase().includes(q))
    );
  }
  return list;
});

function countByType(type) {
  return dishes.value.filter((d) => d.mealType === type).length;
}

function getMealTypeBg(type) {
  const map = { Breakfast: 'bg-yellow-50', Lunch: 'bg-orange-50', Dinner: 'bg-blue-50' };
  return map[type] || 'bg-gray-50';
}
function getMealTypeEmoji(type) {
  const map = { Breakfast: '🌅', Lunch: '☀️', Dinner: '🌙' };
  return map[type] || '🍽️';
}
function getMealTypeBadge(type) {
  const map = {
    Breakfast: 'bg-yellow-100 text-yellow-800',
    Lunch: 'bg-orange-100 text-orange-800',
    Dinner: 'bg-blue-100 text-blue-800'
  };
  return map[type] || 'bg-gray-100 text-gray-700';
}

function openAddModal() {
  editingDish.value = null;
  form.value = defaultForm();
  formSuccess.value = false;
  isModalOpen.value = true;
}

function openEditModal(dish) {
  editingDish.value = dish;
  form.value = { ...dish, allergens: [...dish.allergens], dietCategories: [...dish.dietCategories] };
  formSuccess.value = false;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  setTimeout(() => {editingDish.value = null;}, 200);
}

function handleSubmit() {
  if (!form.value.name || !form.value.mealType || form.value.dietCategories.length === 0) return;
  if (editingDish.value) {
    dataStore.updateDish(editingDish.value.id, form.value);
  } else {
    dataStore.addDish({ id: `D${String(dishes.value.length + 1).padStart(3, '0')}`, ...form.value });
  }
  formSuccess.value = true;
  setTimeout(() => {formSuccess.value = false;closeModal();}, 1500);
}

function deleteDish(id) {
  dataStore.deleteDish(id);
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
