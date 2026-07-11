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
      <!-- Mode Toggle -->
      <div class="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <button @click="planningMode = 'single'" class="flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold transition-colors"
          :class="planningMode === 'single' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'">
          <User :size="15" />
          <span>Single Patient</span>
        </button>
        <div class="w-px h-6 bg-gray-200"></div>
        <button @click="planningMode = 'multiple'" class="flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold transition-colors"
          :class="planningMode === 'multiple' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'">
          <Users :size="15" />
          <span>Multiple Patient</span>
        </button>
      </div>
    </div>

    <!-- Patient Table (Single Mode) -->
    <div v-if="planningMode === 'single'" class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
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
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 text-xs font-bold text-gray-700 bg-gray-50/50">
              <th class="px-6 py-3">Patient Name</th>
              <th class="px-6 py-3">Room</th>
              <th class="px-6 py-3">Diagnosis</th>
              <th class="px-6 py-3">Diet Prescription</th>
              <th class="px-6 py-3">Allergies</th>
              <th class="px-6 py-3">Current Assignment</th>
              <th class="px-6 py-3 text-right">Action</th>
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
                <div v-if="item.todayMeal" class="space-y-0.5">
                  <div v-if="item.todayMeal.breakfast" class="flex items-center text-xs text-gray-600">
                    <span class="w-2 h-2 rounded-full bg-yellow-400 mr-1.5 shrink-0"></span>{{ item.todayMeal.breakfast }}
                  </div>
                  <div v-if="item.todayMeal.lunch" class="flex items-center text-xs text-gray-600">
                    <span class="w-2 h-2 rounded-full bg-orange-400 mr-1.5 shrink-0"></span>{{ item.todayMeal.lunch }}
                  </div>
                  <div v-if="item.todayMeal.dinner" class="flex items-center text-xs text-gray-600">
                    <span class="w-2 h-2 rounded-full bg-blue-400 mr-1.5 shrink-0"></span>{{ item.todayMeal.dinner }}
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

    <!-- Bulk Mode -->
    <div v-if="planningMode === 'multiple'" class="space-y-5">
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <!-- Filters Row -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Date <span class="text-red-500">*</span></label>
            <input v-model="bulkDate" type="date" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none text-sm" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Filter by Diet Type</label>
            <select v-model="bulkFilterDiet" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none text-sm bg-white">
              <option value="">All Diet Types</option>
              <option value="none">Not Prescribed</option>
              <option value="Normal Diet">Normal Diet</option>
              <option value="Soft Diet">Soft Diet</option>
              <option value="Full Liquid Diet">Full Liquid Diet</option>
              <option value="Bland Diet">Bland Diet</option>
              <option value="DM (Diabetic Mellitus) Diet">DM (Diabetic Mellitus) Diet</option>
              <option value="Low Salt/Low Fat">Low Salt/Low Fat</option>
              <option value="Low Purine">Low Purine</option>
              <option value="Carbohydrate">Carbohydrate</option>
              <option value="High Protein">High Protein</option>
              <option value="High Fiber">High Fiber</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Filter by Ward / Room</label>
            <select v-model="bulkFilterRoom" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none text-sm bg-white">
              <option value="">All Rooms</option>
              <option v-for="room in uniqueRooms" :key="room" :value="room">Room {{ room }}</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <div v-for="(opts, label, key) in mealSlots" :key="key" class="rounded-xl p-4 border" :class="opts.bg">
            <label class="block text-xs font-bold uppercase tracking-wide mb-2" :class="opts.label">{{ opts.emoji }} {{ label }}</label>
            <select v-model="bulkForm[opts.key]" @change="calcBulkCost" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 outline-none text-sm bg-white">
              <option value="">-- None --</option>
              <option v-for="m in opts.items" :key="m.name" :value="m.name">{{ m.name }} (₱{{ m.cost }})</option>
            </select>
          </div>
        </div>
        <div class="flex items-center justify-between px-5 py-3 rounded-xl bg-green-50 border border-green-200 mb-5">
          <span class="text-sm font-semibold text-green-900">Total per Patient</span>
          <span class="text-xl font-bold text-green-700">₱{{ bulkForm.totalCost.toFixed(2) }}</span>
        </div>
        <div class="border border-gray-200 rounded-xl overflow-hidden mb-5">
          <div class="bg-gray-50 px-4 py-3 text-xs font-bold text-gray-600 uppercase border-b border-gray-100 flex items-center justify-between">
            <span>{{ bulkFilteredPatients.length }} patients selected</span>
            <span v-if="bulkFilterDiet || bulkFilterRoom" class="text-teal-600 font-semibold">Filtered</span>
          </div>
          <div class="divide-y divide-gray-100 max-h-48 overflow-y-auto">
            <div v-for="p in bulkFilteredPatients" :key="p.id" class="px-4 py-2.5 flex items-center justify-between text-sm">
              <div class="flex items-center space-x-3">
                <span class="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xs shrink-0">{{ p.name[0] }}</span>
                <span class="font-medium text-gray-800">{{ p.name }}</span>
              </div>
              <div class="flex items-center space-x-3 text-right">
                <span class="text-xs text-gray-500">Room {{ p.room }}</span>
                <span v-if="getPrescription(p.id)" class="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">{{ getPrescription(p.id)?.dietType }}</span>
                <span v-else class="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full font-medium">Not Prescribed</span>
              </div>
            </div>
            <div v-if="bulkFilteredPatients.length === 0" class="px-4 py-6 text-center text-sm text-gray-400">No patients match the selected filters.</div>
          </div>
        </div>
        <div v-if="bulkError" class="flex items-center space-x-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800 font-semibold mb-4">
          <AlertCircle :size="16" class="shrink-0" /><span>{{ bulkError }}</span>
        </div>
        <div v-if="bulkSuccess" class="flex items-center space-x-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800 font-semibold mb-4">
          <CheckCircle :size="16" /><span>Meals assigned to {{ bulkFilteredPatients.length }} patients!</span>
        </div>
        <button @click="handleBulkSubmit" :disabled="!bulkDate || bulkFilteredPatients.length === 0" class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 shadow-sm">
          <Users :size="20" /><span>Assign to {{ bulkFilteredPatients.length }} Patient{{ bulkFilteredPatients.length !== 1 ? 's' : '' }}</span>
        </button>
      </div>
    </div>

    <!-- Assign/Edit Modal -->
    <transition name="fade">
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden" @click.stop>
          <div class="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <div>
              <h2 class="text-lg font-bold text-gray-900">{{ editingMeal ? 'Edit Meals' : 'Assign Meals' }}</h2>
              <p class="text-sm text-gray-500">{{ modalPatient?.name }} — Room {{ modalPatient?.room }}</p>
            </div>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600"><X :size="22" /></button>
          </div>

          <div class="p-5 space-y-4 overflow-y-auto flex-1">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Date <span class="text-red-500">*</span></label>
              <input v-model="modalForm.date" type="date" required class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-green-600 outline-none text-sm" />
            </div>

            <div v-if="modalPrescription" class="flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-xs text-green-800">
              <CheckCircle :size="13" /><span>Diet: <strong>{{ modalPrescription.dietType }}</strong></span>
            </div>

            <div v-for="slot in modalSlots" :key="slot.key" class="rounded-xl p-4 border" :class="slot.bg">
              <label class="block text-xs font-bold uppercase tracking-wide mb-2" :class="slot.label">{{ slot.emoji }} {{ slot.name }}</label>
              <select v-model="modalForm[slot.key]" @change="calcModalCost" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 outline-none text-sm bg-white">
                <option value="">-- None --</option>
                <option v-for="m in slot.items" :key="m.name" :value="m.name">{{ m.name }} (₱{{ m.cost }})</option>
              </select>
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

            <div class="flex items-center justify-between px-4 py-3 rounded-xl" :class="modalForm.totalCost > 150 ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'">
              <span class="text-sm font-semibold" :class="modalForm.totalCost > 150 ? 'text-red-900' : 'text-green-900'">Daily Total</span>
              <span class="text-xl font-bold" :class="modalForm.totalCost > 150 ? 'text-red-700' : 'text-green-700'">₱{{ modalForm.totalCost.toFixed(2) }}</span>
            </div>

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
import { User, Users, Utensils, AlertCircle, CheckCircle, Save, X, Pencil, ChevronRight, Link as LinkIcon, Search, ClipboardList } from 'lucide-vue-next';

const dataStore = useDataStore();
const authStore = useAuthStore();

const planningMode = ref('single');
const searchQuery = ref('');
const isModalOpen = ref(false);
const modalSuccess = ref(false);
const modalError = ref('');
const bulkSuccess = ref(false);
const bulkError = ref('');
const bulkDate = ref('');
const bulkFilterDiet = ref('');
const bulkFilterRoom = ref('');
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

const mealSlots = computed(() => ({
  Breakfast: { key: 'breakfast', emoji: '🌅', items: breakfastOptions.value, bg: 'bg-yellow-50/50 border-yellow-100', label: 'text-yellow-800' },
  Lunch: { key: 'lunch', emoji: '☀️', items: lunchOptions.value, bg: 'bg-orange-50/50 border-orange-100', label: 'text-orange-800' },
  Dinner: { key: 'dinner', emoji: '🌙', items: dinnerOptions.value, bg: 'bg-blue-50/50 border-blue-100', label: 'text-blue-800' }
}));

const modalForm = ref({ date: today, breakfast: '', lunch: '', dinner: '', breakfastCost: 0, lunchCost: 0, dinnerCost: 0, totalCost: 0, feedingInstructions: '' });
const bulkForm = ref({ breakfast: '', lunch: '', dinner: '', breakfastCost: 0, lunchCost: 0, dinnerCost: 0, totalCost: 0 });

const activePatients = computed(() => dataStore.patients.filter((p) => p.status === 'Active'));

const uniqueRooms = computed(() => {
  const rooms = new Set();
  activePatients.value.forEach((p) => rooms.add(p.room.split('-')[0]));
  return Array.from(rooms).sort();
});

function getPrescription(patientId) {
  return dataStore.prescriptions.find((rx) => rx.patientId === patientId && rx.status === 'Active');
}

const bulkFilteredPatients = computed(() => {
  return activePatients.value.filter((p) => {
    const prescription = getPrescription(p.id);
    if (bulkFilterDiet.value) {
      if (bulkFilterDiet.value === 'none' && prescription) return false;
      if (bulkFilterDiet.value !== 'none' && prescription?.dietType !== bulkFilterDiet.value) return false;
    }
    if (bulkFilterRoom.value && p.room.split('-')[0] !== bulkFilterRoom.value) return false;
    return true;
  });
});

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

function getCost(opts, name) {
  return opts.find((m) => m.name === name)?.cost ?? 0;
}

function calcModalCost() {
  modalForm.value.breakfastCost = getCost(breakfastOptions.value, modalForm.value.breakfast);
  modalForm.value.lunchCost = getCost(lunchOptions.value, modalForm.value.lunch);
  modalForm.value.dinnerCost = getCost(dinnerOptions.value, modalForm.value.dinner);
  modalForm.value.totalCost = modalForm.value.breakfastCost + modalForm.value.lunchCost + modalForm.value.dinnerCost;
}

function calcBulkCost() {
  bulkForm.value.breakfastCost = getCost(breakfastOptions.value, bulkForm.value.breakfast);
  bulkForm.value.lunchCost = getCost(lunchOptions.value, bulkForm.value.lunch);
  bulkForm.value.dinnerCost = getCost(dinnerOptions.value, bulkForm.value.dinner);
  bulkForm.value.totalCost = bulkForm.value.breakfastCost + bulkForm.value.lunchCost + bulkForm.value.dinnerCost;
}

function openAssignModal(patient, existingMeal) {
  modalPatient.value = patient;
  editingMeal.value = existingMeal ?? null;
  modalSuccess.value = false;
  modalError.value = '';
  modalForm.value = {
    date: existingMeal?.date ?? today,
    breakfast: existingMeal?.breakfast ?? '',
    lunch: existingMeal?.lunch ?? '',
    dinner: existingMeal?.dinner ?? '',
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

function validateMealPlan(patientId, breakfast, lunch, dinner, totalCost, assignDate) {
  // 💰 Rule 1: Budget Safety Rule
  if (totalCost > 150) {
    return `💰 Safety Check Failed: Budget exceeded! Total cost is ₱${totalCost.toFixed(2)}, which is above the ₱150.00 daily limit.`;
  }

  // 🚨 Rule 2 & 🍽️ Rule 3: Allergen + Dietary Prescription Rules
  const rx = getPrescription(patientId);
  if (rx) {
    const selectedDishes = [
    dataStore.dishes.find((d) => d.name === breakfast),
    dataStore.dishes.find((d) => d.name === lunch),
    dataStore.dishes.find((d) => d.name === dinner)].
    filter(Boolean);

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
    if (breakfast && yesterdayMeal.breakfast === breakfast) {
      return `🔄 Menu Fatigue Warning: Patient had "${breakfast}" for breakfast yesterday. Please choose a different dish!`;
    }
    if (lunch && yesterdayMeal.lunch === lunch) {
      return `🔄 Menu Fatigue Warning: Patient had "${lunch}" for lunch yesterday. Please choose a different dish!`;
    }
    if (dinner && yesterdayMeal.dinner === dinner) {
      return `🔄 Menu Fatigue Warning: Patient had "${dinner}" for dinner yesterday. Please choose a different dish!`;
    }
  }

  return null;
}

function handleModalSubmit() {
  if (!modalPatient.value) return;

  modalError.value = '';
  const errorMsg = validateMealPlan(modalPatient.value.id, modalForm.value.breakfast, modalForm.value.lunch, modalForm.value.dinner, modalForm.value.totalCost, modalForm.value.date);
  if (errorMsg) {
    modalError.value = errorMsg;
    return;
  }

  const assignment = {
    id: editingMeal.value?.id ?? `MA${String(dataStore.mealAssignments.length + 1).padStart(3, '0')}`,
    patientId: modalPatient.value.id,
    patientName: modalPatient.value.name,
    date: modalForm.value.date,
    breakfast: modalForm.value.breakfast || null,
    lunch: modalForm.value.lunch || null,
    dinner: modalForm.value.dinner || null,
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

function handleBulkSubmit() {
  if (!bulkDate.value) return;

  bulkError.value = '';

  // Validate for ALL selected patients before assigning anything
  for (const patient of bulkFilteredPatients.value) {
    const errorMsg = validateMealPlan(patient.id, bulkForm.value.breakfast, bulkForm.value.lunch, bulkForm.value.dinner, bulkForm.value.totalCost, bulkDate.value);
    if (errorMsg) {
      bulkError.value = `Error for ${patient.name}: ${errorMsg}`;
      return;
    }
  }

  bulkFilteredPatients.value.forEach((patient, i) => {
    dataStore.addMealAssignment({
      id: `MA${String(dataStore.mealAssignments.length + i + 1).padStart(3, '0')}`,
      patientId: patient.id, patientName: patient.name, date: bulkDate.value,
      breakfast: bulkForm.value.breakfast || null, lunch: bulkForm.value.lunch || null, dinner: bulkForm.value.dinner || null,
      breakfastCost: bulkForm.value.breakfastCost, lunchCost: bulkForm.value.lunchCost, dinnerCost: bulkForm.value.dinnerCost,
      totalCost: bulkForm.value.totalCost,
      assignedBy: authStore.currentUser?.name ?? 'Dietitian', assignedAt: new Date().toISOString()
    });
  });
  bulkSuccess.value = true;
  setTimeout(() => {bulkSuccess.value = false;}, 3000);
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
