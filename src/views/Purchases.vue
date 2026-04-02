<template>
  <div class="page-container">
    <!-- Header -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h1 class="text-heading">Purchase Bills</h1>
        <p class="text-subheading">Procurement & Inventory Inbound</p>
      </div>
      <button @click="showModal = true" class="btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        Record Bill
      </button>
    </div>

    <div class="space-y-4">
      <div class="grid grid-cols-1 gap-3">
        <div v-for="bill in paginatedBills" :key="bill.id" 
          @click="openDetail(bill)"
          class="group card-std p-4 hover:shadow-lg hover:border-brand/40 transition-all cursor-pointer relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          <!-- Modern Status Ribbon -->
          <div class="absolute top-0 right-0 px-3 py-0.5 rounded-bl-lg text-[8px] font-black uppercase tracking-[0.2em] z-20 bg-rose-500/10 text-rose-500">
            {{ bill.status }}
          </div>
 
          <!-- Primary Info -->
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-lg bg-hover-bg flex items-center justify-center border border-border/50 group-hover:scale-110 transition-transform duration-500 relative overflow-hidden">
               <span class="text-[10px] font-black text-rose-500 relative z-10">BILL</span>
            </div>
            <div>
              <h3 class="font-bold text-xs text-text-primary uppercase tracking-tight truncate max-w-[200px] md:max-w-md">
                {{ getSupplierName(bill.supplier_id) }}
              </h3>
              <div class="flex items-center gap-2 mt-0.5 text-[9px] font-bold text-text-muted uppercase tracking-widest">
                <span>{{ bill.date }}</span>
                <span class="w-1 h-1 rounded-full bg-border"></span>
                <span class="font-mono">#{{ (bill?.id || '').split('-')[0]?.toUpperCase() }}</span>
              </div>
            </div>
          </div>
 
          <!-- Financial Section -->
          <div class="w-full lg:w-auto flex items-center justify-between lg:justify-end gap-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-border border-dashed">
            <div class="text-right">
              <p class="text-label-small mb-0.5">Total Payable</p>
              <p class="text-lg font-black text-rose-600 tracking-tighter tabular-nums">{{ formatCurrency(bill.total_amount) }}</p>
            </div>
 
            <div class="lg:flex items-center justify-center w-8 h-8 rounded-lg bg-hover-bg text-text-muted group-hover:bg-rose-500 group-hover:text-white transition-all active:scale-90 hidden">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </div>
        </div>
        
        <div v-if="paginatedBills.length === 0" class="py-24 text-center bg-card-bg border border-dashed border-border rounded-[2.5rem]">
           <p class="text-sm font-black text-text-muted uppercase tracking-[0.2em]">No procurement history found.</p>
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

    <!-- Bill Detail Modal -->
    <div v-if="showDetailModal && selectedBill" class="fixed inset-0 flex items-center justify-center p-4 md:p-6 z-[160] bg-black/60 backdrop-blur-[8px] overflow-y-auto">
      <div class="animate-in fade-in zoom-in duration-300 w-full flex justify-center py-6 md:py-10">
        <InvoiceDetail 
          :invoice="selectedBill" 
          :customerName="getSupplierName(selectedBill.supplier_id)"
          @close="showDetailModal = false"
        />
      </div>
    </div>

    <!-- Record Bill Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center p-0 md:p-6 z-[160] bg-black/60 backdrop-blur-[8px] overflow-y-auto">
      <div class="w-full max-w-5xl min-h-screen md:min-h-0 md:my-auto md:rounded-[2.5rem] overflow-hidden border-0 md:border md:border-border shadow-2xl animate-in fade-in slide-in-from-bottom-10 lg:zoom-in duration-300 bg-app-bg">

        <div class="px-6 md:px-8 py-5 md:py-6 flex justify-between items-center bg-card-bg border-b border-border sticky top-0 z-[170]">
          <div class="flex items-center gap-4">
             <div class="w-10 h-10 md:w-12 md:h-12 bg-rose-500 text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
             </div>
             <div>
               <h3 class="font-black text-lg md:text-xl text-text-primary uppercase tracking-tighter">New Purchase Bill</h3>
               <p class="text-[9px] text-text-muted font-bold uppercase tracking-[0.2em] mt-0.5">Recording Stock Procurement</p>
             </div>
          </div>
          <button @click="showModal = false" class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl hover:bg-hover-bg text-text-muted hover:text-rose-500 transition-all active:scale-95">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div class="p-4 md:p-8 md:max-h-[85vh] overflow-y-auto custom-scrollbar">
           <TransactionForm 
             type="Purchase"
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
    paginatedItems: paginatedBills, 
    nextPage, 
    prevPage, 
    setPage 
} = usePagination(computed(() => transactionStore.bills), 10);

const showModal = ref(false);
const showDetailModal = ref(false);
const selectedBill = ref<any>(null);

function openDetail(bill: any) {
  selectedBill.value = bill;
  showDetailModal.value = true;
}

const route = useRoute();

onMounted(() => {
    transactionStore.fetchBills();
    partyStore.fetchParties();
    inventoryStore.fetchItems();

    if (route.query.new === '1') {
        showModal.value = true;
    }
});

async function handleSave(formData: any) {
    await transactionStore.createBill(formData);
    showModal.value = false;
    await partyStore.fetchParties(); // Refresh balances for debt tracking
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
