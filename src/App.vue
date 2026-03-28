<template>
  <div :class="['flex h-screen bg-app-bg text-text-primary font-sans overflow-hidden', themeStore.theme]">
    <Sidebar v-if="companyStore.isInitialized && !route.meta.hideSidebar" :is-open="isSidebarOpen" @close="isSidebarOpen = false" @search="globalSearch?.open()" />
    <GlobalSearch ref="globalSearch" />
    <main class="flex-1 overflow-hidden relative flex flex-col">
      <TopHeader v-if="companyStore.isInitialized && !route.meta.hideSidebar" @toggle-sidebar="isSidebarOpen = !isSidebarOpen" @search="globalSearch?.open()" />
      
      <div class="flex-1 overflow-y-auto w-full relative flex flex-col">
        <div class="flex-1 relative">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>

        <!-- Professional App Footer -->
        <footer v-if="companyStore.isInitialized && !route.meta.hideSidebar" class="mt-auto border-t border-border bg-card-bg/30 backdrop-blur-md py-3 px-6 shrink-0 z-10 w-full transition-all">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
            <p class="text-[11px] font-bold text-text-muted">
              &copy; {{ new Date().getFullYear() }} {{ companyStore.company?.name || 'Nexus POS' }}. All rights reserved.
            </p>
            <div class="flex items-center gap-2 group cursor-default">
              <p class="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted/70 group-hover:text-text-muted transition-colors">
                Powered By
              </p>
              <div class="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand/5 border border-brand/10 shadow-sm shadow-brand/5 group-hover:border-brand/20 group-hover:bg-brand/10 transition-all">
                <span class="relative flex h-1.5 w-1.5">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand"></span>
                </span>
                <span class="text-[10px] font-black tracking-widest text-brand">VIRTUAL TECH SOLUTION</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

import Sidebar from './components/Sidebar.vue';
import TopHeader from './components/TopHeader.vue';
import GlobalSearch from './components/GlobalSearch.vue';
import { useCompanyStore } from './stores/company';
import { useInventoryStore } from './stores/inventory';
import { usePartyStore } from './stores/parties';
import { useTransactionStore } from './stores/transactions';
import { useThemeStore } from './stores/theme';

const route = useRoute();
const companyStore = useCompanyStore();
const inventoryStore = useInventoryStore();
const partyStore = usePartyStore();
const transactionStore = useTransactionStore();
const themeStore = useThemeStore();

const globalSearch = ref<any>(null);
const isSidebarOpen = ref(false);

onMounted(async () => {
  await companyStore.loadCompany();
  if (companyStore.isInitialized) {
      inventoryStore.fetchItems();
      partyStore.fetchParties();
      transactionStore.fetchBills();
      transactionStore.fetchInvoices();
  } else {
      inventoryStore.items = [];
      partyStore.parties = [];
      transactionStore.bills = [];
      transactionStore.invoices = [];
  }
});

watch(() => companyStore.company?.id, (newId, oldId) => {
    // If the company ID fundamentally changes (e.g. from a new setup wiping the DB), ensure the entire SPA is pristine
    if (newId && oldId && newId !== oldId) {
        window.location.href = '/'; 
    } else if (newId) {
        inventoryStore.fetchItems();
        partyStore.fetchParties();
        transactionStore.fetchBills();
        transactionStore.fetchInvoices();
    } else {
        inventoryStore.items = [];
        partyStore.parties = [];
        transactionStore.bills = [];
        transactionStore.invoices = [];
    }
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  font-family: 'Inter', sans-serif;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--border);
}
::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}
</style>
