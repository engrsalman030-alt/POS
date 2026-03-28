<template>
  <Transition name="slide">
    <div v-if="party" class="fixed inset-y-0 right-0 w-full max-w-md bg-card-bg shadow-2xl z-[150] flex flex-col border-l border-border">
      <!-- Header -->
      <div class="px-6 py-6 border-b border-border flex justify-between items-center bg-hover-bg">
        <div>
          <h2 class="text-xs font-black uppercase tracking-widest text-text-muted mb-1">Party Detail</h2>
          <p class="text-xl font-bold text-text-primary">{{ party.name }}</p>
        </div>
        <button @click="$emit('close')" class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-app-bg transition-colors text-text-muted">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
        <!-- Overview -->
        <div class="grid grid-cols-2 gap-8">
          <div>
            <p class="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Type</p>
            <span 
              class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded"
              :class="party.type === 'Customer' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'"
            >
              {{ party.type }}
            </span>
          </div>
          <div>
            <p class="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Tax ID / NTN</p>
            <p class="text-xs font-mono font-bold text-text-primary">{{ party.tax_id || 'Not provided' }}</p>
          </div>
          <div>
            <p class="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5">CNIC</p>
            <p class="text-xs font-mono font-bold text-text-primary">{{ party.cnic || 'Not provided' }}</p>
          </div>
        </div>

        <!-- Contact Info -->
        <div class="space-y-6">
          <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/50">Contact Information</h3>
          
          <div class="flex items-center gap-4 group">
            <div class="w-10 h-10 rounded-lg bg-hover-bg flex items-center justify-center border border-border group-hover:border-text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-text-muted"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </div>
            <div>
              <p class="text-[9px] font-bold text-text-muted uppercase tracking-widest">Email</p>
              <p class="text-sm font-medium text-text-primary">{{ party.email || '—' }}</p>
            </div>
          </div>

          <div class="flex items-center gap-4 group">
            <div class="w-10 h-10 rounded-lg bg-hover-bg flex items-center justify-center border border-border group-hover:border-text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-text-muted"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <div>
              <p class="text-[9px] font-bold text-text-muted uppercase tracking-widest">Phone</p>
              <p class="text-sm font-medium text-text-primary">{{ party.phone || '—' }}</p>
            </div>
          </div>

          <div class="flex items-center gap-4 group">
            <div class="w-10 h-10 rounded-lg bg-hover-bg flex items-center justify-center border border-border group-hover:border-text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-text-muted"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div>
              <p class="text-[9px] font-bold text-text-muted uppercase tracking-widest">Address</p>
              <p class="text-sm font-medium text-text-primary leading-relaxed">{{ party.address || '—' }}</p>
            </div>
          </div>
        </div>

        <!-- Financial Summary -->
        <div class="bg-hover-bg rounded-xl p-6 border border-border">
           <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-4">Financial Standing</h3>
           <div class="flex justify-between items-end">
              <div>
                <p class="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1">Outstanding Balance</p>
                <p class="text-2xl font-black" :class="party.type === 'Customer' ? 'text-text-primary' : 'text-rose-500'">
                  {{ formatCurrency(party.balance || 0) }}
                </p>
              </div>
              <div class="pb-1">
                 <span class="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-card-bg border border-border text-text-primary">
                   Active
                 </span>
              </div>
           </div>
        </div>

        <!-- Account Settings -->
        <div class="pt-6 border-t border-border">
           <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/50 mb-4">Account Settings</h3>
           <div class="grid grid-cols-2 gap-4">
              <div class="p-3 bg-hover-bg rounded border border-border">
                <p class="text-[8px] font-bold text-text-muted uppercase tracking-widest mb-1">Receivable Account</p>
                <p class="text-[10px] font-black text-text-primary">{{ party.receivable_account_id || 'N/A' }}</p>
              </div>
              <div class="p-3 bg-hover-bg rounded border border-border">
                <p class="text-[8px] font-bold text-text-muted uppercase tracking-widest mb-1">Payable Account</p>
                <p class="text-[10px] font-black text-text-primary">{{ party.payable_account_id || 'N/A' }}</p>
              </div>
           </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="p-6 border-t border-border flex gap-3">
        <button 
          @click="$emit('edit', party)"
          class="flex-1 px-4 py-2 border border-border rounded text-xs font-bold transition-all bg-card-bg text-text-secondary hover:bg-hover-bg"
        >
          Edit Party
        </button>
        <button 
          class="flex-1 px-4 py-2 rounded text-xs font-bold transition-all bg-text-primary text-card-bg hover:opacity-90"
        >
          New Transaction
        </button>
      </div>
    </div>
  </Transition>

  <!-- Overlay Backdrop -->
  <Transition name="fade">
    <div v-if="party" @click="$emit('close')" class="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[145]"></div>
  </Transition>
</template>

<script setup lang="ts">
import {} from 'vue';
import type { Party } from '../types/party';
import { useCompanyStore } from '../stores/company';

const props = defineProps<{
  party: Party | null;
}>();

defineEmits(['close', 'edit']);

const companyStore = useCompanyStore();

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: companyStore.company?.currency || 'PKR',
    minimumFractionDigits: 0
  }).format(val || 0);
}
</script>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 10px;
}
</style>
