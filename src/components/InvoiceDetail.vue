<template>
  <div class="invoice-detail bg-card-bg rounded-3xl overflow-hidden shadow-2xl border border-border max-w-4xl w-full mx-auto font-sans text-text-primary">
    
    <!-- Professional Header -->
    <header class="p-8 border-b border-border bg-hover-bg/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div class="flex items-center gap-5">
        <div class="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center shadow-lg shadow-brand/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M15 9v12"/></svg>
        </div>
        <div>
          <h2 class="text-2xl font-black uppercase tracking-tight">{{ companyStore.company?.name || 'B & H Pharmaceutical (PVT) LTD' }}</h2>
          <p class="text-[10px] text-text-muted font-black uppercase tracking-[0.2em] mt-1">{{ companyStore.company?.address || 'Main Pharmaceutical Distribution' }}</p>
        </div>
      </div>
      <div class="text-left md:text-right">
        <h1 class="text-4xl font-black text-text-muted/10 uppercase tracking-[0.2em] leading-none mb-2">Invoice</h1>
        <p class="text-sm font-black uppercase tracking-widest text-text-primary">#{{ invoice.id.slice(0, 8).toUpperCase() }}</p>
        <p class="text-[10px] text-text-secondary font-bold mt-1 uppercase tracking-widest">{{ invoice.date }}</p>
      </div>
    </header>

    <div class="p-8 md:p-12 space-y-12">
      <!-- Info Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-border border-dashed pb-12">
        <div>
          <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-4 italic">Billed To</h4>
          <div class="space-y-1">
             <h3 class="text-xl font-black text-brand">{{ customerName }}</h3>
             <p class="text-sm text-text-secondary font-medium">Customer ID: {{ invoice.customer_id }}</p>
          </div>
        </div>
        <div class="md:text-right">
          <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-4 italic">Metadata</h4>
          <div class="space-y-2">
            <div class="flex md:justify-end gap-4 items-center">
              <span class="text-[10px] font-black uppercase tracking-widest text-text-muted">Status:</span>
              <span class="px-3 py-1 bg-brand/10 text-brand rounded-full text-[10px] font-black uppercase tracking-widest border border-brand/20">
                {{ invoice.status || 'Posted' }}
              </span>
            </div>
            <p v-if="invoice.reference" class="text-[10px] font-black uppercase tracking-widest text-text-secondary">Ref: {{ invoice.reference }}</p>
            <p v-if="invoice.sales_manager" class="text-[10px] font-black uppercase tracking-widest text-text-secondary">Manager: {{ invoice.sales_manager }}</p>
            <p v-if="invoice.ssr_id" class="text-[10px] font-black uppercase tracking-widest text-emerald-600">SSR: {{ getStaffName(invoice.ssr_id) }}</p>
            <p v-if="invoice.dsr_id" class="text-[10px] font-black uppercase tracking-widest text-blue-600">DSR: {{ getStaffName(invoice.dsr_id) }}</p>
            <p v-if="invoice.frappe_reference" class="text-[10px] font-black uppercase tracking-widest text-emerald-600">FR: {{ invoice.frappe_reference }}</p>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div class="rounded-3xl border border-border overflow-hidden bg-hover-bg/10">
        <table class="w-full text-left border-collapse">
          <thead class="bg-hover-bg border-b border-border">
            <tr>
              <th class="py-5 px-6 text-[10px] font-black uppercase tracking-widest text-text-muted">Item Description</th>
              <th class="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-text-muted text-center w-32 tracking-tighter">Billed + Bonus</th>
              <th class="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-text-muted text-right w-32">Rate</th>
              <th class="py-5 px-6 text-[10px] font-black uppercase tracking-widest text-text-muted text-right w-40">Amount</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="item in invoice.items" :key="item.item_id" class="group hover:bg-hover-bg/30 transition-colors">
              <td class="py-5 px-6">
                <p class="text-sm font-black text-text-primary">{{ getItemName(item) }}</p>
                <p v-if="item.batch_number" class="text-[10px] text-emerald-600 font-bold mt-1">Batch: {{ item.batch_number }} <span v-if="item.expiry_date" class="text-text-muted ml-2">Exp: {{ item.expiry_date }}</span></p>
                <p class="text-[9px] text-text-muted font-bold mt-0.5 uppercase tracking-tighter">SKU: {{ item.item_id.slice(0,6) }}</p>
              </td>
              <td class="py-5 px-4 text-center">
                <div class="inline-flex flex-col items-center">
                  <span class="text-xs font-black text-text-secondary tabular-nums">{{ item.quantity }}</span>
                  <span v-if="item.bonus_quantity > 0" class="text-[9px] font-black text-emerald-600 tabular-nums animate-in fade-in transition-all">+{{ item.bonus_quantity }} Bonus</span>
                </div>
              </td>
              <td class="py-5 px-4 text-right">
                <span class="text-xs font-bold text-text-secondary tabular-nums">{{ formatCurrency(item.rate) }}</span>
              </td>
              <td class="py-5 px-6 text-right">
                <span class="text-sm font-black text-text-primary tabular-nums">{{ formatCurrency(item.total) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-end pt-4">
        <div class="bg-hover-bg/20 p-6 rounded-2xl border border-border border-dashed">
          <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-3 italic">Notes / Remarks</h4>
          <p class="text-[11px] text-text-secondary leading-relaxed italic font-medium">
            {{ invoice.notes || 'No terms or internal notes provided for this transaction.' }}
          </p>
          <div v-if="invoice.frappe_reference" class="mt-4 pt-4 border-t border-border border-dashed">
             <p class="text-[9px] font-black uppercase tracking-widest text-slate-400">Frappe Books Ref</p>
             <p class="text-xs font-bold text-text-primary mt-1">{{ invoice.frappe_reference }}</p>
          </div>
        </div>
        <div class="space-y-4">
           <div class="flex justify-between items-center px-4">
              <span class="text-xs font-bold text-text-muted uppercase tracking-widest">Subtotal</span>
              <span class="text-xs font-black text-text-secondary tabular-nums">{{ formatCurrency(invoice.total_amount + (invoice.discount_amount || 0) - (invoice.tax_amount || 0)) }}</span>
           </div>
           <div v-if="totalBonusUnits > 0" class="flex justify-between items-center px-4">
              <span class="text-xs font-bold text-emerald-600 uppercase tracking-widest">Total Bonus</span>
              <span class="text-xs font-black text-emerald-600 tabular-nums">{{ totalBonusUnits }} Units</span>
           </div>
           <div v-if="invoice.discount_amount > 0" class="flex justify-between items-center px-4">
              <span class="text-xs font-bold text-text-muted uppercase tracking-widest">Discount</span>
              <span class="text-xs font-black text-rose-500 tabular-nums">-{{ formatCurrency(invoice.discount_amount) }}</span>
           </div>
           <div class="pt-4 border-t-4 border-brand/20 mt-4 flex justify-between items-center bg-brand/5 p-6 rounded-2xl">
              <span class="text-sm font-black uppercase tracking-[0.3em] text-text-primary">Grand Total</span>
              <span class="text-4xl font-black text-brand tracking-tighter tabular-nums">{{ formatCurrency(invoice.total_amount) }}</span>
           </div>
        </div>
      </div>
    </div>

    <!-- Actions Footer -->
    <footer class="p-8 border-t border-border bg-hover-bg/20 flex gap-4">
        <button @click="$emit('close')" class="flex-1 px-6 py-4 rounded-2xl border border-border bg-card-bg text-text-secondary font-black text-sm uppercase tracking-widest hover:bg-hover-bg transition-all active:scale-95 shadow-sm">
          Close Preview
        </button>
        <button @click="handlePrint" class="flex-1 px-6 py-4 rounded-2xl bg-text-primary text-card-bg font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-xl flex items-center justify-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
          Print Invoice
        </button>
    </footer>

    <!-- Hidden Iframe for Printing (Reused Logic) -->
    <iframe id="invoice-print-frame" style="display: none;"></iframe>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useCompanyStore } from '../stores/company';
import { useInventoryStore } from '../stores/inventory';
import { useStaffStore } from '../stores/staff';

const props = defineProps<{
  invoice: any;
  customerName: string;
}>();

const emit = defineEmits(['close']);

const companyStore = useCompanyStore();
const inventoryStore = useInventoryStore();
const staffStore = useStaffStore();

const totalBonusUnits = computed(() => {
  return props.invoice.items.reduce((sum: number, item: any) => sum + (item.bonus_quantity || 0), 0);
});

onMounted(() => {
  inventoryStore.fetchItems();
  staffStore.fetchStaff();
});

const groupedItems = computed(() => {
  const groups: Record<string, any[]> = {};
  props.invoice.items.forEach((item: any) => {
    const info = getItemInfo(item.item_id);
    const brand = item.brand || info?.brand || 'General';
    if (!groups[brand]) groups[brand] = [];
    groups[brand].push({
      ...item,
      brand,
      generic: info?.generic_name || '',
      sku: info?.sku || ''
    });
  });
  return groups;
});

const companyInitials = computed(() => {
  return companyStore.getMonogram(companyStore.company?.name || 'B & H Pharmaceutical (PVT) LTD');
});

function getItemInfo(itemId: string) {
  return inventoryStore.items.find(i => i.id === itemId);
}

function getItemName(item: any) {
  return item.name || getItemInfo(item.item_id)?.name || 'Unknown Item';
}

function getStaffName(id: string) {
  return staffStore.staff.find(s => s.id === id)?.name || 'Unknown';
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: companyStore.company?.currency || 'PKR',
    maximumFractionDigits: 0
  }).format(val || 0);
}

function handlePrint() {
    const frame = document.getElementById('invoice-print-frame') as HTMLIFrameElement;
    if (!frame) return;

    const doc = frame.contentWindow?.document;
    if (!doc) return;

    const brandGroups = groupedItems.value;
    const company = companyStore.company;

    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Sale Invoice - ${props.invoice.id.slice(0, 8)}</title>
          <script src="https://cdn.tailwindcss.com"><\/script>
          <style>
             @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap');
             @media print {
               @page { margin: 10mm; size: auto; }
               body { -webkit-print-color-adjust: exact; font-family: 'Inter', sans-serif; color: #000; }
               .no-print { display: none; }
             }
             body { font-family: 'Inter', sans-serif; }
             .border-tight { border: 1px solid #000; }
             .table-tight th, .table-tight td { border: 1px solid #000; padding: 2px 4px; font-size: 10px; }
             .monogram { font-family: 'JetBrains Mono', monospace; letter-spacing: 0.2em; }
          </style>
        </head>
        <body class="bg-white p-4">
          <!-- MAIN HEADER -->
          <div class="flex justify-between items-start mb-6">
             <div class="border-2 border-black px-8 py-2">
                <h1 class="text-xl font-black uppercase tracking-widest">Sale Invoice</h1>
             </div>
             <div class="text-right">
                <div class="flex items-center justify-end gap-3 mb-1">
                   <div class="monogram text-2xl font-black border-b-2 border-black pb-1">${companyInitials.value}</div>
                </div>
                <p class="text-[10px] font-bold uppercase tracking-tight">${company?.name || 'B & H Pharmaceutical (PVT) LTD'}</p>
                <p class="text-[9px] font-medium text-slate-600">${company?.address || 'Main Pharmaceutical Distribution'}</p>
                <p class="text-[9px] font-medium text-slate-600">${company?.phone || ''}</p>
             </div>
          </div>

          <!-- INFO BAR -->
          <div class="flex justify-between items-start mb-4 text-[11px]">
             <div class="space-y-0.5">
                <p><span class="font-bold">Sold To:</span> ${props.invoice.customer_id}</p>
                <p class="font-black text-xs uppercase">${props.customerName}</p>
                <p class="text-slate-600 max-w-xs">${props.invoice.billing_address || ''}</p>
             </div>
             <div class="text-right space-y-0.5">
                <p><span class="font-bold">Invoice No :</span> ${props.invoice.id.slice(0, 8).toUpperCase()}</p>
                <p><span class="font-bold">Invoice Date :</span> ${props.invoice.date}</p>
                <p><span class="font-bold">Salesman :</span> ${getStaffName(props.invoice.dsr_id || '')}</p>
             </div>
          </div>

          <!-- ITEMS TABLE -->
          <table class="w-full table-tight border-collapse mb-4">
             <thead>
                <tr class="bg-slate-50">
                   <th class="w-8">SNO</th>
                   <th class="w-16">Code</th>
                   <th>Description</th>
                   <th class="w-20">Batch</th>
                   <th class="w-12">Qty</th>
                   <th class="w-12">Bon</th>
                   <th class="w-16">T. Price</th>
                   <th class="w-20">Gross</th>
                   <th class="w-12">S. Tax</th>
                   <th class="w-12">Disc</th>
                   <th class="w-16">D. Val</th>
                   <th class="w-20">Total</th>
                </tr>
             </thead>
             <tbody>
                ${Object.entries(brandGroups).map(([brand, groupItems], gIdx) => `
                   <tr class="bg-slate-100 font-bold italic">
                      <td colspan="12" class="py-1 px-2">Company: ${gIdx + 1} &nbsp;&nbsp; ${brand}</td>
                   </tr>
                   ${groupItems.map((item, iIdx) => {
                     const gross = item.quantity * item.rate;
                     const discVal = gross * ((item.discount_pct || 0) / 100);
                     const rowTotal = gross - discVal + (item.tax_amount || 0);
                     return `
                        <tr>
                           <td class="text-center">${iIdx + 1}</td>
                           <td class="text-center">${item.sku || item.item_id.slice(0,6)}</td>
                           <td>
                               <div class="font-bold uppercase">${getItemName(item)}</div>
                               ${item.generic ? `<div class="text-[8px] italic opacity-70">${item.generic}</div>` : ''}
                           </td>
                           <td class="text-center font-mono">${item.batch_number || '-'}</td>
                           <td class="text-center font-bold">${item.quantity}</td>
                           <td class="text-center text-emerald-700">${item.bonus_quantity || '0'}</td>
                           <td class="text-right">${item.rate.toFixed(2)}</td>
                           <td class="text-right font-bold">${gross.toFixed(2)}</td>
                           <td class="text-right">${(item.tax_pct || 0).toFixed(2)}</td>
                           <td class="text-right">${(item.discount_pct || 0).toFixed(2)}</td>
                           <td class="text-right">${discVal.toFixed(2)}</td>
                           <td class="text-right font-black">${rowTotal.toFixed(2)}</td>
                        </tr>
                     `;
                   }).join('')}
                   <tr class="bg-slate-50 font-bold border-t border-black">
                      <td colspan="11" class="text-right py-1">Total for: ${brand}</td>
                      <td class="text-right py-1">${groupItems.reduce((sum, i) => sum + i.total, 0).toFixed(2)}</td>
                   </tr>
                `).join('')}
             </tbody>
          </table>

          <!-- SUMMARY FOOTER -->
          <div class="flex justify-end mt-8">
             <div class="w-64 space-y-1">
                <div class="flex justify-between items-center text-xs">
                   <span class="font-bold">Grand Total :</span>
                   <span class="font-black text-base border-b-2 border-black pb-0.5">${props.invoice.total_amount.toFixed(2)}</span>
                </div>
                <div class="pt-4 mt-8 flex flex-col items-end">
                   <div class="w-48 border-t border-black mb-1"></div>
                   <p class="text-[9px] font-black uppercase tracking-widest text-slate-400">Authorized Signature</p>
                </div>
             </div>
          </div>

          <div class="mt-12 text-[8px] text-center text-slate-400 font-bold uppercase tracking-[0.5em]">
             B & H Pharmaceutical (PVT) LTD - Distribution Management System
          </div>

          <script>
            window.onload = function() {
              setTimeout(() => {
                window.print();
                // window.close(); // Don't close if it's an iframe
              }, 500);
            };
          <\/script>
        </body>
      </html>
    `);
    doc.close();
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 10px;
}
</style>
