<template>
  <div 
    @click="$emit('click', party)"
    class="bg-card-bg rounded-xl border border-border p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col h-full"
  >
    <!-- Background Accent -->
    <div 
      class="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 group-hover:opacity-10 transition-opacity"
      :style="{ background: party.type === 'Customer' ? '#10B981' : '#F43F5E' }"
    ></div>

    <div class="flex justify-between items-start mb-4">
      <div 
        class="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold bg-rose-500/10 text-rose-500"
        :class="party.type === 'Customer' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'"
      >
        {{ initial }}
      </div>
      <span 
        class="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded"
        :class="party.type === 'Customer' ? 'bg-emerald-500/5 text-emerald-500' : 'bg-rose-500/5 text-rose-500'"
      >
        {{ party.type }}
      </span>
    </div>

    <div class="flex-1">
      <h3 class="text-base font-bold text-text-primary group-hover:text-text-primary transition-colors mb-1 truncate">{{ party.name }}</h3>
      <p class="text-xs text-text-muted truncate flex items-center gap-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        {{ party.email || 'No email' }}
      </p>
    </div>

    <div class="mt-4 pt-4 border-t border-hover-bg flex justify-between items-end">
      <div>
        <p class="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1">{{ party.type === 'Customer' ? 'Receivable' : 'Payable' }}</p>
        <p class="text-sm font-black" :class="party.type === 'Customer' ? 'text-text-primary' : 'text-rose-500'">
          {{ formatCurrency(party.balance || 0) }}
        </p>
      </div>
      <div class="text-text-muted group-hover:text-text-primary transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Party } from '../types/party';
import { useCompanyStore } from '../stores/company';

const props = defineProps<{
  party: Party;
}>();

const emit = defineEmits(['click']);

const companyStore = useCompanyStore();

const initial = computed(() => props.party.name.charAt(0).toUpperCase());

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: companyStore.company?.currency || 'PKR',
    minimumFractionDigits: 0
  }).format(val || 0);
}
</script>
