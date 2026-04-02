<template>
  <div class="page-container">

    <!-- Header -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h1 class="text-heading">Sales Invoices</h1>
        <p class="text-subheading">Revenue & Distribution Tracking</p>
      </div>
      <button @click="showModal = true" class="btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        Create Invoice
      </button>
    </div>

    <!-- Main List/Grid View -->
    <div class="space-y-4">
      <div class="grid grid-cols-1 gap-3">
        <div v-for="inv in paginatedInvoices" :key="inv.id" 
          @click="openDetail(inv)"
          class="group bg-card-bg border border-border rounded-xl p-4 hover:shadow-lg hover:border-brand/40 transition-all cursor-pointer relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          <!-- Modern Status Ribbon -->
          <div class="absolute top-0 right-0 px-3 py-0.5 rounded-bl-lg text-[8px] font-black uppercase tracking-[0.2em] z-20"
            :class="inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-brand/10 text-brand'">
            {{ inv.status }}
          </div>

          <!-- Primary Info -->
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-lg bg-hover-bg flex items-center justify-center border border-border/50 group-hover:scale-110 transition-transform duration-500 relative overflow-hidden">
               <span class="text-[10px] font-black text-brand relative z-10">INV</span>
            </div>
            <div>
              <h3 class="font-bold text-xs text-text-primary uppercase tracking-tight truncate max-w-[200px] md:max-w-md">
                {{ getCustomerName(inv.customer_id) }}
              </h3>
              <div class="flex items-center gap-2 mt-0.5 text-[9px] font-bold text-text-muted uppercase tracking-widest">
                <span>{{ inv.date }}</span>
                <span class="w-1 h-1 rounded-full bg-border"></span>
                <span class="font-mono">#{{ (inv?.id || '').split('-')[0]?.toUpperCase() }}</span>
              </div>
            </div>
          </div>

          <!-- Financial Section -->
          <div class="w-full lg:w-auto flex items-center justify-between lg:justify-end gap-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-border border-dashed">
            <div class="text-right">
              <p class="text-label-small mb-0.5">Grand Total</p>
              <p class="text-lg font-black text-text-primary tracking-tighter tabular-nums">{{ formatCurrency(inv.total_amount) }}</p>
            </div>

            <div class="lg:flex items-center justify-center w-8 h-8 rounded-lg bg-hover-bg text-text-muted group-hover:bg-brand group-hover:text-white transition-all active:scale-90 hidden">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </div>
        </div>
        
        <div v-if="paginatedInvoices.length === 0" class="py-12 text-center card-std border-dashed">
           <p class="text-sm text-text-muted font-medium">No sales history found</p>
        </div>
      </div>
      
      <!-- Pagination -->
      <Pagination 
        :currentPage="currentPage" 
        :totalPages="totalPages" 
        @next="nextPage" 
        @prev="prevPage"
        @setPage="setPage"
      />
    </div>

    <!-- Detail Modal -->
    <div v-if="showDetailModal && selectedInvoice" class="fixed inset-0 flex items-center justify-center p-4 z-[160] bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div class="animate-in fade-in zoom-in duration-300 w-full flex justify-center py-6">
        <InvoiceDetail 
          :invoice="selectedInvoice" 
          :customerName="getCustomerName(selectedInvoice.customer_id)"
          @close="showDetailModal = false"
        />
      </div>
    </div>

    <!-- Create Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center p-4 z-[160] bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div class="w-full max-w-5xl my-auto rounded-xl overflow-hidden border border-border shadow-2xl animate-in fade-in zoom-in duration-300 bg-app-bg">
        <div class="px-6 py-4 flex justify-between items-center bg-card-bg border-b border-border">
          <div class="flex items-center gap-3">
             <div class="w-10 h-10 bg-text-primary text-card-bg rounded-lg flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="8" x2="16" y1="10" y2="10"/><line x1="8" x2="12" y1="14" y2="14"/></svg>
             </div>
             <div>
               <h3 class="font-bold text-lg text-text-primary">Sales Distribution</h3>
               <p class="text-label-small mt-0.5">New Invoice</p>
             </div>
          </div>
          <button @click="showModal = false" class="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-hover-bg text-text-muted hover:text-rose-500 transition-all active:scale-95">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div class="p-6 max-h-[85vh] overflow-y-auto">
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
