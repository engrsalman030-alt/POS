<template>
  <div class="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
    <Sidebar v-if="companyStore.isInitialized" />
    <main class="flex-1 overflow-y-auto relative flex flex-col">
      <!-- Global Guide Banner -->
     

      <div class="flex-1 overflow-y-auto w-full relative">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, watch, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { query as execQuery } from './db/database';

import Sidebar from './components/Sidebar.vue';
import { useCompanyStore } from './stores/company';
import { useInventoryStore } from './stores/inventory';
import { usePartyStore } from './stores/parties';
import { useTransactionStore } from './stores/transactions';

const companyStore = useCompanyStore();
const inventoryStore = useInventoryStore();
const partyStore = usePartyStore();
const transactionStore = useTransactionStore();
const route = useRoute();

onMounted(async () => {
  await companyStore.loadCompany();
  if (companyStore.isInitialized) {
      inventoryStore.fetchItems();
      partyStore.fetchParties();
      transactionStore.fetchBills();
      transactionStore.fetchInvoices();
  } else {
      inventoryStore.items = [];
      partyStore.parties = [];
      transactionStore.bills = [];
      transactionStore.invoices = [];
  }
});

watch(() => companyStore.company?.id, (newId, oldId) => {
    // If the company ID fundamentally changes (e.g. from a new setup wiping the DB), ensure the entire SPA is pristine
    if (newId && oldId && newId !== oldId) {
        window.location.href = '/'; 
    } else if (newId) {
        inventoryStore.fetchItems();
        partyStore.fetchParties();
        transactionStore.fetchBills();
        transactionStore.fetchInvoices();
    } else {
        inventoryStore.items = [];
        partyStore.parties = [];
        transactionStore.bills = [];
        transactionStore.invoices = [];
    }
});


const step1Done = computed(() => companyStore.isInitialized);

const step2ItemsDone = ref(false);
const step2PartiesDone = ref(false);
const step3Done = ref(false);
const step4Done = ref(false);

const step2Done = computed(() => step2ItemsDone.value && step2PartiesDone.value);

// Re-evaluate on any store change
watchEffect(() => {
    if (!companyStore.isInitialized) return;
    try {
        const items = execQuery('SELECT COUNT(*) as c FROM items');
        const parties = execQuery('SELECT COUNT(*) as c FROM parties');
        const bills = execQuery('SELECT COUNT(*) as c FROM purchase_bills');
        const invoices = execQuery('SELECT COUNT(*) as c FROM sales_invoices');
        
        // Seeded lengths are 5, so > 5 means a user added one
        step2ItemsDone.value = (items[0] as any).c > 5;
        step2PartiesDone.value = (parties[0] as any).c > 5;
        
        step3Done.value = (bills[0] as any).c > 0;
        step4Done.value = (invoices[0] as any).c > 0;
    } catch(e) {
        // Just in case DB is mid-wipe
    }
});

const currentStepAction = computed(() => {
    if (!step1Done.value) {
        return {
            title: 'Company Registration',
            desc: 'Please fill out the Setup form to initialize your company.',
            link: '/setup',
            btn: 'Setup Company'
        };
    }
    if (!step2Done.value) {
        const missing = [];
        if (!step2ItemsDone.value) missing.push('Items');
        if (!step2PartiesDone.value) missing.push('Parties');
        return {
            title: 'Add Inventory & Parties',
            desc: `You need to add at least 1 Item and 1 Party. Missing: ${missing.join(' and ')}.`,
            link: !step2ItemsDone.value ? '/inventory' : '/parties',
            btn: !step2ItemsDone.value ? 'Go to Inventory' : 'Go to Parties'
        };
    }
    if (!step3Done.value) {
        return {
            title: 'Purchase Items',
            desc: 'Create a Purchase Bill to increase your stock.',
            link: '/purchases',
            btn: 'Go to Purchases'
        };
    }
    if (!step4Done.value) {
        return {
            title: 'Sell Items',
            desc: 'Create a Sales Invoice to sell your stock to a Customer.',
            link: '/sales',
            btn: 'Go to Sales'
        };
    }
    return {
        title: 'View Financial Reports',
        desc: 'Check your Profit & Loss and Balance Sheet to see your performance.',
        link: '/reports',
        btn: 'Go to Reports'
    };
});

const isGuideCompleted = computed(() => {
    return step1Done.value && step2Done.value && step3Done.value && step4Done.value && route.path === '/reports';
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
