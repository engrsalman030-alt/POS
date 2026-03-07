<template>
  <div class="p-8" style="background:#F6F6F6; min-height:100vh; font-family:'Inter',sans-serif;">

    <!-- Header -->
    <header class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold" style="color:#171717;">Welcome, {{ userName }}</h1>
        <p class="mt-1 text-sm" style="color:#999;">Here is what's happening with your business today.</p>
      </div>
      <button
        @click="$router.push('/sales?new=1')"
        class="px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95"
        style="background:#46B37E; color:#fff; box-shadow:0 2px 8px rgba(70,179,126,0.3);"
        onmouseover="this.style.background='#278F5E'"
        onmouseout="this.style.background='#46B37E'"
      >
        + New Invoice
      </button>
    </header>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      
      <div class="rounded-xl p-5" style="background:#fff; border:1px solid #E2E2E2;">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs font-semibold uppercase tracking-widest" style="color:#999;">Cash & Bank</p>
          <span class="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style="background:#EDFBF4;">💰</span>
        </div>
        <p class="text-xl font-bold" style="color:#171717;">{{ formatCurrency(metrics.cash) }}</p>
        <p class="text-xs mt-1" style="color:#46B37E;">Available balance</p>
      </div>

      <div class="rounded-xl p-5" style="background:#fff; border:1px solid #E2E2E2;">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs font-semibold uppercase tracking-widest" style="color:#999;">Receivables</p>
          <span class="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style="background:#EEF4FF;">📥</span>
        </div>
        <p class="text-xl font-bold" style="color:#171717;">{{ formatCurrency(metrics.receivables) }}</p>
        <p class="text-xs mt-1" style="color:#4C9CF1;">Amount to collect</p>
      </div>

      <div class="rounded-xl p-5" style="background:#fff; border:1px solid #E2E2E2;">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs font-semibold uppercase tracking-widest" style="color:#999;">Payables</p>
          <span class="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style="background:#FFF0F0;">📤</span>
        </div>
        <p class="text-xl font-bold" style="color:#171717;">{{ formatCurrency(metrics.payables) }}</p>
        <p class="text-xs mt-1" style="color:#E03636;">Amount to pay</p>
      </div>

      <div class="rounded-xl p-5" style="background:#fff; border:1px solid #E2E2E2;">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs font-semibold uppercase tracking-widest" style="color:#999;">Inventory Value</p>
          <span class="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style="background:#FFFBEE;">📦</span>
        </div>
        <p class="text-xl font-bold" style="color:#171717;">{{ formatCurrency(metrics.inventory) }}</p>
        <p class="text-xs mt-1" style="color:#E79913;">Stock on hand</p>
      </div>

    </div>

    <!-- Bottom Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- Profit Analysis -->
      <div class="lg:col-span-2 rounded-xl p-6" style="background:#fff; border:1px solid #E2E2E2;">
        <h2 class="text-sm font-bold mb-6 flex items-center gap-2" style="color:#171717;">
          <span class="w-6 h-6 rounded flex items-center justify-center text-xs" style="background:#EDFBF4;">📊</span>
          Profit Analysis
        </h2>

        <div class="flex justify-between items-end mb-5">
          <div>
            <p class="text-xs font-semibold uppercase tracking-widest" style="color:#999;">Total Revenue</p>
            <p class="text-2xl font-bold mt-1" style="color:#171717;">{{ formatCurrency(pl.totalIncome) }}</p>
          </div>
          <div class="text-right">
            <p class="text-xs font-semibold uppercase tracking-widest" style="color:#999;">Net Profit</p>
            <p class="text-2xl font-bold mt-1" :style="{ color: pl.netProfit >= 0 ? '#278F5E' : '#E03636' }">
              {{ formatCurrency(pl.netProfit) }}
            </p>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="w-full h-2 rounded-full overflow-hidden flex mb-5" style="background:#F0F0F0;">
          <div
            class="h-full transition-all duration-1000 rounded-full"
            :style="{ width: profitRatio + '%', background: '#46B37E' }"
          ></div>
          <div class="h-full flex-1" style="background:#FFCDD2;"></div>
        </div>

        <div class="grid grid-cols-3 gap-4 pt-4" style="border-top:1px solid #F0F0F0;">
          <div>
            <p class="font-semibold uppercase" style="font-size:10px; color:#C7C7C7;">Total Expenses</p>
            <p class="text-sm font-bold mt-1" style="color:#525252;">{{ formatCurrency(pl.totalExpenses) }}</p>
          </div>
          <div>
            <p class="font-semibold uppercase" style="font-size:10px; color:#C7C7C7;">Expense Ratio</p>
            <p class="text-sm font-bold mt-1" style="color:#525252;">{{ expenseRatio }}%</p>
          </div>
          <div class="text-right">
            <p class="font-semibold uppercase" style="font-size:10px; color:#C7C7C7;">Profit Margin</p>
            <p class="text-sm font-bold mt-1" style="color:#525252;">{{ profitMargin }}%</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="rounded-xl p-6" style="background:#fff; border:1px solid #E2E2E2;">
        <h2 class="text-sm font-bold mb-5" style="color:#171717;">Quick Actions</h2>
        <div class="space-y-2">

          <button
            @click="$router.push('/accounts')"
            class="w-full flex items-center justify-between p-3 rounded-lg transition-all text-left group"
            style="border:1px solid #F0F0F0;"
            onmouseover="this.style.background='#F6F6F6'; this.style.borderColor='#E2E2E2'"
            onmouseout="this.style.background='transparent'; this.style.borderColor='#F0F0F0'"
          >
            <div class="flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style="background:#EDFBF4;">📁</span>
              <div>
                <p class="text-sm font-medium" style="color:#171717;">Chart of Accounts</p>
                <p style="font-size:11px; color:#999;">Manage account structure</p>
              </div>
            </div>
            <span style="color:#C7C7C7; font-size:12px;">→</span>
          </button>

          <button
            @click="$router.push('/inventory')"
            class="w-full flex items-center justify-between p-3 rounded-lg transition-all text-left"
            style="border:1px solid #F0F0F0;"
            onmouseover="this.style.background='#F6F6F6'; this.style.borderColor='#E2E2E2'"
            onmouseout="this.style.background='transparent'; this.style.borderColor='#F0F0F0'"
          >
            <div class="flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style="background:#FFFBEE;">📦</span>
              <div>
                <p class="text-sm font-medium" style="color:#171717;">Manage Stock</p>
                <p style="font-size:11px; color:#999;">Items & inventory levels</p>
              </div>
            </div>
            <span style="color:#C7C7C7; font-size:12px;">→</span>
          </button>

          <button
            @click="$router.push('/reports')"
            class="w-full flex items-center justify-between p-3 rounded-lg transition-all text-left"
            style="border:1px solid #F0F0F0;"
            onmouseover="this.style.background='#F6F6F6'; this.style.borderColor='#E2E2E2'"
            onmouseout="this.style.background='transparent'; this.style.borderColor='#F0F0F0'"
          >
            <div class="flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style="background:#EEF4FF;">📊</span>
              <div>
                <p class="text-sm font-medium" style="color:#171717;">Export Reports</p>
                <p style="font-size:11px; color:#999;">P&L, Balance Sheet</p>
              </div>
            </div>
            <span style="color:#C7C7C7; font-size:12px;">→</span>
          </button>

          <button
            @click="$router.push('/sales?new=1')"
            class="w-full flex items-center justify-center gap-2 p-3 rounded-lg transition-all text-sm font-semibold mt-2"
            style="background:#EDFBF4; color:#278F5E; border:1px solid #c6f0db;"
            onmouseover="this.style.background='#278F5E'; this.style.color='#fff'"
            onmouseout="this.style.background='#EDFBF4'; this.style.color='#278F5E'"
          >
            + New Sales Invoice
          </button>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useCompanyStore } from '../stores/company';
import { ReportService } from '../services/reportService';
import { query } from '../db/database';
import StatCard from '../components/StatCard.vue';

const companyStore = useCompanyStore();
const userName = computed(() => companyStore.company?.name || 'User');

const metrics = ref({
  cash: 0,
  receivables: 0,
  payables: 0,
  inventory: 0
});

const pl = ref({
  totalIncome: 0,
  totalExpenses: 0,
  netProfit: 0
});

const profitRatio = computed(() => {
    if (pl.value.totalIncome === 0) return 0;
    return Math.max(0, Math.min(100, (pl.value.netProfit / pl.value.totalIncome) * 100));
});

const expenseRatio = computed(() => {
    if (pl.value.totalIncome === 0) return 0;
    return Math.round((pl.value.totalExpenses / pl.value.totalIncome) * 100);
});

const profitMargin = computed(() => {
    if (pl.value.totalIncome === 0) return 0;
    return Math.round((pl.value.netProfit / pl.value.totalIncome) * 100);
});

onMounted(async () => {
  await loadMetrics();
});

async function loadMetrics() {
  const date = new Date().toISOString().split('T')[0];
  const bs = await ReportService.getBalanceSheet(date);
  const plData = await ReportService.getProfitAndLoss('1900-01-01', date);

  pl.value = plData;

  // Extract specific metrics
  metrics.value.cash = bs.assets.find(a => a.name === 'Cash' || a.name === 'Bank')?.balance || 0;
  metrics.value.receivables = bs.assets.find(a => a.name === 'Accounts Receivable')?.balance || 0;
  metrics.value.payables = bs.liabilities.find(a => a.name === 'Accounts Payable')?.balance || 0;
  metrics.value.inventory = bs.assets.find(a => a.name === 'Inventory')?.balance || 0;
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: companyStore.company?.currency || 'PKR'
  }).format(val || 0);
}
</script>
