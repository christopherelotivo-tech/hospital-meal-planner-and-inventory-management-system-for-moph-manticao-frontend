<template>
  <div class="space-y-6">
    <!-- greeting banner -->
    <div class="bg-gradient-to-br from-purple-500 to-purple-400 text-white rounded-xl p-6 shadow-lg">
      <h2 class="text-2xl font-bold">✨ Good evening, Server Juan!</h2>
      <p class="text-sm opacity-90">Delivering nutrition and care to every patient</p>
      <div class="mt-4 flex flex-wrap gap-4 text-sm">
        <div class="flex items-center space-x-1">
          <Users :size="16" />
          <span>3 Active Patients</span>
        </div>
        <div class="flex items-center space-x-1">
          <Utensils :size="16" />
          <span>1 Pending Delivery</span>
        </div>
        <div class="flex items-center space-x-1">
          <CheckCircle :size="16" />
          <span>2 Served Today</span>
        </div>
      </div>
    </div>

    <!-- summary cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white rounded-lg shadow p-6 flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Pending Distribution</p>
          <p class="text-3xl font-bold">{{ currentCount }}</p>
        </div>
        <Utensils class="text-yellow-500" :size="36" />
      </div>
      <div class="bg-white rounded-lg shadow p-6 flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Meals Served</p>
          <p class="text-3xl font-bold">0</p>
        </div>
        <CheckCircle class="text-green-500" :size="36" />
      </div>
    </div>

    <!-- checklist header -->
    <div class="bg-purple-600 text-white rounded-t-xl px-6 py-4">
      <h3 class="font-semibold">🍽️ Distribution Checklist (Sorted by Room)</h3>
    </div>
    
    <!-- tabs -->
    <div class="bg-white rounded-b-xl shadow-inner">
      <div class="flex divide-x divide-gray-200">
        <button
          @click="selectedTab = 'breakfast'"
          :class="['flex-1 py-3 text-center',
            selectedTab === 'breakfast' ? 'bg-purple-500 text-white rounded-l-xl' : 'text-gray-700']">
          Breakfast <span class="ml-2 bg-purple-300 text-purple-800 rounded-full px-2 text-xs">{{ counts.breakfast }}</span>
        </button>
        <button
          @click="selectedTab = 'lunch'"
          :class="['flex-1 py-3 text-center',
            selectedTab === 'lunch' ? 'bg-purple-500 text-white' : 'text-gray-700']">
          Lunch <span class="ml-2 bg-gray-200 text-gray-800 rounded-full px-2 text-xs">{{ counts.lunch }}</span>
        </button>
        <button
          @click="selectedTab = 'dinner'"
          :class="['flex-1 py-3 text-center',
            selectedTab === 'dinner' ? 'bg-purple-500 text-white rounded-r-xl' : 'text-gray-700']">
          Dinner <span class="ml-2 bg-gray-200 text-gray-800 rounded-full px-2 text-xs">{{ counts.dinner }}</span>
        </button>
      </div>
    </div>

    <!-- distribution cards -->
    <div v-for="item in currentList" :key="item.room" :class="['rounded-lg p-6 space-y-4 shadow border-l-4',
      isItemServed(item.room) ? 'bg-green-50 border-green-300' : 'bg-white border-purple-300']">
      <div class="flex items-center space-x-3">
        <button
          @click="openConfirmModal(item.room)"
          :class="['w-6 h-6 rounded border-2 cursor-pointer flex items-center justify-center',
            isItemServed(item.room) ? 'bg-green-500 border-green-500' : 'border-purple-400']">
          <CheckCircle v-if="isItemServed(item.room)" :size="20" class="text-white" />
        </button>
        <h4 :class="['text-lg font-bold', isItemServed(item.room) ? 'text-green-700' : 'text-purple-600']">Room {{ item.room }}</h4>
      </div>
      <p class="text-base font-medium text-gray-900">{{ item.name }}</p>
      <span class="inline-block px-3 py-1 border border-gray-400 text-gray-700 rounded-full text-xs font-semibold">{{ item.diet }}</span>

      <div v-if="item.allergy" class="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg">
        <strong>⚠️ ALLERGY:</strong> {{ item.allergy.toUpperCase() }}
      </div>

      <div v-if="isItemServed(item.room)" class="flex items-center space-x-2 text-green-700">
        <CheckCircle :size="20" />
        <span>Meal Served</span>
      </div>
    </div>

    <!-- confirm meal service modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-96 flex flex-col">
        <!-- header -->
        <div class="bg-gradient-to-r from-purple-600 to-purple-500 text-white p-6 flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold">Confirm Meal Service</h3>
            <p class="text-sm text-purple-100">🟡 {{ selectedTab === 'breakfast' ? 'Breakfast' : selectedTab === 'lunch' ? 'Lunch' : 'Dinner' }} • Room {{ confirmingItem }}</p>
            <p v-if="getCurrentMeal" class="text-sm text-purple-100">{{ getCurrentMeal.name }}</p>
          </div>
          <button @click="closeConfirmModal" class="text-white hover:text-purple-200">
            <X :size="24" />
          </button>
        </div>

        <!-- tabs -->
        <div class="flex gap-4 border-b border-gray-200 bg-gray-50 px-6 py-3">
          <button
            @click="confirmTab = 'prescription'"
            :class="['flex items-center gap-2 pb-2 border-b-2',
              confirmTab === 'prescription' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600']">
            <ClipboardList :size="18" />
            <span class="font-semibold">Doctor's Prescription</span>
          </button>
          <button
            @click="confirmTab = 'photo'"
            :class="['flex items-center gap-2 pb-2 border-b-2',
              confirmTab === 'photo' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600']">
            <Camera :size="18" />
            <span class="font-semibold">Photo Verification</span>
          </button>
        </div>

        <!-- content scroll -->
        <div class="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          <!-- prescription tab -->
          <div v-if="confirmTab === 'prescription'" class="space-y-4">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-start gap-3">
                <ClipboardList class="text-blue-600 mt-1 flex-shrink-0" :size="20" />
                <div>
                  <div class="font-semibold text-blue-900">Doctor's Prescription:</div>
                  <div class="text-sm text-blue-800">{{ getCurrentMeal?.diet || 'N/A' }}</div>
                </div>
              </div>
            </div>

            <div>
              <div class="font-semibold text-gray-900 mb-3">Verification Status <span class="text-xs text-gray-500">(Compare tray with prescription)</span></div>
              <div class="space-y-3">
                <label class="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition"
                  :class="selectedVerification === 'perfect' ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'">
                  <input type="radio" v-model="selectedVerification" value="perfect" class="mt-1" />
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <CheckCircle class="text-green-600" :size="20" />
                      <span class="font-semibold text-gray-900">✓ Perfect Match</span>
                    </div>
                    <div class="text-sm text-gray-600 mt-1">Served meal matches doctor's prescription exactly</div>
                  </div>
                </label>

                <label class="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition"
                  :class="selectedVerification === 'partial' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300 hover:border-gray-400'">
                  <input type="radio" v-model="selectedVerification" value="partial" class="mt-1" />
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <AlertCircle class="text-yellow-600" :size="20" />
                      <span class="font-semibold text-gray-900">⚠ Partial Refusal</span>
                    </div>
                    <div class="text-sm text-gray-600 mt-1">Patient refused part of the meal or substitution needed</div>
                  </div>
                </label>

                <label class="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition"
                  :class="selectedVerification === 'mismatch' ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'">
                  <input type="radio" v-model="selectedVerification" value="mismatch" class="mt-1" />
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <X class="text-blue-400" :size="20" />
                      <span class="font-semibold text-gray-900">✗ Mismatch</span>
                    </div>
                    <div class="text-sm text-gray-600 mt-1">Different meal served (requires explanation)</div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <div class="font-semibold text-gray-900 mb-2">Discrepancy Notes <span class="text-red-600">*</span></div>
              <textarea
                v-model="discrepancyNotes"
                placeholder="e.g., Patient refused vegetables, Patient NPO, Wrong meal from kitchen, etc."
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
                rows="4"></textarea>
              <p class="text-sm text-blue-600 mt-2">Explain why a different meal was served</p>
            </div>
          </div>

          <!-- photo tab -->
          <div v-if="confirmTab === 'photo'" class="space-y-4">
            <div>
              <div class="font-semibold text-gray-900 mb-2">Photo Verification <span class="text-xs text-gray-500">(Optional but recommended)</span></div>
              <div class="border-2 border-dashed border-purple-300 bg-purple-50 rounded-lg p-12 text-center">
                <Camera class="text-gray-400 mx-auto mb-3" :size="36" />
                <div class="font-semibold text-gray-700">Tap to capture meal tray</div>
                <div class="text-sm text-gray-600">Helps verify correct meal delivery</div>
              </div>
            </div>

            <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 flex gap-3">
              <AlertCircle class="text-purple-600 flex-shrink-0 mt-1" :size="20" />
              <div>
                <div class="font-semibold text-purple-900">Clinical Audit Trail:</div>
                <div class="text-sm text-purple-800 mt-1">This confirmation creates an official record with your ID and timestamp. The doctor will be able to review what was actually served vs. what was prescribed to ensure patient safety and treatment compliance.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- footer -->
        <div class="border-t border-gray-200 p-4 flex gap-3 justify-end bg-gray-50">
          <button @click="closeConfirmModal" class="px-6 py-2 text-gray-700 font-semibold border border-gray-300 rounded-lg hover:bg-gray-100">
            Cancel
          </button>
          <button @click="confirmService" :disabled="!selectedVerification" class="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            <CheckCircle :size="18" />
            Confirm Service
          </button>
        </div>
      </div>
    </div>

    <!-- instructions -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h4 class="font-semibold mb-2">Instructions:</h4>
      <ul class="list-disc list-inside space-y-1 text-sm text-blue-900">
        <li>Patients are sorted by room number for easy navigation</li>
        <li>Check the colored diet badge to ensure correct meal type</li>
        <li class="font-bold text-red-700">RED ALLERGY WARNINGS - verify meal does not contain allergens</li>
        <li>Tap the checkbox after serving each meal</li>
        <li>Click your profile menu above to switch to Mobile Distribution View with QR Scanner</li>
      </ul>
    </div>
  </div>
</template>

<script setup>

import { ref, computed } from 'vue';
import { Users, Utensils, CheckCircle, X, ClipboardList, Camera, AlertCircle } from 'lucide-vue-next';

const selectedTab = ref('breakfast');
const showConfirmModal = ref(false);
const confirmTab = ref('prescription');
const selectedVerification = ref(null);
const confirmingItem = ref(null);
const servedItems = ref(new Set());
const discrepancyNotes = ref('');








const meals = {
  breakfast: ref([
  { room: 102, name: 'Juan dela Cruz', diet: 'DM (Diabetic Mellitus) Diet', allergy: 'shellfish' }]
  ),
  lunch: ref([
  { room: 103, name: 'Maria Santos', diet: 'Low Sodium Diet' }]
  ),
  dinner: ref([
  { room: 104, name: 'Pedro Reyes', diet: 'Regular Diet' }]
  )
};

const counts = computed(() => ({
  breakfast: meals.breakfast.value.length,
  lunch: meals.lunch.value.length,
  dinner: meals.dinner.value.length
}));

const currentCount = computed(() => counts.value[selectedTab.value]);

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
  confirmTab.value = 'prescription';
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

<style scoped>
</style>
