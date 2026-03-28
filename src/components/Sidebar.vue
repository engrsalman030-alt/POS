<template>
  <div class="aside-container flex h-full">
    <!-- Backdrop for mobile -->
    <div v-if="isOpen" class="fixed inset-0 bg-black/5 backdrop-blur-[2px] z-[55] lg:hidden" @click="$emit('close')"></div>
    
    <aside 
      :class="['flex flex-col h-full bg-sidebar-bg transition-all duration-300 z-[60]', 
                isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 w-64',
                'fixed lg:relative border-r border-border']"
    >
      
      <!-- Logo + Close button for mobile -->
      <div class="px-6 py-8 flex justify-between items-center">
        <router-link to="/" class="group">
          <h1 class="text-base font-bold flex items-center gap-2 text-text-primary">
            <div class="w-8 h-8 bg-brand rounded-lg flex items-center justify-center shadow-lg shadow-brand/20 transition-all group-hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M15 9v12"/><path d="M15 15h6"/><path d="M3 15h12"/></svg>
            </div>
            Nexus <span class="font-black text-brand">POS</span>
          </h1>
        </router-link>
        <button @click="$emit('close')" class="lg:hidden p-1 text-text-muted hover:text-text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

    <!-- Global Search Trigger -->
    <div class="px-4 mb-4">
      <button 
        @click="$emit('search')"
        class="w-full flex items-center justify-between px-3 py-2 rounded border border-border/50 bg-hover-bg text-text-secondary hover:bg-hover-bg/80 hover:text-text-primary transition-colors group"
      >
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <span class="text-xs font-medium">Search...</span>
        </div>
        <kbd class="hidden sm:block text-[10px] px-1 py-0.5 rounded border border-border bg-card-bg text-text-muted font-sans font-medium">⌘K</kbd>
      </button>
    </div>

    <!-- Nav -->
    <nav class="flex-1 px-4 space-y-0.5 overflow-y-auto custom-scrollbar">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-3 py-2 rounded transition-all nav-link group"
        active-class="nav-link--active"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" 
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
          class="transition-colors icon-default group-hover:text-text-primary"
          v-html="item.icon">
        </svg>
        <span class="font-medium">{{ item.name }}</span>
      </router-link>
    </nav>

    <!-- Company Footer -->
    <div class="p-4 mt-auto border-t border-border">
      <div class="flex items-center justify-between gap-3 mb-4 px-4 py-3 rounded border border-border bg-app-bg">
        <div class="flex items-center gap-3 overflow-hidden">
          <div class="w-6 h-6 rounded flex items-center justify-center text-[10px] font-black shrink-0 bg-text-primary text-card-bg">
            {{ companyInitial }}
          </div>
          <div class="overflow-hidden">
            <p class="text-xs font-bold truncate text-text-primary">{{ companyName }}</p>
            <p class="text-text-muted uppercase tracking-widest font-semibold" style="font-size:9px;">Local Database</p>
          </div>
        </div>
      </div>
      
      <button 
        @click="companyStore.logout()"
        class="w-full flex items-center gap-3 px-4 py-2.5 text-rose-500 hover:bg-rose-50 rounded transition-all group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-1">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
        </svg>
        <span class="text-xs font-bold uppercase tracking-widest">Logout</span>
      </button>
    </div>

    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCompanyStore } from '../stores/company';

const props = defineProps<{
  isOpen: boolean;
}>();

defineEmits(['search', 'close']);

const companyStore = useCompanyStore();

const companyName = computed(() => companyStore.company?.name || 'My Company');
const companyInitial = computed(() => companyName.value.charAt(0).toUpperCase());

const navItems = [
  { 
    name: 'Dashboard',         
    path: '/', 
    icon: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>' 
  },
  { 
    name: 'Bank & Cash',       
    path: '/bank', 
    icon: '<line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7 12 2"/>' 
  },
  { 
    name: 'Items & Stock',     
    path: '/inventory', 
    icon: '<path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/>' 
  },
  { 
    name: 'Sales Invoices',    
    path: '/sales', 
    icon: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/>' 
  },
  { 
    name: 'Purchase Bills',    
    path: '/purchases', 
    icon: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>' 
  },
  { 
    name: 'Parties',           
    path: '/parties', 
    icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' 
  },
  { 
    name: 'Chart of Accounts', 
    path: '/accounts', 
    icon: '<path d="m3 5 8 8-8 8"/><path d="m13 5 8 8-8 8"/>' 
  },
  { 
    name: 'Reports',           
    path: '/reports', 
    icon: '<line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/>' 
  },
  { 
    name: 'Tax Settings',      
    path: '/tax', 
    icon: '<line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>' 
  },
  { 
    name: 'How to Use',        
    path: '/guide', 
    icon: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>' 
  },
  { 
    name: 'Settings',          
    path: '/settings', 
    icon: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>' 
  },
];
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

aside {
  font-family: 'Inter', sans-serif;
}

.nav-link {
  color: var(--text-secondary);
  font-size: 13px;
}

.nav-link .icon-default {
  color: var(--text-muted);
}

.nav-link:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
}

.nav-link:hover .icon-default {
  color: var(--text-primary);
}

.nav-link--active {
  background: var(--hover-bg) !important;
  color: var(--text-primary) !important;
  font-weight: 700;
}

.nav-link--active .icon-default {
  color: var(--text-primary) !important;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 10px;
}
aside:hover .custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--border);
}
</style>