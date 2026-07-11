<template>
  <div class="min-h-screen flex bg-gray-50">
    <!-- Left branding panel -->
    <div class="hidden lg:flex w-1/2 bg-green-600 relative items-center justify-center p-12">
      <div class="absolute inset-0 bg-[url('/src/assets/hospital-building.jpg')] bg-cover bg-center opacity-20"></div>
      <div class="relative z-10 text-center w-3/4 text-white">
        <div class="flex justify-center mb-6">
          <img src="@/assets/hospital-seal.png" alt="Hospital Seal" class="w-28 h-28" />
        </div>
        <h1 class="brand-font text-4xl font-extrabold mb-2 text-white">Misamis Oriental Provincial Hospital</h1>
        <h2 class="brand-font text-yellow-300 font-semibold mb-6">MANTICAO</h2>
        <p class="text-sm text-white/90">AI-Assisted Hospital Meal Planner and Inventory System</p>
        <p class="text-sm text-white/80 mt-2">Streamlining patient nutrition care through collaborative healthcare management</p>
      </div>
    </div>

    <!-- Right selection panel -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6">
      <div class="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 lg:p-8">
        <button @click="goBack" class="text-gray-500 text-sm flex items-center space-x-2 mb-4">
          <ArrowLeft :size="16" />
          <span>Back to Home</span>
        </button>

        <h3 class="text-2xl font-semibold text-gray-900 mb-1">Select Portal</h3>
        <p class="text-sm text-gray-500 mb-6">Choose your role to access the system</p>

        <nav class="space-y-4">
          <button @click="selectRole('Admissions Admin')" class="portal-item flex items-start space-x-4 w-full p-4 rounded-lg border border-green-200 hover:shadow">
            <div class="icon bg-green-50 text-green-600 rounded-md w-12 h-12 flex items-center justify-center">
              <UserPlus :size="20" />
            </div>
            <div class="text-left">
              <div class="font-medium text-gray-900">Admissions Portal</div>
              <div class="text-xs text-gray-500">Patient Registration & Discharge Management</div>
            </div>
          </button>

          <button @click="selectRole('Doctor')" class="portal-item flex items-start space-x-4 w-full p-4 rounded-lg border border-blue-200 hover:shadow">
            <div class="icon bg-blue-50 text-blue-600 rounded-md w-12 h-12 flex items-center justify-center">
              <Stethoscope :size="20" />
            </div>
            <div class="text-left">
              <div class="font-medium text-gray-900">Doctor Portal</div>
              <div class="text-xs text-gray-500">Diagnose & Approve Meal Plans</div>
            </div>
          </button>

          <button @click="selectRole('Dietitian')" class="portal-item flex items-start space-x-4 w-full p-4 rounded-lg border border-green-100 hover:shadow">
            <div class="icon bg-emerald-50 text-emerald-600 rounded-md w-12 h-12 flex items-center justify-center">
              <Utensils :size="20" />
            </div>
            <div class="text-left">
              <div class="font-medium text-gray-900">Dietitian Portal</div>
              <div class="text-xs text-gray-500">Meal Planning & Inventory Management</div>
            </div>
          </button>

          <button @click="selectRole('Purchasing Officer')" class="portal-item flex items-start space-x-4 w-full p-4 rounded-lg border border-yellow-200 hover:shadow">
            <div class="icon bg-yellow-50 text-yellow-600 rounded-md w-12 h-12 flex items-center justify-center">
              <ShoppingCart :size="20" />
            </div>
            <div class="text-left">
              <div class="font-medium text-gray-900">Purchasing Officer Portal</div>
              <div class="text-xs text-gray-500">Inventory & Procurement Management</div>
            </div>
          </button>

          <button @click="selectRole('Kitchen Staff')" class="portal-item flex items-start space-x-4 w-full p-4 rounded-lg border border-orange-200 hover:shadow">
            <div class="icon bg-orange-50 text-orange-600 rounded-md w-12 h-12 flex items-center justify-center">
              <ChefHat :size="20" />
            </div>
            <div class="text-left">
              <div class="font-medium text-gray-900">Kitchen Staff Portal</div>
              <div class="text-xs text-gray-500">Meal Production & Preparation</div>
            </div>
          </button>

          <button @click="selectRole('Food Server')" class="portal-item flex items-start space-x-4 w-full p-4 rounded-lg border border-violet-200 hover:shadow">
            <div class="icon bg-violet-50 text-violet-600 rounded-md w-12 h-12 flex items-center justify-center">
              <Utensils :size="20" />
            </div>
            <div class="text-left">
              <div class="font-medium text-gray-900">Food Server Portal</div>
              <div class="text-xs text-gray-500">Meal Distribution & Delivery</div>
            </div>
          </button>
        </nav>

        <p class="text-xs text-gray-400 mt-6 text-center">Secure access to healthcare nutrition services</p>
      </div>
    </div>
  </div>
</template>

<script setup>

import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import {
  Stethoscope,
  UserPlus,
  ShoppingCart,
  ChefHat,
  Utensils,
  ArrowLeft } from
'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

function selectRole(role) {
  authStore.selectRole(role);
  router.push('/login');
}

function goBack() {
  router.push('/');
}
</script>

<style scoped>
.portal-item {
  transition: box-shadow .15s, transform .12s;
}
.portal-item:hover {
  transform: translateY(-3px);
}
@media (max-width: 1024px) {
  .hidden.lg\:flex {
    display: none !important;
  }
}
</style>
