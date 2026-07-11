<template>
  <div class="relative">
    <button 
      @click="toggleDropdown"
      class="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      :class="dropdownOpen ? 'bg-gray-100' : ''"
    >
      <Bell :size="24" :class="getColorClass()" />
      <span 
        v-if="unreadCount > 0" 
        class="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
        :class="getBadgeClass()"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <!-- Dropdown -->
    <transition name="dropdown">
      <div 
        v-if="dropdownOpen" 
        class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
      >
        <div class="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="font-bold text-gray-900">Notifications</h3>
          <span class="text-xs text-gray-500">{{ unreadCount }} unread</span>
        </div>

        <div class="max-h-96 overflow-y-auto">
          <div v-if="roleNotifications.length === 0" class="p-8 text-center text-gray-500">
            <Bell :size="48" class="mx-auto mb-2 text-gray-300" />
            <p>No notifications</p>
          </div>

          <button
            v-for="notification in roleNotifications"
            :key="notification.id"
            @click="markAsRead(notification.id)"
            class="w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left"
            :class="!notification.read ? 'bg-blue-50' : ''"
          >
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0 mt-1">
                <div 
                  class="w-2 h-2 rounded-full"
                  :class="notification.read ? 'bg-gray-300' : getBadgeClass()"
                ></div>
              </div>
              <div class="flex-1">
                <p class="text-sm text-gray-900" :class="!notification.read ? 'font-semibold' : ''">
                  {{ notification.message }}
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  {{ formatTime(notification.createdAt) }}
                </p>
              </div>
            </div>
          </button>
        </div>

        <div class="p-3 border-t border-gray-200">
          <button 
            @click="markAllAsRead"
            class="w-full text-center text-sm font-semibold hover:underline"
            :class="getTextColorClass()"
          >
            Mark all as read
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>

import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useDataStore } from '@/stores/dataStore';
import { Bell } from 'lucide-vue-next';






const props = defineProps();

const dataStore = useDataStore();
const dropdownOpen = ref(false);

const roleNotifications = computed(() => {
  return dataStore.notifications.
  filter((n) => n.recipientRole === props.role).
  sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
});

const unreadCount = computed(() => {
  return dataStore.getUnreadNotificationsCount(props.role);
});

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

function markAsRead(id) {
  dataStore.markNotificationAsRead(id);
}

function markAllAsRead() {
  roleNotifications.value.forEach((n) => {
    if (!n.read) {
      dataStore.markNotificationAsRead(n.id);
    }
  });
}

function formatTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function getColorClass() {
  const colors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    red: 'text-red-600',
    cyan: 'text-cyan-600'
  };
  return colors[props.color];
}

function getBadgeClass() {
  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    orange: 'bg-orange-600',
    red: 'bg-red-600',
    cyan: 'bg-cyan-600'
  };
  return colors[props.color];
}

function getTextColorClass() {
  const colors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    red: 'text-red-600',
    cyan: 'text-cyan-600'
  };
  return colors[props.color];
}

function handleClickOutside(event) {
  const target = event.target;
  if (!target.closest('.relative')) {
    dropdownOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
