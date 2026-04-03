<template>
  <div class="p-8 max-w-6xl mx-auto font-sans">
    
    <!-- Header -->
    <header class="mb-8 flex justify-between items-end pb-4 border-b border-border">
      <div>
        <h1 class="text-2xl font-bold text-text-primary">Bank & Cash</h1>
        <p class="text-sm mt-1 text-text-secondary">Manage your liquid assets and reconcile entries.</p>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- Accounts List -->
      <div class="lg:col-span-1 space-y-3">
        <div
          v-for="acc in cashAccounts" :key="acc.id"
          @click="selectedAccount = acc"
          class="p-4 rounded-lg cursor-pointer transition-all border"
          :class="selectedAccount?.id === acc.id
            ? 'bg-card-bg border-text-primary ring-1 ring-text-primary'
            : 'bg-card-bg border-border text-text-secondary'"
        >
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-bold text-sm text-text-primary">{{ acc.name }}</h3>
            <span class="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-hover-bg text-text-muted">{{ acc.code }}</span>
          </div>
          <p class="text-xl font-bold text-text-primary">
            {{ formatCurrency(getAccountBalance(acc.id)) }}
          </p>
        </div>
      </div>

      <!-- Transaction History -->
      <div class="lg:col-span-2 rounded-lg overflow-hidden flex flex-col border border-border bg-card-bg min-h-[500px]">
        
        <div class="px-6 py-4 flex justify-between items-center bg-hover-bg border-b border-border">
          <h2 class="text-xs font-bold uppercase tracking-widest text-text-secondary">
            {{ selectedAccount ? selectedAccount.name + ' Ledger' : 'Select an account' }}
          </h2>
          <button v-if="selectedAccount"
            @click="openPaymentModal"
            class="text-xs font-bold transition-all underline text-text-primary hover:opacity-80">
            + Manual Entry
          </button>
        </div>

        <div class="flex-1 overflow-y-auto">
          <table v-if="selectedAccount && paginatedTransactions.length > 0" class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-hover-bg border-b border-border">
                <th class="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-text-muted">Date</th>
                <th class="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-text-muted">Reference / Memo</th>
                <th class="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-right text-text-muted">In (Debit)</th>
                <th class="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-right text-text-muted">Out (Credit)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tx in paginatedTransactions" :key="tx.id"
                class="text-sm border-b border-hover-bg/50 transition-colors hover:bg-hover-bg">
                <td class="px-6 py-4 font-mono text-xs text-text-muted">{{ tx.date }}</td>
                <td class="px-6 py-4">
                  <p class="font-semibold text-sm text-text-primary">{{ tx.memo || 'Bank Transaction' }}</p>
                  <p class="text-[10px] uppercase tracking-tighter text-text-muted">{{ tx.reference_type }} #{{ tx.reference_id }}</p>
                </td>
                <td class="px-6 py-4 text-right font-bold text-sm text-text-primary">
                  {{ tx.debit > 0 ? formatCurrency(tx.debit) : '—' }}
                </td>
                <td class="px-6 py-4 text-right font-bold text-sm text-rose-500">
                  {{ tx.credit > 0 ? formatCurrency(tx.credit) : '—' }}
                </td>
              </tr>
            </tbody>
          </table>

          <div v-else-if="selectedAccount && transactions.length === 0" class="flex flex-col items-center justify-center h-full p-20 text-center">
            <div class="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-hover-bg text-text-muted/50">
               <span class="text-2xl">🏦</span>
            </div>
            <p class="text-sm font-medium text-text-muted">
              No ledger entries found.
            </p>
          </div>
          
          <div v-else class="flex flex-col items-center justify-center h-full p-20 text-center">
            <div class="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-hover-bg text-text-muted/50">
               <span class="text-2xl">🏦</span>
            </div>
            <p class="text-sm font-medium text-text-muted">
              Select an account to view ledger history.
            </p>
          </div>
        </div>

        <!-- Pagination Component -->
        <Pagination 
          v-if="selectedAccount && transactions.length > 0"
          :currentPage="currentPage" 
          :totalPages="totalPages" 
          @next="nextPage" 
          @prev="prevPage"
          @setPage="setPage"
        />
      </div>
    </div>

    <!-- Info Footer -->
    <div class="mt-8 rounded-lg p-6 flex items-start gap-5 bg-hover-bg border border-border">
      <div class="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 border bg-card-bg border-border">🛡️</div>
      <div>
        <h3 class="font-bold text-sm text-text-primary">Local Database Security</h3>
        <p class="text-sm mt-1 max-w-2xl leading-relaxed text-text-secondary">
          Your accounting data is stored in a private local SQLite database. 
          To ensure data longevity, use the <router-link to="/settings" class="underline font-bold text-text-primary">Backup</router-link> tool regularly.
        </p>
      </div>
    </div>

    <!-- Payment Entry Modal -->
    <div v-if="showPaymentModal" class="absolute inset-0 flex items-center justify-center p-6 z-[100] bg-black/40 backdrop-blur-[2px]">
      <div class="w-full max-w-md rounded-lg overflow-hidden border border-border shadow-lg bg-card-bg">
        <div class="px-6 py-4 flex justify-between items-center bg-hover-bg border-b border-border">
          <h2 class="text-xs font-bold uppercase tracking-widest text-text-secondary">Add Manual Entry</h2>
          <button @click="showPaymentModal = false" class="text-xl font-bold text-text-muted hover:text-text-primary">&times;</button>
        </div>
        
        <form @submit.prevent="handleSubmitPayment" class="p-6 space-y-4">
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-text-muted">Type</label>
            <div class="flex gap-2">
              <button type="button" @click="form.payment_type = 'Receive'"
                class="flex-1 py-2 text-xs font-bold rounded border transition-all"
                :class="form.payment_type === 'Receive' ? 'bg-text-primary text-card-bg border-text-primary' : 'bg-card-bg text-text-secondary border-border'">
                Receipt (In)
              </button>
              <button type="button" @click="form.payment_type = 'Pay'"
                class="flex-1 py-2 text-xs font-bold rounded border transition-all"
                :class="form.payment_type === 'Pay' ? 'bg-text-primary text-card-bg border-text-primary' : 'bg-card-bg text-text-secondary border-border'">
                Payment (Out)
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-text-muted">Date</label>
              <input v-model="form.date" type="date" required
                class="w-full px-3 py-2 text-sm border border-border rounded outline-none bg-app-bg text-text-primary focus:border-text-primary">
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-text-muted">Amount</label>
              <input v-model.number="form.amount" type="number" step="0.01" required
                class="w-full px-3 py-2 text-sm border border-border rounded outline-none bg-app-bg text-text-primary focus:border-text-primary" placeholder="0.00">
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-text-muted">
              {{ form.payment_type === 'Receive' ? 'Customer' : 'Supplier' }}
            </label>
            <select v-model="form.party_id" required
              class="w-full px-3 py-2 text-sm border border-border rounded outline-none bg-app-bg text-text-primary focus:border-text-primary">
              <option value="" disabled>Select Party</option>
              <option v-for="p in filteredParties" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-text-muted">Memo / Reference</label>
            <input v-model="form.memo" type="text"
              class="w-full px-3 py-2 text-sm border border-border rounded outline-none bg-app-bg text-text-primary focus:border-text-primary" placeholder="Optional details">
          </div>

          <div class="pt-4 flex gap-3">
            <button type="button" @click="showPaymentModal = false"
              class="flex-1 px-4 py-2 border border-border rounded text-sm font-bold transition-all bg-card-bg text-text-secondary hover:bg-hover-bg">Cancel</button>
            <button type="submit"
              class="flex-1 px-4 py-2 rounded text-sm font-bold transition-all bg-text-primary text-card-bg hover:opacity-90">Save Entry</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useAccountStore } from '../stores/accounts';
import { useCompanyStore } from '../stores/company';
import { usePartyStore } from '../stores/parties';
import { useTransactionStore } from '../stores/transactions';
import { query } from '../db/database';
import { usePagination } from '../composables/usePagination';
import Pagination from '../components/Pagination.vue';
import { useToastStore } from '../stores/toast';

interface Account {
  id: string;
  name: string;
  code: string;
  // Add other properties if known
}

interface Transaction {
  id: string;
  date: string;
  memo: string | null;
  reference_type: string;
  reference_id: string;
  debit: number;
  credit: number;
  // Add other properties if known
}

const accountStore = useAccountStore();
const companyStore = useCompanyStore();
// Store for party data
const partyStore = usePartyStore();
const transactionStore = useTransactionStore();
const toastStore = useToastStore();

const selectedAccount = ref<Account | null>(null);
const transactions = ref<Transaction[]>([]);
const showPaymentModal = ref(false);

const { 
    currentPage, 
    totalPages, 
    paginatedItems: paginatedTransactions, 
    nextPage, 
    prevPage, 
    setPage 
} = usePagination(transactions, 10);

// Reset pagination when account changes
watch(selectedAccount, () => {
    currentPage.value = 1;
});

const form = ref({
    date: new Date().toISOString().split('T')[0],
    party_id: '',
    party_type: 'Customer' as 'Customer' | 'Supplier',
    payment_type: 'Receive' as 'Receive' | 'Pay',
    account_id: '',
    amount: 0,
    memo: '',
    reference_type: 'General' as const,
    reference_id: ''
});

const cashAccounts = computed<Account[]>(() => {
    return accountStore.accounts.filter(a => a.name === 'Cash' || a.name === 'Bank') as Account[];
});

const filteredParties = computed(() => {
    const type = form.value.payment_type === 'Receive' ? 'Customer' : 'Supplier';
    return partyStore.parties.filter(p => p.type === type);
});

onMounted(async () => {
    await accountStore.fetchAccounts();
    await partyStore.fetchParties();
    if (cashAccounts.value.length > 0) {
        selectedAccount.value = cashAccounts.value[0] || null;
    }
});

const refreshLedger = async () => {
    if (selectedAccount.value) {
        transactions.value = query(
            `SELECT ji.*, j.date, j.memo, j.reference_type, j.reference_id 
             FROM journal_items ji 
             JOIN journals j ON ji.journal_id = j.id 
             WHERE ji.account_id = ? 
             ORDER BY j.date DESC`, 
            [selectedAccount.value.id]
        ) as any;
    }
};

watch(selectedAccount, refreshLedger);

const openPaymentModal = () => {
    if (!selectedAccount.value) return;
    form.value.account_id = selectedAccount.value.id;
    form.value.date = new Date().toISOString().split('T')[0];
    form.value.amount = 0;
    form.value.memo = '';
    form.value.party_id = '';
    showPaymentModal.value = true;
};

const handleSubmitPayment = async () => {
    try {
        form.value.party_type = form.value.payment_type === 'Receive' ? 'Customer' : 'Supplier';
        // Ensure date is a string to satisfy TS
        const paymentData = { 
            ...form.value, 
            date: form.value.date as string 
        };
        await transactionStore.createPayment(paymentData);
        showPaymentModal.value = false;
        await refreshLedger();
    } catch (err) {
        console.error('Failed to save payment:', err);
        toastStore.error('Failed to save entry. Please check console for details.');
    }
};

const getAccountBalance = (id: string) => {
    const result = query(
        `SELECT SUM(debit - credit) as balance FROM journal_items WHERE account_id = ?`,
        [id]
    );
    return (result[0]?.balance as number) || 0;
};

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: companyStore.company?.currency || 'PKR'
  }).format(val || 0);
}
</script>
