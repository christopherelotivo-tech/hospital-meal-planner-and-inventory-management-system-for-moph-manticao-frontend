<template>
  <div class="space-y-6 w-full max-w-full overflow-x-hidden pb-8">

    <!-- Header Banner -->
    <div class="w-full rounded-2xl shadow-sm px-6 py-8 flex justify-between items-center text-white bg-gradient-to-r from-violet-700 to-indigo-500">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">Market Purchase Records</h2>
        <p class="text-violet-100 text-sm mt-1">Log daily market purchases — inventory updates automatically</p>
      </div>
      <div class="text-right hidden sm:block">
        <p class="font-medium text-sm">{{ currentDate }}</p>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex items-center justify-between border-l-4 border-l-violet-500">
        <div>
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Trips</p>
          <h3 class="text-3xl font-bold text-slate-800">{{ purchaseOrders.length }}</h3>
        </div>
        <div class="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center text-violet-500">
          <ShoppingBag :size="22" />
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">This Month</p>
          <h3 class="text-xl font-bold text-slate-800">{{ monthlyCount }} trips</h3>
        </div>
        <div class="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
          <Calendar :size="22" />
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Spent (Month)</p>
          <h3 class="text-2xl font-bold text-emerald-600">{{ monthlyTotalFormatted }}</h3>
        </div>
        <div class="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
          <TrendingUp :size="22" />
        </div>
      </div>
    </div>

    <!-- Info Banner -->
    <div class="bg-violet-50 border-l-4 border-violet-500 rounded-r-xl p-4 flex items-start space-x-3">
      <Info :size="18" class="text-violet-600 mt-0.5 shrink-0" />
      <p class="text-sm text-violet-700"><strong>Auto-inventory update:</strong> When you log a market purchase, the inventory is automatically updated for each item. No need to manually stock in afterwards.</p>
    </div>

    <!-- Action Bar -->
    <div class="flex flex-wrap gap-3 items-center">
      <div class="flex-1 min-w-[200px] relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="16" />
        <input v-model="searchQuery" type="text" placeholder="Search records..." class="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none text-sm bg-white shadow-sm" />
      </div>
      <button @click="showCreateModal = true" class="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold text-sm shadow-sm transition-all flex items-center space-x-2">
        <Plus :size="16" />
        <span>Log Manual Receipt</span>
      </button>
    </div>

    <!-- Records Table -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="p-5 border-b border-slate-100 bg-slate-50">
        <h3 class="font-bold text-slate-800">All Purchase History & Receipts</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white">
              <th class="py-3 px-5">Record #</th>
              <th class="py-3 px-5">Date</th>
              <th class="py-3 px-5">Market Location</th>
              <th class="py-3 px-5">Items Bought</th>
              <th class="py-3 px-5">Total Spent</th>
              <th class="py-3 px-5">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-slate-50 transition-colors">
              <td class="py-3 px-5 text-sm font-bold text-violet-700">{{ order.id }}</td>
              <td class="py-3 px-5 text-sm text-slate-600">{{ formatDate(order.date) }}</td>
              <td class="py-3 px-5 text-sm font-medium text-slate-800">
                <div class="flex items-center space-x-2">
                  <MapPin :size="13" class="text-slate-400" />
                  <span>{{ order.marketLocation || order.supplier }}</span>
                </div>
              </td>
              <td class="py-3 px-5 text-sm text-slate-600">
                <span class="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium">{{ order.items.length }} item{{ order.items.length !== 1 ? 's' : '' }}</span>
                <span class="ml-2 text-slate-400 text-xs hidden sm:inline">{{ order.items.slice(0, 2).map(function(i) { return i.name; }).join(', ') }}{{ order.items.length > 2 ? '...' : '' }}</span>
              </td>
              <td class="py-3 px-5 text-sm font-bold text-emerald-700">{{ formatCurrency(order.totalCost) }}</td>
              <td class="py-3 px-5">
                <button @click="viewOrder(order)" class="text-violet-600 hover:text-violet-800 text-xs font-semibold underline">View Details</button>
              </td>
            </tr>
            <tr v-if="filteredOrders.length === 0">
              <td colspan="6" class="py-10 text-center text-sm text-slate-400">No market purchase records yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- View Record Modal -->
    <div v-if="selectedOrder" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" @click.stop>
        <div class="bg-gradient-to-r from-violet-700 to-indigo-500 text-white p-5 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-lg">{{ selectedOrder.id }}</h3>
            <p class="text-violet-100 text-sm">{{ selectedOrder.marketLocation || selectedOrder.supplier }} - {{ formatDate(selectedOrder.date) }}</p>
          </div>
          <button @click="selectedOrder = null" class="text-white hover:text-violet-200 p-1"><X :size="20" /></button>
        </div>
        <div class="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div>
            <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Items Purchased</p>
            <div class="space-y-2">
              <div v-for="(item, idx) in selectedOrder.items" :key="idx" class="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <p class="text-sm font-semibold text-slate-800">{{ item.name }}</p>
                  <p class="text-xs text-slate-500">{{ item.qty }} {{ item.unit }}</p>
                </div>
                <p class="text-sm font-bold text-slate-700">{{ formatCurrency(item.cost) }}</p>
              </div>
            </div>
          </div>
          <div class="border-t border-slate-100 pt-4 flex justify-between items-center">
            <span class="font-bold text-slate-700">Total Spent</span>
            <span class="font-bold text-xl text-emerald-600">{{ formatCurrency(selectedOrder.totalCost) }}</span>
          </div>
          <div class="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center space-x-2 text-sm text-green-700">
            <CheckCircle :size="16" class="shrink-0" />
            <span>Inventory was automatically updated when this record was saved.</span>
          </div>
          <p v-if="selectedOrder.notes" class="text-xs text-slate-500 bg-slate-50 rounded-lg p-3">Notes: {{ selectedOrder.notes }}</p>
        </div>
        <div class="px-6 pb-5 flex justify-end">
          <button @click="selectedOrder = null" class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors">Close</button>
        </div>
      </div>
    </div>

    <!-- Log Market Purchases Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden max-h-[90vh]" @click.stop>
        <div class="bg-gradient-to-r from-violet-700 to-indigo-500 text-white p-5 flex items-center justify-between shrink-0">
          <div class="flex items-center space-x-2">
            <ShoppingBag :size="20" />
            <h3 class="font-bold text-lg">Log Manual Receipt</h3>
          </div>
          <button @click="closeCreateModal" class="text-white hover:text-violet-200 p-1"><X :size="20" /></button>
        </div>
        <form @submit.prevent="handleCreatePO" class="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Market Location *</label>
            <select v-model="form.marketLocation" required class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none text-sm bg-white">
              <option value="Manticao Public Market">Manticao Public Market</option>
              <option value="Iligan City Market">Iligan City Market</option>
              <option value="CDO Carbon Market">CDO Carbon Market</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Date *</label>
            <input v-model="form.date" required type="date" class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none text-sm bg-white" />
          </div>
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-xs font-bold text-slate-700">Items Purchased *</label>
              <button type="button" @click="addItem" class="text-xs font-semibold text-violet-600 hover:text-violet-800 flex items-center space-x-1">
                <Plus :size="13" />
                <span>Add Item</span>
              </button>
            </div>
            <div class="space-y-2">
              <div v-for="(item, idx) in form.items" :key="idx" class="grid grid-cols-12 gap-2 items-center p-3 bg-slate-50 rounded-lg">
                <input v-model="item.name" type="text" placeholder="Item name" class="col-span-4 px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-violet-400" />
                <input v-model.number="item.qty" type="number" min="0.01" step="any" placeholder="Qty" class="col-span-2 px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-violet-400" />
                <select v-model="item.unit" class="col-span-2 px-2 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-violet-400 bg-white">
                  <option>kg</option><option>g</option><option>liters</option><option>ml</option><option>pcs</option><option>trays</option>
                </select>
                <div class="col-span-3 relative">
                  <span class="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">P</span>
                  <input v-model.number="item.cost" type="number" min="0" step="any" placeholder="Cost" class="w-full pl-5 pr-2 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-violet-400" />
                </div>
                <button type="button" @click="removeItem(idx)" class="col-span-1 text-red-400 hover:text-red-600 flex justify-center"><X :size="14" /></button>
              </div>
            </div>
            <p v-if="form.items.length === 0" class="text-xs text-slate-400 text-center py-3 border border-dashed border-slate-200 rounded-lg mt-2">No items yet. Click "Add Item" to start.</p>
          </div>
          <div class="bg-violet-50 rounded-lg p-3 flex justify-between items-center">
            <span class="text-sm font-bold text-violet-800">Total Cost</span>
            <span class="text-lg font-bold text-violet-700">{{ formatCurrency(computedTotal) }}</span>
          </div>
          <div class="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center space-x-2 text-xs text-green-700">
            <CheckCircle :size="14" class="shrink-0" />
            <span>Inventory will be automatically updated for each item when saved.</span>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Notes (optional)</label>
            <textarea v-model="form.notes" rows="2" placeholder="e.g. Bought extra vegetables for the week..." class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none text-sm resize-none"></textarea>
          </div>
          <div class="border-t border-slate-100 pt-4 flex gap-3 justify-end">
            <button type="button" @click="closeCreateModal" class="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" :disabled="form.items.length === 0" class="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-sm transition-colors shadow-sm">Save Record</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useDataStore } from '@/stores/dataStore';
import { ShoppingBag, Calendar, TrendingUp, Search, Plus, X, Info, MapPin, CheckCircle, Receipt } from 'lucide-vue-next';

const dataStore = useDataStore();
const currentDate = ref(new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

const searchQuery = ref('');
const showCreateModal = ref(false);
const selectedOrder = ref(null);

const purchaseOrders = computed(function() { return dataStore.purchaseOrders || []; });

const monthlyCount = computed(function() {
  const now = new Date();
  return purchaseOrders.value.filter(function(o) {
    const d = new Date(o.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
});

const monthlyTotal = computed(function() {
  const now = new Date();
  return purchaseOrders.value
    .filter(function(o) {
      const d = new Date(o.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce(function(sum, o) { return sum + o.totalCost; }, 0);
});

const monthlyTotalFormatted = computed(function() { return formatCurrency(monthlyTotal.value); });

const filteredOrders = computed(function() {
  var list = purchaseOrders.value.slice().sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
  if (searchQuery.value) {
    var q = searchQuery.value.toLowerCase();
    list = list.filter(function(o) {
      var loc = (o.marketLocation || o.supplier || '').toLowerCase();
      return loc.includes(q) || o.id.toLowerCase().includes(q);
    });
  }
  return list;
});

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatCurrency(val) {
  return 'P' + (val || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 });
}

function viewOrder(order) { selectedOrder.value = order; }

var form = ref({ marketLocation: 'Manticao Public Market', date: new Date().toISOString().split('T')[0], items: [], notes: '' });

var computedTotal = computed(function() { return form.value.items.reduce(function(sum, i) { return sum + (i.cost || 0); }, 0); });

function addItem() { form.value.items.push({ name: '', qty: 1, unit: 'kg', cost: 0 }); }

function removeItem(idx) { form.value.items.splice(idx, 1); }

function closeCreateModal() {
  showCreateModal.value = false;
  form.value = { marketLocation: 'Manticao Public Market', date: new Date().toISOString().split('T')[0], items: [], notes: '' };
}

function handleCreatePO() {
  if (!form.value.marketLocation || form.value.items.length === 0) return;
  var po = {
    id: 'MP' + Date.now(),
    marketLocation: form.value.marketLocation,
    date: form.value.date,
    items: form.value.items.map(function(i) { return Object.assign({}, i); }),
    totalCost: computedTotal.value,
    notes: form.value.notes
  };
  dataStore.addPurchaseOrder(po);
  closeCreateModal();
}
</script>
