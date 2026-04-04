<template>
  <div class="page-container">
    <!-- Header -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
      <div>
        <h1 class="text-3xl font-black text-text-primary tracking-tighter uppercase">{{ currentTab === 'Bills' ? 'Purchase Bills' : 'Purchase Returns' }}</h1>
        <p class="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mt-1 italic">{{ currentTab === 'Bills' ? 'Procurement & Inventory Inbound' : 'Return to Company Management' }}</p>
      </div>

      <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <!-- Tab Switcher -->
        <div class="bg-hover-bg/50 p-1 rounded-2xl border border-border flex items-center gap-1 shadow-inner">
          <button 
            @click="currentTab = 'Bills'"
            :class="[
              'px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300',
              currentTab === 'Bills' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-text-muted hover:text-text-primary hover:bg-hover-bg'
            ]"
          >
            Bills
          </button>
          <button 
            @click="currentTab = 'Returns'"
            :class="[
              'px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300',
              currentTab === 'Returns' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-text-muted hover:text-brand hover:bg-brand/5'
            ]"
          >
            Returns
          </button>
        </div>

        <button @click="openCreate" 
          :class="[
            'px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl flex items-center gap-2 active:scale-95 bg-brand text-white shadow-brand/20 hover:bg-brand-hover'
          ]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"/><path d="M12 5v14"/>
          </svg>
          {{ currentTab === 'Bills' ? 'Record Bill' : 'Record Return' }}
        </button>
      </div>
    </div>

    <!-- Main List/Grid View -->
    <div class="space-y-4">
      <div class="grid grid-cols-1 gap-3">
        <div v-for="bill in paginatedBills" :key="bill.id" 
          class="group bg-card-bg border rounded-[2rem] p-5 hover:shadow-2xl transition-all relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:border-brand/40"
        >
          <!-- Status Ribbon -->
          <div class="absolute top-0 right-0 px-4 py-1 rounded-bl-2xl text-[8px] font-black uppercase tracking-[0.25em] z-20"
            :class="bill.document_type === 'Return' ? 'bg-brand text-white' : 'bg-brand/10 text-brand'">
            {{ bill.document_type === 'Return' ? 'Purchase Return' : bill.status }}
          </div>

          <!-- Vertical Type Indicator -->
          <div class="absolute inset-y-0 left-0 w-1 pt-12">
             <div class="h-1/2 w-full bg-brand"></div>
          </div>

          <!-- Primary Info -->
          <div class="flex items-center gap-6 pl-2">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 relative overflow-hidden bg-brand/5 border-brand/10 group-hover:scale-110">
               <span class="text-[11px] font-black relative z-10 text-brand">{{ currentTab === 'Returns' ? 'RET' : 'BILL' }}</span>
            </div>
            <div>
              <h3 class="font-black text-xs md:text-sm text-text-primary uppercase tracking-tight truncate max-w-[200px] md:max-w-md">
                {{ getSupplierName(bill.supplier_id) }}
              </h3>
              <div class="flex items-center gap-3 mt-1 text-[9px] font-bold text-text-muted uppercase tracking-widest">
                <span>{{ bill.date }}</span>
                <span class="w-1 h-1 rounded-full bg-border"></span>
                <span class="font-mono text-[10px] text-text-primary/70">#{{ (bill?.id || '').split('-')[0]?.toUpperCase() }}</span>
              </div>
            </div>
          </div>

          <!-- Financial Section -->
          <div class="w-full lg:w-auto flex items-center justify-between lg:justify-end gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-border border-dashed">
            <div class="text-right">
              <p class="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">{{ currentTab === 'Returns' ? 'Return Total' : 'Grand Total' }}</p>
              <p class="text-2xl font-black tracking-tighter tabular-nums text-brand">{{ formatCurrency(bill.total_amount) }}</p>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-2 relative z-10">
              <button @click.stop="openDetail(bill)" 
                class="w-10 h-10 rounded-xl bg-hover-bg text-text-muted transition-all active:scale-90 hover:text-white shadow-sm hover:bg-emerald-500 flex items-center justify-center cursor-pointer"
                title="View Bill">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
              <button @click.stop="handleEdit(bill)" 
                class="w-10 h-10 rounded-xl bg-hover-bg text-text-muted transition-all active:scale-90 hover:text-white shadow-sm hover:bg-brand flex items-center justify-center cursor-pointer"
                title="Edit Bill">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
              </button>
            </div>
          </div>
        </div>
        
        <div v-if="paginatedBills.length === 0" class="py-24 text-center bg-card-bg border-2 border-dashed border-border rounded-[3rem] opacity-60">
           <div class="text-4xl mb-4 grayscale opacity-30">{{ currentTab === 'Returns' ? '↩️' : '📥' }}</div>
           <p class="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted italic">No procurement {{ currentTab.toLowerCase() }} found</p>
        </div>
      </div>
      
      <!-- Pagination Component -->
      <div class="pt-6">
        <Pagination 
          :currentPage="currentPage" 
          :totalPages="totalPages" 
          @next="nextPage" 
          @prev="prevPage"
          @setPage="setPage"
        />
      </div>
    </div>

    <!-- Bill Detail Modal -->
    <div v-if="showDetailModal && selectedBill" class="fixed inset-0 flex items-center justify-center p-4 md:p-6 z-[160] bg-black/60 backdrop-blur-[8px] overflow-y-auto">
      <div class="animate-in fade-in zoom-in duration-300 w-full flex justify-center py-6 md:py-10">
        <InvoiceDetail 
          :invoice="selectedBill" 
          :customerName="getSupplierName(selectedBill.supplier_id)"
          @close="showDetailModal = false"
          @edit="handleEdit"
        />
      </div>
    </div>

    <!-- Record Bill Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center p-0 md:p-6 z-[160] bg-black/60 backdrop-blur-md overflow-y-auto">
      <div class="w-full max-w-6xl min-h-screen md:min-h-0 md:my-auto md:rounded-[2.5rem] overflow-hidden border-0 md:border md:border-border shadow-2xl animate-in fade-in zoom-in duration-300 bg-app-bg">
        <div class="px-8 py-5 flex justify-between items-center border-b border-brand/10 shadow-sm sticky top-0 bg-app-bg/80 backdrop-blur-xl z-[170]">
          <div class="flex items-center gap-4">
             <div class="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-colors bg-brand text-white">
                <svg v-if="currentTab === 'Returns'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m15 18-6-6 6-6"/></svg>
                <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
             </div>
             <div>
               <h3 class="font-black text-xl text-text-primary uppercase tracking-tighter">{{ selectedBill ? (selectedBill.document_type === 'Return' ? 'Edit Purchase Return' : 'Edit Purchase Bill') : (currentTab === 'Returns' ? 'New Purchase Return' : 'New Purchase Bill') }}</h3>
               <p class="text-[9px] font-bold text-text-muted uppercase tracking-[0.2em] mt-0.5">Inventory Procurement Log</p>
             </div>
          </div>
          <button @click="showModal = false" class="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-hover-bg text-text-muted hover:text-orange-500 transition-all active:scale-95">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div class="p-4 md:p-8 md:max-h-[85vh] overflow-y-auto custom-scrollbar">
           <TransactionForm 
             type="Purchase"
             :initial-data="selectedBill || { document_type: currentTab === 'Returns' ? 'Return' : 'Bill' }"
             @submit="handleSave" 
             @cancel="showModal = false" 
           />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useTransactionStore } from '../stores/transactions';
import { usePartyStore } from '../stores/parties';
import { useInventoryStore } from '../stores/inventory';
import { useCompanyStore } from '../stores/company';
import { usePagination } from '../composables/usePagination';
import Pagination from '../components/Pagination.vue';
import TransactionForm from '../components/TransactionForm.vue';
import InvoiceDetail from '../components/InvoiceDetail.vue';

const transactionStore = useTransactionStore();
const partyStore = usePartyStore();
const inventoryStore = useInventoryStore();
const companyStore = useCompanyStore();

const currentTab = ref<'Bills' | 'Returns'>('Bills');

const filteredBills = computed(() => {
    return transactionStore.bills.filter(b => {
        if (currentTab.value === 'Returns') return b.document_type === 'Return';
        return b.document_type !== 'Return';
    });
});

const { 
    currentPage, 
    totalPages, 
    paginatedItems: paginatedBills, 
    nextPage, 
    prevPage, 
    setPage 
} = usePagination(filteredBills, 10);

// Reset to page 1 when tab changes
watch(currentTab, () => {
    setPage(1);
});

const showModal = ref(false);
const showDetailModal = ref(false);
const selectedBill = ref<any>(null);

function openCreate() {
    selectedBill.value = null;
    showModal.value = true;
}

function openDetail(bill: any) {
  selectedBill.value = { ...bill, type: 'purchase' };
  showDetailModal.value = true;
}

function handleEdit(bill: any) {
  selectedBill.value = bill;
  showDetailModal.value = false;
  showModal.value = true;
}

const route = useRoute();

onMounted(async () => {
    await transactionStore.fetchBills();
    await partyStore.fetchParties();
    await inventoryStore.fetchItems();

    if (route.query.new === '1') {
        showModal.value = true;
    }
});

async function handleSave(formData: any) {
    // Ensure document_type matches current tab for new entries
    if (!formData.id && !formData.document_type) {
        formData.document_type = currentTab.value === 'Returns' ? 'Return' : 'Bill';
    }

    if (formData.id) {
        await transactionStore.updateBill(formData);
    } else {
        await transactionStore.createBill(formData);
    }
    showModal.value = false;
    selectedBill.value = null;
    await partyStore.fetchParties();
    await transactionStore.fetchBills();
}

function getSupplierName(id: string) {
    return partyStore.parties.find(p => p.id === id)?.name || 'Main Supplier';
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: companyStore.company?.currency || 'PKR',
    maximumFractionDigits: 0
  }).format(val || 0);
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 10px;
}
</style>
