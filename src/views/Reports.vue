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
          <option value="ssr">Stock Sales Report (SSR)</option>
          <option value="dsr">Daily Sales Report (DSR)</option>
          <option value="vendor_sales">Vendorwise Sales Report</option>
          <option value="shifts">Shift Performance</option>
        </select>

        <select v-if="activeTab === 'vendor_sales'" v-model="selectedBrand" @change="refreshData" class="px-3 py-1.5 text-sm font-medium rounded outline-none transition-all cursor-pointer bg-hover-bg border border-border text-text-primary">
          <option value="">Select Vendor</option>
          <option v-for="b in brands" :key="b.brand" :value="b.brand">{{ b.brand }}</option>
        </select>

        <div v-if="['ssr', 'dsr', 'vendor_sales'].includes(activeTab)" class="flex items-center gap-2">
            <input type="date" v-model="startDate" @change="refreshData" class="px-2 py-1.5 text-xs rounded border border-border bg-card-bg text-text-primary outline-none" />
            <span class="text-text-muted text-[10px] uppercase font-bold">to</span>
            <input type="date" v-model="endDate" @change="refreshData" class="px-2 py-1.5 text-xs rounded border border-border bg-card-bg text-text-primary outline-none" />
        </div>

        <select v-if="activeTab === 'shifts'" v-model="shiftTimeframe" @change="refreshData" class="px-3 py-1.5 text-sm font-medium rounded outline-none transition-all cursor-pointer bg-hover-bg border border-border text-text-primary">
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Annually</option>
        </select>

        <button v-if="activeTab === 'vendor_sales' && vendorSalesData.length > 0" @click="handlePrintReport" class="px-3 py-1.5 rounded text-sm font-black transition-all bg-text-primary text-card-bg hover:opacity-90 flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
          Print Report
        </button>

        <button @click="refreshData" class="px-3 py-1.5 rounded text-sm font-medium transition-all bg-card-bg border border-border text-text-primary hover:bg-hover-bg">
          Refresh
        </button>
      </div>
    </header>

    <!-- Tabular Report View (Frappe Books Style) -->
    <div class="bg-card-bg rounded-lg border border-border overflow-hidden">
      
      <!-- Table Header -->
      <div v-if="['pl', 'bs'].includes(activeTab)" class="flex px-6 py-3 font-semibold text-xs tracking-widest uppercase bg-hover-bg border-b border-border text-text-secondary">
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

      <!-- SSR: Stock Sales Report Body -->
      <div v-if="activeTab === 'ssr'" class="text-[11px] text-text-primary overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-hover-bg border-b border-border">
            <tr>
              <th class="py-3 px-4 font-black uppercase tracking-widest text-text-muted">Item / Description</th>
              <th class="py-3 px-4 font-black uppercase tracking-widest text-text-muted text-right">Opening</th>
              <th class="py-3 px-4 font-black uppercase tracking-widest text-text-muted text-right">Purchased</th>
              <th class="py-3 px-4 font-black uppercase tracking-widest text-text-muted text-right">Sold</th>
              <th class="py-3 px-4 font-black uppercase tracking-widest text-text-muted text-right">Closing</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border/50">
            <tr v-for="row in ssrData" :key="row.barcode" class="hover:bg-hover-bg/30 transition-colors">
              <td class="py-3 px-4">
                <div class="flex flex-col">
                  <span class="font-bold text-xs uppercase">{{ row.name }}</span>
                  <span class="text-[8px] font-black text-text-muted opacity-50 tracking-widest mt-0.5">{{ row.barcode }} | {{ row.category }}</span>
                </div>
              </td>
              <td class="py-3 px-4 text-right font-mono font-bold">{{ row.opening }}</td>
              <td class="py-3 px-4 text-right font-mono font-bold text-emerald-600">+{{ row.purchased }}</td>
              <td class="py-3 px-4 text-right font-mono font-bold text-rose-500">-{{ row.sold }}</td>
              <td class="py-3 px-4 text-right font-mono font-black border-l border-border/10" :class="row.closing < 0 ? 'text-rose-500' : 'text-text-primary'">
                {{ row.closing }}
              </td>
            </tr>
            <tr v-if="ssrData.length === 0" class="h-64">
              <td colspan="5" class="text-center py-20 italic text-text-muted">No stock movement found for this period.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Vendorwise Sales Report Body (Image Match) -->
      <div v-if="activeTab === 'vendor_sales'" class="text-[9px] text-text-primary overflow-x-auto">
        
        <!-- Professional Report Header (Visible on screen and optimized for print) -->
        <div class="p-6 bg-hover-bg/20 border-b border-border flex justify-between items-start">
           <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-text-primary text-card-bg flex items-center justify-center font-black text-xl monogram rounded-lg shadow-lg">
                {{ companyStore.getMonogram(companyStore.company?.name || 'B & H Pharmaceutical (PVT) LTD') }}
              </div>
              <div>
                 <h2 class="text-lg font-black uppercase tracking-tight text-text-primary">{{ companyStore.company?.name || 'B & H Pharmaceutical (PVT) LTD' }}</h2>
                 <p class="text-[9px] font-bold text-text-muted uppercase tracking-widest">{{ companyStore.company?.address || 'Main Pharmaceutical Distribution' }}</p>
                 <p class="text-[9px] font-bold text-text-muted uppercase tracking-widest">Phone: {{ companyStore.company?.phone || 'N/A' }}</p>
              </div>
           </div>
           <div class="text-right">
              <h1 class="text-xl font-black text-text-primary uppercase tracking-tighter">Vendorwise Sales Report</h1>
              <p v-if="selectedBrand" class="text-[10px] font-black text-brand uppercase tracking-widest mt-1">Vendor: {{ selectedBrand }}</p>
              <p class="text-[9px] font-bold text-text-secondary mt-1 italic tracking-widest">Period: {{ startDate }} to {{ endDate }}</p>
           </div>
        </div>

        <table id="vendor-sales-table" class="w-full text-left border-collapse border border-border">
          <thead class="bg-hover-bg border-b-2 border-border text-center">
            <tr class="divide-x divide-border">
              <th rowspan="2" class="py-2 px-2 font-black uppercase text-left w-12">Code</th>
              <th rowspan="2" class="py-2 px-2 font-black uppercase text-left">Description</th>
              <th rowspan="2" class="py-2 px-1 font-black uppercase w-16">Sale Price</th>
              <th rowspan="2" class="py-2 px-1 font-black uppercase w-14">Open Stock</th>
              <th colspan="2" class="py-1 px-1 font-black uppercase bg-brand/5">Receipt</th>
              <th rowspan="2" class="py-2 px-1 font-black uppercase w-14">Total Stock</th>
              <th colspan="2" class="py-1 px-1 font-black uppercase bg-emerald-500/5">Sale</th>
              <th colspan="2" class="py-1 px-1 font-black uppercase bg-rose-500/5">Return</th>
              <th colspan="2" class="py-1 px-1 font-black uppercase bg-brand/5">Net Sale</th>
              <th rowspan="2" class="py-2 px-1 font-black uppercase w-20">Sale Value</th>
              <th colspan="2" class="py-1 px-1 font-black uppercase bg-slate-500/5">Transfer</th>
              <th rowspan="2" class="py-2 px-1 font-black uppercase w-14 border-l-2 border-rose-500 bg-rose-500/10">Closing Qty</th>
              <th rowspan="2" class="py-2 px-1 font-black uppercase w-16">Stock Bonus</th>
              <th rowspan="2" class="py-2 px-1 font-black uppercase w-20">Stock Value</th>
            </tr>
            <tr class="divide-x divide-border text-[8px]">
              <th class="py-1 px-1 font-bold">Qty</th><th class="py-1 px-1 font-bold">Bns</th>
              <th class="py-1 px-1 font-bold">Qty</th><th class="py-1 px-1 font-bold">Bns</th>
              <th class="py-1 px-1 font-bold">Qty</th><th class="py-1 px-1 font-bold">Bns</th>
              <th class="py-1 px-1 font-bold">Qty</th><th class="py-1 px-1 font-bold">Bns</th>
              <th class="py-1 px-1 font-bold">Qty</th><th class="py-1 px-1 font-bold">Bns</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border/50">
            <tr v-for="row in vendorSalesData" :key="row.id" class="hover:bg-hover-bg/30 transition-colors divide-x divide-border/30">
              <td class="py-1.5 px-2 font-mono text-[8px]">{{ row.sku || row.id.slice(0,6) }}</td>
              <td class="py-1.5 px-2 font-bold uppercase truncate max-w-[150px]">{{ row.name }}</td>
              <td class="py-1.5 px-1 text-right font-mono bg-brand/5">{{ row.sales_rate }}</td>
              <td class="py-1.5 px-1 text-right font-mono font-bold">{{ row.open_stock }}</td>
              <td class="py-1.5 px-1 text-right font-mono text-emerald-600">{{ row.receipt_qty }}</td>
              <td class="py-1.5 px-1 text-right font-mono text-emerald-600">{{ row.receipt_bns }}</td>
              <td class="py-1.5 px-1 text-right font-mono font-black">{{ row.open_stock + row.receipt_qty + row.receipt_bns }}</td>
              <td class="py-1.5 px-1 text-right font-mono text-blue-600">{{ row.sale_qty }}</td>
              <td class="py-1.5 px-1 text-right font-mono text-blue-600">{{ row.sale_bns }}</td>
              <td class="py-1.5 px-1 text-right font-mono text-rose-500">{{ row.return_qty }}</td>
              <td class="py-1.5 px-1 text-right font-mono text-rose-500">{{ row.return_bns }}</td>
              <td class="py-1.5 px-1 text-right font-mono font-bold">{{ row.sale_qty - row.return_qty }}</td>
              <td class="py-1.5 px-1 text-right font-mono font-bold">{{ row.sale_bns - row.return_bns }}</td>
              <td class="py-1.5 px-1 text-right font-mono font-black border-l border-border/10">
                {{ formatCurrency((row.sale_qty - row.return_qty) * row.sales_rate) }}
              </td>
              <td class="py-1.5 px-1 text-right font-mono">{{ row.transfer_qty }}</td>
              <td class="py-1.5 px-1 text-right font-mono">{{ row.transfer_bns }}</td>
              <td class="py-1.5 px-1 text-right font-mono font-black bg-rose-500/10 border-l-2 border-rose-500">
                {{ (row.open_stock + row.receipt_qty + row.receipt_bns) - (row.sale_qty - row.return_qty) - row.transfer_qty }}
              </td>
              <td class="py-1.5 px-1 text-right font-mono text-emerald-600">0</td>
              <td class="py-1.5 px-1 text-right font-mono font-black bg-emerald-500/5">
                {{ formatCurrency(((row.open_stock + row.receipt_qty + row.receipt_bns) - (row.sale_qty - row.return_qty) - row.transfer_qty) * row.sales_rate) }}
              </td>
            </tr>
            <tr v-if="vendorSalesData.length === 0" class="h-64">
              <td colspan="18" class="text-center py-20 italic text-text-muted">
                {{ selectedBrand ? 'No transactions found for this vendor in the selected period.' : 'Select a vendor to view the sales report.' }}
              </td>
            </tr>
          </tbody>
        </table>
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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap');
div { font-family: 'Inter', sans-serif; }
.monogram { font-family: 'JetBrains Mono', monospace; }
</style>

<iframe id="report-print-frame" style="display: none;"></iframe>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ReportService } from '../services/reportService';
import { shiftService } from '../services/shiftService';
import { useCompanyStore } from '../stores/company';
import { ERPService } from '../services/erpService';
const companyStore = useCompanyStore();
const activeTab = ref('pl');
const shiftTimeframe = ref<'daily'|'monthly'|'yearly'>('daily');

const startDate = ref(new Date().toISOString().split('T')[0]);
const endDate = ref(new Date().toISOString().split('T')[0]);

const plData = ref<any>({ income: [], expenses: [], totalIncome: 0, totalExpenses: 0, netProfit: 0 });
const bsData = ref<any>({ assets: [], liabilities: [], equity: [], totalAssets: 0, totalLiabilities: 0, totalEquity: 0, netProfit: 0 });
const shiftData = ref<any[]>([]);
const ssrData = ref<any[]>([]);
const dsrData = ref<any[]>([]);
const vendorSalesData = ref<any[]>([]);
const brands = ref<any[]>([]);
const selectedBrand = ref('');

async function refreshData() {
    if (activeTab.value === 'pl') {
      plData.value = await ReportService.getProfitAndLoss('1900-01-01', endDate.value as string);
    } else if (activeTab.value === 'bs') {
      bsData.value = await ReportService.getBalanceSheet(endDate.value as string);
    } else if (activeTab.value === 'shifts') {
      shiftData.value = shiftService.getShiftPerformance(shiftTimeframe.value);
    } else if (activeTab.value === 'ssr') {
      ssrData.value = await ERPService.getSSRReport({ startDate: startDate.value as string, endDate: endDate.value as string });
    } else if (activeTab.value === 'dsr') {
      dsrData.value = await ERPService.getDSRReport({ startDate: startDate.value as string, endDate: endDate.value as string });
    } else if (activeTab.value === 'vendor_sales') {
      if (selectedBrand.value) {
        vendorSalesData.value = await ERPService.getVendorWiseSalesReport(selectedBrand.value, startDate.value as string, endDate.value as string);
      } else {
        vendorSalesData.value = [];
      }
    }
}

async function fetchBrands() {
  brands.value = await ERPService.getBrands();
}

function handlePrintReport() {
    const frame = document.getElementById('report-print-frame') as HTMLIFrameElement;
    if (!frame) return;

    const doc = frame.contentWindow?.document;
    if (!doc) return;

    const tableHtml = document.getElementById('vendor-sales-table')?.outerHTML;
    const company = companyStore.company;
    const initials = companyStore.getMonogram(company?.name || 'B & H Pharmaceutical (PVT) LTD');

    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Vendorwise Sales Report - ${selectedBrand.value}</title>
          <script src="https://cdn.tailwindcss.com"><\/script>
          <style>
             @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap');
             @media print {
               @page { margin: 5mm; size: landscape; }
               body { -webkit-print-color-adjust: exact; font-family: 'Inter', sans-serif; color: #000; }
             }
             body { font-family: 'Inter', sans-serif; padding: 20px; }
             .table-tight { width: 100%; border-collapse: collapse; }
             .table-tight th, .table-tight td { border: 1px solid #000; padding: 4px; font-size: 8px; text-align: center; }
             .table-tight th { background-color: #f8fafc !important; font-weight: 900; text-transform: uppercase; }
             .text-left { text-align: left !important; }
             .text-right { text-align: right !important; }
             .bg-highlight { background-color: #fef2f2 !important; }
             .border-highlight { border-left: 2px solid #ef4444 !important; }
             .monogram { font-family: 'JetBrains Mono', monospace; letter-spacing: 0.1em; }
          </style>
        </head>
        <body>
          <div class="flex justify-between items-start mb-8 border-b-2 border-black pb-4">
             <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-black text-white flex items-center justify-center font-black text-xl monogram">${initials}</div>
                <div>
                   <h1 class="text-xl font-black uppercase">${company?.name || 'B & H Pharmaceutical (PVT) LTD'}</h1>
                   <p class="text-[9px] font-bold text-slate-600">${company?.address || 'Main Pharmaceutical Distribution'}</p>
                   <p class="text-[9px] font-bold text-slate-600">Phone: ${company?.phone || ''}</p>
                </div>
             </div>
             <div class="text-right">
                <h2 class="text-2xl font-black uppercase tracking-tighter">Vendorwise Sales Report</h2>
                <p class="text-xs font-black text-slate-900 uppercase mt-1">${selectedBrand.value}</p>
                <p class="text-[9px] font-bold text-slate-500 italic mt-1 uppercase">Period: ${startDate.value} to ${endDate.value}</p>
             </div>
          </div>
          
          <div class="report-content">
            ${tableHtml?.replace(/class="[^"]*"/g, (match) => {
               // Simplify classes for print
               if (match.includes('bg-rose-500/10')) return 'class="bg-highlight border-highlight"';
               if (match.includes('text-right')) return 'class="text-right"';
               if (match.includes('text-left')) return 'class="text-left"';
               return 'class=""';
            })}
          </div>

          <div class="mt-8 flex justify-end">
             <div class="text-right">
                <div class="w-48 border-t border-black mb-1"></div>
                <p class="text-[8px] font-black uppercase tracking-widest text-slate-400">Authorized Signature</p>
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

onMounted(async () => {
    await fetchBrands();
    refreshData();
});

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: companyStore.company?.currency || 'PKR'
  }).format(val || 0);
}
</script>
