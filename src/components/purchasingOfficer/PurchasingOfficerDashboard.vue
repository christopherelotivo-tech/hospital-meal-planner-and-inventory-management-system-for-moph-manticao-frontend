<template>
  <div class="space-y-6">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-600 text-sm font-medium">Total Items in Stock</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">1,245</p>
          </div>
          <Package class="text-blue-500" :size="32" />
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-600 text-sm font-medium">Low Stock Items</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">23</p>
          </div>
          <AlertTriangle class="text-yellow-500" :size="32" />
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-600 text-sm font-medium">Out of Stock</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">5</p>
          </div>
          <TrendingDown class="text-red-500" :size="32" />
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-600 text-sm font-medium">Categories</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">12</p>
          </div>
          <BarChart3 class="text-green-500" :size="32" />
        </div>
      </div>
    </div>

    <!-- Smart Buy List Alert -->
    <div class="bg-red-50 border border-red-200 rounded-2xl p-6">
      <button @click="smartBuyListExpanded = !smartBuyListExpanded" class="w-full flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <ShoppingCart class="text-red-500" :size="24" />
          <div class="text-left">
            <h3 class="font-semibold text-gray-900">Smart Buy List</h3>
            <p class="text-sm text-gray-600">Items below reorder level - action required</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <span class="bg-red-100 text-red-700 text-sm font-semibold px-3 py-1 rounded-full">3 Items</span>
          <ChevronDown :size="20" class="text-gray-400" :class="{ 'transform rotate-180': smartBuyListExpanded }" />
        </div>
      </button>

      <!-- Expanded Content -->
      <div v-if="smartBuyListExpanded" class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Rice Card -->
        <div class="bg-white rounded-lg p-4 border border-red-100">
          <div class="flex items-start justify-between mb-3">
            <h4 class="font-semibold text-gray-900">Rice</h4>
            <AlertTriangle class="text-red-500" :size="20" />
          </div>
          <div class="space-y-2 text-sm">
            <div>
              <span class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Non-Perishable</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Current Stock:</span>
              <span class="text-red-600 font-semibold">15 kg</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Reorder Level:</span>
              <span class="text-gray-900 font-semibold">20 kg</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Need to Order:</span>
              <span class="text-orange-500 font-semibold">8 kg</span>
            </div>
            <div class="flex items-center space-x-2 pt-2 border-t border-gray-200 mt-2">
              <MapPin class="text-gray-500" :size="16" />
              <span class="text-gray-600">Pantry</span>
            </div>
          </div>
        </div>

        <!-- Chicken Card -->
        <div class="bg-white rounded-lg p-4 border border-red-100">
          <div class="flex items-start justify-between mb-3">
            <h4 class="font-semibold text-gray-900">Chicken</h4>
            <AlertTriangle class="text-red-500" :size="20" />
          </div>
          <div class="space-y-2 text-sm">
            <div>
              <span class="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">Perishable</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Current Stock:</span>
              <span class="text-red-600 font-semibold">8 kg</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Reorder Level:</span>
              <span class="text-gray-900 font-semibold">10 kg</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Need to Order:</span>
              <span class="text-orange-500 font-semibold">3 kg</span>
            </div>
            <div class="flex items-center space-x-2 pt-2 border-t border-gray-200 mt-2">
              <MapPin class="text-gray-500" :size="16" />
              <span class="text-gray-600">Refrigerator</span>
            </div>
          </div>
        </div>

        <!-- Eggs Card -->
        <div class="bg-white rounded-lg p-4 border border-red-100">
          <div class="flex items-start justify-between mb-3">
            <h4 class="font-semibold text-gray-900">Eggs</h4>
            <AlertTriangle class="text-red-500" :size="20" />
          </div>
          <div class="space-y-2 text-sm">
            <div>
              <span class="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">Perishable</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Current Stock:</span>
              <span class="text-red-600 font-semibold">5 trays</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Reorder Level:</span>
              <span class="text-gray-900 font-semibold">8 trays</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Need to Order:</span>
              <span class="text-orange-500 font-semibold">5 trays</span>
            </div>
            <div class="flex items-center space-x-2 pt-2 border-t border-gray-200 mt-2">
              <MapPin class="text-gray-500" :size="16" />
              <span class="text-gray-600">Refrigerator</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Action Bar -->
    <div class="bg-white rounded-lg shadow p-6 flex items-center justify-between gap-4">
      <div class="flex-1">
        <input type="text" placeholder="Search by item name or category..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      </div>
      <button class="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center space-x-2">
        <Plus :size="20" />
        <span>Stock In</span>
      </button>
    </div>

    <!-- Ingredient Inventory Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-bold text-gray-900">Ingredient Inventory</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Item Name</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Current Stock</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Unit</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Storage Location</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-900 font-medium">Rice</td>
              <td class="px-6 py-4 text-sm"><span class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Non-Perishable</span></td>
              <td class="px-6 py-4 text-sm text-red-600 font-semibold">15</td>
              <td class="px-6 py-4 text-sm text-gray-600">kg</td>
              <td class="px-6 py-4 text-sm"><span class="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Pantry</span></td>
              <td class="px-6 py-4 text-sm"><span class="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold flex items-center space-x-1"><AlertTriangle :size="14" /><span>Low Stock</span></span></td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-900 font-medium">Chicken</td>
              <td class="px-6 py-4 text-sm"><span class="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">Perishable</span></td>
              <td class="px-6 py-4 text-sm text-red-600 font-semibold">8</td>
              <td class="px-6 py-4 text-sm text-gray-600">kg</td>
              <td class="px-6 py-4 text-sm"><span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Refrigerator</span></td>
              <td class="px-6 py-4 text-sm"><span class="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold flex items-center space-x-1"><AlertTriangle :size="14" /><span>Low Stock</span></span></td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-900 font-medium">Vegetables</td>
              <td class="px-6 py-4 text-sm"><span class="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">Perishable</span></td>
              <td class="px-6 py-4 text-sm text-green-600 font-semibold">45</td>
              <td class="px-6 py-4 text-sm text-gray-600">kg</td>
              <td class="px-6 py-4 text-sm"><span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Refrigerator</span></td>
              <td class="px-6 py-4 text-sm"><span class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">In Stock</span></td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-900 font-medium">Cooking Oil</td>
              <td class="px-6 py-4 text-sm"><span class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Non-Perishable</span></td>
              <td class="px-6 py-4 text-sm text-green-600 font-semibold">22</td>
              <td class="px-6 py-4 text-sm text-gray-600">liters</td>
              <td class="px-6 py-4 text-sm"><span class="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Pantry</span></td>
              <td class="px-6 py-4 text-sm"><span class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">In Stock</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref } from 'vue';
import { Package, AlertTriangle, TrendingDown, BarChart3, ShoppingCart, ChevronDown, Plus, MapPin } from 'lucide-vue-next';

const smartBuyListExpanded = ref(false);
</script>

<style scoped>
</style>
