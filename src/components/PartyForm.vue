<template>
  <div class="erp-form text-text-primary">
    <form @submit.prevent="handleSubmit" class="space-y-8 pb-10">
      
      <!-- ROLE SELECTOR -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <label v-for="r in roles" :key="r.id" class="cursor-pointer relative">
          <input type="radio" v-model="form.role" :value="r.id" class="peer sr-only">
          <div class="p-3 rounded-xl border-2 border-border bg-card-bg transition-all hover:bg-hover-bg/30 peer-checked:border-brand peer-checked:bg-brand/5 flex flex-col items-center justify-center gap-1 min-h-[80px] group">
             <div class="text-xl group-hover:scale-110 transition-transform">{{ r.icon }}</div>
             <div class="text-[10px] font-bold text-text-primary uppercase tracking-wider text-center leading-tight">{{ r.label }}</div>
             <div class="text-[8px] text-text-muted font-medium text-center leading-tight">{{ r.desc }}</div>
             <div class="absolute top-2 right-2 w-2.5 h-2.5 rounded-full border-2 border-border peer-checked:border-brand peer-checked:bg-brand"></div>
          </div>
        </label>
      </div>

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
                  <AutoCompleteWithCreate
                     v-model="form.category"
                     :options="uniqueCategories"
                     placeholder="VIP, Regular, Bulk..."
                     allow-free-text
                     allow-create
                     @create="val => handleCreateOption('category', val)"
                  />
                </div>
              </div>

              <!-- COMPANY TYPE -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border mt-3 pt-3">
                <div class="space-y-1">
                  <label class="section-label">Company Structure</label>
                   <select v-model="form.company_type" class="erp-input font-bold text-brand">
                    <option value="Non-Percentage">Standard (Non-Percentage)</option>
                    <option value="Percentage">Percentage-Based Supply</option>
                  </select>
                </div>
                <div class="space-y-1">
                  <label class="section-label" :class="{'opacity-50': form.company_type !== 'Percentage'}">Default Margin %</label>
                  <div class="relative">
                    <input v-model.number="form.default_percentage" :disabled="form.company_type !== 'Percentage'" type="number" step="0.01" class="erp-input pr-10 font-mono" placeholder="15.0"/>
                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-[10px] font-bold">%</span>
                  </div>
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
                <AutoCompleteWithCreate
                   v-model="form.payment_terms"
                   :options="uniquePaymentTerms"
                   placeholder="Net 30 Days..."
                   allow-free-text
                   allow-create
                   @create="val => handleCreateOption('payment_terms', val)"
                />
              </div>
           </div>

           <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="space-y-1">
                <label class="section-label">Receivable Account</label>
                <AutoCompleteWithCreate
                   v-model="form.default_receivable_account"
                   :options="accountStore.accounts.filter(a => a.type === 'Asset').map(a => ({ id: a.id, name: a.name, sub: a.code }))"
                   placeholder="Search..."
                />
              </div>
              <div class="space-y-1">
                <label class="section-label">Payable Account</label>
                <AutoCompleteWithCreate
                   v-model="form.default_payable_account"
                   :options="accountStore.accounts.filter(a => a.type === 'Liability').map(a => ({ id: a.id, name: a.name, sub: a.code }))"
                   placeholder="Search..."
                />
              </div>
           </div>
        </div>
      </section>

      <!-- CLASSIFICATION -->
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
         <div class="form-section bg-card-bg border border-border rounded-xl p-5 shadow-none space-y-4">
            <div class="space-y-1">
              <label class="section-label">Party Group</label>
              <AutoCompleteWithCreate
                 v-model="form.party_group"
                 :options="uniqueGroups"
                 placeholder="General, Retailer..."
                 allow-free-text
                 allow-create
                 @create="val => handleCreateOption('party_group', val)"
              />
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

         <div class="form-section bg-card-bg border border-border rounded-xl p-5 shadow-none space-y-4">
            <div class="space-y-1">
              <label class="section-label">Drug License Number</label>
              <input v-model="form.license_number" type="text" placeholder="Optional" class="erp-input font-mono"/>
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
           
           <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div class="space-y-1">
                <label class="section-label">Area / Sector</label>
                <AutoCompleteWithCreate
                   v-model="form.area_id"
                   :options="areaStore.areas"
                   placeholder="e.g. Khwaza Khela"
                   allow-create
                   @create="handleCreateArea"
                   @select="opt => { form.area = opt.name }"
                />
              </div>
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
import { ref, computed, onMounted } from 'vue';
import type { Party } from '../types/party';
import AutoCompleteWithCreate from './AutoCompleteWithCreate.vue';
import { usePartyStore } from '../stores/parties';
import { useAccountStore } from '../stores/accounts';
import { useAreaStore } from '../stores/areas';

const partyStore = usePartyStore();
const accountStore = useAccountStore();
const areaStore = useAreaStore();

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
  { id: 'Customer',    label: 'Customer',    icon: '👤', desc: 'Client / Buyer'     },
  { id: 'Supplier',    label: 'Supplier',    icon: '🏢', desc: 'Vendor / Seller'    },
  { id: 'Both',        label: 'Associate',   icon: '🤝', desc: 'Buys & sells'       },
  { id: 'Salesman',    label: 'Salesman',    icon: '🧑‍💼', desc: 'SSR / DSR Rep'    },
  { id: 'Transporter', label: 'Transporter', icon: '🚚', desc: 'Delivery / Logistics'},
  { id: 'Agent',       label: 'Agent',       icon: '🤖', desc: 'Commission Agent'   },
  { id: 'Walk-in',     label: 'Walk-in',     icon: '🚶', desc: 'Cash / No account'  },
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
  area: '',
  area_id: '',
  credit_limit: 0,
  payment_terms: 'Immediate',
  credit_days: 30,
  tax_id: '',
  default_receivable_account: 'debtors',
  default_payable_account: 'creditors',
  image: null,
  notes: '',
  company_type: 'Non-Percentage',
  default_percentage: 0,
  license_number: ''
});

const localOptions = ref({
  category: [] as string[],
  payment_terms: [] as string[],
  party_group: [] as string[]
});

function handleCreateOption(type: keyof typeof localOptions.value, val: string) {
  if (val && !localOptions.value[type].includes(val)) {
    localOptions.value[type].push(val);
  }
}

const uniquePaymentTerms = computed(() => Array.from(new Set([...[{id:'Immediate',name:'Immediate Payment'},{id:'Net 15',name:'Net 15 Days'},{id:'Net 30',name:'Net 30 Days'},{id:'Net 60',name:'Net 60 Days'}].map(o => o.id), ...localOptions.value.payment_terms])).map(v => ({ id: String(v), name: String(v) })));
const uniqueCategories = computed(() => Array.from(new Set([...partyStore.customers, ...partyStore.suppliers].map(p => (p as any).category).filter(Boolean).concat(localOptions.value.category))).map(v => ({ id: v, name: v })));
const uniqueGroups = computed(() => Array.from(new Set([...[...partyStore.customers, ...partyStore.suppliers].map(p => (p as any).customer_group || (p as any).supplier_category || (p as any).party_group).filter(Boolean), 'General', 'Retailer', 'Wholesaler', 'Distributor', ...localOptions.value.party_group])).map(v => ({ id: v as string, name: v as string })));

onMounted(() => {
  accountStore.fetchAccounts();
  areaStore.fetchAreas();
  if (partyStore.customers.length === 0) partyStore.fetchParties();

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
      image: d.image || null,
      party_group: d.customer_group || d.supplier_category || 'General',
      company_type: d.company_type || 'Non-Percentage',
      default_percentage: d.default_percentage || 0,
      license_number: d.license_number || '',
      area: d.area || '',
      area_id: d.area_id || ''
    };
  }
});

async function handleCreateArea(name: string) {
  try {
    const newId = await areaStore.addArea(name);
    form.value.area_id = newId;
    form.value.area = name;
  } catch (e) {
    console.error("Failed to create area from form:", e);
  }
}

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
    phone: form.value.mobile || form.value.phone,
    customer_group: form.value.role === 'Customer' || form.value.role === 'Both' ? form.value.party_group : '',
    supplier_category: form.value.role === 'Supplier' || form.value.role === 'Both' ? form.value.party_group : ''
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
