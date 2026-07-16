<template>
  <div class="min-h-screen relative flex items-center justify-center p-4 overflow-y-auto">
    <!-- Background Image -->
    <div 
      class="absolute inset-0 z-0"
      :style="{ backgroundImage: `url(${hospitalBg})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }"
    ></div>
    <!-- Green Overlay -->
    <div class="absolute inset-0 z-0" style="background-color: rgba(30, 130, 76, 0.75);"></div>

    <!-- Centered Card -->
    <div class="relative z-10 w-full max-w-[440px] bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-green-50 my-8">
      
      <!-- Header -->
      <div class="flex flex-col items-center text-center mb-6">
        <div class="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mb-3">
          <Lock class="text-[#2D5F3F]" :size="28" />
        </div>
        <h2 class="font-dm-serif font-bold text-xl md:text-2xl text-gray-900 leading-tight">
          Set New Password
        </h2>
        <p class="font-dm-sans text-xs text-gray-500 mt-2 px-4">
          Please enter your new password below.
        </p>
      </div>

      <!-- Success Message -->
      <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded-xl flex items-start gap-3 mb-6">
        <CheckCircle2 :size="20" class="shrink-0 mt-0.5" />
        <div class="text-sm leading-relaxed font-dm-sans">
          <p class="font-bold mb-1">Password updated</p>
          <p>Your password has been reset successfully. Redirecting you to login...</p>
        </div>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleReset" class="space-y-4">
        <!-- New Password Input -->
        <div>
          <label for="password" class="block text-xs font-bold text-gray-700 mb-1.5 font-dm-sans">
            New Password
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock :size="16" />
            </div>
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full pl-9 pr-10 py-3 border border-gray-200 rounded-xl focus:border-[#2D5F3F] focus:ring-2 focus:ring-green-100 outline-none text-sm transition-all text-gray-800 placeholder-gray-400 bg-gray-50/50"
              placeholder="Enter new password"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Eye v-if="!showPassword" :size="16" />
              <EyeOff v-else :size="16" />
            </button>
          </div>
        </div>

        <!-- Confirm Password Input -->
        <div>
          <label for="confirm" class="block text-xs font-bold text-gray-700 mb-1.5 font-dm-sans">
            Confirm Password
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock :size="16" />
            </div>
            <input
              id="confirm"
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full pl-9 pr-10 py-3 border border-gray-200 rounded-xl focus:border-[#2D5F3F] focus:ring-2 focus:ring-green-100 outline-none text-sm transition-all text-gray-800 placeholder-gray-400 bg-gray-50/50"
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl flex items-center gap-2">
          <AlertCircle :size="16" class="shrink-0" />
          <span class="text-xs leading-normal font-dm-sans">{{ errorMessage }}</span>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading || !password || !confirmPassword"
          class="w-full bg-[#1b4332] hover:bg-[#2d5f3f] disabled:bg-gray-400 text-white py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase shadow-md hover:shadow-lg transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
        >
          <Save v-if="!loading" :size="16" />
          <Loader v-else :size="16" class="animate-spin" />
          <span>{{ loading ? 'Saving...' : 'Save New Password' }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import hospitalBg from '@/assets/hospital-building.jpg';
import {
  Lock,
  Eye,
  EyeOff,
  Loader,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-vue-next';

const router = useRouter();
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');
const success = ref(false);

function handleReset() {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.';
    return;
  }
  
  if (password.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters.';
    return;
  }

  errorMessage.value = '';
  loading.value = true;
  
  // Simulate API call to save new password
  setTimeout(() => {
    loading.value = false;
    success.value = true;
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  }, 1000);
}
</script>
