<template>
  <div class="min-h-screen bg-[#f8f9fa] font-sans">
    <!-- Mobile Hamburger Menu -->
    <div class="md:hidden">
      <!-- Top Bar -->
      <div class="bg-white text-gray-800 p-4 flex items-center justify-between border-b border-gray-200">
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-gray-500 hover:text-gray-700">
          <Menu :size="24" />
        </button>
        <h1 class="text-lg font-bold">Admissions Admin</h1>
        <NotificationBell role="Admissions Admin" color="blue" />
      </div>

      <!-- Slide-out Menu -->
      <transition name="slide">
        <div v-if="mobileMenuOpen" class="fixed inset-0 z-50 bg-black bg-opacity-50" @click="mobileMenuOpen = false">
          <div class="w-64 h-full bg-white shadow-xl" @click.stop>
            <div class="p-6 border-b border-gray-100 flex items-center space-x-3">
              <img src="@/assets/hospital-seal.png" alt="Seal" class="w-10 h-10" />
              <div>
                <h2 class="text-sm font-bold text-[#008a61]">MOPH - Manticao</h2>
                <p class="text-xs text-gray-500">Admissions Portal</p>
              </div>
            </div>

            <nav class="p-4 space-y-1">
              <button
                v-for="item in menuItems"
                :key="item.id"
                @click="selectModule(item.id)"
                class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium"
                :class="currentModule === item.id ? 'bg-[#00a67e] text-white' : 'text-gray-600 hover:bg-gray-50'"
              >
                <component :is="item.icon" :size="18" />
                <span>{{ item.label }}</span>
              </button>

              <button
                @click="handleLogout"
                class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-4 text-sm font-medium"
              >
                <LogOut :size="18" />
                <span>Logout</span>
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
        class="bg-white shadow-[2px_0_8px_-3px_rgba(0,0,0,0.1)] flex flex-col z-10 border-r border-gray-100 transition-all duration-300"
        :class="desktopSidebarOpen ? 'w-64' : 'w-20'"
      >
        <!-- Header -->
        <div class="p-6 flex items-center space-x-3 border-b border-gray-50 whitespace-nowrap overflow-hidden">
          <img src="@/assets/hospital-seal.png" alt="Seal" class="w-10 h-10 object-contain shrink-0 transition-all duration-300" :class="{'mx-auto': !desktopSidebarOpen}" />
          <div class="transition-opacity duration-300" :class="{'opacity-0 w-0 hidden': !desktopSidebarOpen}">
            <h2 class="text-[#008a61] text-sm font-bold leading-tight">MOPH - Manticao</h2>
            <p class="text-xs text-gray-500">Admissions Portal</p>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-3 py-6 overflow-y-auto space-y-1.5 overflow-x-hidden">
          <button
            v-for="item in menuItems"
            :key="item.id"
            @click="selectModule(item.id)"
            class="w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium whitespace-nowrap"
            :class="[
              currentModule === item.id ? 'bg-[#00a67e] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              desktopSidebarOpen ? 'space-x-3' : 'justify-center'
            ]"
            :title="!desktopSidebarOpen ? item.label : ''"
          >
            <component :is="item.icon" :size="18" class="shrink-0" />
            <span v-if="desktopSidebarOpen">{{ item.label }}</span>
          </button>
        </nav>
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <!-- Top Bar -->
        <div class="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between shrink-0">
          <div class="flex items-center space-x-4">
            <button @click="desktopSidebarOpen = !desktopSidebarOpen" class="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors">
              <Menu :size="24" />
            </button>
            <div>
              <h1 class="text-xl font-bold text-gray-800 leading-tight">Admissions Admin</h1>
              <p class="text-xs text-gray-500">Patient Registration & Discharge Management</p>
            </div>
          </div>
          
          <div class="relative profile-dropdown-container">
            <button @click="profileMenuOpen = !profileMenuOpen" class="flex items-center space-x-4 focus:outline-none hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
              <div class="text-right hidden sm:block">
                <p class="text-sm font-bold text-gray-800 leading-tight">Admin Santos</p>
                <p class="text-xs text-gray-500">Admissions Admin</p>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden flex-shrink-0" :class="{ 'ring-2 ring-[#00a67e]': profileMenuOpen }">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=AdminSantos&backgroundColor=c0aede" alt="Avatar" class="w-full h-full object-cover" />
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
                  <div class="w-12 h-12 rounded-full bg-[#e0f2f1] text-[#00a67e] flex items-center justify-center font-bold text-xl flex-shrink-0">
                    A
                  </div>
                  <div class="overflow-hidden">
                    <p class="text-base font-bold text-gray-800 truncate">Admin Santos</p>
                    <p class="text-sm text-gray-500 truncate">admissions@moph.gov.ph</p>
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

        <!-- Module Content -->
        <div class="flex-1 overflow-y-auto p-8 bg-[#f8f9fa]">
          <div class="max-w-7xl mx-auto">
            <component :is="getCurrentModuleComponent()" @navigate="handleNavigate" />
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Content -->
    <div class="md:hidden overflow-y-auto h-[calc(100vh-64px)] bg-[#f8f9fa]">
      <div class="p-4">
        <component :is="getCurrentModuleComponent()" @navigate="handleNavigate" />
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import {
  Menu,
  LayoutDashboard,
  Users,
  FileText,
  UserCog,
  LogOut,
  ChevronDown } from
'lucide-vue-next';
import NotificationBell from '@/components/NotificationBell.vue';
import AdmissionsDashboard from '@/components/admissions/AdmissionsDashboard.vue';

import PatientList from '@/components/admissions/PatientList.vue';
import PatientRecords from '@/components/admissions/PatientRecords.vue';
import UserManagement from '@/components/admissions/UserManagement.vue';

const router = useRouter();
const authStore = useAuthStore();

const mobileMenuOpen = ref(false);
const currentModule = ref('dashboard');
const desktopSidebarOpen = ref(true);
const profileMenuOpen = ref(false);

function closeDropdown(e) {
  const target = e.target;
  if (!target.closest('.profile-dropdown-container')) {
    profileMenuOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});

// Updated to match the image precisely
const menuItems = [
{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
{ id: 'patients', label: 'Patients', icon: Users },
{ id: 'records', label: 'Records', icon: FileText },
{ id: 'user-management', label: 'User Management', icon: UserCog }];


function selectModule(moduleId) {
  currentModule.value = moduleId;
  mobileMenuOpen.value = false;
}

function handleNavigate(target) {
  if (target === 'register') {
    // In actual implementation, this might go to a sub-route or change state
    // For now, we'll just switch to the patients module as an example since we modified menu items
    selectModule('patients');
  } else if (target === 'patients') {
    selectModule('patients');
  }
}

function getCurrentModuleComponent() {
  const components = {
    dashboard: AdmissionsDashboard,
    patients: PatientList,
    records: PatientRecords,
    'user-management': UserManagement
  };
  return components[currentModule.value] || AdmissionsDashboard;
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
