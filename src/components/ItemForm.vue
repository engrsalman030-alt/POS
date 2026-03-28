<template>
  <div class="erp-form text-text-primary">
    <form @submit.prevent="handleSubmit" class="space-y-8 pb-10">
      
      <!-- CORE ITEM INFO -->
      <section class="form-section bg-card-bg border border-border rounded-2xl overflow-hidden shadow-sm">
        <div class="px-6 py-4 bg-hover-bg/30 border-b border-border flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>
            </div>
            <h3 class="font-black text-xs uppercase tracking-[0.15em]">Core Item Info</h3>
          </div>
          <div class="flex items-center gap-2">
             <span class="text-[10px] font-black uppercase tracking-widest text-text-muted">Item Type:</span>
             <select v-model="form.type" class="bg-hover-bg border-none rounded-lg px-3 py-1 text-[10px] font-black uppercase text-text-primary focus:ring-0">
               <option value="Product">Product</option>
               <option value="Service">Service</option>
             </select>
          </div>
        </div>
        
        <div class="p-8">
          <div class="flex flex-col md:flex-row gap-8">
            <!-- Image Area -->
            <div class="w-full md:w-48 shrink-0">
              <label class="section-label">Item Image</label>
              <div @click="fileInput?.click()" class="relative aspect-square rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer transition-all hover:border-brand hover:bg-brand/5 group bg-hover-bg/20 overflow-hidden">
                <template v-if="form.image">
                  <img :src="form.image" class="absolute inset-0 w-full h-full object-contain p-2" alt="Preview">
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                  </div>
                </template>
                <template v-else>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-text-muted group-hover:text-brand transition-colors"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                  <span class="text-[9px] font-black text-text-muted uppercase tracking-widest mt-2 group-hover:text-brand">Upload Photo</span>
                </template>
                <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileUpload">
              </div>
            </div>

            <!-- Fields -->
            <div class="flex-1 space-y-6">
              <div class="space-y-2">
                <label class="section-label">Item Name <span class="text-danger">*</span></label>
                <input v-model="form.name" type="text" required placeholder="e.g. Wireless Mouse / Panadol 500mg" class="erp-input text-lg font-black"/>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="section-label">SKU / Item Code</label>
                  <input v-model="form.sku" type="text" placeholder="WM-001" class="erp-input font-mono uppercase"/>
                </div>
                <div class="space-y-2">
                  <label class="section-label">Barcode (EAN/UPC)</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 5v14"/><path d="M21 5v14"/><path d="M7 5v14"/><path d="M11 5v14"/><path d="M17 5v14"/><path d="M13 5v14"/><path d="M15 5v14"/><path d="M9 5v14"/></svg>
                    </span>
                    <input v-model="form.barcode" type="text" placeholder="1234567890123" class="erp-input pl-10 font-mono"/>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="section-label">Category</label>
                  <input v-model="form.category" type="text" placeholder="Electronics, Pharma, Grocery..." class="erp-input"/>
                </div>
                <div class="space-y-2">
                   <label class="section-label">Brand / Manufacturer</label>
                   <input v-model="form.brand" type="text" placeholder="Apple, GSK, Nestle..." class="erp-input"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- PRICING & DISCOUNTS -->
       <section class="form-section bg-card-bg border border-border rounded-2xl overflow-hidden shadow-sm">
        <div class="px-6 py-4 bg-hover-bg/30 border-b border-border flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-success-bg text-success flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.4-1.4 1"/><path d="m7 9 2 2 2-2"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M22 12h-2"/><path d="M4 12H2"/><path d="M16 16v1"/><path d="M8 8V7"/><path d="M16 8V7"/><path d="M8 16v1"/></svg>
          </div>
          <h3 class="font-black text-xs uppercase tracking-[0.15em]">Pricing & Rates</h3>
        </div>
        
        <div class="p-8">
           <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div class="space-y-2">
                <label class="section-label">Purchase Rate</label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[9px] font-bold">PKR</span>
                  <input v-model.number="form.purchase_rate" type="number" class="erp-input pl-12 font-mono text-right"/>
                </div>
              </div>
              <div class="space-y-2">
                <label class="section-label">Selling Rate</label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-brand text-[9px] font-bold">PKR</span>
                  <input v-model.number="form.sales_rate" type="number" class="erp-input pl-12 font-mono text-right border-brand/20"/>
                </div>
              </div>
              <div class="space-y-2">
                <label class="section-label">Wholesale Rate</label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[9px] font-bold">PKR</span>
                  <input v-model.number="form.wholesale_rate" type="number" class="erp-input pl-12 font-mono text-right"/>
                </div>
              </div>
               <div class="space-y-2">
                  <label class="section-label">Min Selling Price</label>
                  <div class="relative">
                     <span class="absolute left-4 top-1/2 -translate-y-1/2 text-danger text-[9px] font-bold">MIN</span>
                     <input v-model.number="form.min_sales_rate" type="number" class="erp-input pl-12 font-mono text-right"/>
                  </div>
               </div>
           </div>

           <div class="mt-8 flex items-center justify-between p-4 bg-hover-bg/30 rounded-xl border border-border">
              <div class="flex items-center gap-3">
                 <div class="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20.91 8.84 8.56 21.19c-.75.75-1.97.75-2.72 0L1.71 17.06c-.75-.75-.75-1.97 0-2.72L14.06 1.99a1.92 1.92 0 0 1 2.71 0l4.13 4.13c.75.75.75 1.97.01 2.72Z"/><path d="M12.42 4.14 19.86 11.58"/><path d="m7.41 12.41 4.24 4.24"/><path d="M7 8h.01"/><path d="M16 17h.01"/></svg>
                 </div>
                 <div>
                    <h4 class="text-[10px] font-black uppercase tracking-widest">Discount Allowed</h4>
                    <p class="text-[9px] text-text-muted">Allow staff to apply manual discounts on this item.</p>
                 </div>
              </div>
               <button type="button" @click="form.discount_allowed = !form.discount_allowed" 
                :class="['w-10 h-6 rounded-full transition-all relative flex items-center px-1', form.discount_allowed ? 'bg-success' : 'bg-border']">
                <div :class="['w-4 h-4 bg-white rounded-full transition-all shadow-sm', form.discount_allowed ? 'translate-x-4' : 'translate-x-0']"></div>
              </button>
           </div>
        </div>
      </section>

      <!-- STOCK SETTINGS -->
      <section class="form-section bg-card-bg border border-border rounded-2xl overflow-hidden shadow-sm">
        <div class="px-6 py-4 bg-hover-bg/30 border-b border-border flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
          </div>
          <h3 class="font-black text-xs uppercase tracking-[0.15em]">Inventory Settings</h3>
        </div>
        
        <div class="p-8">
           <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div v-if="!initialData" class="space-y-2">
                <label class="section-label">Opening Quantity</label>
                <input v-model.number="form.opening_quantity" type="number" class="erp-input font-mono text-center" placeholder="0"/>
              </div>
              <div v-else class="space-y-2 opacity-60">
                <label class="section-label">Current Stock</label>
                <div class="erp-input bg-hover-bg/50 text-center font-black">{{ form.stock_quantity }}</div>
              </div>

              <div class="space-y-2">
                <label class="section-label">Reorder Level</label>
                <input v-model.number="form.reorder_level" type="number" class="erp-input font-mono text-center" placeholder="10"/>
              </div>

              <div class="space-y-2">
                <label class="section-label">Unit of Measure</label>
                <select v-model="form.uom" class="erp-input">
                  <option value="Units">Units (Pcs)</option>
                  <option value="Box">Box</option>
                  <option value="Strip">Strip (Pharma)</option>
                  <option value="Kg">Kilogram</option>
                  <option value="Gram">Gram</option>
                  <option value="Liter">Liter</option>
                  <option value="Meter">Meter</option>
                </select>
              </div>

              <div class="space-y-2">
                <label class="section-label">Warehouse</label>
                <select v-model="form.warehouse" class="erp-input font-medium">
                  <option value="Main Store">Main Store</option>
                  <option value="Shop Shelf">Shop Shelf</option>
                  <option value="Basement">Basement</option>
                </select>
              </div>
           </div>
        </div>
      </section>

      <!-- INDUSTRY SUPPORT TOGGLES -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div v-for="ind in industryToggles" :key="ind.id" 
           @click="ind.active = !ind.active"
           :class="['p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between', 
                    ind.active ? 'bg-brand/5 border-brand shadow-md' : 'bg-card-bg border-border grayscale opacity-60 hover:grayscale-0 hover:opacity-100']"
         >
            <div class="flex items-center gap-3">
               <div :class="['w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg', ind.color]">
                  {{ ind.icon }}
               </div>
               <div>
                 <h4 class="text-[10px] font-black uppercase tracking-widest">{{ ind.label }}</h4>
                 <p class="text-[8px] text-text-muted font-bold">{{ ind.desc }}</p>
               </div>
            </div>
            <div :class="['w-5 h-5 rounded-full flex items-center justify-center transition-all', ind.active ? 'bg-brand text-white rotate-0' : 'bg-border text-transparent rotate-180']">
               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
         </div>
      </section>

      <!-- PHARMACY SUPPORT SECTION -->
      <section v-show="industryToggles?.[0]?.active" class="form-section bg-card-bg border border-emerald-500/30 rounded-2xl overflow-hidden shadow-sm animate-in zoom-in-95 duration-300">
        <div class="px-6 py-4 bg-success-bg border-b border-success/20 flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">🩺</div>
          <h3 class="font-black text-xs uppercase tracking-[0.15em] text-success">Pharmacy / Medicine Details</h3>
        </div>
        <div class="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
           <div class="space-y-2">
              <label class="section-label">Batch Number</label>
              <input v-model="form.batch_number" type="text" placeholder="B-10234" class="erp-input font-mono uppercase"/>
           </div>
           <div class="space-y-2">
              <label class="section-label">Manufacturing Date</label>
              <input v-model="form.mfg_date" type="date" class="erp-input"/>
           </div>
           <div class="space-y-2">
              <label class="section-label">Expiry Date</label>
              <input v-model="form.expiry_date" type="date" class="erp-input border-rose-500/20 focus:border-rose-500"/>
           </div>
           <div class="space-y-2">
              <label class="section-label">Medicine Type</label>
              <select v-model="form.medicine_type" class="erp-input">
                <option value="Tablet">Tablet</option>
                <option value="Syrup">Syrup</option>
                <option value="Injection">Injection</option>
                <option value="Capsule">Capsule</option>
                <option value="Ointment">Ointment</option>
              </select>
           </div>
            <div class="md:col-span-2 flex items-center gap-6 p-4 bg-success-bg rounded-xl border border-success/10">
              <div class="flex-1">
                 <h4 class="text-[10px] font-black uppercase tracking-widest text-success">Prescription Required</h4>
                 <p class="text-[9px] text-text-muted">Item cannot be sold without a doctor's note.</p>
              </div>
              <button type="button" @click="form.prescription_required = !form.prescription_required" 
                :class="['w-10 h-6 rounded-full transition-all relative flex items-center px-1', form.prescription_required ? 'bg-success' : 'bg-border']">
                <div :class="['w-4 h-4 bg-white rounded-full transition-all shadow-sm', form.prescription_required ? 'translate-x-4' : 'translate-x-0']"></div>
              </button>
           </div>
        </div>
      </section>

      <!-- MOBILE SHOP SUPPORT SECTION -->
      <section v-show="industryToggles?.[1]?.active" class="form-section bg-card-bg border border-blue-500/30 rounded-2xl overflow-hidden shadow-sm animate-in zoom-in-95 duration-300">
        <div class="px-6 py-4 bg-blue-500/5 border-b border-blue-500/20 flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">📱</div>
          <h3 class="font-black text-xs uppercase tracking-[0.15em] text-blue-600">Mobile / Electronics Details</h3>
        </div>
        <div class="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
           <div class="space-y-2">
              <label class="section-label">IMEI / Unique ID</label>
              <input v-model="form.imei_number" type="text" placeholder="35234567..." class="erp-input font-mono"/>
           </div>
           <div class="space-y-2">
              <label class="section-label">Serial Number</label>
              <input v-model="form.serial_number" type="text" placeholder="SN-892341..." class="erp-input font-mono"/>
           </div>
           <div class="space-y-2">
              <label class="section-label">Warranty Period</label>
              <select v-model="form.warranty_period" class="erp-input">
                <option value="No Warranty">No Warranty</option>
                <option value="6 Months">6 Months Local</option>
                <option value="1 Year">1 Year Official</option>
                <option value="2 Years">2 Years Official</option>
              </select>
           </div>
        </div>
      </section>

      <!-- GROCERY SUPPORT SECTION -->
      <section v-show="industryToggles?.[2]?.active" class="form-section bg-card-bg border border-amber-500/30 rounded-2xl overflow-hidden shadow-sm animate-in zoom-in-95 duration-300">
        <div class="px-6 py-4 bg-amber-500/5 border-b border-amber-500/20 flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">🛒</div>
          <h3 class="font-black text-xs uppercase tracking-[0.15em] text-amber-600">Grocery / Mart Details</h3>
        </div>
        <div class="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
           <div class="space-y-2">
              <label class="section-label">Weight / Volume</label>
              <div class="flex gap-2">
                <input v-model.number="form.weight" type="number" step="0.01" class="erp-input font-mono flex-1" placeholder="500"/>
                <select v-model="form.unit_type" class="erp-input w-24">
                   <option value="G">Grams</option>
                   <option value="Kg">Kg</option>
                   <option value="Ml">ML</option>
                   <option value="L">Liters</option>
                </select>
              </div>
           </div>
           <div class="space-y-2">
              <label class="section-label">Pack Size</label>
              <input v-model="form.pack_size" type="text" placeholder="Small, Jumbo, Family Pack..." class="erp-input"/>
           </div>
        </div>
      </section>

      <!-- ACCOUNTING SETTINGS -->
      <section class="form-section bg-card-bg border border-border rounded-2xl overflow-hidden shadow-sm">
        <div @click="sections.accounting = !sections.accounting" class="px-6 py-4 bg-hover-bg/30 border-b border-border flex items-center justify-between cursor-pointer group">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
            </div>
            <h3 class="font-black text-xs uppercase tracking-[0.15em]">Accounting Ledger Mapping</h3>
          </div>
          <svg :class="['transition-transform duration-300 text-text-muted group-hover:text-text-primary', sections.accounting ? 'rotate-180' : '']" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg>
        </div>
        
        <div v-show="sections.accounting" class="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-top-2 duration-300">
           <div class="space-y-2">
              <label class="section-label">Inventory Account</label>
              <select v-model="form.default_inventory_account_id" class="erp-input">
                 <option value="inventory">Default Inventory</option>
              </select>
           </div>
           <div class="space-y-2">
              <label class="section-label">Cost of Goods Sold (COGS)</label>
              <select v-model="form.default_expense_account_id" class="erp-input">
                 <option value="cogs">COGS Account</option>
              </select>
           </div>
           <div class="space-y-2">
              <label class="section-label">Sales / Income Account</label>
              <select v-model="form.default_income_account_id" class="erp-input">
                 <option value="sales_income">Sales Income</option>
              </select>
           </div>
        </div>
      </section>

      <!-- EXTRAS -->
      <section class="form-section bg-card-bg border border-border rounded-2xl p-8 shadow-sm">
         <div class="space-y-2">
            <label class="section-label">Product Notes / Description</label>
            <textarea v-model="form.notes" rows="4" class="erp-input py-3" placeholder="Features, specifications, or handling instructions..."></textarea>
         </div>
      </section>

      <!-- FORM ACTIONS -->
      <div class="flex items-center gap-4 pt-4">
        <button type="button" @click="$emit('cancel')" 
          class="flex-1 px-6 py-4 rounded-2xl border border-border bg-card-bg text-text-secondary font-black text-xs uppercase tracking-widest hover:bg-hover-bg transition-all active:scale-95 shadow-sm">
          Cancel
        </button>
        <button type="submit" 
          class="flex-[2] px-6 py-4 rounded-2xl bg-brand text-white font-black text-sm uppercase tracking-widest hover:bg-brand-hover transition-all active:scale-95 shadow-xl shadow-brand/20">
          {{ initialData ? 'Update Item Record' : 'Save New Product' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Item } from '../types/inventory';

const props = defineProps<{
  initialData?: Item | null;
}>();

const emit = defineEmits(['submit', 'cancel']);

const fileInput = ref<HTMLInputElement | null>(null);
const sections = ref({
    accounting: false
});

const industryToggles = ref([
    { id: 'pharma', label: 'Pharmacy Support', desc: 'Batches, Expiry, Prescription', icon: '🩺', active: false, color: 'bg-emerald-500/10 text-emerald-500' },
    { id: 'mobile', label: 'Mobile Shop', desc: 'IMEI, Serial, Warranty', icon: '📱', active: false, color: 'bg-blue-500/10 text-blue-500' },
    { id: 'grocery', label: 'Grocery / Mart', desc: 'Weight, Pack Size, Units', icon: '🛒', active: false, color: 'bg-amber-500/10 text-amber-500' }
]);

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
  stock_quantity: 0,
  reorder_level: 10,
  uom: 'Units',
  warehouse: 'Main Store',
  image: '',
  is_active: true,
  
  // Pharmacy Data
  batch_number: '',
  expiry_date: '',
  mfg_date: '',
  medicine_type: 'Tablet',
  prescription_required: false,

  // Mobile Data
  imei_number: '',
  serial_number: '',
  warranty_period: 'No Warranty',

  // Grocery Data
  weight: null,
  pack_size: '',
  unit_type: 'G',

  notes: ''
});

onMounted(() => {
  if (props.initialData) {
    form.value = { ...props.initialData };
    
    // Auto-enable industry toggles based on existing data
    if (industryToggles.value?.[0] && (form.value.batch_number || form.value.expiry_date)) industryToggles.value[0].active = true;
    if (industryToggles.value?.[1] && (form.value.imei_number || form.value.serial_number)) industryToggles.value[1].active = true;
    if (industryToggles.value?.[2] && (form.value.weight || form.value.pack_size)) industryToggles.value[2].active = true;

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
