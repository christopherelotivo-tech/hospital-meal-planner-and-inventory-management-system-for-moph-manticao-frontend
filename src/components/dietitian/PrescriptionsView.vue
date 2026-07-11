<template>
  <div class="space-y-6">
    <!-- Filter Bar -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div class="relative flex-1 md:max-w-md">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <Search :size="18" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search prescriptions..."
          class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-purple-500 outline-none text-sm bg-white transition-all"
        />
      </div>

      <div class="flex items-center space-x-3">
        <select
          v-model="dietTypeFilter"
          class="px-4 py-2.5 border border-gray-200 rounded-xl focus:border-purple-500 outline-none text-sm bg-white transition-all"
        >
          <option value="all">All Diet Types</option>
          <option value="Regular Diet">Regular Diet</option>
          <option value="Diabetic Diet">Diabetic Diet</option>
          <option value="Low Sodium Diet">Low Sodium Diet</option>
          <option value="Renal Diet">Renal Diet</option>
          <option value="Cardiac Diet">Cardiac Diet</option>
        </select>
      </div>
    </div>

    <!-- Collapsible Accordion / Dropdown Cards -->
    <div class="space-y-4">
      <div
        v-for="prescription in filteredPrescriptions"
        :key="prescription.id"
        class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300"
        :class="{ 'ring-2 ring-purple-500 border-transparent shadow-md': expandedId === prescription.id }"
      >
        <!-- Card Header (Clickable Dropdown Trigger) -->
        <button
          @click="toggleExpand(prescription.id)"
          class="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none hover:bg-gray-50/50 transition-colors"
        >
          <div class="flex items-center space-x-4">
            <div 
              class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors"
              :class="expandedId === prescription.id ? 'bg-purple-600 text-white shadow-sm' : 'bg-purple-100 text-purple-700'"
            >
              <User :size="20" />
            </div>
            <div>
              <div class="flex items-center space-x-2.5">
                <h3 class="font-bold text-gray-900 text-base">{{ prescription.patientName }}</h3>
                <span class="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold shrink-0">
                  {{ prescription.patientId }}
                </span>
              </div>
              <p class="text-xs text-gray-500 font-semibold mt-1 flex items-center space-x-1.5">
                <span class="text-purple-600">{{ prescription.dietType }}</span>
                <span>•</span>
                <span>Active Status</span>
              </p>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-55 text-green-800 border border-green-200/60">
              Active
            </span>
            <ChevronDown 
              :size="18" 
              class="text-gray-400 transition-transform duration-300"
              :class="{ 'rotate-180 text-purple-600': expandedId === prescription.id }"
            />
          </div>
        </button>

        <!-- Dropdown Details Panel (Accordion Content) -->
        <transition name="slide">
          <div v-if="expandedId === prescription.id" class="border-t border-gray-150/60 bg-gray-50/40 p-6 space-y-6">
            <!-- Details Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Allergies -->
              <div class="bg-red-50/40 border border-red-100 rounded-2xl p-5">
                <h4 class="text-xs font-bold text-red-600 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                  <AlertCircle :size="14" />
                  <span>Allergies</span>
                </h4>
                <div v-if="prescription.allergies.length > 0" class="flex flex-wrap gap-2">
                  <span 
                    v-for="allergy in prescription.allergies" 
                    :key="allergy" 
                    class="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold border border-red-200"
                  >
                    {{ allergy }}
                  </span>
                </div>
                <p v-else class="text-xs text-gray-450 italic">No allergies specified.</p>
              </div>

              <!-- Restrictions -->
              <div class="bg-yellow-50/40 border border-yellow-100 rounded-2xl p-5">
                <h4 class="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                  <AlertCircle :size="14" />
                  <span>Restrictions</span>
                </h4>
                <div v-if="prescription.restrictions.length > 0" class="flex flex-wrap gap-2">
                  <span 
                    v-for="restriction in prescription.restrictions" 
                    :key="restriction" 
                    class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200"
                  >
                    {{ restriction }}
                  </span>
                </div>
                <p v-else class="text-xs text-gray-450 italic">No restrictions specified.</p>
              </div>
            </div>

            <!-- Medical Orders -->
            <div class="bg-gray-50 rounded-2xl p-5 border border-gray-200/50">
              <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">Medical Orders</h4>
              <p class="text-sm text-gray-700 leading-relaxed font-semibold bg-white rounded-xl p-3 border border-gray-200/60 shadow-sm">
                {{ prescription.medicalOrders || 'None' }}
              </p>
            </div>

            <!-- Feeding Instructions -->
            <div class="bg-gray-50 rounded-2xl p-5 border border-gray-200/50">
              <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">Feeding Instructions</h4>
              <p class="text-sm text-gray-700 leading-relaxed font-semibold bg-white rounded-xl p-3 border border-gray-200/60 shadow-sm">
                {{ prescription.feedingInstructions || 'None' }}
              </p>
            </div>

            <!-- Prescribed By & Date info -->
            <div class="pt-4 border-t border-gray-150/60 flex items-center justify-between text-xs text-gray-500">
              <div>
                <p class="mb-0.5">Prescribing Physician</p>
                <p class="font-bold text-gray-800 text-sm">{{ prescription.doctorName }}</p>
              </div>
              <div class="text-right">
                <p class="mb-0.5">Date Prescribed</p>
                <p class="font-bold text-gray-800 text-sm">{{ formatDate(prescription.createdAt) }}</p>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredPrescriptions.length === 0" class="bg-white border border-gray-200 p-12 rounded-2xl text-center shadow-sm">
      <ClipboardList :size="48" class="mx-auto mb-4 text-gray-300" />
      <h3 class="text-lg font-bold text-gray-900 mb-2">No prescriptions found</h3>
      <p class="text-gray-550 text-sm">Try adjusting your search or filters</p>
    </div>
  </div>
</template>

<script setup>

import { ref, computed } from 'vue';
import { useDataStore } from '@/stores/dataStore';
import {
  Search,
  User,
  AlertCircle,
  ClipboardList,
  ChevronDown } from
'lucide-vue-next';

const dataStore = useDataStore();

const searchQuery = ref('');
const dietTypeFilter = ref('all');
const expandedId = ref(null);

const filteredPrescriptions = computed(() => {
  let prescriptions = dataStore.prescriptions.filter((p) => p.status === 'Active');

  // Filter by diet type
  if (dietTypeFilter.value !== 'all') {
    prescriptions = prescriptions.filter((p) => p.dietType === dietTypeFilter.value);
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    prescriptions = prescriptions.filter((p) =>
    p.patientName.toLowerCase().includes(query) ||
    p.patientId.toLowerCase().includes(query) ||
    p.dietType.toLowerCase().includes(query)
    );
  }

  return prescriptions;
});

function toggleExpand(id) {
  if (expandedId.value === id) {
    expandedId.value = null;
  } else {
    expandedId.value = id;
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
  max-height: 1000px;
  overflow: hidden;
}
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
