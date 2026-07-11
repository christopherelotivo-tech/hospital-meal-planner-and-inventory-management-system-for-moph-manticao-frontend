<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 grid md:grid-cols-2">
     <div class="absolute inset-0 bg-[url('/src/assets/hospital-building.jpg')] bg-cover bg-center opacity-20"></div>
    <!-- Left Panel - Decorative (Hidden on Mobile) -->
    <div class="hidden md:flex bg-gradient-to-br from-green-700 to-green-600 p-12 flex-col justify-center items-center text-white">
      <div class="max-w-md">
        <div class="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-8 mx-auto backdrop-blur-sm">
          <img src="@/assets/hospital-seal.png" alt="Hospital Seal" class="w-30 h-30" />
        </div>
        
        <h1 class="brand-font text-4xl font-bold mb-6 text-center">
          Welcome to MOPH Manticao
        </h1>
        
        <p class="text-xl text-center text-green-100 mb-8">
          AI-Assisted Hospital Meal Planner and Inventory Management System
        </p>

        <div class="space-y-4">
          <div class="flex items-start space-x-3 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <CheckCircle :size="24" class="text-yellow-300 flex-shrink-0 mt-1" />
            <div>
              <h3 class="font-bold mb-1">Secure Access</h3>
              <p class="text-sm text-green-100">Role-based authentication for all staff members</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <CheckCircle :size="24" class="text-yellow-300 flex-shrink-0 mt-1" />
            <div>
              <h3 class="font-bold mb-1">Real-time Updates</h3>
              <p class="text-sm text-green-100">Instant notifications across departments</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <CheckCircle :size="24" class="text-yellow-300 flex-shrink-0 mt-1" />
            <div>
              <h3 class="font-bold mb-1">Complete Audit Trail</h3>
              <p class="text-sm text-green-100">Track every step from prescription to delivery</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Panel - Login Form -->
    <div class="flex items-center justify-center p-6 md:p-12">
      <div class="w-full max-w-md">
        <!-- Mobile Logo (Visible on Mobile Only) -->
        <div class="md:hidden flex justify-center mb-8">
          <div class="w-20 h-20 bg-gradient-to-br from-green-700 to-green-600 rounded-full flex items-center justify-center shadow-lg">
            <Stethoscope :size="40" class="text-white" />
          </div>
        </div>

        <!-- Selected Role Badge -->
        <div v-if="authStore.selectedRole" class="mb-6">
          <div 
            class="inline-flex items-center space-x-2 px-4 py-2 rounded-full"
            :class="getRoleBadgeClass()"
          >
            <component :is="getRoleIcon()" :size="20" />
            <span class="font-semibold">{{ authStore.selectedRole }}</span>
          </div>
        </div>

        <div class="card-elegant p-8">
          <h2 class="brand-font text-3xl font-bold text-green-900 mb-2">Sign In</h2>
          <p class="text-gray-600 mb-8">Enter your credentials to access your portal</p>

          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Email Input -->
            <div>
              <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail :size="20" class="text-gray-400" />
                </div>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  required
                  class="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  placeholder="your.email@hospital.com"
                />
              </div>
            </div>

            <!-- Password Input -->
            <div>
              <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock :size="20" class="text-gray-400" />
                </div>
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <Eye v-if="!showPassword" :size="20" class="text-gray-400 hover:text-gray-600" />
                  <EyeOff v-else :size="20" class="text-gray-400 hover:text-gray-600" />
                </button>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
              <AlertCircle :size="20" />
              <span class="text-sm">{{ errorMessage }}</span>
            </div>

            <!-- Demo Credentials -->
            <div class="bg-blue-50 border-2 border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
              <p class="text-sm font-semibold mb-2">Demo Credentials:</p>
              <p class="text-xs font-mono">
                {{ getDemoCredentials() }}<br />
                Password: <span class="font-bold">password</span>
              </p>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full btn-gradient-green text-white py-3 rounded-lg font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <LogIn v-if="!loading" :size="20" />
              <Loader v-else :size="20" class="animate-spin" />
              <span>{{ loading ? 'Signing In...' : 'Sign In' }}</span>
            </button>
          </form>

          <!-- Back to Role Selection -->
          <div class="mt-6 text-center">
            <button 
              @click="goBack"
              class="text-green-700 hover:text-green-900 font-semibold text-sm flex items-center justify-center mx-auto space-x-2"
            >
              <ArrowLeft :size="16" />
              <span>Change Role</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import {
  Stethoscope,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Loader,
  UserPlus,
  ShoppingCart,
  ChefHat,
  Utensils } from
'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');

function getRoleIcon() {
  const icons = {
    'Admissions Admin': UserPlus,
    'Doctor': Stethoscope,
    'Dietitian': Utensils,
    'Purchasing Officer': ShoppingCart,
    'Kitchen Staff': ChefHat,
    'Food Server': Utensils
  };
  return icons[authStore.selectedRole || ''] || Stethoscope;
}

function getRoleBadgeClass() {
  const classes = {
    'Admissions Admin': 'bg-blue-100 text-blue-800',
    'Doctor': 'bg-green-100 text-green-800',
    'Dietitian': 'bg-purple-100 text-purple-800',
    'Purchasing Officer': 'bg-orange-100 text-orange-800',
    'Kitchen Staff': 'bg-red-100 text-red-800',
    'Food Server': 'bg-cyan-100 text-cyan-800'
  };
  return classes[authStore.selectedRole || ''] || 'bg-gray-100 text-gray-800';
}

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
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const success = authStore.login(email.value, password.value, authStore.selectedRole);

  if (success) {
    // Navigate to appropriate portal
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
/* Mobile-specific adjustments */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
