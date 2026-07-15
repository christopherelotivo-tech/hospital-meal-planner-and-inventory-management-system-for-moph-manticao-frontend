<template>
  <BasePortalLayout ref="layoutRef">
    <!-- Sidebar Header (Gradient Box) -->
    <template #sidebar-header="{ desktopSidebarOpen }">
      <div class="p-6 flex items-center space-x-3 whitespace-nowrap overflow-hidden transition-all duration-300" style="background: linear-gradient(135deg, #007a5e 0%, #00c49a 100%); box-shadow: inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -1px 0 rgba(0,0,0,0.08), 0 4px 16px rgba(0,150,120,0.3); border-bottom: 1px solid rgba(255,255,255,0.18);">
        <img src="@/assets/hospital-seal.png" alt="Seal" class="w-10 h-10 object-contain shrink-0 transition-all duration-300" :class="{'mx-auto': !desktopSidebarOpen}" style="filter: drop-shadow(0 1px 3px rgba(0,0,0,0.25));" />
        <div class="transition-opacity duration-300" :class="{'opacity-0 w-0 hidden': !desktopSidebarOpen}">
          <h2 class="font-candal text-white text-sm leading-tight" style="text-shadow: 0 1px 3px rgba(0,0,0,0.2);">MOPH - Manticao</h2>
          <p class="font-dm-mono text-xs" style="color: rgba(255,255,255,0.8);">Admissions Portal</p>
        </div>
      </div>
    </template>

    <!-- Sidebar Navigation -->
    <template #sidebar-nav="{ desktopSidebarOpen, closeMobile }">
      <nav class="flex-1 px-3 py-6 space-y-1.5">
        <button
          v-for="item in menuItems"
          :key="item.id"
          @click="selectModule(item.id); closeMobile && closeMobile()"
          class="w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium whitespace-nowrap"
          :class="[
            currentModule === item.id ? 'bg-[#00a67e] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            desktopSidebarOpen ? 'space-x-3' : 'justify-center'
          ]"
          :title="!desktopSidebarOpen ? item.label : ''"
        >
          <component :is="item.icon" :size="18" class="shrink-0" />
          <span v-if="desktopSidebarOpen" class="font-candal">{{ item.label }}</span>
        </button>
        <!-- Mobile only logout -->
        <button
          @click="handleLogout"
          class="md:hidden w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-4 text-sm font-medium"
        >
          <LogOut :size="18" />
          <span>Logout</span>
        </button>
      </nav>
    </template>

    <!-- Top Bar Left -->
    <template #topbar-left>
      <h1 class="font-caprasimo text-xl text-gray-800 leading-tight">Admissions Admin</h1>
      <p class="font-dm-sans text-xs text-gray-500">Patient Registration & Discharge Management</p>
    </template>

    <!-- Mobile Topbar Title -->
    <template #mobile-topbar-title>
      <h1 class="text-lg font-bold">Admissions Admin</h1>
    </template>

    <!-- Top Bar Right -->
    <template #topbar-right>
      <NotificationBell role="Admissions Admin" color="blue" class="hidden md:block" />
      <div class="relative profile-dropdown-container hidden md:block">
        <button @click="profileMenuOpen = !profileMenuOpen" class="flex items-center space-x-4 focus:outline-none hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
          <div class="text-right hidden sm:block">
            <p class="font-dm-serif text-sm font-bold text-gray-800 leading-tight">Admin Santos</p>
            <p class="font-dm-mono text-xs text-gray-500">Admissions Admin</p>
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
                <p class="font-dm-serif text-base font-bold text-gray-800 truncate">Admin Santos</p>
                <p class="font-dm-mono text-sm text-gray-500 truncate">admissions@moph.gov.ph</p>
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
    </template>

    <!-- Mobile Topbar Right -->
    <template #mobile-topbar-right>
      <NotificationBell role="Admissions Admin" color="blue" />
    </template>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto h-full">
      <component :is="getCurrentModuleComponent()" @navigate="handleNavigate" />
    </div>
  </BasePortalLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { LayoutDashboard, Users, FileText, UserCog, LogOut, ChevronDown } from 'lucide-vue-next';
import BasePortalLayout from '@/components/layout/BasePortalLayout.vue';
import NotificationBell from '@/components/NotificationBell.vue';
import AdmissionsDashboard from '@/components/admissions/AdmissionsDashboard.vue';
import PatientList from '@/components/admissions/PatientList.vue';
import PatientRecords from '@/components/admissions/PatientRecords.vue';
import UserManagement from '@/components/admissions/UserManagement.vue';

const router = useRouter();
const authStore = useAuthStore();
const layoutRef = ref(null);

const currentModule = ref('dashboard');
const profileMenuOpen = ref(false);

function closeDropdown(e) {
  const target = e.target;
  if (!target.closest('.profile-dropdown-container')) {
    profileMenuOpen.value = false;
  }
}

onMounted(() => { document.addEventListener('click', closeDropdown); });
onUnmounted(() => { document.removeEventListener('click', closeDropdown); });

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'patients', label: 'Patients', icon: Users },
  { id: 'records', label: 'Records', icon: FileText },
  { id: 'user-management', label: 'User Management', icon: UserCog }
];

function selectModule(moduleId) {
  currentModule.value = moduleId;
  if (layoutRef.value) {
    layoutRef.value.closeMobileMenu();
  }
}

function handleNavigate(target) {
  if (target === 'register' || target === 'patients') {
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
