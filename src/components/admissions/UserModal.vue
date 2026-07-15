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
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col relative z-10 overflow-hidden border border-gray-100">
        <!-- Header -->
        <div class="px-6 md:px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full bg-[#e6f4f1] text-[#00a67e] flex items-center justify-center">
              <UserPlus :size="20" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-800">{{ userToEdit ? 'Edit User Details' : 'Create New User' }}</h2>
              <p class="text-xs text-gray-500 mt-0.5">{{ userToEdit ? 'Update the user information and account settings.' : 'Fill in the details to create a new user account.' }}</p>
            </div>
          </div>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100">
            <X :size="24" />
          </button>
        </div>
        
        <!-- Scrollable Form Body -->
        <div class="px-6 md:px-8 py-6 overflow-y-auto flex-1 bg-gray-50/30 custom-scrollbar">
          <form id="userForm" @submit.prevent="handleSubmit" class="space-y-8">
            
            <!-- Personal Information -->
            <section>
              <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center">
                <span class="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                Personal Information
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

                <!-- Profile Photo Upload -->
                <div class="md:col-span-2 flex items-center gap-5 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <!-- Avatar Preview -->
                  <div class="relative shrink-0">
                    <div class="w-20 h-20 rounded-full overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
                      <img v-if="form.photo" :src="form.photo" alt="Profile" class="w-full h-full object-cover" />
                      <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#e6f4f1] to-[#c0ebe0]">
                        <span class="text-2xl font-bold font-dm-serif text-[#00a67e]">{{ form.name ? form.name.charAt(0).toUpperCase() : '?' }}</span>
                      </div>
                    </div>
                    <label for="photoUpload" class="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#00a67e] text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-[#008a61] transition-colors" title="Upload photo">
                      <Camera :size="13" />
                    </label>
                  </div>
                  <!-- Upload Controls -->
                  <div class="flex-1 min-w-0">
                    <p class="font-candal text-sm text-gray-800 mb-0.5">Profile Photo</p>
                    <p class="font-dm-mono text-xs text-gray-400 mb-3">JPG, PNG or GIF · max 2 MB</p>
                    <div class="flex items-center gap-2 flex-wrap">
                      <label for="photoUpload" class="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-candal text-[#00a67e] bg-[#e6f4f1] hover:bg-[#c8ece3] rounded-lg transition-colors border border-[#b0dfd3]">
                        <Camera :size="13" />
                        {{ form.photo ? 'Change Photo' : 'Upload Photo' }}
                      </label>
                      <button v-if="form.photo" type="button" @click="removePhoto" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-candal text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100">
                        Remove
                      </button>
                    </div>
                    <input id="photoUpload" type="file" accept="image/*" class="hidden" @change="handlePhotoUpload" />
                  </div>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">Full Name <span class="text-red-500">*</span></label>
                  <input v-model="form.name" type="text" required class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-[#00a67e] focus:ring-1 focus:ring-[#00a67e] outline-none transition-all text-sm" placeholder="e.g. Dr. Ana Lopez" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">Role <span class="text-red-500">*</span></label>
                  <select v-model="form.role" required class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-[#00a67e] focus:ring-1 focus:ring-[#00a67e] outline-none transition-all text-sm bg-white">
                    <option value="">Select Role</option>
                    <option value="Admissions Admin">Admissions Admin</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Dietitian">Dietitian</option>
                    <option value="Purchasing Officer">Purchasing Officer</option>
                    <option value="Kitchen Staff">Kitchen Staff</option>
                    <option value="Food Server">Food Server</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">Department</label>
                  <input v-model="form.department" type="text" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-[#00a67e] focus:ring-1 focus:ring-[#00a67e] outline-none transition-all text-sm" placeholder="e.g. Dietary" />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">Contact Number</label>
                  <input v-model="form.contactNumber" type="text" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-[#00a67e] focus:ring-1 focus:ring-[#00a67e] outline-none transition-all text-sm" placeholder="+63 912 345 6789" />
                </div>
              </div>
            </section>

            <!-- Account Credentials -->
            <section>
              <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center">
                <span class="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                Account Credentials
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="md:col-span-2">
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">Email Address <span class="text-red-500">*</span></label>
                  <input v-model="form.email" type="email" required class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-[#00a67e] focus:ring-1 focus:ring-[#00a67e] outline-none transition-all text-sm" placeholder="email@moph.gov.ph" />
                </div>
                
                <div v-if="!userToEdit" class="md:col-span-2">
                  <label class="block text-xs font-semibold text-gray-700 mb-1.5">Temporary Password <span class="text-red-500">*</span></label>
                  <input v-model="form.password" type="password" required class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-[#00a67e] focus:ring-1 focus:ring-[#00a67e] outline-none transition-all text-sm" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" />
                </div>

                <div v-if="userToEdit" class="md:col-span-2">
                  <button type="button" @click="resetPassword" class="text-[#00a67e] hover:text-[#008a61] text-sm font-bold flex items-center gap-2 px-4 py-2 bg-[#e6f4f1] rounded-lg transition-colors">
                    <KeyRound :size="16" />
                    <span>Send Password Reset Link</span>
                  </button>
                  <p v-if="passwordResetSent" class="text-xs text-green-600 mt-2 font-medium">Password reset email sent to {{ form.email }}!</p>
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
          <button type="submit" form="userForm" class="px-6 py-2.5 bg-[#00a67e] hover:bg-[#008a61] text-white text-sm font-bold rounded-xl transition-colors shadow-sm flex items-center space-x-2">
            <Save v-if="userToEdit" :size="18" />
            <UserPlus v-else :size="18" />
            <span>{{ userToEdit ? 'Save Changes' : 'Create User' }}</span>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>

import { ref, watch } from 'vue';
import { useDataStore } from '@/stores/dataStore';
import { UserPlus, X, Save, KeyRound, Camera } from 'lucide-vue-next';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  userToEdit: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'saved']);
const dataStore = useDataStore();

const passwordResetSent = ref(false);

const form = ref({
  name: '',
  role: '',
  department: '',
  contactNumber: '',
  email: '',
  password: '',
  photo: ''
});

watch(() => props.userToEdit, (newVal) => {
  passwordResetSent.value = false;
  if (newVal) {
    form.value = {
      name: newVal.name || '',
      role: newVal.role || '',
      department: newVal.department || '',
      contactNumber: newVal.contactNumber || '',
      email: newVal.email || '',
      password: '',
      photo: newVal.photo || ''
    };
  } else {
    form.value = {
      name: '',
      role: '',
      department: '',
      contactNumber: '',
      email: '',
      password: '',
      photo: ''
    };
  }
}, { immediate: true });

function handleSubmit() {
  if (!form.value.name || !form.value.role || !form.value.email) return;

  const userData = {
    name: form.value.name,
    role: form.value.role,
    department: form.value.department,
    contactNumber: form.value.contactNumber,
    email: form.value.email,
    photo: form.value.photo
  };

  if (props.userToEdit) {
    dataStore.updateUser(props.userToEdit.id, userData);
    emit('saved', { ...props.userToEdit, ...userData });
  } else {
    const newUser = {
      id: `U00${dataStore.users.length + 1}`,
      ...userData,
      status: 'Active'
    };
    dataStore.addUser(newUser);
    emit('saved', newUser);
  }

  emit('close');
}

function resetPassword() {
  passwordResetSent.value = true;
  setTimeout(() => {
    passwordResetSent.value = false;
  }, 3000);
}

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    alert('Photo must be smaller than 2 MB.');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    form.value.photo = e.target.result;
  };
  reader.readAsDataURL(file);
  // Reset input so the same file can be re-selected
  event.target.value = '';
}

function removePhoto() {
  form.value.photo = '';
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
