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
              <span class="inline-block mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">{{ scannedRoom.diet }}</span>
            </div>

            <div>
              <label class="text-sm text-gray-500 font-semibold">Allergies</label>
              <div class="mt-2 flex items-center gap-2 text-gray-700">
                <span class="text-gray-400">●</span>
                <span>{{ scannedRoom.allergies }}</span>
              </div>
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
import { ref } from 'vue';
import { QrCode, Smartphone, X, Info, CheckCircle2 } from 'lucide-vue-next';

const cameraOpen = ref(false);
const videoElement = ref(null);
const scannedRoom = ref(null);
const lastScannedIndex = ref(-1);
const handheldMode = ref(false);
const handheldServed = ref(new Set());

const sampleRooms = {
  103: {
    room: 103,
    patientName: 'Rosa Mercado',
    patientCount: 1,
    bed: 'Bed 3',
    diagnosis: 'Gastroenteritis',
    diet: 'Normal Diet',
    allergies: 'No known allergies'
  },
  102: {
    room: 102,
    patientName: 'Juan dela Cruz',
    patientCount: 1,
    bed: 'Bed 2',
    diagnosis: 'Diabetes Mellitus',
    diet: 'DM (Diabetic Mellitus) Diet',
    allergies: 'Shellfish'
  },
  104: {
    room: 104,
    patientName: 'Pedro Reyes',
    patientCount: 1,
    bed: 'Bed 4',
    diagnosis: 'Hypertension',
    diet: 'Low Sodium Diet',
    allergies: 'No known allergies'
  }
};

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
  // cycle to next room in sampleRooms
  const rooms = Object.keys(sampleRooms).map(Number);
  lastScannedIndex.value = (lastScannedIndex.value + 1) % rooms.length;
  const nextRoom = rooms[lastScannedIndex.value];
  scannedRoom.value = sampleRooms[nextRoom];
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
