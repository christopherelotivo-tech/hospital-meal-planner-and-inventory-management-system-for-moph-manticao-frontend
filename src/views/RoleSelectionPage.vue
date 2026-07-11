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
      <!-- Back Button -->
      <button @click="goBack" class="flex items-center gap-1.5 text-gray-500 hover:text-[#2D5F3F] text-xs font-semibold mb-6 transition-colors group">
        <ArrowLeft :size="14" class="transition-transform group-hover:-translate-x-0.5" />
        <span>Back to Home</span>
      </button>

      <!-- Hospital Logo and Title -->
      <div class="flex flex-col items-center text-center mb-6">
        <img src="@/assets/hospital-seal.png" alt="MOPH Logo" class="h-14 w-14 mb-2" />
        <span class="font-dm-mono text-[10px] text-[#2D5F3F] font-bold uppercase tracking-widest">MOPH Manticao</span>
        <h2 class="font-caprasimo font-normal text-2xl md:text-3xl text-gray-900 mt-1">Select Role</h2>
        <p class="font-dm-sans text-xs text-gray-400 mt-1">Choose your role to access the system</p>
      </div>

      <!-- Portals List -->
      <div class="space-y-3">
        <!-- Admissions -->
        <button 
          @click="selectRole('Admissions Admin')" 
          class="w-full flex items-center gap-4 p-3.5 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/10 hover:shadow-md transition-all duration-300 group text-left"
        >
          <div class="bg-blue-50 text-blue-600 rounded-xl w-11 h-11 flex items-center justify-center shrink-0 transition-colors group-hover:bg-blue-600 group-hover:text-white">
            <UserPlus :size="18" />
          </div>
          <div>
            <h4 class="font-candal text-sm text-gray-800 font-bold group-hover:text-blue-700 transition-colors">Admissions Admin Portal</h4>
            <p class="font-dm-sans text-[10px] text-gray-400 mt-0.5">Patient Registration & User Management</p>
          </div>
        </button>

        <!-- Doctor -->
        <button 
          @click="selectRole('Doctor')" 
          class="w-full flex items-center gap-4 p-3.5 rounded-2xl border border-gray-100 hover:border-green-200 hover:bg-green-50/10 hover:shadow-md transition-all duration-300 group text-left"
        >
          <div class="bg-green-50 text-[#2D5F3F] rounded-xl w-11 h-11 flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#2D5F3F] group-hover:text-white">
            <Stethoscope :size="18" />
          </div>
          <div>
            <h4 class="font-candal text-sm text-gray-800 font-bold group-hover:text-[#2D5F3F] transition-colors">Doctor Portal</h4>
            <p class="font-dm-sans text-[10px] text-gray-400 mt-0.5">Manage Patients & Diet Prescriptions</p>
          </div>
        </button>

        <!-- Dietitian -->
        <button 
          @click="selectRole('Dietitian')" 
          class="w-full flex items-center gap-4 p-3.5 rounded-2xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/10 hover:shadow-md transition-all duration-300 group text-left"
        >
          <div class="bg-purple-50 text-purple-600 rounded-xl w-11 h-11 flex items-center justify-center shrink-0 transition-colors group-hover:bg-purple-600 group-hover:text-white">
            <Utensils :size="18" />
          </div>
          <div>
            <h4 class="font-candal text-sm text-gray-800 font-bold group-hover:text-purple-700 transition-colors">Dietitian Portal</h4>
            <p class="font-dm-sans text-[10px] text-gray-400 mt-0.5">Meal Assignment, Budgeting & Planning</p>
          </div>
        </button>

        <!-- Purchasing Officer -->
        <button 
          @click="selectRole('Purchasing Officer')" 
          class="w-full flex items-center gap-4 p-3.5 rounded-2xl border border-gray-100 hover:border-amber-200 hover:bg-amber-50/10 hover:shadow-md transition-all duration-300 group text-left"
        >
          <div class="bg-amber-50 text-amber-600 rounded-xl w-11 h-11 flex items-center justify-center shrink-0 transition-colors group-hover:bg-amber-600 group-hover:text-white">
            <ShoppingCart :size="18" />
          </div>
          <div>
            <h4 class="font-candal text-sm text-gray-800 font-bold group-hover:text-amber-700 transition-colors">Purchasing Officer Portal</h4>
            <p class="font-dm-sans text-[10px] text-gray-400 mt-0.5">Inventory Tracking & Stock Management</p>
          </div>
        </button>

        <!-- Kitchen Staff -->
        <button 
          @click="selectRole('Kitchen Staff')" 
          class="w-full flex items-center gap-4 p-3.5 rounded-2xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/10 hover:shadow-md transition-all duration-300 group text-left"
        >
          <div class="bg-orange-50 text-orange-600 rounded-xl w-11 h-11 flex items-center justify-center shrink-0 transition-colors group-hover:bg-orange-600 group-hover:text-white">
            <ChefHat :size="18" />
          </div>
          <div>
            <h4 class="font-candal text-sm text-gray-800 font-bold group-hover:text-orange-700 transition-colors">Kitchen Staff Portal</h4>
            <p class="font-dm-sans text-[10px] text-gray-400 mt-0.5">Production Schedules & Ingredient Preparation</p>
          </div>
        </button>

        <!-- Food Server -->
        <button 
          @click="selectRole('Food Server')" 
          class="w-full flex items-center gap-4 p-3.5 rounded-2xl border border-gray-100 hover:border-cyan-200 hover:bg-cyan-50/10 hover:shadow-md transition-all duration-300 group text-left"
        >
          <div class="bg-cyan-50 text-cyan-600 rounded-xl w-11 h-11 flex items-center justify-center shrink-0 transition-colors group-hover:bg-cyan-600 group-hover:text-white">
            <Utensils :size="18" />
          </div>
          <div>
            <h4 class="font-candal text-sm text-gray-800 font-bold group-hover:text-cyan-700 transition-colors">Food Server Portal</h4>
            <p class="font-dm-sans text-[10px] text-gray-400 mt-0.5">Ward Distribution & QR Verification</p>
          </div>
        </button>
      </div>

      <p class="font-dm-mono text-[9px] text-gray-400 mt-6 text-center uppercase tracking-wider">Secure Healthcare Access Portal</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import hospitalBg from '@/assets/hospital-building.jpg';
import {
  Stethoscope,
  UserPlus,
  ShoppingCart,
  ChefHat,
  Utensils,
  ArrowLeft
} from 'lucide-vue-next';

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
/* Scoped overrides for portal hover translation */
button {
  outline: none;
}
</style>
