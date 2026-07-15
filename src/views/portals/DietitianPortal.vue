<template>
  <BasePortalLayout ref="layoutRef" contentPaddingClass="p-6">
    <!-- Sidebar Header -->
    <template #sidebar-header="{ desktopSidebarOpen }">
      <div class="p-6 flex items-center space-x-3 whitespace-nowrap overflow-hidden transition-all duration-300" style="background: linear-gradient(135deg, #5a8f1c 0%, #a8d534 100%); box-shadow: inset 0 1px 0 rgba(255,255,255,0.32), inset 0 -1px 0 rgba(0,0,0,0.07), 0 4px 16px rgba(100,160,30,0.3); border-bottom: 1px solid rgba(255,255,255,0.22);">
        <img src="@/assets/hospital-seal.png" alt="Seal" class="w-10 h-10 object-contain shrink-0 transition-all duration-300" :class="{'mx-auto': !desktopSidebarOpen}" style="filter: drop-shadow(0 1px 3px rgba(0,0,0,0.2));" />
        <div class="transition-opacity duration-300" :class="{'opacity-0 w-0 hidden': !desktopSidebarOpen}">
          <h2 class="font-candal text-white text-sm leading-tight" style="text-shadow: 0 1px 3px rgba(0,0,0,0.25);">MOPH - Manticao</h2>
          <p class="font-dm-mono text-xs" style="color: rgba(255,255,255,0.85);">Dietitian Portal</p>
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
            currentModule === item.id ? 'bg-green-600 text-white shadow-sm' : 'text-gray-600 hover:bg-green-50 hover:text-green-700',
            desktopSidebarOpen ? 'space-x-3' : 'justify-center'
          ]"
          :title="!desktopSidebarOpen ? item.label : ''"
        >
          <component :is="item.icon" :size="18" class="shrink-0" />
          <span v-if="desktopSidebarOpen" class="font-candal">{{ item.label }}</span>
        </button>
      </nav>
    </template>

    <!-- Sidebar Footer -->
    <template #sidebar-footer="{ desktopSidebarOpen }">
      <div class="p-4 border-t border-gray-200">
        <button
          @click="handleLogout"
          class="w-full flex items-center rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium text-sm py-3"
          :class="desktopSidebarOpen ? 'space-x-3 px-4' : 'justify-center'"
          :title="!desktopSidebarOpen ? 'Logout' : ''"
        >
          <LogOut :size="18" />
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
      <h1 class="font-caprasimo text-lg font-bold">{{ getCurrentModuleTitle() }}</h1>
    </template>

    <!-- Top Bar Right -->
    <template #topbar-right>
      <NotificationBell role="Dietitian" color="purple" class="hidden md:block" />
      <div class="relative profile-dropdown-container hidden md:block">
        <button @click="profileMenuOpen = !profileMenuOpen" class="flex items-center space-x-4 focus:outline-none hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
          <div class="text-right hidden sm:block">
            <p class="font-dm-serif text-sm font-bold text-gray-800 leading-tight">{{ authStore.currentUser?.name || 'Dietitian Officer' }}</p>
            <p class="font-dm-mono text-xs text-gray-500">Dietitian</p>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden flex-shrink-0 font-bold" :class="{ 'ring-2 ring-green-600': profileMenuOpen }">
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
              <div class="w-12 h-12 rounded-full bg-green-50 text-green-700 flex items-center justify-center font-bold text-xl flex-shrink-0">
                {{ getInitials(authStore.currentUser?.name) }}
              </div>
              <div class="overflow-hidden">
                <p class="text-base font-bold text-gray-800 truncate">{{ authStore.currentUser?.name || 'Dietitian Officer' }}</p>
                <p class="text-sm text-gray-500 truncate">{{ authStore.currentUser?.email || 'dietitian@moph.gov.ph' }}</p>
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
      <NotificationBell role="Dietitian" color="purple" />
    </template>

    <!-- Main Content -->
    <component :is="getCurrentModuleComponent()" />
  </BasePortalLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { LayoutDashboard, Users, ClipboardList, CalendarDays, CalendarCheck, ChefHat, History, LogOut, ChevronDown } from 'lucide-vue-next';
import BasePortalLayout from '@/components/layout/BasePortalLayout.vue';
import NotificationBell from '@/components/NotificationBell.vue';
import DietitianDashboard from '@/components/dietitian/DietitianDashboard.vue';
import PatientProfiles from '@/components/dietitian/PatientProfiles.vue';
import PrescriptionsView from '@/components/dietitian/PrescriptionsView.vue';
import MealAssignmentScreen from '@/components/dietitian/MealAssignmentScreen.vue';
import MealCalendar from '@/components/dietitian/MealCalendar.vue';
import DishMenu from '@/components/dietitian/DishMenu.vue';
import MealServiceHistory from '@/components/dietitian/MealServiceHistory.vue';

const router = useRouter();
const authStore = useAuthStore();
const layoutRef = ref(null);

const currentModule = ref('dashboard');
const profileMenuOpen = ref(false);

function getInitials(name) {
  if (!name) return 'DN';
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
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'patients', label: 'Patient Profiles', icon: Users },
  { id: 'prescriptions', label: 'Diet Prescriptions', icon: ClipboardList },
  { id: 'meals', label: 'Meal Assignment', icon: CalendarDays },
  { id: 'calendar', label: 'Meal Calendar', icon: CalendarCheck },
  { id: 'dish-menu', label: 'Dish Menu', icon: ChefHat },
  { id: 'history', label: 'Service History', icon: History }
];

function selectModule(moduleId) {
  currentModule.value = moduleId;
  if (layoutRef.value) {
    layoutRef.value.closeMobileMenu();
  }
}

function getCurrentModuleTitle() {
  const titles = {
    dashboard: 'Dietitian Dashboard',
    patients: 'Patient Profiles',
    prescriptions: 'Diet Prescriptions',
    meals: 'Meal Assignment',
    calendar: 'Meal Calendar',
    'dish-menu': 'Dish Menu',
    history: 'Meal Service History'
  };
  return titles[currentModule.value] || 'Dashboard';
}

function getCurrentModuleDescription() {
  const descriptions = {
    dashboard: 'Overview and quick actions',
    patients: 'Clinical patient directory and dietary indicators',
    prescriptions: 'View active diet orders from doctors',
    meals: 'Plan and assign meals to patients',
    calendar: 'Monthly overview of patient meal schedules',
    'dish-menu': 'Manage hospital meal options and nutritional information',
    history: 'Complete audit trail of served meals'
  };
  return descriptions[currentModule.value] || '';
}

function getCurrentModuleComponent() {
  const components = {
    dashboard: DietitianDashboard,
    patients: PatientProfiles,
    prescriptions: PrescriptionsView,
    meals: MealAssignmentScreen,
    calendar: MealCalendar,
    'dish-menu': DishMenu,
    history: MealServiceHistory
  };
  return components[currentModule.value] || DietitianDashboard;
}

function handleLogout() {
  authStore.logout();
  router.push('/');
}
</script>
