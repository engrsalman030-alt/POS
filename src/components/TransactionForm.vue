<template>
  <div class="transaction-form text-text-primary">
    <form @submit.prevent="handleSubmit" class="space-y-8 pb-10">
      
      <!-- HEADER SECTION: PARTY & BASICS -->
      <section class="form-section bg-card-bg border border-border rounded-2xl overflow-hidden shadow-sm">
        <div class="px-6 py-4 bg-hover-bg/30 border-b border-border flex items-center justify-between">
          <div class="flex items-center gap-3">
             <div :class="['w-8 h-8 rounded-lg flex items-center justify-center', type === 'Sales' ? 'bg-brand/10 text-brand' : 'bg-success-bg text-success']">
                <svg v-if="type === 'Sales'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h7"/><path d="M16 5V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2"/><path d="M3 9h18"/><path d="m15 18 3 3 3-3"/></svg>
             </div>
             <h3 class="font-black text-xs uppercase tracking-[0.15em]">{{ type }} {{ type === 'Sales' ? 'Invoice' : 'Bill' }} Basics</h3>
          </div>
          <div class="flex items-center gap-2">
             <span class="px-3 py-1 rounded-full bg-hover-bg text-[10px] font-black uppercase tracking-widest border border-border">Draft</span>
          </div>
        </div>
        
        <div class="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
           <div class="space-y-2">
              <label class="section-label">{{ type === 'Sales' ? 'Customer' : 'Supplier' }} <span class="text-danger">*</span></label>
              <select v-model="form.party_id" required class="erp-input">
                <option value="">Select {{ type === 'Sales' ? 'Customer' : 'Supplier' }}</option>
                <option v-for="p in parties" :key="p.id" :value="p.id">{{ p.name }}</option>
              </select>
           </div>
           <div class="space-y-2">
              <label class="section-label">Date <span class="text-rose-500">*</span></label>
              <input v-model="form.date" type="date" required class="erp-input"/>
           </div>
           <div class="space-y-2">
              <label class="section-label">Reference / PO #</label>
              <input v-model="form.reference" type="text" placeholder="e.g. PO-9923" class="erp-input font-mono uppercase"/>
           </div>
        </div>
      </section>

      <!-- ITEMS TABLE SECTION -->
      <section class="form-section bg-card-bg border border-border rounded-2xl overflow-hidden shadow-sm">
        <div class="px-6 py-4 bg-hover-bg/30 border-b border-border">
          <h3 class="font-black text-xs uppercase tracking-[0.15em]">Line Items</h3>
        </div>
        
        <div class="overflow-x-auto min-h-[300px]">
          <table class="w-full text-left border-collapse">
            <thead class="bg-hover-bg/50 border-b border-border">
              <tr>
                <th class="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted">Item Description</th>
                <th class="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted w-24 text-center">Qty</th>
                <th class="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted w-32 text-center">Rate</th>
                <th class="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted w-32 text-center">Tax</th>
                <th class="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted w-40 text-right">Amount</th>
                <th class="w-12"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(line, idx) in form.items" :key="idx" class="group border-b border-border/50 hover:bg-hover-bg/20 transition-colors">
                <td class="px-6 py-4">
                  <select v-model="line.item_id" @change="onItemChange(idx)" class="w-full bg-transparent border-none focus:ring-0 text-sm font-semibold p-0 text-text-primary">
                    <option value="">Choose an item...</option>
                    <option v-for="i in inventory" :key="i.id" :value="i.id">{{ i.name }} ({{ i.sku }})</option>
                  </select>
                </td>
                <td class="px-4 py-4">
                  <input v-model.number="line.quantity" type="number" step="0.01" class="w-full bg-transparent border-none focus:ring-0 text-sm font-mono text-center p-0" placeholder="1.00"/>
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center justify-center gap-1">
                    <span class="text-[10px] text-text-muted font-bold">Rs</span>
                    <input v-model.number="line.rate" type="number" step="0.01" class="w-full bg-transparent border-none focus:ring-0 text-sm font-mono text-center p-0" placeholder="0.00"/>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <select v-model="line.tax_id" class="w-full bg-transparent border-none focus:ring-0 text-[11px] font-bold text-text-secondary p-0">
                     <option value="">No Tax</option>
                     <option v-for="t in taxes" :key="t.id" :value="t.id">{{ t.name }} ({{ t.rate }}%)</option>
                  </select>
                </td>
                <td class="px-6 py-4 text-right">
                  <span class="text-sm font-black text-text-primary">{{ formatCurrency(calculateLineTotal(line)) }}</span>
                </td>
                <td class="px-2 py-4">
                  <button type="button" @click="removeLine(idx)" class="text-text-muted hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="p-6">
             <button type="button" @click="addLine" class="px-4 py-2 rounded-xl bg-hover-bg border border-border text-[10px] font-black uppercase tracking-widest text-text-muted hover:bg-border hover:text-text-primary transition-all flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                Add Line Item
             </button>
          </div>
        </div>
      </section>

      <!-- FOOTER: TOTALS & NOTES -->
      <section class="grid grid-cols-1 md:grid-cols-2 gap-8">
         <!-- Notes Area -->
         <div class="form-section bg-card-bg border border-border rounded-2xl p-8 shadow-sm">
            <label class="section-label">Terms & Conditions / Internal Notes</label>
            <textarea v-model="form.notes" rows="6" class="erp-input py-3 resize-none" placeholder="Add terms of sale or shipping instructions..."></textarea>
         </div>

         <!-- Calculations -->
         <div class="form-section bg-card-bg border border-border rounded-2xl p-8 shadow-sm space-y-4">
            <div class="flex justify-between items-center text-sm">
               <span class="text-text-muted font-bold uppercase tracking-widest text-[10px]">Subtotal (Excl. Tax)</span>
               <span class="font-bold text-text-secondary">{{ formatCurrency(subtotal) }}</span>
            </div>
            <div class="flex justify-between items-center text-sm">
               <span class="text-text-muted font-bold uppercase tracking-widest text-[10px]">Tax Amount</span>
               <span class="font-bold text-success">{{ formatCurrency(totalTax) }}</span>
            </div>
            <div class="flex justify-between items-center text-sm">
               <span class="text-text-muted font-bold uppercase tracking-widest text-[10px]">Discount</span>
               <div class="flex items-center gap-2 w-32">
                 <span class="text-[10px] text-text-muted font-bold">Rs</span>
                 <input v-model.number="form.discount_amount" type="number" class="w-full bg-hover-bg/50 border-none rounded-lg px-2 py-1 text-right font-mono text-xs"/>
               </div>
            </div>
            <div class="pt-4 border-t border-border mt-4 flex justify-between items-end">
               <div>
                  <h4 class="text-[10px] font-black uppercase tracking-widest text-text-muted">Total Payable</h4>
                  <p class="text-[9px] text-text-muted italic">Incl. all taxes & discounts</p>
               </div>
               <div class="text-3xl font-black text-brand tracking-tighter">
                  {{ formatCurrency(grandTotal) }}
               </div>
            </div>
         </div>
      </section>

      <!-- FORM ACTIONS -->
      <div class="flex items-center gap-4 pt-4">
        <button type="button" @click="$emit('cancel')" 
          class="flex-1 px-6 py-4 rounded-2xl border border-border bg-card-bg text-text-secondary font-black text-xs uppercase tracking-widest hover:bg-hover-bg transition-all active:scale-95 shadow-sm">
          Cancel
        </button>
        <button type="submit" :disabled="!isFormValid"
          class="flex-[2] px-6 py-4 rounded-2xl bg-brand text-white font-black text-sm uppercase tracking-widest hover:bg-brand-hover transition-all active:scale-95 shadow-xl shadow-brand/20 disabled:grayscale disabled:opacity-50">
          {{ initialData ? 'Update Transaction' : (type === 'Sales' ? 'Post Sales Invoice' : 'Post Purchase Bill') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePartyStore } from '../stores/parties';
import { useInventoryStore } from '../stores/inventory';
import { useTaxStore } from '../stores/tax';
import { useCompanyStore } from '../stores/company';

const props = defineProps<{
  type: 'Sales' | 'Purchase';
  initialData?: any;
}>();

const emit = defineEmits(['submit', 'cancel']);

const partyStore = usePartyStore();
const inventoryStore = useInventoryStore();
const taxStore = useTaxStore();
const companyStore = useCompanyStore();

const parties = computed(() => props.type === 'Sales' ? partyStore.customers : partyStore.suppliers);
const inventory = computed(() => inventoryStore.items);
const taxes = computed(() => taxStore.taxes);

interface TransactionLine {
  item_id: string;
  quantity: number;
  rate: number;
  tax_id: string;
  tax_amount: number;
  total: number;
}

const form = ref({
  party_id: '',
  date: new Date().toISOString().split('T')[0],
  reference: '',
  items: [
    { item_id: '', quantity: 1, rate: 0, tax_id: '', tax_amount: 0, total: 0 }
  ] as TransactionLine[],
  tax_amount: 0,
  discount_amount: 0,
  total_amount: 0,
  notes: ''
});

onMounted(async () => {
    if (props.initialData) {
        form.value = { ...props.initialData };
        // Handle party_id mapping based on the common key from the view
        form.value.party_id = props.type === 'Sales' ? props.initialData.customer_id : props.initialData.supplier_id;
    }
    taxStore.fetchTaxes();
});

function addLine() {
  form.value.items.push({ item_id: '', quantity: 1, rate: 0, tax_id: '', tax_amount: 0, total: 0 });
}

function removeLine(idx: number) {
  if (form.value.items.length > 1) {
    form.value.items.splice(idx, 1);
  } else {
    form.value.items[0] = { item_id: '', quantity: 1, rate: 0, tax_id: '', tax_amount: 0, total: 0 };
  }
}

function onItemChange(idx: number) {
  const line = form.value.items[idx];
  if (!line) return;
  const item = inventory.value.find(i => i.id === line.item_id);
  if (item) {
    line.rate = props.type === 'Sales' ? item.sales_rate : item.purchase_rate;
  }
}

function calculateLineTotal(line: TransactionLine) {
  const lineSubtotal = line.quantity * line.rate;
  const tax = taxes.value.find(t => t.id === line.tax_id);
  const taxAmount = tax ? (lineSubtotal * tax.rate / 100) : 0;
  line.tax_amount = taxAmount;
  line.total = lineSubtotal + taxAmount;
  return line.total;
}

const subtotal = computed(() => {
  return form.value.items.reduce((sum: number, line: any) => sum + (line.quantity * line.rate), 0);
});

const totalTax = computed(() => {
  return form.value.items.reduce((sum: number, line: any) => {
    const tax = taxes.value.find(t => t.id === line.tax_id);
    return sum + (tax ? (line.quantity * line.rate * tax.rate / 100) : 0);
  }, 0);
});

const grandTotal = computed(() => {
  return subtotal.value + totalTax.value - (form.value.discount_amount || 0);
});

const isFormValid = computed(() => {
  return form.value.party_id && 
         form.value.date && 
         form.value.items.length > 0 && 
         form.value.items.every((i: any) => i.item_id && i.quantity > 0);
});

function handleSubmit() {
  const payload = {
    ...form.value,
    tax_amount: totalTax.value,
    total_amount: grandTotal.value,
    [props.type === 'Sales' ? 'customer_id' : 'supplier_id']: form.value.party_id
  };
  emit('submit', payload);
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: companyStore.company?.currency || 'PKR',
    maximumFractionDigits: 0
  }).format(val || 0);
}
</script>

<style scoped>
@reference "../style.css";

.erp-input {
  @apply w-full bg-hover-bg/30 border border-border rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-text-primary placeholder:text-text-muted/50;
}

.section-label {
  @apply block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-1;
}

.form-section {
  @apply transition-all duration-300;
}

.form-section:hover {
  @apply border-border/80 shadow-md;
}
</style>
