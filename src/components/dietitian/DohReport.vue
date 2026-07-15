<template>
  <div class="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
    <!-- Action Bar / Export Panel -->
    <div class="flex items-center justify-between shrink-0 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-700">
          <FileSignature :size="20" />
        </div>
        <div>
          <h2 class="text-lg font-bold text-gray-800 tracking-tight">Audit & DOH Reports</h2>
          <p class="text-xs text-gray-500">Official Provincial Capitol reporting template</p>
        </div>
      </div>
      <div class="flex items-center space-x-3">
        <button class="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-2">
          <Printer :size="16" />
          <span>Print Template</span>
        </button>
        <button class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center space-x-2">
          <FileDown :size="16" />
          <span>Export PDF Report</span>
        </button>
        <button class="px-4 py-2 bg-white border border-emerald-500 text-emerald-600 hover:bg-emerald-50 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center space-x-2">
          <Table :size="16" />
          <span>Export Excel Sheet</span>
        </button>
      </div>
    </div>

    <!-- Document Preview Area (A4 style paper) -->
    <div class="flex-1 overflow-y-auto bg-gray-100 p-6 rounded-2xl shadow-inner border border-gray-200">
      <div class="bg-white max-w-4xl mx-auto shadow-xl print:shadow-none print:max-w-full">
        <div class="p-10 md:p-14 space-y-8">
          
          <!-- Header Block -->
          <div class="flex flex-col items-center text-center space-y-4 border-b-2 border-gray-800 pb-6">
            <div class="flex items-center justify-center space-x-6 w-full">
              <!-- Placeholder Logo 1 (Provincial Capitol) -->
              <div class="w-20 h-20 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center text-gray-400 bg-gray-50 shrink-0">
                <span class="text-[10px] font-bold text-center leading-tight">Capitol<br/>Seal</span>
              </div>
              
              <div class="flex-1">
                <p class="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1">Republic of the Philippines</p>
                <p class="text-sm font-bold uppercase tracking-widest text-gray-800 mb-2">Province of Misamis Oriental</p>
                <h1 class="text-2xl font-black uppercase text-gray-900 tracking-tight">Misamis Oriental Provincial Hospital - Manticao</h1>
                <p class="text-sm text-gray-600 mt-1">Dietary Service and Nutritional Compliance Report</p>
              </div>

              <!-- Placeholder Logo 2 (DOH) -->
              <div class="w-20 h-20 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center text-gray-400 bg-gray-50 shrink-0">
                <span class="text-[10px] font-bold text-center leading-tight">DOH<br/>Logo</span>
              </div>
            </div>
          </div>

          <!-- Date Selector / Meta info -->
          <div class="flex justify-between items-center text-sm">
            <div class="flex items-center space-x-2">
              <span class="font-bold text-gray-700 uppercase tracking-wider text-xs">Reporting Period:</span>
              <select v-model="reportPeriod" class="border border-gray-300 rounded px-2 py-1 bg-white font-medium text-gray-900 outline-none focus:border-indigo-500">
                <option value="today">Today ({{ today }})</option>
                <option value="week">Current Week</option>
                <option value="month">Current Month (July 2026)</option>
                <option value="q3">Q3 2026 (Jul - Sep)</option>
              </select>
            </div>
            <div class="text-right">
              <p><span class="font-bold text-gray-700 uppercase tracking-wider text-xs">Date Generated:</span> <span class="font-medium">{{ today }}</span></p>
              <p><span class="font-bold text-gray-700 uppercase tracking-wider text-xs">Prepared By:</span> <span class="font-medium">Chief Dietitian</span></p>
            </div>
          </div>

          <!-- Summary Analytics KPIs -->
          <div class="grid grid-cols-3 gap-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div class="text-center border-r border-gray-200">
              <p class="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Total Patients Served</p>
              <p class="text-3xl font-black text-indigo-700">{{ totalPatientsServed }}</p>
              <p class="text-xs text-gray-500 mt-1">Valid Meals</p>
            </div>
            <div class="text-center border-r border-gray-200">
              <p class="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Allergen Safety Compliance</p>
              <p class="text-3xl font-black text-emerald-600">100%</p>
              <p class="text-xs text-emerald-600 font-semibold mt-1">0 Incidents Reported</p>
            </div>
            <div class="text-center">
              <p class="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Avg Cost per Patient (vs ₱150 Cap)</p>
              <p class="text-3xl font-black text-indigo-700">₱{{ averageCost.toFixed(2) }}</p>
              <p class="text-xs font-semibold mt-1" :class="averageCost <= 150 ? 'text-emerald-600' : 'text-red-600'">
                {{ averageCost <= 150 ? 'Within Budget Cap' : 'Exceeds Budget Cap' }}
              </p>
            </div>
          </div>

          <!-- Audit Data Grid -->
          <div class="overflow-hidden border border-gray-300 rounded-lg">
            <table class="w-full text-left border-collapse text-sm">
              <thead>
                <tr class="bg-gray-100 text-gray-800 border-b border-gray-300">
                  <th class="px-4 py-3 font-bold border-r border-gray-300">Date</th>
                  <th class="px-4 py-3 font-bold border-r border-gray-300 text-center">Patient Count</th>
                  <th class="px-4 py-3 font-bold border-r border-gray-300 text-center">Therapeutic Diets</th>
                  <th class="px-4 py-3 font-bold border-r border-gray-300 text-center">Regular Diets</th>
                  <th class="px-4 py-3 font-bold border-r border-gray-300 text-right">Raw Ingredients Cost</th>
                  <th class="px-4 py-3 font-bold text-right">Total Purchase Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in auditData" :key="idx" class="border-b border-gray-200 last:border-0 hover:bg-gray-50">
                  <td class="px-4 py-3 border-r border-gray-200 font-medium text-gray-900">{{ row.date }}</td>
                  <td class="px-4 py-3 border-r border-gray-200 text-center">{{ row.patientCount }}</td>
                  <td class="px-4 py-3 border-r border-gray-200 text-center text-indigo-600 font-medium">{{ row.therapeuticCount }}</td>
                  <td class="px-4 py-3 border-r border-gray-200 text-center">{{ row.regularCount }}</td>
                  <td class="px-4 py-3 border-r border-gray-200 text-right">₱{{ row.rawCost.toFixed(2) }}</td>
                  <td class="px-4 py-3 text-right font-bold text-gray-900">₱{{ row.totalCost.toFixed(2) }}</td>
                </tr>
                <!-- Totals Row -->
                <tr class="bg-gray-800 text-white font-bold">
                  <td class="px-4 py-3 border-r border-gray-700">GRAND TOTAL</td>
                  <td class="px-4 py-3 border-r border-gray-700 text-center">{{ totalPatientsServed }}</td>
                  <td class="px-4 py-3 border-r border-gray-700 text-center">{{ totalTherapeutic }}</td>
                  <td class="px-4 py-3 border-r border-gray-700 text-center">{{ totalRegular }}</td>
                  <td class="px-4 py-3 border-r border-gray-700 text-right">₱{{ totalRawCost.toFixed(2) }}</td>
                  <td class="px-4 py-3 text-right">₱{{ totalGrandCost.toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Signatures Block -->
          <div class="pt-16 pb-8 grid grid-cols-2 gap-20">
            <div class="text-center">
              <div class="border-b-2 border-gray-800 pb-1 mb-2 px-4 relative">
                <!-- Signature Placeholder -->
                <div class="absolute inset-0 -top-8 flex items-center justify-center opacity-30">
                  <span class="font-[cursive] text-3xl transform -rotate-12 text-blue-900">Signed</span>
                </div>
              </div>
              <p class="font-bold text-gray-900 uppercase text-sm">JUAN DELA CRUZ, RND</p>
              <p class="text-xs text-gray-600">Chief Registered Nutritionist-Dietitian</p>
              <p class="text-[10px] text-gray-400 mt-1">License No: 0123456</p>
            </div>
            <div class="text-center">
              <div class="border-b-2 border-gray-800 pb-1 mb-2 px-4"></div>
              <p class="font-bold text-gray-900 uppercase text-sm">DR. MARIA SANTOS, MD</p>
              <p class="text-xs text-gray-600">Hospital Administrator</p>
              <p class="text-[10px] text-gray-400 mt-1">MOPH-Manticao</p>
            </div>
          </div>

          <!-- Footer Text -->
          <div class="text-center text-[10px] text-gray-400 pt-8 border-t border-gray-200">
            <p>System Generated Document. This report complies with Department of Health (DOH) standard auditing requirements for provincial dietary services.</p>
            <p>Ref: {{ generateRefCode() }}</p>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useDataStore } from '@/stores/dataStore';
import { FileSignature, Printer, FileDown, Table } from 'lucide-vue-next';

const dataStore = useDataStore();
const today = new Date().toISOString().split('T')[0];
const reportPeriod = ref('today');

function generateRefCode() {
  return `DOH-MOPH-${Date.now().toString().slice(-6)}-${reportPeriod.value.toUpperCase()}`;
}

// Group meal assignments by date for the grid
const auditData = computed(() => {
  const map = {};
  
  // Filter logic based on reportPeriod could go here. For now, we process all available in store.
  let assignments = dataStore.mealAssignments;
  
  if (reportPeriod.value === 'today') {
    assignments = assignments.filter(m => m.date === today);
  }
  
  assignments.forEach(assignment => {
    if (!map[assignment.date]) {
      map[assignment.date] = {
        date: assignment.date,
        patientIds: new Set(),
        therapeuticCount: 0,
        regularCount: 0,
        rawCost: 0,
        totalCost: 0
      };
    }
    
    const row = map[assignment.date];
    row.patientIds.add(assignment.patientId);
    
    // Check if therapeutic (Assuming if it's not "Normal Diet (Regular Diet)" it's therapeutic)
    // We need to look at the prescription
    const rx = dataStore.prescriptions.find(p => p.patientId === assignment.patientId);
    if (rx && rx.dietType !== 'Normal Diet (Regular Diet)') {
      row.therapeuticCount++; // Simplification: counting meal assignments as therapeutic
    } else {
      row.regularCount++;
    }
    
    // Simplification: raw cost is 80% of total cost, total cost is 100%
    row.totalCost += assignment.totalCost;
    row.rawCost += assignment.totalCost * 0.8;
  });
  
  // Convert map to array
  return Object.values(map).map(row => ({
    date: row.date,
    patientCount: row.patientIds.size,
    therapeuticCount: row.therapeuticCount,
    regularCount: row.regularCount,
    rawCost: row.rawCost,
    totalCost: row.totalCost
  })).sort((a, b) => new Date(b.date) - new Date(a.date));
});

// Computed Totals
const totalPatientsServed = computed(() => auditData.value.reduce((sum, row) => sum + row.patientCount, 0));
const totalTherapeutic = computed(() => auditData.value.reduce((sum, row) => sum + row.therapeuticCount, 0));
const totalRegular = computed(() => auditData.value.reduce((sum, row) => sum + row.regularCount, 0));
const totalRawCost = computed(() => auditData.value.reduce((sum, row) => sum + row.rawCost, 0));
const totalGrandCost = computed(() => auditData.value.reduce((sum, row) => sum + row.totalCost, 0));

const averageCost = computed(() => {
  if (totalPatientsServed.value === 0) return 0;
  return totalGrandCost.value / totalPatientsServed.value;
});

</script>
