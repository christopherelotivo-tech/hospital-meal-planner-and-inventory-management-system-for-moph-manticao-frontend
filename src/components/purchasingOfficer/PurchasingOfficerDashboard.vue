<template>
  <div class="space-y-6 w-full max-w-full overflow-x-hidden pb-8">
    
    <!-- Zone 1: Top Context Header -->
    <div class="w-full rounded-2xl shadow-sm px-6 py-8 flex justify-between items-center text-white mb-6 bg-gradient-to-r from-purple-600 to-indigo-500">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">Daily Market List</h2>
        <p class="text-purple-100 text-sm mt-1">Just-In-Time (JIT) Inventory Model</p>
      </div>
      <div class="text-right hidden sm:block">
        <p class="font-medium">{{ currentDate }}</p>
      </div>
    </div>

    <!-- Zone 2: KPI & Census Metric Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      
      <!-- Card 1: Total Items to Buy -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col justify-center border-l-4 border-l-purple-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Items to Buy Today</p>
            <h3 class="text-3xl font-bold text-purple-900">{{ totalItems }}</h3>
          </div>
          <div class="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
            <ShoppingCart :size="24" />
          </div>
        </div>
      </div>

      <!-- Card 2: Items Purchased -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col justify-center border-l-4 border-l-emerald-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Items Purchased</p>
            <h3 class="text-3xl font-bold text-emerald-600">{{ purchasedItems }}</h3>
          </div>
          <div class="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
            <CheckCircle :size="24" />
          </div>
        </div>
      </div>

      <!-- Card 3: Items Pending -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col justify-center border-l-4 border-l-amber-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Items Pending</p>
            <h3 class="text-3xl font-bold text-amber-600">{{ pendingItems }}</h3>
          </div>
          <div class="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
            <Clock :size="24" />
          </div>
        </div>
      </div>

    </div>

    <!-- Zone 3: Quick Actions Row -->
    <div class="flex flex-wrap gap-4 mt-6 items-center justify-between">
      <div class="flex-1 min-w-[200px] relative max-w-md">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="18" />
        <input type="text" v-model="searchQuery" placeholder="Search Market List..." class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-sm text-slate-700 shadow-sm transition-all bg-white" />
      </div>
      <div class="flex space-x-3">
        <button @click="showUnplannedModal = true" class="px-6 py-2.5 rounded-lg text-purple-700 font-medium shadow-sm hover:shadow-md transition-all active:scale-95 bg-purple-50 hover:bg-purple-100 border border-purple-200 flex items-center space-x-2">
          <Plus :size="18" />
          <span>Add Unplanned Purchase</span>
        </button>
        <button @click="printList" class="px-6 py-2.5 rounded-lg text-white font-medium shadow-sm hover:shadow-md transition-all active:scale-95 bg-slate-600 hover:bg-slate-700 flex items-center space-x-2">
          <Printer :size="18" />
          <span>Print Market List</span>
        </button>
      </div>
    </div>

    <!-- Zone 4: Primary Content Grid Workspace -->
    <div class="flex flex-col gap-6 mt-6">
      
      <!-- Ingredient Inventory Data Table -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-slate-800">Today's Market List</h3>
            <p class="text-xs text-slate-500 mt-1">Automatically calculated based on Dietitian's meal assignments for today.</p>
          </div>
          <div class="flex space-x-2">
            <button class="text-xs font-semibold px-3 py-1.5 rounded-md bg-white border border-slate-200 text-slate-600 shadow-sm">Filter</button>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-white border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th class="py-3 px-5">Ingredient Name</th>
                <th class="py-3 px-5">Category</th>
                <th class="py-3 px-5">Required Quantity</th>
                <th class="py-3 px-5">Actual Cost</th>
                <th class="py-3 px-5">Status</th>
                <th class="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="item in filteredList" :key="item.id" class="hover:bg-slate-50 transition-colors" :class="{'bg-emerald-50/30': item.status === 'Purchased', 'bg-orange-50/30': item.isSubstitute}">
                <td class="py-3 px-5">
                  <div class="flex flex-col">
                    <span class="text-sm font-medium" :class="item.status === 'Purchased' && !item.isSubstitute ? 'text-slate-500 line-through' : 'text-slate-800'">
                      {{ item.name }}
                    </span>
                    <span v-if="item.isSubstitute" class="text-[10px] font-bold text-orange-600 mt-0.5">UNPLANNED / SUBSTITUTE</span>
                  </div>
                </td>
                <td class="py-3 px-5 text-sm">
                  <span class="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
                    {{ item.category }}
                  </span>
                </td>
                <td class="py-3 px-5 text-sm font-bold text-purple-700">
                  {{ item.quantity }} {{ item.unit }}
                </td>
                <td class="py-3 px-5 text-sm font-semibold">
                  <span v-if="item.totalCost" class="text-emerald-700">₱{{ item.totalCost.toLocaleString(undefined, {minimumFractionDigits: 2}) }}</span>
                  <span v-else class="text-slate-300">-</span>
                </td>
                <td class="py-3 px-5 text-sm">
                  <span v-if="item.status === 'Pending'" class="flex items-center space-x-1 text-amber-600 font-medium text-xs">
                    <Clock :size="14" />
                    <span>Pending Purchase</span>
                  </span>
                  <span v-else class="flex items-center space-x-1 text-emerald-600 font-bold text-xs">
                    <CheckCircle :size="14" />
                    <span>Purchased</span>
                  </span>
                </td>
                <td class="py-3 px-5 text-right">
                  <button 
                    v-if="item.status === 'Pending'"
                    @click="openReceiptModal(item)" 
                    class="text-xs font-semibold px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-all active:scale-95">
                    Log Purchase
                  </button>
                  <button 
                    v-else-if="!item.isSubstitute"
                    @click="undoPurchase(item.id)" 
                    class="text-xs font-semibold px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 shadow-sm transition-all active:scale-95">
                    Undo
                  </button>
                  <button 
                    v-else
                    @click="removeSubstitute(item.id)" 
                    class="text-xs font-semibold px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 shadow-sm transition-all active:scale-95">
                    Remove
                  </button>
                </td>
              </tr>
              <tr v-if="filteredList.length === 0">
                <td colspan="6" class="py-8 text-center text-sm text-slate-400">No items needed for today's market list.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- Log Receipt Modal -->
    <div v-if="showReceiptModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden">
        <!-- header -->
        <div class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-5 flex items-center justify-between shrink-0">
          <div class="flex items-center space-x-2">
            <CheckCircle :size="20" />
            <h3 class="text-lg font-bold">Log Market Receipt</h3>
          </div>
          <button @click="showReceiptModal = false" class="text-white hover:text-purple-100 transition-colors p-1 bg-white/10 rounded-lg">
            <X :size="18" />
          </button>
        </div>

        <!-- modal body -->
        <form @submit.prevent="handleReceiptSubmit" class="p-6 space-y-5">
          <div v-if="selectedReceiptItem" class="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <p class="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Purchasing</p>
            <h4 class="text-lg font-bold text-slate-800">{{ selectedReceiptItem.name }}</h4>
            <p class="text-sm font-medium text-purple-600 mt-1">Required: {{ selectedReceiptItem.quantity }} {{ selectedReceiptItem.unit }}</p>
          </div>

          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Exact Amount Paid (Total) *</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₱</span>
              <input type="number" step="0.01" v-model.number="receiptForm.totalCost" required placeholder="0.00" min="0" class="w-full pl-9 pr-4 py-3 border border-slate-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-lg font-bold text-slate-800 shadow-sm transition-all" />
            </div>
            <p class="text-[11px] text-slate-500 mt-2 leading-relaxed">Enter the total amount paid at the market so the Dietitian's Estimated Budget automatically updates with today's real prices.</p>
          </div>

          <!-- footer buttons -->
          <div class="border-t border-slate-100 pt-5 mt-6 flex gap-3 justify-end shrink-0">
            <button type="button" @click="showReceiptModal = false" class="px-5 py-2.5 text-slate-700 font-semibold bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-sm">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-sm text-sm flex items-center space-x-2">
              <CheckCircle :size="16" />
              <span>Confirm Purchase</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Unplanned Purchase Modal -->
    <div v-if="showUnplannedModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">
        <!-- header -->
        <div class="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-5 flex items-center justify-between shrink-0">
          <div class="flex items-center space-x-2">
            <Plus :size="24" />
            <h3 class="text-xl font-bold">Log Unplanned Purchase</h3>
          </div>
          <button @click="showUnplannedModal = false" class="text-white hover:text-orange-100 transition-colors p-1 bg-white/10 rounded-lg">
            <X :size="20" />
          </button>
        </div>

        <!-- modal body -->
        <form @submit.prevent="handleUnplannedPurchase" class="p-6 space-y-4 overflow-y-auto">
          <div class="bg-orange-50 p-3 rounded-lg border border-orange-100 mb-4">
            <p class="text-xs text-orange-800">Use this form to log items you bought that were <strong>not on the Daily Market List</strong> (e.g. Budget adjustments, substitutions).</p>
          </div>

          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1">Ingredient Name *</label>
            <input type="text" v-model="unplannedForm.name" required placeholder="e.g. Pork Belly" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm shadow-sm" />
          </div>

          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1">Category *</label>
            <select v-model="unplannedForm.category" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm shadow-sm bg-white">
              <option value="Meat">Meat</option>
              <option value="Seafood">Seafood</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Grains">Grains</option>
              <option value="Pantry">Pantry / Condiments</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Quantity *</label>
              <input type="number" step="any" v-model.number="unplannedForm.quantity" required min="0.1" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Unit *</label>
              <select v-model="unplannedForm.unit" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm shadow-sm bg-white">
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="liters">liters</option>
                <option value="pieces">pieces</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Total Cost (₱) *</label>
              <input type="number" step="any" v-model.number="unplannedForm.totalCost" required min="0" placeholder="0.00" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Reason *</label>
              <input type="text" v-model="unplannedForm.reason" required placeholder="e.g. Price adj." class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm shadow-sm" />
            </div>
          </div>

          <!-- footer buttons -->
          <div class="border-t border-slate-100 pt-5 mt-6 flex gap-3 justify-end shrink-0">
    <button type="button" @click="showUnplannedModal = false" class="px-6 py-2.5 text-slate-700 font-semibold bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-sm">
              Cancel
            </button>
            <button type="submit" class="px-6 py-2.5 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors shadow-sm text-sm">
              Log Unplanned Purchase
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useDataStore } from '@/stores/dataStore';
import { ShoppingCart, CheckCircle, Clock, Search, Printer, Plus, X } from 'lucide-vue-next';

const dataStore = useDataStore();

const currentDate = ref(new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
const searchQuery = ref('');

// Mock Daily Market List based on JIT model
const dailyMarketList = ref([
  { id: 'M001', name: 'Chicken Breast', category: 'Meat', quantity: 15, unit: 'kg', status: 'Pending', totalCost: null },
  { id: 'M002', name: 'White Rice', category: 'Grains', quantity: 20, unit: 'kg', status: 'Pending', totalCost: null },
  { id: 'M003', name: 'Carrots', category: 'Vegetables', quantity: 5, unit: 'kg', status: 'Pending', totalCost: null },
  { id: 'M004', name: 'Potatoes', category: 'Vegetables', quantity: 8, unit: 'kg', status: 'Purchased', totalCost: 640 },
  { id: 'M005', name: 'Fish Fillet (Tilapia)', category: 'Seafood', quantity: 10, unit: 'kg', status: 'Pending', totalCost: null },
  { id: 'M006', name: 'Cooking Oil', category: 'Pantry', quantity: 3, unit: 'liters', status: 'Purchased', totalCost: 350 },
  { id: 'M007', name: 'Garlic', category: 'Vegetables', quantity: 1, unit: 'kg', status: 'Pending', totalCost: null },
  { id: 'M008', name: 'Onions', category: 'Vegetables', quantity: 2, unit: 'kg', status: 'Pending', totalCost: null }
]);

const totalItems = computed(() => dailyMarketList.value.length);
const purchasedItems = computed(() => dailyMarketList.value.filter(i => i.status === 'Purchased').length);
const pendingItems = computed(() => dailyMarketList.value.filter(i => i.status === 'Pending').length);

const filteredList = computed(() => {
  if (!searchQuery.value) return dailyMarketList.value;
  const q = searchQuery.value.toLowerCase();
  return dailyMarketList.value.filter(item => 
    item.name.toLowerCase().includes(q) || 
    item.category.toLowerCase().includes(q)
  );
});

// Log Receipt Modal Logic
const showReceiptModal = ref(false);
const selectedReceiptItem = ref(null);
const receiptForm = ref({ totalCost: null });

function openReceiptModal(item) {
  selectedReceiptItem.value = item;
  receiptForm.value.totalCost = null;
  showReceiptModal.value = true;
}

function handleReceiptSubmit() {
  if (selectedReceiptItem.value && receiptForm.value.totalCost > 0) {
    selectedReceiptItem.value.status = 'Purchased';
    selectedReceiptItem.value.totalCost = receiptForm.value.totalCost;
    
    // Save to global history and automatically update inventory stock
    dataStore.addPurchaseOrder({
      id: `MP${Date.now()}`,
      marketLocation: 'Manticao Public Market',
      date: new Date().toISOString().split('T')[0],
      items: [{ 
        name: selectedReceiptItem.value.name, 
        qty: selectedReceiptItem.value.quantity, 
        unit: selectedReceiptItem.value.unit, 
        cost: receiptForm.value.totalCost 
      }],
      totalCost: receiptForm.value.totalCost,
      notes: 'Logged directly from Daily Market List'
    });

    showReceiptModal.value = false;
  }
}

function undoPurchase(id) {
  const item = dailyMarketList.value.find(i => i.id === id);
  if (item) {
    item.status = 'Pending';
    item.totalCost = null;
  }
}

function printList() {
  alert("Printing today's market list...");
}

// Unplanned Purchase Modal Logic
const showUnplannedModal = ref(false);
const unplannedForm = ref({
  name: '',
  category: 'Meat',
  quantity: 1,
  unit: 'kg',
  totalCost: null,
  reason: ''
});

function handleUnplannedPurchase() {
  if (!unplannedForm.value.name || !unplannedForm.value.quantity) return;
  
  const newItem = {
    id: `U${Date.now()}`,
    name: unplannedForm.value.name,
    category: unplannedForm.value.category,
    quantity: unplannedForm.value.quantity,
    unit: unplannedForm.value.unit,
    status: 'Purchased',
    isSubstitute: true,
    totalCost: unplannedForm.value.totalCost,
    reason: unplannedForm.value.reason
  };
  dailyMarketList.value.push(newItem);
  
  // Save to global history and update inventory stock
  dataStore.addPurchaseOrder({
    id: `MP${Date.now()}`,
    marketLocation: 'Manticao Public Market',
    date: new Date().toISOString().split('T')[0],
    items: [{ 
      name: newItem.name, 
      qty: newItem.quantity, 
      unit: newItem.unit, 
      cost: newItem.totalCost 
    }],
    totalCost: newItem.totalCost,
    notes: `Unplanned Purchase: ${newItem.reason}`
  });
  
  // Reset and close
  unplannedForm.value = {
    name: '',
    category: 'Meat',
    quantity: 1,
    unit: 'kg',
    totalCost: null,
    reason: ''
  };
  showUnplannedModal.value = false;
}

function removeSubstitute(id) {
  dailyMarketList.value = dailyMarketList.value.filter(i => i.id !== id);
}
</script>
