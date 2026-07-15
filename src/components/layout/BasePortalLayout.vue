<template>
  <div class="min-h-screen bg-[#f8f9fa] font-sans">
    <!-- Mobile Hamburger Menu -->
    <div class="md:hidden">
      <!-- Top Bar -->
      <div class="bg-white text-gray-800 p-4 flex items-center justify-between border-b border-gray-200">
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-gray-500 hover:text-gray-700">
          <Menu :size="24" />
        </button>
        <slot name="mobile-topbar-title">
          <h1 class="text-lg font-bold">Portal</h1>
        </slot>
        <slot name="mobile-topbar-right"></slot>
      </div>

      <!-- Slide-out Menu -->
      <transition name="slide">
        <div v-if="mobileMenuOpen" class="fixed inset-0 z-50 bg-black bg-opacity-50" @click="mobileMenuOpen = false">
          <div class="w-64 h-full bg-white shadow-xl flex flex-col" @click.stop>
            <slot name="sidebar-header" :desktopSidebarOpen="true"></slot>
            <div class="flex-1 overflow-y-auto">
              <slot name="sidebar-nav" :desktopSidebarOpen="true" @closeMobile="mobileMenuOpen = false"></slot>
            </div>
            <slot name="sidebar-footer" :desktopSidebarOpen="true"></slot>
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
        <slot name="sidebar-header" :desktopSidebarOpen="desktopSidebarOpen"></slot>

        <!-- Navigation -->
        <div class="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
          <slot name="sidebar-nav" :desktopSidebarOpen="desktopSidebarOpen"></slot>
        </div>

        <!-- Footer -->
        <slot name="sidebar-footer" :desktopSidebarOpen="desktopSidebarOpen"></slot>
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <!-- Top Bar -->
        <div class="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between shrink-0" :class="topbarBorderClass">
          <div class="flex items-center space-x-4">
            <button @click="desktopSidebarOpen = !desktopSidebarOpen" class="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors p-1 hover:bg-gray-50 rounded-lg">
              <Menu :size="24" />
            </button>
            <div>
              <slot name="topbar-left"></slot>
            </div>
          </div>
          
          <div class="flex items-center space-x-6 relative">
            <slot name="topbar-right"></slot>
          </div>
        </div>

        <!-- Module Content -->
        <div class="flex-1 overflow-y-auto" :class="contentPaddingClass">
          <slot></slot>
        </div>
      </div>
    </div>

    <!-- Mobile Content -->
    <div class="md:hidden overflow-y-auto h-[calc(100vh-64px)] bg-[#f8f9fa]">
      <div :class="mobileContentPaddingClass">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Menu } from 'lucide-vue-next';

const props = defineProps({
  contentPaddingClass: {
    type: String,
    default: 'p-8 bg-[#f8f9fa]'
  },
  mobileContentPaddingClass: {
    type: String,
    default: 'p-4 pb-20'
  },
  topbarBorderClass: {
    type: String,
    default: ''
  }
});

const mobileMenuOpen = ref(false);
const desktopSidebarOpen = ref(true);

// We need to expose a way to close the mobile menu from the slot if needed
defineExpose({
  closeMobileMenu: () => {
    mobileMenuOpen.value = false;
  }
});
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
