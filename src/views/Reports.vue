<template>
  <div class="p-8 max-w-5xl mx-auto" style="font-family:'Inter',sans-serif;">

    <header class="flex justify-between items-center mb-8 pb-6" style="border-bottom:1px solid #E2E2E2;">
      <div>
        <h1 class="text-2xl font-bold" style="color:#171717;">Financial Reports</h1>
        <p class="text-sm mt-1" style="color:#999;">Real-time financial performance and position.</p>
      </div>
      <div class="flex p-1 rounded-lg" style="background:#F6F6F6; border:1px solid #E2E2E2;">
        <button @click="activeTab = 'pl'"
          class="px-5 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all"
          :style="activeTab === 'pl'
            ? 'background:#fff; color:#278F5E; box-shadow:0 1px 4px rgba(0,0,0,0.08);'
            : 'color:#999;'">
          Profit & Loss
        </button>
        <button @click="activeTab = 'bs'"
          class="px-5 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all"
          :style="activeTab === 'bs'
            ? 'background:#fff; color:#278F5E; box-shadow:0 1px 4px rgba(0,0,0,0.08);'
            : 'color:#999;'">
          Balance Sheet
        </button>
      </div>
    </header>

    <!-- P&L -->
    <div v-if="activeTab === 'pl'" class="space-y-6">

      <div class="rounded-xl p-6" style="background:#fff; border:1px solid #E2E2E2;">
        <h3 class="text-xs font-bold uppercase tracking-widest mb-5" style="color:#999;">Income</h3>
        <div class="space-y-3">
          <div v-for="row in plData.income" :key="row.name"
            class="flex justify-between items-center py-2" style="border-bottom:1px solid #F6F6F6;">
            <span class="text-sm" style="color:#525252;">{{ row.name }}</span>
            <span class="font-mono font-semibold text-sm" style="color:#171717;">{{ formatCurrency(row.balance) }}</span>
          </div>
          <div class="flex justify-between items-center pt-3">
            <span class="text-xs font-bold uppercase tracking-widest" style="color:#278F5E;">Total Income</span>
            <span class="text-xl font-bold" style="color:#278F5E;">{{ formatCurrency(plData.totalIncome) }}</span>
          </div>
        </div>
      </div>

      <div class="rounded-xl p-6" style="background:#fff; border:1px solid #E2E2E2;">
        <h3 class="text-xs font-bold uppercase tracking-widest mb-5" style="color:#999;">Expenses</h3>
        <div class="space-y-3">
          <div v-for="row in plData.expenses" :key="row.name"
            class="flex justify-between items-center py-2" style="border-bottom:1px solid #F6F6F6;">
            <span class="text-sm" style="color:#525252;">{{ row.name }}</span>
            <span class="font-mono font-semibold text-sm" style="color:#171717;">{{ formatCurrency(row.balance) }}</span>
          </div>
          <div class="flex justify-between items-center pt-3">
            <span class="text-xs font-bold uppercase tracking-widest" style="color:#E03636;">Total Expenses</span>
            <span class="text-xl font-bold" style="color:#E03636;">{{ formatCurrency(plData.totalExpenses) }}</span>
          </div>
        </div>
      </div>

      <!-- Net Profit Banner -->
      <div class="rounded-xl p-6 flex justify-between items-center"
        style="background:#278F5E; box-shadow:0 4px 16px rgba(39,143,94,0.25);">
        <div>
          <h3 class="text-xs font-bold uppercase tracking-widest" style="color:rgba(255,255,255,0.6);">Net Profit / Loss</h3>
          <p class="text-3xl font-bold mt-1" style="color:#fff;">{{ formatCurrency(plData.netProfit) }}</p>
        </div>
        <div class="text-right">
          <p class="text-xs font-bold" style="color:rgba(255,255,255,0.6);">Profit Margin</p>
          <p class="text-lg font-bold mt-1" style="color:#fff;">{{ profitMargin }}%</p>
        </div>
      </div>
    </div>

    <!-- Balance Sheet -->
    <div v-if="activeTab === 'bs'" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- Assets -->
        <div class="rounded-xl p-6" style="background:#fff; border:1px solid #E2E2E2;">
          <h3 class="text-xs font-bold uppercase tracking-widest mb-5" style="color:#278F5E;">Assets</h3>
          <div class="space-y-3">
            <div v-for="row in bsData.assets" :key="row.name"
              class="flex justify-between items-center py-2" style="border-bottom:1px solid #F6F6F6;">
              <span class="text-sm" style="color:#525252;">{{ row.name }}</span>
              <span class="font-mono font-semibold text-sm" style="color:#171717;">{{ formatCurrency(row.balance) }}</span>
            </div>
          </div>
          <div class="flex justify-between items-center pt-4 mt-2" style="border-top:1px solid #E2E2E2;">
            <span class="text-xs font-bold uppercase tracking-widest" style="color:#999;">Total Assets</span>
            <span class="text-xl font-bold" style="color:#171717;">{{ formatCurrency(bsData.totalAssets) }}</span>
          </div>
        </div>

        <div class="space-y-6">
          <!-- Liabilities -->
          <div class="rounded-xl p-6" style="background:#fff; border:1px solid #E2E2E2;">
            <h3 class="text-xs font-bold uppercase tracking-widest mb-5" style="color:#E03636;">Liabilities</h3>
            <div class="space-y-3">
              <div v-for="row in bsData.liabilities" :key="row.name"
                class="flex justify-between items-center py-2" style="border-bottom:1px solid #F6F6F6;">
                <span class="text-sm" style="color:#525252;">{{ row.name }}</span>
                <span class="font-mono font-semibold text-sm" style="color:#171717;">{{ formatCurrency(row.balance) }}</span>
              </div>
            </div>
            <div class="flex justify-between items-center pt-3">
              <span class="text-[10px] font-bold uppercase tracking-widest" style="color:#999;">Total Liabilities</span>
              <span class="font-bold" style="color:#171717;">{{ formatCurrency(bsData.totalLiabilities) }}</span>
            </div>
          </div>

          <!-- Equity -->
          <div class="rounded-xl p-6" style="background:#fff; border:1px solid #E2E2E2;">
            <h3 class="text-xs font-bold uppercase tracking-widest mb-5" style="color:#4C9CF1;">Equity</h3>
            <div class="space-y-3">
              <div v-for="row in bsData.equity" :key="row.name"
                class="flex justify-between items-center py-2" style="border-bottom:1px solid #F6F6F6;">
                <span class="text-sm" style="color:#525252;">{{ row.name }}</span>
                <span class="font-mono font-semibold text-sm" style="color:#171717;">{{ formatCurrency(row.balance) }}</span>
              </div>
              <div class="flex justify-between items-center py-2" style="border-bottom:1px solid #F6F6F6;">
                <span class="text-sm italic" style="color:#999;">Net Profit (Current Period)</span>
                <span class="font-mono font-semibold text-sm" style="color:#171717;">{{ formatCurrency(bsData.netProfit) }}</span>
              </div>
            </div>
            <div class="flex justify-between items-center pt-3">
              <span class="text-[10px] font-bold uppercase tracking-widest" style="color:#999;">Total Equity</span>
              <span class="font-bold" style="color:#171717;">{{ formatCurrency(bsData.totalEquity) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Accounting Equation -->
      <div class="rounded-xl p-6 flex justify-between items-center"
        style="background:#171717; border:1px solid #2a2a2a;">
        <div>
          <h3 class="text-[10px] font-bold uppercase tracking-widest" style="color:rgba(255,255,255,0.3);">Accounting Equation</h3>
          <p class="text-lg font-medium mt-2 flex items-center gap-3" style="color:#fff;">
            <span>{{ formatCurrency(bsData.totalAssets) }}</span>
            <span style="color:#444; font-weight:900;">=</span>
            <span>{{ formatCurrency(bsData.totalLiabilities + bsData.totalEquity) }}</span>
          </p>
        </div>
        <div class="px-4 py-2 rounded-lg"
          :style="Math.abs(bsData.totalAssets - (bsData.totalLiabilities + bsData.totalEquity)) < 0.01
            ? 'background:#EDFBF4; color:#278F5E;'
            : 'background:#FFF0F0; color:#E03636;'">
          <span class="text-xs font-bold uppercase tracking-widest">
            {{ Math.abs(bsData.totalAssets - (bsData.totalLiabilities + bsData.totalEquity)) < 0.01 ? 'Balanced ✓' : 'Out of Balance ✗' }}
          </span>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
div { font-family: 'Inter', sans-serif; }
</style>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ReportService } from '../services/reportService';
import { useCompanyStore } from '../stores/company';

const companyStore = useCompanyStore();
const activeTab = ref('pl');

const plData = ref<any>({ income: [], expenses: [], totalIncome: 0, totalExpenses: 0, netProfit: 0 });
const bsData = ref<any>({ assets: [], liabilities: [], equity: [], totalAssets: 0, totalLiabilities: 0, totalEquity: 0, netProfit: 0 });

const profitMargin = computed(() => {
    if (plData.value.totalIncome === 0) return 0;
    return Math.round((plData.value.netProfit / plData.value.totalIncome) * 100);
});

onMounted(async () => {
    const today = new Date().toISOString().split('T')[0];
    plData.value = await ReportService.getProfitAndLoss('1900-01-01', today);
    bsData.value = await ReportService.getBalanceSheet(today);
});

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: companyStore.company?.currency || 'PKR'
  }).format(val || 0);
}
</script>
