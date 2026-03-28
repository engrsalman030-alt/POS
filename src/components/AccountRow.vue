<template>
  <div>
    <div class="grid grid-cols-12 px-6 py-3 transition-colors text-sm items-center border-b border-hover-bg/50 hover:bg-hover-bg">
        <div class="col-span-1 font-mono text-xs text-text-muted">{{ account.code }}</div>
        <div class="col-span-7 font-semibold flex items-center gap-2" :style="{ paddingLeft: (depth * 1.5) + 'rem' }"
           :class="account.is_group ? 'text-text-primary' : 'text-text-secondary'">
            <span v-if="account.is_group" class="text-[10px] text-text-muted">▼</span>
            <span v-else class="text-[10px] text-border">●</span>
            {{ account.name }}
        </div>
        <div class="col-span-2">
            <span class="text-[10px] px-2 py-0.5 rounded text-center block w-max"
               :class="typeClass">
                {{ account.type }}
            </span>
        </div>
        <div class="col-span-2 text-right font-bold text-text-primary">
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
