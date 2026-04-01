<template>
  <div class="erp-form text-text-primary">
    <form @submit.prevent="handleSubmit" class="space-y-8 pb-10">
      
      <!-- CORE INFO -->
      <section class="form-section bg-card-bg border border-border rounded-xl overflow-hidden shadow-none">
        <div class="px-5 py-3 bg-hover-bg/30 border-b border-border flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-6 h-6 rounded bg-brand/10 text-brand flex items-center justify-center text-[10px]">👤</div>
            <h3 class="font-bold text-[10px] uppercase tracking-widest">Base Identity</h3>
          </div>
          <div class="flex items-center gap-2">
             <span class="text-[9px] font-bold uppercase tracking-widest text-text-muted">Type:</span>
             <select v-model="form.type" class="bg-transparent border-none rounded-md px-2 py-0.5 text-[9px] font-bold uppercase text-text-primary focus:ring-0">
               <option value="Individual">Individual</option>
               <option value="Company">Company</option>
             </select>
          </div>
        </div>
        
        <div class="p-5">
          <div class="flex flex-col md:flex-row gap-5">
            <!-- Avatar Area -->
            <div class="w-full md:w-32 shrink-0">
              <label class="section-label">Profile</label>
              <div @click="fileInput?.click()" class="relative aspect-square rounded-full border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer transition-all hover:border-brand hover:bg-brand/5 group bg-hover-bg/20 overflow-hidden mx-auto">
                <template v-if="form.image">
                  <img :src="form.image" class="absolute inset-0 w-full h-full object-cover" alt="Preview">
                </template>
                <template v-else>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-text-muted"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <span class="text-[7px] font-bold text-text-muted uppercase tracking-widest mt-1">Photo</span>
                </template>
                <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileUpload">
              </div>
            </div>

            <!-- Fields -->
            <div class="flex-1 space-y-4">
              <div class="space-y-1">
                <label class="section-label">Full Name / Entity <span class="text-danger">*</span></label>
                <input v-model="form.name" type="text" required placeholder="e.g. Salman Ali / Alpha Medico" class="erp-input text-base font-bold uppercase"/>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="section-label">Status</label>
                   <select v-model="form.status" class="erp-input font-bold" :class="form.status === 'Active' ? 'text-success' : 'text-danger'">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Blacklisted">Blacklisted</option>
                  </select>
                </div>
                <div class="space-y-1">
                  <label class="section-label">Category / Tag</label>
                   <input v-model="form.category" type="text" placeholder="VIP, Regular, Bulk..." class="erp-input"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CONTACT CHANNELS -->
      <section class="form-section bg-card-bg border border-border rounded-xl overflow-hidden shadow-none">
        <div class="px-5 py-3 bg-hover-bg/30 border-b border-border flex items-center gap-3">
          <div class="w-6 h-6 rounded bg-blue-500/10 text-blue-500 flex items-center justify-center text-[10px]">📞</div>
          <h3 class="font-bold text-[10px] uppercase tracking-widest">Contact Channels</h3>
        </div>
        
        <div class="p-5">
           <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div class="space-y-1">
                <label class="section-label">Primary Email</label>
                <input v-model="form.email" type="email" placeholder="john@company.com" class="erp-input"/>
              </div>
              <div class="space-y-1">
                <label class="section-label">Mobile Number</label>
                <input v-model="form.mobile" type="tel" placeholder="+92 300 1234567" class="erp-input font-mono"/>
              </div>
              <div class="space-y-1">
                <label class="section-label">Office Phone</label>
                <input v-model="form.phone" type="tel" placeholder="042-3512345" class="erp-input font-mono"/>
              </div>
              <div class="space-y-1">
                <label class="section-label">Website</label>
                <input v-model="form.website" type="url" placeholder="www.company.pk" class="erp-input"/>
              </div>
           </div>
        </div>
      </section>

      <!-- ACCOUNTING & TERMS -->
      <section class="form-section bg-card-bg border border-border rounded-xl overflow-hidden shadow-none">
        <div @click="sections.accounting = !sections.accounting" class="px-5 py-3 bg-hover-bg/30 border-b border-border flex items-center justify-between cursor-pointer group">
          <div class="flex items-center gap-3">
            <div class="w-6 h-6 rounded bg-rose-500/10 text-rose-500 flex items-center justify-center text-[10px]">⚖️</div>
            <h3 class="font-bold text-[10px] uppercase tracking-widest">Accounting & Terms</h3>
          </div>
          <svg :class="['transition-transform duration-300 text-text-muted', sections.accounting ? 'rotate-180' : '']" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg>
        </div>
        
        <div v-show="sections.accounting" class="p-5 space-y-5 animate-in slide-in-from-top-1 duration-300">
           <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="space-y-1">
                <label class="section-label">Credit Limit</label>
                <div class="relative">
                   <span class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[8px] font-bold">PKR</span>
                   <input v-model.number="form.credit_limit" type="number" class="erp-input pl-10 font-mono" placeholder="0.00"/>
                </div>
              </div>
              <div class="space-y-1">
                <label class="section-label">Payment Terms</label>
                <select v-model="form.payment_terms" class="erp-input">
                   <option value="Immediate">Immediate Payment</option>
                   <option value="Net 15">Net 15 Days</option>
                   <option value="Net 30">Net 30 Days</option>
                   <option value="Net 60">Net 60 Days</option>
                </select>
              </div>
           </div>

           <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="space-y-1">
                <label class="section-label">Receivable Account</label>
                 <select v-model="form.default_receivable_account" class="erp-input">
                    <option value="debtors">Accounts Receivable (Debtors)</option>
                 </select>
              </div>
              <div class="space-y-1">
                <label class="section-label">Payable Account</label>
                 <select v-model="form.default_payable_account" class="erp-input">
                    <option value="creditors">Accounts Payable (Creditors)</option>
                 </select>
              </div>
           </div>
        </div>
      </section>

      <!-- CLASSIFICATION -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-5">
         <div class="form-section bg-card-bg border border-border rounded-xl p-5 shadow-none space-y-4">
            <div class="space-y-1">
              <label class="section-label">Party Group</label>
              <select v-model="form.party_group" class="erp-input">
                <option value="General">General</option>
                <option value="Retailer">Retailer</option>
                <option value="Wholesaler">Wholesaler</option>
                <option value="Distributor">Distributor</option>
              </select>
            </div>
         </div>

         <div class="form-section bg-card-bg border border-border rounded-xl p-5 shadow-none space-y-4">
            <div class="space-y-1">
              <label class="section-label">Credit Days</label>
              <div class="relative">
                <input v-model.number="form.credit_days" type="number" class="erp-input pr-12 font-mono text-center" placeholder="30"/>
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-[8px] font-bold">DAYS</span>
              </div>
            </div>
         </div>

         <div class="form-section bg-card-bg border border-border rounded-xl p-5 shadow-none space-y-4">
            <div class="space-y-1">
              <label class="section-label">Tax ID / NTN</label>
              <input v-model="form.tax_id" type="text" placeholder="1234567-8" class="erp-input font-mono"/>
            </div>
         </div>
      </section>

      <!-- LOCATION & ADDRESS -->
      <section class="form-section bg-card-bg border border-border rounded-xl overflow-hidden shadow-none">
        <div class="px-5 py-3 bg-hover-bg/30 border-b border-border flex items-center gap-3">
          <div class="w-6 h-6 rounded bg-amber-500/10 text-amber-500 flex items-center justify-center text-[10px]">📍</div>
          <h3 class="font-bold text-[10px] uppercase tracking-widest">Location & Address</h3>
        </div>
        
        <div class="p-5 space-y-4">
           <div class="space-y-1">
              <label class="section-label">Street Address</label>
              <textarea v-model="form.address" rows="2" class="erp-input py-2" placeholder="House #, Street, Area..."></textarea>
           </div>
           
           <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div class="space-y-1">
                <label class="section-label">City</label>
                <input v-model="form.city" type="text" placeholder="e.g. Lahore" class="erp-input"/>
              </div>
              <div class="space-y-1">
                <label class="section-label">Region / State</label>
                <input v-model="form.region" type="text" placeholder="e.g. Punjab" class="erp-input"/>
              </div>
              <div class="space-y-1">
                <label class="section-label">Country</label>
                <input v-model="form.country" type="text" placeholder="Pakistan" class="erp-input"/>
              </div>
           </div>
        </div>
      </section>

      <!-- EXTRAS -->
      <section class="form-section bg-card-bg border border-border rounded-xl p-5 shadow-none">
         <div class="space-y-1">
            <label class="section-label">General Bio / Notes</label>
            <textarea v-model="form.notes" rows="3" class="erp-input py-2" placeholder="Reputation, references, or preferences..."></textarea>
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
          {{ initialData ? 'Update Profile' : 'Save Connection' }}
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

const fileInput = ref<HTMLInputElement | null>(null);

const sections = ref({
  address: true,
  accounting: true,
  optional: false
});

const roles = [
  { id: 'Customer', label: 'Customer', icon: '👤', desc: 'Client / Buyer', color: 'bg-emerald-50 text-emerald-600' },
  { id: 'Supplier', label: 'Supplier', icon: '🏢', desc: 'Vendor / Seller', color: 'bg-blue-50 text-blue-600' },
  { id: 'Both', label: 'Associate', icon: '🤝', desc: 'Both buy & sell', color: 'bg-purple-50 text-purple-600' }
];

const form = ref<any>({
  name: '',
  role: 'Customer',
  status: 'Active',
  category: '',
  email: '',
  phone: '',
  mobile: '',
  website: '',
  address: '',
  city: '',
  region: '',
  country: 'Pakistan',
  credit_limit: 0,
  payment_terms: 'Immediate',
  credit_days: 30,
  tax_id: '',
  default_receivable_account: 'debtors',
  default_payable_account: 'creditors',
  image: null,
  notes: ''
});

onMounted(() => {
  if (props.initialData) {
    const d = props.initialData as any;
    form.value = {
      ...form.value,
      ...d,
      role: d.type || 'Customer',
      status: d.is_active ? 'Active' : 'Inactive',
      mobile: d.phone || '',
      address: d.billing_address || '',
      default_receivable_account: d.receivable_account_id || 'debtors',
      default_payable_account: d.payable_account_id || 'creditors',
      image: d.image || null
    };
  }
});

function handleFileUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (prev) => {
      form.value.image = prev.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

function handleSubmit() {
  const payload = {
    ...form.value,
    type: form.value.role,
    is_active: form.value.status === 'Active',
    billing_address: form.value.address,
    receivable_account_id: form.value.default_receivable_account,
    payable_account_id: form.value.default_payable_account,
    phone: form.value.mobile || form.value.phone
  };
  emit('submit', payload);
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
