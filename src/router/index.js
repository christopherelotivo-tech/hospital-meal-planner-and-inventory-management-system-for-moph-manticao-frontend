import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import HomePage from '@/views/HomePage.vue';
import RoleSelectionPage from '@/views/RoleSelectionPage.vue';
import LoginPage from '@/views/LoginPage.vue';
import AdmissionsPortal from '@/views/portals/AdmissionsPortal.vue';
import DoctorPortal from '@/views/portals/DoctorPortal.vue';
import DietitianPortal from '@/views/portals/DietitianPortal.vue';
import PurchasingOfficerPortal from '@/views/portals/PurchasingOfficerPortal.vue';
import KitchenStaffPortal from '@/views/portals/KitchenStaffPortal.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/select-role',
    name: 'RoleSelection',
    component: RoleSelectionPage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/admissions',
    name: 'AdmissionsPortal',
    component: AdmissionsPortal,
    meta: { requiresAuth: true, role: 'Admissions Admin' }
  },
  {
    path: '/doctor',
    name: 'DoctorPortal',
    component: DoctorPortal,
    meta: { requiresAuth: true, role: 'Doctor' }
  },
  {
    path: '/dietitian',
    name: 'DietitianPortal',
    component: DietitianPortal,
    meta: { requiresAuth: true, role: 'Dietitian' }
  },
  {
    path: '/purchasing-officer',
    name: 'PurchasingOfficerPortal',
    component: PurchasingOfficerPortal,
    meta: { requiresAuth: true, role: 'Purchasing Officer' }
  },
  {
    path: '/kitchen-staff',
    name: 'KitchenStaffPortal',
    component: KitchenStaffPortal,
    meta: { requiresAuth: true, role: 'Kitchen Staff' }
  },
  {
    path: '/food-server',
    name: 'FoodServerPortal',
    component: () => import('@/views/portals/FoodServerPortal.vue'),
    meta: { requiresAuth: true, role: 'Food Server' }
  }]

});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/select-role');
  } else if (to.meta.role && authStore.currentUser?.role !== to.meta.role) {
    next('/select-role');
  } else {
    next();
  }
});

export default router;