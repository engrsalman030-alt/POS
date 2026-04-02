<template>
  <div class="erp-form text-text-primary">
    <form @submit.prevent="handleSubmit" class="space-y-5 pb-10">
      
      <!-- CORE ITEM INFO -->
      <section class="form-section bg-card-bg border border-border rounded-xl overflow-hidden shadow-none">
        <div class="px-5 py-3 bg-hover-bg/30 border-b border-border flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-6 h-6 rounded bg-brand/10 text-brand flex items-center justify-center text-[10px]">📦</div>
            <h3 class="font-bold text-[10px] uppercase tracking-widest">Core Item Info</h3>
          </div>
          <div class="flex items-center gap-2">
             <span class="text-[9px] font-bold uppercase tracking-widest text-text-muted">Type:</span>
             <select v-model="form.type" class="bg-transparent border-none rounded-md px-2 py-0.5 text-[9px] font-bold uppercase text-text-primary focus:ring-0">
               <option value="Product">Product</option>
               <option value="Service">Service</option>
             </select>
          </div>
        </div>
        
        <div class="p-5">
          <div class="flex flex-col md:flex-row gap-5">
            <!-- Image Area -->
            <div class="w-full md:w-32 shrink-0">
              <label class="section-label">Image</label>
              <div @click="fileInput?.click()" class="relative aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer transition-all hover:border-brand hover:bg-brand/5 group bg-hover-bg/20 overflow-hidden">
                <template v-if="form.image">
                  <img :src="form.image" class="absolute inset-0 w-full h-full object-contain p-1" alt="Preview">
                </template>
                <template v-else>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-text-muted"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                  <span class="text-[8px] font-bold text-text-muted uppercase tracking-widest mt-1">Upload</span>
                </template>
                <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileUpload">
              </div>
            </div>

              <!-- Fields -->
              <div class="flex-1 space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <label class="section-label">Item Name <span class="text-danger">*</span></label>
                    <input v-model="form.name" type="text" required placeholder="e.g. Panadol 500mg" class="erp-input text-sm font-bold"/>
                  </div>
                  <div class="space-y-1">
                    <label class="section-label">Generic / Formula Name</label>
                    <input v-model="form.generic_name" type="text" placeholder="e.g. Paracetamol" class="erp-input text-xs italic font-medium"/>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="space-y-1">
                    <label class="section-label">SKU / Code</label>
                    <input v-model="form.sku" type="text" placeholder="WM-001" class="erp-input font-mono uppercase"/>
                  </div>
                  <div class="space-y-1">
                    <label class="section-label">Barcode</label>
                    <input v-model="form.barcode" type="text" placeholder="12345..." class="erp-input font-mono"/>
                  </div>
                  <div class="space-y-1">
                    <label class="section-label">Strength</label>
                    <input v-model="form.strength" type="text" placeholder="e.g. 500mg, 10ml" class="erp-input font-bold text-center border-brand/20"/>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <label class="section-label">Distribution Category</label>
                    <AutoCompleteWithCreate 
                       v-model="form.category" 
                       :options="uniqueCategories" 
                       placeholder="Medicine, Medical..." 
                       allow-free-text
                       allow-create
                       @create="val => handleCreateOption('category', val)"
                    />
                  </div>
                  <div class="space-y-1">
                     <label class="section-label">Manufacturer / Company</label>
                     <AutoCompleteWithCreate 
                        v-model="form.brand" 
                        :options="uniqueBrands" 
                        placeholder="GSK, Getz, Searle..." 
                        allow-free-text
                        allow-create
                        @create="val => handleCreateOption('brand', val)"
                     />
                  </div>
                </div>
              </div>
          </div>
        </div>
      </section>

      <!-- PRICING & DISCOUNTS -->
       <section class="form-section bg-card-bg border border-border rounded-xl overflow-hidden shadow-none">
        <div class="px-5 py-3 bg-hover-bg/30 border-b border-border flex items-center gap-3">
          <div class="w-6 h-6 rounded bg-success-bg text-success flex items-center justify-center text-[10px]">💰</div>
          <h3 class="font-bold text-[10px] uppercase tracking-widest">Pricing & Rates</h3>
        </div>
        
        <div class="p-5">
           <div class="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div class="space-y-1">
                <label class="section-label">Trade Price (TP)</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[8px] font-bold">PKR</span>
                  <input v-model.number="form.trade_price" type="number" class="erp-input pl-10 font-mono text-right border-emerald-500/10" placeholder="0"/>
                </div>
              </div>
              <div class="space-y-1">
                <label class="section-label">Sale Rate (MRP)</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-brand text-[8px] font-bold">MRP</span>
                  <input v-model.number="form.sales_rate" type="number" class="erp-input pl-10 font-mono text-right border-brand/20" placeholder="0"/>
                </div>
              </div>
              <div class="space-y-1">
                <label class="section-label">Purchase Rate</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[8px] font-bold">COST</span>
                  <input v-model.number="form.purchase_rate" type="number" class="erp-input pl-10 font-mono text-right" placeholder="0"/>
                </div>
              </div>
               <div class="space-y-1">
                  <label class="section-label">Discount on TP (%)</label>
                  <div class="relative">
                     <span class="absolute left-3 top-1/2 -translate-y-1/2 text-rose-500 text-[8px] font-bold">DISC</span>
                     <input v-model.number="form.discount_on_tp" type="number" class="erp-input pl-10 font-mono text-right"/>
                  </div>
               </div>
           </div>

           <div class="mt-5 flex items-center justify-between p-3 bg-hover-bg/30 rounded-lg border border-border">
              <div class="flex items-center gap-3">
                 <div class="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center text-[10px]">🏷️</div>
                 <div>
                    <h4 class="text-[9px] font-bold uppercase tracking-widest">Discount Allowed</h4>
                    <p class="text-[8px] text-text-muted">Staff can apply manual discounts.</p>
                 </div>
              </div>
               <button type="button" @click="form.discount_allowed = !form.discount_allowed" 
                :class="['w-9 h-5 rounded-full transition-all relative flex items-center px-1', form.discount_allowed ? 'bg-success' : 'bg-border']">
                <div :class="['w-3 h-3 bg-white rounded-full transition-all shadow-sm', form.discount_allowed ? 'translate-x-4' : 'translate-x-0']"></div>
              </button>
           </div>
        </div>
      </section>

      <!-- STOCK SETTINGS -->
      <section class="form-section bg-card-bg border border-border rounded-xl overflow-hidden shadow-none">
        <div class="px-5 py-3 bg-hover-bg/30 border-b border-border flex items-center gap-3">
          <div class="w-6 h-6 rounded bg-orange-500/10 text-orange-500 flex items-center justify-center text-[10px]">📦</div>
          <h3 class="font-bold text-[10px] uppercase tracking-widest">Inventory Settings</h3>
        </div>
        
        <div class="p-5">
           <div class="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div v-if="!initialData" class="space-y-1">
                <label class="section-label">Opening Stock (Qty)</label>
                <input v-model.number="form.opening_quantity" type="number" class="erp-input font-mono text-center" placeholder="0"/>
              </div>
              <div v-if="!initialData" class="space-y-1">
                <label class="section-label text-emerald-600">Bonus (Free)</label>
                <input v-model.number="form.opening_bonus" type="number" class="erp-input font-mono text-center border-emerald-500/20" placeholder="0"/>
              </div>
              <div v-if="initialData" class="space-y-1 opacity-60">
                <label class="section-label">Current Stock</label>
                <div class="erp-input bg-hover-bg/50 text-center font-bold">{{ form.stock_quantity }}</div>
              </div>

              <div class="space-y-1">
                <label class="section-label">Reorder Level</label>
                <input v-model.number="form.reorder_level" type="number" class="erp-input font-mono text-center" placeholder="10"/>
              </div>

              <div class="space-y-1">
                <label class="section-label">Unit of Measure</label>
                <AutoCompleteWithCreate 
                   v-model="form.uom" 
                   :options="uniqueUoms" 
                   placeholder="Units, Box, Kg..." 
                   allow-free-text
                   allow-create
                   @create="val => handleCreateOption('uom', val)"
                />
              </div>

              <div class="space-y-1">
                <label class="section-label">Warehouse</label>
                <AutoCompleteWithCreate 
                   v-model="form.warehouse" 
                   :options="uniqueWarehouses" 
                   placeholder="Main Store, Shelf..." 
                   allow-free-text
                   allow-create
                   @create="val => handleCreateOption('warehouse', val)"
                />
              </div>
           </div>
        </div>
      </section>

      <!-- INDUSTRY SUPPORT INDICATOR (Simple Pharmacy Mode) -->
      <section v-if="industryToggles?.[0]?.active" class="p-3 rounded-xl border bg-brand/5 border-brand/20 shadow-sm flex items-center justify-between">
         <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-base bg-emerald-500/10 text-emerald-500">
               🩺
            </div>
            <div>
              <h4 class="text-[9px] font-bold uppercase tracking-widest">Pharmacy Support</h4>
              <p class="text-[7px] text-text-muted font-semibold">Standard healthcare data active</p>
            </div>
         </div>
         <div class="w-4 h-4 rounded-full flex items-center justify-center bg-brand text-white">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><path d="M20 6 9 17l-5-5"/></svg>
         </div>
      </section>

      <!-- PHARMACY SUPPORT SECTION -->
      <section v-show="industryToggles?.[0]?.active" class="form-section bg-card-bg border border-emerald-500/20 rounded-xl overflow-hidden shadow-none animate-in zoom-in-95 duration-300">
        <div class="px-5 py-3 bg-success-bg border-b border-success/10 flex items-center gap-3">
          <div class="w-6 h-6 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[10px]">🩺</div>
          <h3 class="font-bold text-[10px] uppercase tracking-widest text-success">Pharmacy / Medicine Details</h3>
        </div>
         <div class="p-5 grid grid-cols-1 md:grid-cols-4 gap-5">
            <div class="space-y-1">
               <label class="section-label">Dosage Form</label>
               <AutoCompleteWithCreate 
                  v-model="form.dosage_form" 
                  :options="dosageForms" 
                  placeholder="Tablet, Syrup..." 
                  allow-free-text
                  allow-create 
                  @create="val => handleCreateOption('dosage_form', val)"
               />
            </div>
            <div class="space-y-1">
               <label class="section-label">Pack Size (Distribution)</label>
               <input v-model="form.pack_size" type="text" placeholder="e.g. 10x10, 1x30" class="erp-input font-mono font-bold text-center uppercase"/>
            </div>
            <div class="space-y-1">
               <label class="section-label">Regulatory Class</label>
               <AutoCompleteWithCreate 
                  v-model="form.medicine_type" 
                  :options="medicineTypes" 
                  placeholder="Normal, Narcotic..." 
                  allow-free-text
                  allow-create 
                  @create="val => handleCreateOption('medicine_type', val)"
               />
            </div>
             <div class="flex items-center gap-4 p-3 bg-success-bg rounded-lg border border-success/5 h-[42px] mt-1.5">
              <div class="flex-1">
                 <h4 class="text-[9px] font-bold uppercase tracking-widest text-success">Prescription Check</h4>
              </div>
              <button type="button" @click="form.prescription_required = !form.prescription_required" 
                :class="['w-9 h-5 rounded-full transition-all relative flex items-center px-1', form.prescription_required ? 'bg-success' : 'bg-border']">
                <div :class="['w-3 h-3 bg-white rounded-full transition-all shadow-sm', form.prescription_required ? 'translate-x-4' : 'translate-x-0']"></div>
              </button>
            </div>
         </div>
      </section>


      <!-- ACCOUNTING SETTINGS -->
      <section class="form-section bg-card-bg border border-border rounded-xl overflow-hidden shadow-none">
        <div @click="sections.accounting = !sections.accounting" class="px-5 py-3 bg-hover-bg/30 border-b border-border flex items-center justify-between cursor-pointer group">
          <div class="flex items-center gap-3">
            <div class="w-6 h-6 rounded bg-rose-500/10 text-rose-500 flex items-center justify-center text-[10px]">💵</div>
            <h3 class="font-bold text-[10px] uppercase tracking-widest">Accounting Mapping</h3>
          </div>
          <svg :class="['transition-transform duration-300 text-text-muted', sections.accounting ? 'rotate-180' : '']" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg>
        </div>
        
        <div v-show="sections.accounting" class="p-5 grid grid-cols-1 md:grid-cols-3 gap-5 animate-in slide-in-from-top-1 duration-300">
           <div class="space-y-1">
              <label class="section-label">Inventory Account</label>
              <AutoCompleteWithCreate 
                 v-model="form.default_inventory_account_id" 
                 :options="accountStore.accounts.filter(a => a.type === 'Asset').map(a => ({ id: a.id, name: a.name, sub: a.code }))" 
                 placeholder="Search Asset Accounts..." 
              />
           </div>
           <div class="space-y-1">
              <label class="section-label">COGS Account</label>
              <AutoCompleteWithCreate 
                 v-model="form.default_expense_account_id" 
                 :options="accountStore.accounts.filter(a => a.type === 'Expense').map(a => ({ id: a.id, name: a.name, sub: a.code }))" 
                 placeholder="Search Expense Accounts..." 
              />
           </div>
           <div class="space-y-1">
              <label class="section-label">Income Account</label>
              <AutoCompleteWithCreate 
                 v-model="form.default_income_account_id" 
                 :options="accountStore.accounts.filter(a => a.type === 'Income').map(a => ({ id: a.id, name: a.name, sub: a.code }))" 
                 placeholder="Search Income Accounts..." 
              />
           </div>
        </div>
      </section>

      <!-- EXTRAS -->
      <section class="form-section bg-card-bg border border-border rounded-xl p-5 shadow-none">
         <div class="space-y-1">
            <label class="section-label">Description / Features</label>
            <textarea v-model="form.notes" rows="3" class="erp-input py-2" placeholder="Specifications..."></textarea>
         </div>
      </section>

      <!-- FORM ACTIONS -->
      <div class="flex items-center gap-4 pt-2">
        <button type="button" @click="$emit('cancel')" 
          class="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 shadow-none">
          Cancel
        </button>
        <button type="submit" 
          class="flex-[2] px-4 py-3 rounded-xl bg-brand text-white font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-sm">
          {{ initialData ? 'Update Record' : 'Save Product' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { Item } from '../types/inventory';
import AutoCompleteWithCreate from './AutoCompleteWithCreate.vue';
import { useInventoryStore } from '../stores/inventory';
import { useAccountStore } from '../stores/accounts';

const inventoryStore = useInventoryStore();
const accountStore = useAccountStore();

const props = defineProps<{
  initialData?: Item | null;
}>();

const emit = defineEmits(['submit', 'cancel']);

const fileInput = ref<HTMLInputElement | null>(null);
const sections = ref({
    accounting: false
});

const industryToggles = ref([
    { id: 'pharma', label: 'Pharmacy Support', desc: 'Batches, Expiry, Prescription', icon: '🩺', active: true, color: 'bg-emerald-500/10 text-emerald-500' }
]);

const localOptions = ref({
  category: [] as string[],
  brand: [] as string[],
  uom: [] as string[],
  warehouse: [] as string[],
  dosage_form: [] as string[],
  medicine_type: [] as string[]
});

function handleCreateOption(type: keyof typeof localOptions.value, val: string) {
  if (val && !localOptions.value[type].includes(val)) {
    localOptions.value[type].push(val);
  }
}

// Computed options for unconstrained flexible inputs
const uniqueCategories = computed(() => Array.from(new Set([...inventoryStore.items.map(i => i.category).filter(Boolean), ...localOptions.value.category])).map(v => ({ id: String(v), name: String(v) })));
const uniqueBrands = computed(() => Array.from(new Set([...inventoryStore.items.map(i => i.brand).filter(Boolean), ...localOptions.value.brand])).map(v => ({ id: String(v), name: String(v) })));
const uniqueUoms = computed(() => Array.from(new Set([...inventoryStore.items.map(i => i.uom).filter(Boolean), 'Units', 'Box', 'Strip', 'Kg', 'Gram', 'Liter', 'Meter', ...localOptions.value.uom])).map(v => ({ id: String(v), name: String(v) })));
const uniqueWarehouses = computed(() => Array.from(new Set([...inventoryStore.items.map(i => i.warehouse).filter(Boolean), 'Main Store', 'Shop Shelf', 'Basement', ...localOptions.value.warehouse])).map(v => ({ id: String(v), name: String(v) })));
const dosageForms = computed(() => Array.from(new Set([...inventoryStore.items.map(i => i.dosage_form).filter(Boolean), 'Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Drops', 'Suspension', 'Inhaler', 'Other', ...localOptions.value.dosage_form])).map(v => ({ id: String(v), name: String(v) })));
const medicineTypes = computed(() => Array.from(new Set([...inventoryStore.items.map(i => i.medicine_type).filter(Boolean), 'Normal', 'Narcotic', 'Antibiotic', 'Schedule-G', ...localOptions.value.medicine_type])).map(v => ({ id: String(v), name: String(v) })));

const form = ref<any>({
  name: '',
  sku: '',
  barcode: '',
  type: 'Product',
  category: '',
  brand: '',
  is_inventory: true,
  default_income_account_id: 'sales_income',
  default_expense_account_id: 'cogs',
  default_inventory_account_id: 'inventory',
  purchase_rate: 0,
  sales_rate: 0,
  wholesale_rate: 0,
  min_sales_rate: 0,
  discount_allowed: true,
  opening_quantity: 0,
  opening_bonus: 0,
  stock_quantity: 0,
  reorder_level: 10,
  uom: 'Units',
  warehouse: 'Main Store',
  image: '',
  is_active: true,
  
  // Pharmacy Data
  notes: '',
  
  // New Pharmacy Distribution Fields
  generic_name: '',
  strength: '',
  dosage_form: 'Tablet',
  mrp: 0,
  trade_price: 0,
  discount_on_tp: 0
});

onMounted(() => {
  accountStore.fetchAccounts();
  if (inventoryStore.items.length === 0) {
     inventoryStore.fetchItems();
  }

  if (props.initialData) {
    form.value = { ...props.initialData };
    
    // Auto-enable pharmacy details if data exists
    if (industryToggles.value?.[0] && (form.value.batch_number || form.value.expiry_date)) industryToggles.value[0].active = true;

    // Handle nulls
    Object.keys(form.value).forEach(key => {
        if (form.value[key] === null) form.value[key] = key === 'weight' ? null : '';
    });

    // Ensure boolean
    form.value.discount_allowed = !!form.value.discount_allowed;
    form.value.prescription_required = !!form.value.prescription_required;
  }
});

function handleFileUpload(event: any) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    form.value.image = e.target?.result as string;
  };
  reader.readAsDataURL(file);
}

function handleSubmit() {
  emit('submit', { 
    ...form.value,
    opening_quantity: form.value.opening_quantity // needed if creating new
  });
}
</script>

<script lang="ts">
export default {
    inheritAttrs: false
}
</script>

<style scoped>
@reference "../style.css";

.erp-input {
  @apply w-full bg-hover-bg/30 border border-border rounded-lg px-3 py-2 text-xs font-semibold outline-none focus:ring-1 focus:ring-brand/20 focus:border-brand transition-all text-text-primary placeholder:text-text-muted/40;
}

.section-label {
  @apply block text-[9px] font-bold uppercase tracking-widest text-text-muted mb-0.5;
}

.form-section {
    @apply transition-all duration-300;
}

</style>
