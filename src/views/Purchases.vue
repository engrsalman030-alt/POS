<template>
  <div class="p-8 max-w-6xl mx-auto font-sans">

    <!-- Header -->
    <header class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b border-border">
      <div>
        <h1 class="text-2xl font-bold text-text-primary">Purchase Bills</h1>
        <p class="text-sm mt-1 text-text-secondary">Record bills from suppliers and track payables.</p>
      </div>
      <button @click="showModal = true"
        class="w-full sm:w-auto px-4 py-2 rounded text-sm font-bold transition-all bg-text-primary text-card-bg hover:opacity-90">
        + Create Bill
      </button>
    </header>

    <!-- Table -->
    <div class="space-y-6">
      <!-- Professional List UI -->
      <div class="grid grid-cols-1 gap-4">
        <div v-for="bill in paginatedBills" :key="bill.id" 
          class="group bg-card-bg border border-border rounded-2xl p-6 hover:shadow-xl hover:border-emerald-500/30 transition-all cursor-pointer relative overflow-hidden">
          
          <!-- Background Accent -->
          <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
          
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-hover-bg flex items-center justify-center font-black text-emerald-600 text-xs shadow-sm border border-border/50">
                BILL
              </div>
              <div>
                <div class="flex items-center gap-2">
                   <h3 class="font-black text-sm text-text-primary uppercase tracking-tight">{{ getSupplierName(bill.supplier_id) }}</h3>
                   <span :class="['px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border', 
                      bill.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                      bill.status === 'Submitted' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 
                      'bg-hover-bg text-text-muted border-border']">
                     {{ bill.status }}
                   </span>
                </div>
                <p class="text-[10px] text-text-muted font-bold mt-0.5 font-mono">{{ bill?.date || 'No Date' }} • Ref: {{ (bill?.id?.toString() || 'xxxx').split('-')[0]?.toUpperCase() }}</p>
              </div>
            </div>

            <div class="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
              <div class="text-right">
                <p class="text-[9px] font-black uppercase tracking-[0.15em] text-text-muted mb-0.5">Total Amount</p>
                <p class="text-lg font-black text-text-primary tracking-tighter">{{ formatCurrency(bill.total_amount) }}</p>
              </div>
              <button class="w-10 h-10 rounded-xl bg-hover-bg flex items-center justify-center text-text-muted hover:bg-emerald-500 hover:text-white transition-all active:scale-90">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
        
        <div v-if="paginatedBills.length === 0" class="py-20 text-center bg-card-bg border border-dashed border-border rounded-3xl">
           <p class="text-sm font-bold text-text-muted">No purchase bills found.</p>
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

    <!-- Modal (Updated with TransactionForm) -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center p-6 z-[100] bg-black/40 backdrop-blur-[4px] overflow-y-auto">
      <div class="w-full max-w-5xl my-auto rounded-3xl overflow-hidden border border-border shadow-2xl animate-in fade-in zoom-in duration-300 bg-app-bg">

        <div class="px-8 py-6 flex justify-between items-center bg-card-bg border-b border-border">
          <div class="flex items-center gap-4">
             <div class="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M12 11.5V14"/><path d="M15.5 13H14"/><path d="M10 13h1.5"/><path d="M8 6h8"/><path d="M8 10h8"/></svg>
             </div>
             <div>
               <h3 class="font-black text-xl text-text-primary">New Purchase Bill</h3>
               <p class="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em] mt-0.5">Inventory & Accounts Payable Impact</p>
             </div>
          </div>
          <button @click="showModal = false" class="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-hover-bg text-text-muted hover:text-rose-500 transition-all active:scale-95">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div class="p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
div { font-family: 'Inter', sans-serif; }
</style>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useTransactionStore } from '../stores/transactions';
import { usePartyStore } from '../stores/parties';
import { useInventoryStore } from '../stores/inventory';
import { useCompanyStore } from '../stores/company';
import { usePagination } from '../composables/usePagination';
import Pagination from '../components/Pagination.vue';
import TransactionForm from '../components/TransactionForm.vue';

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

onMounted(() => {
    transactionStore.fetchBills();
    partyStore.fetchParties();
    inventoryStore.fetchItems();
});

async function handleSave(formData: any) {
    await transactionStore.createBill(formData);
    showModal.value = false;
}

function getSupplierName(id: string) {
    return partyStore.parties.find(p => p.id === id)?.name || 'Unknown';
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: companyStore.company?.currency || 'PKR'
  }).format(val || 0);
}
</script>
