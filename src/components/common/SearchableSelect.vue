<template>
  <div class="relative w-full" ref="dropdownRef">
    <!-- Search Input / Display -->
    <div 
      class="w-full flex items-center justify-between border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm transition-colors focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500"
      :class="{ 'ring-1 ring-emerald-500 border-emerald-500': isOpen }"
      @click="openDropdown"
    >
      <input
        type="text"
        :placeholder="placeholder"
        v-model="searchQuery"
        @focus="openDropdown"
        class="w-full px-3 py-2 text-xs outline-none bg-transparent text-gray-800"
      />
      <!-- Clear or Dropdown Icon -->
      <button v-if="modelValue" @click.stop="clearSelection" type="button" class="pr-2 text-gray-400 hover:text-red-500 transition-colors">
        <X :size="14" />
      </button>
      <div v-else class="pr-2 text-gray-400">
        <ChevronDown :size="14" />
      </div>
    </div>

    <!-- Dropdown List -->
    <transition name="fade-fast">
      <div 
        v-if="isOpen" 
        class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto"
      >
        <div v-if="filteredOptions.length === 0" class="px-3 py-4 text-xs text-gray-500 text-center italic bg-gray-50">
          No matching dishes found.
        </div>
        <div
          v-for="option in filteredOptions"
          :key="option.id"
          @click.stop="selectOption(option)"
          class="px-3 py-2.5 text-xs cursor-pointer hover:bg-emerald-50 text-gray-800 border-b border-gray-50 last:border-0 truncate flex items-center justify-between group"
          :class="{ 'bg-emerald-50/50 font-bold': (valueKey ? modelValue === option[valueKey] : modelValue?.id === option.id) }"
        >
          <span>{{ option.name }}</span>
          <span class="text-gray-400 group-hover:text-emerald-600 transition-colors ml-2 font-mono">₱{{ option.cost.toFixed(2) }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { ChevronDown, X } from 'lucide-vue-next';

const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Search dish...'
  },
  valueKey: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

const dropdownRef = ref(null);
const isOpen = ref(false);
const searchQuery = ref('');

// Sync input text with the selected modelValue
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    if (props.valueKey) {
      // newVal is just a string/id. Find the corresponding object in options.
      const match = props.options.find(o => o[props.valueKey] === newVal);
      searchQuery.value = match ? match.name : newVal;
    } else {
      searchQuery.value = newVal.name;
    }
  } else {
    searchQuery.value = '';
  }
}, { immediate: true });

// Filter options based on typed search query
const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options;
  
  // If we have a match currently selected, show all options
  let currentName = '';
  if (props.modelValue) {
    if (props.valueKey) {
      const match = props.options.find(o => o[props.valueKey] === props.modelValue);
      currentName = match ? match.name : props.modelValue;
    } else {
      currentName = props.modelValue.name;
    }
  }
  
  if (currentName && searchQuery.value === currentName) {
    return props.options;
  }
  
  const lowerQuery = searchQuery.value.toLowerCase();
  return props.options.filter(opt => opt.name.toLowerCase().includes(lowerQuery));
});

function openDropdown() {
  isOpen.value = true;
}

function selectOption(option) {
  emit('update:modelValue', props.valueKey ? option[props.valueKey] : option);
  emit('change');
  searchQuery.value = option.name;
  isOpen.value = false;
}

function clearSelection() {
  emit('update:modelValue', null);
  emit('change');
  searchQuery.value = '';
  isOpen.value = true; // keep open to search for a new one
}

// Click outside to close
function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
    // Revert search query to match actual selected value
    if (props.modelValue) {
      if (props.valueKey) {
        const match = props.options.find(o => o[props.valueKey] === props.modelValue);
        searchQuery.value = match ? match.name : props.modelValue;
      } else {
        searchQuery.value = props.modelValue.name;
      }
    } else {
      searchQuery.value = '';
    }
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>

<style scoped>
.fade-fast-enter-active,
.fade-fast-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-fast-enter-from,
.fade-fast-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
