<template>
  <div class="page-container">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-wrap">
      <div class="min-w-0 flex-1">
        <h1 class="text-heading truncate">Welcome, {{ userName }}</h1>
        <p class="text-subheading truncate">Here is what's happening with your business today.</p>
      </div>
      <div class="text-left sm:text-right shrink-0 bg-hover-bg/50 px-3 py-1.5 rounded-lg border border-border/50">
        <p class="text-label-small">Last Updated</p>
        <p class="text-[10px] md:text-xs font-semibold text-text-primary uppercase tracking-wider">{{ new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</p>
      </div>
    </div>

    <!-- Metrics Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5 mb-8">
      <StatCard 
        title="Today's Shift Sales"
        :value="metrics.todaysShiftSales"
        icon="⏱️"
        :trend="trends.shiftSales"
      />
      <StatCard 
        title="Cash & Bank"
        :value="metrics.cash"
        icon="🏦"
        :trend="trends.cash"
      />
      <StatCard 
        title="Receivables"
        :value="metrics.receivables"
        icon="📥"
        :trend="trends.receivables"
      />
      <StatCard 
        title="Payables"
        :value="metrics.payables"
        icon="📤"
        :trend="trends.payables"
      />
      <StatCard 
        title="Inventory Value"
        :value="metrics.inventory"
        icon="📦"
        :trend="trends.inventory"
      />
    </div>

    <!-- Reports & Actions Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
      
      <!-- Profit & Loss Summary -->
      <div class="lg:col-span-2 card-std overflow-hidden">
        <div class="px-6 py-4 flex justify-between items-center bg-hover-bg border-b border-border">
          <h2 class="text-label-small">Profit & Loss Summary</h2>
          <router-link to="/reports" class="text-[10px] font-bold uppercase tracking-widest text-text-primary underline">View Full Report →</router-link>
        </div>
        <div class="p-6 md:p-8 overflow-x-auto">
          <div class="space-y-6">
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-sm font-medium text-text-secondary">Income</span>
                <span class="text-sm font-bold text-text-primary">{{ formatCurrency(metrics.income) }}</span>
              </div>
              <div class="h-1.5 w-full rounded-full overflow-hidden bg-hover-bg">
                <div class="h-full transition-all duration-1000 bg-text-primary" :style="{ width: incomePercent + '%' }"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-sm font-medium text-text-secondary">Expenses</span>
                <span class="text-sm font-bold text-text-primary">{{ formatCurrency(metrics.expenses) }}</span>
              </div>
              <div class="h-1.5 w-full rounded-full overflow-hidden bg-hover-bg">
                <div class="h-full transition-all duration-1000 bg-text-secondary" :style="{ width: expensePercent + '%' }"></div>
              </div>
            </div>
            <div class="pt-6 mt-6 border-t border-hover-bg">
              <div class="flex justify-between items-end">
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-widest mb-1 text-text-muted">Net Profit</p>
                  <p class="text-3xl font-bold" :class="metrics.net_profit < 0 ? 'text-rose-500' : 'text-text-primary'">
                    {{ formatCurrency(metrics.net_profit) }}
                  </p>
                </div>
                <div class="text-right shrink-0">
                   <p class="text-[10px] font-bold uppercase tracking-widest mb-1 text-text-muted">Profit Margin</p>
                   <p class="text-sm font-bold text-text-primary">{{ ((metrics.net_profit / (metrics.income || 1)) * 100).toFixed(1) }}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions / Tasks -->
      <div class="lg:col-span-1 card-std overflow-hidden">
        <div class="px-6 py-4 bg-hover-bg border-b border-border">
          <h2 class="text-label-small">Quick Actions</h2>
        </div>
        <div class="p-4 grid grid-cols-2 gap-3">
          <router-link v-for="action in quickActions" :key="action.label" :to="action.link"
            class="flex flex-col items-start gap-3 p-4 rounded-xl border border-border bg-card-bg transition-all hover:-translate-y-1 hover:shadow-lg group">
            <div :class="['w-10 h-10 rounded-lg flex items-center justify-center border transition-all group-hover:scale-110', action.color || 'bg-hover-bg border-border text-text-primary']">
              <span class="text-lg">{{ action.icon }}</span>
            </div>
            <div>
              <p class="text-[11px] font-black uppercase tracking-tight text-text-primary group-hover:text-brand transition-colors">{{ action.label }}</p>
              <p class="text-[9px] font-medium text-text-muted mt-0.5 line-clamp-1">{{ action.desc }}</p>
            </div>
          </router-link>
        </div>
      </div>

    </div>

    <!-- Inventory Alert (Conditional) -->
    <div v-if="lowStockItems.length > 0" class="mt-8 p-6 rounded-lg border flex items-center justify-between bg-rose-500/10 border-rose-500/20">
      <div class="flex items-center gap-4">
        <span class="text-2xl">⚠️</span>
        <div>
          <h3 class="font-bold text-sm text-rose-500">Low Stock Alert</h3>
          <p class="text-xs mt-1 text-rose-500/80">{{ lowStockItems.length }} items are below their reorder level.</p>
        </div>
      </div>
      <router-link to="/inventory" class="px-4 py-2 rounded text-xs font-bold transition-all bg-rose-500 text-white hover:bg-rose-600">
        Resolve Now
      </router-link>
    </div>

    <!-- Expiry Alert (Conditional) -->
    <div v-if="expiringSoonBatches.length > 0" class="mt-4 p-6 rounded-lg border flex items-center justify-between bg-amber-500/10 border-amber-500/20">
      <div class="flex items-center gap-4">
        <span class="text-2xl">⏳</span>
        <div>
          <h3 class="font-bold text-sm text-amber-600">Expiry Alert</h3>
          <p class="text-xs mt-1 text-amber-600/80">{{ expiringSoonBatches.length }} batches are expiring in the next 30 days.</p>
        </div>
      </div>
      <router-link to="/batches" class="px-4 py-2 rounded text-xs font-bold transition-all bg-amber-500 text-white hover:bg-amber-600">
        View Batches
      </router-link>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useCompanyStore } from '../stores/company';
import { useInventoryStore } from '../stores/inventory';
import { useShiftStore } from '../stores/shift';
import { useBatchStore } from '../stores/batches';
import { ReportService } from '../services/reportService';
import { shiftService } from '../services/shiftService';
import StatCard from '../components/StatCard.vue';

const companyStore = useCompanyStore();
const inventoryStore = useInventoryStore();
const shiftStore = useShiftStore();
const batchStore = useBatchStore();
const userName = computed(() => companyStore.company?.name || 'User');

const metrics = ref({
  income: 0,
  expenses: 0,
  net_profit: 0,
  cash: 0,
  receivables: 0,
  payables: 0,
  inventory: 0,
  todaysShiftSales: 0
});

const trends = ref({
  cash: [] as number[],
  receivables: [] as number[],
  payables: [] as number[],
  inventory: [] as number[],
  shiftSales: [] as number[]
});

const pl = ref<any>(null);

const incomePercent = computed(() => {
    const total = metrics.value.income + metrics.value.expenses;
    if (total === 0) return 0;
    return (metrics.value.income / total) * 100;
});

const expensePercent = computed(() => {
    const total = metrics.value.income + metrics.value.expenses;
    if (total === 0) return 0;
    return (metrics.value.expenses / total) * 100;
});

interface QuickAction {
  label: string;
  desc: string;
  link: string;
  icon: string;
  color?: string;
}

const quickActions: QuickAction[] = [
  { label: 'POS Terminal', desc: 'Retail counter sale', link: '/pos', icon: '💻', color: 'text-brand bg-brand/10 border-brand/20' },
  { label: 'Dist. Invoice', desc: 'B2B Wholesale sale', link: '/sales?new=1', icon: '🧾', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
  { label: 'Purchase Bill', desc: 'Record vendor stock', link: '/purchases?new=1', icon: '📥', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
  { label: 'Add Product', desc: 'New inventory item', link: '/inventory?new=1', icon: '📦', color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' },
  { label: 'New Party', desc: 'Add Customer/Vendor', link: '/parties?new=1', icon: '👤', color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
  { label: 'Bank Entry', desc: 'Receive or Pay funds', link: '/bank', icon: '🏦', color: 'text-teal-500 bg-teal-500/10 border-teal-500/20' },
  { label: 'Financials', desc: 'P&L & Balance Sheet', link: '/reports', icon: '📊', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
  { label: 'Shift History', desc: 'End-of-day summary', link: '/reports', icon: '⏱️', color: 'text-slate-500 bg-slate-500/10 border-slate-500/20' }
];

const lowStockItems = computed(() => {
    return inventoryStore.items.filter(i => i.stock_quantity <= 5);
});

const expiringSoonBatches = computed(() => {
    const today = new Date();
    const thirtyDaysOut = new Date();
    thirtyDaysOut.setDate(today.getDate() + 30);
    const todayStr = (new Date().toISOString().split('T')[0]) || '';
    const thirtyDaysOutStr = (thirtyDaysOut.toISOString().split('T')[0]) || '';

    return batchStore.batches.filter(b => {
        if (!b.expiry_date) return false;
        return b.expiry_date >= todayStr && b.expiry_date <= thirtyDaysOutStr;
    });
});

onMounted(async () => {
  await shiftStore.initializeActiveShift();
  await Promise.all([
    inventoryStore.fetchItems(),
    batchStore.fetchBatches(),
    loadMetrics(),
    loadTrends()
  ]);
});

async function loadMetrics() {
  const date = (new Date().toISOString().split('T')[0]) as string;
  const bs = await ReportService.getBalanceSheet(date);
  const plData = await ReportService.getProfitAndLoss('1900-01-01', date);

  pl.value = plData as any;
  metrics.value.income = (plData as any).totalIncome || 0;
  metrics.value.expenses = (plData as any).totalExpenses || 0;
  metrics.value.net_profit = (plData as any).netProfit || 0;

  // Extract specific metrics
  metrics.value.cash = bs.assets
    .filter(a => a.name === 'Cash' || a.name === 'Bank')
    .reduce((sum, a) => sum + (a.balance as number || 0), 0);
  metrics.value.receivables = (bs.assets.find(a => a.name === 'Accounts Receivable')?.balance as any) || 0;
  metrics.value.payables = (bs.liabilities.find(a => a.name === 'Accounts Payable')?.balance as any) || 0;
  metrics.value.inventory = (bs.assets.find(a => a.name === 'Inventory')?.balance as any) || 0;
  metrics.value.todaysShiftSales = shiftService.getTodaysShiftSales();
}

async function loadTrends() {
  const days = 14;
  const [cashHistory, receivablesHistory, payablesHistory, inventoryHistory] = await Promise.all([
    ReportService.getHistoricalBalances('Asset', days, ['Cash', 'Bank']),
    ReportService.getHistoricalBalances('Asset', days, ['Accounts Receivable']),
    ReportService.getHistoricalBalances('Liability', days, ['Accounts Payable']),
    ReportService.getHistoricalBalances('Asset', days, ['Inventory'])
  ]);

  trends.value.cash = cashHistory;
  trends.value.receivables = receivablesHistory;
  trends.value.payables = payablesHistory;
  trends.value.inventory = inventoryHistory;
  trends.value.shiftSales = shiftService.getHistoricalShiftSales(14);
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: companyStore.company?.currency || 'PKR',
    minimumFractionDigits: 0
  }).format(val || 0);
}
</script>
