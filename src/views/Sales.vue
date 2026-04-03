<template>
  <div class="page-container">

    <!-- Header -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
      <div>
        <h1 class="text-3xl font-black text-text-primary tracking-tighter uppercase">{{ currentTab === 'Invoices' ? 'Sales Invoices' : 'Sales Returns' }}</h1>
        <p class="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mt-1 italic">{{ currentTab === 'Invoices' ? 'Revenue & Distribution Tracking' : 'Product Return Management' }}</p>
      </div>
      
      <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <!-- Tab Switcher -->
        <div class="bg-hover-bg/50 p-1 rounded-2xl border border-border flex items-center gap-1 shadow-inner">
          <button 
            @click="currentTab = 'Invoices'"
            :class="[
              'px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300',
              currentTab === 'Invoices' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-text-muted hover:text-text-primary hover:bg-hover-bg'
            ]"
          >
            Invoices
          </button>
          <button 
            @click="currentTab = 'Returns'"
            :class="[
              'px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300',
              currentTab === 'Returns' ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' : 'text-text-muted hover:text-rose-600 hover:bg-rose-50'
            ]"
          >
            Returns
          </button>
        </div>

        <button @click="openCreate" 
          :class="[
            'px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl flex items-center gap-2 active:scale-95',
            currentTab === 'Invoices' ? 'bg-brand text-white shadow-brand/20 hover:opacity-90' : 'bg-rose-600 text-white shadow-rose-200 hover:bg-rose-700'
          ]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"/><path d="M12 5v14"/>
          </svg>
          {{ currentTab === 'Invoices' ? 'New Invoice' : 'New Return' }}
        </button>
      </div>
    </div>

    <!-- Main List/Grid View -->
    <div class="space-y-4">
      <div class="grid grid-cols-1 gap-3">
        <div v-for="inv in paginatedInvoices" :key="inv.id" 
          @click="openDetail(inv)"
          :class="[
            'group bg-card-bg border rounded-[2rem] p-5 hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6',
            currentTab === 'Returns' ? 'hover:border-rose-400/40' : 'hover:border-brand/40'
          ]"
        >
          <!-- Status Ribbon -->
          <div class="absolute top-0 right-0 px-4 py-1 rounded-bl-2xl text-[8px] font-black uppercase tracking-[0.25em] z-20"
            :class="inv.document_type === 'Return' ? 'bg-rose-600 text-white' : (inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-brand/10 text-brand')">
            {{ inv.document_type === 'Return' ? 'Sale Return' : inv.status }}
          </div>

          <!-- Vertical Type Indicator -->
          <div class="absolute inset-y-0 left-0 w-1 pt-12">
             <div :class="['h-1/2 w-full', currentTab === 'Returns' ? 'bg-rose-500' : 'bg-brand']"></div>
          </div>

          <!-- Primary Info -->
          <div class="flex items-center gap-6 pl-2">
            <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 relative overflow-hidden', 
              currentTab === 'Returns' ? 'bg-rose-50 border-rose-100 group-hover:scale-110' : 'bg-brand/5 border-brand/10 group-hover:bg-brand/10 group-hover:scale-110']">
               <span class="text-[11px] font-black relative z-10" :class="currentTab === 'Returns' ? 'text-rose-600' : 'text-brand'">{{ currentTab === 'Returns' ? 'RET' : 'INV' }}</span>
            </div>
            <div>
              <h3 class="font-black text-xs md:text-sm text-text-primary uppercase tracking-tight truncate max-w-[200px] md:max-w-md">
                {{ getCustomerName(inv.customer_id) }}
              </h3>
              <div class="flex items-center gap-3 mt-1 text-[9px] font-bold text-text-muted uppercase tracking-widest">
                <span>{{ inv.date }}</span>
                <span class="w-1 h-1 rounded-full bg-border"></span>
                <span class="font-mono text-[10px] text-text-primary/70">#{{ (inv?.id || '').split('-')[0]?.toUpperCase() }}</span>
              </div>
            </div>
          </div>

          <!-- Financial Section -->
          <div class="w-full lg:w-auto flex items-center justify-between lg:justify-end gap-10 pt-4 lg:pt-0 border-t lg:border-t-0 border-border border-dashed">
            <div class="text-right">
              <p class="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">{{ currentTab === 'Returns' ? 'Return Total' : 'Grand Total' }}</p>
              <p :class="['text-2xl font-black tracking-tighter tabular-nums', currentTab === 'Returns' ? 'text-rose-600' : 'text-text-primary']">{{ formatCurrency(inv.total_amount) }}</p>
            </div>

            <div :class="['lg:flex items-center justify-center w-10 h-10 rounded-xl bg-hover-bg text-text-muted transition-all active:scale-90 hidden group-hover:text-white shadow-sm', 
              currentTab === 'Returns' ? 'group-hover:bg-rose-600' : 'group-hover:bg-brand']">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </div>
        </div>
        
        <div v-if="paginatedInvoices.length === 0" class="py-24 text-center bg-card-bg border-2 border-dashed border-border rounded-[3rem] opacity-60">
           <div class="text-4xl mb-4 grayscale opacity-30">{{ currentTab === 'Returns' ? '↩️' : '🧾' }}</div>
           <p class="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted italic">No {{ currentTab.toLowerCase() }} found in current period</p>
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

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center p-0 md:p-6 z-[160] bg-black/60 backdrop-blur-md overflow-y-auto">
      <div class="w-full max-w-6xl min-h-screen md:min-h-0 md:my-auto md:rounded-[2.5rem] overflow-hidden border-0 md:border md:border-border shadow-2xl bg-app-bg animate-in fade-in zoom-in duration-300">
        <div class="px-8 py-5 flex justify-between items-center border-b border-border shadow-sm sticky top-0 bg-app-bg/80 backdrop-blur-xl z-[170]"
          :class="currentTab === 'Returns' || (selectedInvoice?.document_type === 'Return') ? 'border-rose-100' : 'border-brand/10'">
          <div class="flex items-center gap-4">
             <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-colors', 
               (currentTab === 'Returns' || selectedInvoice?.document_type === 'Return') ? 'bg-rose-600 text-white' : 'bg-brand text-white']">
                <svg v-if="currentTab === 'Returns' || selectedInvoice?.document_type === 'Return'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m15 18-6-6 6-6"/></svg>
                <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 2l10 6.5v7L12 22 2 15.5v-7L12 2z"/></svg>
             </div>
             <div>
               <h3 class="font-black text-xl text-text-primary uppercase tracking-tighter">{{ selectedInvoice ? (selectedInvoice.document_type === 'Return' ? 'Edit Return' : 'Edit Invoice') : (currentTab === 'Returns' ? 'New Sales Return' : 'New Sale Invoice') }}</h3>
               <p class="text-[9px] font-bold text-text-muted uppercase tracking-[0.2em] mt-0.5">Pharmaceutical Distribution Recording</p>
             </div>
          </div>
          <button @click="closeModal" class="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-hover-bg text-text-muted hover:text-rose-500 transition-all active:scale-95">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div class="p-4 md:p-8 md:max-h-[85vh] overflow-y-auto custom-scrollbar">
           <TransactionForm 
             :type="'Sales'"
             :initial-data="selectedInvoice || { document_type: currentTab === 'Returns' ? 'Return' : 'Invoice' }"
             @submit="handleSave" 
             @cancel="closeModal" 
           />
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="showDetailModal && selectedInvoice" class="fixed inset-0 flex items-center justify-center p-4 z-[160] bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div class="animate-in fade-in zoom-in duration-300 w-full flex justify-center py-6">
        <InvoiceDetail 
          :invoice="selectedInvoice" 
          :customerName="getCustomerName(selectedInvoice.customer_id)"
          @close="showDetailModal = false"
          @edit="handleEdit"
        />
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

const currentTab = ref<'Invoices' | 'Returns'>('Invoices');

const filteredInvoices = computed(() => {
    return transactionStore.invoices.filter(i => {
        if (currentTab.value === 'Returns') return i.document_type === 'Return';
        return i.document_type !== 'Return';
    });
});

const { 
    currentPage, 
    totalPages, 
    paginatedItems: paginatedInvoices, 
    nextPage, 
    prevPage, 
    setPage 
} = usePagination(filteredInvoices, 10);

// Reset to page 1 when tab changes
watch(currentTab, () => {
    setPage(1);
});

const showModal = ref(false);
const showDetailModal = ref(false);
const selectedInvoice = ref<any>(null);

function openCreate() {
    selectedInvoice.value = null;
    showModal.value = true;
}

function openDetail(inv: any) {
  selectedInvoice.value = inv;
  showDetailModal.value = true;
}

function closeModal() {
  showModal.value = false;
  selectedInvoice.value = null;
}

function handleEdit(inv: any) {
  selectedInvoice.value = inv;
  showDetailModal.value = false;
  showModal.value = true;
}

const route = useRoute();

onMounted(async () => {
    await transactionStore.fetchInvoices();
    await partyStore.fetchParties();
    await inventoryStore.fetchItems();

    if (route.query.new === '1') {
        showModal.value = true;
    }
});

async function handleSave(formData: any) {
    // Ensure document_type matches current tab for new entries if not explicitly set
    if (!formData.id && !formData.document_type) {
        formData.document_type = currentTab.value === 'Returns' ? 'Return' : 'Invoice';
    }
    
    await transactionStore.createInvoice(formData);
    showModal.value = false;
    await partyStore.fetchParties();
    await transactionStore.fetchInvoices();
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
