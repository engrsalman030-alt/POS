<template>
  <div class="invoice-detail bg-white rounded-xl overflow-hidden shadow-2xl max-w-[1000px] w-full mx-auto font-sans text-black border border-slate-300">
    
    <!-- A4 Style Container -->
    <!-- Preview Layout Switches based on Template -->
    <div :class="[
       'p-8 pb-4',
       printTemplate === 'PharmacyThermal' ? 'max-w-[80mm] mx-auto text-xs font-mono font-bold' : '',
       printTemplate === 'DotMatrix' ? 'text-xs font-mono tracking-widest' : ''
    ]">
        
        <!-- Corporate & Wholesale Style Layout (Default Preview) -->
        <div v-if="['Corporate', 'Wholesale', 'SimplePOS', 'DotMatrix'].includes(printTemplate)">
           <!-- MAIN HEADER -->
           <div class="flex items-center justify-between border-b-2 border-black pb-4 mb-4" :class="{ 'opacity-50 grayscale': printTemplate === 'DotMatrix' }">
               <div class="flex-shrink-0 mr-6">
                 <img :src="'/logo.png'" style="max-width: 100px; max-height: 100px; object-fit: contain;" onerror="this.onerror=null; this.style.display='none'; document.getElementById('svg-fallback-ui').style.display='flex';" />
                 <div id="svg-fallback-ui" style="display: none; width: 90px; height: 90px;" class="rounded-full border-2 border-emerald-500 bg-white flex-col items-center justify-center shadow-sm">
                     <span class="text-[8px] font-black text-emerald-600 tracking-tighter mt-1">B&H PHARMA</span>
                 </div>
               </div>
               <div class="flex-grow text-left">
                 <h1 class="text-2xl font-black uppercase text-black tracking-tighter leading-none mb-1">{{ companyStore.company?.name || 'B & H Pharmaceutical (PVT) LTD' }}</h1>
                 <p class="text-[11px] font-black text-black">{{ companyStore.company?.address || 'Ismail Adda, Khwaza Khela. Swat' }}</p>
                 <p class="text-[11px] font-black text-black mt-0.5 tracking-tight">NTN : {{ companyStore.company?.ntn || '1526202-2' }} &nbsp;&nbsp;&nbsp; DLN : {{ companyStore.company?.license_number || 'N/A' }}</p>
               </div>
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
                 <p v-if="partyLicense" class="text-black font-black text-[9px] mt-1 italic uppercase underline decoration-emerald-500/30 underline-offset-2">Drug License: {{ partyLicense }}</p>
               </div>
               <div class="text-right space-y-1">
                 <p><span class="font-bold">Invoice No :</span> <span class="font-black ml-1 text-xs">{{ invoice.id.slice(0, 8).toUpperCase() }}</span></p>
                 <p><span class="font-bold">Invoice Date :</span> <span class="font-black ml-1 text-xs">{{ invoice.date }}</span></p>
                 <p v-if="invoice.reference"><span class="font-bold">Reference :</span> <span class="font-black ml-1 text-xs uppercase">{{ invoice.reference }}</span></p>
                 <p><span class="font-bold">Salesman :</span> <span class="font-bold lowercase opacity-70 ml-1">{{ getStaffName(invoice.dsr_id || invoice.sales_manager || '') }}</span></p>
               </div>
           </div>

           <!-- ITEMS TABLE -->
           <table class="w-full text-left border-collapse border border-black text-[9px] mb-4">
               <thead>
                 <tr class="bg-slate-100 border-b border-black">
                     <th class="border border-black py-1 px-1 w-8 text-center">SNO</th>
                     <th class="border border-black py-1 px-1 w-14 text-center">Code</th>
                     <th class="border border-black py-1 px-2">Description</th>
                     <th class="border border-black py-1 px-1 w-16 text-center">Batch</th>
                     <th class="border border-black py-1 px-1 w-10 text-center">Qty</th>
                     <th v-if="printTemplate !== 'SimplePOS'" class="border border-black py-1 px-1 w-10 text-center">Bon</th>
                     <th class="border border-black py-1 px-1 w-14 text-right">Rate</th>
                     <th class="border border-black py-1 px-2 w-20 text-right">Total</th>
                 </tr>
               </thead>
               <tbody>
                   <tr v-for="(item, iIdx) in invoice.items" :key="item.item_id" class="border border-black hover:bg-slate-50">
                       <td class="border border-black text-center py-1 font-bold">{{ Number(iIdx) + 1 }}</td>
                       <td class="border border-black text-center py-1 font-bold">{{ item.item_id.slice(0,6).toUpperCase() }}</td>
                       <td class="border border-black py-1 px-2 font-black uppercase text-[10px]">{{ getItemName(item) }}</td>
                       <td class="border border-black text-center py-1 font-mono font-bold">{{ item.batch_number || '-' }}</td>
                       <td class="border border-black text-center py-1 font-black">{{ item.quantity || 0 }}</td>
                       <td v-if="printTemplate !== 'SimplePOS'" class="border border-black text-center py-1 font-bold text-emerald-700">{{ item.bonus_quantity || '0' }}</td>
                       <td class="border border-black text-right py-1 px-1 font-medium">{{ (item.rate || 0).toFixed(2) }}</td>
                       <td class="border border-black text-right py-1 px-2 font-black">
                           {{ (item.total || ((item.quantity || 0) * (item.rate || 0))).toFixed(2) }}
                       </td>
                   </tr>
               </tbody>
           </table>

           <div class="flex flex-col items-end mt-4 text-black">
               <div class="flex justify-between items-center text-xs w-64">
                   <span class="font-black uppercase tracking-tighter">Grand Total :</span>
                   <span class="font-black text-xl border-b-4 border-double border-black pb-0.5">{{ formatCurrency(invoice.total_amount) }}</span>
               </div>
           </div>
        </div>
        
        <!-- Pharmacy Thermal Print Preview -->
        <div v-else-if="printTemplate === 'PharmacyThermal'" class="flex flex-col items-center">
            <h1 class="text-xl font-bold uppercase mb-1 text-center">{{ companyStore.company?.name || 'B & H Pharmaceutical (PVT) LTD' }}</h1>
            <p class="text-center">{{ customerName }}</p>
            <p v-if="partyLicense" class="text-center text-[10px] italic">DLN: {{ partyLicense }}</p>
            <p class="text-center mb-4">Inv: {{ invoice.id.slice(0,4) }} | {{ invoice.date }}</p>
            
            <div class="w-full border-t border-dashed border-black mb-2"></div>
            <div v-for="item in invoice.items" class="flex justify-between w-full mb-1">
                <span>{{ item.quantity }}x {{ getItemName(item).slice(0, 10) }}</span>
                <span>{{ (item.quantity * item.rate).toFixed(2) }}</span>
            </div>
            <div class="w-full border-t border-dashed border-black mt-2 mb-2"></div>
            
            <div class="flex justify-between w-full text-lg">
                <span>TOTAL:</span>
                <span>{{ invoice.total_amount.toFixed(2) }}</span>
            </div>
            <p class="text-center mt-4">Thank You</p>
        </div>

    </div>

    <!-- Actions Footer -->
    <footer class="p-6 border-t border-slate-200 bg-slate-50 flex gap-4">
        <div class="text-xs font-bold text-slate-500 uppercase flex items-center mr-auto">
            Mode: {{ printTemplate }}
        </div>
        <button @click="$emit('close')" class="px-6 py-3 rounded border border-slate-300 bg-white text-slate-700 font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 shadow-sm">
          Close Preview
        </button>
        <button @click="handlePrint" class="px-6 py-3 rounded bg-black text-white font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all active:scale-90 shadow-lg flex items-center justify-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
          Print Document
        </button>
        <button @click="$emit('edit', invoice)" class="px-6 py-3 rounded bg-brand text-white font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all active:scale-90 shadow-lg flex items-center justify-center gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Edit Invoice
        </button>
    </footer>

    <!-- Hidden Iframe for Printing -->
    <iframe id="invoice-print-frame" style="display: none;"></iframe>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useCompanyStore } from '../stores/company';
import { useInventoryStore } from '../stores/inventory';
import { useStaffStore } from '../stores/staff';
import { useERPStore } from '../stores/erpSettings';
import { usePartyStore } from '../stores/parties';

const props = defineProps<{
  invoice: any;
  customerName: string;
}>();

const emit = defineEmits(['close', 'edit']);

const partyLicense = computed(() => {
    const party = partyStore.parties.find(p => p.id === props.invoice.customer_id || p.id === props.invoice.supplier_id);
    return party?.license_number;
});

const companyStore = useCompanyStore();
const inventoryStore = useInventoryStore();
const staffStore = useStaffStore();
const erpStore = useERPStore();
const partyStore = usePartyStore();

const printTemplate = computed(() => erpStore.getSetting('print_template', 'Corporate'));

onMounted(async () => {
  await inventoryStore.fetchItems();
  await staffStore.fetchStaff();
  await erpStore.loadSettings();
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

    const templateHtml = () => {
       const template = printTemplate.value;
       
       if (template === 'Corporate') {
            return `
               <div class="flex items-center justify-between border-b-2 border-black pb-4 mb-4">
                  <div class="flex-grow text-left">
                     <h1 class="text-2xl font-black uppercase text-black tracking-tighter leading-none mb-1">${companyStore.company?.name || 'B & H Pharmaceutical (PVT) LTD'}</h1>
                     <p class="text-[11px] font-black text-black">${companyStore.company?.address || 'Ismail Adda, Khwaza Khela. Swat'}</p>
                     <p class="text-[10px] font-black italic">NTN: ${companyStore.company?.ntn || 'N/A'} | DLN: ${companyStore.company?.license_number || 'N/A'}</p>
                  </div>
               </div>
               <table class="w-full table-tight border-collapse mb-2">
                 <thead>
                    <tr class="bg-slate-50"><th class="w-8">SNO</th><th>Description</th><th class="w-16">Batch</th><th class="w-10 text-center">Qty</th><th class="w-20 text-right">Total</th></tr>
                 </thead>
                 <tbody>
                    ${props.invoice.items.map((item: any, iIdx: number) => `
                        <tr>
                           <td class="text-center font-bold">${iIdx + 1}</td>
                           <td><div class="font-black uppercase text-[10px]">${getItemName(item)}</div></td>
                           <td class="text-center font-mono font-bold">${item.batch_number || '-'}</td>
                           <td class="text-center font-black">${item.quantity}</td>
                           <td class="text-right font-black">${(item.total || (item.quantity*item.rate)).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                 </tbody>
              </table>
              <div class="flex flex-col items-end mt-4">
                 <div class="w-64 space-y-1"><div class="flex justify-between items-center text-xs"><span class="font-black uppercase tracking-tighter">Grand Total :</span><span class="font-black text-xl border-b-4 border-double border-black pb-0.5">${props.invoice.total_amount.toFixed(2)}</span></div></div>
              </div>
            `;
       } else if (template === 'PharmacyThermal') {
            return `
               <div style="width: 80mm; font-family: monospace; text-align: center;">
                   <h2 style="font-size: 16px; margin: 0;">${companyStore.company?.name || 'B & H Pharmaceutical (PVT) LTD'}</h2>
                   <p style="margin: 0; font-size: 10px;">${props.customerName}</p>
                   ${partyLicense.value ? `<p style="margin: 0; font-size: 9px; font-style: italic;">DLN: ${partyLicense.value}</p>` : ''}
                   <p style="margin: 0; font-size: 10px; border-bottom: 1px dashed black; padding-bottom: 5px; margin-bottom: 5px;">Inv: ${props.invoice.id.slice(0,6)} | ${props.invoice.date}</p>
                   <div style="text-align: left;">
                       ${props.invoice.items.map((item: any) => `
                          <div style="display: flex; justify-content: space-between; font-size: 11px;">
                              <span>${item.quantity}x ${getItemName(item).slice(0, 15)}</span>
                              <span>${(item.quantity * item.rate).toFixed(2)}</span>
                          </div>
                       `).join('')}
                   </div>
                   <div style="border-top: 1px dashed black; padding-top: 5px; margin-top: 5px; display: flex; justify-content: space-between; font-weight: bold;">
                       <span>TOTAL</span><span>${props.invoice.total_amount.toFixed(2)}</span>
                   </div>
                   <p style="text-align: center; font-size: 10px;">Thank You</p>
               </div>
            `;
       } else if (template === 'DotMatrix') {
            return `
               <pre style="font-family: monospace; font-size: 12px; line-height: 1.2;">
===============================================
               ${companyStore.company?.name || 'B & H Pharmaceutical (PVT) LTD'}
               Sales Invoice
===============================================
To: ${props.customerName}
Inv Date: ${props.invoice.date}
-----------------------------------------------
SNO  DESC                 QTY   RATE    TOTAL 
-----------------------------------------------
${props.invoice.items.map((item: any, idx: number) => {
   const d = getItemName(item).slice(0, 20).padEnd(20);
   const q = String(item.quantity).padEnd(5);
   const r = String(item.rate).padEnd(7);
   const t = String((item.quantity * item.rate).toFixed(2)).padStart(8);
   return `${String(idx+1).padEnd(4)} ${d} ${q} ${r} ${t}\n`;
}).join('')}
-----------------------------------------------
GRAND TOTAL:                           ${props.invoice.total_amount.toFixed(2)}
===============================================
               </pre>
            `;
       } else {
            // SimplePOS Or Wholesale (fallback to standard Corporate)
            return `
               <div>Standard Corporate Fallback</div>
               <div>GRAND TOTAL: ${props.invoice.total_amount.toFixed(2)}</div>
            `;
       }
    };

    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Sale Invoice - ${props.invoice.id.slice(0, 8)}</title>
          <script src="https://cdn.tailwindcss.com"><\/script>
          <style>
             @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap');
             @media print {
               @page { margin: 5mm; size: ${printTemplate.value === 'PharmacyThermal' ? '80mm auto' : 'A4'}; }
               body { -webkit-print-color-adjust: exact; font-family: 'Inter', sans-serif; color: #000; }
               .no-print { display: none; }
             }
             body { font-family: 'Inter', sans-serif; font-size: 10px; }
             .border-black { border: 1px solid #000; }
             .table-tight th, .table-tight td { border: 1px solid #000; padding: 2px 4px; font-size: 9px; }
          </style>
        </head>
        <body class="bg-white p-4">
           ${templateHtml()}
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
