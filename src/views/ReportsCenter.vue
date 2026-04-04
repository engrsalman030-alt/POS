<template>
  <div class="min-h-screen bg-app-bg text-text-primary font-inter pb-20">
    <!-- STICKY HEADER -->
    <header class="sticky top-0 z-50 bg-card-bg border-b border-border px-6 py-4 shadow-sm">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-black tracking-tighter text-text-primary">📊 Reports Center</h1>
          <p class="text-sm font-bold text-text-muted mt-1">Comprehensive Business Intelligence & Analytics</p>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <label class="text-sm font-bold text-text-muted">Date Range:</label>
            <input v-model="filters.startDate" type="date" class="w-32 bg-hover-bg border border-border rounded-lg px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-brand/20" />
            <span class="text-text-muted font-bold">to</span>
            <input v-model="filters.endDate" type="date" class="w-32 bg-hover-bg border border-border rounded-lg px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-brand/20" />
          </div>
          <button @click="exportAllReports" class="px-4 py-2 bg-brand text-white rounded-lg text-xs font-bold hover:opacity-90 transition-all">
            📥 Export All
          </button>
        </div>
      </div>
    </header>

    <div id="report-print-area" class="max-w-7xl mx-auto px-6 py-10">
      <!-- QUICK STATS -->
      <section class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div class="bg-card-bg border border-border rounded-2xl p-6 shadow-sm">
          <p class="text-xs font-bold text-text-muted uppercase mb-2">Total Sales</p>
          <p class="text-3xl font-black text-brand">{{ formatAmount(quickStats.totalSales) }}</p>
          <p class="text-xs text-text-muted mt-2">{{ quickStats.invoiceCount }} invoices</p>
        </div>
        <div class="bg-card-bg border border-border rounded-2xl p-6 shadow-sm">
          <p class="text-xs font-bold text-text-muted uppercase mb-2">Outstanding</p>
          <p class="text-3xl font-black text-rose-500">{{ formatAmount(quickStats.outstanding) }}</p>
          <p class="text-xs text-text-muted mt-2">Unpaid balance</p>
        </div>
        <div class="bg-card-bg border border-border rounded-2xl p-6 shadow-sm">
          <p class="text-xs font-bold text-text-muted uppercase mb-2">Gross Profit</p>
          <p class="text-3xl font-black text-emerald-500">{{ formatAmount(quickStats.grossProfit) }}</p>
          <p class="text-xs text-text-muted mt-2">{{ (quickStats.grossProfitMargin).toFixed(1) }}% margin</p>
        </div>
        <div class="bg-card-bg border border-border rounded-2xl p-6 shadow-sm">
          <p class="text-xs font-bold text-text-muted uppercase mb-2">Expiring Soon</p>
          <p class="text-3xl font-black text-amber-500">{{ quickStats.expiringCount }}</p>
          <p class="text-xs text-text-muted mt-2">Next 90 days</p>
        </div>
      </section>

      <!-- REPORT TABS -->
      <div class="space-y-8">
        <!-- TAB SELECTOR -->
        <div class="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
          <button 
            v-for="report in reportTabs" 
            :key="report.id"
            @click="activeReport = report.id"
            :class="['px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all', activeReport === report.id ? 'bg-brand text-white shadow-lg' : 'bg-hover-bg text-text-secondary hover:bg-hover-bg/80']"
          >
            {{ report.icon }} {{ report.title }}
          </button>
        </div>

        <!-- REPORT CONTENT -->
        <div class="bg-card-bg border border-border rounded-2xl shadow-sm overflow-hidden">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-app-bg px-6 py-4">
            <div>
              <p class="text-xs font-bold uppercase text-text-muted">Current Report</p>
              <p class="text-sm font-black text-text-primary">{{ activeReportTitle }}</p>
            </div>
            <div class="flex flex-wrap gap-2">
              <button @click="openReportViewer(activeReport)" class="px-4 py-2 bg-brand text-white rounded-lg text-xs font-bold hover:opacity-90 transition-all">
                👁️ View
              </button>
              <button @click="openReportEditor(activeReport)" class="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-700 transition-all">
                ✏️ Edit
              </button>
              <button @click="printCurrentReport" class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-500 transition-all">
                🖨️ Print
              </button>
              <button @click="loadReports" class="px-4 py-2 bg-hover-bg text-text-secondary border border-border rounded-lg text-xs font-bold hover:bg-hover-bg/80 transition-all">
                🔄 Refresh
              </button>
            </div>
          </div>
          <!-- SSR-wise Sales -->
          <div v-if="activeReport === 'ssr-sales'" class="p-8">
            <h2 class="text-xl font-black mb-6 flex items-center gap-2">
              <span class="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand">👤</span>
              SSR-Wise Sales Report
            </h2>
            <div class="overflow-x-auto">
              <table class="w-full text-xs">
                <thead class="bg-hover-bg border-b border-border">
                  <tr>
                    <th class="px-4 py-3 text-left font-black">SSR Name</th>
                    <th class="px-4 py-3 text-left font-black">Customer</th>
                    <th class="px-4 py-3 text-center font-black">Invoices</th>
                    <th class="px-4 py-3 text-right font-black">Gross Sales</th>
                    <th class="px-4 py-3 text-right font-black">Discount</th>
                    <th class="px-4 py-3 text-right font-black">Net Sales</th>
                    <th class="px-4 py-3 text-right font-black">Collected</th>
                    <th class="px-4 py-3 text-right font-black">Outstanding</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border">
                  <tr v-for="row in ssrSalesData" :key="`${row.ssr_name}-${row.customer_name}`" class="hover:bg-hover-bg/30">
                    <td class="px-4 py-3 font-bold">{{ row.ssr_name }}</td>
                    <td class="px-4 py-3">{{ row.customer_name }}</td>
                    <td class="px-4 py-3 text-center">{{ row.total_invoices }}</td>
                    <td class="px-4 py-3 text-right tabular-nums">{{ formatAmount(row.gross_sales) }}</td>
                    <td class="px-4 py-3 text-right tabular-nums">{{ formatAmount(row.total_discount) }}</td>
                    <td class="px-4 py-3 text-right tabular-nums font-bold">{{ formatAmount(row.net_sales) }}</td>
                    <td class="px-4 py-3 text-right tabular-nums text-emerald-600">{{ formatAmount(row.collected) }}</td>
                    <td class="px-4 py-3 text-right tabular-nums text-rose-600">{{ formatAmount(row.outstanding) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Item-wise Sales -->
          <div v-if="activeReport === 'item-sales'" class="p-8">
            <h2 class="text-xl font-black mb-6 flex items-center gap-2">
              <span class="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand">💊</span>
              Item-Wise Sales & Profitability
            </h2>
            <div class="overflow-x-auto">
              <table class="w-full text-xs">
                <thead class="bg-hover-bg border-b border-border">
                  <tr>
                    <th class="px-4 py-3 text-left font-black">Medicine / Product</th>
                    <th class="px-4 py-3 text-left font-black">Generic Name</th>
                    <th class="px-4 py-3 text-center font-black">Qty Sold</th>
                    <th class="px-4 py-3 text-center font-black">Bonus Qty</th>
                    <th class="px-4 py-3 text-right font-black">Avg Rate</th>
                    <th class="px-4 py-3 text-right font-black">Gross Amount</th>
                    <th class="px-4 py-3 text-right font-black">COGS</th>
                    <th class="px-4 py-3 text-right font-black">Profit</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border">
                  <tr v-for="row in itemSalesData" :key="row.item_name" class="hover:bg-hover-bg/30">
                    <td class="px-4 py-3 font-bold">{{ row.item_name }}</td>
                    <td class="px-4 py-3 text-sm">{{ row.generic_name }}</td>
                    <td class="px-4 py-3 text-center">{{ row.qty_sold }}</td>
                    <td class="px-4 py-3 text-center">{{ row.bonus_qty }}</td>
                    <td class="px-4 py-3 text-right tabular-nums">{{ formatAmount(row.avg_rate) }}</td>
                    <td class="px-4 py-3 text-right tabular-nums">{{ formatAmount(row.gross_amount) }}</td>
                    <td class="px-4 py-3 text-right tabular-nums">{{ formatAmount(row.cogs) }}</td>
                    <td class="px-4 py-3 text-right tabular-nums font-bold" :class="row.gross_profit >= 0 ? 'text-emerald-600' : 'text-rose-600'">{{ formatAmount(row.gross_profit) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Area-wise Sales -->
          <div v-if="activeReport === 'area-sales'" class="p-8">
            <h2 class="text-xl font-black mb-6 flex items-center gap-2">
              <span class="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand">📍</span>
              Area-Wise Sales Report
            </h2>
            <div class="overflow-x-auto">
              <table class="w-full text-xs">
                <thead class="bg-hover-bg border-b border-border">
                  <tr>
                    <th class="px-4 py-3 text-left font-black">Area / Territory</th>
                    <th class="px-4 py-3 text-center font-black">Customers</th>
                    <th class="px-4 py-3 text-center font-black">Invoices</th>
                    <th class="px-4 py-3 text-right font-black">Gross Sales</th>
                    <th class="px-4 py-3 text-right font-black">Outstanding</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border">
                  <tr v-for="row in areaSalesData" :key="row.area_name" class="hover:bg-hover-bg/30">
                    <td class="px-4 py-3 font-bold">{{ row.area_name }}</td>
                    <td class="px-4 py-3 text-center">{{ row.total_customers }}</td>
                    <td class="px-4 py-3 text-center">{{ row.total_invoices }}</td>
                    <td class="px-4 py-3 text-right tabular-nums">{{ formatAmount(row.gross_sales) }}</td>
                    <td class="px-4 py-3 text-right tabular-nums text-rose-600">{{ formatAmount(row.outstanding) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Expiry Warning -->
          <div v-if="activeReport === 'expiry'" class="p-8">
            <h2 class="text-xl font-black mb-6 flex items-center gap-2">
              <span class="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand">⚠️</span>
              Stock Expiry Warning Report
            </h2>
            <div class="overflow-x-auto">
              <table class="w-full text-xs">
                <thead class="bg-hover-bg border-b border-border">
                  <tr>
                    <th class="px-4 py-3 text-left font-black">Medicine</th>
                    <th class="px-4 py-3 text-left font-black">Batch #</th>
                    <th class="px-4 py-3 text-center font-black">Available Qty</th>
                    <th class="px-4 py-3 text-center font-black">Expiry Date</th>
                    <th class="px-4 py-3 text-center font-black">Days to Expiry</th>
                    <th class="px-4 py-3 text-right font-black">Stock Value</th>
                    <th class="px-4 py-3 text-center font-black">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border">
                  <tr v-for="row in expiryData" :key="`${row.item_name}-${row.batch_number}`" 
                    :class="row.days_to_expiry <= 30 ? 'bg-rose-50' : row.days_to_expiry <= 60 ? 'bg-amber-50' : ''">
                    <td class="px-4 py-3 font-bold">{{ row.item_name }}</td>
                    <td class="px-4 py-3">{{ row.batch_number }}</td>
                    <td class="px-4 py-3 text-center">{{ row.available_qty }}</td>
                    <td class="px-4 py-3 text-center">{{ row.expiry_date }}</td>
                    <td class="px-4 py-3 text-center font-bold" :class="row.days_to_expiry <= 30 ? 'text-rose-600' : 'text-amber-600'">{{ row.days_to_expiry }}</td>
                    <td class="px-4 py-3 text-right tabular-nums">{{ formatAmount(row.stock_value) }}</td>
                    <td class="px-4 py-3 text-center">
                      <button v-if="row.available_qty > 0" @click="createCreditNote(row)" class="px-3 py-1 bg-rose-500/10 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-500 hover:text-white transition-all">
                        Create Return
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Party Ledger -->
          <div v-if="activeReport === 'party-ledger'" class="p-8">
            <h2 class="text-xl font-black mb-6 flex items-center gap-2">
              <span class="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand">👥</span>
              Party Ledger & Outstanding
            </h2>
            <div class="overflow-x-auto">
              <table class="w-full text-xs">
                <thead class="bg-hover-bg border-b border-border">
                  <tr>
                    <th class="px-4 py-3 text-left font-black">Party Name</th>
                    <th class="px-4 py-3 text-left font-black">City</th>
                    <th class="px-4 py-3 text-center font-black">Invoices</th>
                    <th class="px-4 py-3 text-right font-black">Total Invoiced</th>
                    <th class="px-4 py-3 text-right font-black">Paid</th>
                    <th class="px-4 py-3 text-right font-black">Outstanding</th>
                    <th class="px-4 py-3 text-left font-black">Last Invoice</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border">
                  <tr v-for="row in partyLedgerData" :key="row.id" class="hover:bg-hover-bg/30">
                    <td class="px-4 py-3 font-bold">{{ row.party_name }}</td>
                    <td class="px-4 py-3">{{ row.city }}</td>
                    <td class="px-4 py-3 text-center">{{ row.total_invoiced ? '✓' : '-' }}</td>
                    <td class="px-4 py-3 text-right tabular-nums">{{ formatAmount(row.total_invoiced) }}</td>
                    <td class="px-4 py-3 text-right tabular-nums text-emerald-600">{{ formatAmount(row.total_paid) }}</td>
                    <td class="px-4 py-3 text-right tabular-nums font-bold" :class="row.current_outstanding > 0 ? 'text-rose-600' : 'text-emerald-600'">{{ formatAmount(row.current_outstanding) }}</td>
                    <td class="px-4 py-3 text-sm">{{ row.last_invoice_date }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Profit & Loss -->
          <div v-if="activeReport === 'pnl'" class="p-8">
            <h2 class="text-xl font-black mb-6 flex items-center gap-2">
              <span class="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand">📈</span>
              Profit & Loss Statement
            </h2>
            <div class="space-y-4 max-w-2xl">
              <div v-for="line in pnlData" :key="line.line_item" class="flex justify-between items-center p-4 border-b border-border hover:bg-hover-bg/30">
                <span :class="['font-bold', line.line_item.includes('Total') || line.line_item === 'Net Profit' ? 'text-lg text-brand' : 'text-sm']">
                  {{ line.line_item }}
                </span>
                <span :class="['font-black tabular-nums', line.amount >= 0 ? 'text-text-primary' : 'text-rose-600']">
                  {{ formatAmount(line.amount) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Inventory Valuation -->
          <div v-if="activeReport === 'inventory'" class="p-8">
            <h2 class="text-xl font-black mb-6 flex items-center gap-2">
              <span class="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand">📦</span>
              Inventory Valuation Report
            </h2>
            <div class="overflow-x-auto">
              <table class="w-full text-xs">
                <thead class="bg-hover-bg border-b border-border">
                  <tr>
                    <th class="px-4 py-3 text-left font-black">Item Name</th>
                    <th class="px-4 py-3 text-left font-black">Generic Name</th>
                    <th class="px-4 py-3 text-center font-black">Batches</th>
                    <th class="px-4 py-3 text-center font-black">Current Stock</th>
                    <th class="px-4 py-3 text-right font-black">Avg Cost</th>
                    <th class="px-4 py-3 text-right font-black">Stock Value</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border">
                  <tr v-for="row in inventoryData" :key="row.id" class="hover:bg-hover-bg/30">
                    <td class="px-4 py-3 font-bold">{{ row.name }}</td>
                    <td class="px-4 py-3 text-sm">{{ row.generic_name }}</td>
                    <td class="px-4 py-3 text-center">{{ row.batch_count }}</td>
                    <td class="px-4 py-3 text-center font-bold">{{ row.current_stock }}</td>
                    <td class="px-4 py-3 text-right tabular-nums">{{ formatAmount(row.avg_cost) }}</td>
                    <td class="px-4 py-3 text-right tabular-nums font-bold">{{ formatAmount(row.stock_value) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Aging Analysis -->
          <div v-if="activeReport === 'aging'" class="p-8">
            <h2 class="text-xl font-black mb-6 flex items-center gap-2">
              <span class="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand">⏳</span>
              Outstanding Aging Analysis
            </h2>
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <div v-for="bucket in agingBuckets" :key="bucket.name" class="bg-hover-bg rounded-lg p-4">
                <p class="text-xs font-bold text-text-muted uppercase">{{ bucket.name }}</p>
                <p class="text-2xl font-black text-text-primary mt-2">{{ bucket.count }}</p>
                <p class="text-xs text-text-muted mt-1">{{ formatAmount(bucket.amount) }}</p>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-xs">
                <thead class="bg-hover-bg border-b border-border">
                  <tr>
                    <th class="px-4 py-3 text-left font-black">Customer</th>
                    <th class="px-4 py-3 text-center font-black">Invoice Date</th>
                    <th class="px-4 py-3 text-center font-black">Days Outstanding</th>
                    <th class="px-4 py-3 text-right font-black">Amount</th>
                    <th class="px-4 py-3 text-left font-black">Age Bucket</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border">
                  <tr v-for="row in agingData" :key="`${row.id}-${row.invoice_id}`" class="hover:bg-hover-bg/30">
                    <td class="px-4 py-3 font-bold">{{ row.name }}</td>
                    <td class="px-4 py-3 text-center">{{ row.date }}</td>
                    <td class="px-4 py-3 text-center">{{ row.days_outstanding }}</td>
                    <td class="px-4 py-3 text-right tabular-nums">{{ formatAmount(row.outstanding_amount) }}</td>
                    <td class="px-4 py-3 font-bold" :class="row.age_bucket === '0-30 Days' ? 'text-emerald-600' : row.age_bucket === '31-60 Days' ? 'text-amber-600' : row.age_bucket === '61-90 Days' ? 'text-orange-600' : 'text-rose-600'">
                      {{ row.age_bucket }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isViewerOpen" class="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-4 py-6">
      <div class="w-full max-w-5xl overflow-hidden rounded-3xl bg-card-bg border border-border shadow-2xl">
        <div class="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
          <div>
            <p class="text-xs uppercase font-bold text-text-muted">Report Preview</p>
            <h3 class="text-xl font-black">{{ reportViewerTitle }}</h3>
          </div>
          <div class="flex gap-2">
            <button @click="printCurrentReport" class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-500 transition-all">Print</button>
            <button @click="isViewerOpen = false" class="px-4 py-2 bg-rose-500 text-white rounded-lg text-xs font-bold hover:bg-rose-400 transition-all">Close</button>
          </div>
        </div>
        <div class="max-h-[70vh] overflow-y-auto p-6">
          <div class="space-y-4">
            <div class="overflow-x-auto">
              <table class="w-full text-xs border border-border">
                <thead class="bg-hover-bg border-b border-border">
                  <tr>
                    <th v-for="column in reportViewerColumns" :key="column.key" class="px-4 py-3 text-left font-black">{{ column.label }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border">
                  <tr v-for="(row, index) in reportViewerRows" :key="index" class="hover:bg-hover-bg/30">
                    <td v-for="column in reportViewerColumns" :key="column.key" class="px-4 py-3">{{ formatValue(row[column.key]) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="reportViewerRows.length === 0" class="rounded-2xl border border-border bg-hover-bg p-6 text-center text-text-muted">
              No rows available for this report preview.
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isEditorOpen" class="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-4 py-6">
      <div class="w-full max-w-2xl overflow-hidden rounded-3xl bg-card-bg border border-border shadow-2xl">
        <div class="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
          <div>
            <p class="text-xs uppercase font-bold text-text-muted">Edit Report Filters</p>
            <h3 class="text-xl font-black">{{ reportEditorTitle }}</h3>
          </div>
          <button @click="isEditorOpen = false" class="px-4 py-2 bg-rose-500 text-white rounded-lg text-xs font-bold hover:bg-rose-400 transition-all">Close</button>
        </div>
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label class="block text-xs font-bold uppercase text-text-muted">Start Date</label>
            <input v-model="editorFilters.startDate" type="date" class="w-full bg-hover-bg border border-border rounded-lg px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-brand/20" />
            <label class="block text-xs font-bold uppercase text-text-muted">End Date</label>
            <input v-model="editorFilters.endDate" type="date" class="w-full bg-hover-bg border border-border rounded-lg px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-brand/20" />
          </div>
          <div class="flex flex-wrap gap-2">
            <button @click="applyReportEdit" class="px-4 py-2 bg-brand text-white rounded-lg text-xs font-bold hover:opacity-90 transition-all">Save & Refresh</button>
            <button @click="resetEditorFilters" class="px-4 py-2 bg-hover-bg border border-border rounded-lg text-xs font-bold hover:bg-hover-bg/80 transition-all">Reset</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ReportService } from '../services/reportService';

const activeReport = ref('ssr-sales');
const filters = ref({
  startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0]
});

const reportTabs = [
  { id: 'ssr-sales', title: 'SSR Sales', icon: '👤' },
  { id: 'item-sales', title: 'Item Sales', icon: '💊' },
  { id: 'area-sales', title: 'Area Sales', icon: '📍' },
  { id: 'party-ledger', title: 'Party Ledger', icon: '👥' },
  { id: 'pnl', title: 'P&L', icon: '📈' },
  { id: 'inventory', title: 'Inventory', icon: '📦' },
  { id: 'aging', title: 'Aging', icon: '⏳' },
  { id: 'expiry', title: 'Expiry', icon: '⚠️' }
];

// Data states
const ssrSalesData = ref<any[]>([]);
const itemSalesData = ref<any[]>([]);
const areaSalesData = ref<any[]>([]);
const partyLedgerData = ref<any[]>([]);
const pnlData = ref<any[]>([]);
const inventoryData = ref<any[]>([]);
const agingData = ref<any[]>([]);
const expiryData = ref<any[]>([]);
const quickStats = ref({
  totalSales: 0,
  invoiceCount: 0,
  outstanding: 0,
  grossProfit: 0,
  grossProfitMargin: 0,
  expiringCount: 0
});

const isViewerOpen = ref(false);
const isEditorOpen = ref(false);
const reportViewerTitle = ref('');
const reportEditorTitle = ref('');
const reportViewerColumns = ref<{ key: string; label: string }[]>([]);
const reportViewerRows = ref<any[]>([]);
const editorFilters = ref({ startDate: filters.value.startDate, endDate: filters.value.endDate });

const activeReportTitle = computed(() => {
  return reportTabs.find(tab => tab.id === activeReport.value)?.title || 'Report';
});

function getCurrentReportRows(reportId: string) {
  switch (reportId) {
    case 'item-sales': return itemSalesData.value;
    case 'area-sales': return areaSalesData.value;
    case 'party-ledger': return partyLedgerData.value;
    case 'pnl': return pnlData.value;
    case 'inventory': return inventoryData.value;
    case 'aging': return agingData.value;
    case 'expiry': return expiryData.value;
    case 'ssr-sales':
    default:
      return ssrSalesData.value;
  }
}

function getReportColumns(reportId: string) {
  switch (reportId) {
    case 'item-sales':
      return [
        { key: 'item_name', label: 'Medicine / Product' },
        { key: 'generic_name', label: 'Generic Name' },
        { key: 'qty_sold', label: 'Qty Sold' },
        { key: 'bonus_qty', label: 'Bonus Qty' },
        { key: 'avg_rate', label: 'Avg Rate' },
        { key: 'gross_amount', label: 'Gross Amount' },
        { key: 'cogs', label: 'COGS' },
        { key: 'gross_profit', label: 'Profit' }
      ];
    case 'area-sales':
      return [
        { key: 'area_name', label: 'Area / Territory' },
        { key: 'total_customers', label: 'Customers' },
        { key: 'total_invoices', label: 'Invoices' },
        { key: 'gross_sales', label: 'Gross Sales' },
        { key: 'outstanding', label: 'Outstanding' }
      ];
    case 'party-ledger':
      return [
        { key: 'party_name', label: 'Party Name' },
        { key: 'city', label: 'City' },
        { key: 'total_invoiced', label: 'Total Invoiced' },
        { key: 'total_paid', label: 'Paid' },
        { key: 'current_outstanding', label: 'Outstanding' },
        { key: 'last_invoice_date', label: 'Last Invoice' }
      ];
    case 'pnl':
      return [
        { key: 'line_item', label: 'Line Item' },
        { key: 'amount', label: 'Amount' }
      ];
    case 'inventory':
      return [
        { key: 'name', label: 'Item Name' },
        { key: 'generic_name', label: 'Generic Name' },
        { key: 'batch_count', label: 'Batches' },
        { key: 'current_stock', label: 'Current Stock' },
        { key: 'avg_cost', label: 'Avg Cost' },
        { key: 'stock_value', label: 'Stock Value' }
      ];
    case 'aging':
      return [
        { key: 'name', label: 'Customer' },
        { key: 'date', label: 'Invoice Date' },
        { key: 'days_outstanding', label: 'Days Outstanding' },
        { key: 'outstanding_amount', label: 'Amount' },
        { key: 'age_bucket', label: 'Age Bucket' }
      ];
    case 'expiry':
      return [
        { key: 'item_name', label: 'Medicine' },
        { key: 'batch_number', label: 'Batch #' },
        { key: 'available_qty', label: 'Available Qty' },
        { key: 'expiry_date', label: 'Expiry Date' },
        { key: 'days_to_expiry', label: 'Days to Expiry' },
        { key: 'stock_value', label: 'Stock Value' }
      ];
    case 'ssr-sales':
    default:
      return [
        { key: 'ssr_name', label: 'SSR Name' },
        { key: 'customer_name', label: 'Customer' },
        { key: 'total_invoices', label: 'Invoices' },
        { key: 'gross_sales', label: 'Gross Sales' },
        { key: 'total_discount', label: 'Discount' },
        { key: 'net_sales', label: 'Net Sales' },
        { key: 'collected', label: 'Collected' },
        { key: 'outstanding', label: 'Outstanding' }
      ];
  }
}

function openReportViewer(reportId: string) {
  reportViewerTitle.value = reportTabs.find(tab => tab.id === reportId)?.title || 'Report Preview';
  reportViewerColumns.value = getReportColumns(reportId);
  reportViewerRows.value = getCurrentReportRows(reportId);
  isViewerOpen.value = true;
}

function openReportEditor(reportId: string) {
  reportEditorTitle.value = reportTabs.find(tab => tab.id === reportId)?.title || 'Edit Report';
  editorFilters.value = { startDate: filters.value.startDate, endDate: filters.value.endDate };
  isEditorOpen.value = true;
}

function applyReportEdit() {
  filters.value.startDate = editorFilters.value.startDate;
  filters.value.endDate = editorFilters.value.endDate;
  isEditorOpen.value = false;
  loadReports();
}

function resetEditorFilters() {
  editorFilters.value = { startDate: filters.value.startDate, endDate: filters.value.endDate };
}

function printCurrentReport() {
  window.print();
}

function formatValue(value: any) {
  if (typeof value === 'number') return formatAmount(value);
  return value ?? '-';
}

const agingBuckets = computed(() => {
  const buckets = {
    '0-30 Days': { count: 0, amount: 0 },
    '31-60 Days': { count: 0, amount: 0 },
    '61-90 Days': { count: 0, amount: 0 },
    '90+ Days': { count: 0, amount: 0 }
  };

  agingData.value.forEach(row => {
    const bucket = row.age_bucket as keyof typeof buckets;
    if (buckets[bucket]) {
      buckets[bucket].count++;
      buckets[bucket].amount += row.outstanding_amount || 0;
    }
  });

  return Object.entries(buckets).map(([name, data]) => ({ name, ...data }));
});

function formatAmount(val: number | undefined) {
  return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(val || 0);
}

async function loadReports() {
  try {
    const startDate = filters.value.startDate ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = filters.value.endDate ?? new Date().toISOString().split('T')[0];
    
    ssrSalesData.value = ReportService.getSSRWiseSalesReport(startDate!, endDate!);
    itemSalesData.value = ReportService.getItemWiseSalesReport(startDate!, endDate!);
    areaSalesData.value = ReportService.getAreaWiseSalesReport(startDate!, endDate!);
    partyLedgerData.value = ReportService.getPartyLedgerReport(startDate!, endDate!);
    pnlData.value = ReportService.getProfitLossReport(startDate!, endDate!);
    inventoryData.value = ReportService.getInventoryValuation();
    agingData.value = ReportService.getAgingAnalysis();
    expiryData.value = ReportService.getExpiryWarningReport(90);

    // Calculate quick stats
    quickStats.value.totalSales = ssrSalesData.value.reduce((sum, r) => sum + (r.net_sales || 0), 0);
    quickStats.value.invoiceCount = ssrSalesData.value.reduce((sum, r) => sum + (r.total_invoices || 0), 0);
    quickStats.value.outstanding = partyLedgerData.value.reduce((sum, r) => sum + (r.current_outstanding || 0), 0);
    quickStats.value.expiringCount = expiryData.value.length;

    const pnlNetProfit = pnlData.value.find(l => l.line_item === 'Net Profit');
    quickStats.value.grossProfit = pnlNetProfit?.amount || 0;
    if (quickStats.value.totalSales > 0) {
      quickStats.value.grossProfitMargin = (quickStats.value.grossProfit / quickStats.value.totalSales) * 100;
    }
  } catch (err) {
    console.error('Failed to load reports:', err);
  }
}

function createCreditNote(row: any) {
  // TODO: Open credit note creation modal with pre-filled batch data
  console.log('Create credit note for:', row);
}

function exportAllReports() {
  // TODO: Export all reports to CSV/Excel
  console.log('Export all reports');
}

onMounted(() => {
  loadReports();
});
</script>

<style scoped>
@media print {
  body * {
    visibility: hidden;
  }
  #report-print-area, #report-print-area * {
    visibility: visible;
  }
  #report-print-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding: 0;
  }
}
</style>
