<template>
  <div class="space-y-6 max-w-full overflow-hidden pb-8">
    <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col min-h-[calc(100vh-200px)]">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h2 class="text-xl font-bold text-gray-800">User Account Management</h2>
        <button @click="openCreateModal" class="bg-[#00a67e] hover:bg-[#008a61] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center justify-center space-x-2 shrink-0">
          <Plus :size="18" />
          <span>Create New User</span>
        </button>
      </div>
      
      <!-- User List -->
      <div class="space-y-4 flex-1">
        <div 
          v-for="user in users" 
          :key="user.id"
          @click="editUser(user)"
          class="border border-gray-100 rounded-xl p-5 hover:bg-gray-50 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between shadow-sm"
        >
          <!-- User Info -->
          <div class="flex items-center space-x-5">
            <div v-if="user.photo" class="w-12 h-12 rounded-full shrink-0 overflow-hidden border border-gray-100">
              <img :src="user.photo" alt="Profile" class="w-full h-full object-cover" />
            </div>
            <div 
              v-else
              class="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
              :class="getAvatarColor(user.name)"
            >
              {{ getInitials(user.name) }}
            </div>
            <div>
              <h3 class="text-[15px] font-bold text-gray-800">{{ user.name }}</h3>
              <p class="text-[13px] text-gray-500 mt-0.5">{{ user.role }} • {{ user.email }}</p>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="mt-4 md:mt-0 flex items-center space-x-6 md:space-x-8 justify-end border-t md:border-t-0 border-gray-100 pt-3 md:pt-0 shrink-0">
            <button @click.stop="editUser(user)" class="text-[#00a67e] hover:text-[#008a61] p-1.5 rounded-lg hover:bg-[#e6f4f1] transition-colors" title="Edit User">
              <Edit2 :size="18" />
            </button>
            <button @click.stop="resetPassword(user)" class="text-[13px] font-medium text-gray-500 hover:text-gray-800 transition-colors">
              Reset Password
            </button>
          </div>
        </div>

        <div v-if="users.length === 0" class="p-12 text-center border border-gray-100 rounded-xl bg-gray-50/50">
          <p class="text-gray-500">No users found.</p>
        </div>
      </div>
    </div>

    <!-- User Modal -->
    <UserModal 
      :show="showModal"
      :userToEdit="selectedUser"
      @close="closeModal"
      @saved="handleSaved"
    />
  </div>
</template>

<script setup>

import { ref, computed } from 'vue';
import { useDataStore } from '@/stores/dataStore';

import { Plus, Edit2 } from 'lucide-vue-next';
import UserModal from './UserModal.vue';

const dataStore = useDataStore();

const users = computed(() => {
  return dataStore.users;
});

const showModal = ref(false);
const selectedUser = ref(null);

function getInitials(name) {
  if (!name) return 'U';
  // Remove titles like Dr.
  const cleanName = name.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.)\s+/i, '');
  const parts = cleanName.split(' ').filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const colorPairs = [
'bg-[#ccfbf1] text-[#0f766e]', // teal
'bg-[#dcfce7] text-[#15803d]', // green
'bg-[#e0f2fe] text-[#0369a1]', // sky
'bg-[#ffedd5] text-[#c2410c]', // orange
'bg-[#f3e8ff] text-[#7e22ce]', // purple
'bg-[#fee2e2] text-[#b91c1c]', // red
'bg-[#fef9c3] text-[#a16207]' // yellow
];

function getAvatarColor(name) {
  if (!name) return colorPairs[0];
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return colorPairs[sum % colorPairs.length];
}

function openCreateModal() {
  selectedUser.value = null;
  showModal.value = true;
}

function editUser(user) {
  selectedUser.value = user;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  selectedUser.value = null;
}

function handleSaved() {
  closeModal();
}

function resetPassword(user) {
  alert(`Password reset link sent to ${user.email}`);
}
</script>
