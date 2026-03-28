<template>
  <div class="p-8 max-w-6xl mx-auto font-sans">

    <!-- Header -->
    <header class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b border-border">
      <div>
        <h1 class="text-2xl font-bold text-text-primary">Sales Invoices</h1>
        <p class="text-sm mt-1 text-text-secondary">Issue invoices to customers and track receivables.</p>
      </div>
      <button @click="showModal = true"
        class="w-full sm:w-auto px-4 py-2 rounded text-sm font-bold transition-all bg-text-primary text-card-bg hover:opacity-90">
        + Create Invoice
      </button>
    </header>

    <div class="space-y-6">
      <!-- Professional List UI -->
      <div class="grid grid-cols-1 gap-4">
        <div v-for="inv in paginatedInvoices" :key="inv.id" 
          @click="openDetail(inv)"
          class="group bg-card-bg border border-border rounded-2xl p-6 hover:shadow-xl hover:border-brand/30 transition-all cursor-pointer relative overflow-hidden">
          
          <!-- Background Accent -->
          <div class="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
          
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-hover-bg flex items-center justify-center font-black text-brand text-xs shadow-sm border border-border/50">
                INV
              </div>
              <div>
                <div class="flex items-center gap-2">
                   <h3 class="font-black text-sm text-text-primary uppercase tracking-tight">{{ getCustomerName(inv.customer_id) }}</h3>
                   <span :class="['px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border', 
                      inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                      inv.status === 'Submitted' ? 'bg-brand/10 text-brand border-brand/20' : 
                      'bg-hover-bg text-text-muted border-border']">
                     {{ inv.status }}
                   </span>
                </div>
                <p class="text-[10px] text-text-muted font-bold mt-0.5 font-mono">{{ inv.date || 'No Date' }} • Ref: {{ (inv.id || 'xxxx').split('-')[0]?.toUpperCase() }}</p>
              </div>
            </div>

            <div class="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
              <div class="text-right">
                <p class="text-[9px] font-black uppercase tracking-[0.15em] text-text-muted mb-0.5">Total Amount</p>
                <p class="text-lg font-black text-text-primary tracking-tighter">{{ formatCurrency(inv.total_amount) }}</p>
              </div>
              <button class="w-10 h-10 rounded-xl bg-hover-bg flex items-center justify-center text-text-muted hover:bg-brand hover:text-white transition-all active:scale-90">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
        
        <div v-if="paginatedInvoices.length === 0" class="py-20 text-center bg-card-bg border border-dashed border-border rounded-3xl">
           <p class="text-sm font-bold text-text-muted">No sales invoices found.</p>
        </div>
      </div>
      
      <!-- Pagination Component -->
      <Pagination 
        :currentPage="currentPage" 
        :totalPages="totalPages" 
        @next="nextPage" 
        @prev="prevPage"
        @setPage="setPage"
      />
    </div>

    <!-- Invoice Detail Modal -->
    <div v-if="showDetailModal && selectedInvoice" class="fixed inset-0 flex items-center justify-center p-6 z-[100] bg-black/40 backdrop-blur-[4px] overflow-y-auto">
      <div class="animate-in fade-in zoom-in duration-300 w-full flex justify-center py-10">
        <InvoiceDetail 
          :invoice="selectedInvoice" 
          :customerName="getCustomerName(selectedInvoice.customer_id)"
          @close="showDetailModal = false"
        />
      </div>
    </div>

    <!-- Create Invoice Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center p-6 z-[100] bg-black/40 backdrop-blur-[4px] overflow-y-auto">
      <div class="w-full max-w-5xl my-auto rounded-3xl overflow-hidden border border-border shadow-2xl animate-in fade-in zoom-in duration-300 bg-app-bg">

        <div class="px-8 py-6 flex justify-between items-center bg-card-bg border-b border-border">
          <div class="flex items-center gap-4">
             <div class="w-12 h-12 bg-text-primary text-card-bg rounded-2xl flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="8" x2="16" y1="10" y2="10"/><line x1="8" x2="12" y1="14" y2="14"/></svg>
             </div>
             <div>
               <h3 class="font-black text-xl text-text-primary">New Sales Invoice</h3>
               <p class="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em] mt-0.5">ERP General Ledger Impact</p>
             </div>
          </div>
          <button @click="showModal = false" class="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-hover-bg text-text-muted hover:text-rose-500 transition-all active:scale-95">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div class="p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
div { font-family: 'Inter', sans-serif; }
</style>

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

    // Auto-open modal when navigated from Dashboard with ?new=1
    if (route.query.new === '1') {
        showModal.value = true;
    }
});

async function handleSave(formData: any) {
    await transactionStore.createInvoice(formData);
    showModal.value = false;
}

function getCustomerName(id: string) {
    return partyStore.parties.find(p => p.id === id)?.name || 'Unknown';
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: companyStore.company?.currency || 'PKR'
  }).format(val || 0);
}
</script>
