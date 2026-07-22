<template>
  <div class="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
    <!-- Header & Date Picker -->
    <div class="flex items-center justify-between shrink-0">
      <div class="flex items-center space-x-4">
        <div class="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
          <UtensilsCrossed :size="24" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-800 tracking-tight">Daily Production</h1>
          <p class="text-sm text-gray-500">Assign bulk meals per diet group and dispatch to kitchen</p>
        </div>
      </div>
      <div class="flex items-center space-x-3 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
        <label class="text-sm font-semibold text-gray-600 pl-2">Production Date:</label>
        <input v-model="selectedDate" type="date" class="border-none bg-gray-50 rounded-lg px-3 py-1.5 text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow" />
        <button @click="loadCycleMenu" class="ml-2 px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-sm font-bold flex items-center space-x-1 transition-colors">
          <CalendarCheck :size="16" />
          <span>Load Cycle Menu</span>
        </button>
      </div>
    </div>

    <!-- Main Workspace Area -->
    <div class="flex flex-1 gap-4 min-h-0">
      
      <!-- Left Pane: Diet Groups -->
      <div 
        class="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden shrink-0 transition-all duration-300"
        :class="isSidebarOpen ? 'w-[300px]' : 'w-[72px]'"
      >
        <div class="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
          <h2 v-if="isSidebarOpen" class="font-bold text-gray-800 flex items-center space-x-2 whitespace-nowrap">
            <Users :size="16" class="text-emerald-600" />
            <span>Diet Groups</span>
          </h2>
          <button @click="isSidebarOpen = !isSidebarOpen" class="p-1.5 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors mx-auto">
            <PanelLeftClose v-if="isSidebarOpen" :size="18" />
            <PanelLeftOpen v-else :size="18" />
          </button>
        </div>
        
        <div class="overflow-y-auto flex-1 p-2 space-y-2">
          <div 
            v-for="group in dietGroups" 
            :key="group.dietType"
            @click="selectedGroup = group"
            class="rounded-xl border-2 cursor-pointer transition-all group flex items-center justify-between"
            :class="[
              isSidebarOpen ? 'p-3' : 'p-2 justify-center',
              selectedGroup?.dietType === group.dietType 
                ? 'border-emerald-500 bg-emerald-50 shadow-sm' 
                : 'border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30'
            ]"
            :title="group.dietType"
          >
            <div v-if="isSidebarOpen" class="overflow-hidden mr-2">
              <p class="font-semibold text-sm text-gray-900 truncate">{{ group.dietType }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ group.patients.length }} patients</p>
            </div>
            <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-emerald-600 font-bold text-xs border border-emerald-100 shrink-0">
              {{ group.patients.length }}
            </div>
          </div>
          
          <div v-if="dietGroups.length === 0" class="text-center py-10">
            <Users :size="isSidebarOpen ? 32 : 24" class="mx-auto mb-2 text-gray-300" />
            <p v-if="isSidebarOpen" class="text-sm text-gray-500">No active patients found.</p>
          </div>
        </div>
      </div>

      <!-- Right Pane: Meal Assignment for Selected Group -->
      <div class="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <div v-if="selectedGroup" class="flex flex-col h-full">
          <div class="p-5 border-b border-gray-100 shrink-0 bg-emerald-600 text-white flex justify-between items-center">
            <div>
              <h2 class="text-xl font-bold">{{ selectedGroup.dietType }}</h2>
              <p class="text-emerald-100 text-sm mt-0.5">Assign meals for {{ selectedGroup.patients.length }} patients</p>
            </div>
            <div class="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/30 text-center">
              <p class="text-[10px] uppercase font-bold text-emerald-100 tracking-wider">Group Cost</p>
              <p class="text-lg font-bold">₱{{ calculateGroupTotalCost(selectedGroup).toFixed(2) }}</p>
            </div>
          </div>

          <div class="p-4 border-b border-gray-100 bg-gray-50 shrink-0 max-h-32 overflow-y-auto">
            <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Included Patients ({{ selectedGroup.patients.length }})</h4>
            <div class="flex flex-wrap gap-2">
              <span v-for="p in selectedGroup.patients" :key="p.id" class="text-[11px] font-semibold bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-700 shadow-sm flex items-center">
                {{ p.name }} <span class="text-gray-400 font-normal ml-1">({{ p.room }})</span>
              </span>
            </div>
          </div>

          <div class="p-6 overflow-y-auto flex-1 space-y-6">
            <!-- Breakfast Slot -->
            <div class="bg-amber-50/50 border border-amber-100 rounded-xl p-4">
              <div class="flex items-center space-x-2 mb-3">
                <Sun :size="18" class="text-amber-500" />
                <h3 class="font-bold text-gray-800">Breakfast</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Carb -->
                <div>
                  <span class="text-xs font-semibold text-gray-500 uppercase">🌾 Carb</span>
                  <SearchableSelect 
                    v-model="groupSelections[selectedGroup.dietType].breakfastCarb" 
                    :options="getDishesByComponent('Breakfast', selectedGroup.dietType, 'Carbohydrate-Controlled Diet')"
                    placeholder="Search Carb..."
                  />
                </div>
                <!-- Viand -->
                <div>
                  <span class="text-xs font-semibold text-gray-500 uppercase">🍗 Viand</span>
                  <SearchableSelect 
                    v-model="groupSelections[selectedGroup.dietType].breakfastProtein" 
                    :options="getDishesByComponent('Breakfast', selectedGroup.dietType, 'Protein/Viand')"
                    placeholder="Search Viand..."
                  />
                </div>
                <!-- Side -->
                <div>
                  <span class="text-xs font-semibold text-gray-500 uppercase">🍎 Side/Fruit</span>
                  <SearchableSelect 
                    v-model="groupSelections[selectedGroup.dietType].breakfastSide" 
                    :options="getDishesByComponent('Breakfast', selectedGroup.dietType, 'Side/Fruit')"
                    placeholder="Search Side..."
                  />
                </div>
              </div>
            </div>

            <!-- Lunch Slot -->
            <div class="bg-orange-50/50 border border-orange-100 rounded-xl p-4">
              <div class="flex items-center space-x-2 mb-3">
                <UtensilsCrossed :size="18" class="text-orange-500" />
                <h3 class="font-bold text-gray-800">Lunch</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Carb -->
                <div>
                  <span class="text-xs font-semibold text-gray-500 uppercase">🌾 Carb</span>
                  <SearchableSelect 
                    v-model="groupSelections[selectedGroup.dietType].lunchCarb" 
                    :options="getDishesByComponent('Lunch', selectedGroup.dietType, 'Carbohydrate-Controlled Diet')"
                    placeholder="Search Carb..."
                  />
                </div>
                <!-- Viand -->
                <div>
                  <span class="text-xs font-semibold text-gray-500 uppercase">🍗 Viand</span>
                  <SearchableSelect 
                    v-model="groupSelections[selectedGroup.dietType].lunchProtein" 
                    :options="getDishesByComponent('Lunch', selectedGroup.dietType, 'Protein/Viand')"
                    placeholder="Search Viand..."
                  />
                </div>
                <!-- Side -->
                <div>
                  <span class="text-xs font-semibold text-gray-500 uppercase">🍎 Side/Fruit</span>
                  <SearchableSelect 
                    v-model="groupSelections[selectedGroup.dietType].lunchSide" 
                    :options="getDishesByComponent('Lunch', selectedGroup.dietType, 'Side/Fruit')"
                    placeholder="Search Side..."
                  />
                </div>
              </div>
            </div>

            <!-- Dinner Slot -->
            <div class="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
              <div class="flex items-center space-x-2 mb-3">
                <Moon :size="18" class="text-blue-500" />
                <h3 class="font-bold text-gray-800">Dinner</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Carb -->
                <div>
                  <span class="text-xs font-semibold text-gray-500 uppercase">🌾 Carb</span>
                  <SearchableSelect 
                    v-model="groupSelections[selectedGroup.dietType].dinnerCarb" 
                    :options="getDishesByComponent('Dinner', selectedGroup.dietType, 'Carbohydrate-Controlled Diet')"
                    placeholder="Search Carb..."
                  />
                </div>
                <!-- Viand -->
                <div>
                  <span class="text-xs font-semibold text-gray-500 uppercase">🍗 Viand</span>
                  <SearchableSelect 
                    v-model="groupSelections[selectedGroup.dietType].dinnerProtein" 
                    :options="getDishesByComponent('Dinner', selectedGroup.dietType, 'Protein/Viand')"
                    placeholder="Search Viand..."
                  />
                </div>
                <!-- Side -->
                <div>
                  <span class="text-xs font-semibold text-gray-500 uppercase">🍎 Side/Fruit</span>
                  <SearchableSelect 
                    v-model="groupSelections[selectedGroup.dietType].dinnerSide" 
                    :options="getDishesByComponent('Dinner', selectedGroup.dietType, 'Side/Fruit')"
                    placeholder="Search Side..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="flex-1 flex flex-col items-center justify-center p-10 text-center">
          <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-gray-200">
            <UtensilsCrossed :size="32" class="text-gray-300" />
          </div>
          <h3 class="text-lg font-bold text-gray-700">No Diet Group Selected</h3>
          <p class="text-sm text-gray-500 max-w-sm mt-1">Select a diet group from the left pane to assign meals for all associated patients.</p>
        </div>
      </div>
    </div>

    <!-- Sticky Financial Summary Footer Bar (₱150 Budget Cap) -->
    <div class="bg-white border-t-4 border-t-emerald-500 border border-x-gray-200 border-b-gray-200 rounded-b-2xl shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] py-2 px-4 shrink-0 flex items-center justify-between z-10 sticky bottom-0">
      
      <div class="flex-1 max-w-xl">
        <div class="flex justify-between items-center mb-1">
          <div>
            <p class="text-sm font-bold text-gray-800">Financial Summary <span class="text-gray-400 font-normal ml-2">Total Projected Cost: ₱{{ grandTotalCost.toFixed(2) }}</span></p>
          </div>
          <div class="text-right flex items-center space-x-2">
            <p class="text-[10px] font-bold uppercase tracking-wider" :class="budgetStatus.textColor">Avg Cost Today</p>
            <p class="text-sm font-bold" :class="budgetStatus.textColor">₱{{ averageCostPerPatient.toFixed(2) }} <span class="text-[10px] text-gray-400 font-normal">/ ₱150.00</span></p>
          </div>
        </div>
        
        <!-- Budget Health Meter -->
        <div class="h-2.5 bg-gray-100 rounded-full overflow-hidden flex relative">
          <div 
            class="h-full transition-all duration-500 rounded-full" 
            :class="budgetStatus.barColor"
            :style="{ width: `${Math.min(100, budgetPercent)}%` }"
          ></div>
        </div>
        
        <!-- Warning Banner -->
        <p v-if="budgetStatus.status === 'danger'" class="text-xs text-red-600 font-bold mt-1.5 flex items-center">
          <AlertTriangle :size="12" class="mr-1" /> ⚠️ Budget Exceeded! Swap a dish to reduce cost.
        </p>
      </div>

      <div class="ml-8 shrink-0 flex space-x-2">
        <button class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold text-xs transition-colors shadow-sm border border-gray-200">
          Save Draft
        </button>
        <button 
          @click="showPrepSheetPreview"
          class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-colors shadow-sm flex items-center space-x-2"
        >
          <UtensilsCrossed :size="14" />
          <span>Dispatch & Preview</span>
        </button>
      </div>

    </div>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- Kitchen Prep Sheet Preview Modal -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <transition name="fade">
      <div v-if="isPreviewModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden" @click.stop>
          <div class="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <div>
              <h2 class="text-lg font-bold text-gray-900">Confirm Kitchen Production Dispatch</h2>
              <p class="text-sm text-gray-500">Verify the aggregated ingredient list for the kitchen pull sheet</p>
            </div>
            <button @click="isPreviewModalOpen = false" class="text-gray-400 hover:text-gray-600"><X :size="22" /></button>
          </div>
          
          <div class="p-6 bg-white flex-1 overflow-y-auto max-h-[60vh]">
            <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Ingredient Pull Checklist</h3>
            
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
              <p class="text-sm text-gray-500">No ingredients mapped for the selected dishes.</p>
            </div>

            <div v-if="hasLowStock" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
              <AlertTriangle :size="16" class="text-red-600 mt-0.5 shrink-0" />
              <p class="text-xs text-red-700 font-semibold leading-relaxed">
                ⚠️ WARNING: Inventory for some ingredients is currently Low. Please notify purchasing.
              </p>
            </div>
          </div>
          
          <div class="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
            <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors flex items-center space-x-2">
              <Printer :size="16" />
              <span>Print Prep Sheet</span>
            </button>
            <div class="flex space-x-3">
              <button @click="isPreviewModalOpen = false" class="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
              <button @click="confirmDispatch" class="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-bold transition-colors">
                Confirm & Dispatch
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue';
import { useDataStore } from '@/stores/dataStore';
import { useAuthStore } from '@/stores/authStore';
import { 
  UtensilsCrossed, Users, Sun, Moon, 
  CalendarCheck, AlertTriangle, FileText, CheckCircle, X,
  PanelLeftClose, PanelLeftOpen, Printer
} from 'lucide-vue-next';
import SearchableSelect from '@/components/common/SearchableSelect.vue';

const dataStore = useDataStore();
const authStore = useAuthStore();

// State
const selectedDate = ref(new Date().toISOString().split('T')[0]);
const selectedGroup = ref(null);
const isSidebarOpen = ref(true);

// ── Group Patients by Diet ──────────────────────────────────────────────
const dietGroups = computed(() => {
  const groups = {};
  
  // Only include active patients
  const activePatients = dataStore.patients.filter(p => p.status !== 'Discharged');
  
  activePatients.forEach(patient => {
    // Find patient's latest prescription
    const rx = dataStore.prescriptions
      .filter(p => p.patientId === patient.id && p.status === 'Active')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    
    const dietType = rx ? rx.dietType : 'Normal Diet (Regular Diet)';
    
    if (!groups[dietType]) {
      groups[dietType] = { dietType, patients: [] };
    }
    groups[dietType].patients.push(patient);
  });
  
  return Object.values(groups).sort((a, b) => b.patients.length - a.patients.length);
});

const totalPatients = computed(() => dietGroups.value.reduce((sum, g) => sum + g.patients.length, 0));

// ── Meal Selections State ───────────────────────────────────────────────
// Keep track of the selected dishes for each diet group
const groupSelections = reactive({});

// Initialize selections object when diet groups change
watch(dietGroups, (newGroups) => {
  newGroups.forEach(group => {
    if (!groupSelections[group.dietType]) {
      groupSelections[group.dietType] = { 
        breakfastCarb: null, breakfastProtein: null, breakfastSide: null, 
        lunchCarb: null, lunchProtein: null, lunchSide: null, 
        dinnerCarb: null, dinnerProtein: null, dinnerSide: null 
      };
    }
  });
}, { immediate: true });

// Auto-select first group if none selected
watch(dietGroups, (newGroups) => {
  if (newGroups.length > 0 && !selectedGroup.value) {
    selectedGroup.value = newGroups[0];
  }
}, { immediate: true });

// ── Helper: Get available dishes for a slot ─────────────────────────────
function getDishesByComponent(mealType, dietCategory, componentType) {
  return dataStore.dishes.filter(d => 
    d.mealType === mealType && 
    d.componentType === componentType &&
    (d.dietCategories.includes(dietCategory) || d.dietCategories.includes('Normal Diet (Regular Diet)'))
  );
}

function loadCycleMenu() {
  const todayMenu = dataStore.menuCalendar.filter(m => m.date === selectedDate.value);
  if (todayMenu.length === 0) {
    alert('No dishes scheduled for this date in the Meal Calendar.');
    return;
  }
  
  dietGroups.value.forEach(group => {
    // find dishes for this group's diet category
    const bfast = todayMenu.find(m => m.mealType === 'Breakfast' && m.dietCategory === group.dietType);
    const lunch = todayMenu.find(m => m.mealType === 'Lunch' && m.dietCategory === group.dietType);
    const dinner = todayMenu.find(m => m.mealType === 'Dinner' && m.dietCategory === group.dietType);

    if (bfast) groupSelections[group.dietType].breakfastProtein = dataStore.dishes.find(d => d.id === bfast.dishId) || null;
    if (lunch) groupSelections[group.dietType].lunchProtein = dataStore.dishes.find(d => d.id === lunch.dishId) || null;
    if (dinner) groupSelections[group.dietType].dinnerProtein = dataStore.dishes.find(d => d.id === dinner.dishId) || null;
  });
}

// ── Financial Calculations ──────────────────────────────────────────────
function calculateGroupTotalCost(group) {
  if (!group || !groupSelections[group.dietType]) return 0;
  
  const sel = groupSelections[group.dietType];
  const bCost = (sel.breakfastCarb?.cost || 0) + (sel.breakfastProtein?.cost || 0) + (sel.breakfastSide?.cost || 0);
  const lCost = (sel.lunchCarb?.cost || 0) + (sel.lunchProtein?.cost || 0) + (sel.lunchSide?.cost || 0);
  const dCost = (sel.dinnerCarb?.cost || 0) + (sel.dinnerProtein?.cost || 0) + (sel.dinnerSide?.cost || 0);
  
  const costPerPatient = bCost + lCost + dCost;
  return costPerPatient * group.patients.length;
}

const grandTotalCost = computed(() => {
  return dietGroups.value.reduce((sum, group) => sum + calculateGroupTotalCost(group), 0);
});

const averageCostPerPatient = computed(() => {
  if (totalPatients.value === 0) return 0;
  return grandTotalCost.value / totalPatients.value;
});

const budgetCap = 150.00;
const budgetPercent = computed(() => (averageCostPerPatient.value / budgetCap) * 100);

const budgetStatus = computed(() => {
  const avg = averageCostPerPatient.value;
  if (avg > budgetCap) {
    return { status: 'danger', barColor: 'bg-red-500', textColor: 'text-red-600' };
  } else if (avg > budgetCap * 0.9) {
    return { status: 'warning', barColor: 'bg-amber-400', textColor: 'text-amber-600' };
  } else {
    return { status: 'safe', barColor: 'bg-emerald-500', textColor: 'text-emerald-700' };
  }
});

// ── Dispatch to Kitchen & Prep Sheet Preview ────────────────────────────
const isPreviewModalOpen = ref(false);

const aggregatedIngredients = computed(() => {
  const map = {};
  dietGroups.value.forEach(group => {
    const sel = groupSelections[group.dietType];
    const pax = group.patients.length;
    
    const dishes = [
      sel.breakfastCarb, sel.breakfastProtein, sel.breakfastSide,
      sel.lunchCarb, sel.lunchProtein, sel.lunchSide,
      sel.dinnerCarb, sel.dinnerProtein, sel.dinnerSide
    ].filter(Boolean);
    
    dishes.forEach(dish => {
      if (dish && dish.ingredients) {
        dish.ingredients.forEach(ing => {
          const key = `${ing.name}_${ing.unit}`;
          if (!map[key]) {
            // check inventory status
            const invItem = dataStore.inventory.find(i => i.name.toLowerCase() === ing.name.toLowerCase());
            const isLowStock = invItem ? (invItem.quantity - (ing.qty * pax) <= invItem.reorderLevel) : true;
            
            map[key] = {
              name: ing.name,
              unit: ing.unit,
              totalQty: 0,
              isLowStock: isLowStock
            };
          }
          map[key].totalQty += (ing.qty * pax);
        });
      }
    });
  });
  return Object.values(map).sort((a, b) => b.totalQty - a.totalQty);
});

const hasLowStock = computed(() => aggregatedIngredients.value.some(i => i.isLowStock));

function showPrepSheetPreview() {
  // Validate that all groups have meals assigned
  let incomplete = false;
  dietGroups.value.forEach(group => {
    const sel = groupSelections[group.dietType];
    if (!sel.breakfastProtein || !sel.lunchProtein || !sel.dinnerProtein) {
      incomplete = true;
    }
  });

  if (incomplete) {
    alert("Please ensure all active diet groups have Breakfast, Lunch, and Dinner assigned before dispatching.");
    return;
  }
  
  isPreviewModalOpen.value = true;
}

function confirmDispatch() {
  // 1. Save to Meal Assignments for each patient
  dietGroups.value.forEach(group => {
    const sel = groupSelections[group.dietType];
    group.patients.forEach(patient => {
      const existing = dataStore.mealAssignments.find(m => m.patientId === patient.id && m.date === selectedDate.value);
      
      const payload = {
        patientId: patient.id,
        patientName: patient.name,
        date: selectedDate.value,
        breakfastCarb: sel.breakfastCarb?.name || null,
        breakfastProtein: sel.breakfastProtein?.name || null,
        breakfastSide: sel.breakfastSide?.name || null,
        lunchCarb: sel.lunchCarb?.name || null,
        lunchProtein: sel.lunchProtein?.name || null,
        lunchSide: sel.lunchSide?.name || null,
        dinnerCarb: sel.dinnerCarb?.name || null,
        dinnerProtein: sel.dinnerProtein?.name || null,
        dinnerSide: sel.dinnerSide?.name || null,
        breakfastPortion: 1.0,
        lunchPortion: 1.0,
        dinnerPortion: 1.0,
        breakfastCost: (sel.breakfastCarb?.cost || 0) + (sel.breakfastProtein?.cost || 0) + (sel.breakfastSide?.cost || 0),
        lunchCost: (sel.lunchCarb?.cost || 0) + (sel.lunchProtein?.cost || 0) + (sel.lunchSide?.cost || 0),
        dinnerCost: (sel.dinnerCarb?.cost || 0) + (sel.dinnerProtein?.cost || 0) + (sel.dinnerSide?.cost || 0),
        totalCost: calculateGroupTotalCost({ dietType: group.dietType, patients: [patient] }),
        assignedBy: authStore.currentUser?.name || "Dietitian",
        assignedAt: new Date().toISOString()
      };

      if (existing) {
        Object.assign(existing, payload);
      } else {
        dataStore.addMealAssignment({
          id: `MA${Date.now()}_${patient.id}`,
          ...payload
        });
      }
    });
  });

  isPreviewModalOpen.value = false;
  alert("Successfully dispatched to Kitchen! Meal assignments saved.");
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Custom scrollbar for inner panes */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
