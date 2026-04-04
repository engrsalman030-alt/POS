<template>
  <div class="p-4 md:p-8 max-w-5xl mx-auto font-inter min-h-screen pb-20">
    
    <!-- PROFESSIONAL HEADER (IMAGE MATCH) -->
    <header class="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b-2 border-border pb-8">
      <div class="flex items-center gap-5">
        <div class="w-16 h-16 bg-brand text-white flex items-center justify-center font-black text-2xl monogram rounded-2xl shadow-xl shadow-brand/10">
          {{ companyStore.getMonogram(companyStore.company?.name || 'B&H') }}
        </div>
        <div>
          <div class="flex items-center gap-2 mb-1">
             <router-link to="/accounts" class="text-text-muted hover:text-brand transition-colors">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m15 18-6-6 6-6"/></svg>
             </router-link>
             <span class="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted opacity-60">Account Ledger</span>
          </div>
          <h1 class="text-3xl font-black text-text-primary tracking-tight uppercase">{{ account?.name || 'Loading...' }}</h1>
          <p class="text-[10px] font-bold text-text-muted mt-1 uppercase tracking-widest">Code: {{ account?.code || '---' }}</p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-4">
        <!-- Date Filter -->
        <div class="flex items-center bg-hover-bg/30 border border-border rounded-xl p-1.5 shadow-inner">
           <input v-model="startDate" type="date" @change="refreshLedger" class="bg-transparent px-3 py-1 text-[10px] font-black uppercase outline-none text-text-primary"/>
           <div class="w-[1px] h-4 bg-border mx-1"></div>
           <input v-model="endDate" type="date" @change="refreshLedger" class="bg-transparent px-3 py-1 text-[10px] font-black uppercase outline-none text-text-primary"/>
        </div>
        
        <button @click="refreshLedger" class="p-3 rounded-xl bg-card-bg border border-border text-text-primary hover:bg-hover-bg transition-all active:scale-95 shadow-sm">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
        </button>

        <div class="w-[1px] h-8 bg-border mx-2"></div>

        <button @click="handlePrint" class="group px-6 py-3 rounded-xl bg-brand text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-hover transition-all shadow-xl active:scale-95 flex items-center gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="group-hover:animate-bounce"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
          Print Ledger
        </button>
      </div>
    </header>

    <!-- SUMMARY CARDS -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
       <div class="ledger-card bg-emerald-500/5 border-emerald-500/10">
          <p class="ledger-card-label text-emerald-600">Total Debit</p>
          <p class="ledger-card-value text-emerald-700">{{ formatCurrency(totalDebit) }}</p>
       </div>
       <div class="ledger-card bg-rose-500/5 border-rose-500/10">
          <p class="ledger-card-label text-rose-600">Total Credit</p>
          <p class="ledger-card-value text-rose-700">{{ formatCurrency(totalCredit) }}</p>
       </div>
       <div class="ledger-card bg-brand/5 border-brand/10">
          <p class="ledger-card-label text-brand">Net Balance</p>
          <p class="ledger-card-value text-brand">{{ formatCurrency(currentBalance) }}</p>
       </div>
    </div>

    <!-- LEDGER TABLE -->
    <div class="bg-card-bg border border-border rounded-2xl overflow-hidden shadow-xl shadow-app-bg/50 print:shadow-none print:border-none">
      <table class="w-full border-collapse">
        <thead class="bg-hover-bg/50 border-b border-border">
          <tr>
            <th class="ledger-th w-24">Date</th>
            <th class="ledger-th text-left">Particulars / Memo</th>
            <th class="ledger-th w-32 text-right">Debit</th>
            <th class="ledger-th w-32 text-right">Credit</th>
            <th class="ledger-th w-40 text-right">Running Balance</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border/50">
          <tr v-for="(row, idx) in ledgerData" :key="idx" class="hover:bg-hover-bg/30 transition-colors">
            <td class="ledger-td font-mono font-bold text-text-muted opacity-60">{{ row.date }}</td>
            <td class="ledger-td">
               <div class="flex flex-col">
                  <span class="font-bold text-xs">{{ row.memo || 'General Transaction' }}</span>
                  <span v-if="row.reference_type" class="text-[9px] font-black uppercase tracking-widest text-text-muted mt-0.5">{{ row.reference_type }} #{{ row.reference_id?.slice(0, 8) }}</span>
               </div>
            </td>
            <td class="ledger-td text-right font-mono font-bold text-emerald-600">{{ row.debit > 0 ? formatRaw(row.debit) : '-' }}</td>
            <td class="ledger-td text-right font-mono font-bold text-rose-500">{{ row.credit > 0 ? formatRaw(row.credit) : '-' }}</td>
            <td class="ledger-td text-right font-mono font-black tabular-nums border-l border-border/10" 
              :class="calculateRunningBalance(idx) < 0 ? 'text-rose-500' : 'text-text-primary'">
              {{ formatRaw(calculateRunningBalance(idx)) }}
            </td>
          </tr>
          <tr v-if="ledgerData.length === 0" class="h-64">
            <td colspan="5" class="text-center py-20">
               <div class="w-16 h-16 bg-hover-bg rounded-2xl mx-auto flex items-center justify-center opacity-20 text-2xl">📖</div>
               <p class="text-xs font-bold text-text-muted uppercase tracking-widest mt-4">No transactions found for this period.</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <iframe id="ledger-print-frame" style="display: none;"></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useAccountStore } from '../stores/accounts';
import { useCompanyStore } from '../stores/company';

const props = defineProps<{
  id: string;
}>();

const accountStore = useAccountStore();
const companyStore = useCompanyStore();

const account = computed(() => accountStore.getAccountById(props.id));
const ledgerData = ref<any[]>([]);
const startDate = ref('');
const endDate = ref(new Date().toISOString().split('T')[0]);



const currentBalance = computed(() => accountStore.getAccountBalance(props.id));

const totalDebit = computed(() => ledgerData.value.reduce((sum, r) => sum + (r.debit || 0), 0));
const totalCredit = computed(() => ledgerData.value.reduce((sum, r) => sum + (r.credit || 0), 0));

async function refreshLedger() {
  ledgerData.value = await accountStore.fetchLedger(props.id, startDate.value, endDate.value);
}

onMounted(() => {
  accountStore.fetchAccounts();
  refreshLedger();
});

watch(() => props.id, () => {
    refreshLedger();
});

function calculateRunningBalance(idx: number): number {
  let bal = 0;
  const isAssetOrExpense = account.value?.type === 'Asset' || account.value?.type === 'Expense';
  
  for (let i = 0; i <= idx; i++) {
    const row = ledgerData.value[i];
    if (isAssetOrExpense) {
      bal += (row.debit || 0) - (row.credit || 0);
    } else {
      bal += (row.credit || 0) - (row.debit || 0);
    }
  }
  return bal;
}

function formatRaw(val: number) {
  return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: companyStore.company?.currency || 'PKR'
  }).format(val || 0);
}


function handlePrint() {
  const frame = document.getElementById('ledger-print-frame') as HTMLIFrameElement;
  if (!frame) return;

  const doc = frame.contentWindow?.document;
  if (!doc) return;

  // const company = companyStore.company;
  // const initials = companyInitials.value;
  const items = ledgerData.value;

  doc.open();
  doc.write(`
    <html>
      <head>
        <title>Account Ledger - ${account.value?.name}</title>
        <script src="https://cdn.tailwindcss.com"><\/script>
        <style>
           @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap');
           @media print {
             @page { margin: 10mm; size: auto; }
             body { -webkit-print-color-adjust: exact; font-family: 'Inter', sans-serif; color: #000; }
           }
           body { font-family: 'Inter', sans-serif; padding: 30px; }
           .border-tight { border: 1px solid #000; }
           .table-tight th, .table-tight td { border: 1px solid #000; padding: 6px 8px; font-size: 9px; }
           .table-tight th { background-color: #f8fafc !important; font-weight: 900; text-transform: uppercase; }
           .monogram { font-family: 'JetBrains Mono', monospace; letter-spacing: 0.1em; }
        </style>
      </head>
      <body>
        <div class="flex items-center justify-between border-b-2 border-black pb-4 mb-4">
             <!-- MONOGRAM (B&H PHARMA) -->
             <div class="flex-shrink-0 mr-6">
                <img src="/logo.png" style="max-width: 100px; max-height: 100px; object-fit: contain;" onerror="this.onerror=null; this.style.display='none'; document.getElementById('svg-fallback-report').style.display='flex';" />
                <div id="svg-fallback-report" style="display: none; width: 90px; height: 90px;" class="rounded-full border-2 border-emerald-500 bg-white flex-col items-center justify-center shadow-sm">
                   <div class="text-emerald-500 flex items-center justify-center">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M19.5,8H15V3.5A1.5,1.5 0 0,0 13.5,2H10.5A1.5,1.5 0 0,0 9,3.5V8H4.5A1.5,1.5 0 0,0 3,9.5V12.5A1.5,1.5 0 0,0 4.5,14H9V18.5A1.5,1.5 0 0,0 10.5,20H13.5A1.5,1.5 0 0,0 15,18.5V14H19.5A1.5,1.5 0 0,0 21,12.5V9.5A1.5,1.5 0 0,0 19.5,8Z"/></svg>
                   </div>
                   <span class="text-[8px] font-black text-emerald-600 tracking-tighter mt-1">B&H PHARMA</span>
                </div>
             </div>

             <!-- COMPANY HEADER (B & H Pharmaceutical) -->
             <div class="flex-grow text-left">
                <h1 class="text-2xl font-black uppercase text-black tracking-tighter leading-none mb-1">${companyStore.company?.name || 'B & H Pharmaceutical (PVT) LTD'}</h1>
                <p class="text-[11px] font-black text-black">${companyStore.company?.address || 'Ismail Adda, Khwaza Khela. Swat'}</p>
                <p class="text-[11px] font-black text-black mt-0.5 tracking-tight">NTN : ${companyStore.company?.ntn || '1526202-2'} &nbsp;&nbsp;&nbsp; STRN : 03-04-3000-021-37</p>
             </div>
             
             <!-- REPORT BADGE -->
             <div class="flex-shrink-0 text-right ml-4">
                <div class="border-black border-2 px-4 py-2 bg-black text-white inline-block">
                   <h2 class="text-sm font-black uppercase tracking-[0.2em] leading-none mb-0.5">Account</h2>
                   <h2 class="text-sm font-black uppercase tracking-[0.2em] leading-none">Ledger</h2>
                </div>
                <div class="mt-2 text-right">
                   <p class="text-[10px] font-black text-black uppercase tracking-widest">${account.value?.name}</p>
                   <p class="text-[8px] font-bold text-slate-500 italic mt-0.5 uppercase tracking-widest">${startDate.value || 'Beginning'} to ${endDate.value}</p>
                </div>
             </div>
          </div>

        <div class="grid grid-cols-3 gap-6 mb-8">
           <div class="p-4 border border-black bg-slate-50">
              <p class="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Total Debit</p>
              <p class="text-base font-black tabular-nums">${formatRaw(totalDebit.value)}</p>
           </div>
           <div class="p-4 border border-black bg-slate-50">
              <p class="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Total Credit</p>
              <p class="text-base font-black tabular-nums">${formatRaw(totalCredit.value)}</p>
           </div>
           <div class="p-4 border border-black bg-slate-900 text-white">
              <p class="text-[8px] font-black uppercase tracking-widest opacity-60 mb-1">Final Balance</p>
              <p class="text-base font-black tabular-nums">${formatRaw(currentBalance.value)}</p>
           </div>
        </div>

        <table class="w-full table-tight">
           <thead>
              <tr>
                 <th class="w-20">Date</th>
                 <th class="text-left">Particulars / Description</th>
                 <th class="w-24">Reference</th>
                 <th class="w-24 text-right">Debit</th>
                 <th class="w-24 text-right">Credit</th>
                 <th class="w-28 text-right">Balance</th>
              </tr>
           </thead>
           <tbody>
              ${items.map((row, idx) => `
                 <tr>
                    <td class="font-bold">${row.date}</td>
                    <td class="text-left font-bold font-sans">${row.memo || 'General Transaction'}</td>
                    <td class="font-mono">${row.reference_type ? row.reference_type + ' #' + row.reference_id?.slice(0, 8) : '-'}</td>
                    <td class="text-right font-bold">${row.debit > 0 ? formatRaw(row.debit) : '-'}</td>
                    <td class="text-right font-bold">${row.credit > 0 ? formatRaw(row.credit) : '-'}</td>
                    <td class="text-right font-black bg-slate-50">${formatRaw(calculateRunningBalance(idx))}</td>
                 </tr>
              `).join('')}
           </tbody>
        </table>

        <div class="mt-20 flex justify-end">
           <div class="text-right">
              <div class="w-48 border-t border-black mb-1"></div>
              <p class="text-[8px] font-black uppercase tracking-widest text-slate-400">Authorized Accountant Signature</p>
           </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(() => { window.print(); }, 500);
          };
        <\/script>
      </body>
    </html>
  `);
  doc.close();
}
</script>

<style scoped>
@reference "../style.css";

.font-inter { font-family: 'Inter', sans-serif; }
.font-mono { font-family: 'JetBrains Mono', monospace; }

.ledger-card {
  @apply p-6 rounded-2xl border transition-all;
}
.ledger-card-label {
  @apply text-[9px] font-black uppercase tracking-widest mb-1 opacity-70;
}
.ledger-card-value {
  @apply text-xl font-black tabular-nums tracking-tighter;
}

.ledger-th {
  @apply py-4 px-6 text-[9px] font-black uppercase tracking-widest text-text-muted whitespace-nowrap;
}
.ledger-td {
  @apply py-4 px-6 text-xs tabular-nums;
}

@media print {
  .pb-20, header > div:last-child, .ledger-card {
    display: none !important;
  }
  .max-w-5xl {
    max-width: 100% !important;
    padding: 0 !important;
  }
  .border-border {
    border-color: black !important;
  }
}
</style>
