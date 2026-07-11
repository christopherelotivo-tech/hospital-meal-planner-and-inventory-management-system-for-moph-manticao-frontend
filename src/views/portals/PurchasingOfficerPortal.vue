<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile Hamburger Menu -->
    <div class="md:hidden">
      <!-- Top Bar -->
      <div class="bg-blue-600 text-white p-4 flex items-center justify-between">
        <button @click="mobileMenuOpen = !mobileMenuOpen">
          <Menu :size="24" />
        </button>
        <h1 class="brand-font text-lg font-bold">Purchasing Officer Portal</h1>
        <NotificationBell role="PurchasingOfficer" color="blue" />
      </div>

      <!-- Bottom Navigation (Mobile Only) -->
      <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div class="grid grid-cols-2 gap-1 p-2">
          <button
            @click="selectModule('dashboard')"
            class="flex flex-col items-center py-2 rounded-lg transition-colors"
            :class="currentModule === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'"
          >
            <LayoutDashboard :size="20" />
            <span class="text-xs font-semibold mt-1">Dashboard</span>
          </button>

          <button
            @click="selectModule('stock')"
            class="flex flex-col items-center py-2 rounded-lg transition-colors"
            :class="currentModule === 'stock' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'"
          >
            <Package :size="20" />
            <span class="text-xs font-semibold mt-1">Stock Log</span>
          </button>
        </div>
      </div>

      <!-- Slide-out Menu -->
      <transition name="slide">
        <div v-if="mobileMenuOpen" class="fixed inset-0 z-50 bg-black bg-opacity-50" @click="mobileMenuOpen = false">
          <div class="w-64 h-full bg-white shadow-xl" @click.stop>
            <div class="bg-blue-600 text-white p-6">
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <ShoppingCart :size="24" />
                </div>
                <div>
                  <p class="font-bold">{{ authStore.currentUser?.name }}</p>
                  <p class="text-xs text-blue-200">Purchasing Officer</p>
                </div>
              </div>
            </div>

            <nav class="p-4">
              <button
                v-for="item in menuItems"
                :key="item.id"
                @click="selectModule(item.id)"
                class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors"
                :class="currentModule === item.id ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
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
    <div class="hidden md:flex h-screen overflow-hidden">
      <!-- Sidebar -->
      <div 
        class="bg-white shadow-[2px_0_8px_-3px_rgba(0,0,0,0.1)] border-r border-gray-100 flex flex-col z-10 transition-all duration-300"
        :class="desktopSidebarOpen ? 'w-64' : 'w-20'"
      >
        <!-- Header -->
        <div class="p-6 flex items-center space-x-3 border-b border-gray-55 whitespace-nowrap overflow-hidden transition-all duration-300">
          <img src="@/assets/hospital-seal.png" alt="Seal" class="w-10 h-10 object-contain shrink-0 transition-all duration-300" :class="{'mx-auto': !desktopSidebarOpen}" />
          <div class="transition-opacity duration-300" :class="{'opacity-0 w-0 hidden': !desktopSidebarOpen}">
            <h2 class="text-blue-600 text-sm font-bold leading-tight">MOPH - Manticao</h2>
            <p class="text-xs text-gray-500">Purchasing Portal</p>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-4 overflow-y-auto space-y-1.5 overflow-x-hidden">
          <button
            v-for="item in menuItems"
            :key="item.id"
            @click="selectModule(item.id)"
            class="w-full flex items-center transition-all duration-200 text-sm font-medium whitespace-nowrap rounded-lg"
            :class="[
              currentModule === item.id ? 'bg-blue-100 text-blue-700 shadow-md' : 'text-gray-700 hover:bg-gray-100',
              desktopSidebarOpen ? 'space-x-3 px-8 py-3' : 'justify-center py-3 px-0'
            ]"
            :title="!desktopSidebarOpen ? item.label : ''"
          >
            <component :is="item.icon" :size="20" class="shrink-0" />
            <span v-if="desktopSidebarOpen" class="font-semibold">{{ item.label }}</span>
          </button>
        </nav>

        <!-- Footer -->
        <div class="p-4 border-t border-gray-200 overflow-hidden">
          <button
            @click="handleLogout"
            class="w-full flex items-center transition-colors text-red-600 hover:bg-red-50 rounded-lg text-sm font-semibold"
            :class="desktopSidebarOpen ? 'space-x-3 px-4 py-3' : 'justify-center py-3 px-0'"
            :title="!desktopSidebarOpen ? 'Logout' : ''"
          >
            <LogOut :size="20" class="shrink-0" />
            <span v-if="desktopSidebarOpen">Logout</span>
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <!-- Top Bar -->
        <div class="bg-white border-b border-gray-150 px-8 py-4 flex items-center justify-between shrink-0">
          <div class="flex items-center space-x-4">
            <button @click="desktopSidebarOpen = !desktopSidebarOpen" class="text-gray-400 hover:text-gray-650 focus:outline-none transition-colors p-1 hover:bg-gray-50 rounded-lg">
              <Menu :size="24" />
            </button>
            <div>
              <h1 class="text-xl font-bold text-gray-800 leading-tight">{{ getCurrentModuleTitle() }}</h1>
              <p class="text-xs text-gray-500">{{ getCurrentModuleDescription() }}</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-6">
            <NotificationBell role="PurchasingOfficer" color="blue" />
            
            <div class="relative profile-dropdown-container">
              <button @click="profileMenuOpen = !profileMenuOpen" class="flex items-center space-x-4 focus:outline-none hover:bg-gray-55 p-1.5 rounded-lg transition-colors">
                <div class="text-right hidden sm:block">
                  <p class="text-sm font-bold text-gray-800 leading-tight">{{ authStore.currentUser?.name || 'Purchasing Officer' }}</p>
                  <p class="text-xs text-gray-500">Purchasing Officer</p>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden flex-shrink-0 font-bold" :class="{ 'ring-2 ring-blue-600': profileMenuOpen }">
                    {{ getInitials(authStore.currentUser?.name) }}
                  </div>
                  <ChevronDown :size="16" class="text-gray-400 transition-transform duration-200" :class="{'rotate-180': profileMenuOpen}" />
                </div>
              </button>

              <!-- Dropdown Menu -->
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div v-if="profileMenuOpen" class="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 z-50 overflow-hidden">
                  <div class="px-5 py-4 border-b border-gray-50 flex items-center space-x-3">
                    <div class="w-12 h-12 rounded-full bg-blue-100 text-blue-650 flex items-center justify-center font-bold text-xl flex-shrink-0">
                      {{ getInitials(authStore.currentUser?.name) }}
                    </div>
                    <div class="overflow-hidden">
                      <p class="text-base font-bold text-gray-800 truncate">{{ authStore.currentUser?.name || 'Purchasing Officer' }}</p>
                      <p class="text-sm text-gray-500 truncate">{{ authStore.currentUser?.email || 'purchasing@moph.gov.ph' }}</p>
                    </div>
                  </div>
                  <div class="p-2">
                    <button @click="handleLogout" class="w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-2 transition-colors font-medium">
                      <LogOut :size="18" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <!-- Module Content -->
        <div class="flex-1 overflow-y-auto p-6 bg-gray-50/50">
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
  ShoppingCart,
  LayoutDashboard,
  Package,
  LogOut,
  ChevronDown } from
'lucide-vue-next';
import NotificationBell from '@/components/NotificationBell.vue';
import PurchasingOfficerDashboard from '@/components/purchasingOfficer/PurchasingOfficerDashboard.vue';
import StockMovementLog from '@/components/purchasingOfficer/StockMovementLog.vue';

const router = useRouter();
const authStore = useAuthStore();

const mobileMenuOpen = ref(false);
const desktopSidebarOpen = ref(true);
const profileMenuOpen = ref(false);
const currentModule = ref('dashboard');

function getInitials(name) {
  if (!name) return 'PO';
  return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
}

const menuItems = [
{ id: 'dashboard', label: 'Inventory Dashboard', icon: LayoutDashboard },
{ id: 'stock', label: 'Stock Movement Log', icon: Package }];


function selectModule(moduleId) {
  currentModule.value = moduleId;
  mobileMenuOpen.value = false;
}

function getCurrentModuleTitle() {
  const titles = {
    dashboard: 'Inventory Dashboard',
    stock: 'Stock Movement Log'
  };
  return titles[currentModule.value] || 'Dashboard';
}

function getCurrentModuleDescription() {
  const descriptions = {
    dashboard: 'Overview of inventory levels and stock status',
    stock: 'Track all incoming and outgoing stock movements'
  };
  return descriptions[currentModule.value] || '';
}

function getCurrentModuleComponent() {
  const components = {
    dashboard: PurchasingOfficerDashboard,
    stock: StockMovementLog
  };
  return components[currentModule.value] || PurchasingOfficerDashboard;
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
