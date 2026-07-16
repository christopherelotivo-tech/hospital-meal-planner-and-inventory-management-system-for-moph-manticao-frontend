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
    <div v-if="scannedRoom" class="min-h-screen bg-gray-50 flex flex-col">
      <!-- Header -->
      <div class="bg-teal-600 text-white p-4 text-center shrink-0">
        <button @click="backToScanner" class="flex items-center gap-2 text-white hover:text-teal-100 mb-2">
          <span>←</span>
          <span class="text-sm font-semibold">Back to Scanner</span>
        </button>
        <h2 class="text-3xl font-bold">Room {{ scannedRoom.room }}</h2>
        <div class="mt-2 text-teal-100 font-medium text-sm flex items-center justify-center gap-2">
          <span>Patient {{ currentPatientIndex + 1 }} of {{ scannedRoom.patients.length }}</span>
          <div class="flex gap-1">
            <div v-for="(_, i) in scannedRoom.patients" :key="i" class="w-2 h-2 rounded-full" :class="i === currentPatientIndex ? 'bg-white' : 'bg-teal-800'"></div>
          </div>
        </div>
      </div>

      <!-- Content Carousel -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        <!-- Info Box -->
        <div class="bg-cyan-50 border-2 border-cyan-400 rounded-lg p-3 flex gap-3 text-cyan-800">
          <Info class="flex-shrink-0 mt-0.5" :size="20" />
          <p class="text-xs font-medium leading-relaxed">Verify diet type and allergies before handing over the tray. Use the Next button to view the next patient.</p>
        </div>

        <!-- Patient Card -->
        <div v-if="currentPatient" class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden relative">
          <!-- Patient Header -->
          <div class="bg-teal-600 text-white p-4">
            <h3 class="text-xl font-bold">{{ currentPatient.patientName }}</h3>
            <p class="text-teal-100 text-sm mt-1 font-semibold">🛏️ {{ currentPatient.bed }} • {{ currentPatient.diagnosis }}</p>
          </div>

          <!-- Patient Details -->
          <div class="p-5 space-y-5">
            <div class="flex gap-4">
              <div class="flex-1">
                <label class="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Diet Prescription</label>
                <span class="inline-block px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-sm font-bold border border-green-200 shadow-sm">{{ currentPatient.diet }}</span>
              </div>
              <div class="flex-1">
                <label class="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Allergies</label>
                <span class="inline-block px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm font-semibold border border-red-100">{{ currentPatient.allergies }}</span>
              </div>
            </div>

            <!-- Assigned Meal Components -->
            <div v-if="scannedMeal" class="mt-2 pt-4 border-t border-gray-100">
              <label class="text-xs text-teal-700 font-bold uppercase tracking-wider mb-3 block">Assigned Tray Components</label>
              <div class="grid gap-2">
                <div class="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-center shadow-sm">
                  <span class="text-[11px] font-bold text-gray-500 uppercase tracking-widest">🌾 Carb</span>
                  <span class="font-bold text-gray-800 text-sm">{{ scannedMeal.lunchCarb || scannedMeal.breakfastCarb || scannedMeal.dinnerCarb || 'None' }}</span>
                </div>
                <div class="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-center shadow-sm">
                  <span class="text-[11px] font-bold text-gray-500 uppercase tracking-widest">🍗 Viand</span>
                  <span class="font-bold text-gray-800 text-sm">{{ scannedMeal.lunchProtein || scannedMeal.breakfastProtein || scannedMeal.dinnerProtein || 'None' }}</span>
                </div>
                <div class="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-center shadow-sm">
                  <span class="text-[11px] font-bold text-gray-500 uppercase tracking-widest">🍎 Side/Fruit</span>
                  <span class="font-bold text-gray-800 text-sm">{{ scannedMeal.lunchSide || scannedMeal.breakfastSide || scannedMeal.dinnerSide || 'None' }}</span>
                </div>
              </div>
            </div>
            <div v-else class="mt-4 p-4 border border-amber-200 bg-amber-50 rounded-lg text-amber-700 font-bold text-sm text-center">
              ⚠️ No meal assigned for today.
            </div>
          </div>
        </div>
      </div>

      <!-- Fixed Bottom Action Bar -->
      <div class="bg-white border-t border-gray-200 p-4 shrink-0 flex gap-3 pb-8">
        <button 
          @click="prevPatient" 
          :disabled="currentPatientIndex === 0"
          class="px-5 py-4 bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700 font-bold rounded-xl transition flex-shrink-0"
        >
          Prev
        </button>

        <button 
          v-if="currentPatientIndex < (scannedRoom.patients.length - 1)"
          @click="nextPatient" 
          class="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
        >
          Next Patient
        </button>

        <button 
          v-else
          @click="markAllServed" 
          class="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
        >
          <CheckCircle2 :size="20" />
          Complete Room
        </button>
      </div>
    </div>

    <!-- Initial View -->
    <div v-if="!cameraOpen && !scannedRoom && !handheldMode" class="bg-gray-50 flex flex-col h-[calc(100vh-100px)] min-h-[500px]">
      <div class="p-6 pb-2 text-center">
        <h2 class="text-2xl font-bold text-gray-900">Food Server App</h2>
        <p class="text-sm text-gray-500 mt-1">Ready to deliver meals.</p>
      </div>
      
      <div class="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
        <!-- Massive QR Scanner Button -->
        <button 
          @click="openCamera" 
          class="w-full max-w-sm aspect-square bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl shadow-xl flex flex-col items-center justify-center text-white transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-amber-300"
        >
          <div class="bg-white/20 p-6 rounded-full mb-6">
            <QrCode :size="80" stroke-width="1.5" />
          </div>
          <h3 class="font-caprasimo text-2xl tracking-wide mb-2">Scan QR Code</h3>
          <p class="text-amber-100 text-sm opacity-90 px-8 text-center">Tap to open camera and scan patient wristband or room door.</p>
        </button>

        <!-- Secondary Handheld Button -->
        <button 
          @click="openHandheld" 
          class="w-full max-w-sm bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-center space-x-3 text-gray-700 hover:bg-gray-50 transition-colors active:scale-95"
        >
          <Smartphone :size="20" class="text-gray-400" />
          <span class="font-semibold">Manual Distribution List</span>
        </button>
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
const currentPatientIndex = ref(0);
const lastScannedIndex = ref(-1);
const handheldMode = ref(false);
const handheldServed = ref(new Set());

// We will dynamically pull from dataStore in simulateScan

const currentPatient = computed(() => {
  if (!scannedRoom.value || !scannedRoom.value.patients) return null;
  return scannedRoom.value.patients[currentPatientIndex.value];
});

const scannedMeal = computed(() => {
  if (!currentPatient.value) return null;
  const today = new Date().toISOString().split('T')[0];
  return dataStore.mealAssignments.find(m => m.patientId === currentPatient.value.id && m.date === today);
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
  let patientsWithMeals = dataStore.patients.filter(p => 
    dataStore.mealAssignments.some(m => m.patientId === p.id && m.date === today)
  );

  // Fallback for prototype: if no meals today, just use any patient with a meal assignment
  if (patientsWithMeals.length === 0) {
    patientsWithMeals = dataStore.patients.filter(p => 
      dataStore.mealAssignments.some(m => m.patientId === p.id)
    );
  }
  
  if (patientsWithMeals.length === 0) {
    alert("No patients have meal assignments for today. Please assign meals in the Dietitian portal first.");
    closeCamera();
    return;
  }

  // Cycle through the rooms instead of individual patients
  const rooms = Array.from(new Set(patientsWithMeals.map(p => p.room)));
  lastScannedIndex.value = (lastScannedIndex.value + 1) % rooms.length;
  const selectedRoom = rooms[lastScannedIndex.value];

  // Get all patients in that room
  const patientsInRoom = patientsWithMeals.filter(p => p.room === selectedRoom).map(patient => {
    // Find their prescription to get diet and allergies
    const rx = dataStore.prescriptions
      .filter(p => p.patientId === patient.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    return {
      id: patient.id,
      patientName: patient.name,
      bed: patient.bed || 'Bed A',
      diagnosis: patient.condition || 'Not specified',
      diet: rx ? rx.dietType : 'Normal Diet (Regular Diet)',
      allergies: patient.allergies ? patient.allergies : (rx && rx.allergies.length > 0 ? rx.allergies.join(', ') : 'No known allergies')
    };
  });

  scannedRoom.value = {
    room: selectedRoom,
    patients: patientsInRoom
  };
  currentPatientIndex.value = 0;
  
  closeCamera();
}

function nextPatient() {
  if (currentPatientIndex.value < scannedRoom.value.patients.length - 1) {
    currentPatientIndex.value++;
  }
}

function prevPatient() {
  if (currentPatientIndex.value > 0) {
    currentPatientIndex.value--;
  }
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
