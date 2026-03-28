<template>
  <div class="p-8 max-w-5xl mx-auto font-sans">

    <!-- Minimalist Header & Controls -->
    <header class="mb-6 flex justify-between items-end pb-4 border-b border-border">
      <div>
        <h1 class="text-2xl font-bold text-text-primary">Financial Reports</h1>
        <p class="text-sm mt-1 text-text-secondary">Overview of your financial performance.</p>
      </div>

      <div class="flex items-center gap-4">
        <select v-model="activeTab" class="px-3 py-1.5 text-sm font-medium rounded outline-none transition-all cursor-pointer bg-hover-bg border border-border text-text-primary">
          <option value="pl">Profit & Loss Statement</option>
          <option value="bs">Balance Sheet</option>
          <option value="shifts">Shift Performance</option>
        </select>

        <select v-if="activeTab === 'shifts'" v-model="shiftTimeframe" @change="refreshData" class="px-3 py-1.5 text-sm font-medium rounded outline-none transition-all cursor-pointer bg-hover-bg border border-border text-text-primary">
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Annually</option>
        </select>

        <button @click="refreshData" class="px-3 py-1.5 rounded text-sm font-medium transition-all bg-card-bg border border-border text-text-primary hover:bg-hover-bg">
          Refresh
        </button>
      </div>
    </header>

    <!-- Tabular Report View (Frappe Books Style) -->
    <div class="bg-card-bg rounded-lg border border-border overflow-hidden">
      
      <!-- Table Header -->
      <div class="flex px-6 py-3 font-semibold text-xs tracking-widest uppercase bg-hover-bg border-b border-border text-text-secondary">
        <div class="flex-1">Account</div>
        <div class="w-48 text-right text-xs">Total</div>
      </div>

      <!-- P&L Report Body -->
      <div v-if="activeTab === 'pl'" class="text-sm text-text-primary">
        
        <!-- Income Group -->
        <div class="flex px-6 py-3 font-bold bg-card-bg">
          <div class="flex-1 uppercase text-xs tracking-wider text-text-secondary">Income</div>
        </div>
        <div v-for="row in plData.income" :key="row.name" class="flex px-6 py-2 transition-colors border-b border-hover-bg/50 hover:bg-hover-bg">
          <div class="flex-1 pl-4">{{ row.name }}</div>
          <div class="w-48 text-right font-mono">{{ formatCurrency(row.balance) }}</div>
        </div>
        <div class="flex px-6 py-3 font-bold mt-1 border-t border-border bg-card-bg">
          <div class="flex-1">Total Income</div>
          <div class="w-48 text-right font-mono">{{ formatCurrency(plData.totalIncome) }}</div>
        </div>

        <div class="h-4 bg-hover-bg border-b border-border border-t border-border"></div>

        <!-- Expense Group -->
        <div class="flex px-6 py-3 font-bold bg-card-bg">
          <div class="flex-1 uppercase text-xs tracking-wider text-text-secondary">Operating Expenses</div>
        </div>
        <div v-for="row in plData.expenses" :key="row.name" class="flex px-6 py-2 transition-colors border-b border-hover-bg/50 hover:bg-hover-bg">
          <div class="flex-1 pl-4">{{ row.name }}</div>
          <div class="w-48 text-right font-mono">{{ formatCurrency(row.balance) }}</div>
        </div>
        <div class="flex px-6 py-3 font-bold mt-1 border-t border-border bg-card-bg">
          <div class="flex-1">Total Expenses</div>
          <div class="w-48 text-right font-mono">{{ formatCurrency(plData.totalExpenses) }}</div>
        </div>

        <!-- Net Profit Final Total -->
        <div class="flex px-6 py-4 font-extrabold text-base border-t-2 border-text-primary bg-hover-bg">
          <div class="flex-1">Net Profit / Loss</div>
          <div class="w-48 text-right font-mono">{{ formatCurrency(plData.netProfit) }}</div>
        </div>
      </div>

      <!-- Balance Sheet Report Body -->
      <div v-if="activeTab === 'bs'" class="text-sm text-text-primary">
        
        <!-- Assets Group -->
        <div class="flex px-6 py-3 font-bold bg-card-bg">
          <div class="flex-1 uppercase text-xs tracking-wider text-text-secondary">Assets</div>
        </div>
        <div v-for="row in bsData.assets" :key="row.name" class="flex px-6 py-2 transition-colors border-b border-hover-bg/50 hover:bg-hover-bg">
          <div class="flex-1 pl-4">{{ row.name }}</div>
          <div class="w-48 text-right font-mono">{{ formatCurrency(row.balance) }}</div>
        </div>
        <div class="flex px-6 py-3 font-bold mt-1 border-t border-border bg-card-bg">
          <div class="flex-1">Total Assets</div>
          <div class="w-48 text-right font-mono">{{ formatCurrency(bsData.totalAssets) }}</div>
        </div>

        <div class="h-4 bg-hover-bg border-b border-border border-t border-border"></div>

        <!-- Liabilities Group -->
        <div class="flex px-6 py-3 font-bold bg-card-bg">
          <div class="flex-1 uppercase text-xs tracking-wider text-text-secondary">Liabilities</div>
        </div>
        <div v-for="row in bsData.liabilities" :key="row.name" class="flex px-6 py-2 transition-colors border-b border-hover-bg/50 hover:bg-hover-bg">
          <div class="flex-1 pl-4">{{ row.name }}</div>
          <div class="w-48 text-right font-mono">{{ formatCurrency(row.balance) }}</div>
        </div>
        <div class="flex px-6 py-3 font-bold mt-1 border-t border-border bg-card-bg">
          <div class="flex-1">Total Liabilities</div>
          <div class="w-48 text-right font-mono">{{ formatCurrency(bsData.totalLiabilities) }}</div>
        </div>

        <div class="h-4 bg-hover-bg border-b border-border border-t border-border"></div>

        <!-- Equity Group -->
        <div class="flex px-6 py-3 font-bold bg-card-bg">
          <div class="flex-1 uppercase text-xs tracking-wider text-text-secondary">Equity</div>
        </div>
        <div v-for="row in bsData.equity" :key="row.name" class="flex px-6 py-2 transition-colors border-b border-hover-bg/50 hover:bg-hover-bg">
          <div class="flex-1 pl-4">{{ row.name }}</div>
          <div class="w-48 text-right font-mono">{{ formatCurrency(row.balance) }}</div>
        </div>
        <div class="flex px-6 py-2 transition-colors border-b border-hover-bg/50 hover:bg-hover-bg">
          <div class="flex-1 pl-4 italic text-xs">Current Year Earnings</div>
          <div class="w-48 text-right font-mono">{{ formatCurrency(bsData.netProfit) }}</div>
        </div>
        <div class="flex px-6 py-3 font-bold mt-1 border-t border-border bg-card-bg">
          <div class="flex-1">Total Equity</div>
          <div class="w-48 text-right font-mono">{{ formatCurrency(bsData.totalEquity) }}</div>
        </div>

        <!-- Verification Banner (Replacing chunky equation block with minimalist footer) -->
        <div class="flex px-6 py-4 font-extrabold text-base border-t-2 border-text-primary bg-hover-bg">
          <div class="flex-1">Total Liabilities & Equity</div>
          <div class="w-48 text-right font-mono">{{ formatCurrency(bsData.totalLiabilities + bsData.totalEquity) }}</div>
        </div>

      </div>

    </div>

    <!-- Shift Performance Report Body -->
    <div v-if="activeTab === 'shifts'" class="bg-card-bg mt-6 rounded-lg border border-border overflow-hidden text-sm text-text-primary">
      <div class="flex px-6 py-3 font-semibold text-xs tracking-widest uppercase bg-hover-bg border-b border-border text-text-secondary">
        <div class="flex-1">Period</div>
        <div class="w-32 text-center text-xs">Shifts</div>
        <div class="w-48 text-right text-xs">Total Sales</div>
        <div class="w-48 text-right text-xs">Opening Bal.</div>
        <div class="w-48 text-right text-xs">Closing Bal.</div>
      </div>

      <div v-for="row in shiftData" :key="row.period" class="flex px-6 py-2 transition-colors border-b border-hover-bg/50 hover:bg-hover-bg items-center">
        <div class="flex-1 font-bold">{{ row.period }}</div>
        <div class="w-32 text-center font-mono">{{ row.total_shifts }}</div>
        <div class="w-48 text-right font-mono text-brand">{{ formatCurrency(row.total_sales) }}</div>
        <div class="w-48 text-right font-mono">{{ formatCurrency(row.total_opening) }}</div>
        <div class="w-48 text-right font-mono">{{ formatCurrency(row.total_closing) }}</div>
      </div>

      <div v-if="shiftData.length === 0" class="p-8 text-center text-text-muted italic">
        No shift data found for this timeframe.
      </div>
    </div>
    
    <div v-if="activeTab === 'bs'" class="mt-3 text-right">
       <span class="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded"
          :class="Math.abs(bsData.totalAssets - (bsData.totalLiabilities + bsData.totalEquity)) < 0.01
            ? 'bg-hover-bg text-text-secondary'
            : 'bg-rose-500/10 text-rose-500'">
          {{ Math.abs(bsData.totalAssets - (bsData.totalLiabilities + bsData.totalEquity)) < 0.01 ? 'Balanced ✓' : 'Out of Balance ✗' }}
        </span>
    </div>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
div { font-family: 'Inter', sans-serif; }
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ReportService } from '../services/reportService';
import { shiftService } from '../services/shiftService';
import { useCompanyStore } from '../stores/company';

const companyStore = useCompanyStore();
const activeTab = ref('pl');
const shiftTimeframe = ref<'daily'|'monthly'|'yearly'>('daily');

const plData = ref<any>({ income: [], expenses: [], totalIncome: 0, totalExpenses: 0, netProfit: 0 });
const bsData = ref<any>({ assets: [], liabilities: [], equity: [], totalAssets: 0, totalLiabilities: 0, totalEquity: 0, netProfit: 0 });
const shiftData = ref<any[]>([]);

async function refreshData() {
    const today = new Date().toISOString().split('T')[0] as string;
    
    if (activeTab.value === 'pl') {
      plData.value = await ReportService.getProfitAndLoss('1900-01-01', today);
    } else if (activeTab.value === 'bs') {
      bsData.value = await ReportService.getBalanceSheet(today);
    } else if (activeTab.value === 'shifts') {
      shiftData.value = shiftService.getShiftPerformance(shiftTimeframe.value);
    }
}

onMounted(() => {
    refreshData();
});

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: companyStore.company?.currency || 'PKR'
  }).format(val || 0);
}
</script>
