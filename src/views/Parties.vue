<template>
  <div class="p-4 md:p-8 max-w-7xl mx-auto min-h-screen relative font-sans">
    
    <!-- Header -->
    <header class="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-4 border-b border-border">
      <div>
        <h1 class="text-2xl font-bold text-text-primary">Parties</h1>
        <p class="text-sm mt-1 text-text-secondary">Manage customers, suppliers and their balances.</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <!-- Filter Tabs -->
        <div class="flex flex-wrap bg-hover-bg p-1 rounded-lg border border-border gap-1">
          <button 
            v-for="f in ['All', 'Customer', 'Supplier', 'Salesman', 'Transporter', 'Agent', 'Walk-in', 'Both']" 
            :key="f"
            @click="filter = f as any"
            :class="['px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all', filter === f ? 'bg-card-bg shadow-sm text-text-primary' : 'text-text-muted hover:text-text-secondary']"
          >
            {{ f === 'Both' ? 'Associate' : f }}
          </button>
        </div>
        <button @click="showModal = true"
          class="flex-1 sm:flex-none px-5 py-2 rounded-lg text-sm font-bold transition-all bg-text-primary text-card-bg hover:opacity-90 hover:shadow-lg active:scale-95 text-center"
        >
          + Add Party
        </button>
      </div>
    </header>

    <!-- Card Grid -->
    <div class="space-y-8">
      <TransitionGroup 
        name="list" 
        tag="div" 
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <PartyCard 
          v-for="p in paginatedParties" 
          :key="p.id" 
          :party="p"
          @click="selectedParty = p"
        />
      </TransitionGroup>

      <!-- Pagination Component -->
      <Pagination 
        :currentPage="currentPage" 
        :totalPages="totalPages" 
        @next="nextPage" 
        @prev="prevPage"
        @setPage="setPage"
      />
    </div>

    <!-- Empty State -->
    <div v-if="paginatedParties.length === 0" class="py-20 text-center">
       <div class="w-16 h-16 bg-hover-bg rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-text-muted/50"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
       </div>
       <p class="text-sm font-medium text-text-muted">No {{ filter.toLowerCase() }}s found matching your criteria.</p>
    </div>

    <!-- Payment Modal -->
    <div v-if="showPaymentModal" class="fixed inset-0 flex items-center justify-center p-6 z-[100] bg-black/40 backdrop-blur-[4px] overflow-y-auto">
      <div class="w-full max-w-2xl my-auto rounded-3xl overflow-hidden border border-border shadow-2xl animate-in fade-in zoom-in duration-300 bg-app-bg">
        <div class="px-8 py-6 flex justify-between items-center bg-card-bg border-b border-border">
          <div class="flex items-center gap-4">
             <div class="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
             </div>
             <div>
               <h3 class="font-black text-xl text-text-primary">Record Payment</h3>
               <p class="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em] mt-0.5">Adjust Accounts for {{ selectedParty?.name }}</p>
             </div>
          </div>
          <button @click="showPaymentModal = false" class="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-hover-bg text-text-muted hover:text-rose-500 transition-all active:scale-95">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div class="p-8">
           <PaymentForm 
             :party="selectedParty" 
             @submit="handlePaymentSubmit" 
             @cancel="showPaymentModal = false" 
           />
        </div>
      </div>
    </div>

    <!-- Detail Sidebar -->
    <PartyDetailSide 
      :party="selectedParty" 
      @close="selectedParty = null" 
      @edit="handleEditRequest"
      @recordPayment="openPaymentModal"
    />

    <!-- Add Modal (Updated with ERP Form) -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center p-6 z-[100] bg-black/40 backdrop-blur-[4px] overflow-y-auto">
      <div class="w-full max-w-4xl my-auto rounded-3xl overflow-hidden border border-border shadow-2xl animate-in fade-in zoom-in duration-300 bg-app-bg">

        <div class="px-8 py-6 flex justify-between items-center bg-card-bg border-b border-border">
          <div class="flex items-center gap-4">
             <div class="w-12 h-12 bg-text-primary text-card-bg rounded-2xl flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
             </div>
             <div>
               <h3 class="font-black text-xl text-text-primary">{{ isEditMode ? 'Edit Party Profile' : 'Professional Party Onboarding' }}</h3>
               <p class="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em] mt-0.5">ERP-Level Business Records</p>
             </div>
          </div>
          <button @click="closeModal" class="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-hover-bg text-text-muted hover:text-rose-500 transition-all active:scale-95">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div class="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
           <PartyForm 
             :initialData="isEditMode ? selectedParty : null" 
             @submit="handleFormSubmit" 
             @cancel="closeModal" 
           />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { usePartyStore } from '../stores/parties';
import type { Party } from '../types/party';
import PartyCard from '../components/PartyCard.vue';
import PartyDetailSide from '../components/PartyDetailSide.vue';
import { usePagination } from '../composables/usePagination';
import Pagination from '../components/Pagination.vue';
import PartyForm from '../components/PartyForm.vue';
import PaymentForm from '../components/PaymentForm.vue';
import { useTransactionStore } from '../stores/transactions';

const partyStore = usePartyStore();
const transactionStore = useTransactionStore();
const showModal = ref(false);
const showPaymentModal = ref(false);
const isEditMode = ref(false);
const filter = ref<'All' | 'Customer' | 'Supplier' | 'Salesman' | 'Transporter' | 'Agent' | 'Walk-in' | 'Both'>('All');
const selectedParty = ref<Party | null>(null);

const filteredParties = computed(() => {
  if (filter.value === 'All') return partyStore.parties;
  return partyStore.parties.filter(p => p.type === filter.value);
});

const { 
    currentPage, 
    totalPages, 
    paginatedItems: paginatedParties, 
    nextPage, 
    prevPage, 
    setPage 
} = usePagination(computed(() => filteredParties.value), 12);

// Reset pagination when filter changes
watch(filter, () => {
    currentPage.value = 1;
});

// Form state is now handled internally by PartyForm.
// We only need to track the party being edited if in edit mode.


onMounted(() => {
    partyStore.fetchParties();
});

function handleEditRequest(party: Party) {
    isEditMode.value = true;
    selectedParty.value = party;
    showModal.value = true;
}

function closeModal() {
    showModal.value = false;
    isEditMode.value = false;
}

function openPaymentModal() {
    showPaymentModal.value = true;
}

async function handlePaymentSubmit(paymentData: any) {
    await transactionStore.createPayment(paymentData);
    await partyStore.fetchParties(); // Refresh balances
    showPaymentModal.value = false;
}

async function handleFormSubmit(partyData: Party) {
    if (isEditMode.value) {
        await partyStore.updateParty(partyData);
        // Update selectedParty if the currently viewed party was edited
        if (selectedParty.value && selectedParty.value.id === partyData.id) {
            selectedParty.value = { ...partyData };
        }
    } else {
        await partyStore.addParty(partyData);
    }
    closeModal();
}
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Ensure leave animation works correctly with grid */
.list-leave-active {
  position: absolute;
}
</style>
