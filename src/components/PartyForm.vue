<template>
  <div class="erp-form text-text-primary">
    <form @submit.prevent="handleSubmit" class="space-y-8 pb-10">
      
      <!-- CORE INFORMATION -->
      <section class="form-section bg-card-bg border border-border rounded-2xl overflow-hidden shadow-sm">
        <div class="px-6 py-4 bg-hover-bg/30 border-b border-border flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <h3 class="font-black text-xs uppercase tracking-[0.15em]">Core Information</h3>
        </div>
        
        <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-2">
            <label class="section-label">Party Name <span class="text-danger">*</span></label>
            <input v-model="form.name" type="text" required placeholder="Full Name or Business Display Name" class="erp-input"/>
          </div>
          
          <div class="space-y-2">
            <label class="section-label">Party Type</label>
            <div class="flex bg-hover-bg p-1 rounded-xl border border-border">
              <button type="button" v-for="t in ['Customer', 'Supplier', 'Both']" :key="t"
                @click="form.type = t"
                :class="['flex-1 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all', 
                        form.type === t ? 'bg-card-bg shadow-md text-brand border border-border' : 'text-text-muted hover:text-text-secondary']"
              >
                {{ t }}
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <label class="section-label">Company Name</label>
            <input v-model="form.company_name" type="text" placeholder="Registered Company Name" class="erp-input"/>
          </div>

          <div class="space-y-2">
            <label class="section-label">Contact Person</label>
            <input v-model="form.contact_person" type="text" placeholder="Primary Contact Name" class="erp-input"/>
          </div>
        </div>
      </section>

      <!-- CONTACT DETAILS -->
      <section class="form-section bg-card-bg border border-border rounded-2xl overflow-hidden shadow-sm">
        <div class="px-6 py-4 bg-hover-bg/30 border-b border-border flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-success-bg text-success flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
          <h3 class="font-black text-xs uppercase tracking-[0.15em]">Contact Details</h3>
        </div>
        
        <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-2">
            <label class="section-label">Phone Number</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>
              <input v-model="form.phone" type="text" placeholder="+92 300 1234567" class="erp-input pl-10"/>
            </div>
          </div>
          
          <div class="space-y-2">
            <label class="section-label">WhatsApp</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-success font-bold text-[10px]">WA</span>
              <input v-model="form.whatsapp" type="text" placeholder="+92 ..." class="erp-input pl-10"/>
            </div>
          </div>

          <div class="space-y-2">
            <label class="section-label">Email Address</label>
            <input v-model="form.email" type="email" placeholder="contact@company.com" class="erp-input"/>
          </div>

          <div class="space-y-2">
            <label class="section-label">Website</label>
            <input v-model="form.website" type="text" placeholder="https://www.example.com" class="erp-input"/>
          </div>
        </div>
      </section>

      <!-- ADDRESS SECTION -->
      <section class="form-section bg-card-bg border border-border rounded-2xl overflow-hidden shadow-sm">
        <div @click="sections.address = !sections.address" class="px-6 py-4 bg-hover-bg/30 border-b border-border flex items-center justify-between cursor-pointer hover:bg-hover-bg/50 transition-colors">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <h3 class="font-black text-xs uppercase tracking-[0.15em]">Address & Location</h3>
          </div>
          <svg :class="['transition-transform duration-300', sections.address ? 'rotate-180' : '']" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg>
        </div>
        
        <div v-show="sections.address" class="p-8 space-y-8 animate-in slide-in-from-top-2 duration-300">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-2">
              <label class="section-label">Billing Address</label>
              <textarea v-model="form.billing_address" rows="3" class="erp-input py-3" placeholder="Full billing address..."></textarea>
            </div>
            <div class="space-y-2">
              <label class="section-label group flex items-center justify-between">
                Shipping Address
                <button type="button" @click="form.shipping_address = form.billing_address" class="text-[9px] text-brand hover:underline font-black uppercase">Same as Billing</button>
              </label>
              <textarea v-model="form.shipping_address" rows="3" class="erp-input py-3" placeholder="Full shipping address..."></textarea>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="space-y-2">
              <label class="section-label">City</label>
              <input v-model="form.city" type="text" placeholder="e.g. Karachi" class="erp-input"/>
            </div>
            <div class="space-y-2">
              <label class="section-label">Country</label>
              <input v-model="form.country" type="text" placeholder="e.g. Pakistan" class="erp-input"/>
            </div>
            <div class="space-y-2">
              <label class="section-label">Postal Code</label>
              <input v-model="form.postal_code" type="text" placeholder="75500" class="erp-input"/>
            </div>
          </div>
        </div>
      </section>

      <!-- BUSINESS INFORMATION -->
      <section class="form-section bg-card-bg border border-border rounded-2xl overflow-hidden shadow-sm">
        <div class="px-6 py-4 bg-hover-bg/30 border-b border-border flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>
          <h3 class="font-black text-xs uppercase tracking-[0.15em]">Business Information</h3>
        </div>
        
        <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-2">
            <label class="section-label">Tax ID / NTN</label>
            <input v-model="form.tax_id" type="text" placeholder="1234567-8" class="erp-input font-mono uppercase"/>
          </div>
          
          <div class="space-y-2">
            <label class="section-label">CNIC (National ID)</label>
            <input v-model="form.cnic" type="text" placeholder="42101-1234567-1" class="erp-input font-mono"/>
          </div>

          <div class="space-y-2">
            <label class="section-label">Business Registration No.</label>
            <input v-model="form.reg_number" type="text" placeholder="REG-123456" class="erp-input font-mono"/>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="section-label">Credit Limit</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[10px] font-bold">PKR</span>
                <input v-model.number="form.credit_limit" type="number" class="erp-input pl-12 text-right font-mono"/>
              </div>
            </div>
            <div class="space-y-2">
              <label class="section-label">Payment Terms</label>
              <select v-model="form.payment_terms" class="erp-input appearance-none">
                <option value="Immediate">Immediate</option>
                <option value="Net 15">Net 15 Days</option>
                <option value="Net 30">Net 30 Days</option>
                <option value="Net 60">Net 60 Days</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <!-- ACCOUNTING SETTINGS -->
      <section class="form-section bg-card-bg border border-border rounded-2xl overflow-hidden shadow-sm">
        <div class="px-6 py-4 bg-hover-bg/30 border-b border-border flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <h3 class="font-black text-xs uppercase tracking-[0.15em]">Accounting Settings</h3>
        </div>
        
        <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-2">
            <label class="section-label">Receivable Account</label>
            <select v-model="form.receivable_account_id" class="erp-input">
              <option value="ar">Accounts Receivable</option>
              <!-- Populated from accounts store in real app -->
            </select>
          </div>
          
          <div class="space-y-2">
            <label class="section-label">Payable Account</label>
            <select v-model="form.payable_account_id" class="erp-input">
              <option value="ap">Accounts Payable</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="section-label">Opening Balance</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[10px] font-bold">PKR</span>
              <input v-model.number="form.opening_balance" type="number" class="erp-input pl-12 text-right font-mono"/>
            </div>
          </div>

          <div class="space-y-2">
            <label class="section-label">Balance Type</label>
            <div class="flex bg-hover-bg p-1 rounded-xl border border-border">
              <button type="button" v-for="bt in ['Debit', 'Credit']" :key="bt"
                @click="form.balance_type = bt"
                :class="['flex-1 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all', 
                        form.balance_type === bt ? 'bg-card-bg shadow-md text-text-primary border border-border' : 'text-text-muted hover:text-text-secondary']"
              >
                {{ bt }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- OPTIONAL SETTINGS (User Enable Toggle) -->
      <section class="form-section bg-card-bg border border-border rounded-2xl overflow-hidden shadow-sm">
        <div class="px-6 py-4 bg-hover-bg/30 border-b border-border flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
            </div>
            <h3 class="font-black text-xs uppercase tracking-[0.15em]">Optional Settings</h3>
          </div>
          <button type="button" @click="sections.optional = !sections.optional" 
            :class="['w-10 h-6 rounded-full transition-all relative flex items-center px-1', sections.optional ? 'bg-brand' : 'bg-border']">
            <div :class="['w-4 h-4 bg-white rounded-full transition-all shadow-sm', sections.optional ? 'translate-x-4' : 'translate-x-0']"></div>
          </button>
        </div>
        
        <div v-show="sections.optional" class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-2 duration-300">
          <div class="space-y-2">
            <label class="section-label group flex items-center gap-2">
               Loyalty Program
               <input v-model="form.loyalty_program" type="checkbox" class="w-4 h-4 accent-brand"/>
            </label>
            <p class="text-[10px] text-text-muted italic">Enable points and rewards for this party.</p>
          </div>

          <div class="space-y-2">
            <label class="section-label">Customer Group</label>
            <select v-model="form.customer_group" class="erp-input">
              <option value="">None</option>
              <option value="Retail">Retail</option>
              <option value="Wholesale">Wholesale</option>
              <option value="Corporate">Corporate</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="section-label">Supplier Category</label>
            <input v-model="form.supplier_category" type="text" placeholder="e.g. Raw Material, Services" class="erp-input"/>
          </div>

          <div class="space-y-2">
            <label class="section-label">Price List</label>
            <select v-model="form.price_list" class="erp-input">
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
              <option value="Gold">Gold</option>
            </select>
          </div>
        </div>
      </section>

      <!-- EXTRA FEATURES -->
      <section class="form-section bg-card-bg border border-border rounded-2xl overflow-hidden shadow-sm">
        <div class="px-6 py-4 bg-hover-bg/30 border-b border-border flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>
          </div>
          <h3 class="font-black text-xs uppercase tracking-[0.15em]">Extras & Notes</h3>
        </div>
        
        <div class="p-8 space-y-8">
           <div class="flex items-center gap-6">
             <div class="space-y-2">
                <label class="section-label">Status</label>
                <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-hover-bg border border-border">
                  <button type="button" @click="form.is_active = !form.is_active" 
                    :class="['w-8 h-4 rounded-full transition-all relative flex items-center px-0.5', form.is_active ? 'bg-success' : 'bg-danger']">
                    <div :class="['w-3 h-3 bg-white rounded-full transition-all', form.is_active ? 'translate-x-4' : 'translate-x-0']"></div>
                  </button>
                  <span class="text-[10px] font-black uppercase tracking-widest" :class="form.is_active ? 'text-success' : 'text-danger'">
                    {{ form.is_active ? 'Active' : 'Disabled' }}
                  </span>
                </div>
             </div>

             <div class="flex-1 space-y-2">
               <label class="section-label">Tags</label>
               <input v-model="form.tags" type="text" placeholder="vip, urgent, credit-stop (comma separated)" class="erp-input"/>
             </div>
           </div>

           <div class="space-y-2">
             <label class="section-label">Internal Notes</label>
             <textarea v-model="form.notes" rows="4" class="erp-input py-3" placeholder="Add any internal remarks or special instructions..."></textarea>
           </div>
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
          {{ initialData ? 'Update Party Record' : 'Create New Party' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Party } from '../types/party';

const props = defineProps<{
  initialData?: Party | null;
}>();

const emit = defineEmits(['submit', 'cancel']);

const sections = ref({
  address: true,
  optional: false
});

const form = ref<any>({
  name: '',
  type: 'Customer',
  company_name: '',
  contact_person: '',
  phone: '',
  whatsapp: '',
  email: '',
  website: '',
  billing_address: '',
  shipping_address: '',
  city: '',
  country: 'Pakistan',
  postal_code: '',
  tax_id: '',
  cnic: '',
  reg_number: '',
  credit_limit: 0,
  payment_terms: 'Immediate',
  receivable_account_id: 'ar',
  payable_account_id: 'ap',
  opening_balance: 0,
  balance_type: 'Debit',
  loyalty_program: false,
  customer_group: '',
  supplier_category: '',
  price_list: 'Standard',
  default_currency: 'PKR',
  is_active: true,
  notes: '',
  tags: ''
});

onMounted(() => {
  if (props.initialData) {
    form.value = { ...props.initialData };
    // Handle nulls if any
    Object.keys(form.value).forEach(key => {
        if (form.value[key] === null) form.value[key] = '';
    });
    // Ensure boolean types
    form.value.loyalty_program = !!form.value.loyalty_program;
    form.value.is_active = !!form.value.is_active;
  }
});

function handleSubmit() {
  emit('submit', { ...form.value });
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
