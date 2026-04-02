<template>
  <div class="transaction-form min-h-screen bg-app-bg text-text-primary font-inter pb-20">
    <!-- STICKY HEADER -->
    <header class="sticky top-0 z-[60] bg-card-bg border-b border-border px-4 md:px-6 py-1.5 md:py-2 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
      <div class="flex items-center gap-3 w-full md:w-auto">
        <h1 class="text-sm md:text-base font-black tracking-tighter text-text-primary leading-none uppercase">
          {{ type === 'Sales' ? 'Sale Invoice' : 'Purchase Bill' }}
        </h1>
      </div>
      <div class="flex items-center gap-2 w-full md:w-auto">
        <button @click="$emit('cancel')" class="flex-1 md:flex-none px-4 py-2 rounded-xl border border-border text-[10px] md:text-xs font-black uppercase tracking-widest text-text-muted hover:bg-hover-bg transition-all flex items-center justify-center gap-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m15 18-6-6 6-6"/></svg>
          Cancel
        </button>
        <button @click="handleSubmit" :disabled="!isFormValid" class="flex-[2] md:flex-none px-6 md:px-8 py-2 rounded-xl bg-brand text-white text-[10px] md:text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-brand/20 disabled:opacity-30 flex items-center justify-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>
          Post Transaction
        </button>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-6">
      
      <!-- HEADER METADATA -->
      <section class="bg-card-bg rounded-3xl border border-border shadow-sm overflow-hidden">
        <div class="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="space-y-1.5">
            <label class="label-tiny">Distribution Party</label>
            <AutoCompleteWithCreate
              v-model="form.party_id"
              :options="parties.map(p => ({ id: p.id, name: p.name, sub: p.phone }))"
              :placeholder="`Search ${type === 'Sales' ? 'Customer' : 'Supplier'}...`"
              allow-create
              @create="handleCreateParty"
            />
          </div>

          <div v-if="type === 'Sales'" class="space-y-1.5">
            <label class="label-tiny">SSR (Order Taker)</label>
            <AutoCompleteWithCreate
              v-model="form.ssr_id"
              :options="staffStore.ssrs.map(s => ({ id: s.id, name: s.name }))"
              placeholder="Select SSR..."
            />
          </div>

          <div v-if="type === 'Sales'" class="space-y-1.5">
            <label class="label-tiny">DSR (Delivery)</label>
            <AutoCompleteWithCreate
              v-model="form.dsr_id"
              :options="staffStore.dsrs.map(d => ({ id: d.id, name: d.name }))"
              placeholder="Select DSR..."
            />
          </div>

          <div class="space-y-1.5">
            <label class="label-tiny">Transaction Date</label>
            <SmartDateInput v-model="form.date" />
          </div>

          <!-- NO MORE HEADER MULTI-COMPANY FILTER -->
        </div>
      </section>

      <!-- ITEMS GRID -->
      <section class="bg-card-bg rounded-3xl border border-border shadow-sm overflow-visible relative">
        <div class="px-6 py-4 border-b border-border flex items-center justify-between bg-slate-50 rounded-t-3xl">
          <div class="flex items-center gap-3">
             <div class="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-sm">🏢</div>
             <h2 class="text-xs font-black uppercase tracking-widest text-text-primary">Invoice Dealings</h2>
          </div>
          
          <div class="relative w-72">
             <AutoCompleteWithCreate
                ref="companyFilterAc"
                v-model="tempCompanyFilter"
                :options="uniqueBrands.map(b => ({id: b, name: b}))"
                placeholder="+ Add New Company Section..."
                allow-free-text
                allow-create
                @create="v => { if (typeof v === 'string') handleAddCompanyGroup(v); else if (tempCompanyFilter) handleAddCompanyGroup(tempCompanyFilter); }"
                @select="opt => handleAddCompanyGroup(opt.name)"
             />
          </div>
        </div>

        <div class="overflow-x-auto min-h-[400px]">
          <template v-for="(group, gIdx) in form.groups" :key="gIdx">
            
            <!-- Group Header -->
            <div class="bg-brand/5 border-y border-brand/10 px-6 py-3 flex items-center justify-between">
               <h3 class="text-[11px] font-black uppercase text-brand tracking-widest flex items-center gap-2">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 2l10 6.5v7L12 22 2 15.5v-7L12 2z"/></svg>
                 Dealing Company: {{ group.company }}
               </h3>
               <div class="flex gap-2">
                 <button @click="removeGroup(gIdx)" type="button" class="px-3 py-1.5 rounded-lg bg-transparent border border-rose-500/20 text-rose-500 text-[9px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                   Remove
                 </button>
                 <button @click="addLine(gIdx)" type="button" class="px-4 py-1.5 rounded-lg bg-white border border-brand/20 text-brand text-[9px] font-black uppercase tracking-widest hover:bg-brand hover:text-white transition-all shadow-sm">
                   + Add Item
                 </button>
               </div>
            </div>

            <table class="w-full min-w-[1200px] border-collapse mb-6">
              <thead class="bg-hover-bg/30 text-text-muted border-b border-border">
                <tr>
                  <th class="w-12 py-3 px-4 text-[9px] font-black uppercase tracking-widest text-center">#</th>
                  <th class="py-3 px-6 text-[9px] font-black uppercase tracking-widest text-left">Medicine / Product</th>
                  <th class="w-40 py-3 px-4 text-[9px] font-black uppercase tracking-widest text-left">Batch ID</th>
                  <th class="w-32 py-3 px-4 text-[9px] font-black uppercase tracking-widest text-center">Expiry</th>
                  <th class="w-32 py-3 px-4 text-[9px] font-black uppercase tracking-widest text-center">Quantity (B)</th>
                  <th class="w-32 py-3 px-4 text-[9px] font-black uppercase tracking-widest text-center">Unit Rate</th>
                  <th class="w-24 py-3 px-4 text-[9px] font-black uppercase tracking-widest text-center">Disc%</th>
                  <th class="w-40 py-3 px-6 text-[9px] font-black uppercase tracking-widest text-right">Net Total</th>
                  <th class="w-12"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(line, iIdx) in group.items" :key="iIdx" class="group border-b border-border/50 hover:bg-hover-bg/20 transition-colors">
                  <td class="py-3 px-4 text-center text-[10px] font-black text-text-muted opacity-30">{{ iIdx + 1 }}</td>
                  <td class="py-3 px-6">
                    <AutoCompleteWithCreate
                      v-model="line.item_id"
                      :options="inventoryStore.items.filter(i => group.company === 'General' || i.brand === group.company).map(i => ({ id: i.id || '', name: i.name || '', sub: i.brand }))"
                      placeholder="Search medicines..."
                      allow-create
                      @create="handleCreateItem(gIdx, iIdx, $event)"
                      @select="onItemSelect(gIdx, iIdx, $event)"
                    />
                  </td>
                  <td class="py-3 px-4">
                    <div class="relative">
                      <input 
                        v-model="line.batch_number" 
                        type="text" 
                        placeholder="BATCH-00x"
                        :id="`batch-input-${gIdx}-${iIdx}`"
                        @focus="activeBatchIdx = {gIdx, iIdx}"
                        class="w-full bg-transparent border-none text-[10px] font-black text-text-primary text-left uppercase outline-none focus:text-brand" 
                      />
                      <!-- Batch Popper -->
                      <div v-if="activeBatchIdx && activeBatchIdx.gIdx === gIdx && activeBatchIdx.iIdx === iIdx" class="fixed z-[100] bg-card-bg border border-border rounded-2xl shadow-2xl p-2 min-w-[220px]" :style="{ top: getBatchPopperPos(gIdx, iIdx).top + 'px', left: getBatchPopperPos(gIdx, iIdx).left + 'px' }">
                         <p class="px-3 py-2 text-[8px] font-black uppercase tracking-widest text-text-muted border-b border-border/50 mb-1">Available Batches</p>
                         <div v-if="getItemBatches(line.item_id || '').length === 0" class="p-4 text-[10px] text-text-muted italic text-center">No batches found</div>
                         <div v-for="b in getItemBatches(line.item_id || '')" :key="b.id" @click="onLineBatchChange(gIdx, iIdx, b.id)" class="p-3 rounded-xl hover:bg-hover-bg cursor-pointer transition-all border border-transparent hover:border-border">
                            <div class="flex justify-between items-center">
                               <span class="text-[11px] font-black text-text-primary uppercase">{{ b.batch_number }}</span>
                               <span class="text-[9px] font-bold text-brand bg-brand/5 px-2 py-0.5 rounded-lg">Stk: {{ b.quantity }}</span>
                            </div>
                            <p class="text-[8px] font-bold text-text-muted mt-1 uppercase tracking-tighter">Exp: {{ b.expiry_date || 'N/A' }}</p>
                         </div>
                      </div>
                    </div>
                  </td>
                  <td class="py-3 px-4 text-center">
                    <input v-model="line.expiry_date" type="text" placeholder="MM/YY" class="w-full bg-transparent border-none text-[11px] font-black text-rose-500 text-center outline-none" />
                  </td>
                  <td class="py-3 px-4">
                    <div class="flex flex-col items-center">
                      <input v-model="line.qtyInput" @input="parseQuantity(gIdx, iIdx)" type="text" class="w-24 bg-hover-bg/50 border border-border rounded-xl py-1.5 text-center text-xs font-black outline-none focus:ring-2 focus:ring-brand/10" placeholder="0+0"/>
                      <span v-if="line.bonus_quantity > 0" class="text-[8px] font-bold text-brand mt-1 uppercase">Bonus: {{ line.bonus_quantity }}</span>
                    </div>
                  </td>
                  <td class="py-3 px-4">
                    <input v-model.number="line.rate" type="number" class="w-full bg-transparent border-none text-center text-xs font-black outline-none" placeholder="0.00"/>
                  </td>
                  <td class="py-3 px-4">
                    <input v-model.number="line.discount_pct" type="number" class="w-16 mx-auto bg-transparent border-none text-center text-xs font-black text-rose-400 outline-none" placeholder="0"/>
                  </td>
                  <td class="py-3 px-6 text-right font-black tabular-nums text-sm text-text-primary">
                    {{ formatAmount(calculateLineNet(line)) }}
                  </td>
                  <td class="py-3 px-4">
                    <button @click="removeLine(gIdx, iIdx)" class="w-8 h-8 rounded-xl flex items-center justify-center text-text-muted hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
        </div>

        <!-- TOTALS AREA -->
        <div class="p-8 bg-hover-bg/20 flex flex-col md:flex-row justify-between gap-10 items-end">
           <div class="flex-1 w-full space-y-4">
              <div class="space-y-1.5">
                 <label class="label-tiny">Remarks / Instructions</label>
                 <textarea v-model="form.notes" rows="3" class="w-full bg-card-bg border border-border rounded-2xl p-4 text-xs font-medium text-text-primary outline-none focus:ring-2 focus:ring-brand/10 transition-all resize-none" placeholder="Enter any extra details..."></textarea>
              </div>
              <div class="grid grid-cols-2 gap-4">
                 <div class="space-y-1.5">
                    <label class="label-tiny">Ref # / ID</label>
                    <input v-model="form.frappe_reference" type="text" placeholder="External Ref" class="w-full bg-card-bg border border-border rounded-xl px-4 py-2 text-xs font-bold text-text-primary outline-none"/>
                 </div>
              </div>
           </div>

           <div class="w-full md:w-[400px] bg-slate-900 text-white rounded-3xl p-8 space-y-5 shadow-2xl relative overflow-hidden">
              <div class="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              
              <div class="space-y-3 relative z-10">
                 <div class="flex justify-between items-center opacity-50">
                    <span class="text-[10px] font-black uppercase tracking-widest">Gross Subtotal</span>
                    <span class="text-sm font-black tabular-nums">{{ formatAmount(totals.gross) }}</span>
                 </div>
                 <div class="flex justify-between items-center text-rose-400">
                    <span class="text-[10px] font-black uppercase tracking-widest">Disc. Savings</span>
                    <span class="text-sm font-black tabular-nums">-{{ formatAmount(totals.discount) }}</span>
                 </div>
                 <div v-if="totals.bonus > 0" class="flex justify-between items-center text-brand border-t border-white/5 pt-3">
                    <span class="text-[10px] font-black uppercase tracking-widest">Bonus Pack Units</span>
                    <span class="text-sm font-black tabular-nums">{{ totals.bonus }}</span>
                 </div>
              </div>

              <div class="pt-6 border-t border-white/10 border-dashed flex justify-between items-end relative z-10">
                 <div>
                    <p class="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Payable Total</p>
                    <p class="text-3xl font-black tabular-nums tracking-tighter"><span class="text-xs font-semibold text-white/30 mr-2 uppercase">PKR</span>{{ formatAmount(totals.grand) }}</p>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </div>

    <!-- MODALS -->
    <Teleport to="body">
       <!-- Party Modal -->
       <div v-if="showPartyModal" class="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
          <div class="bg-card-bg border border-border rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
             <div class="p-10">
                <header class="mb-8 flex justify-between items-start">
                   <div>
                      <h2 class="text-2xl font-black tracking-tighter text-text-primary">Create Distribution Party</h2>
                      <p class="text-[10px] font-black uppercase text-text-muted tracking-widest mt-1">Registering: {{ initialSearchTerm }}</p>
                   </div>
                   <button @click="showPartyModal = false" class="w-10 h-10 rounded-full bg-hover-bg flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">✕</button>
                </header>
                <PartyForm :initial-data="({ name: initialSearchTerm, type: type === 'Sales' ? 'Individual' : 'Company' } as any)" @submit="onPartySubmit" @cancel="showPartyModal = false"/>
             </div>
          </div>
       </div>

       <!-- Item Modal -->
       <div v-if="showItemModal" class="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
          <div class="bg-card-bg border border-border rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
             <div class="p-10">
                <header class="mb-8 flex justify-between items-start">
                   <div>
                      <h2 class="text-2xl font-black tracking-tighter text-text-primary">New Medicine SKU</h2>
                      <p class="text-[10px] font-black uppercase text-text-muted tracking-widest mt-1">Naming: {{ initialSearchTerm }}</p>
                   </div>
                   <button @click="showItemModal = false" class="w-10 h-10 rounded-full bg-hover-bg flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">✕</button>
                </header>
                <ItemForm :initial-data="({ name: initialSearchTerm } as any)" @submit="onItemSubmit" @cancel="showItemModal = false"/>
             </div>
          </div>
       </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { usePartyStore } from '../stores/parties';
import { useInventoryStore } from '../stores/inventory';
import { useBatchStore } from '../stores/batches';
import { useStaffStore } from '../stores/staff';
import SmartDateInput from './SmartDateInput.vue';
import AutoCompleteWithCreate from './AutoCompleteWithCreate.vue';
import PartyForm from './PartyForm.vue';
import ItemForm from './ItemForm.vue';

interface TransactionItem {
  item_id: string;
  qtyInput: string;
  quantity: number;
  bonus_quantity: number;
  batch_number: string;
  rate: number;
  discount_pct: number;
  expiry_date: string;
  batch_id?: string;
  total: number;
}

interface TransactionFormGroup {
  company: string;
  items: TransactionItem[];
}

interface TransactionForm {
  party_id: string;
  date: string;
  sales_manager: string;
  ssr_id: string;
  dsr_id: string;
  frappe_reference: string;
  notes: string;
  groups: TransactionFormGroup[];
}

const props = defineProps<{
  type: 'Sales' | 'Purchase';
  initialData?: any;
}>();

const emit = defineEmits(['submit', 'cancel']);

const partyStore = usePartyStore();
const inventoryStore = useInventoryStore();
const batchStore = useBatchStore();
const staffStore = useStaffStore();

const parties = computed(() => props.type === 'Sales' ? partyStore.customers : partyStore.suppliers);

// Multiple Company Filter Logic
// Multiple Company Filter Logic
const localCompanies = ref<string[]>([]); // To persist newly typed companies during this session

const uniqueBrands = computed(() => {
   // Suggest from item brands AND supplier names (which act as the distro's "Companies")
   const itemBrands = inventoryStore.items.map(i => i.brand);
   const supplierNames = partyStore.suppliers.map(s => s.name);
   
   return Array.from(
      new Set([...itemBrands, ...supplierNames, ...localCompanies.value].filter(Boolean))
   ).sort();
});

const tempCompanyFilter = ref('');
const companyFilterAc = ref<any>(null);

function handleAddCompanyGroup(val: string) {
   if (val && !localCompanies.value.includes(val)) {
       localCompanies.value.push(val);
   }
   if (val) {
       form.value.groups.push({ company: val, items: [{ item_id: '', qtyInput: '1', quantity: 1, bonus_quantity: 0, batch_number: '', expiry_date: '', rate: 0, discount_pct: 0, total: 0 }] });
   }
   // Small delay to ensure the event processes before clearing the input
   setTimeout(() => {
      tempCompanyFilter.value = '';
      if (companyFilterAc.value?.clear) {
         companyFilterAc.value.clear();
      }
   }, 50);
}

// Modals
const showPartyModal = ref(false);
const showItemModal = ref(false);
const initialSearchTerm = ref('');
const activeItemLineIdx = ref<{gIdx: number, iIdx: number} | null>(null);

const activeBatchIdx = ref<{gIdx: number, iIdx: number} | null>(null);

const form = ref<TransactionForm>({
  party_id: '',
  date: new Date().toISOString().split('T')[0],
  sales_manager: '',
  ssr_id: '',
  dsr_id: '',
  frappe_reference: '',
  notes: '',
  groups: [
    { company: 'General', items: [{ item_id: '', qtyInput: '1', quantity: 1, bonus_quantity: 0, batch_number: '', expiry_date: '', rate: 0, discount_pct: 0, total: 0 }] }
  ]
});

onMounted(async () => {
  if (props.initialData) {
    const data = props.initialData;
    const flatItems = data.items || [];
    
    // Auto-group flat items from DB into company groups by brand
    const grouped: Record<string, TransactionItem[]> = {};
    flatItems.forEach((i: any) => {
       const info = inventoryStore.items.find((x: any) => x.id === i.item_id);
       const brand = i.brand || info?.brand || 'General';
       if (!grouped[brand]) grouped[brand] = [];
       grouped[brand].push({
         ...i,
         qtyInput: i.bonus_quantity > 0 ? `${i.quantity}+${i.bonus_quantity}` : i.quantity.toString()
       });
    });
    
    form.value = {
      ...form.value,
      ...data,
      party_id: (props.type === 'Sales' ? data.customer_id : data.supplier_id) || '',
      groups: Object.keys(grouped).map(k => ({ company: k, items: grouped[k] }))
    };
    if (form.value.groups.length === 0) {
      form.value.groups = [{ company: 'General', items: [{ item_id: '', qtyInput: '1', quantity: 1, bonus_quantity: 0, batch_number: '', expiry_date: '', rate: 0, discount_pct: 0, total: 0 }] }];
    }
  }
  
  await Promise.all([
    partyStore.fetchParties(),
    inventoryStore.fetchItems(),
    batchStore.fetchBatches(),
    staffStore.fetchStaff()
  ]);

  document.addEventListener('click', closeDropdowns);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns);
});

function closeDropdowns(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (!target.closest('input[placeholder="BATCH-00x"]')) {
      activeBatchIdx.value = null;
  }
}

function handleCreateParty(q: string) {
  initialSearchTerm.value = q;
  showPartyModal.value = true;
}

function handleCreateItem(gIdx: number, iIdx: number, q: string) {
  activeItemLineIdx.value = {gIdx, iIdx};
  initialSearchTerm.value = q;
  showItemModal.value = true;
}

function onItemSelect(gIdx: number, iIdx: number, suggestion: any) {
    const line = form.value.groups[gIdx].items[iIdx];
    if (!line) return;
    const item = inventoryStore.items.find(i => i.id === suggestion.id);
    if (item) {
        line.rate = props.type === 'Sales' ? ((item as any).sales_rate || 0) : ((item as any).purchase_rate || 0);
        if (line.quantity === 0) {
           line.quantity = 1;
           line.qtyInput = '1';
        }
    }
}

async function onPartySubmit(payload: any) {
    const id = await partyStore.addParty(payload);
    form.value.party_id = id as any;
    showPartyModal.value = false;
}

async function onItemSubmit(payload: any) {
    const id = await inventoryStore.addItem(payload);
    if (activeItemLineIdx.value !== null) {
        const {gIdx, iIdx} = activeItemLineIdx.value;
        if (form.value.groups[gIdx] && form.value.groups[gIdx].items[iIdx]) {
            (form.value.groups[gIdx].items[iIdx] as any).item_id = id as any;
            const item = inventoryStore.items.find(i => i.id === (id as any));
            if (item) {
                 (form.value.groups[gIdx].items[iIdx] as any).rate = props.type === 'Sales' ? ((item as any).sales_rate || 0) : ((item as any).purchase_rate || 0);
            }
        }
    }
    showItemModal.value = false;
}

function getItemBatches(itemId: string) {
  return batchStore.getBatchesForItem(itemId);
}

function onLineBatchChange(gIdx: number, iIdx: number, batchId: string) {
  const line = form.value.groups[gIdx]?.items[iIdx];
  const b = batchStore.batches.find(x => x.id === batchId);
  if (line && b) {
    line.batch_id = b.id;
    line.batch_number = b.batch_number;
    line.expiry_date = b.expiry_date || '';
  }
  activeBatchIdx.value = null;
}

function getBatchPopperPos(gIdx: number, iIdx: number) {
  const target = document.getElementById(`batch-input-${gIdx}-${iIdx}`);
  if (target) {
     const rect = target.getBoundingClientRect();
     return { top: rect.bottom + 5, left: rect.left };
  }
  return { top: 0, left: 0 };
}

function parseQuantity(gIdx: number, iIdx: number) {
  const line = form.value.groups[gIdx]?.items[iIdx];
  if (!line) return;
  const val = line.qtyInput || '';
  if (val.includes('+')) {
    const [q, b] = val.split('+');
    line.quantity = parseFloat(q) || 0;
    line.bonus_quantity = parseFloat(b) || 0;
  } else {
    line.quantity = parseFloat(val) || 0;
    line.bonus_quantity = 0;
  }
}

function calculateLineNet(line: TransactionItem) {
  const gross = (line.quantity || 0) * (line.rate || 0);
  const discount = gross * ((line.discount_pct || 0) / 100);
  const net = gross - discount;
  line.total = net;
  return net;
}

const totals = computed(() => {
  return form.value.groups.reduce((acc, g) => {
    g.items.forEach(l => {
      const gross = (l.quantity || 0) * (l.rate || 0);
      const disc = gross * ((l.discount_pct || 0) / 100);
      acc.gross += gross;
      acc.discount += disc;
      acc.bonus += (l.bonus_quantity || 0);
      acc.grand += (gross - disc);
    });
    return acc;
  }, { gross: 0, discount: 0, bonus: 0, grand: 0 });
});

const isFormValid = computed(() => {
  return !!form.value.party_id && form.value.groups.every(g => g.items.every(i => !!i.item_id && i.quantity > 0));
});

function addLine(gIdx: number) {
  form.value.groups[gIdx].items.push({ item_id: '', qtyInput: '1', quantity: 1, bonus_quantity: 0, batch_number: '', expiry_date: '', rate: 0, discount_pct: 0, total: 0 });
}

function removeLine(gIdx: number, iIdx: number) {
  const group = form.value.groups[gIdx];
  if (!group) return;
  if (group.items.length > 1) {
    group.items.splice(iIdx, 1);
  } else {
    // If last line of the group, and there are other groups, remove the group
    if (form.value.groups.length > 1) {
       form.value.groups.splice(gIdx, 1);
    }
  }
}

function removeGroup(gIdx: number) {
   if (form.value.groups.length > 1) {
      form.value.groups.splice(gIdx, 1);
   }
}

function handleSubmit() {
  const flatItems: any[] = [];
  form.value.groups.forEach(g => {
     g.items.forEach(i => {
        flatItems.push({...i, brand: g.company});
     });
  });

  const payload = {
    ...form.value,
    items: flatItems,
    total_amount: totals.value.grand,
    discount_amount: totals.value.discount,
    [props.type === 'Sales' ? 'customer_id' : 'supplier_id']: form.value.party_id
  };
  delete (payload as any).groups;
  emit('submit', payload);
}

function formatAmount(val: number) {
  return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
</script>

<style scoped>
@reference "../style.css";
.font-inter { font-family: 'Inter', sans-serif; }

.label-tiny {
  @apply block text-[10px] font-black uppercase tracking-[0.1em] text-text-muted opacity-60 mb-1;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
