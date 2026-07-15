<template>
  <div class="space-y-6 w-full max-w-full overflow-x-hidden pb-8">
    
    <!-- Zone 1: Top Context Header -->
    <div class="w-full rounded-2xl shadow-sm px-6 py-8 flex justify-between items-center text-white mb-6 bg-gradient-to-r from-violet-600 to-fuchsia-500">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">Tray Dispatch & Delivery</h2>
        <p class="text-violet-100 text-sm mt-1">Current Run: {{ selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1) }}</p>
      </div>
      <div class="text-right hidden sm:block">
        <p class="font-medium">{{ currentDate }}</p>
      </div>
    </div>

    <!-- Zone 2: KPI & Census Metric Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      
      <!-- Card 1: Tray Delivery Tracker -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col justify-center border-l-4 border-l-violet-500">
        <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Tray Delivery Tracker</p>
        <h3 class="text-2xl font-bold text-slate-800 mb-3">Served: {{ servedItems.size }} / {{ totalMeals }} Meals ({{ completionPercentage }}%)</h3>
        <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div class="bg-violet-500 h-full rounded-full transition-all duration-500" :style="`width: ${completionPercentage}%`"></div>
        </div>
      </div>

      <!-- Card 2: Pending Distribution -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col justify-center">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Pending Distribution ({{ selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1) }})</p>
            <h3 class="text-3xl font-bold text-slate-800">{{ currentPendingCount > 0 ? currentPendingCount : 0 }}</h3>
          </div>
          <div class="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center text-violet-600">
            <Utensils :size="24" />
          </div>
        </div>
      </div>

    </div>

    <!-- Zone 3: Quick Actions Row -->
    <div class="mt-6">
      <button @click="$emit('navigate', 'mobile')" class="w-full py-4 rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 bg-violet-600 hover:bg-violet-700 flex flex-col sm:flex-row items-center justify-center sm:space-x-3 text-lg border-2 border-violet-500">
        <Camera class="mb-1 sm:mb-0" :size="28" />
        <span>Scan Room QR Code</span>
      </button>
    </div>

    <!-- Zone 4: Primary Content Grid Workspace -->
    <div class="mt-6 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
      <div class="bg-slate-50 border-b border-slate-100 p-5">
        <h3 class="font-bold text-slate-800 text-lg flex items-center">
          <ClipboardList class="mr-2 text-violet-500" :size="20" />
          Distribution Checklist
        </h3>
      </div>
      
      <!-- Tabs -->
      <div class="flex border-b border-slate-200 bg-white">
        <button
          @click="selectedTab = 'breakfast'"
          :class="['flex-1 py-4 text-center font-semibold text-sm transition-colors border-b-2',
            selectedTab === 'breakfast' ? 'border-violet-600 text-violet-700 bg-violet-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50']">
          Breakfast <span class="ml-1 bg-slate-100 text-slate-600 rounded-full px-2 py-0.5 text-xs">{{ counts.breakfast }}</span>
        </button>
        <button
          @click="selectedTab = 'lunch'"
          :class="['flex-1 py-4 text-center font-semibold text-sm transition-colors border-b-2',
            selectedTab === 'lunch' ? 'border-violet-600 text-violet-700 bg-violet-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50']">
          Lunch <span class="ml-1 bg-slate-100 text-slate-600 rounded-full px-2 py-0.5 text-xs">{{ counts.lunch }}</span>
        </button>
        <button
          @click="selectedTab = 'dinner'"
          :class="['flex-1 py-4 text-center font-semibold text-sm transition-colors border-b-2',
            selectedTab === 'dinner' ? 'border-violet-600 text-violet-700 bg-violet-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50']">
          Dinner <span class="ml-1 bg-slate-100 text-slate-600 rounded-full px-2 py-0.5 text-xs">{{ counts.dinner }}</span>
        </button>
      </div>

      <!-- Checklist Content -->
      <div class="p-5 space-y-4 bg-slate-50/50 min-h-[300px]">
        <div v-for="item in currentList" :key="item.room" :class="['rounded-xl p-5 shadow-sm border',
          isItemServed(item.room) ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200 hover:border-violet-300 transition-colors cursor-pointer']"
          @click="!isItemServed(item.room) && openConfirmModal(item.room)">
          
          <div class="flex items-start justify-between">
            <div class="flex items-start space-x-4">
              <div :class="['w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5',
                isItemServed(item.room) ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 text-transparent']">
                <CheckCircle :size="18" />
              </div>
              <div>
                <h4 :class="['text-lg font-bold', isItemServed(item.room) ? 'text-green-800' : 'text-slate-800']">Room {{ item.room }}</h4>
                <p class="text-sm font-medium text-slate-600">{{ item.name }}</p>
                <div class="mt-2 flex flex-wrap gap-2">
                  <span class="inline-block px-2.5 py-1 bg-violet-100 text-violet-800 rounded text-xs font-bold">{{ item.diet }}</span>
                  <span v-if="item.allergy" class="px-2.5 py-1 bg-red-100 text-red-800 rounded text-xs font-bold flex items-center">
                    <AlertCircle :size="12" class="mr-1" />
                    ALLERGY: {{ item.allergy.toUpperCase() }}
                  </span>
                </div>
              </div>
            </div>
            
            <div v-if="isItemServed(item.room)" class="text-right">
              <span class="text-xs font-bold text-green-700 bg-green-200 px-2 py-1 rounded uppercase">Delivered</span>
            </div>
          </div>
        </div>
        
        <div v-if="currentList.length === 0" class="text-center py-10 text-slate-400">
          No meals to distribute for this shift.
        </div>
      </div>
    </div>

    <!-- Confirm Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <!-- header -->
        <div class="bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white p-6 flex items-center justify-between shrink-0">
          <div>
            <h3 class="text-2xl font-bold">Confirm Meal Service</h3>
            <p class="text-sm text-violet-100 mt-1">{{ selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1) }} • Room {{ confirmingItem }}</p>
            <p v-if="getCurrentMeal" class="text-sm font-medium">{{ getCurrentMeal.name }}</p>
          </div>
          <button @click="closeConfirmModal" class="text-white hover:text-violet-200 transition-colors p-2 bg-white/10 rounded-lg">
            <X :size="24" />
          </button>
        </div>

        <!-- modal content scroll -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <div class="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <div class="flex items-start gap-3">
              <ClipboardList class="text-blue-600 mt-0.5 shrink-0" :size="20" />
              <div>
                <div class="font-semibold text-blue-900">Doctor's Prescription:</div>
                <div class="text-blue-800 font-bold mt-1">{{ getCurrentMeal?.diet || 'N/A' }}</div>
              </div>
            </div>
          </div>

          <div>
            <div class="font-bold text-slate-800 mb-3 flex items-center justify-between">
              Verification Status
              <span class="text-xs text-slate-500 font-normal">Compare tray with prescription</span>
            </div>
            <div class="space-y-3">
              <label class="flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all"
                :class="selectedVerification === 'perfect' ? 'border-green-500 bg-green-50 shadow-sm' : 'border-slate-200 hover:border-slate-300'">
                <input type="radio" v-model="selectedVerification" value="perfect" class="mt-1 shrink-0 text-green-600 focus:ring-green-500" />
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <CheckCircle class="text-green-600 shrink-0" :size="18" />
                    <span class="font-bold text-slate-800">Perfect Match</span>
                  </div>
                  <div class="text-sm text-slate-600 mt-1">Served meal matches doctor's prescription exactly</div>
                </div>
              </label>

              <label class="flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all"
                :class="selectedVerification === 'partial' ? 'border-amber-500 bg-amber-50 shadow-sm' : 'border-slate-200 hover:border-slate-300'">
                <input type="radio" v-model="selectedVerification" value="partial" class="mt-1 shrink-0 text-amber-600 focus:ring-amber-500" />
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <AlertCircle class="text-amber-600 shrink-0" :size="18" />
                    <span class="font-bold text-slate-800">Partial Refusal</span>
                  </div>
                  <div class="text-sm text-slate-600 mt-1">Patient refused part of the meal or substitution needed</div>
                </div>
              </label>

              <label class="flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all"
                :class="selectedVerification === 'mismatch' ? 'border-red-400 bg-red-50 shadow-sm' : 'border-slate-200 hover:border-slate-300'">
                <input type="radio" v-model="selectedVerification" value="mismatch" class="mt-1 shrink-0 text-red-600 focus:ring-red-500" />
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <X class="text-red-500 shrink-0" :size="18" />
                    <span class="font-bold text-slate-800">Mismatch</span>
                  </div>
                  <div class="text-sm text-slate-600 mt-1">Different meal served (requires explanation)</div>
                </div>
              </label>
            </div>
          </div>

          <div v-if="selectedVerification === 'mismatch' || selectedVerification === 'partial'">
            <div class="font-bold text-slate-800 mb-2">Discrepancy Notes <span class="text-red-500">*</span></div>
            <textarea
              v-model="discrepancyNotes"
              placeholder="Please explain the discrepancy..."
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none resize-none shadow-sm text-sm"
              rows="3"></textarea>
          </div>
        </div>

        <!-- footer -->
        <div class="border-t border-slate-100 p-5 flex gap-3 justify-end bg-slate-50 shrink-0">
          <button @click="closeConfirmModal" class="px-6 py-2.5 text-slate-700 font-semibold bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            Cancel
          </button>
          <button @click="confirmService" :disabled="!selectedVerification" class="px-6 py-2.5 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors shadow-sm">
            <CheckCircle :size="18" />
            Confirm Service
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useDataStore } from '@/stores/dataStore';
import { Utensils, CheckCircle, X, ClipboardList, Camera, AlertCircle } from 'lucide-vue-next';

const dataStore = useDataStore();
const currentDate = ref(new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
const selectedTab = ref('breakfast');
const showConfirmModal = ref(false);
const selectedVerification = ref(null);
const confirmingItem = ref(null);
const servedItems = ref(new Set());
const discrepancyNotes = ref('');

const todayStr = new Date().toISOString().split('T')[0];
const activePatients = computed(() => dataStore.patients.filter(p => p.status === 'Active'));

const meals = {
  breakfast: computed(() => {
    return activePatients.value.map(p => {
      const rx = dataStore.prescriptions.find(r => r.patientId === p.id && r.status === 'Active');
      const assignment = dataStore.mealAssignments.find(a => a.patientId === p.id && a.date === todayStr);
      return {
        room: p.room,
        name: p.name,
        diet: assignment?.breakfast || rx?.dietType || 'Regular Diet',
        allergy: p.allergies || (rx?.allergies && rx.allergies.length > 0 ? rx.allergies.join(', ') : '')
      };
    });
  }),
  lunch: computed(() => {
    return activePatients.value.map(p => {
      const rx = dataStore.prescriptions.find(r => r.patientId === p.id && r.status === 'Active');
      const assignment = dataStore.mealAssignments.find(a => a.patientId === p.id && a.date === todayStr);
      return {
        room: p.room,
        name: p.name,
        diet: assignment?.lunch || rx?.dietType || 'Regular Diet',
        allergy: p.allergies || (rx?.allergies && rx.allergies.length > 0 ? rx.allergies.join(', ') : '')
      };
    });
  }),
  dinner: computed(() => {
    return activePatients.value.map(p => {
      const rx = dataStore.prescriptions.find(r => r.patientId === p.id && r.status === 'Active');
      const assignment = dataStore.mealAssignments.find(a => a.patientId === p.id && a.date === todayStr);
      return {
        room: p.room,
        name: p.name,
        diet: assignment?.dinner || rx?.dietType || 'Regular Diet',
        allergy: p.allergies || (rx?.allergies && rx.allergies.length > 0 ? rx.allergies.join(', ') : '')
      };
    });
  })
};

const counts = computed(() => ({
  breakfast: meals.breakfast.value.length,
  lunch: meals.lunch.value.length,
  dinner: meals.dinner.value.length
}));

const totalMeals = computed(() => counts.value.breakfast + counts.value.lunch + counts.value.dinner);

const completionPercentage = computed(() => {
  if (totalMeals.value === 0) return 0;
  return Math.round((servedItems.value.size / totalMeals.value) * 100);
});

const currentCount = computed(() => counts.value[selectedTab.value]);

const currentPendingCount = computed(() => {
  const allCurrent = meals[selectedTab.value].value;
  let servedInCurrent = 0;
  allCurrent.forEach(item => {
    if (servedItems.value.has(item.room)) servedInCurrent++;
  });
  return allCurrent.length - servedInCurrent;
});

const currentList = computed(() => {
  const key = selectedTab.value;
  return meals[key].value;
});

const getCurrentMeal = computed(() => {
  if (confirmingItem.value === null) return null;
  const key = selectedTab.value;
  return meals[key].value.find((item) => item.room === confirmingItem.value);
});

function openConfirmModal(room) {
  confirmingItem.value = room;
  showConfirmModal.value = true;
  selectedVerification.value = null;
}

function closeConfirmModal() {
  showConfirmModal.value = false;
  confirmingItem.value = null;
  selectedVerification.value = null;
  discrepancyNotes.value = '';
}

function confirmService() {
  if (confirmingItem.value !== null) {
    servedItems.value.add(confirmingItem.value);
    closeConfirmModal();
  }
}

function isItemServed(room) {
  return servedItems.value.has(room);
}
</script>
