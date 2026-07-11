<template>
  <div class="space-y-6">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-600 text-sm font-medium">Total Stock In</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">8</p>
            <p class="text-sm text-green-600 font-medium mt-1">Transactions</p>
          </div>
          <TrendingUp class="text-green-400 bg-green-50 p-2 rounded-full" :size="32" />
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-600 text-sm font-medium">Total Deductions</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">0</p>
            <p class="text-sm text-red-600 font-medium mt-1">Transactions</p>
          </div>
          <TrendingDown class="text-red-400 bg-red-50 p-2 rounded-full" :size="32" />
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-600 text-sm font-medium">Adjustments</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">0</p>
            <p class="text-sm text-blue-600 font-medium mt-1">Corrections Made</p>
          </div>
          <Calendar class="text-blue-400 bg-blue-50 p-2 rounded-full" :size="32" />
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input type="text" placeholder="Search by item name or reference" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Filter by Action</label>
          <select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>All Actions</option>
            <option>Stock In</option>
            <option>Deduction</option>
            <option>Adjustment</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Filter by Date</label>
          <input type="date" placeholder="mm/dd/yyyy" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>
      </div>
    </div>

    <!-- Stock Movement Log Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-bold text-gray-900">Stock Movement Log</h2>
        <p class="text-sm text-gray-600 mt-1">Track all inventory transactions including stock-in and production deductions</p>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date & Time</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Item Name</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Quantity</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Reference</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Performed By</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-600">Mar 3, 2026 10:30 AM</td>
              <td class="px-6 py-4 text-sm text-gray-900 font-medium">Rice (5kg bag)</td>
              <td class="px-6 py-4 text-sm"><span class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Stock In</span></td>
              <td class="px-6 py-4 text-sm text-gray-900">100</td>
              <td class="px-6 py-4 text-sm text-gray-600">PO-2026-001</td>
              <td class="px-6 py-4 text-sm text-gray-600">Pedro Garcia</td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-600">Mar 2, 2026 02:15 PM</td>
              <td class="px-6 py-4 text-sm text-gray-900 font-medium">Mixed Vegetables</td>
              <td class="px-6 py-4 text-sm"><span class="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Deduction</span></td>
              <td class="px-6 py-4 text-sm text-gray-900">50</td>
              <td class="px-6 py-4 text-sm text-gray-600">DIST-2026-045</td>
              <td class="px-6 py-4 text-sm text-gray-600">Rosa Lopez</td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-600">Mar 1, 2026 09:45 AM</td>
              <td class="px-6 py-4 text-sm text-gray-900 font-medium">Canned Fruits</td>
              <td class="px-6 py-4 text-sm"><span class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Stock In</span></td>
              <td class="px-6 py-4 text-sm text-gray-900">75</td>
              <td class="px-6 py-4 text-sm text-gray-600">PO-2026-002</td>
              <td class="px-6 py-4 text-sm text-gray-600">Pedro Garcia</td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-600">Feb 28, 2026 03:20 PM</td>
              <td class="px-6 py-4 text-sm text-gray-900 font-medium">Cooking Oil (1L)</td>
              <td class="px-6 py-4 text-sm"><span class="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Deduction</span></td>
              <td class="px-6 py-4 text-sm text-gray-900">30</td>
              <td class="px-6 py-4 text-sm text-gray-600">DIST-2026-044</td>
              <td class="px-6 py-4 text-sm text-gray-600">Rosa Lopez</td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-600">Feb 27, 2026 11:00 AM</td>
              <td class="px-6 py-4 text-sm text-gray-900 font-medium">Milk Powder</td>
              <td class="px-6 py-4 text-sm"><span class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Stock In</span></td>
              <td class="px-6 py-4 text-sm text-gray-900">20</td>
              <td class="px-6 py-4 text-sm text-gray-600">PO-2026-003</td>
              <td class="px-6 py-4 text-sm text-gray-600">Pedro Garcia</td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-600">Feb 26, 2026 01:30 PM</td>
              <td class="px-6 py-4 text-sm text-gray-900 font-medium">Eggs (Crate)</td>
              <td class="px-6 py-4 text-sm"><span class="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Deduction</span></td>
              <td class="px-6 py-4 text-sm text-gray-900">15</td>
              <td class="px-6 py-4 text-sm text-gray-600">DIST-2026-043</td>
              <td class="px-6 py-4 text-sm text-gray-600">Rosa Lopez</td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-600">Feb 25, 2026 08:00 AM</td>
              <td class="px-6 py-4 text-sm text-gray-900 font-medium">Salt (1kg)</td>
              <td class="px-6 py-4 text-sm"><span class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Stock In</span></td>
              <td class="px-6 py-4 text-sm text-gray-900">50</td>
              <td class="px-6 py-4 text-sm text-gray-600">PO-2026-004</td>
              <td class="px-6 py-4 text-sm text-gray-600">Pedro Garcia</td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-600">Feb 24, 2026 04:45 PM</td>
              <td class="px-6 py-4 text-sm text-gray-900 font-medium">Sugar (5kg)</td>
              <td class="px-6 py-4 text-sm"><span class="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Deduction</span></td>
              <td class="px-6 py-4 text-sm text-gray-900">25</td>
              <td class="px-6 py-4 text-sm text-gray-600">DIST-2026-042</td>
              <td class="px-6 py-4 text-sm text-gray-600">Rosa Lopez</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>

import { TrendingUp, TrendingDown, Calendar } from 'lucide-vue-next';
</script>

<style scoped>
</style>
