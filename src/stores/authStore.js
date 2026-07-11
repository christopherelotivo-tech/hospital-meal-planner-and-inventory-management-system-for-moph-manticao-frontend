import { defineStore } from 'pinia';
import { ref } from 'vue';
















export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(null);
  const selectedRole = ref(null);
  const isAuthenticated = ref(false);

  function selectRole(role) {
    selectedRole.value = role;
  }

  function login(email, password, role) {
    // Mock login - In real app, this would call an API
    const mockUsers = {
      'admin@hospital.com': { name: 'Maria Santos', email: 'admin@hospital.com', role: 'Admissions Admin' },
      'doctor@hospital.com': { name: 'Dr. Santos', email: 'doctor@hospital.com', role: 'Doctor' },
      'dietitian@hospital.com': { name: 'Ana Reyes', email: 'dietitian@hospital.com', role: 'Dietitian' },
      'purchasing@hospital.com': { name: 'Pedro Garcia', email: 'purchasing@hospital.com', role: 'Purchasing Officer' },
      'kitchen@hospital.com': { name: 'Rosa Lopez', email: 'kitchen@hospital.com', role: 'Kitchen Staff' },
      'server@hospital.com': { name: 'Carlos Diaz', email: 'server@hospital.com', role: 'Food Server' }
    };

    const user = mockUsers[email];
    if (user && user.role === role && password === 'password') {
      currentUser.value = {
        id: Math.random().toString(36).substr(2, 9),
        ...user
      };
      isAuthenticated.value = true;
      return true;
    }
    return false;
  }

  function logout() {
    currentUser.value = null;
    selectedRole.value = null;
    isAuthenticated.value = false;
  }

  return {
    currentUser,
    selectedRole,
    isAuthenticated,
    selectRole,
    login,
    logout
  };
});