<template>
  <div class="relative font-inter" ref="container">
    <div 
      class="flex items-center bg-card-bg border border-border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-brand/20 transition-all"
      :class="{ 'opacity-50 cursor-not-allowed': disabled }"
    >
      <input
        ref="input"
        v-model="searchQuery"
        type="text"
        :placeholder="placeholder"
        :disabled="disabled"
        @focus="onFocus"
        @blur="onBlur"
        @keydown.down.prevent="navigateOptions(1)"
        @keydown.up.prevent="navigateOptions(-1)"
        @keydown.enter.prevent="selectHighlighted"
        @keydown.esc="showOptions = false"
        class="w-full bg-transparent border-none outline-none text-xs font-bold text-text-primary placeholder:text-text-muted/50 uppercase"
      />
      <div v-if="loading" class="animate-spin text-brand ml-2">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      </div>
      <div v-else class="text-text-muted/30 ml-2">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </div>
    </div>

    <!-- DROP DOWN -->
    <Teleport to="body">
      <div 
        v-if="showOptions"
        id="autocomplete-dropdown"
        role="listbox"
        class="fixed z-[9999] bg-card-bg border border-border rounded-xl shadow-2xl shadow-brand/5 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        :style="dropdownStyle"
      >
        <div class="max-h-[280px] overflow-y-auto custom-scrollbar p-1.5 space-y-0.5">
          <div 
            v-for="(option, index) in filteredOptions" 
            :key="option.id"
            role="option"
            :aria-selected="highlightedIndex === index"
            class="px-3 py-2 rounded-lg cursor-pointer transition-all flex flex-col gap-0.5"
            :class="highlightedIndex === index ? 'bg-brand text-white' : 'hover:bg-hover-bg text-text-primary'"
            @mousedown.prevent="selectOption(option)"
          >
            <span class="text-[11px] font-black uppercase tracking-tight">{{ option.name }}</span>
            <span v-if="option.sub" class="text-[9px] font-bold opacity-60 uppercase">{{ option.sub }}</span>
          </div>

          <!-- CREATE NEW BUTTON -->
          <div 
            v-if="allowCreate"
            class="px-3 py-3 mt-1.5 border-t border-border/50 cursor-pointer flex items-center gap-3 group border-b last:border-b-0"
            :class="highlightedIndex === filteredOptions.length ? 'bg-emerald-500 text-white' : 'hover:bg-emerald-50 text-emerald-600'"
            @mousedown.prevent="handleCreateClick"
          >
            <div class="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-white/20 group-hover:text-white transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12h14"/></svg>
            </div>
            <span class="text-[10px] font-black uppercase tracking-widest">{{ createLabel || `Add ${searchQuery || 'New'}` }}</span>
          </div>

          <div v-if="filteredOptions.length === 0 && !allowCreate" class="p-4 text-center">
            <p class="text-[10px] font-bold text-text-muted uppercase tracking-widest">No results found</p>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

interface Option {
  id: string;
  name: string;
  sub?: string;
  [key: string]: any;
}

const props = defineProps<{
  modelValue?: string;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  allowCreate?: boolean;
  createLabel?: string;
  initialQuery?: string;
  allowFreeText?: boolean;
}>();

const emit = defineEmits(['update:modelValue', 'select', 'create', 'search']);

const container = ref<HTMLElement | null>(null);
const input = ref<HTMLInputElement | null>(null);
const searchQuery = ref(props.initialQuery || '');
const showOptions = ref(false);
const highlightedIndex = ref(0);
const dropdownStyle = ref({ top: '0px', left: '0px', width: '0px' });

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options;
  const q = searchQuery.value.toLowerCase();
  return props.options.filter(o => 
    o.name.toLowerCase().includes(q) || 
    (o.sub && o.sub.toLowerCase().includes(q))
  );
});

// Sync searchQuery with modelValue or initial prop
watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    if (!props.allowFreeText || searchQuery.value !== '') {
      searchQuery.value = '';
    }
  } else {
    // If we have an option matching this ID, show its name
    const opt = props.options.find(o => o.id === newVal);
    if (opt) {
       searchQuery.value = opt.name;
    } else if (props.allowFreeText && searchQuery.value !== newVal) {
       searchQuery.value = newVal;
    }
  }
}, { immediate: true });

watch(searchQuery, (newVal) => {
   emit('search', newVal);
   // If free text is allowed, we act as a normal input bound directly to modelValue
   // But we don't emit if it matches an option named exactly to prevent infinite loops when strictly ID-mapped unless needed
   if (props.allowFreeText) {
      if (newVal !== props.modelValue) {
          emit('update:modelValue', newVal);
      }
   }
});

function onFocus() {
  updateDropdownPosition();
  showOptions.value = true;
  highlightedIndex.value = 0;
}

function onBlur() {
  // Use a small delay to allow mousedown on options to trigger first
  setTimeout(() => {
    showOptions.value = false;
  }, 100);
}

function updateDropdownPosition() {
  if (container.value) {
    const rect = container.value.getBoundingClientRect();
    dropdownStyle.value = {
      top: `${rect.bottom + 6}px`,
      left: `${rect.left}px`,
      width: `${Math.max(rect.width, 240)}px`
    };
  }
}

function navigateOptions(dir: number) {
  const max = props.allowCreate ? filteredOptions.value.length : filteredOptions.value.length - 1;
  highlightedIndex.value = (highlightedIndex.value + dir + (max + 1)) % (max + 1);
  
  // Scroll into view if needed
  const dropdown = document.getElementById('autocomplete-dropdown');
  if (dropdown) {
    const activeEl = dropdown.querySelectorAll('[role="option"]')[highlightedIndex.value];
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }
}

function selectHighlighted() {
  if (highlightedIndex.value === filteredOptions.value.length && props.allowCreate) {
    handleCreateClick();
  } else if (filteredOptions.value[highlightedIndex.value]) {
    selectOption(filteredOptions.value[highlightedIndex.value] as unknown as Option);
  }
}

function handleCreateClick() {
  let val = searchQuery.value;
  if (!val) {
    const userInput = prompt(`Enter new ${props.createLabel || 'option'}:`);
    if (!userInput) return; // User cancelled or entered blank
    val = userInput.trim();
  }
  if (!val) return;
  emit('create', val);
  showOptions.value = false;
  input.value?.blur();
}

function selectOption(option: Option) {
  searchQuery.value = option.name;
  emit('update:modelValue', option.id);
  emit('select', option);
  showOptions.value = false;
}

// Global scroll/resize listener to reposition dropdown
function updateOnScroll() {
  if (showOptions.value) updateDropdownPosition();
}

onMounted(() => {
  window.addEventListener('scroll', updateOnScroll, true);
  window.addEventListener('resize', updateOnScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateOnScroll, true);
  window.removeEventListener('resize', updateOnScroll);
});

defineExpose({
    focus: () => input.value?.focus(),
    clear: () => { searchQuery.value = ''; highlightedIndex.value = 0; }
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 10px;
}
.animate-in {
  animation: animate-in 0.15s cubic-bezier(0, 0, 0.2, 1);
}
@keyframes animate-in {
  from { opacity: 0; transform: scale(0.95) translateY(-10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
