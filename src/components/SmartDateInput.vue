<template>
  <div class="smart-date-input relative group">
    <div class="relative flex items-center">
      <input
        type="text"
        :value="displayValue"
        @input="handleInput"
        @blur="handleBlur"
        @keydown="handleKeyDown"
        :placeholder="placeholder || 'DD/MM/YYYY'"
        class="w-full bg-hover-bg/40 border border-border rounded-xl px-4 py-2.5 text-xs font-bold text-text-primary outline-none focus:ring-2 focus:ring-brand/10 transition-all pr-10"
      />
      
      <!-- Calendar Icon Trigger -->
      <button 
        type="button"
        @click="triggerPicker"
        class="absolute right-3 text-text-muted hover:text-brand transition-colors p-1 rounded-lg hover:bg-brand/5"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
        </svg>
      </button>

      <!-- Hidden Native Picker -->
      <input 
        ref="datePicker"
        type="date"
        class="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
        :value="modelValue"
        @input="handlePickerChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: string; // Expects YYYY-MM-DD
  placeholder?: string;
}>();

const emit = defineEmits(['update:modelValue']);

const datePicker = ref<HTMLInputElement | null>(null);

// We keep a local display state for the text input to avoid issues with intermediate states
const displayValue = ref('');

// Sync prop to display value
watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    displayValue.value = '';
    return;
  }
  // Convert YYYY-MM-DD to DD/MM/YYYY
  const [y, m, d] = newVal.split('-');
  if (y && m && d) {
    displayValue.value = `${d}/${m}/${y}`;
  }
}, { immediate: true });

function handleInput(e: Event) {
  const input = e.target as HTMLInputElement;
  let val = input.value.replace(/\D/g, ''); // Remove non-digits
  
  if (val.length > 8) val = val.slice(0, 8);
  
  let formatted = '';
  if (val.length > 0) {
    formatted = val.slice(0, 2);
    if (val.length > 2) {
      formatted += '/' + val.slice(2, 4);
      if (val.length > 4) {
        formatted += '/' + val.slice(4, 8);
      }
    }
  }
  
  displayValue.value = formatted;
  input.value = formatted; // Force cursor position sync

  // If complete, emit change
  if (val.length === 8) {
    const d = val.slice(0, 2);
    const m = val.slice(2, 4);
    const y = val.slice(4, 8);
    const iso = `${y}-${m}-${d}`;
    // Basic validation check
    const dateObj = new Date(iso);
    if (!isNaN(dateObj.getTime())) {
      emit('update:modelValue', iso);
    }
  }
}

function handleKeyDown(e: KeyboardEvent) {
  // Allow normal navigation keys
  if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) return;
  // Block non-digits
  if (!/^\d$/.test(e.key)) {
    e.preventDefault();
  }
}

function handleBlur() {
  // If incomplete, we might want to clear it or reset to previous valid?
  // For now, if valid ISO exists, keep it.
}

function triggerPicker() {
  // On most modern browsers showPicker() is supported
  if (datePicker.value && 'showPicker' in HTMLInputElement.prototype) {
      try {
          (datePicker.value as any).showPicker();
      } catch (err) {
          datePicker.value.click();
      }
  } else {
      datePicker.value?.click();
  }
}

function handlePickerChange(e: Event) {
  const val = (e.target as HTMLInputElement).value;
  emit('update:modelValue', val);
}

</script>

<style scoped>
@reference "../style.css";
/* Ensure hidden input doesn't interfere but still works for showPicker */
input[type="date"]::-webkit-calendar-picker-indicator {
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
}
</style>
