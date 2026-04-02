<template>
  <header class="h-16 bg-header-bg/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-40 transition-all duration-300 gap-3">
    <div class="flex items-center gap-2 md:gap-3 shrink-0">
      <!-- Mobile Menu Toggle -->
      <button 
        @click="$emit('toggle-sidebar')"
        class="lg:hidden p-2 rounded-lg bg-hover-bg text-text-secondary hover:bg-hover-bg/80 hover:text-text-primary transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
        </svg>
      </button>
      
      <h2 class="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-widest truncate max-w-[120px] md:max-w-none">
        {{ routeName }}
      </h2>
    </div>

    <div class="flex items-center gap-2 md:gap-4 shrink-0 px-2 lg:px-0">
      <!-- POS Button -->
      <router-link 
        to="/pos" 
        class="pos-button flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-xl bg-text-primary text-card-bg shadow-lg hover:opacity-95 hover:scale-[1.02] active:scale-95 transition-all duration-200 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:rotate-12 transition-transform">
          <rect width="18" height="18" x="3" y="3" rx="2"/>
          <path d="M3 9h18"/>
          <path d="M9 21V9"/>
          <path d="M3 15h6"/>
          <path d="M15 9v12"/>
          <path d="M15 15h6"/>
        </svg>
        <span class="text-xs md:text-sm font-bold tracking-tight">POS</span>
      </router-link>
 
      <!-- Search Shortcut Trigger -->
      <button 
        @click="$emit('search')"
        class="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-hover-bg text-text-muted hover:bg-hover-bg/80 hover:text-text-primary transition-all shrink-0"
        title="Search (⌘K)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

defineEmits(['search', 'toggle-sidebar']);

const route = useRoute();
const routeName = computed(() => (route.name as string) || 'Dashboard');
</script>

<style scoped>
.pos-button {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05);
}

.pos-button:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1);
}
</style>
