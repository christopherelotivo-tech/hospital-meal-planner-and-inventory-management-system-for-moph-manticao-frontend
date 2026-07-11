<template>
  <div 
    class="min-h-screen relative overflow-hidden flex flex-col items-center justify-center"
    :style="{ backgroundImage: 'linear-gradient(rgba(34, 197, 94, 0.7), rgba(34, 197, 94, 0.7))' }"
  >
    <!-- Main Landing Page with Green Background and Hospital Building Background -->
    <!-- Hospital Building Background -->
    <div 
      class="absolute inset-0 -z-10"
      :style="{ backgroundImage: `url(${hospitalBg})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }"
    ></div>
    
    <!-- Hospital Seal Logo -->
    <div class="relative z-10 mb-8 animate-fade-in">
      <img src="@/assets/hospital-seal.png" alt="MOPH-Manticao Hospital Seal" class="w-40 h-40 mx-auto drop-shadow-2xl" />
    </div>

    <!-- Main Content -->
    <div class="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl">
      <!-- Main Title -->
      <h1 class="brand-font text-6xl sm:text-7xl font-bold text-white mb-4 drop-shadow-lg leading-tight">
        AI-Assisted<br />Hospital Meal Planner<br />and Inventory System
      </h1>

      <!-- Hospital Name -->
      <p class="text-xl sm:text-2xl text-white font-semibold mb-4 drop-shadow-md">
        Misamis Oriental Provincial Hospital - Manticao
      </p>

      <!-- Golden Divider -->
      <div class="w-32 h-1 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 mx-auto mb-6 rounded-full"></div>

      <!-- Tagline -->
      <p class="text-lg sm:text-xl text-yellow-300 italic font-semibold mb-8 drop-shadow-md">
        "Pag MOPH - Manticao ko, secure ka!"
      </p>

      <!-- Login Button -->
      <button 
        @click="goToRoleSelection"
        class="inline-block bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-12 py-4 rounded-full font-bold text-xl transition-all duration-300 hover:shadow-2xl active:scale-95 drop-shadow-lg"
      >
        LOGIN
      </button>
    </div>
  </div>
</template>

<script setup>

import { useRouter } from 'vue-router';
import hospitalBg from '@/assets/hospital-building.jpg';

const router = useRouter();

function goToRoleSelection() {
  router.push('/select-role');
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-out;
}
</style>
