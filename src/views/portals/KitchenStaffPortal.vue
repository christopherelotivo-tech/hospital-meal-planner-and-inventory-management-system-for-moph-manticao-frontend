<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile Hamburger Menu -->
    <div class="md:hidden">
      <!-- Top Bar -->
      <div class="bg-red-600 text-white p-4 flex items-center justify-between">
        <button @click="mobileMenuOpen = !mobileMenuOpen">
          <Menu :size="24" />
        </button>
        <h1 class="brand-font text-lg font-bold">Kitchen Staff Portal</h1>
        <NotificationBell role="Kitchen Staff" color="red" />
      </div>

      <!-- Bottom Navigation (Mobile Only) -->
      <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div class="grid grid-cols-2 gap-1 p-2">
          <button
            @click="selectModule('schedule')"
            class="flex flex-col items-center py-2 rounded-lg transition-colors"
            :class="currentModule === 'schedule' ? 'bg-red-100 text-red-700' : 'text-gray-600'"
          >
            <Calendar :size="20" />
            <span class="text-xs font-semibold mt-1">Schedule</span>
          </button>

          <button
            @click="selectModule('history')"
            class="flex flex-col items-center py-2 rounded-lg transition-colors"
            :class="currentModule === 'history' ? 'bg-red-100 text-red-700' : 'text-gray-600'"
          >
            <History :size="20" />
            <span class="text-xs font-semibold mt-1">History</span>
          </button>
        </div>
      </div>

      <!-- Slide-out Menu -->
      <transition name="slide">
        <div v-if="mobileMenuOpen" class="fixed inset-0 z-50 bg-black bg-opacity-50" @click="mobileMenuOpen = false">
          <div class="w-64 h-full bg-white shadow-xl" @click.stop>
            <div class="bg-red-600 text-white p-6">
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <ChefHat :size="24" />
                </div>
                <div>
                  <p class="font-bold">{{ authStore.currentUser?.name }}</p>
                  <p class="text-xs text-red-200">Kitchen Staff</p>
                </div>
              </div>
            </div>

            <nav class="p-4">
              <button
                v-for="item in menuItems"
                :key="item.id"
                @click="selectModule(item.id)"
                class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors"
                :class="currentModule === item.id ? 'bg-red-100 text-red-700' : 'text-gray-700 hover:bg-gray-100'"
              >
                <component :is="item.icon" :size="20" />
                <span class="font-semibold">{{ item.label }}</span>
              </button>

              <button
                @click="handleLogout"
                class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-4"
              >
                <LogOut :size="20" />
                <span class="font-semibold">Logout</span>
              </button>
            </nav>
          </div>
        </div>
      </transition>
    </div>

    <!-- Desktop Layout -->
    <div class="hidden md:flex h-screen">
      <!-- Sidebar -->
      <div class="w-64 bg-green-50 shadow-lg flex flex-col">
        <!-- Header -->
        <div class="bg-gradient-to-br from-red-600 to-red-500 text-white p-6">
          <div class="flex items-center space-x-3 mb-4">
            <img src="@/assets/hospital-seal.png" alt="Seal" class="w-12 h-12" />
            <div>
              <h2 class="brand-font text-lg font-bold">MOPH - Manticao</h2>
              <p class="text-xs text-red-200">Kitchen Staff</p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-4 overflow-y-auto">
          <button
            v-for="item in menuItems"
            :key="item.id"
            @click="selectModule(item.id)"
            class="w-full flex items-center space-x-3 px-8 py-3 rounded-lg mb-2 transition-all duration-200"
            :class="currentModule === item.id ? 'bg-red-100 text-red-700 shadow-md' : 'text-gray-700 hover:bg-gray-100'"
          >
            <component :is="item.icon" :size="20" />
            <span class="font-semibold">{{ item.label }}</span>
          </button>
        </nav>

        <!-- Footer -->
        <div class="p-4 border-t border-gray-200">
          <button
            @click="handleLogout"
            class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut :size="20" />
            <span class="font-semibold">Logout</span>
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 overflow-y-auto">
        <!-- Top Bar -->
        <div class="bg-white shadow-sm border-b border-gray-200 p-4 flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ getCurrentModuleTitle() }}</h1>
            <p class="text-sm text-gray-600">{{ getCurrentModuleDescription() }}</p>
          </div>
          <NotificationBell role="Kitchen Staff" color="red" />
        </div>

        <!-- Module Content -->
        <div class="p-6">
          <component :is="getCurrentModuleComponent()" />
        </div>
      </div>
    </div>

    <!-- Mobile Content -->
    <div class="md:hidden pb-20">
      <div class="p-4">
        <component :is="getCurrentModuleComponent()" />
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import {
  Menu,
  ChefHat,
  Calendar,
  History,
  LogOut } from
'lucide-vue-next';
import NotificationBell from '@/components/NotificationBell.vue';
import ProductionSchedule from '@/components/kitchenStaff/ProductionSchedule.vue';
import ProductionHistory from '@/components/kitchenStaff/ProductionHistory.vue';

const router = useRouter();
const authStore = useAuthStore();

const mobileMenuOpen = ref(false);
const currentModule = ref('schedule');

const menuItems = [
{ id: 'schedule', label: 'Production Schedule', icon: Calendar },
{ id: 'history', label: 'Production History', icon: History }];


function selectModule(moduleId) {
  currentModule.value = moduleId;
  mobileMenuOpen.value = false;
}

function getCurrentModuleTitle() {
  const titles = {
    schedule: 'Production Schedule',
    history: 'Production History'
  };
  return titles[currentModule.value] || 'Dashboard';
}

function getCurrentModuleDescription() {
  const descriptions = {
    schedule: 'Planned meal preparation schedule for today and upcoming days',
    history: 'Complete record of prepared and distributed meals'
  };
  return descriptions[currentModule.value] || '';
}

function getCurrentModuleComponent() {
  const components = {
    schedule: ProductionSchedule,
    history: ProductionHistory
  };
  return components[currentModule.value] || ProductionSchedule;
}

function handleLogout() {
  authStore.logout();
  router.push('/');
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}
</style>
