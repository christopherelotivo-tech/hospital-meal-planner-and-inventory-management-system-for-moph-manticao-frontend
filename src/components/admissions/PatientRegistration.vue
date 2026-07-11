<template>
  <transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" @click="$emit('close')"></div>

      <!-- Modal Content -->
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col relative z-10 overflow-hidden border border-gray-100">
        <!-- Header -->
        <div class="px-6 md:px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full bg-[#e6f4f1] text-[#00a67e] flex items-center justify-center">
              <UserPlus :size="20" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-800">{{ patientToEdit ? 'Edit Patient Details' : 'Admit New Patient' }}</h2>
              <p class="text-xs text-gray-500 mt-0.5">{{ patientToEdit ? 'Update the comprehensive details for this patient.' : 'Fill in the comprehensive details for admission.' }}</p>
            </div>
          </div>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100">
            <X :size="24" />
          </button>
        </div>
        
        <!-- Scrollable Form Body -->
        <div class="px-6 md:px-8 py-6 overflow-y-auto flex-1 bg-gray-50/30 custom-scrollbar">
          <form id="admitForm" @submit.prevent="handleSubmit" class="space-y-8">
            
            <!-- Personal Information -->
            <section>
              <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center">
                <span class="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                Personal Information
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div class="md:col-span-2">
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">Full Name <span class="text-red-500">*</span></label>
                  <input v-model="form.name" type="text" required class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-[#00a67e] focus:ring-1 focus:ring-[#00a67e] outline-none transition-all text-sm" placeholder="e.g. Juan Dela Cruz" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">Date of Birth</label>
                  <input v-model="form.dob" type="date" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-[#00a67e] focus:ring-1 focus:ring-[#00a67e] outline-none transition-all text-sm" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">Age <span class="text-red-500">*</span></label>
                  <input v-model.number="form.age" type="number" required min="0" max="150" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-[#00a67e] focus:ring-1 focus:ring-[#00a67e] outline-none transition-all text-sm" placeholder="45" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">Gender <span class="text-red-500">*</span></label>
                  <select v-model="form.gender" required class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-[#00a67e] focus:ring-1 focus:ring-[#00a67e] outline-none transition-all text-sm bg-white">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">Contact Number</label>
                  <input v-model="form.contactNumber" type="text" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-[#00a67e] focus:ring-1 focus:ring-[#00a67e] outline-none transition-all text-sm" placeholder="+63 912 345 6789" />
                </div>
                <div class="md:col-span-3">
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">Complete Address</label>
                  <textarea v-model="form.address" rows="2" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-[#00a67e] focus:ring-1 focus:ring-[#00a67e] outline-none transition-all text-sm" placeholder="123 Street Name, Barangay, City, Province"></textarea>
                </div>
              </div>
            </section>

            <!-- Medical Information -->
            <section>
              <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center">
                <span class="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                Medical Information
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="md:col-span-2">
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">Attending Physician <span class="text-red-500">*</span></label>
                  <select v-model="form.physician" required class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-[#00a67e] focus:ring-1 focus:ring-[#00a67e] outline-none transition-all text-sm bg-white">
                    <option value="" disabled>Select Attending Physician</option>
                    <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.name">
                      {{ doctor.name }}
                    </option>
                  </select>
                </div>
                <div class="md:col-span-2">
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">Diagnosis / Primary Condition <span class="text-red-500">*</span></label>
                  <input v-model="form.condition" type="text" required class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-[#00a67e] focus:ring-1 focus:ring-[#00a67e] outline-none transition-all text-sm" placeholder="e.g. Hypertension" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">Height (cm)</label>
                  <input v-model.number="form.height" type="number" step="0.1" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-[#00a67e] focus:ring-1 focus:ring-[#00a67e] outline-none transition-all text-sm" placeholder="e.g. 170" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">Weight (kg)</label>
                  <input v-model.number="form.weight" type="number" step="0.1" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-[#00a67e] focus:ring-1 focus:ring-[#00a67e] outline-none transition-all text-sm" placeholder="e.g. 65.5" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">Blood Type</label>
                  <select v-model="form.bloodType" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-[#00a67e] focus:ring-1 focus:ring-[#00a67e] outline-none transition-all text-sm bg-white">
                    <option value="">Select Blood Type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">Known Allergies</label>
                  <input v-model="form.allergies" type="text" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-[#00a67e] focus:ring-1 focus:ring-[#00a67e] outline-none transition-all text-sm" placeholder="e.g. Penicillin, Peanuts (leave blank if none)" />
                </div>
              </div>
            </section>

            <!-- Room Information -->
            <section>
              <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center">
                <span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                Room Information
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">Admission Date & Time <span class="text-red-500">*</span></label>
                  <input v-model="form.admissionDate" type="datetime-local" required class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-[#00a67e] focus:ring-1 focus:ring-[#00a67e] outline-none transition-all text-sm" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">Room & Bed <span class="text-red-500">*</span></label>
                  <input v-model="form.room" type="text" required class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-[#00a67e] focus:ring-1 focus:ring-[#00a67e] outline-none transition-all text-sm" placeholder="e.g. 101-A" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">Admission Type</label>
                  <select v-model="form.admissionType" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-[#00a67e] focus:ring-1 focus:ring-[#00a67e] outline-none transition-all text-sm bg-white">
                    <option value="Emergency">Emergency</option>
                    <option value="Outpatient">Outpatient</option>
                    <option value="Inpatient">Inpatient</option>
                    <option value="Transfer">Transfer</option>
                  </select>
                </div>
              </div>
            </section>

            <!-- Emergency Contact -->
            <section>
              <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center">
                <span class="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                Emergency Contact
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">Contact Name <span class="text-red-500">*</span></label>
                  <input v-model="form.emergencyContactName" type="text" required class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-[#00a67e] focus:ring-1 focus:ring-[#00a67e] outline-none transition-all text-sm" placeholder="Full Name" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">Relationship <span class="text-red-500">*</span></label>
                  <input v-model="form.emergencyContactRel" type="text" required class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-[#00a67e] focus:ring-1 focus:ring-[#00a67e] outline-none transition-all text-sm" placeholder="e.g. Spouse, Parent" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">Contact Number <span class="text-red-500">*</span></label>
                  <input v-model="form.emergencyContactNumber" type="text" required class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-[#00a67e] focus:ring-1 focus:ring-[#00a67e] outline-none transition-all text-sm" placeholder="+63 912 345 6789" />
                </div>
              </div>
            </section>

          </form>
        </div>

        <!-- Footer -->
        <div class="px-6 md:px-8 py-4 border-t border-gray-100 bg-white shrink-0 flex items-center justify-end gap-3">
          <button type="button" @click="$emit('close')" class="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors">
            Cancel
          </button>
          <button type="submit" form="admitForm" class="px-6 py-2.5 bg-[#00a67e] hover:bg-[#008a61] text-white text-sm font-bold rounded-xl transition-colors shadow-sm flex items-center space-x-2">
            <UserPlus :size="18" />
            <span>{{ patientToEdit ? 'Save Changes' : 'Admit Patient' }}</span>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>

import { ref, watch, computed } from 'vue';
import { useDataStore } from '@/stores/dataStore';

import { UserPlus, X } from 'lucide-vue-next';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  patientToEdit: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'admitted', 'updated']);
const dataStore = useDataStore();

// Get list of doctors for the dropdown
const doctors = computed(() => {
  return dataStore.users.filter((u) => u.role === 'Doctor' && u.status === 'Active');
});

const now = new Date();
// Format as YYYY-MM-DDThh:mm
const offset = now.getTimezoneOffset() * 60000;
const localISOTime = new Date(now.getTime() - offset).toISOString().slice(0, 16);

const form = ref({
  name: '',
  dob: '',
  age: null,
  gender: '',
  contactNumber: '',
  address: '',

  physician: '',
  condition: '',
  height: null,
  weight: null,
  bloodType: '',
  allergies: '',

  room: '',
  admissionDate: localISOTime,
  admissionType: 'Emergency',

  emergencyContactName: '',
  emergencyContactRel: '',
  emergencyContactNumber: ''
});

watch(() => props.patientToEdit, (newVal) => {
  if (newVal) {
    form.value = {
      name: newVal.name || '',
      dob: newVal.dob || '',
      age: newVal.age || null,
      gender: newVal.gender || '',
      contactNumber: newVal.contactNumber || '',
      address: newVal.address || '',
      physician: newVal.physician || '',
      condition: newVal.condition || '',
      height: newVal.height || null,
      weight: newVal.weight || null,
      bloodType: newVal.bloodType || '',
      allergies: newVal.allergies || '',
      room: newVal.room || '',
      admissionDate: newVal.admissionDate || localISOTime,
      admissionType: newVal.admissionType || 'Emergency',
      emergencyContactName: newVal.emergencyContactName || '',
      emergencyContactRel: newVal.emergencyContactRel || '',
      emergencyContactNumber: newVal.emergencyContactNumber || ''
    };
  } else {
    resetForm();
  }
}, { immediate: true });

function handleSubmit() {
  if (!form.value.gender) return;

  const patientData = {
    name: form.value.name,
    age: form.value.age || 0,
    gender: form.value.gender,
    room: form.value.room,
    admissionDate: form.value.admissionDate,
    condition: form.value.condition,
    physician: form.value.physician,
    height: form.value.height || undefined,
    weight: form.value.weight || undefined,
    dob: form.value.dob,
    contactNumber: form.value.contactNumber,
    address: form.value.address,
    bloodType: form.value.bloodType,
    allergies: form.value.allergies,
    admissionType: form.value.admissionType,
    emergencyContactName: form.value.emergencyContactName,
    emergencyContactRel: form.value.emergencyContactRel,
    emergencyContactNumber: form.value.emergencyContactNumber
  };

  if (props.patientToEdit) {
    dataStore.updatePatient(props.patientToEdit.id, patientData);
    emit('updated', { ...props.patientToEdit, ...patientData });
  } else {
    const newPatient = {
      id: `P${String(dataStore.patients.length + 1).padStart(3, '0')}`,
      ...patientData,
      status: 'Active'
    };
    dataStore.addPatient(newPatient);
    emit('admitted', newPatient);
  }

  resetForm();
  emit('close');
}

function resetForm() {
  form.value = {
    name: '',
    dob: '',
    age: null,
    gender: '',
    contactNumber: '',
    address: '',
    physician: '',
    condition: '',
    height: null,
    weight: null,
    bloodType: '',
    allergies: '',
    room: '',
    admissionDate: localISOTime,
    admissionType: 'Emergency',
    emergencyContactName: '',
    emergencyContactRel: '',
    emergencyContactNumber: ''
  };
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
