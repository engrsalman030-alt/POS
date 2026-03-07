<template>
  <div class="p-8 max-w-6xl mx-auto" style="font-family:'Inter',sans-serif;">
    
    <!-- Header -->
    <header class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold" style="color:#171717;">Bank & Cash</h1>
        <p class="text-sm mt-1" style="color:#999;">Manage your liquid assets and reconcile entries.</p>
      </div>
      <div class="flex gap-3">
        <button @click="exportDb"
          class="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          style="background:#F6F6F6; color:#525252; border:1px solid #E2E2E2;"
          onmouseover="this.style.background='#EDEDED'"
          onmouseout="this.style.background='#F6F6F6'">
          💾 Backup Database
        </button>
        <button @click="triggerFileInput"
          class="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          style="background:#F6F6F6; color:#525252; border:1px solid #E2E2E2;"
          onmouseover="this.style.background='#EDEDED'"
          onmouseout="this.style.background='#F6F6F6'">
          📂 Restore Backup
        </button>
        <input type="file" ref="fileInput" @change="importDb" class="hidden" accept=".json,.sqlite">
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- Accounts List -->
      <div class="lg:col-span-1 space-y-4">
        <div
          v-for="acc in cashAccounts" :key="acc.id"
          @click="selectedAccount = acc"
          class="p-5 rounded-xl cursor-pointer transition-all"
          :style="selectedAccount?.id === acc.id
            ? 'background:#278F5E; border:1px solid #278F5E; color:#fff;'
            : 'background:#fff; border:1px solid #E2E2E2; color:#171717;'"
          onmouseover="if(!this.classList.contains('selected')) this.style.borderColor='#46B37E'"
          onmouseout="if(!this.classList.contains('selected')) this.style.borderColor='#E2E2E2'"
        >
          <div class="flex justify-between items-start mb-4">
            <span class="text-xl">{{ acc.name === 'Cash' ? '💵' : '🏦' }}</span>
            <span class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
              :style="selectedAccount?.id === acc.id
                ? 'background:rgba(255,255,255,0.2); color:#fff;'
                : 'background:#F6F6F6; color:#999;'">
              {{ acc.code }}
            </span>
          </div>
          <p class="text-xs font-semibold uppercase tracking-widest"
            :style="selectedAccount?.id === acc.id ? 'opacity:0.7;' : 'color:#999;'">
            {{ acc.name }}
          </p>
          <p class="text-2xl font-bold mt-1">{{ formatCurrency(getAccountBalance(acc.id)) }}</p>
        </div>
      </div>

      <!-- Transaction History -->
      <div class="lg:col-span-2 rounded-xl overflow-hidden flex flex-col"
        style="background:#fff; border:1px solid #E2E2E2; min-height:500px;">
        
        <div class="px-6 py-4 flex justify-between items-center" style="background:#F6F6F6; border-bottom:1px solid #E2E2E2;">
          <h2 class="text-xs font-bold uppercase tracking-widest" style="color:#999;">
            {{ selectedAccount ? selectedAccount.name + ' Transactions' : 'Select an account' }}
          </h2>
          <button v-if="selectedAccount"
            class="text-xs font-semibold transition-all"
            style="color:#278F5E;"
            onmouseover="this.style.color='#46B37E'"
            onmouseout="this.style.color='#278F5E'">
            + Add Manual Entry
          </button>
        </div>

        <div class="flex-1 overflow-y-auto">
          <table v-if="selectedAccount && transactions.length > 0" class="w-full text-left">
            <thead style="border-bottom:1px solid #F0F0F0;">
              <tr>
                <th class="px-6 py-3 text-[10px] font-bold uppercase tracking-widest" style="color:#C7C7C7;">Date</th>
                <th class="px-6 py-3 text-[10px] font-bold uppercase tracking-widest" style="color:#C7C7C7;">Reference</th>
                <th class="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-right" style="color:#C7C7C7;">Debit</th>
                <th class="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-right" style="color:#C7C7C7;">Credit</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tx in transactions" :key="tx.id"
                class="text-sm transition-colors"
                style="border-bottom:1px solid #F6F6F6;"
                onmouseover="this.style.background='#F6F6F6'"
                onmouseout="this.style.background='transparent'">
                <td class="px-6 py-4 font-mono text-xs" style="color:#999;">{{ tx.date }}</td>
                <td class="px-6 py-4">
                  <p class="font-semibold text-sm" style="color:#171717;">{{ tx.memo || 'Bank Transaction' }}</p>
                  <p class="text-[10px] mt-0.5" style="color:#C7C7C7;">{{ tx.reference_type }} #{{ tx.reference_id }}</p>
                </td>
                <td class="px-6 py-4 text-right font-semibold text-sm" style="color:#278F5E;">
                  {{ tx.debit > 0 ? formatCurrency(tx.debit) : '—' }}
                </td>
                <td class="px-6 py-4 text-right font-semibold text-sm" style="color:#E03636;">
                  {{ tx.credit > 0 ? formatCurrency(tx.credit) : '—' }}
                </td>
              </tr>
            </tbody>
          </table>

          <div v-else class="flex flex-col items-center justify-center h-full gap-3 p-20 text-center">
            <span class="text-4xl" style="opacity:0.15;">📂</span>
            <p class="text-sm" style="color:#C7C7C7;">
              {{ selectedAccount ? 'No transactions found for this account.' : 'Select an account on the left to view transaction history.' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Safety Warning -->
    <div class="mt-8 rounded-xl p-6 flex items-start gap-5"
      style="background:#EDFBF4; border:1px solid #c6f0db;">
      <div class="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
        style="background:#fff; border:1px solid #c6f0db;">🛡️</div>
      <div>
        <h3 class="font-bold text-sm" style="color:#171717;">Your data is stored locally.</h3>
        <p class="text-sm mt-1 max-w-2xl leading-relaxed" style="color:#525252;">
          This application uses a local-first architecture. All your accounting data stays on this device.
          We recommend backing up your data regularly by exporting it to a file.
          If you clear your browser's local storage or switch devices without a backup, your data will be lost.
        </p>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useAccountStore } from '../stores/accounts';
import { useCompanyStore } from '../stores/company';
import { query, getDb } from '../db/database';

const accountStore = useAccountStore();
const companyStore = useCompanyStore();
const selectedAccount = ref<any>(null);
const transactions = ref<any[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);

const cashAccounts = computed(() => {
    return accountStore.accounts.filter(a => a.name === 'Cash' || a.name === 'Bank');
});

onMounted(async () => {
    await accountStore.fetchAccounts();
    if (cashAccounts.value.length > 0) {
        selectedAccount.value = cashAccounts.value[0];
    }
});

watch(selectedAccount, async (acc) => {
    if (acc) {
        transactions.value = query(
            `SELECT ji.*, j.date, j.memo, j.reference_type, j.reference_id 
             FROM journal_items ji 
             JOIN journals j ON ji.journal_id = j.id 
             WHERE ji.account_id = ? 
             ORDER BY j.date DESC`, 
            [acc.id]
        );
    } else {
        transactions.value = [];
    }
});

function getAccountBalance(id: string) {
    const result = query(
        `SELECT SUM(debit - credit) as balance FROM journal_items WHERE account_id = ?`,
        [id]
    );
    return result[0]?.balance || 0;
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: companyStore.company?.currency || 'PKR'
  }).format(val || 0);
}

function exportDb() {
  const db_data = localStorage.getItem('pos_db');
  if (!db_data) return;
  
  const blob = new Blob([db_data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fb_clone_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function triggerFileInput() {
    fileInput.value?.click();
}

function importDb(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
            JSON.parse(content); // Validate JSON
            localStorage.setItem('pos_db', content);
            alert('Database restored successfully. The page will now reload.');
            window.location.reload();
        } catch (err) {
            alert('Invalid backup file.');
        }
    };
    reader.readAsText(file);
}
</script>
