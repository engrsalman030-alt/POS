<template>
  <div class="invoice-detail bg-white dark:bg-card-bg rounded-3xl overflow-hidden shadow-2xl border border-border max-w-4xl w-full mx-auto font-sans text-text-primary">
    
    <!-- Professional Header -->
    <header class="p-8 border-b border-border bg-hover-bg/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div class="flex items-center gap-5">
        <div class="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center shadow-lg shadow-brand/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M15 9v12"/></svg>
        </div>
        <div>
          <h2 class="text-2xl font-black uppercase tracking-tight">{{ companyStore.company?.name || 'VTS SOLUTIONS' }}</h2>
          <p class="text-[10px] text-text-muted font-black uppercase tracking-[0.2em] mt-1">{{ companyStore.company?.address || 'Main POS Terminal' }}</p>
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
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div class="rounded-3xl border border-border overflow-hidden bg-hover-bg/10">
        <table class="w-full text-left">
          <thead class="bg-hover-bg border-b border-border">
            <tr>
              <th class="py-5 px-6 text-[10px] font-black uppercase tracking-widest text-text-muted">Item Description</th>
              <th class="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-text-muted text-center w-24">Qty</th>
              <th class="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-text-muted text-right w-32">Rate</th>
              <th class="py-5 px-6 text-[10px] font-black uppercase tracking-widest text-text-muted text-right w-40">Amount</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="item in invoice.items" :key="item.item_id" class="group hover:bg-hover-bg/30 transition-colors">
              <td class="py-5 px-6">
                <p class="text-sm font-black text-text-primary">{{ getItemName(item) }}</p>
                <p v-if="getItemDescription(item)" class="text-[10px] text-text-muted font-bold mt-1 italic line-clamp-2">{{ getItemDescription(item) }}</p>
                <p class="text-[9px] text-text-muted font-bold mt-0.5 uppercase tracking-tighter">SKU: {{ item.item_id.slice(0,6) }}</p>
              </td>
              <td class="py-5 px-4 text-center">
                <span class="text-xs font-black text-text-secondary tabular-nums">{{ item.quantity }}</span>
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
          <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-3 italic">Notes</h4>
          <p class="text-[11px] text-text-secondary leading-relaxed italic font-medium">
            {{ invoice.notes || 'No terms or internal notes provided for this transaction.' }}
          </p>
        </div>
        <div class="space-y-4">
           <div class="flex justify-between items-center px-4">
              <span class="text-xs font-bold text-text-muted uppercase tracking-widest">Subtotal</span>
              <span class="text-xs font-black text-text-secondary tabular-nums">{{ formatCurrency(invoice.total_amount + (invoice.discount_amount || 0) - (invoice.tax_amount || 0)) }}</span>
           </div>
           <div v-if="invoice.tax_amount > 0" class="flex justify-between items-center px-4">
              <span class="text-xs font-bold text-text-muted uppercase tracking-widest">Tax (0%)</span>
              <span class="text-xs font-black text-emerald-500 tabular-nums">+{{ formatCurrency(invoice.tax_amount) }}</span>
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
import { onMounted } from 'vue';
import { useCompanyStore } from '../stores/company';
import { useInventoryStore } from '../stores/inventory';

const props = defineProps<{
  invoice: any;
  customerName: string;
}>();

const emit = defineEmits(['close']);

const companyStore = useCompanyStore();
const inventoryStore = useInventoryStore();

onMounted(() => {
  inventoryStore.fetchItems();
});

function getItemInfo(itemId: string) {
  return inventoryStore.items.find(i => i.id === itemId);
}

function getItemName(item: any) {
  return item.name || getItemInfo(item.item_id)?.name || 'Unknown Item';
}

function getItemDescription(item: any) {
  return getItemInfo(item.item_id)?.notes || '';
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

    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Invoice #${props.invoice.id.slice(0, 8)}</title>
          <script src="https://cdn.tailwindcss.com"><\/script>
          <style>
            @media print {
              @page { margin: 20mm; }
              body { -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body class="bg-white p-10 font-sans">
          <div class="max-w-4xl mx-auto border-2 border-black p-10">
             <div class="flex justify-between items-start border-b-4 border-black pb-8 mb-10">
                <div>
                  <h1 class="text-4xl font-black uppercase tracking-tighter">${companyStore.company?.name || 'VTS SOLUTIONS'}</h1>
                  <p class="text-sm font-bold text-gray-600 mt-2">${companyStore.company?.address || 'Main POS Terminal'}</p>
                </div>
                <div class="text-right">
                  <h2 class="text-6xl font-black text-gray-100 uppercase tracking-widest leading-none mb-4">INVOICE</h2>
                  <p class="text-xl font-black uppercase">#${props.invoice.id.slice(0, 8).toUpperCase()}</p>
                  <p class="text-sm font-bold text-gray-500 mt-1">${props.invoice.date}</p>
                </div>
             </div>

             <div class="grid grid-cols-2 gap-20 mb-16">
                <div>
                   <h4 class="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Billed To:</h4>
                   <h3 class="text-2xl font-black">${props.customerName}</h3>
                   <p class="text-gray-600 mt-1 italic">Customer Status: Verified</p>
                </div>
                <div class="text-right">
                   <h4 class="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Reference:</h4>
                   <p class="text-lg font-bold">${props.invoice.reference || 'SYSTEM-POS'}</p>
                </div>
             </div>

             <table class="w-full text-sm mb-16">
                <thead class="bg-black text-white">
                   <tr>
                      <th class="py-4 px-6 text-left font-black uppercase">Description</th>
                      <th class="py-4 px-6 text-center font-black uppercase">Qty</th>
                      <th class="py-4 px-6 text-right font-black uppercase">Price</th>
                      <th class="py-4 px-6 text-right font-black uppercase">Total</th>
                   </tr>
                </thead>
                <tbody class="divide-y-2 divide-gray-100">
                   ${props.invoice.items.map((i: any) => `
                     <tr>
                        <td class="py-6 px-6 font-bold">
                           <div class="text-lg">${getItemName(i)}</div>
                           ${getItemDescription(i) ? `<div class="text-xs text-gray-500 font-medium italic mt-1">${getItemDescription(i)}</div>` : ''}
                        </td>
                        <td class="py-6 px-6 text-center font-mono">${i.quantity}</td>
                        <td class="py-6 px-6 text-right font-mono">${formatCurrency(i.rate)}</td>
                        <td class="py-6 px-6 text-right font-black">${formatCurrency(i.total)}</td>
                     </tr>
                   `).join('')}
                </tbody>
             </table>

             <div class="flex justify-end">
                <div class="w-80 space-y-4">
                   <div class="flex justify-between font-bold text-gray-600">
                      <span>Subtotal</span>
                      <span>${formatCurrency(props.invoice.total_amount + (props.invoice.discount_amount || 0))}</span>
                   </div>
                   <div class="flex justify-between font-bold text-red-500">
                      <span>Discount</span>
                      <span>-${formatCurrency(props.invoice.discount_amount || 0)}</span>
                   </div>
                   <div class="pt-6 border-t-4 border-black flex justify-between items-center">
                      <span class="text-2xl font-black uppercase">Total Amount</span>
                      <span class="text-3xl font-black text-blue-600">${formatCurrency(props.invoice.total_amount)}</span>
                   </div>
                </div>
             </div>

             <div class="mt-20 pt-10 border-t border-gray-200 text-center">
                <p class="text-xs font-black text-gray-400 uppercase tracking-[0.4em]">Thank you for your business</p>
             </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
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
