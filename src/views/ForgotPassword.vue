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
      <!-- Back to Login Button -->
      <button @click="goBack" class="flex items-center gap-1.5 text-gray-500 hover:text-[#2D5F3F] text-xs font-semibold mb-6 transition-colors group">
        <ArrowLeft :size="14" class="transition-transform group-hover:-translate-x-0.5" />
        <span>Back to Login</span>
      </button>

      <!-- Header -->
      <div class="flex flex-col items-center text-center mb-6">
        <div class="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mb-3">
          <Key class="text-[#2D5F3F]" :size="28" />
        </div>
        <h2 class="font-dm-serif font-bold text-xl md:text-2xl text-gray-900 leading-tight">
          Forgot Password
        </h2>
        <p class="font-dm-sans text-xs text-gray-500 mt-2 px-4">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded-xl flex items-start gap-3 mb-6">
        <CheckCircle2 :size="20" class="shrink-0 mt-0.5" />
        <div class="text-sm leading-relaxed font-dm-sans">
          <p class="font-bold mb-1">Check your inbox</p>
          <p>{{ successMessage }}</p>
        </div>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleReset" class="space-y-5">
        <!-- Email Input -->
        <div>
          <label for="email" class="block text-xs font-bold text-gray-700 mb-1.5 font-dm-sans">
            Email Address
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Mail :size="16" />
            </div>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl focus:border-[#2D5F3F] focus:ring-2 focus:ring-green-100 outline-none text-sm transition-all text-gray-800 placeholder-gray-400 bg-gray-50/50"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading || !email"
          class="w-full bg-[#1b4332] hover:bg-[#2d5f3f] disabled:bg-gray-400 text-white py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase shadow-md hover:shadow-lg transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
        >
          <Send v-if="!loading" :size="16" />
          <Loader v-else :size="16" class="animate-spin" />
          <span>{{ loading ? 'Sending...' : 'Send Reset Link' }}</span>
        </button>
      </form>
      
      <!-- Mock redirect for prototype -->
      <div v-if="successMessage" class="mt-6 text-center border-t border-gray-100 pt-6">
        <p class="text-xs text-gray-400 mb-2 uppercase tracking-widest font-bold">Prototype Demo Only</p>
        <button @click="simulateEmailClick" class="text-sm font-semibold text-blue-600 hover:text-blue-800 underline decoration-blue-300 underline-offset-4">
          Simulate clicking link in email
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import hospitalBg from '@/assets/hospital-building.jpg';
import {
  Mail,
  ArrowLeft,
  Loader,
  Send,
  Key,
  CheckCircle2
} from 'lucide-vue-next';

const router = useRouter();
const email = ref('');
const loading = ref(false);
const successMessage = ref('');

function goBack() {
  router.push('/login');
}

function handleReset() {
  if (!email.value) return;
  
  loading.value = true;
  
  // Simulate API call
  setTimeout(() => {
    loading.value = false;
    successMessage.value = `If an account exists for ${email.value}, a reset link has been sent.`;
  }, 1000);
}

function simulateEmailClick() {
  router.push({ path: '/reset-password', query: { token: 'mock-token-xyz123' } });
}
</script>
