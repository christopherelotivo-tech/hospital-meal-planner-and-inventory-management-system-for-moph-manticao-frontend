<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div class="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
          <Utensils :size="24" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-800 tracking-tight">Meal Assignment</h1>
          <p class="text-sm text-gray-500">Assign meals to patients based on doctor's prescriptions</p>
        </div>
      </div>
    </div>

    <!-- Patient Table -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 class="text-base font-bold text-gray-900">Select a Patient</h2>
          <p class="text-sm text-gray-500 mt-0.5">Choose a patient to create or edit their meal plan</p>
        </div>
        <div class="relative w-full md:w-64">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search :size="15" class="text-gray-400" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search patients..."
            class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none transition-all text-sm"
          />
        </div>
      </div>
      <div class="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table class="w-full text-left border-collapse relative">
          <thead class="sticky top-0 z-10 bg-white">
            <tr class="border-b border-gray-200 text-xs font-bold text-gray-700 bg-gray-50">
              <th class="px-6 py-3 shadow-[0_1px_0_#e5e7eb]">Patient Name</th>
              <th class="px-6 py-3 shadow-[0_1px_0_#e5e7eb]">Room</th>
              <th class="px-6 py-3 shadow-[0_1px_0_#e5e7eb]">Diagnosis</th>
              <th class="px-6 py-3 shadow-[0_1px_0_#e5e7eb]">Diet Prescription</th>
              <th class="px-6 py-3 shadow-[0_1px_0_#e5e7eb]">Allergies</th>
              <th class="px-6 py-3 shadow-[0_1px_0_#e5e7eb]">Current Assignment</th>
              <th class="px-6 py-3 text-right shadow-[0_1px_0_#e5e7eb]">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="item in filteredTableData" :key="item.patient.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 font-medium text-gray-900 text-sm">{{ item.patient.name }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">Room {{ item.patient.room.split('-')[0] }}</td>
              <td class="px-6 py-4 text-sm text-blue-600 font-medium">{{ item.patient.condition }}</td>
              <td class="px-6 py-4">
                <span v-if="item.prescription" class="inline-flex items-center text-xs font-medium text-green-700">
                  <LinkIcon :size="12" class="mr-1" />
                  {{ item.prescription.dietType }}
                </span>
                <span v-else class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                  <AlertCircle :size="12" class="mr-1" /> Not Prescribed
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ item.patientAllergies }}</td>
              <td class="px-6 py-4">
                <div v-if="item.todayMeal" class="space-y-2">
                  <div v-if="item.todayMeal.breakfastProtein" class="flex items-start text-xs text-gray-600">
                    <span class="w-2 h-2 rounded-full bg-yellow-400 mt-1 mr-1.5 shrink-0"></span>
                    <div>
                      <div class="font-semibold">{{ item.todayMeal.breakfastProtein }}</div>
                      <div class="text-[10px] text-gray-400">{{ item.todayMeal.breakfastCarb }} • {{ item.todayMeal.breakfastSide || 'No Side' }}</div>
                    </div>
                  </div>
                  <div v-if="item.todayMeal.lunchProtein" class="flex items-start text-xs text-gray-600">
                    <span class="w-2 h-2 rounded-full bg-orange-400 mt-1 mr-1.5 shrink-0"></span>
                    <div>
                      <div class="font-semibold">{{ item.todayMeal.lunchProtein }}</div>
                      <div class="text-[10px] text-gray-400">{{ item.todayMeal.lunchCarb }} • {{ item.todayMeal.lunchSide || 'No Side' }}</div>
                    </div>
                  </div>
                  <div v-if="item.todayMeal.dinnerProtein" class="flex items-start text-xs text-gray-600">
                    <span class="w-2 h-2 rounded-full bg-blue-400 mt-1 mr-1.5 shrink-0"></span>
                    <div>
                      <div class="font-semibold">{{ item.todayMeal.dinnerProtein }}</div>
                      <div class="text-[10px] text-gray-400">{{ item.todayMeal.dinnerCarb }} • {{ item.todayMeal.dinnerSide || 'No Side' }}</div>
                    </div>
                  </div>
                </div>
                <span v-else class="text-xs text-gray-400 italic">Not assigned</span>
              </td>
              <td class="px-6 py-4 text-right">
                <button @click="openAssignModal(item.patient, item.todayMeal)"
                  class="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-bold text-white shadow-sm transition-colors"
                  :class="item.todayMeal ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'">
                  <Pencil v-if="item.todayMeal" :size="14" />
                  <span>{{ item.todayMeal ? 'Edit Meals' : 'Assign Meals' }}</span>
                  <ChevronRight :size="14" />
                </button>
              </td>
            </tr>
            <tr v-if="filteredTableData.length === 0">
              <td colspan="7" class="px-6 py-12 text-center text-gray-500 text-sm">No patients match your search.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Assign/Edit Modal -->
    <transition name="fade">
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden" @click.stop>
          <div class="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
            <div>
              <h2 class="text-lg font-bold text-gray-900">{{ editingMeal ? 'Edit Meals' : 'Assign Meals' }}</h2>
              <p class="text-sm text-gray-500">{{ modalPatient?.name }} — Room {{ modalPatient?.room }}</p>
            </div>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600"><X :size="22" /></button>
          </div>

          <div class="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
            <!-- Left Side: Form Inputs -->
            <div class="md:w-2/3 p-6 space-y-6 overflow-y-auto border-r border-gray-100">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Date <span class="text-red-500">*</span></label>
                <input v-model="modalForm.date" type="date" required class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-green-600 outline-none text-sm" />
              </div>

              <div v-if="modalPrescription" class="flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-xs text-green-800">
                <CheckCircle :size="13" /><span>Diet: <strong>{{ modalPrescription.dietType }}</strong></span>
              </div>

              <div v-for="slot in modalSlots" :key="slot.key" class="rounded-xl p-4 border" :class="slot.bg">
                <label class="block text-xs font-bold uppercase tracking-wide mb-3" :class="slot.label">{{ slot.emoji }} {{ slot.name }}</label>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <!-- Carb -->
                  <div>
                    <span class="text-[10px] font-semibold text-gray-500 uppercase">🌾 Carb</span>
                    <SearchableSelect 
                      v-model="modalForm[slot.key + 'Carb']" 
                      @change="calcModalCost"
                      :options="getComponentOptions(slot.items, 'Carbohydrate-Controlled Diet')"
                      placeholder="Search Carb..."
                      valueKey="name"
                      class="mt-1"
                    />
                  </div>
                  <!-- Viand -->
                  <div>
                    <span class="text-[10px] font-semibold text-gray-500 uppercase">🍗 Viand</span>
                    <SearchableSelect 
                      v-model="modalForm[slot.key + 'Protein']" 
                      @change="calcModalCost"
                      :options="getComponentOptions(slot.items, 'Protein/Viand')"
                      placeholder="Search Viand..."
                      valueKey="name"
                      class="mt-1"
                    />
                  </div>
                  <!-- Side -->
                  <div>
                    <span class="text-[10px] font-semibold text-gray-500 uppercase">🍎 Side/Fruit</span>
                    <SearchableSelect 
                      v-model="modalForm[slot.key + 'Side']" 
                      @change="calcModalCost"
                      :options="getComponentOptions(slot.items, 'Side/Fruit')"
                      placeholder="Search Side..."
                      valueKey="name"
                      class="mt-1"
                    />
                  </div>
                </div>
                
                <!-- Portion Controls -->
                <div v-if="modalForm[slot.key + 'Protein'] || modalForm[slot.key + 'Carb']" class="mt-4 pt-3 border-t border-gray-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div class="flex items-center space-x-2">
                    <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Portion:</span>
                    <div class="flex bg-white rounded-lg border border-gray-200 p-0.5 shadow-sm">
                      <button @click="setPortion(slot.key, 0.8)" class="px-3 py-1 text-xs font-semibold rounded-md transition-colors" :class="modalForm[slot.key + 'Portion'] === 0.8 ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-100'">0.8x</button>
                      <button @click="setPortion(slot.key, 1.0)" class="px-3 py-1 text-xs font-semibold rounded-md transition-colors" :class="modalForm[slot.key + 'Portion'] === 1.0 ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-100'">1.0x</button>
                      <button @click="setPortion(slot.key, 1.2)" class="px-3 py-1 text-xs font-semibold rounded-md transition-colors" :class="modalForm[slot.key + 'Portion'] === 1.2 ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-100'">1.2x</button>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="text-xs font-bold text-gray-700 bg-white px-2 py-1 rounded border border-gray-100 shadow-sm">
                      {{ getMealCalories(slot.items, modalForm[slot.key + 'Carb'], modalForm[slot.key + 'Protein'], modalForm[slot.key + 'Side'], modalForm[slot.key + 'Portion']) }} kcal
                    </span>
                  </div>
                </div>
              </div>

              <!-- Feeding Instructions -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Feeding Instructions</label>
                <div v-if="modalPrescription?.feedingInstructions" class="mb-2 text-xs text-gray-500 flex items-start space-x-1.5 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                  <ClipboardList :size="13" class="text-blue-500 mt-0.5 shrink-0" />
                  <span>From prescription: <em>{{ modalPrescription.feedingInstructions }}</em></span>
                </div>
                <textarea
                  v-model="modalForm.feedingInstructions"
                  rows="3"
                  placeholder="e.g. Small frequent meals, monitor blood glucose, no added salt..."
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none text-sm resize-none transition-all"
                ></textarea>
              </div>
            </div>

            <!-- Right Side: Sticky Calorie Ring -->
            <div class="md:w-1/3 bg-gray-50 p-6 flex flex-col items-center shrink-0 overflow-y-auto">
              <h3 class="text-sm font-bold text-gray-700 w-full mb-6 text-center uppercase tracking-wider">Daily Calorie Target</h3>
              
              <div class="relative w-40 h-40 mb-8">
                <!-- SVG Ring -->
                <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#E5E7EB" stroke-width="8" fill="none" />
                  <circle cx="50" cy="50" r="40" :stroke="calorieRingColor" stroke-width="8" fill="none" stroke-linecap="round"
                    :stroke-dasharray="251.2"
                    :stroke-dashoffset="251.2 - (251.2 * Math.min(100, caloriePercent)) / 100"
                    class="transition-all duration-700 ease-out" />
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <span class="text-3xl font-black tracking-tighter" :class="calorieTextColor">{{ totalCalories }}</span>
                  <span class="text-[10px] text-gray-500 font-bold uppercase mt-1">/ 1,800 kcal</span>
                </div>
              </div>

              <div class="w-full space-y-3 mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div class="flex justify-between items-center text-xs">
                  <span class="text-gray-500 font-semibold flex items-center"><span class="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>Breakfast</span>
                  <span class="font-bold text-gray-800">{{ bCals }} kcal</span>
                </div>
                <div class="flex justify-between items-center text-xs">
                  <span class="text-gray-500 font-semibold flex items-center"><span class="w-2 h-2 rounded-full bg-orange-400 mr-2"></span>Lunch</span>
                  <span class="font-bold text-gray-800">{{ lCals }} kcal</span>
                </div>
                <div class="flex justify-between items-center text-xs">
                  <span class="text-gray-500 font-semibold flex items-center"><span class="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>Dinner</span>
                  <span class="font-bold text-gray-800">{{ dCals }} kcal</span>
                </div>
                <div class="border-t border-gray-100 pt-2 flex justify-between text-sm font-black">
                  <span class="text-gray-800">Total Intake</span>
                  <span :class="calorieTextColor">{{ totalCalories }} kcal</span>
                </div>
              </div>
              
              <div class="w-full mt-auto">
                <div class="flex items-center justify-between px-4 py-3 rounded-xl mb-3 shadow-sm border" :class="modalForm.totalCost > 150 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'">
                  <span class="text-xs font-bold uppercase tracking-wider" :class="modalForm.totalCost > 150 ? 'text-red-900' : 'text-emerald-900'">Daily Cost</span>
                  <span class="text-lg font-black" :class="modalForm.totalCost > 150 ? 'text-red-700' : 'text-emerald-700'">₱{{ modalForm.totalCost.toFixed(2) }}</span>
                </div>
                <p class="text-[11px] text-center font-bold px-2 py-1.5 rounded-lg border" :class="calorieMessageStyle">{{ calorieMessage }}</p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-4 border-t border-gray-100 bg-white shrink-0">

            <div v-if="modalError" class="flex items-center space-x-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              <AlertCircle :size="14" class="shrink-0" /><span>{{ modalError }}</span>
            </div>

            <div v-if="modalSuccess" class="flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
              <CheckCircle :size="14" /><span>Meal assigned successfully!</span>
            </div>

            <div class="flex justify-end space-x-3 pt-1">
              <button @click="closeModal" class="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 text-sm">Cancel</button>
              <button @click="handleModalSubmit" class="px-5 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 flex items-center space-x-2 text-sm shadow-sm">
                <Save :size="16" /><span>{{ editingMeal ? 'Update' : 'Assign' }} Meals</span>
              </button>
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
import { useAuthStore } from '@/stores/authStore';
import { 
  Utensils, Calendar, ChevronRight, X, UserX, AlertCircle, Link as LinkIcon, AlertTriangle, UserPlus, CheckCircle, Pencil, Search, ClipboardList, Save
} from 'lucide-vue-next';
import SearchableSelect from '@/components/common/SearchableSelect.vue';

const dataStore = useDataStore();
const authStore = useAuthStore();

const searchQuery = ref('');
const isModalOpen = ref(false);
const modalSuccess = ref(false);
const modalError = ref('');
const modalPatient = ref(null);
const editingMeal = ref(null);

const today = new Date().toISOString().split('T')[0];

const breakfastOptions = computed(() => dataStore.dishes.filter((d) => d.mealType === 'Breakfast'));
const lunchOptions = computed(() => dataStore.dishes.filter((d) => d.mealType === 'Lunch'));
const dinnerOptions = computed(() => dataStore.dishes.filter((d) => d.mealType === 'Dinner'));

const modalSlots = computed(() => [
{ key: 'breakfast', name: 'Breakfast', emoji: '🌅', items: breakfastOptions.value, bg: 'bg-yellow-50/50 border-yellow-100', label: 'text-yellow-800' },
{ key: 'lunch', name: 'Lunch', emoji: '☀️', items: lunchOptions.value, bg: 'bg-orange-50/50 border-orange-100', label: 'text-orange-800' },
{ key: 'dinner', name: 'Dinner', emoji: '🌙', items: dinnerOptions.value, bg: 'bg-blue-50/50 border-blue-100', label: 'text-blue-800' }]
);

const modalForm = ref({ date: today, breakfastCarb: '', breakfastProtein: '', breakfastSide: '', lunchCarb: '', lunchProtein: '', lunchSide: '', dinnerCarb: '', dinnerProtein: '', dinnerSide: '', breakfastPortion: 1.0, lunchPortion: 1.0, dinnerPortion: 1.0, breakfastCost: 0, lunchCost: 0, dinnerCost: 0, totalCost: 0, feedingInstructions: '' });

const activePatients = computed(() => dataStore.patients.filter((p) => p.status === 'Active'));

function getPrescription(patientId) {
  return dataStore.prescriptions.find((rx) => rx.patientId === patientId && rx.status === 'Active');
}

const modalPrescription = computed(() => {
  if (!modalPatient.value) return null;
  return dataStore.prescriptions.find((p) => p.patientId === modalPatient.value.id && p.status === 'Active');
});

const tableData = computed(() => {
  return activePatients.value.map((patient) => {
    const prescription = dataStore.prescriptions.find((rx) => rx.patientId === patient.id && rx.status === 'Active');
    const todayMeal = dataStore.mealAssignments.find((m) => m.patientId === patient.id && m.date === today);
    const patientAllergies = prescription?.allergies.join(', ') || 'None';
    return { patient, prescription, todayMeal, patientAllergies };
  });
});

const filteredTableData = computed(() => {
  const q = searchQuery.value.toLowerCase();
  if (!q) return tableData.value;
  return tableData.value.filter((item) =>
  item.patient.name.toLowerCase().includes(q) ||
  item.patient.room.toLowerCase().includes(q) ||
  item.patient.condition.toLowerCase().includes(q) ||
  (item.prescription?.dietType ?? '').toLowerCase().includes(q)
  );
});

function getComponentOptions(opts, componentType) {
  return opts.filter(o => o.componentType === componentType);
}

function getMealCost(opts, carb, protein, side, portion = 1.0) {
  const cCost = opts.find((m) => m.name === carb)?.cost ?? 0;
  const pCost = opts.find((m) => m.name === protein)?.cost ?? 0;
  const sCost = opts.find((m) => m.name === side)?.cost ?? 0;
  return (cCost + pCost + sCost) * portion;
}

function getMealCalories(opts, carb, protein, side, portion = 1.0) {
  const cCals = opts.find((m) => m.name === carb)?.calories ?? 0;
  const pCals = opts.find((m) => m.name === protein)?.calories ?? 0;
  const sCals = opts.find((m) => m.name === side)?.calories ?? 0;
  return Math.round((cCals + pCals + sCals) * portion);
}

function setPortion(slotKey, portion) {
  modalForm.value[`${slotKey}Portion`] = portion;
  calcModalCost();
}

function calcModalCost() {
  modalForm.value.breakfastCost = getMealCost(breakfastOptions.value, modalForm.value.breakfastCarb, modalForm.value.breakfastProtein, modalForm.value.breakfastSide, modalForm.value.breakfastPortion);
  modalForm.value.lunchCost = getMealCost(lunchOptions.value, modalForm.value.lunchCarb, modalForm.value.lunchProtein, modalForm.value.lunchSide, modalForm.value.lunchPortion);
  modalForm.value.dinnerCost = getMealCost(dinnerOptions.value, modalForm.value.dinnerCarb, modalForm.value.dinnerProtein, modalForm.value.dinnerSide, modalForm.value.dinnerPortion);
  modalForm.value.totalCost = modalForm.value.breakfastCost + modalForm.value.lunchCost + modalForm.value.dinnerCost;
}

// ── Calorie Ring Computed Properties ────────────────────────────────────
const bCals = computed(() => getMealCalories(breakfastOptions.value, modalForm.value.breakfastCarb, modalForm.value.breakfastProtein, modalForm.value.breakfastSide, modalForm.value.breakfastPortion));
const lCals = computed(() => getMealCalories(lunchOptions.value, modalForm.value.lunchCarb, modalForm.value.lunchProtein, modalForm.value.lunchSide, modalForm.value.lunchPortion));
const dCals = computed(() => getMealCalories(dinnerOptions.value, modalForm.value.dinnerCarb, modalForm.value.dinnerProtein, modalForm.value.dinnerSide, modalForm.value.dinnerPortion));
const totalCalories = computed(() => bCals.value + lCals.value + dCals.value);
const caloriePercent = computed(() => (totalCalories.value / 1800) * 100);

const calorieStatus = computed(() => {
  if (totalCalories.value === 0) return 'empty';
  if (totalCalories.value > 1980) return 'over'; // +10%
  if (totalCalories.value < 1620) return 'under'; // -10%
  return 'target'; // within ±10%
});

const calorieRingColor = computed(() => {
  switch(calorieStatus.value) {
    case 'over': return '#EF4444'; // red-500
    case 'under': return '#F59E0B'; // amber-500
    case 'target': return '#10B981'; // emerald-500
    default: return '#E5E7EB'; // gray-200
  }
});

const calorieTextColor = computed(() => {
  switch(calorieStatus.value) {
    case 'over': return 'text-red-600';
    case 'under': return 'text-amber-600';
    case 'target': return 'text-emerald-600';
    default: return 'text-gray-400';
  }
});

const calorieMessageStyle = computed(() => {
  switch(calorieStatus.value) {
    case 'over': return 'bg-red-50 border-red-200 text-red-700';
    case 'under': return 'bg-amber-50 border-amber-200 text-amber-700';
    case 'target': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
    default: return 'bg-gray-100 border-gray-200 text-gray-500';
  }
});

const calorieMessage = computed(() => {
  switch(calorieStatus.value) {
    case 'over': return '⚠️ Over calorie target. Consider 0.8x portions.';
    case 'under': return '⚠️ Under calorie target. Consider 1.2x portions.';
    case 'target': return '✅ Within target range.';
    default: return 'Assign meals to see calories.';
  }
});



function openAssignModal(patient, existingMeal) {
  modalPatient.value = patient;
  editingMeal.value = existingMeal ?? null;
  modalSuccess.value = false;
  modalError.value = '';
  modalForm.value = {
    date: existingMeal?.date ?? today,
    breakfastCarb: existingMeal?.breakfastCarb ?? '',
    breakfastProtein: existingMeal?.breakfastProtein ?? '',
    breakfastSide: existingMeal?.breakfastSide ?? '',
    lunchCarb: existingMeal?.lunchCarb ?? '',
    lunchProtein: existingMeal?.lunchProtein ?? '',
    lunchSide: existingMeal?.lunchSide ?? '',
    dinnerCarb: existingMeal?.dinnerCarb ?? '',
    dinnerProtein: existingMeal?.dinnerProtein ?? '',
    dinnerSide: existingMeal?.dinnerSide ?? '',
    breakfastPortion: existingMeal?.breakfastPortion ?? 1.0,
    lunchPortion: existingMeal?.lunchPortion ?? 1.0,
    dinnerPortion: existingMeal?.dinnerPortion ?? 1.0,
    breakfastCost: existingMeal?.breakfastCost ?? 0,
    lunchCost: existingMeal?.lunchCost ?? 0,
    dinnerCost: existingMeal?.dinnerCost ?? 0,
    totalCost: existingMeal?.totalCost ?? 0,
    feedingInstructions: existingMeal?.feedingInstructions ?? modalPrescription.value?.feedingInstructions ?? ''
  };
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  setTimeout(() => {modalPatient.value = null;editingMeal.value = null;}, 200);
}

function validateMealPlan(patientId, selectedDishesList, totalCost, assignDate) {
  // 💰 Rule 1: Budget Safety Rule
  if (totalCost > 150) {
    return `💰 Safety Check Failed: Budget exceeded! Total cost is ₱${totalCost.toFixed(2)}, which is above the ₱150.00 daily limit.`;
  }

  // 🚨 Rule 2 & 🍽️ Rule 3: Allergen + Dietary Prescription Rules
  const rx = getPrescription(patientId);
  if (rx) {
    const selectedDishes = selectedDishesList
      .map(name => dataStore.dishes.find(d => d.name === name))
      .filter(Boolean);

    for (const dish of selectedDishes) {
      // 🚨 Allergen Rule
      if (rx.allergies.length > 0) {
        const conflict = dish.allergens.find((a) => rx.allergies.includes(a));
        if (conflict) {
          return `🚨 Safety Check Failed: "${dish.name}" contains ${conflict}, which patient is allergic to!`;
        }
      }
      // 🍽️ Prescription Rule (Dietary Category Match)
      const prescribedDiets = rx.dietType.split(', ').map((d) => d.trim()).filter(Boolean);

      if (prescribedDiets.length > 0) {
        const hasMatch = prescribedDiets.some((diet) => dish.dietCategories.includes(diet));

        if (!hasMatch) {
          return `🍽️ Safety Check Failed: "${dish.name}" is categorized for [${dish.dietCategories.join(', ')}], which does not match the patient's prescribed ${rx.dietType}!`;
        }
      }
    }
  }

  // 🔄 Rule 4: Menu Fatigue / Repetition Warning
  const dateToCheck = assignDate || modalForm.value.date || today;
  const checkDate = new Date(dateToCheck);
  checkDate.setDate(checkDate.getDate() - 1);
  const yesterday = checkDate.toISOString().split('T')[0];

  const yesterdayMeal = dataStore.mealAssignments.find(
    (m) => m.patientId === patientId && m.date === yesterday
  );
  if (yesterdayMeal) {
    const todayItems = selectedDishesList.filter(Boolean);
    const yesterdayItems = [
      yesterdayMeal.breakfastProtein, yesterdayMeal.lunchProtein, yesterdayMeal.dinnerProtein
    ].filter(Boolean);

    for (const todayItem of todayItems) {
      if (yesterdayItems.includes(todayItem)) {
        return `🔄 Menu Fatigue Warning: Patient already had "${todayItem}" as a main dish yesterday. Please choose a different dish!`;
      }
    }
  }

  return null;
}

function handleModalSubmit() {
  if (!modalPatient.value) return;

  modalError.value = '';
  const selectedDishesList = [
    modalForm.value.breakfastCarb, modalForm.value.breakfastProtein, modalForm.value.breakfastSide,
    modalForm.value.lunchCarb, modalForm.value.lunchProtein, modalForm.value.lunchSide,
    modalForm.value.dinnerCarb, modalForm.value.dinnerProtein, modalForm.value.dinnerSide
  ];

  const errorMsg = validateMealPlan(modalPatient.value.id, selectedDishesList, modalForm.value.totalCost, modalForm.value.date);
  if (errorMsg) {
    modalError.value = errorMsg;
    return;
  }

  const assignment = {
    id: editingMeal.value?.id ?? `MA${String(dataStore.mealAssignments.length + 1).padStart(3, '0')}`,
    patientId: modalPatient.value.id,
    patientName: modalPatient.value.name,
    date: modalForm.value.date,
    breakfastCarb: modalForm.value.breakfastCarb || null,
    breakfastProtein: modalForm.value.breakfastProtein || null,
    breakfastSide: modalForm.value.breakfastSide || null,
    lunchCarb: modalForm.value.lunchCarb || null,
    lunchProtein: modalForm.value.lunchProtein || null,
    lunchSide: modalForm.value.lunchSide || null,
    dinnerCarb: modalForm.value.dinnerCarb || null,
    dinnerProtein: modalForm.value.dinnerProtein || null,
    dinnerSide: modalForm.value.dinnerSide || null,
    breakfastPortion: modalForm.value.breakfastPortion,
    lunchPortion: modalForm.value.lunchPortion,
    dinnerPortion: modalForm.value.dinnerPortion,
    breakfastCost: modalForm.value.breakfastCost,
    lunchCost: modalForm.value.lunchCost,
    dinnerCost: modalForm.value.dinnerCost,
    totalCost: modalForm.value.totalCost,
    assignedBy: authStore.currentUser?.name ?? 'Dietitian',
    assignedAt: new Date().toISOString(),
    feedingInstructions: modalForm.value.feedingInstructions || undefined
  };
  if (editingMeal.value) {
    const idx = dataStore.mealAssignments.findIndex((m) => m.id === editingMeal.value.id);
    if (idx !== -1) dataStore.mealAssignments[idx] = assignment;
  } else {
    dataStore.addMealAssignment(assignment);
  }
  modalSuccess.value = true;
  setTimeout(() => {modalSuccess.value = false;closeModal();}, 1800);
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
