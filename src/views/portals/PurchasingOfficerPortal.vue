<template>
  <BasePortalLayout ref="layoutRef" contentPaddingClass="p-6 bg-gray-50/50">
    <!-- Sidebar Header -->
    <template #sidebar-header="{ desktopSidebarOpen }">
      <div class="p-6 flex items-center space-x-3 whitespace-nowrap overflow-hidden transition-all duration-300" style="background: linear-gradient(135deg, #4527a0 0%, #9575cd 100%); box-shadow: inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -1px 0 rgba(0,0,0,0.08), 0 4px 16px rgba(69,39,160,0.3); border-bottom: 1px solid rgba(255,255,255,0.18);">
        <img src="@/assets/hospital-seal.png" alt="Seal" class="w-10 h-10 object-contain shrink-0 transition-all duration-300" :class="{'mx-auto': !desktopSidebarOpen}" style="filter: drop-shadow(0 1px 3px rgba(0,0,0,0.25));" />
        <div class="transition-opacity duration-300" :class="{'opacity-0 w-0 hidden': !desktopSidebarOpen}">
          <h2 class="font-candal text-white text-sm leading-tight" style="text-shadow: 0 1px 3px rgba(0,0,0,0.2);">MOPH - Manticao</h2>
          <p class="font-dm-mono text-xs" style="color: rgba(255,255,255,0.8);">Purchasing Portal</p>
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
            currentModule === item.id ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600',
            desktopSidebarOpen ? 'space-x-3 px-4 py-3' : 'justify-center py-3 px-0'
          ]"
          :title="!desktopSidebarOpen ? item.label : ''"
        >
          <component :is="item.icon" :size="20" class="shrink-0" />
          <span v-if="desktopSidebarOpen" class="font-bold text-[13px] whitespace-normal leading-tight tracking-wide">{{ item.label }}</span>
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
      <h1 class="brand-font text-lg font-bold">Purchasing Officer Portal</h1>
    </template>

    <!-- Top Bar Right -->
    <template #topbar-right>
      <NotificationBell role="PurchasingOfficer" color="blue" class="hidden md:block" />
      <div class="relative profile-dropdown-container hidden md:block">
        <button @click="profileMenuOpen = !profileMenuOpen" class="flex items-center space-x-4 focus:outline-none hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
          <div class="text-right hidden sm:block">
            <p class="font-dm-serif text-sm font-bold text-gray-800 leading-tight">{{ authStore.currentUser?.name || 'Purchasing Officer' }}</p>
            <p class="font-dm-mono text-xs text-gray-500">Purchasing Officer</p>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden flex-shrink-0 font-bold" :class="{ 'ring-2 ring-blue-600': profileMenuOpen }">
              {{ getInitials(authStore.currentUser?.name) }}
            </div>
            <ChevronDown :size="16" class="text-gray-400 transition-transform duration-200" :class="{'rotate-180': profileMenuOpen}" />
          </div>
        </button>

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
                <p class="font-dm-serif text-base font-bold text-gray-800 truncate">{{ authStore.currentUser?.name || 'Purchasing Officer' }}</p>
                <p class="font-dm-mono text-sm text-gray-500 truncate">{{ authStore.currentUser?.email || 'purchasing@moph.gov.ph' }}</p>
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
      <NotificationBell role="PurchasingOfficer" color="blue" />
    </template>

    <!-- Main Content -->
    <component :is="getCurrentModuleComponent()" />

    <!-- Bottom Navigation (Mobile Only) -->
    <div class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
      <div class="grid grid-cols-3 gap-1 p-2">
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

        <button
          @click="selectModule('purchaseOrders')"
          class="flex flex-col items-center py-2 rounded-lg transition-colors"
          :class="currentModule === 'purchaseOrders' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'"
        >
          <ClipboardList :size="20" />
          <span class="text-xs font-semibold mt-1">Orders</span>
        </button>
      </div>
    </div>

  </BasePortalLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { LayoutDashboard, Package, ClipboardList, LogOut, ChevronDown } from 'lucide-vue-next';
import BasePortalLayout from '@/components/layout/BasePortalLayout.vue';
import NotificationBell from '@/components/NotificationBell.vue';
import PurchasingOfficerDashboard from '@/components/purchasingOfficer/PurchasingOfficerDashboard.vue';
import StockMovementLog from '@/components/purchasingOfficer/StockMovementLog.vue';
import PurchaseOrders from '@/components/purchasingOfficer/PurchaseOrders.vue';

const router = useRouter();
const authStore = useAuthStore();
const layoutRef = ref(null);

const currentModule = ref('dashboard');
const profileMenuOpen = ref(false);

function getInitials(name) {
  if (!name) return 'PO';
  return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
}

function closeDropdown(e) {
  const target = e.target;
  if (!target.closest('.profile-dropdown-container')) {
    profileMenuOpen.value = false;
  }
}

onMounted(() => { document.addEventListener('click', closeDropdown); });
onUnmounted(() => { document.removeEventListener('click', closeDropdown); });

const menuItems = [
  { id: 'dashboard', label: 'Inventory Dashboard', icon: LayoutDashboard },
  { id: 'stock', label: 'Stock Movement Log', icon: Package },
  { id: 'purchaseOrders', label: 'Purchase Orders', icon: ClipboardList }
];

function selectModule(moduleId) {
  currentModule.value = moduleId;
  if (layoutRef.value) {
    layoutRef.value.closeMobileMenu();
  }
}

function getCurrentModuleTitle() {
  const titles = {
    dashboard: 'Inventory Dashboard',
    stock: 'Stock Movement Log',
    purchaseOrders: 'Purchase Orders'
  };
  return titles[currentModule.value] || 'Dashboard';
}

function getCurrentModuleDescription() {
  const descriptions = {
    dashboard: 'Overview of inventory levels and stock status',
    stock: 'Track all incoming and outgoing stock movements',
    purchaseOrders: 'Manage and track all procurement purchase orders'
  };
  return descriptions[currentModule.value] || '';
}

function getCurrentModuleComponent() {
  const components = {
    dashboard: PurchasingOfficerDashboard,
    stock: StockMovementLog,
    purchaseOrders: PurchaseOrders
  };
  return components[currentModule.value] || PurchasingOfficerDashboard;
}

function handleLogout() {
  authStore.logout();
  router.push('/');
}
</script>
