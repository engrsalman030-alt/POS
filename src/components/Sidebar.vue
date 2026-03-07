<template>
  <aside class="w-64 flex flex-col h-full" style="background:#fff; border-right:1px solid #E2E2E2;">
    
    <!-- Logo -->
    <div class="p-6 pb-4">
      <h1 class="text-base font-bold flex items-center gap-2" style="color:#171717;">
        <span class="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-black" style="background:#46B37E;">FB</span>
        Frappe Books
      </h1>
      <p class="text-xs mt-1 ml-9" style="color:#999; font-size:11px;">Double-Entry Accounting</p>
    </div>

    <!-- Divider -->
    <div style="height:1px; background:#F0F0F0; margin:0 16px;"></div>

    <!-- Nav -->
    <nav class="flex-1 px-3 mt-3 space-y-0.5">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-2.5 px-3 py-2 rounded-md transition-all text-sm nav-link"
        active-class="nav-link--active"
      >
        <span class="text-sm w-5 text-center">{{ item.icon }}</span>
        <span class="font-medium">{{ item.name }}</span>
      </router-link>
    </nav>

    <!-- Company Footer -->
    <div class="p-4" style="border-top:1px solid #F0F0F0;">
      <div class="flex items-center gap-3 px-3 py-2.5 rounded-lg" style="background:#F6F6F6;">
        <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0" 
          style="background:#46B37E; color:#fff;">
          {{ companyInitial }}
        </div>
        <div class="overflow-hidden">
          <p class="text-sm font-semibold truncate" style="color:#171717; font-size:12px;">{{ companyName }}</p>
          <p style="font-size:10px; color:#999;">Local SQLite DB</p>
        </div>
      </div>
    </div>

  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCompanyStore } from '../stores/company';

const companyStore = useCompanyStore();

const companyName = computed(() => companyStore.company?.name || 'My Company');
const companyInitial = computed(() => companyName.value.charAt(0).toUpperCase());

const navItems = [
  { name: 'Dashboard',         path: '/',          icon: '📊' },
  { name: 'How to Use',        path: '/guide',     icon: '❓' },
  { name: 'Bank & Cash',       path: '/bank',      icon: '🏦' },
  { name: 'Items & Stock',     path: '/inventory', icon: '📦' },
  { name: 'Sales Invoices',    path: '/sales',     icon: '📄' },
  { name: 'Purchase Bills',    path: '/purchases', icon: '🧾' },
  { name: 'Parties',           path: '/parties',   icon: '👥' },
  { name: 'Chart of Accounts', path: '/accounts',  icon: '📁' },
  { name: 'Reports',           path: '/reports',   icon: '📈' },
  { name: 'Tax Settings',      path: '/tax',       icon: '⚖️' },
];
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

aside {
  font-family: 'Inter', sans-serif;
}

.nav-link {
  color: #525252;
  font-size: 13px;
}

.nav-link:hover {
  background: #F6F6F6;
  color: #171717;
}

.nav-link--active {
  background: #EDFBF4 !important;
  color: #278F5E !important;
  font-weight: 600;
}

.nav-link--active span:first-child {
  filter: none;
}
</style>