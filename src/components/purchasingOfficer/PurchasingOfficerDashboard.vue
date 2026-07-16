<template>
  <div class="space-y-6 w-full max-w-full overflow-x-hidden pb-8">
    
    <!-- Zone 1: Top Context Header -->
    <div class="w-full rounded-2xl shadow-sm px-6 py-8 flex justify-between items-center text-white mb-6 bg-gradient-to-r from-purple-600 to-indigo-500">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">Purchasing Overview</h2>
        <p class="text-purple-100 text-sm mt-1">Inventory Status: Monitored</p>
      </div>
      <div class="text-right hidden sm:block">
        <p class="font-medium">{{ currentDate }}</p>
      </div>
    </div>

    <!-- Zone 2: KPI & Census Metric Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      
      <!-- Card 1: Procurement Sourcing Scale -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col justify-center border-l-4 border-l-purple-500">
        <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Procurement Sourcing Scale</p>
        <div class="flex items-center space-x-3 mt-1">
          <Scale class="text-purple-600 w-8 h-8" />
          <h3 class="text-xl font-bold text-purple-900 leading-tight">Sourcing for {{ activePatientsCount }} Pax Today</h3>
        </div>
      </div>

      <!-- Card 2: Total Items in Stock -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col justify-center">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Items</p>
            <h3 class="text-3xl font-bold text-slate-800">{{ totalItems }}</h3>
          </div>
          <div class="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
            <Package :size="24" />
          </div>
        </div>
      </div>

      <!-- Card 3: Low Stock Items -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col justify-center">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Low Stock</p>
            <h3 class="text-3xl font-bold text-amber-600">{{ lowStockItems }}</h3>
          </div>
          <div class="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
            <AlertTriangle :size="24" />
          </div>
        </div>
      </div>

      <!-- Card 4: Total Inventory Value -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col justify-center">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Inv. Value</p>
            <h3 class="text-3xl font-bold text-emerald-600">₱{{ totalInventoryValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}</h3>
          </div>
          <div class="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
            <TrendingDown :size="24" />
          </div>
        </div>
      </div>

    </div>

    <!-- Zone 3: Quick Actions Row -->
    <div class="flex flex-wrap gap-4 mt-6 items-center">
      <div class="flex-1 min-w-[200px] relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="18" />
        <input type="text" v-model="searchQuery" placeholder="Search Inventory..." class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-sm text-slate-700 shadow-sm transition-all bg-white" />
      </div>
      <button @click="showStockInModal = true" class="px-6 py-2.5 rounded-lg text-white font-medium shadow-sm hover:shadow-md transition-all active:scale-95 bg-slate-600 hover:bg-slate-700 flex items-center space-x-2">
        <Plus :size="18" />
        <span>Manual Stock Adjustment</span>
      </button>
    </div>

    <!-- Zone 4: Primary Content Grid Workspace -->
    <div class="flex flex-col gap-6 mt-6">
      
      <!-- Smart Buy List Alert Block -->
      <div class="bg-purple-50 border-l-4 border-purple-500 rounded-r-xl p-5 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <ShoppingCart class="text-purple-600" :size="24" />
            <div>
              <h3 class="font-bold text-purple-900">Smart Buy List</h3>
              <p class="text-sm text-purple-700">AI-suggested items to purchase today based on low stock and menu requirements.</p>
            </div>
          </div>
          <span class="bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-1 rounded-full">{{ lowStockItems }} Items</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="item in dataStore.inventory.filter(i => i.status === 'Low Stock').slice(0, 3)" :key="item.id" class="bg-white rounded-lg p-4 border border-purple-100 shadow-sm">
            <div class="flex items-start justify-between mb-2">
              <h4 class="font-semibold text-slate-800">{{ item.name }}</h4>
              <span class="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Low Stock</span>
            </div>
            <p class="text-xs text-slate-500 mb-2">Need to order: <span class="font-bold text-slate-800">{{ item.reorderLevel - item.quantity }} {{ item.unit }}</span></p>
            <div class="flex items-center space-x-1 text-slate-400 text-[10px] mt-2">
              <span>Location: {{ item.location }}</span>
            </div>
          </div>
          <div v-if="lowStockItems === 0" class="col-span-3 text-center py-4 text-sm text-purple-600 font-medium">
            ✓ All items are fully stocked!
          </div>
        </div>
      </div>

      <!-- Ingredient Inventory Data Table -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 class="font-bold text-slate-800">Ingredient Inventory</h3>
          <div class="flex space-x-2">
            <button class="text-xs font-semibold px-3 py-1.5 rounded-md bg-white border border-slate-200 text-slate-600 shadow-sm">Filter</button>
            <button class="text-xs font-semibold px-3 py-1.5 rounded-md bg-white border border-slate-200 text-slate-600 shadow-sm">Export</button>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-white border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th class="py-3 px-5">Item Name</th>
                <th class="py-3 px-5">Type</th>
                <th class="py-3 px-5">Current Stock</th>
                <th class="py-3 px-5">Unit Price</th>
                <th class="py-3 px-5">Total Value</th>
                <th class="py-3 px-5">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="item in filteredInventory" :key="item.id" class="hover:bg-slate-50 transition-colors">
                <td class="py-3 px-5 text-sm font-medium text-slate-800">{{ item.name }}</td>
                <td class="py-3 px-5 text-sm">
                  <span class="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
                    {{ item.type }}
                  </span>
                </td>
                <td class="py-3 px-5 text-sm font-bold" :class="item.status === 'Low Stock' || item.status === 'Out of Stock' ? 'text-red-600' : 'text-slate-800'">
                  {{ item.quantity }} {{ item.unit }}
                </td>
                <td class="py-3 px-5 text-sm text-slate-600 font-medium">
                  ₱{{ (item.unitPrice || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}
                </td>
                <td class="py-3 px-5 text-sm text-emerald-600 font-bold">
                  ₱{{ ((item.quantity || 0) * (item.unitPrice || 0)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}
                </td>
                <td class="py-3 px-5 text-sm">
                  <span v-if="item.status === 'Low Stock'" class="flex items-center space-x-1 text-red-600 font-medium text-xs">
                    <AlertTriangle :size="14" />
                    <span>Low Stock</span>
                  </span>
                  <span v-else-if="item.status === 'Out of Stock'" class="flex items-center space-x-1 text-red-700 font-bold text-xs">
                    <AlertTriangle :size="14" />
                    <span>Out of Stock</span>
                  </span>
                  <span v-else class="text-green-600 font-medium text-xs">In Stock</span>
                </td>
              </tr>
              <tr v-if="filteredInventory.length === 0">
                <td colspan="5" class="py-8 text-center text-sm text-slate-400">No inventory items found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- Stock In Modal -->
    <div v-if="showStockInModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">
        <!-- header -->
        <div class="bg-gradient-to-r from-slate-700 to-slate-600 text-white p-5 flex items-center justify-between shrink-0">
          <div class="flex items-center space-x-2">
            <Package :size="24" />
            <h3 class="text-xl font-bold">Manual Stock Adjustment</h3>
          </div>
          <button @click="showStockInModal = false" class="text-white hover:text-orange-100 transition-colors p-1 bg-white/10 rounded-lg">
            <X :size="20" />
          </button>
        </div>

        <!-- modal body -->
        <form @submit.prevent="handleStockIn" class="p-6 space-y-4 overflow-y-auto">
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1">Item Name *</label>
            <input type="text" v-model="form.name" required placeholder="Enter item name" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm shadow-sm" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Quantity *</label>
              <input type="number" step="any" v-model.number="form.quantity" required min="0.01" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Unit of Measurement *</label>
              <select v-model="form.unit" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm shadow-sm bg-white">
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="liters">liters</option>
                <option value="ml">ml</option>
                <option value="pieces">pieces</option>
                <option value="trays">trays</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1">Total Cost *</label>
            <div class="relative">
              <input type="number" step="any" v-model.number="form.cost" required min="0" class="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm shadow-sm" />
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₱</span>
            </div>
            <p class="text-[11px] text-slate-400 mt-1">in PHP (₱)</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Expiration Date *</label>
              <input type="date" v-model="form.expirationDate" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm shadow-sm bg-white" />
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Storage Location *</label>
              <select v-model="form.location" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm shadow-sm bg-white">
                <option value="Pantry">Pantry</option>
                <option value="Refrigerator">Refrigerator</option>
                <option value="Freezer">Freezer</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1">Perishable *</label>
            <select v-model="form.type" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm shadow-sm bg-white">
              <option value="Perishable">Perishable</option>
              <option value="Non-Perishable">Non-Perishable</option>
            </select>
          </div>

          <!-- footer buttons -->
          <div class="border-t border-slate-100 pt-5 mt-6 flex gap-3 justify-end shrink-0">
            <button type="button" @click="showStockInModal = false" class="px-6 py-2.5 text-slate-700 font-semibold bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-sm">
              Cancel
            </button>
            <button type="submit" class="px-6 py-2.5 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-sm text-sm">
              Apply Adjustment
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
import { Package, AlertTriangle, TrendingDown, ShoppingCart, Search, Plus, Scale, X } from 'lucide-vue-next';

const dataStore = useDataStore();
const currentDate = ref(new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
const searchQuery = ref('');

const activePatientsCount = computed(() => {
  return dataStore.patients.filter(p => p.status === 'Active').length;
});

const totalItems = computed(() => dataStore.inventory.length);
const lowStockItems = computed(() => dataStore.inventory.filter(i => i.status === 'Low Stock').length);
const outOfStockItems = computed(() => dataStore.inventory.filter(i => i.status === 'Out of Stock').length);

const totalInventoryValue = computed(() => {
  return dataStore.inventory.reduce((sum, item) => sum + ((item.quantity || 0) * (item.unitPrice || 0)), 0);
});

const filteredInventory = computed(() => {
  if (!searchQuery.value) return dataStore.inventory;
  const q = searchQuery.value.toLowerCase();
  return dataStore.inventory.filter(item => 
    item.name.toLowerCase().includes(q) || 
    item.type.toLowerCase().includes(q) || 
    item.location.toLowerCase().includes(q)
  );
});

// Modal state & form
const showStockInModal = ref(false);
const form = ref({
  name: '',
  quantity: 0,
  unit: 'kg',
  cost: 0,
  expirationDate: '',
  location: 'Pantry',
  type: 'Perishable'
});

function handleStockIn() {
  if (!form.value.name || !form.value.quantity) return;
  dataStore.addStockIn({
    name: form.value.name,
    quantity: form.value.quantity,
    unit: form.value.unit,
    cost: form.value.cost,
    expirationDate: form.value.expirationDate,
    location: form.value.location,
    type: form.value.type
  });
  
  // reset form
  form.value = {
    name: '',
    quantity: 0,
    unit: 'kg',
    cost: 0,
    expirationDate: '',
    location: 'Pantry',
    type: 'Perishable'
  };
  showStockInModal.value = false;
}
</script>
