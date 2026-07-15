<template>
  <div class="space-y-6">
    <!-- Camera Modal -->
    <div v-if="cameraOpen && !scannedRoom" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-full max-w-2xl">
        <div class="bg-amber-500 text-white p-4 flex items-center justify-between">
          <h3 class="font-semibold text-lg">QR Scanner</h3>
          <button @click="closeCamera" class="hover:bg-amber-600 p-1 rounded">
            <X :size="24" />
          </button>
        </div>
        <div class="p-6 space-y-4">
          <video ref="videoElement" class="w-full rounded-lg bg-black" playsinline></video>
          <p class="text-sm text-gray-600 text-center">Point your camera at the QR code to scan</p>
          <div class="flex gap-3 justify-end">
            <button @click="simulateScan" class="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600">
              Simulate Scan
            </button>
            <button @click="closeCamera" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Handheld Mode View -->
    <div v-if="handheldMode" class="min-h-screen bg-gray-50">
      <div class="bg-amber-600 text-white p-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold">Handheld Distribution</h3>
        <button @click="closeHandheld" class="hover:bg-amber-700 p-1 rounded">
          <X :size="24" />
        </button>
      </div>
      <div class="p-6 space-y-4">
        <div v-for="room in Object.values(sampleRooms)" :key="room.room" class="bg-white rounded-lg shadow p-4 flex justify-between items-center">
          <div>
            <div class="font-semibold">Room {{ room.room }}</div>
            <div class="text-sm text-gray-600">{{ room.patientName }}</div>
          </div>
          <button
            :disabled="handheldServed.has(room.room)"
            @click="markHandheldServed(room.room)"
            class="px-4 py-2 bg-teal-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
            {{ handheldServed.has(room.room) ? 'Served' : 'Mark Served' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Room Detail View (After Scanning) -->
    <div v-if="scannedRoom" class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-teal-600 text-white p-6 text-center sticky top-0 z-40">
        <button @click="backToScanner" class="flex items-center gap-2 text-white hover:text-teal-100 mb-4">
          <span>←</span>
          <span>Back to Scanner</span>
        </button>
        <h2 class="text-4xl font-bold">Room {{ scannedRoom.room }}</h2>
        <p class="text-teal-100 mt-2">{{ scannedRoom.patientCount }} Patient</p>
      </div>

      <!-- Content -->
      <div class="p-6 max-w-2xl mx-auto space-y-6">
        <!-- Info Box -->
        <div class="bg-cyan-50 border-2 border-cyan-400 rounded-lg p-4 flex gap-3">
          <Info class="text-cyan-600 flex-shrink-0 mt-1" :size="24" />
          <div class="text-cyan-700">
            <div class="font-semibold">Review this list before serving</div>
            <p class="text-sm mt-1">Verify each patient's diet type and check for allergies. After you've distributed meals to all patients, click the button below.</p>
          </div>
        </div>

        <!-- Patient Card -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <!-- Patient Header -->
          <div class="bg-teal-600 text-white p-4">
            <h3 class="text-2xl font-bold">{{ scannedRoom.patientName }}</h3>
            <p class="text-teal-100 text-sm mt-1">🛏️ {{ scannedRoom.bed }} • Room {{ scannedRoom.room }}</p>
          </div>

          <!-- Patient Details -->
          <div class="p-6 space-y-4">
            <div>
              <label class="text-sm text-gray-500 font-semibold">Diagnosis</label>
              <p class="text-gray-900 font-medium">{{ scannedRoom.diagnosis }}</p>
            </div>

            <div>
              <label class="text-sm text-gray-500 font-semibold">Diet Prescription</label>
              <br>
              <span class="inline-block mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">{{ scannedRoom.diet }}</span>
            </div>

            <div>
              <label class="text-sm text-gray-500 font-semibold">Allergies</label>
              <div class="mt-2 flex items-center gap-2 text-gray-700">
                <span class="text-gray-400">●</span>
                <span>{{ scannedRoom.allergies }}</span>
              </div>
            </div>

            <!-- Assigned Meal Components -->
            <div v-if="scannedMeal" class="mt-4 pt-4 border-t border-gray-100">
              <label class="text-sm text-teal-700 font-bold uppercase tracking-wider mb-2 block">Assigned Tray Components</label>
              <div class="space-y-3">
                <div class="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                  <span class="text-xs font-semibold text-gray-500 uppercase">🌾 Carb</span>
                  <span class="font-bold text-gray-800">{{ scannedMeal.lunchCarb || scannedMeal.breakfastCarb || scannedMeal.dinnerCarb || 'None' }}</span>
                </div>
                <div class="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                  <span class="text-xs font-semibold text-gray-500 uppercase">🍗 Viand</span>
                  <span class="font-bold text-gray-800">{{ scannedMeal.lunchProtein || scannedMeal.breakfastProtein || scannedMeal.dinnerProtein || 'None' }}</span>
                </div>
                <div class="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                  <span class="text-xs font-semibold text-gray-500 uppercase">🍎 Side/Fruit</span>
                  <span class="font-bold text-gray-800">{{ scannedMeal.lunchSide || scannedMeal.breakfastSide || scannedMeal.dinnerSide || 'None' }}</span>
                </div>
              </div>
            </div>
            <div v-else class="mt-4 pt-4 border-t border-gray-100 text-amber-600 font-semibold text-sm">
              ⚠️ No meal assigned for this patient today.
            </div>
          </div>
        </div>

        <!-- Action Button -->
        <button @click="markAllServed" class="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition">
          <CheckCircle2 :size="20" />
          Mark All Served & Next Room
        </button>
      </div>
    </div>

    <!-- Initial View -->
    <div v-if="!cameraOpen && !scannedRoom && !handheldMode" class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-bold text-gray-900 mb-4">Mobile Distribution</h2>
      <p class="text-sm text-gray-600 mb-6">QR Scanner &amp; Handheld mode for on-the-go meal deliveries.</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div @click="openCamera" role="button" tabindex="0" class="bg-amber-50 hover:bg-amber-100 p-6 rounded-lg flex flex-col items-center justify-center cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-amber-500">
          <QrCode :size="60" class="text-amber-600 mb-4" />
          <h3 class="font-semibold text-gray-900">QR Scanner</h3>
          <p class="text-sm text-gray-600 text-center">Scan ward QR codes to log distributions instantly.</p>
          <span class="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 inline-block">
            Open Camera
          </span>
        </div>
        <div @click="openHandheld" role="button" tabindex="0" class="bg-amber-50 hover:bg-amber-100 p-6 rounded-lg flex flex-col items-center justify-center cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-amber-500">
          <Smartphone :size="60" class="text-amber-600 mb-4" />
          <h3 class="font-semibold text-gray-900">Handheld Mode</h3>
          <p class="text-sm text-gray-600 text-center">Manually record deliveries using the mobile interface.</p>
          <span class="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 inline-block">
            Open Handheld
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { QrCode, Smartphone, X, Info, CheckCircle2 } from 'lucide-vue-next';
import { useDataStore } from '@/stores/dataStore';

const dataStore = useDataStore();
const cameraOpen = ref(false);
const videoElement = ref(null);
const scannedRoom = ref(null);
const lastScannedIndex = ref(-1);
const handheldMode = ref(false);
const handheldServed = ref(new Set());

// We will dynamically pull from dataStore in simulateScan

const scannedMeal = computed(() => {
  if (!scannedRoom.value) return null;
  const today = new Date().toISOString().split('T')[0];
  return dataStore.mealAssignments.find(m => m.patientId === scannedRoom.value.id && m.date === today);
});

async function openCamera() {
  cameraOpen.value = true;

  // Wait for DOM to update
  await new Promise((resolve) => setTimeout(resolve, 100));

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });

    if (videoElement.value) {
      videoElement.value.srcObject = stream;
      videoElement.value.play();
    }
  } catch (error) {
    console.error('Error accessing camera:', error);
    alert('Unable to access camera. Please check permissions.');
    cameraOpen.value = false;
  }
}

function simulateScan() {
  const today = new Date().toISOString().split('T')[0];
  // Find patients that have meal assignments today
  const patientsWithMeals = dataStore.patients.filter(p => 
    dataStore.mealAssignments.some(m => m.patientId === p.id && m.date === today)
  );
  
  if (patientsWithMeals.length === 0) {
    alert("No patients have meal assignments for today. Please assign meals in the Dietitian portal first.");
    closeCamera();
    return;
  }

  // Cycle through the patients
  lastScannedIndex.value = (lastScannedIndex.value + 1) % patientsWithMeals.length;
  const patient = patientsWithMeals[lastScannedIndex.value];
  
  // Find their prescription to get diet and allergies
  const rx = dataStore.prescriptions
    .filter(p => p.patientId === patient.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  scannedRoom.value = {
    id: patient.id,
    room: patient.room,
    patientName: patient.name,
    patientCount: 1,
    diagnosis: patient.condition || 'Not specified',
    diet: rx ? rx.dietType : 'Normal Diet (Regular Diet)',
    allergies: patient.allergies ? patient.allergies : (rx && rx.allergies.length > 0 ? rx.allergies.join(', ') : 'No known allergies')
  };
  
  closeCamera();
}

function closeCamera() {
  cameraOpen.value = false;

  if (videoElement.value && videoElement.value.srcObject) {
    const stream = videoElement.value.srcObject;
    stream.getTracks().forEach((track) => track.stop());
  }
}

function backToScanner() {
  scannedRoom.value = null;
  cameraOpen.value = false;
}

function openHandheld() {
  handheldMode.value = true;
  // exit any scanning session
  cameraOpen.value = false;
  scannedRoom.value = null;
}

function closeHandheld() {
  handheldMode.value = false;
  handheldServed.value.clear();
}

function markHandheldServed(room) {
  handheldServed.value.add(room);
  if (handheldServed.value.size === Object.keys(sampleRooms).length) {
    alert('All meals recorded. Returning to menu.');
    closeHandheld();
  }
}

function markAllServed() {
  // after serving, go back to scanner and stay ready for next scan
  scannedRoom.value = null;
  cameraOpen.value = true;

  // prepare for next room by incrementing index so simulateScan will show next
  const rooms = Object.keys(sampleRooms).map(Number);
  lastScannedIndex.value = (lastScannedIndex.value + 1) % rooms.length;

  // reopen camera feed
  setTimeout(() => {
    if (videoElement.value) {
      navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      }).then((stream) => {
        if (videoElement.value) {
          videoElement.value.srcObject = stream;
          videoElement.value.play();
        }
      }).catch((error) => {
        console.error('Error accessing camera:', error);
      });
    }
  }, 100);
}
</script>

<style scoped>
</style>
