<template>
  <div class="page-container">

    <!-- Header & Controls (Sticky to prevent jumping) -->
    <div class="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border pb-4 mb-4">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 class="text-heading">Financial Reports</h1>
          <p class="text-subheading">Select a specialized report or use the quick distribution shortcuts below.</p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <!-- Report Selector -->
          <select v-model="activeTab" @change="onTabChange" class="input-std min-w-[220px]">
            <optgroup label="Accounting">
              <option value="pl">Profit &amp; Loss Statement</option>
              <option value="bs">Balance Sheet</option>
            </optgroup>
            <optgroup label="Sales & Stock">
              <option value="ssr">Stock Sales Report (SSR)</option>
              <option value="dsr">Daily Sales Report (DSR)</option>
              <option value="salesman_summary">Salesman Performance Report</option>
              <option value="customer_summary">Customer Sales Summary</option>
              <option value="vendor_sales">Vendor-wise Sales Report</option>
            </optgroup>
            <optgroup label="Ledgers">
              <option value="customer_ledger">Customer Ledger</option>
              <option value="supplier_ledger">Supplier Ledger</option>
            </optgroup>
            <optgroup label="Geographic">
              <option value="area_sales">Area-wise Sales Summary</option>
            </optgroup>
            <optgroup label="Operations">
              <option value="shifts">Shift Performance</option>
            </optgroup>
          </select>

          <!-- Detail Toggle -->
          <label v-if="['dsr', 'ssr'].includes(activeTab)" class="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-card-bg cursor-pointer hover:bg-hover-bg transition-colors">
            <input type="checkbox" v-model="isDetailed" @change="refreshData" class="rounded border-border text-brand focus:ring-brand" />
            <span class="text-[10px] font-black uppercase tracking-widest">Detailed View</span>
          </label>

          <!-- Print -->
          <button @click="handlePrintReport"
            class="btn-primary flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
            Print
          </button>

          <button @click="refreshData" class="btn-ghost border border-border">Refresh</button>
        </div>
      </div>

      <!-- Quick Shortcuts Row -->
      <div class="flex flex-wrap items-center gap-3 bg-hover-bg/30 p-2 rounded-2xl border border-border/50 mt-4 h-[68px] overflow-hidden">
        <button @click="runShortcut('today_dsr')" class="flex flex-col items-center gap-1 px-4 py-2 hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-all group border border-transparent hover:border-border shadow-sm min-w-[100px]">
          <div class="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <span class="text-[9px] font-black uppercase tracking-tighter">Today's Sales</span>
        </button>

        <button @click="runShortcut('salesman')" class="flex flex-col items-center gap-1 px-4 py-2 hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-all group border border-transparent hover:border-border shadow-sm min-w-[100px]">
          <div class="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
          </div>
          <span class="text-[9px] font-black uppercase tracking-tighter">Salesman Perf.</span>
        </button>

        <button @click="runShortcut('customer_sales')" class="flex flex-col items-center gap-1 px-4 py-2 hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-all group border border-transparent hover:border-border shadow-sm min-w-[100px]">
          <div class="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <span class="text-[9px] font-black uppercase tracking-tighter">Customer Billing</span>
        </button>

        <button @click="runShortcut('ssr')" class="flex flex-col items-center gap-1 px-4 py-2 hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-all group border border-transparent hover:border-border shadow-sm min-w-[100px]">
          <div class="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          </div>
          <span class="text-[9px] font-black uppercase tracking-tighter">Stock (SSR)</span>
        </button>

        <button @click="runShortcut('recovery')" class="flex flex-col items-center gap-1 px-4 py-2 hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-all group border border-transparent hover:border-border shadow-sm min-w-[100px]">
          <div class="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <span class="text-[9px] font-black uppercase tracking-tighter">Recovery/Ledger</span>
        </button>

        <div class="h-8 w-px bg-border/50 mx-2"></div>

        <!-- Date Range & Secondary Filters -->
        <div class="flex items-center gap-4">
          <div v-if="['ssr','dsr','vendor_sales','customer_ledger','supplier_ledger','salesman_summary','customer_summary','area_sales'].includes(activeTab)" class="flex items-center gap-1">
            <input type="date" v-model="startDate" @change="refreshData" class="input-std py-1.5 px-2 text-[10px]" />
            <span class="text-[9px] font-bold text-text-muted">TO</span>
            <input type="date" v-model="endDate" @change="refreshData" class="input-std py-1.5 px-2 text-[10px]" />
          </div>

          <!-- SSR Group By -->
          <select v-if="activeTab === 'ssr'" v-model="ssrGroupBy" @change="refreshData" class="input-std text-[10px] py-1">
            <option value="product">By Product</option>
            <option value="brand">By Brand</option>
            <option value="category">By Category</option>
          </select>

          <!-- Vendor Brand filter -->
          <select v-if="activeTab === 'vendor_sales'" v-model="selectedBrand" @change="refreshData" class="input-std text-[10px] py-1">
            <option value="">Select Vendor</option>
            <option v-for="b in brands" :key="b.brand" :value="b.brand">{{ b.brand }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Main Report Body -->
    <div id="printable-report-body" class="bg-card-bg rounded-lg border border-border overflow-hidden min-h-[60vh]">

      <!-- Table Header (P&L, BS) -->
      <div v-if="['pl','bs'].includes(activeTab)" class="flex px-6 py-3 bg-hover-bg border-b border-border">
        <div class="flex-1 text-label-small">Account</div>
        <div class="w-48 text-right text-label-small">Total</div>
      </div>

      <!-- ── Profit & Loss ──────────────────────────────────────────── -->
      <div v-if="activeTab === 'pl'" class="text-sm text-text-primary">
        <div class="flex px-6 py-3 font-bold bg-card-bg"><div class="flex-1 text-label-small">Income</div></div>
        <div v-for="row in plData.income" :key="row.name" class="flex px-6 py-2 border-b border-hover-bg/50 hover:bg-hover-bg transition-colors">
          <div class="flex-1 pl-4 text-xs font-medium">{{ row.name }}</div>
          <div class="w-48 text-right font-mono text-xs">{{ formatCurrency(row.balance) }}</div>
        </div>
        <div class="flex px-6 py-3 font-bold border-t border-border bg-card-bg">
          <div class="flex-1">Total Income</div>
          <div class="w-48 text-right font-mono">{{ formatCurrency(plData.totalIncome) }}</div>
        </div>
        <div class="h-4 bg-hover-bg border-y border-border"></div>
        <div class="flex px-6 py-3 font-bold bg-card-bg"><div class="flex-1 text-label-small">Operating Expenses</div></div>
        <div v-for="row in plData.expenses" :key="row.name" class="flex px-6 py-2 border-b border-hover-bg/50 hover:bg-hover-bg transition-colors">
          <div class="flex-1 pl-4 text-xs font-medium">{{ row.name }}</div>
          <div class="w-48 text-right font-mono text-xs">{{ formatCurrency(row.balance) }}</div>
        </div>
        <div class="flex px-6 py-3 font-bold border-t border-border bg-card-bg">
          <div class="flex-1 text-xs">Total Expenses</div>
          <div class="w-48 text-right font-mono text-xs">{{ formatCurrency(plData.totalExpenses) }}</div>
        </div>
        <div class="flex px-6 py-4 font-black text-sm border-t-2 border-text-primary bg-hover-bg uppercase tracking-widest">
          <div class="flex-1">Net Profit / Loss</div>
          <div class="w-48 text-right font-mono text-brand">{{ formatCurrency(plData.netProfit) }}</div>
        </div>
      </div>

      <!-- ── Balance Sheet ──────────────────────────────────────────── -->
      <div v-if="activeTab === 'bs'" class="text-sm text-text-primary">
        <div class="flex px-6 py-3 font-bold bg-card-bg"><div class="flex-1 text-label-small">Assets</div></div>
        <div v-for="row in bsData.assets" :key="row.name" class="flex px-6 py-2 border-b border-hover-bg/50 hover:bg-hover-bg transition-colors">
          <div class="flex-1 pl-4 text-xs font-medium">{{ row.name }}</div>
          <div class="w-48 text-right font-mono text-xs">{{ formatCurrency(row.balance) }}</div>
        </div>
        <div class="flex px-6 py-3 font-bold border-t border-border bg-card-bg">
          <div class="flex-1 text-xs">Total Assets</div>
          <div class="w-48 text-right font-mono text-xs">{{ formatCurrency(bsData.totalAssets) }}</div>
        </div>
        <div class="h-4 bg-hover-bg border-y border-border"></div>
        <div class="flex px-6 py-3 font-bold bg-card-bg"><div class="flex-1 uppercase text-xs tracking-wider text-text-secondary">Liabilities</div></div>
        <div v-for="row in bsData.liabilities" :key="row.name" class="flex px-6 py-2 border-b border-hover-bg/50 hover:bg-hover-bg transition-colors">
          <div class="flex-1 pl-4">{{ row.name }}</div>
          <div class="w-48 text-right font-mono">{{ formatCurrency(row.balance) }}</div>
        </div>
        <div class="flex px-6 py-3 font-bold border-t border-border bg-card-bg">
          <div class="flex-1">Total Liabilities</div>
          <div class="w-48 text-right font-mono">{{ formatCurrency(bsData.totalLiabilities) }}</div>
        </div>
        <div class="h-4 bg-hover-bg border-y border-border"></div>
        <div class="flex px-6 py-3 font-bold bg-card-bg"><div class="flex-1 uppercase text-xs tracking-wider text-text-secondary">Equity</div></div>
        <div v-for="row in bsData.equity" :key="row.name" class="flex px-6 py-2 border-b border-hover-bg/50 hover:bg-hover-bg transition-colors">
          <div class="flex-1 pl-4">{{ row.name }}</div>
          <div class="w-48 text-right font-mono">{{ formatCurrency(row.balance) }}</div>
        </div>
        <div class="flex px-6 py-2 border-b border-hover-bg/50 hover:bg-hover-bg transition-colors">
          <div class="flex-1 pl-4 italic text-xs">Current Year Earnings</div>
          <div class="w-48 text-right font-mono">{{ formatCurrency(bsData.netProfit) }}</div>
        </div>
        <div class="flex px-6 py-3 font-bold border-t border-border bg-card-bg">
          <div class="flex-1">Total Equity</div>
          <div class="w-48 text-right font-mono">{{ formatCurrency(bsData.totalEquity) }}</div>
        </div>
        <div class="flex px-6 py-4 font-extrabold text-base border-t-2 border-text-primary bg-hover-bg">
          <div class="flex-1">Total Liabilities &amp; Equity</div>
          <div class="w-48 text-right font-mono">{{ formatCurrency(bsData.totalLiabilities + bsData.totalEquity) }}</div>
        </div>
      </div>

      <!-- ── SSR ─────────────────────────────────────────────────────── -->
      <div v-if="activeTab === 'ssr'" class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr>
              <th class="table-th">{{ ssrGroupBy === 'brand' ? 'Brand' : ssrGroupBy === 'category' ? 'Category' : 'Item / Description' }}</th>
              <th v-if="isDetailed && ssrGroupBy === 'product'" class="table-th text-right">TP</th>
              <th v-if="isDetailed && ssrGroupBy === 'product'" class="table-th text-right">MRP</th>
              <th class="table-th text-right">Opening</th>
              <th class="table-th text-right">Purchased</th>
              <th class="table-th text-right">Sold</th>
              <th class="table-th text-right">Closing</th>
              <th v-if="isDetailed" class="table-th text-right">Value (TP)</th>
              <th v-if="isDetailed" class="table-th text-right">Value (MRP)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border/50">
            <tr v-for="row in ssrData" :key="row.barcode || row.name" class="hover:bg-hover-bg/30 transition-colors">
              <td class="py-3 px-4">
                <div class="flex flex-col">
                  <span class="font-bold text-xs uppercase">{{ row.name }}</span>
                  <span v-if="ssrGroupBy === 'product'" class="text-[8px] font-black text-text-muted opacity-50 tracking-widest mt-0.5">{{ row.barcode }} | {{ row.category }}</span>
                </div>
              </td>
              <td v-if="isDetailed && ssrGroupBy === 'product'" class="py-3 px-4 text-right font-mono text-[10px]">{{ formatCurrency(row.tp) }}</td>
              <td v-if="isDetailed && ssrGroupBy === 'product'" class="py-3 px-4 text-right font-mono text-[10px]">{{ formatCurrency(row.mrp) }}</td>
              <td class="py-3 px-4 text-right font-mono font-bold">{{ row.opening }}</td>
              <td class="py-3 px-4 text-right font-mono font-bold text-emerald-600">+{{ row.purchased }}</td>
              <td class="py-3 px-4 text-right font-mono font-bold text-rose-500">-{{ row.sold }}</td>
              <td class="py-3 px-4 text-right font-mono font-black border-l border-border/10" :class="row.closing < 0 ? 'text-rose-500' : ''">{{ row.closing }}</td>
              <td v-if="isDetailed" class="py-3 px-4 text-right font-mono text-[10px] font-bold">{{ formatCurrency(row.value_at_tp) }}</td>
              <td v-if="isDetailed" class="py-3 px-4 text-right font-mono text-[10px] font-bold">{{ formatCurrency(row.value_at_mrp) }}</td>
            </tr>
            <!-- Totals Row -->
            <tr v-if="ssrData.length > 0" class="bg-hover-bg font-bold border-t-2 border-border">
              <td :colspan="(isDetailed && ssrGroupBy === 'product') ? 3 : 1" class="py-3 px-4 text-xs font-black uppercase tracking-widest">TOTALS</td>
              <td class="py-3 px-4 text-right font-mono font-black">{{ ssrData.reduce((s, r) => s + (Number(r.opening)||0), 0) }}</td>
              <td class="py-3 px-4 text-right font-mono font-black text-emerald-600">+{{ ssrData.reduce((s, r) => s + (Number(r.purchased)||0), 0) }}</td>
              <td class="py-3 px-4 text-right font-mono font-black text-rose-500">-{{ ssrData.reduce((s, r) => s + (Number(r.sold)||0), 0) }}</td>
              <td class="py-3 px-4 text-right font-mono font-black border-l border-border/10">{{ ssrData.reduce((s, r) => s + (Number(r.closing)||0), 0) }}</td>
              <td v-if="isDetailed" class="py-3 px-4 text-right font-mono text-[10px] font-black">{{ formatCurrency(ssrData.reduce((s, r) => s + (Number(r.value_at_tp)||0), 0)) }}</td>
              <td v-if="isDetailed" class="py-3 px-4 text-right font-mono text-[10px] font-black">{{ formatCurrency(ssrData.reduce((s, r) => s + (Number(r.value_at_mrp)||0), 0)) }}</td>
            </tr>
            <tr v-if="ssrData.length === 0" class="h-64">
              <td colspan="5" class="text-center py-20 italic text-text-muted">No stock movement found for this period.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ── DSR ─────────────────────────────────────────────────────── -->
      <div v-if="activeTab === 'dsr'" class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr>
              <th class="table-th">Date</th>
              <th v-if="!isDetailed" class="table-th">Invoice #</th>
              <th class="table-th">Customer</th>
              <th v-if="isDetailed" class="table-th">Product Detail</th>
              <th v-if="isDetailed" class="table-th">Batch / Exp</th>
              <th class="table-th">SSR/DSR</th>
              <th v-if="isDetailed" class="table-th text-right">Qty</th>
              <th v-if="isDetailed" class="table-th text-right">Bonus</th>
              <th class="table-th text-right">{{ isDetailed ? 'Net Rate' : 'Total Amnt' }}</th>
              <th v-if="!isDetailed" class="table-th text-right">Paid</th>
              <th v-if="!isDetailed" class="table-th text-right">Credit</th>
              <th class="table-th text-right">Profit</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border/50">
            <tr v-for="row in dsrData" :key="row.invoice_id + (row.item_name || '')" class="hover:bg-hover-bg/30 transition-colors">
              <td class="py-2 px-4 text-[10px]">{{ String(row.date||'').split('T')[0] }}</td>
              <td v-if="!isDetailed" class="py-2 px-4 font-mono text-[10px] text-text-muted">{{ String(row.invoice_id||'').slice(0,8).toUpperCase() }}</td>
              <td class="py-2 px-4 text-[10px] font-bold uppercase">{{ row.customer_name || '—' }}</td>
              
              <td v-if="isDetailed" class="py-2 px-4">
                <div class="flex flex-col">
                  <div class="flex items-center gap-2">
                    <span class="font-black text-[10px] uppercase text-brand">{{ row.item_name }}</span>
                    <span v-if="row.document_type === 'Return'" class="px-1 py-0.5 rounded bg-rose-500 text-white text-[7px] font-black uppercase">Return</span>
                  </div>
                  <span class="text-[9px] text-text-muted italic">Inv: {{ String(row.invoice_id||'').slice(0,8).toUpperCase() }}</span>
                </div>
              </td>
              <td v-if="isDetailed" class="py-2 px-4 text-[9px] font-mono">
                <div class="flex flex-col">
                  <span>{{ row.batch_number || '—' }}</span>
                  <span class="text-rose-500">{{ row.expiry_date || '—' }}</span>
                </div>
              </td>

              <td class="py-2 px-4 text-[10px]">{{ row.ssr_name || row.dsr_name || '—' }}</td>
              
              <td v-if="isDetailed" class="py-2 px-4 text-right font-mono text-[10px] font-bold">{{ row.quantity }}</td>
              <td v-if="isDetailed" class="py-2 px-4 text-right font-mono text-[10px] text-emerald-600">{{ row.bonus_quantity }}</td>
              
              <td class="py-2 px-4 text-right font-mono text-[10px] font-bold">
                {{ isDetailed ? formatCurrency(row.rate) : formatCurrency(row.total_amount) }}
              </td>
              
              <td v-if="!isDetailed" class="py-2 px-4 text-right font-mono text-[10px] text-emerald-600">{{ formatCurrency(row.paid_amount) }}</td>
              <td v-if="!isDetailed" class="py-2 px-4 text-right font-mono text-[10px] text-rose-500">{{ formatCurrency(row.credit_amount) }}</td>
              <td class="py-2 px-4 text-right font-mono text-[10px] font-black text-brand">{{ formatCurrency(row.profit) }}</td>
            </tr>
            <!-- Totals -->
            <tr v-if="dsrData.length > 0" class="bg-hover-bg font-bold border-t-2 border-border">
              <td :colspan="isDetailed ? 6 : 5" class="py-3 px-4 text-xs font-black uppercase tracking-widest">TOTALS</td>
              <td v-if="isDetailed" class="py-3 px-4 text-right font-mono text-[10px] font-black">{{ dsrData.reduce((s,r)=>s+(r.quantity||0),0) }}</td>
              <td v-if="isDetailed" class="py-3 px-4 text-right font-mono text-[10px] font-black text-emerald-600">{{ dsrData.reduce((s,r)=>s+(r.bonus_quantity||0),0) }}</td>
              <td class="py-3 px-4 text-right font-mono text-[10px] font-black">
                {{ isDetailed ? '—' : formatCurrency(dsrData.reduce((s,r)=>s+(r.total_amount||0),0)) }}
              </td>
              <td v-if="!isDetailed" class="py-3 px-4 text-right font-mono text-[10px] font-black text-emerald-600">{{ formatCurrency(dsrData.reduce((s,r)=>s+(r.paid_amount||0),0)) }}</td>
              <td v-if="!isDetailed" class="py-3 px-4 text-right font-mono text-[10px] font-black text-rose-500">{{ formatCurrency(dsrData.reduce((s,r)=>s+(r.credit_amount||0),0)) }}</td>
              <td class="py-3 px-4 text-right font-mono text-[10px] font-black text-brand">{{ formatCurrency(dsrData.reduce((s,r)=>s+(r.profit||0),0)) }}</td>
            </tr>
            <tr v-if="dsrData.length === 0" class="h-64">
              <td colspan="9" class="text-center py-20 italic text-text-muted">No sales found for this period.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ── Customer Ledger ─────────────────────────────────────────── -->
      <div v-if="activeTab === 'customer_ledger'">
        <div v-if="!selectedCustomer" class="p-20 text-center italic text-text-muted">Select a customer to view their ledger.</div>
        <div v-else>
          <!-- Summary Bar -->
          <div class="flex items-center justify-between px-6 py-3 bg-hover-bg border-b border-border">
            <div class="text-xs font-black uppercase tracking-widest">{{ ledgerPartyName }}</div>
            <div class="flex gap-6 text-xs">
              <span>Opening: <strong class="font-mono">{{ formatCurrency(ledgerSummary.openingBalance) }}</strong></span>
              <span>Total Debit: <strong class="font-mono text-rose-500">{{ formatCurrency(ledgerSummary.totalDebit) }}</strong></span>
              <span>Total Credit: <strong class="font-mono text-emerald-600">{{ formatCurrency(ledgerSummary.totalCredit) }}</strong></span>
              <span>Closing: <strong class="font-mono text-brand">{{ formatCurrency(ledgerSummary.closingBalance) }}</strong></span>
            </div>
          </div>
          <table class="w-full text-left border-collapse">
            <thead>
              <tr>
                <th class="table-th">Date</th>
                <th class="table-th">Reference</th>
                <th class="table-th">Description</th>
                <th class="table-th text-right">Debit (Sales)</th>
                <th class="table-th text-right">Credit (Received)</th>
                <th class="table-th text-right">Running Balance</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border/50">
              <!-- Opening Balance Row -->
              <tr class="bg-hover-bg/50">
                <td class="py-2 px-4 text-xs italic" colspan="5">Opening Balance</td>
                <td class="py-2 px-4 text-right font-mono text-xs font-bold">{{ formatCurrency(ledgerSummary.openingBalance) }}</td>
              </tr>
              <tr v-for="row in ledgerData" :key="row.reference + row.date" class="hover:bg-hover-bg/30 transition-colors">
                <td class="py-2 px-4 text-xs">{{ String(row.date||'').split('T')[0] }}</td>
                <td class="py-2 px-4 font-mono text-xs text-text-muted">{{ String(row.reference||'').slice(0,8).toUpperCase() }}</td>
                <td class="py-2 px-4 text-xs">{{ row.description }}</td>
                <td class="py-2 px-4 text-right font-mono text-xs text-rose-500">{{ row.debit ? formatCurrency(row.debit) : '—' }}</td>
                <td class="py-2 px-4 text-right font-mono text-xs text-emerald-600">{{ row.credit ? formatCurrency(row.credit) : '—' }}</td>
                <td class="py-2 px-4 text-right font-mono text-xs font-bold" :class="row.balance < 0 ? 'text-rose-500' : 'text-text-primary'">{{ formatCurrency(row.balance) }}</td>
              </tr>
              <tr v-if="ledgerData.length === 0" class="h-32">
                <td colspan="6" class="text-center py-10 italic text-text-muted">No transactions in this period.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ── Salesman Summary ────────────────────────────────────────── -->
      <div v-if="activeTab === 'salesman_summary'" class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr>
              <th class="table-th">Salesman / DSR</th>
              <th class="table-th">Role</th>
              <th class="table-th text-center">Invoices</th>
              <th class="table-th text-right">Total Sales</th>
              <th class="table-th text-right">Recovered</th>
              <th class="table-th text-right">Credit (Outstanding)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border/50">
            <tr v-for="row in salesmanData" :key="row.salesman_name" class="hover:bg-hover-bg/30 transition-colors">
              <td class="py-3 px-4 font-black uppercase text-xs tracking-tight">{{ row.salesman_name }}</td>
              <td class="py-3 px-4 text-xs font-bold text-text-muted opacity-80">{{ row.role }}</td>
              <td class="py-3 px-4 text-center font-mono font-bold">{{ row.total_invoices }}</td>
              <td class="py-3 px-4 text-right font-mono font-black text-brand">{{ formatCurrency(row.total_sales) }}</td>
              <td class="py-3 px-4 text-right font-mono font-bold text-emerald-600">{{ formatCurrency(row.total_recovered) }}</td>
              <td class="py-3 px-4 text-right font-mono font-bold text-rose-500">{{ formatCurrency(row.total_credit) }}</td>
            </tr>
            <tr v-if="salesmanData.length === 0" class="h-64">
              <td colspan="6" class="text-center py-20 italic text-text-muted">No salesman activity found for this period.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ── Customer Sales Summary ─────────────────────────────────── -->
      <div v-if="activeTab === 'customer_summary'" class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr>
              <th class="table-th">Customer Name</th>
              <th class="table-th">City/Area</th>
              <th class="table-th text-center">Orders</th>
              <th class="table-th text-right">Total Billed</th>
              <th class="table-th text-right">Total Paid</th>
              <th class="table-th text-right">Outstanding</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border/50">
            <tr v-for="row in customerSummaryData" :key="row.customer_name" class="hover:bg-hover-bg/30 transition-colors">
              <td class="py-3 px-4 font-black uppercase text-xs">{{ row.customer_name }}</td>
              <td class="py-3 px-4 text-xs italic">{{ row.city || '—' }}</td>
              <td class="py-3 px-4 text-center font-mono font-bold">{{ row.total_visits }}</td>
              <td class="py-3 px-4 text-right font-mono font-black text-xs">{{ formatCurrency(row.total_billed) }}</td>
              <td class="py-3 px-4 text-right font-mono text-emerald-600 text-xs">{{ formatCurrency(row.total_paid) }}</td>
              <td class="py-3 px-4 text-right font-mono font-bold text-rose-500 text-xs">{{ formatCurrency(row.outstanding) }}</td>
            </tr>
            <tr v-if="customerSummaryData.length === 0" class="h-64">
              <td colspan="6" class="text-center py-20 italic text-text-muted">No customer transactions found for this period.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ── Supplier Ledger ──────────────────────────────────────────── -->
      <div v-if="activeTab === 'supplier_ledger'">
        <div v-if="!selectedSupplier" class="p-20 text-center italic text-text-muted">Select a supplier to view their ledger.</div>
        <div v-else>
          <div class="flex items-center justify-between px-6 py-3 bg-hover-bg border-b border-border">
            <div class="text-xs font-black uppercase tracking-widest">{{ ledgerPartyName }}</div>
            <div class="flex gap-6 text-xs">
              <span>Opening: <strong class="font-mono">{{ formatCurrency(ledgerSummary.openingBalance) }}</strong></span>
              <span>Purchases: <strong class="font-mono text-rose-500">{{ formatCurrency(ledgerSummary.totalCredit) }}</strong></span>
              <span>Payments: <strong class="font-mono text-emerald-600">{{ formatCurrency(ledgerSummary.totalDebit) }}</strong></span>
              <span>Closing: <strong class="font-mono text-brand">{{ formatCurrency(ledgerSummary.closingBalance) }}</strong></span>
            </div>
          </div>
          <table class="w-full text-left border-collapse">
            <thead>
              <tr>
                <th class="table-th">Date</th>
                <th class="table-th">Reference</th>
                <th class="table-th">Description</th>
                <th class="table-th text-right">Debit (Paid)</th>
                <th class="table-th text-right">Credit (Purchases)</th>
                <th class="table-th text-right">Running Balance</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border/50">
              <tr class="bg-hover-bg/50">
                <td class="py-2 px-4 text-xs italic" colspan="5">Opening Balance</td>
                <td class="py-2 px-4 text-right font-mono text-xs font-bold">{{ formatCurrency(ledgerSummary.openingBalance) }}</td>
              </tr>
              <tr v-for="row in ledgerData" :key="row.reference + row.date" class="hover:bg-hover-bg/30 transition-colors">
                <td class="py-2 px-4 text-xs">{{ String(row.date||'').split('T')[0] }}</td>
                <td class="py-2 px-4 font-mono text-xs text-text-muted">{{ String(row.reference||'').slice(0,8).toUpperCase() }}</td>
                <td class="py-2 px-4 text-xs">{{ row.description }}</td>
                <td class="py-2 px-4 text-right font-mono text-xs text-emerald-600">{{ row.debit ? formatCurrency(row.debit) : '—' }}</td>
                <td class="py-2 px-4 text-right font-mono text-xs text-rose-500">{{ row.credit ? formatCurrency(row.credit) : '—' }}</td>
                <td class="py-2 px-4 text-right font-mono text-xs font-bold" :class="row.balance < 0 ? 'text-emerald-600' : 'text-text-primary'">{{ formatCurrency(row.balance) }}</td>
              </tr>
              <tr v-if="ledgerData.length === 0" class="h-32">
                <td colspan="6" class="text-center py-10 italic text-text-muted">No transactions in this period.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ── Vendor-wise Sales ─────────────────────────────────────────── -->
      <div v-if="activeTab === 'vendor_sales'" class="text-[9px] text-text-primary overflow-x-auto">
        <div class="p-6 bg-hover-bg/20 border-b border-border flex items-center justify-between">
          <div class="flex-shrink-0 mr-6">
            <img :src="'/logo.png'" style="max-width:60px;max-height:60px;object-fit:contain;" onerror="this.style.display='none'" />
          </div>
          <div class="flex-grow text-left">
            <h1 class="text-xl font-black uppercase text-text-primary tracking-tighter leading-none mb-1">{{ companyStore.company?.name || 'B & H Pharmaceutical (PVT) LTD' }}</h1>
            <p class="text-[10px] font-black text-text-primary">{{ companyStore.company?.address || 'Ismail Adda, Khwaza Khela. Swat' }}</p>
            <p class="text-[10px] font-black text-text-primary mt-0.5">NTN : {{ companyStore.company?.ntn || '1526202-2' }} &nbsp;&nbsp;&nbsp; STRN : 03-04-3000-021-37</p>
          </div>
          <div class="flex-shrink-0 text-right ml-4">
            <h1 class="text-lg font-black text-text-primary uppercase tracking-tighter">Vendor Sales Report</h1>
            <p v-if="selectedBrand" class="text-[10px] font-black text-brand uppercase tracking-widest mt-1">Vendor: {{ selectedBrand }}</p>
            <p class="text-[9px] font-bold text-text-secondary mt-1 italic">Period: {{ startDate }} to {{ endDate }}</p>
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
              <td class="py-1.5 px-2 font-mono text-[8px]">{{ row.sku || String(row.id).slice(0,6) }}</td>
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
              <td class="py-1.5 px-1 text-right font-mono font-black border-l border-border/10">{{ formatCurrency((row.sale_qty - row.return_qty) * row.sales_rate) }}</td>
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

      <!-- ── Area-wise Sales ────────────────────────────────────────── -->
      <div v-if="activeTab === 'area_sales'" class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr>
              <th class="table-th">Geographical Area</th>
              <th class="table-th text-center">Inv. Count</th>
              <th class="table-th text-right">Net Sales (PKR)</th>
              <th class="table-th text-right">Performance</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border/50">
            <tr v-for="row in areaSalesData" :key="row.area" class="hover:bg-hover-bg/30 transition-colors">
              <td class="py-3 px-4 font-black uppercase text-xs">{{ row.area || 'UNSPECIFIED' }}</td>
              <td class="py-3 px-4 text-center font-mono font-bold">{{ row.invoice_count }}</td>
              <td class="py-3 px-4 text-right font-mono font-black text-brand">{{ formatCurrency(row.net_sales) }}</td>
              <td class="py-3 px-4 text-right">
                <div class="flex items-center justify-end gap-2">
                   <div class="w-24 h-1.5 bg-hover-bg rounded-full overflow-hidden">
                      <div class="h-full bg-brand" :style="{ width: (row.net_sales / Math.max(...areaSalesData.map(r => r.net_sales)) * 100) + '%' }"></div>
                   </div>
                   <span class="text-[9px] font-bold text-text-muted">{{ Math.round(row.net_sales / areaSalesData.reduce((s,r)=>s+Math.max(0,r.net_sales), 0) * 100) }}%</span>
                </div>
              </td>
            </tr>
            <tr v-if="areaSalesData.length === 0" class="h-64">
              <td colspan="4" class="text-center py-20 italic text-text-muted">No area-wise data found for this period.</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div><!-- /printable-report-body -->

    <!-- ── Shift Performance (separate printable block) ──────────── -->
    <div id="printable-shift-body" v-if="activeTab === 'shifts'" class="bg-card-bg mt-4 rounded-lg border border-border overflow-hidden text-sm text-text-primary">
      <div class="flex px-6 py-3 font-semibold text-xs tracking-widest uppercase bg-hover-bg border-b border-border text-text-secondary">
        <div class="flex-1">Period</div>
        <div class="w-32 text-center text-xs">Shifts</div>
        <div class="w-48 text-right text-xs">Total Sales</div>
        <div class="w-48 text-right text-xs">Opening Bal.</div>
        <div class="w-48 text-right text-xs">Closing Bal.</div>
      </div>
      <div v-for="row in shiftData" :key="row.period" class="flex px-6 py-2 border-b border-hover-bg/50 hover:bg-hover-bg items-center">
        <div class="flex-1 font-bold text-xs">{{ row.period }}</div>
        <div class="w-32 text-center font-mono text-xs">{{ row.total_shifts }}</div>
        <div class="w-48 text-right font-mono text-brand text-xs font-black">{{ formatCurrency(row.total_sales) }}</div>
        <div class="w-48 text-right font-mono text-xs">{{ formatCurrency(row.total_opening) }}</div>
        <div class="w-48 text-right font-mono text-xs">{{ formatCurrency(row.total_closing) }}</div>
      </div>
      <div v-if="shiftData.length === 0" class="p-8 text-center text-text-muted italic">No shift data found for this timeframe.</div>
    </div>

    <!-- Balance check -->
    <div v-if="activeTab === 'bs'" class="mt-3 text-right">
      <span class="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded"
        :class="Math.abs(bsData.totalAssets - (bsData.totalLiabilities + bsData.totalEquity)) < 0.01
          ? 'bg-hover-bg text-text-secondary' : 'bg-rose-500/10 text-rose-500'">
        {{ Math.abs(bsData.totalAssets - (bsData.totalLiabilities + bsData.totalEquity)) < 0.01 ? 'Balanced ✓' : 'Out of Balance ✗' }}
      </span>
    </div>

    <!-- Hidden Iframe for Printing -->
    <iframe id="report-print-frame" style="display:none;"></iframe>
  </div>
</template>

<style scoped>
.monogram { font-family: 'JetBrains Mono', monospace; }
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ReportService } from '../services/reportService';
import { shiftService } from '../services/shiftService';
import { useCompanyStore } from '../stores/company';
import { ERPService } from '../services/erpService';

import { reportLabels } from '../services/reportEngine';

const route = useRoute();
const companyStore = useCompanyStore();
const activeTab = ref('pl');
const isDetailed = ref(false);
const shiftTimeframe = ref<'daily'|'monthly'|'yearly'>('daily');
const ssrGroupBy = ref<'product'|'brand'|'category'>('product');
const showExportMenu = ref(false);

const startDate = ref(new Date().toISOString().split('T')[0]);
const endDate = ref(new Date().toISOString().split('T')[0]);

// Data refs
const plData = ref<any>({ income: [], expenses: [], totalIncome: 0, totalExpenses: 0, netProfit: 0 });
const bsData = ref<any>({ assets: [], liabilities: [], equity: [], totalAssets: 0, totalLiabilities: 0, totalEquity: 0, netProfit: 0 });
const shiftData = ref<any[]>([]);
const ssrData = ref<any[]>([]);
const dsrData = ref<any[]>([]);
const salesmanData = ref<any[]>([]);
const customerSummaryData = ref<any[]>([]);
const vendorSalesData = ref<any[]>([]);
const ledgerData = ref<any[]>([]);
const ledgerSummary = ref<any>({ openingBalance: 0, closingBalance: 0, totalDebit: 0, totalCredit: 0 });
const ledgerPartyName = ref('');
const areaSalesData = ref<any[]>([]);

// Party / filter refs
const brands = ref<any[]>([]);
const customers = ref<any[]>([]);
const suppliers = ref<any[]>([]);
const selectedBrand = ref('');
const selectedCustomer = ref('');
const selectedSupplier = ref('');

// ─── Tab change resets ────────────────────────────────────────────────────────
function onTabChange() {
  ledgerData.value = [];
  ledgerSummary.value = { openingBalance: 0, closingBalance: 0, totalDebit: 0, totalCredit: 0 };
  ledgerPartyName.value = '';
  showExportMenu.value = false;
  refreshData();
}

// ─── Data fetch ────────────────────────────────────────────────────────────────
async function refreshData() {
  showExportMenu.value = false;
  if (activeTab.value === 'pl') {
    plData.value = await ReportService.getProfitAndLoss('1900-01-01', endDate.value || '');
  } else if (activeTab.value === 'bs') {
    bsData.value = await ReportService.getBalanceSheet(endDate.value || '');
  } else if (activeTab.value === 'shifts') {
    shiftData.value = shiftService.getShiftPerformance(shiftTimeframe.value);
  } else if (activeTab.value === 'ssr') {
    ssrData.value = await ERPService.getSSRReport({
      startDate: startDate.value || '', endDate: endDate.value || '', groupBy: ssrGroupBy.value
    }) as any[];
  } else if (activeTab.value === 'dsr') {
    if (isDetailed.value) {
      dsrData.value = await ERPService.getDetailedDSRReport({
        startDate: startDate.value || '', endDate: endDate.value || ''
      }) as any[];
    } else {
      dsrData.value = await ERPService.getDSRReport({
        startDate: startDate.value || '', endDate: endDate.value || ''
      }) as any[];
    }
  } else if (activeTab.value === 'vendor_sales') {
    if (selectedBrand.value) {
      vendorSalesData.value = await ERPService.getVendorWiseSalesReport(selectedBrand.value, startDate.value || '', endDate.value || '') as any[];
    } else {
      vendorSalesData.value = [];
    }
  } else if (activeTab.value === 'customer_ledger') {
    if (selectedCustomer.value) {
      const result = await ReportService.getCustomerLedger(selectedCustomer.value, startDate.value || '', endDate.value || '');
      ledgerData.value = result.rows;
      ledgerPartyName.value = result.partyName || '';
      ledgerSummary.value = {
        openingBalance: result.openingBalance,
        closingBalance: result.closingBalance,
        totalDebit: result.rows.reduce((s: number, r: any) => s + (r.debit || 0), 0),
        totalCredit: result.rows.reduce((s: number, r: any) => s + (r.credit || 0), 0),
      };
    }
  } else if (activeTab.value === 'supplier_ledger') {
    if (selectedSupplier.value) {
      const result = await ReportService.getSupplierLedger(selectedSupplier.value, startDate.value || '', endDate.value || '');
      ledgerData.value = result.rows;
      ledgerPartyName.value = result.partyName || '';
      ledgerSummary.value = {
        openingBalance: result.openingBalance,
        closingBalance: result.closingBalance,
        totalDebit: result.rows.reduce((s: number, r: any) => s + (r.debit || 0), 0),
        totalCredit: result.rows.reduce((s: number, r: any) => s + (r.credit || 0), 0),
      };
    }
  } else if (activeTab.value === 'salesman_summary') {
    salesmanData.value = await ERPService.getSalesmanPerformanceReport(startDate.value || '', endDate.value || '') as any[];
  } else if (activeTab.value === 'customer_summary') {
    customerSummaryData.value = await ERPService.getCustomerSalesSummary(startDate.value || '', endDate.value || '') as any[];
  } else if (activeTab.value === 'area_sales') {
    areaSalesData.value = await ReportService.getAreaSales(startDate.value || '', endDate.value || '') as any[];
  }
}

// ─── Shortcut Runner ────────────────────────────────────────────────────────
async function runShortcut(type: 'today_dsr' | 'salesman' | 'customer_sales' | 'ssr' | 'recovery') {
  const today = new Date().toISOString().split('T')[0];
  startDate.value = today;
  endDate.value = today;

  if (type === 'today_dsr') {
    activeTab.value = 'dsr';
  } else if (type === 'salesman') {
    activeTab.value = 'salesman_summary';
    // Use last 30 days for performance by default
    const d = new Date(); d.setDate(d.getDate() - 30);
    startDate.value = d.toISOString().split('T')[0];
  } else if (type === 'customer_sales') {
    activeTab.value = 'customer_summary';
  } else if (type === 'ssr') {
    activeTab.value = 'ssr';
  } else if (type === 'recovery') {
    activeTab.value = 'customer_ledger';
  }

  await refreshData();
}



// ─── Print ────────────────────────────────────────────────────────────────────
function handlePrintReport() {
  const frame = document.getElementById('report-print-frame') as HTMLIFrameElement;
  if (!frame) return;
  const doc = frame.contentWindow?.document;
  if (!doc) return;

  const isShift = activeTab.value === 'shifts';
  const tableHtml = isShift
    ? document.getElementById('printable-shift-body')?.outerHTML
    : document.getElementById('printable-report-body')?.outerHTML;

  const now = new Date();
  const generatedAt = now.toLocaleString('en-PK');
  const reportTitle = reportLabels[activeTab.value] || activeTab.value;

  // Build applied filters string
  const filterParts: string[] = [];
  if (['ssr','dsr','vendor_sales','customer_ledger','supplier_ledger','salesman_summary','customer_summary'].includes(activeTab.value)) {
    filterParts.push(`Period: ${startDate.value} → ${endDate.value}`);
  }
  if (activeTab.value === 'vendor_sales' && selectedBrand.value) filterParts.push(`Vendor: ${selectedBrand.value}`);
  if (activeTab.value === 'ssr') filterParts.push(`Group By: ${ssrGroupBy.value}`);
  if (activeTab.value === 'customer_ledger' && ledgerPartyName.value) filterParts.push(`Customer: ${ledgerPartyName.value}`);
  if (activeTab.value === 'supplier_ledger' && ledgerPartyName.value) filterParts.push(`Supplier: ${ledgerPartyName.value}`);
  if (activeTab.value === 'salesman_summary') filterParts.push(`Report: Salesman Performance Summary`);
  if (activeTab.value === 'customer_summary') filterParts.push(`Report: Customer Billing Summary`);

  doc.open();
  doc.write(`
    <html>
      <head>
        <title>${reportTitle}</title>
        <script src="https://cdn.tailwindcss.com"><\/script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap');
          @media print {
            @page { margin: 5mm; size: landscape; }
            body { -webkit-print-color-adjust: exact; font-family: 'Inter', sans-serif; color: #000; }
            .page-footer { position: fixed; bottom: 0; width: 100%; font-size: 8px; text-align: center; color: #666; }
          }
          body { font-family: 'Inter', sans-serif; padding: 16px; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 4px 6px; font-size: 8px; }
          th { background: #f1f5f9 !important; font-weight: 900; text-transform: uppercase; }
          .filter-bar { font-size: 9px; color: #475569; margin-bottom: 12px; padding: 6px 10px; background: #f8fafc; border-radius: 4px; }
        </style>
      </head>
      <body>
        <!-- Company Header -->
        <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid #000;padding-bottom:12px;margin-bottom:12px;">
          <div style="display:flex;align-items:center;gap:12px;">
            <img src="/logo.png" style="max-width:80px;max-height:80px;object-fit:contain;" onerror="this.style.display='none'" />
            <div>
              <div style="font-size:18px;font-weight:900;text-transform:uppercase;letter-spacing:-0.5px;">${companyStore.company?.name || 'B & H Pharmaceutical (PVT) LTD'}</div>
              <div style="font-size:9px;font-weight:700;">${companyStore.company?.address || 'Ismail Adda, Khwaza Khela. Swat'}</div>
              <div style="font-size:9px;font-weight:700;">NTN : ${companyStore.company?.ntn || '1526202-2'} &nbsp;&nbsp; STRN : 03-04-3000-021-37</div>
            </div>
          </div>
          <div style="text-align:right;">
            <div style="background:#000;color:#fff;padding:8px 16px;display:inline-block;">
              <div style="font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:2px;">${reportTitle}</div>
            </div>
            <div style="font-size:8px;color:#64748b;margin-top:4px;">Generated: ${generatedAt}</div>
          </div>
        </div>

        <!-- Applied Filters -->
        ${filterParts.length > 0 ? `<div class="filter-bar"><strong>Filters Applied:</strong> ${filterParts.join(' &nbsp;|&nbsp; ')}</div>` : ''}

        <!-- Report Content -->
        <div>${tableHtml}</div>

        <!-- Signature -->
        <div style="margin-top:32px;display:flex;justify-content:flex-end;">
          <div style="text-align:right;">
            <div style="width:160px;border-top:1px solid #000;margin-bottom:4px;"></div>
            <div style="font-size:8px;font-weight:900;text-transform:uppercase;letter-spacing:2px;color:#94a3b8;">Authorized Signature</div>
          </div>
        </div>

        <!-- Page Footer (print only) -->
        <div class="page-footer">
          ${reportTitle} &nbsp;|&nbsp; ${filterParts.join(' | ')} &nbsp;|&nbsp; Generated: ${generatedAt}
        </div>

        <script>
          window.onload = function() { setTimeout(function(){ window.print(); }, 500); };
        <\/script>
      </body>
    </html>
  `);
  doc.close();
}

// ─── Init ─────────────────────────────────────────────────────────────────────
onMounted(async () => {
  brands.value = await ERPService.getBrands();
  const allParties = await ReportService.getParties();
  customers.value = allParties.filter(p => p.type === 'Customer' || p.type === 'Both');
  suppliers.value = allParties.filter(p => p.type === 'Supplier' || p.type === 'Both');
  
  // Handle URL shortcuts from Dashboard
  const { shortcut, autoprint } = route.query;
  if (shortcut) {
      await runShortcut(shortcut as any);
      if (autoprint === '1') {
          // Give a small moment for the DOM to settle even after async data is ready
          setTimeout(() => {
              handlePrintReport();
          }, 500);
      }
  } else {
      await refreshData();
  }
});

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: companyStore.company?.currency || 'PKR'
  }).format(val || 0);
}
</script>
