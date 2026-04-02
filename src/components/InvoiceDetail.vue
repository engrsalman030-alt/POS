<template>
  <div class="invoice-detail bg-white rounded-xl overflow-hidden shadow-2xl max-w-[1000px] w-full mx-auto font-sans text-black border border-slate-300">
    
    <!-- A4 Style Container -->
    <div class="p-8 pb-4">
        <!-- MAIN HEADER -->
        <div class="flex items-center justify-between border-b-2 border-black pb-4 mb-4">
            <!-- MONOGRAM (B&H PHARMA) -->
            <div class="flex-shrink-0 mr-6">
              <img :src="'/logo.png'" style="max-width: 100px; max-height: 100px; object-fit: contain;" onerror="this.onerror=null; this.style.display='none'; document.getElementById('svg-fallback-ui').style.display='flex';" />
              <div id="svg-fallback-ui" style="display: none; width: 90px; height: 90px;" class="rounded-full border-2 border-emerald-500 bg-white flex-col items-center justify-center shadow-sm">
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
            
            <!-- INVOICE BADGE -->
            <div class="flex-shrink-0 text-right ml-4">
              <div class="border-black border-2 px-4 py-2 bg-black text-white inline-block">
                  <h2 class="text-sm font-black uppercase tracking-[0.2em] leading-none mb-0.5">{{ invoice.type === 'purchase' ? 'Purchase' : 'Sale' }}</h2>
                  <h2 class="text-sm font-black uppercase tracking-[0.2em] leading-none">Invoice</h2>
              </div>
            </div>
        </div>

        <!-- INFO BAR -->
        <div class="flex justify-between items-start mb-4 text-[10px] text-black">
            <div class="space-y-1">
              <p><span class="font-bold">Party ID :</span> <span class="font-black text-xs ml-1">{{ invoice.customer_id || invoice.supplier_id }}</span></p>
              <p class="font-black text-sm uppercase">{{ customerName }}</p>
              <p class="text-slate-600 uppercase font-bold text-[10px] max-w-xs">{{ invoice.billing_address || 'Address Not Provided' }}</p>
            </div>
            <div class="text-right space-y-1">
              <p><span class="font-bold">Invoice No :</span> <span class="font-black ml-1 text-xs">{{ invoice.id.slice(0, 8).toUpperCase() }}</span></p>
              <p><span class="font-bold">Invoice Date :</span> <span class="font-black ml-1 text-xs">{{ invoice.date }}</span></p>
              <p v-if="invoice.reference"><span class="font-bold">Reference :</span> <span class="font-black ml-1 text-xs uppercase">{{ invoice.reference }}</span></p>
              <p><span class="font-bold">Salesman :</span> <span class="font-bold lowercase opacity-70 ml-1">{{ getStaffName(invoice.dsr_id || invoice.sales_manager || '') }}</span></p>
            </div>
        </div>

        <!-- ITEMS TABLE (Distribution Style) -->
        <table class="w-full text-left border-collapse border border-black text-[9px] mb-4">
            <thead>
              <tr class="bg-slate-100 border-b border-black">
                  <th class="border border-black py-1 px-1 w-8 text-center">SNO</th>
                  <th class="border border-black py-1 px-1 w-14 text-center">Code</th>
                  <th class="border border-black py-1 px-2">Description</th>
                  <th class="border border-black py-1 px-1 w-16 text-center">Batch</th>
                  <th class="border border-black py-1 px-1 w-10 text-center">Qty</th>
                  <th class="border border-black py-1 px-1 w-10 text-center">Bon</th>
                  <th class="border border-black py-1 px-1 w-14 text-right">T. Price</th>
                  <th class="border border-black py-1 px-1 w-16 text-right">Gross</th>
                  <th class="border border-black py-1 px-1 w-10 text-right">S.Tax</th>
                  <th class="border border-black py-1 px-1 w-10 text-right">Disc</th>
                  <th class="border border-black py-1 px-1 w-14 text-right">D.Val</th>
                  <th class="border border-black py-1 px-2 w-20 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(groupItems, brand, gIdx) in groupedItems" :key="brand">
                <!-- Brand Separator Row -->
                <tr class="bg-slate-50 font-black italic border border-black">
                  <td colspan="12" class="py-1 px-2 border border-black">Company: &nbsp; <span class="font-mono">{{ gIdx + 1 }}</span> &nbsp;&nbsp; <span class="underline">{{ brand }}</span></td>
                </tr>
                
                <!-- Items -->
                <tr v-for="(item, iIdx) in groupItems" :key="item.item_id" class="border border-black hover:bg-slate-50">
                    <td class="border border-black text-center py-1 font-bold">{{ iIdx + 1 }}</td>
                    <td class="border border-black text-center py-1 font-bold">{{ item.sku || item.item_id.slice(0,6).toUpperCase() }}</td>
                    <td class="border border-black py-1 px-2">
                      <div class="font-black uppercase text-[10px]">{{ item.name }}</div>
                      <div v-if="item.generic" class="text-[8px] italic opacity-80 font-medium pb-0.5">{{ item.generic }}</div>
                    </td>
                    <td class="border border-black text-center py-1 font-mono font-bold">{{ item.batch_number || '-' }}</td>
                    <td class="border border-black text-center py-1 font-black">{{ item.quantity || 0 }}</td>
                    <td class="border border-black text-center py-1 font-bold text-emerald-700">{{ item.bonus_quantity || '0' }}</td>
                    <td class="border border-black text-right py-1 px-1 font-medium">{{ (item.rate || 0).toFixed(2) }}</td>
                    <td class="border border-black text-right py-1 px-1 font-bold">{{ ((item.quantity || 0) * (item.rate || 0)).toFixed(2) }}</td>
                    <td class="border border-black text-right py-1 px-1 opacity-60">{{ (item.tax_amount || 0).toFixed(2) }}</td>
                    <td class="border border-black text-right py-1 px-1 opacity-60">{{ (item.discount_pct || 0).toFixed(1) }}</td>
                    <td class="border border-black text-right py-1 px-1">{{ (((item.quantity || 0) * (item.rate || 0)) * ((item.discount_pct || 0) / 100)).toFixed(2) }}</td>
                    <td class="border border-black text-right py-1 px-2 font-black">{{ (item.total || (((item.quantity || 0) * (item.rate || 0)) - (((item.quantity || 0) * (item.rate || 0)) * ((item.discount_pct || 0) / 100)) + (item.tax_amount || 0))).toFixed(2) }}</td>
                </tr>
                
                <!-- Brand Total Row -->
                <tr class="bg-slate-100 font-black border border-black">
                  <td colspan="11" class="text-right py-1 px-2 border border-black uppercase tracking-tight">Total for: {{ brand }}</td>
                  <td class="text-right py-1 px-2 border border-black">{{ groupItems.reduce((s, i) => s + (i.total || (((i.quantity || 0) * (i.rate || 0)) - (((i.quantity || 0) * (i.rate || 0)) * ((i.discount_pct || 0) / 100)) + (i.tax_amount || 0))), 0).toFixed(2) }}</td>
                </tr>
              </template>
            </tbody>
        </table>

        <!-- SUMMARY FOOTER -->
        <div class="flex flex-col items-end mt-4 text-black">
            <div class="w-64 space-y-1">
              <div class="flex justify-between items-center text-xs">
                  <span class="font-black uppercase tracking-tighter">Grand Total :</span>
                  <span class="font-black text-xl border-b-4 border-double border-black pb-0.5">{{ formatCurrency(invoice.total_amount) }}</span>
              </div>
            </div>
            
            <div class="mt-8 border-t border-black pt-2 w-full text-left">
              <h4 class="text-[9px] font-black uppercase tracking-widest mb-1">Warranty (Under Drugs Act 1976):</h4>
              <p class="text-[9px] font-medium leading-tight text-justify">
                  "I/We do hereby give this warranty that the drugs/medicines here described as sold by me/us do not contravene in any way the provisions of section 23 of the Drugs Act 1976."
              </p>
            </div>

            <div class="mt-12 w-full flex justify-between items-end px-4">
              <div class="flex flex-col items-start gap-1">
                  <p class="text-[8px] font-black uppercase text-slate-400">Computer Generated Preview</p>
              </div>
              <div class="flex flex-col items-center">
                  <div class="w-48 border-t border-black mb-1"></div>
                  <p class="text-[9px] font-black uppercase tracking-widest text-slate-600">Authorized Signature</p>
              </div>
            </div>
        </div>
    </div>

    <!-- Actions Footer -->
    <footer class="p-6 border-t border-slate-200 bg-slate-50 flex gap-4">
        <button @click="$emit('close')" class="flex-1 px-6 py-3 rounded border border-slate-300 bg-white text-slate-700 font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 shadow-sm">
          Close Preview
        </button>
        <button @click="handlePrint" class="flex-1 px-6 py-3 rounded bg-black text-white font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-lg flex items-center justify-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
          Print Document
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
               @page { margin: 5mm; size: A4; }
               body { -webkit-print-color-adjust: exact; font-family: 'Inter', sans-serif; color: #000; }
               .no-print { display: none; }
             }
             body { font-family: 'Inter', sans-serif; font-size: 10px; }
             .border-black { border: 1px solid #000; }
             .table-tight th, .table-tight td { border: 1px solid #000; padding: 2px 4px; font-size: 9px; }
             .monogram { font-family: 'JetBrains Mono', monospace; font-size: 24px; letter-spacing: 0.3em; }
          </style>
        </head>
        <body class="bg-white p-4">
          <!-- MAIN HEADER -->
          <div class="flex items-center justify-between border-b-2 border-black pb-4 mb-4">
             <!-- MONOGRAM (B&H PHARMA) -->
             <div class="flex-shrink-0 mr-6">
                <!-- Using an img tag targeting public/logo.png if the user places it there, with a nice inline SVG fallback representing the cross/hands -->
                <img src="/logo.png" style="max-width: 100px; max-height: 100px; object-fit: contain;" onerror="this.onerror=null; this.style.display='none'; document.getElementById('svg-fallback').style.display='flex';" />
                <div id="svg-fallback" style="display: none; width: 90px; height: 90px;" class="rounded-full border-2 border-emerald-500 bg-white flex-col items-center justify-center shadow-sm">
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
             
             <!-- INVOICE BADGE -->
             <div class="flex-shrink-0 text-right ml-4">
                <div class="border-black border-2 px-4 py-2 bg-black text-white inline-block">
                   <h2 class="text-sm font-black uppercase tracking-[0.2em] leading-none mb-0.5">Sale</h2>
                   <h2 class="text-sm font-black uppercase tracking-[0.2em] leading-none">Invoice</h2>
                </div>
             </div>
          </div>

          <!-- INFO BAR -->
          <div class="flex justify-between items-start mb-2 text-[10px]">
             <div class="space-y-0.5">
                <p><span class="font-bold">Sold To :</span> <span class="font-black text-xs">${props.invoice.customer_id}</span></p>
                <p class="font-black text-xs uppercase">${props.customerName}</p>
                <p class="text-slate-600 uppercase font-bold text-[9px] max-w-xs">${props.invoice.billing_address || 'Address Not Provided'}</p>
             </div>
             <div class="text-right space-y-0.5">
                <p><span class="font-bold">Invoice No :</span> <span class="font-black">${props.invoice.id.slice(0, 8).toUpperCase()}</span></p>
                <p><span class="font-bold">Invoice Date :</span> <span class="font-black">${props.invoice.date}</span></p>
                <p><span class="font-bold">Salesman :</span> <span class="font-bold lowercase opacity-70">${getStaffName(props.invoice.dsr_id || props.invoice.sales_manager || '')}</span></p>
             </div>
          </div>

          <!-- ITEMS TABLE (Distribution Style) -->
          <table class="w-full table-tight border-collapse mb-2">
             <thead>
                <tr class="bg-slate-50">
                   <th class="w-8">SNO</th>
                   <th class="w-14">Code</th>
                   <th>Description</th>
                   <th class="w-16">Batch</th>
                   <th class="w-10 text-center">Qty</th>
                   <th class="w-10 text-center">Bon</th>
                   <th class="w-14 text-right">T. Price</th>
                   <th class="w-16 text-right">Gross</th>
                   <th class="w-10 text-right">S.Tax</th>
                   <th class="w-10 text-right">Disc</th>
                   <th class="w-14 text-right">D.Val</th>
                   <th class="w-20 text-right">Total</th>
                </tr>
             </thead>
             <tbody>
                ${Object.entries(brandGroups).map(([brand, groupItems], gIdx) => {
                  const brandTotal = groupItems.reduce((sum, i) => sum + i.total, 0);
                  return `
                   <tr class="bg-slate-50 font-black italic border-black">
                      <td colspan="12" class="py-1 px-2 border-black">Company: &nbsp; <span class="font-mono text-xs">${gIdx + 1}</span> &nbsp;&nbsp; <span class="underline">${brand}</span></td>
                   </tr>
                   ${groupItems.map((item, iIdx) => {
                     const qty = item.quantity || 0;
                     const rate = item.rate || 0;
                     const gross = qty * rate;
                     const tax = item.tax_amount || 0;
                     const discPct = item.discount_pct || 0;
                     const discVal = gross * (discPct / 100);
                     const rowTotal = item.total || (gross - discVal + tax);
                     
                     return `
                        <tr>
                           <td class="text-center font-bold">${iIdx + 1}</td>
                           <td class="text-center font-bold">${item.sku || item.item_id.slice(0,6).toUpperCase()}</td>
                           <td>
                               <div class="font-black uppercase text-[10px]">${item.name}</div>
                               ${item.generic ? `<div class="text-[8px] italic opacity-80 font-medium">${item.generic}</div>` : ''}
                           </td>
                           <td class="text-center font-mono font-bold">${item.batch_number || '-'}</td>
                           <td class="text-center font-black">${qty}</td>
                           <td class="text-center font-bold text-emerald-700">${item.bonus_quantity || '0'}</td>
                           <td class="text-right font-medium">${rate.toFixed(2)}</td>
                           <td class="text-right font-bold">${gross.toFixed(2)}</td>
                           <td class="text-right opacity-60">${tax.toFixed(2)}</td>
                           <td class="text-right opacity-60">${discPct.toFixed(1)}</td>
                           <td class="text-right">${discVal.toFixed(2)}</td>
                           <td class="text-right font-black">${rowTotal.toFixed(2)}</td>
                        </tr>
                     `;
                   }).join('')}
                   <tr class="bg-slate-50/50 font-black border-black">
                      <td colspan="11" class="text-right py-1 border-black uppercase tracking-tight">Total for: ${brand}</td>
                      <td class="text-right py-1 font-black border-black">${brandTotal.toFixed(2)}</td>
                   </tr>
                  `;
                }).join('')}
             </tbody>
          </table>

          <!-- SUMMARY FOOTER -->
          <div class="flex flex-col items-end mt-4">
             <div class="w-64 space-y-1">
                <div class="flex justify-between items-center text-xs">
                   <span class="font-black uppercase tracking-tighter">Grand Total :</span>
                   <span class="font-black text-xl border-b-4 border-double border-black pb-0.5">${props.invoice.total_amount.toFixed(2)}</span>
                </div>
             </div>
             
          <div class="mt-8 border-t border-black pt-2">
             <h4 class="text-[9px] font-black uppercase tracking-widest mb-1">Warranty (Under Drugs Act 1976):</h4>
             <p class="text-[9px] font-medium leading-tight">
                "I/We do hereby give this warranty that the drugs/medicines here described as sold by me/us do not contravene in any way the provisions of section 23 of the Drugs Act 1976."
             </p>
          </div>

          <div class="mt-12 w-full flex justify-between items-end px-4">
             <div class="flex flex-col items-start gap-1">
                <p class="text-[8px] font-black uppercase text-slate-400">Computer Generated Invoice</p>
                <p class="text-[8px] font-bold text-slate-400">Page 1 of 1</p>
             </div>
             <div class="flex flex-col items-center">
                <div class="w-48 border-t border-black mb-1"></div>
                <p class="text-[9px] font-black uppercase tracking-widest text-slate-600">Authorized Signature</p>
             </div>
          </div>
          </div>

          <div class="mt-20 text-[7px] text-center text-slate-300 font-bold uppercase tracking-[0.6em]">
             B & H PHARMACEUTICAL (PVT) LTD - DISTRIBUTOR MANAGEMENT SYSTEM
          </div>

          <script>
            window.onload = function() {
              setTimeout(() => {
                window.print();
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
