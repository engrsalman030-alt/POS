<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:pt-24">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/20 backdrop-blur-sm" @click="close"></div>

    <!-- Dialog -->
    <div class="relative w-full max-w-2xl bg-card-bg rounded-xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[80vh]">
      <!-- Search Input -->
      <div class="flex items-center px-4 py-3 border-b border-border">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-text-muted mr-3">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input
          ref="searchInput"
          v-model="query"
          type="text"
          class="flex-1 bg-transparent border-none outline-none text-text-primary placeholder-text-muted text-base"
          placeholder="Search for pages, items, parties..."
          @keydown.down.prevent="navigateResults(1)"
          @keydown.up.prevent="navigateResults(-1)"
          @keydown.enter="selectCurrent"
          @keydown.esc="close"
        />
        <div class="flex items-center gap-1 ml-3">
           <kbd class="px-1.5 py-0.5 rounded border border-border bg-hover-bg text-[10px] text-text-muted font-sans">ESC</kbd>
        </div>
      </div>

      <!-- Results Area -->
      <div v-if="hasResults || query" class="flex-1 overflow-y-auto p-2">
        <div v-if="!hasResults && query" class="py-12 text-center">
          <p class="text-text-muted">No results found for "<span class="font-medium text-text-primary">{{ query }}</span>"</p>
        </div>

        <div v-else class="space-y-4">
          <div v-for="(group, category) in groupedResults" :key="category">
            <h3 class="px-3 py-1 text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1">{{ category }}</h3>
            <div class="space-y-0.5">
              <button
                v-for="result in group"
                :key="result.id"
                class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors"
                :class="[selectedIndex === result.globalIndex ? 'bg-hover-bg text-text-primary' : 'text-text-secondary hover:bg-hover-bg/50']"
                @mouseenter="selectedIndex = result.globalIndex"
                @click="navigate(result)"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded bg-hover-bg flex items-center justify-center text-text-secondary shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="result.icon"></svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium leading-none text-text-primary">{{ result.name }}</p>
                    <p v-if="result.subtitle" class="text-[11px] text-text-muted mt-1">{{ result.subtitle }}</p>
                  </div>
                </div>
                <div v-if="selectedIndex === result.globalIndex" class="text-[10px] text-text-muted">
                  Enter ↵
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div v-else class="p-8 text-center bg-hover-bg/50">
        <p class="text-xs text-text-muted">Search for anything in <span class="font-bold text-text-secondary">Nexus POS</span></p>
        <div class="mt-4 flex justify-center gap-4">
            <div class="flex items-center gap-1.5 text-[10px] text-text-muted">
                <kbd class="px-1 py-0.5 rounded border border-border bg-card-bg">↑↓</kbd> <span>Navigate</span>
            </div>
            <div class="flex items-center gap-1.5 text-[10px] text-text-muted">
                <kbd class="px-1 py-0.5 rounded border border-border bg-card-bg">↵</kbd> <span>Open</span>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useInventoryStore } from '../stores/inventory';
import { usePartyStore } from '../stores/parties';
import { useTransactionStore } from '../stores/transactions';

const router = useRouter();
const inventoryStore = useInventoryStore();
const partyStore = usePartyStore();
const transactionStore = useTransactionStore();

const isOpen = ref(false);
const query = ref('');
const selectedIndex = ref(0);
const searchInput = ref<HTMLInputElement | null>(null);

const pages = [
  { name: 'Dashboard', path: '/', icon: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>' },
  { name: 'Bank & Cash', path: '/bank', icon: '<line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7 12 2"/>' },
  { name: 'Items & Stock', path: '/inventory', icon: '<path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/>' },
  { name: 'Sales Invoices', path: '/sales', icon: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/>' },
  { name: 'Purchase Bills', path: '/purchases', icon: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>' },
  { name: 'Parties', path: '/parties', icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
  { name: 'Tax Settings', path: '/tax', icon: '<line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>' },
  { name: 'Settings', path: '/settings', icon: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>' },
];

const results = computed(() => {
  if (!query.value) return [];
  
  const q = query.value.toLowerCase();
  let all: any[] = [];

  // Filter Pages
  const filteredPages = pages.filter(p => p.name.toLowerCase().includes(q))
    .map(p => ({ ...p, id: `page-${p.name}`, category: 'Navigation', subtitle: 'Application Page' }));
  
  // Filter Items
  const filteredItems = inventoryStore.items.filter(i => i.name.toLowerCase().includes(q) || i.sku?.toLowerCase().includes(q))
    .map(i => ({ id: i.id, name: i.name, category: 'Items', path: '/inventory', icon: '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><mpath d="m3.3 7 8.7 5 8.7-5"/><mpath d="M12 22V12"/>', subtitle: `SKU: ${i.sku || 'N/A'} • Stock: ${i.stock_quantity}` }));

  // Filter Parties
  const filteredParties = partyStore.parties.filter(p => p.name.toLowerCase().includes(q) || p.phone?.includes(q))
    .map(p => ({ id: p.id, name: p.name, category: 'Parties', path: '/parties', icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', subtitle: `${p.type} • ${p.phone || 'No Phone'}` }));

  // Filter Transactions (Bills/Invoices)
  const filteredInvoices = transactionStore.invoices.filter(i => i.id.toLowerCase().includes(q))
    .map(i => ({ id: i.id, name: `Invoice ${i.id.slice(0, 8)}`, category: 'Transactions', path: '/sales', icon: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/>', subtitle: `Sales • ${i.date} • ₹${i.total_amount}` }));

  all = [...filteredPages, ...filteredItems, ...filteredParties, ...filteredInvoices];
  
  // Assign global index for navigation
  return all.map((item, index) => ({ ...item, globalIndex: index }));
});

const groupedResults = computed(() => {
  return results.value.reduce((acc: any, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});
});

const hasResults = computed(() => results.value.length > 0);

const open = () => {
  isOpen.value = true;
  query.value = '';
  selectedIndex.value = 0;
  nextTick(() => {
    searchInput.value?.focus();
  });
};

const close = () => {
  isOpen.value = false;
};

const navigateResults = (direction: number) => {
  const total = results.value.length;
  if (total === 0) return;
  selectedIndex.value = (selectedIndex.value + direction + total) % total;
};

const navigate = (result: any) => {
  router.push(result.path);
  close();
};

const selectCurrent = () => {
  const selected = results.value[selectedIndex.value];
  if (selected) {
    navigate(selected);
  }
};

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    open();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

defineExpose({ open });
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 10px;
}
</style>
