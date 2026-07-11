<template>
  <transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="show && patient" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" @click="$emit('close')"></div>

      <!-- Modal Content -->
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col relative z-10 overflow-hidden border border-gray-100">
        <!-- Header -->
        <div class="px-6 md:px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full bg-[#e0f2fe] text-[#0ea5e9] flex items-center justify-center">
              <User :size="20" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-800">Patient Details</h2>
              <p class="text-xs text-gray-500 mt-0.5">ID: {{ patient.id }}</p>
            </div>
          </div>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100">
            <X :size="24" />
          </button>
        </div>
        
        <!-- Scrollable Body -->
        <div class="px-6 md:px-8 py-6 overflow-y-auto flex-1 bg-gray-50/30 custom-scrollbar space-y-8">
          
          <!-- Personal Information -->
          <section>
            <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center">
              <span class="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
              Personal Information
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <div class="md:col-span-2">
                <span class="block text-xs font-semibold text-gray-500 mb-1">Full Name</span>
                <span class="text-sm font-bold text-gray-800">{{ patient.name }}</span>
              </div>
              <div>
                <span class="block text-xs font-semibold text-gray-500 mb-1">Date of Birth</span>
                <span class="text-sm font-bold text-gray-800">{{ patient.dob || 'Not Provided' }}</span>
              </div>
              <div>
                <span class="block text-xs font-semibold text-gray-500 mb-1">Age</span>
                <span class="text-sm font-bold text-gray-800">{{ patient.age }}</span>
              </div>
              <div>
                <span class="block text-xs font-semibold text-gray-500 mb-1">Gender</span>
                <span class="text-sm font-bold text-gray-800">{{ patient.gender }}</span>
              </div>
              <div>
                <span class="block text-xs font-semibold text-gray-500 mb-1">Contact Number</span>
                <span class="text-sm font-bold text-gray-800">{{ patient.contactNumber || 'Not Provided' }}</span>
              </div>
              <div class="sm:col-span-2 md:col-span-3">
                <span class="block text-xs font-semibold text-gray-500 mb-1">Complete Address</span>
                <span class="text-sm font-bold text-gray-800">{{ patient.address || 'Not Provided' }}</span>
              </div>
            </div>
          </section>

          <!-- Medical Information -->
          <section>
            <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center">
              <span class="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
              Medical Information
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <div>
                <span class="block text-xs font-semibold text-gray-500 mb-1">Attending Physician</span>
                <span class="text-sm font-bold text-gray-800">{{ patient.physician }}</span>
              </div>
              <div>
                <span class="block text-xs font-semibold text-gray-500 mb-1">Diagnosis / Primary Condition</span>
                <span class="text-sm font-bold text-[#00a67e]">{{ patient.condition }}</span>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <span class="block text-xs font-semibold text-gray-500 mb-1">Height</span>
                  <span class="text-sm font-bold text-gray-800">{{ patient.height ? patient.height + ' cm' : 'Not Provided' }}</span>
                </div>
                <div>
                  <span class="block text-xs font-semibold text-gray-500 mb-1">Weight</span>
                  <span class="text-sm font-bold text-gray-800">{{ patient.weight ? patient.weight + ' kg' : 'Not Provided' }}</span>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <span class="block text-xs font-semibold text-gray-500 mb-1">Blood Type</span>
                  <span class="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-bold bg-red-50 text-red-600">{{ patient.bloodType || 'N/A' }}</span>
                </div>
                <div>
                  <span class="block text-xs font-semibold text-gray-500 mb-1">Known Allergies</span>
                  <span class="text-sm font-bold text-gray-800">{{ patient.allergies || 'None' }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Room Information -->
          <section>
            <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center">
              <span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              Room Information
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <div>
                <span class="block text-xs font-semibold text-gray-500 mb-1">Admission Date & Time</span>
                <span class="text-sm font-bold text-gray-800">{{ formatDateTime(patient.admissionDate) }}</span>
              </div>
              <div>
                <span class="block text-xs font-semibold text-gray-500 mb-1">Room & Bed</span>
                <span class="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold bg-[#e6f4f1] text-[#00a67e]">{{ patient.room }}</span>
              </div>
              <div>
                <span class="block text-xs font-semibold text-gray-500 mb-1">Admission Type</span>
                <span class="text-sm font-bold text-gray-800">{{ patient.admissionType || 'Emergency' }}</span>
              </div>
            </div>
          </section>

          <!-- Emergency Contact -->
          <section>
            <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center">
              <span class="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
              Emergency Contact
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <div>
                <span class="block text-xs font-semibold text-gray-500 mb-1">Contact Name</span>
                <span class="text-sm font-bold text-gray-800">{{ patient.emergencyContactName || 'Not Provided' }}</span>
              </div>
              <div>
                <span class="block text-xs font-semibold text-gray-500 mb-1">Relationship</span>
                <span class="text-sm font-bold text-gray-800">{{ patient.emergencyContactRel || 'N/A' }}</span>
              </div>
              <div>
                <span class="block text-xs font-semibold text-gray-500 mb-1">Contact Number</span>
                <span class="text-sm font-bold text-gray-800">{{ patient.emergencyContactNumber || 'N/A' }}</span>
              </div>
            </div>
          </section>

        </div>

        <!-- Footer -->
        <div class="px-6 md:px-8 py-4 border-t border-gray-100 bg-white shrink-0 flex items-center justify-end gap-3">
          <button type="button" @click="$emit('edit')" class="px-6 py-2.5 bg-[#00a67e] hover:bg-[#008a61] text-white text-sm font-bold rounded-xl transition-colors shadow-sm flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
            <span>Edit Patient</span>
          </button>
          <button type="button" @click="$emit('close')" class="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-colors">
            Close View
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>


import { User, X } from 'lucide-vue-next';


defineProps({
  show: {
    type: Boolean,
    default: false
  },
  patient: {
    type: Object,
    default: null
  }
});

defineEmits(['close', 'edit']);

function formatDateTime(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return `${formattedDate} • ${formattedTime}`;
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 10px;
}
</style>
