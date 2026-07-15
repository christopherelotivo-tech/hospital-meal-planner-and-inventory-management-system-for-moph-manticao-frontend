<template>
  <BasePortalLayout ref="layoutRef" contentPaddingClass="p-6">
    <!-- Sidebar Header -->
    <template #sidebar-header="{ desktopSidebarOpen }">
      <div class="p-6 flex items-center space-x-3 whitespace-nowrap overflow-hidden transition-all duration-300" style="background: linear-gradient(135deg, #e65100 0%, #ffa726 100%); box-shadow: inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -1px 0 rgba(0,0,0,0.08), 0 4px 16px rgba(230,81,0,0.35); border-bottom: 1px solid rgba(255,255,255,0.18);">
        <img src="@/assets/hospital-seal.png" alt="Seal" class="w-10 h-10 object-contain shrink-0 transition-all duration-300" :class="{'mx-auto': !desktopSidebarOpen}" style="filter: drop-shadow(0 1px 3px rgba(0,0,0,0.25));" />
        <div class="transition-opacity duration-300" :class="{'opacity-0 w-0 hidden': !desktopSidebarOpen}">
          <h2 class="font-candal text-white text-sm leading-tight" style="text-shadow: 0 1px 3px rgba(0,0,0,0.2);">MOPH - Manticao</h2>
          <p class="font-dm-mono text-xs" style="color: rgba(255,255,255,0.8);">Food Server</p>
        </div>
      </div>
    </template>

    <!-- Sidebar Navigation -->
    <template #sidebar-nav="{ desktopSidebarOpen, closeMobile }">
      <nav class="flex-1 p-4 space-y-1.5">
        <button
          v-for="item in menuItems"
          :key="item.id"
          @click="selectModule(item.id); closeMobile && closeMobile()"
          class="w-full flex items-center transition-all duration-200 text-sm font-medium whitespace-nowrap rounded-lg"
          :class="[
            currentModule === item.id ? 'bg-amber-50 text-amber-700 shadow-sm ring-1 ring-amber-100' : 'text-gray-600 hover:bg-gray-50 hover:text-amber-600',
            desktopSidebarOpen ? 'space-x-3 px-4 py-3' : 'justify-center py-3 px-0'
          ]"
          :title="!desktopSidebarOpen ? item.label : ''"
        >
          <component :is="item.icon" :size="20" class="shrink-0" />
          <span v-if="desktopSidebarOpen" class="font-candal">{{ item.label }}</span>
        </button>
      </nav>
    </template>

    <!-- Sidebar Footer -->
    <template #sidebar-footer="{ desktopSidebarOpen }">
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
    </template>

    <!-- Top Bar Left -->
    <template #topbar-left>
      <h1 class="font-caprasimo text-xl text-gray-800 leading-tight">{{ getCurrentModuleTitle() }}</h1>
      <p class="font-dm-sans text-xs text-gray-500">{{ getCurrentModuleDescription() }}</p>
    </template>

    <!-- Mobile Topbar Title -->
    <template #mobile-topbar-title>
      <h1 class="brand-font text-lg font-bold">Food Server Portal</h1>
    </template>

    <!-- Top Bar Right -->
    <template #topbar-right>
      <NotificationBell role="Food Server" color="cyan" />
    </template>

    <!-- Mobile Topbar Right -->
    <template #mobile-topbar-right>
      <NotificationBell role="Food Server" color="cyan" />
    </template>

    <!-- Main Content -->
    <component :is="getCurrentModuleComponent()" />

    <!-- Bottom Navigation (Mobile Only) -->
    <div class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
      <div class="grid grid-cols-2 gap-1 p-2">
        <button
          @click="selectModule('list')"
          class="flex flex-col items-center py-2 rounded-lg transition-colors"
          :class="currentModule === 'list' ? 'bg-amber-100 text-amber-700' : 'text-gray-600'"
        >
          <List :size="20" />
          <span class="text-xs font-semibold mt-1">Distribution</span>
        </button>

        <button
          @click="selectModule('mobile')"
          class="flex flex-col items-center py-2 rounded-lg transition-colors"
          :class="currentModule === 'mobile' ? 'bg-amber-100 text-amber-700' : 'text-gray-600'"
        >
          <Smartphone :size="20" />
          <span class="text-xs font-semibold mt-1">Mobile</span>
        </button>
      </div>
    </div>
  </BasePortalLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { List, Smartphone, LogOut } from 'lucide-vue-next';
import BasePortalLayout from '@/components/layout/BasePortalLayout.vue';
import NotificationBell from '@/components/NotificationBell.vue';
import DistributionList from '@/components/foodServer/DistributionList.vue';
import MobileDistribution from '@/components/foodServer/MobileDistribution.vue';

const router = useRouter();
const authStore = useAuthStore();
const layoutRef = ref(null);

const currentModule = ref('list');

const menuItems = [
  { id: 'list', label: 'Distribution List', icon: List },
  { id: 'mobile', label: 'Mobile Distribution', icon: Smartphone }
];

function selectModule(moduleId) {
  currentModule.value = moduleId;
  if (layoutRef.value) {
    layoutRef.value.closeMobileMenu();
  }
}

function getCurrentModuleTitle() {
  const titles = {
    list: 'Distribution List',
    mobile: 'Mobile Distribution'
  };
  return titles[currentModule.value] || 'Distribution';
}

function getCurrentModuleDescription() {
  const descriptions = {
    list: 'View and manage meal distribution records',
    mobile: 'QR scanner and handheld mode for deliveries'
  };
  return descriptions[currentModule.value] || '';
}

function getCurrentModuleComponent() {
  const components = {
    list: DistributionList,
    mobile: MobileDistribution
  };
  return components[currentModule.value] || DistributionList;
}

function handleLogout() {
  authStore.logout();
  router.push('/select-role');
}
</script>
