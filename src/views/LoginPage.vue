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
      <!-- Change Role Button -->
      <button @click="goBack" class="flex items-center gap-1.5 text-gray-500 hover:text-[#2D5F3F] text-xs font-semibold mb-6 transition-colors group">
        <ArrowLeft :size="14" class="transition-transform group-hover:-translate-x-0.5" />
        <span>Change Role</span>
      </button>

      <!-- Hospital Logo and Title -->
      <div class="flex flex-col items-center text-center mb-6">
        <img src="@/assets/hospital-seal.png" alt="MOPH Logo" class="h-14 w-14 mb-2" />
        <span class="font-dm-mono text-[10px] text-[#2D5F3F] font-bold uppercase tracking-widest">MOPH Manticao</span>
        <h2 class="font-dm-serif font-bold text-xl md:text-2xl text-gray-900 mt-2 leading-tight">
          Login as {{ authStore.selectedRole }}
        </h2>
        <p class="font-dm-sans text-xs text-gray-400 mt-1">Sign in to access your portal</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
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
              class="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#2D5F3F] focus:ring-2 focus:ring-green-100 outline-none text-sm transition-all text-gray-800 placeholder-gray-400 bg-gray-50/50"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <!-- Password Input -->
        <div>
          <label for="password" class="block text-xs font-bold text-gray-700 mb-1.5 font-dm-sans">
            Password
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
              class="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl focus:border-[#2D5F3F] focus:ring-2 focus:ring-green-100 outline-none text-sm transition-all text-gray-800 placeholder-gray-400 bg-gray-50/50"
              placeholder="Enter your password"
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

        <!-- Remember Me Checkbox -->
        <div class="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            v-model="rememberMe"
            class="h-4 w-4 text-[#2D5F3F] focus:ring-[#2D5F3F] border-gray-300 rounded cursor-pointer"
          />
          <label for="remember-me" class="ml-2 block text-xs text-gray-600 font-dm-sans cursor-pointer select-none">
            Remember me
          </label>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl flex items-center gap-2">
          <AlertCircle :size="16" class="shrink-0" />
          <span class="text-xs leading-normal font-dm-sans">{{ errorMessage }}</span>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-[#1b4332] hover:bg-[#2d5f3f] disabled:bg-gray-400 text-white py-3 rounded-xl font-bold text-sm tracking-wider uppercase shadow-md hover:shadow-lg transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
        >
          <LogIn v-if="!loading" :size="16" />
          <Loader v-else :size="16" class="animate-spin" />
          <span>{{ loading ? 'Signing In...' : 'Login' }}</span>
        </button>
      </form>
      
      <!-- Forgot Password Link -->
      <div class="mt-4 text-center">
        <router-link to="/forgot-password" class="text-xs font-semibold text-[#2D5F3F] hover:text-[#1b4332] hover:underline">
          Forgot your password?
        </router-link>
      </div>

      <!-- Demo Account Hint -->
      <p class="text-[10px] text-gray-400 text-center mt-5 font-dm-mono">
        DEMO: <span class="text-gray-500 font-semibold">{{ getDemoCredentials() }}</span> / <span class="text-gray-500 font-semibold">password</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import hospitalBg from '@/assets/hospital-building.jpg';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  ArrowLeft,
  Loader
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const rememberMe = ref(false);
const loading = ref(false);
const errorMessage = ref('');

function getDemoCredentials() {
  const credentials = {
    'Admissions Admin': 'admin@hospital.com',
    'Doctor': 'doctor@hospital.com',
    'Dietitian': 'dietitian@hospital.com',
    'Purchasing Officer': 'purchasing@hospital.com',
    'Kitchen Staff': 'kitchen@hospital.com',
    'Food Server': 'server@hospital.com'
  };
  return credentials[authStore.selectedRole || ''] || 'user@hospital.com';
}

async function handleLogin() {
  if (!authStore.selectedRole) {
    errorMessage.value = 'Please select a role first';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const success = authStore.login(email.value, password.value, authStore.selectedRole);

  if (success) {
    const routes = {
      'Admissions Admin': '/admissions',
      'Doctor': '/doctor',
      'Dietitian': '/dietitian',
      'Purchasing Officer': '/purchasing-officer',
      'Kitchen Staff': '/kitchen-staff',
      'Food Server': '/food-server'
    };
    const route = routes[authStore.selectedRole];
    if (route) {
      router.push(route);
    } else {
      errorMessage.value = 'Portal not yet implemented for this role';
      loading.value = false;
    }
  } else {
    errorMessage.value = 'Invalid credentials. Please check your email and password.';
    loading.value = false;
  }
}

function goBack() {
  router.push('/select-role');
}
</script>

<style scoped>
button {
  outline: none;
}
</style>
