<template>
  <div class="page-container">

    <!-- Minimalist Header & Controls -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h1 class="text-heading">Financial Reports</h1>
        <p class="text-subheading">Overview of your financial performance.</p>
      </div>

      <div class="flex items-center gap-4">
        <select v-model="activeTab" class="input-std min-w-[200px]">
          <option value="pl">Profit & Loss Statement</option>
          <option value="bs">Balance Sheet</option>
          <option value="ssr">Stock Sales Report (SSR)</option>
          <option value="dsr">Daily Sales Report (DSR)</option>
          <option value="vendor_sales">Vendorwise Sales Report</option>
          <option value="shifts">Shift Performance</option>
        </select>

        <select v-if="activeTab === 'vendor_sales'" v-model="selectedBrand" @change="refreshData" class="input-std">
          <option value="">Select Vendor</option>
          <option v-for="b in brands" :key="b.brand" :value="b.brand">{{ b.brand }}</option>
        </select>

        <div v-if="['ssr', 'dsr', 'vendor_sales'].includes(activeTab)" class="flex items-center gap-2">
            <input type="date" v-model="startDate" @change="refreshData" class="input-std py-1.5 px-2" />
            <span class="text-label-small">to</span>
            <input type="date" v-model="endDate" @change="refreshData" class="input-std py-1.5 px-2" />
        </div>

        <select v-if="activeTab === 'shifts'" v-model="shiftTimeframe" @change="refreshData" class="input-std">
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Annually</option>
        </select>

        <button @click="handlePrintReport" class="flex-none px-4 py-2 rounded-xl bg-black text-white text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
          Print Report
        </button>

        <button @click="refreshData" class="btn-ghost border border-border">
          Refresh
        </button>
      </div>
    </div>

    <!-- Tabular Report View (Frappe Books Style) -->
    <div id="printable-report-body" class="bg-card-bg rounded-lg border border-border overflow-hidden">
      
      <!-- Table Header (P&L, BS) -->
      <div v-if="['pl', 'bs'].includes(activeTab)" class="flex px-6 py-3 bg-hover-bg border-b border-border">
        <div class="flex-1 text-label-small">Account</div>
        <div class="w-48 text-right text-label-small">Total</div>
      </div>

      <!-- P&L Report Body -->
      <div v-if="activeTab === 'pl'" class="text-sm text-text-primary">
        
        <div class="flex px-6 py-3 font-bold bg-card-bg">
          <div class="flex-1 text-label-small">Income</div>
        </div>
        <div v-for="row in plData.income" :key="row.name" class="flex px-6 py-2 border-b border-hover-bg/50 hover:bg-hover-bg transition-colors">
          <div class="flex-1 pl-4 text-xs font-medium">{{ row.name }}</div>
          <div class="w-48 text-right font-mono text-xs">{{ formatCurrency(row.balance) }}</div>
        </div>
        <div class="flex px-6 py-3 font-bold mt-1 border-t border-border bg-card-bg">
          <div class="flex-1">Total Income</div>
          <div class="w-48 text-right font-mono">{{ formatCurrency(plData.totalIncome) }}</div>
        </div>

        <div class="h-4 bg-hover-bg border-b border-border border-t border-border"></div>

        <div class="flex px-6 py-3 font-bold bg-card-bg">
          <div class="flex-1 text-label-small">Operating Expenses</div>
        </div>
        <div v-for="row in plData.expenses" :key="row.name" class="flex px-6 py-2 border-b border-hover-bg/50 hover:bg-hover-bg transition-colors">
          <div class="flex-1 pl-4 text-xs font-medium">{{ row.name }}</div>
          <div class="w-48 text-right font-mono text-xs">{{ formatCurrency(row.balance) }}</div>
        </div>
        <div class="flex px-6 py-3 font-bold mt-1 border-t border-border bg-card-bg">
          <div class="flex-1 text-xs">Total Expenses</div>
          <div class="w-48 text-right font-mono text-xs">{{ formatCurrency(plData.totalExpenses) }}</div>
        </div>

        <div class="flex px-6 py-4 font-black text-sm border-t-2 border-text-primary bg-hover-bg uppercase tracking-widest">
          <div class="flex-1">Net Profit / Loss</div>
          <div class="w-48 text-right font-mono text-brand">{{ formatCurrency(plData.netProfit) }}</div>
        </div>
      </div>

      <!-- Balance Sheet Report Body -->
      <div v-if="activeTab === 'bs'" class="text-sm text-text-primary">
        
        <div class="flex px-6 py-3 font-bold bg-card-bg">
          <div class="flex-1 text-label-small">Assets</div>
        </div>
        <div v-for="row in bsData.assets" :key="row.name" class="flex px-6 py-2 border-b border-hover-bg/50 hover:bg-hover-bg transition-colors">
          <div class="flex-1 pl-4 text-xs font-medium">{{ row.name }}</div>
          <div class="w-48 text-right font-mono text-xs">{{ formatCurrency(row.balance) }}</div>
        </div>
        <div class="flex px-6 py-3 font-bold mt-1 border-t border-border bg-card-bg">
          <div class="flex-1 text-xs">Total Assets</div>
          <div class="w-48 text-right font-mono text-xs">{{ formatCurrency(bsData.totalAssets) }}</div>
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

      <!-- SSR Report Body -->
      <div v-if="activeTab === 'ssr'" class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr>
              <th class="table-th">Item / Description</th>
              <th class="table-th text-right">Opening</th>
              <th class="table-th text-right">Purchased</th>
              <th class="table-th text-right">Sold</th>
              <th class="table-th text-right">Closing</th>
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
        <div class="p-6 bg-hover-bg/20 border-b border-border flex items-center justify-between">
           <!-- MONOGRAM (B&H PHARMA) -->
           <div class="flex-shrink-0 mr-6">
              <img :src="'/logo.png'" style="max-width: 60px; max-height: 60px; object-fit: contain;" onerror="this.onerror=null; this.style.display='none'; document.getElementById('svg-fallback-ui').style.display='flex';" />
              <div id="svg-fallback-ui" style="display: none; width: 50px; height: 50px;" class="rounded-full border-2 border-emerald-500 bg-white flex-col items-center justify-center shadow-sm">
                 <div class="text-emerald-500 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.5,8H15V3.5A1.5,1.5 0 0,0 13.5,2H10.5A1.5,1.5 0 0,0 9,3.5V8H4.5A1.5,1.5 0 0,0 3,9.5V12.5A1.5,1.5 0 0,0 4.5,14H9V18.5A1.5,1.5 0 0,0 10.5,20H13.5A1.5,1.5 0 0,0 15,18.5V14H19.5A1.5,1.5 0 0,0 21,12.5V9.5A1.5,1.5 0 0,0 19.5,8Z"/></svg>
                 </div>
                 <span class="text-[5px] font-black text-emerald-600 tracking-tighter mt-1">B&H PHARMA</span>
              </div>
           </div>

           <!-- COMPANY HEADER (RAAZEE Therapeutics) -->
           <div class="flex-grow text-left">
              <h1 class="text-xl font-black uppercase text-text-primary tracking-tighter leading-none mb-1">RAAZEE Therapeutics <span class="text-[10px]">(PRIVATE) LIMITED</span></h1>
              <p class="text-[10px] font-black text-text-primary">Head office & Plant: 48 km, Lahore-Kasur road, Kasur</p>
              <p class="text-[10px] font-black text-text-primary mt-0.5 tracking-tight">NTN : 1526202-2 &nbsp;&nbsp;&nbsp; STRN : 03-04-3000-021-37</p>
           </div>
             
           <!-- REPORT BADGE -->
           <div class="flex-shrink-0 text-right ml-4">
              <h1 class="text-lg font-black text-text-primary uppercase tracking-tighter leading-none">Vendor Sales Report</h1>
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
    <div id="printable-shift-body" v-if="activeTab === 'shifts'" class="bg-card-bg mt-6 rounded-lg border border-border overflow-hidden text-sm text-text-primary">
      <div class="flex px-6 py-3 font-semibold text-xs tracking-widest uppercase bg-hover-bg border-b border-border text-text-secondary">
        <div class="flex-1">Period</div>
        <div class="w-32 text-center text-xs">Shifts</div>
        <div class="w-48 text-right text-xs">Total Sales</div>
        <div class="w-48 text-right text-xs">Opening Bal.</div>
        <div class="w-48 text-right text-xs">Closing Bal.</div>
      </div>

      <div v-for="row in shiftData" :key="row.period" class="flex px-6 py-2 transition-colors border-b border-hover-bg/50 hover:bg-hover-bg items-center">
        <div class="flex-1 font-bold text-xs">{{ row.period }}</div>
        <div class="w-32 text-center font-mono text-xs">{{ row.total_shifts }}</div>
        <div class="w-48 text-right font-mono text-brand text-xs font-black">{{ formatCurrency(row.total_sales) }}</div>
        <div class="w-48 text-right font-mono text-xs">{{ formatCurrency(row.total_opening) }}</div>
        <div class="w-48 text-right font-mono text-xs">{{ formatCurrency(row.total_closing) }}</div>
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

    <!-- Hidden Iframe for Printing -->
    <iframe id="report-print-frame" style="display: none;"></iframe>
  </div>
</template>

<style scoped>
.monogram { font-family: 'JetBrains Mono', monospace; }
</style>

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

    const tableHtml = activeTab.value === 'shifts' 
        ? document.getElementById('printable-shift-body')?.outerHTML 
        : document.getElementById('printable-report-body')?.outerHTML;
        
    // const company = companyStore.company;

    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Finance Report - ${activeTab.value.toUpperCase()}</title>
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

             <!-- COMPANY HEADER (RAAZEE Therapeutics) -->
             <div class="flex-grow text-left">
                <h1 class="text-2xl font-black uppercase text-black tracking-tighter leading-none mb-1">RAAZEE Therapeutics <span class="text-lg">(PRIVATE) LIMITED</span></h1>
                <p class="text-[11px] font-black text-black">Head office & Plant: 48 km, Lahore-Kasur road, Kasur</p>
                <p class="text-[11px] font-black text-black mt-0.5 tracking-tight">NTN : 1526202-2 &nbsp;&nbsp;&nbsp; STRN : 03-04-3000-021-37</p>
             </div>
             
             <!-- REPORT BADGE -->
             <div class="flex-shrink-0 text-right ml-4">
                <div class="border-black border-2 px-4 py-2 bg-black text-white inline-block">
                   <h2 class="text-sm font-black uppercase tracking-[0.2em] leading-none mb-0.5">${activeTab.value.replace('_', ' ')}</h2>
                   <h2 class="text-sm font-black uppercase tracking-[0.2em] leading-none">Report</h2>
                </div>
                <div class="mt-2 text-right">
                   ${activeTab.value === 'vendor_sales' && selectedBrand.value ? '<p class="text-[10px] font-black text-black uppercase tracking-widest">' + selectedBrand.value + '</p>' : ''}
                   <p class="text-[8px] font-bold text-slate-500 italic mt-0.5 uppercase tracking-widest">${startDate.value} to ${endDate.value}</p>
                </div>
             </div>
          </div>
          
          <div class="report-content">
            ${tableHtml}
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
