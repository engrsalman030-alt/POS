<template>
  <div>
    <div class="grid grid-cols-12 px-6 py-3 hover:bg-slate-50/80 transition-colors group text-sm items-center">
        <div class="col-span-1 text-slate-400 font-mono text-xs">{{ account.code }}</div>
        <div class="col-span-7 font-medium text-slate-700 flex items-center gap-2" :style="{ paddingLeft: (depth * 1.5) + 'rem' }">
            <span v-if="account.is_group" class="text-[10px] text-slate-300">▼</span>
            <span v-else class="text-[10px] text-indigo-300">●</span>
            {{ account.name }}
        </div>
        <div class="col-span-2">
            <span :class="['text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter', typeClass]">
                {{ account.type }}
            </span>
        </div>
        <div class="col-span-2 text-right font-mono font-bold text-slate-900">
            {{ formatCurrency(0) }} <!-- Simple balance for now -->
        </div>
    </div>
    
    <template v-if="account.is_group">
        <AccountRow 
            v-for="child in accountStore.getChildAccounts(account.id)" 
            :key="child.id" 
            :account="child" 
            :depth="depth + 1" 
        />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAccountStore } from '../stores/accounts';
import { useCompanyStore } from '../stores/company';

const props = defineProps<{
    account: any;
    depth: number;
}>();

const accountStore = useAccountStore();
const companyStore = useCompanyStore();

const typeClass = computed(() => {
    const maps: any = {
        Asset: 'bg-emerald-50 text-emerald-600',
        Liability: 'bg-rose-50 text-rose-600',
        Equity: 'bg-indigo-50 text-indigo-600',
        Income: 'bg-amber-50 text-amber-600',
        Expense: 'bg-slate-100 text-slate-600'
    };
    return maps[props.account.type];
});

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: companyStore.company?.currency || 'USD'
  }).format(val);
}
</script>
