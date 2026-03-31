<template>
  <div class="px-4 md:px-8 py-6 md:py-8 max-w-7xl mx-auto min-h-screen font-sans bg-app-bg">

    <!-- Responsive Header Specialist for Medicine Distribution -->
    <header class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-border">
      <div class="space-y-1">
        <h1 class="text-2xl md:text-3xl font-black text-text-primary tracking-tight uppercase">Sales Invoices</h1>
        <p class="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Revenue & Distribution Tracking
        </p>
      </div>
      <button @click="showModal = true"
        class="w-full md:w-auto px-6 py-3 rounded-xl bg-text-primary text-card-bg text-sm font-black uppercase tracking-widest transition-all hover:opacity-90 hover:shadow-2xl hover:shadow-text-primary/20 active:scale-95 flex items-center justify-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        Create Invoice
      </button>
    </header>

    <!-- Main List/Grid View -->
    <div class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
        <div v-for="inv in paginatedInvoices" :key="inv.id" 
          @click="openDetail(inv)"
          class="group bg-card-bg border border-border rounded-2xl p-5 md:p-6 hover:shadow-2xl hover:border-brand/40 transition-all cursor-pointer relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <!-- Modern Status Ribbon -->
          <div class="absolute top-0 right-0 px-4 py-1 rounded-bl-xl text-[8px] font-black uppercase tracking-[0.2em] z-20"
            :class="inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-brand/10 text-brand'">
            {{ inv.status }}
          </div>

          <!-- Primary Info -->
          <div class="flex items-center gap-4 md:gap-6">
            <div class="w-14 h-14 rounded-2xl bg-hover-bg flex items-center justify-center border border-border/50 group-hover:scale-110 transition-transform duration-500 relative overflow-hidden">
               <div class="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <span class="text-xs font-black text-brand relative z-10">INV</span>
            </div>
            <div>
              <h3 class="font-black text-sm md:text-base text-text-primary uppercase tracking-tight truncate max-w-[200px] md:max-w-md">
                {{ getCustomerName(inv.customer_id) }}
              </h3>
              <div class="flex items-center gap-3 mt-1 text-[10px] font-bold text-text-muted font-mono uppercase tracking-widest">
                <span>{{ inv.date }}</span>
                <span class="w-1 h-1 rounded-full bg-border"></span>
                <span>ID: {{ inv.id.split('-')[0].toUpperCase() }}</span>
              </div>
            </div>
          </div>

          <!-- Financial/Metadata Section (Dynamic for Grid/List) -->
          <div class="w-full lg:w-auto flex items-center justify-between lg:justify-end gap-6 md:gap-12 pt-4 lg:pt-0 border-t lg:border-t-0 border-border border-dashed">
            
            <div v-if="inv.sales_manager" class="hidden sm:block">
              <p class="text-[9px] font-black uppercase tracking-[0.15em] text-text-muted mb-1 italic">Manager</p>
              <p class="text-xs font-bold text-text-secondary">{{ inv.sales_manager }}</p>
            </div>

            <div class="text-right">
              <p class="text-[9px] font-black uppercase tracking-[0.15em] text-text-muted mb-1">Grand Total</p>
              <p class="text-xl md:text-2xl font-black text-text-primary tracking-tighter tabular-nums">{{ formatCurrency(inv.total_amount) }}</p>
            </div>

            <div class="lg:flex items-center justify-center w-10 h-10 rounded-xl bg-hover-bg text-text-muted group-hover:bg-brand group-hover:text-white transition-all active:scale-90 hidden">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </div>
        </div>
        
        <div v-if="paginatedInvoices.length === 0" class="py-24 text-center bg-card-bg border border-dashed border-border rounded-[2.5rem] animate-pulse">
           <p class="text-sm font-black text-text-muted uppercase tracking-[0.2em]">No drug distributions history found.</p>
        </div>
      </div>
      
      <!-- Responsive Pagination -->
      <div class="py-4 overflow-x-auto">
        <Pagination 
          :currentPage="currentPage" 
          :totalPages="totalPages" 
          @next="nextPage" 
          @prev="prevPage"
          @setPage="setPage"
        />
      </div>
    </div>

    <!-- Full Screen Invoice Detail Modal -->
    <div v-if="showDetailModal && selectedInvoice" class="fixed inset-0 flex items-center justify-center p-4 md:p-6 z-[160] bg-black/60 backdrop-blur-[8px] overflow-y-auto">
      <div class="animate-in fade-in zoom-in duration-300 w-full flex justify-center py-6 md:py-10">
        <InvoiceDetail 
          :invoice="selectedInvoice" 
          :customerName="getCustomerName(selectedInvoice.customer_id)"
          @close="showDetailModal = false"
        />
      </div>
    </div>

    <!-- Create Invoice Modal (Mobile Optimization) -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center p-0 md:p-6 z-[160] bg-black/60 backdrop-blur-[8px] overflow-y-auto">
      <div class="w-full max-w-5xl min-h-screen md:min-h-0 md:my-auto md:rounded-[2.5rem] overflow-hidden border-0 md:border md:border-border shadow-2xl animate-in fade-in slide-in-from-bottom-10 lg:zoom-in duration-300 bg-app-bg">

        <div class="px-6 md:px-8 py-5 md:py-6 flex justify-between items-center bg-card-bg border-b border-border sticky top-0 z-[170]">
          <div class="flex items-center gap-4">
             <div class="w-10 h-10 md:w-12 md:h-12 bg-text-primary text-card-bg rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="8" x2="16" y1="10" y2="10"/><line x1="8" x2="12" y1="14" y2="14"/></svg>
             </div>
             <div>
               <h3 class="font-black text-lg md:text-xl text-text-primary">Sales Distribution</h3>
               <p class="text-[9px] text-text-muted font-bold uppercase tracking-[0.2em] mt-0.5">Inventory Outbound Movement</p>
             </div>
          </div>
          <button @click="showModal = false" class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl hover:bg-hover-bg text-text-muted hover:text-rose-500 transition-all active:scale-95">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div class="p-4 md:p-8 md:max-h-[85vh] overflow-y-auto custom-scrollbar">
           <TransactionForm 
             type="Sales"
             @submit="handleSave" 
             @cancel="showModal = false" 
           />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
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

const { 
    currentPage, 
    totalPages, 
    paginatedItems: paginatedInvoices, 
    nextPage, 
    prevPage, 
    setPage 
} = usePagination(computed(() => transactionStore.invoices), 10);

const showModal = ref(false);
const showDetailModal = ref(false);
const selectedInvoice = ref<any>(null);

function openDetail(inv: any) {
  selectedInvoice.value = inv;
  showDetailModal.value = true;
}

const route = useRoute();

onMounted(() => {
    transactionStore.fetchInvoices();
    partyStore.fetchParties();
    inventoryStore.fetchItems();

    if (route.query.new === '1') {
        showModal.value = true;
    }
});

async function handleSave(formData: any) {
    await transactionStore.createInvoice(formData);
    showModal.value = false;
    await partyStore.fetchParties(); // Refresh balances for debt tracking
}

function getCustomerName(id: string) {
    return partyStore.parties.find(p => p.id === id)?.name || 'Walk-in Customer';
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
