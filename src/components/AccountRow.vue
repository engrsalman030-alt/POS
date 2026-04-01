<template>
  <div>
    <div class="grid grid-cols-12 px-6 py-2.5 transition-colors text-sm items-center border-b border-hover-bg/50 hover:bg-hover-bg group">
        <div class="col-span-1 font-mono text-[10px] text-text-muted">{{ account.code }}</div>
        <div class="col-span-6 font-semibold flex items-center gap-2" :style="{ paddingLeft: (depth * 1) + 'rem' }"
           :class="account.is_group ? 'text-text-primary' : 'text-text-secondary'">
            <span v-if="account.is_group" class="text-[10px] text-text-muted opacity-40">▼</span>
            <span v-else class="text-[8px] text-border">●</span>
            {{ account.name }}
            <router-link v-if="!account.is_group" :to="'/ledger/' + account.id" class="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-0.5 rounded bg-brand/10 text-brand text-[9px] font-black uppercase tracking-widest ml-2">
               Ledger
            </router-link>
        </div>
        <div class="col-span-2">
            <span class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded text-center block w-max"
               :class="typeClass">
                {{ account.type }}
            </span>
        </div>
        <div class="col-span-3 text-right font-black tabular-nums text-text-primary">
            {{ formatCurrency(balance) }}
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

const balance = computed(() => {
    return accountStore.getAccountBalance(props.account.id);
});

const typeClass = computed(() => {
    const maps: any = {
        Asset: 'bg-hover-bg text-text-primary border border-border',
        Liability: 'bg-hover-bg text-text-primary border border-border',
        Equity: 'bg-hover-bg text-text-primary border border-border',
        Income: 'bg-text-primary text-card-bg',
        Expense: 'bg-text-secondary text-card-bg'
    };
    return maps[props.account.type];
});

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: companyStore.company?.currency || 'PKR'
  }).format(val || 0);
}
</script>
