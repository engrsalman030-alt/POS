<template>
  <div class="transaction-form min-h-screen bg-slate-50 text-slate-800 font-inter pb-20">
    <!-- STICKY HEADER -->
    <header class="sticky top-0 z-[60] bg-white border-b border-slate-200 px-4 md:px-6 py-2.5 md:py-3 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
      <div class="flex items-center gap-3 w-full md:w-auto">
        <h1 class="text-base md:text-lg font-black tracking-tight text-slate-900 leading-none">
          New {{ type === 'Sales' ? 'Sale Invoice' : 'Purchase Bill' }}
        </h1>
      </div>
      <div class="flex items-center gap-2 w-full md:w-auto">
        <button @click="$emit('cancel')" class="flex-1 md:flex-none px-4 py-2 rounded-xl border border-slate-200 text-[11px] md:text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
          Back
        </button>
        <button @click="handleSubmit" :disabled="!isFormValid" class="flex-[2] md:flex-none px-5 md:px-6 py-2 rounded-xl bg-emerald-600 text-white text-[11px] md:text-xs font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 group">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="group-hover:scale-110 transition-transform"><path d="M20 6 9 17l-5-5"/></svg>
          Submit
        </button>
      </div>
    </header>

    <div class="max-w-[1300px] mx-auto px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6">
      
      <!-- SECTION 1: HEADER DETAILS -->
      <section class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
          </div>
          <h2 class="text-xs font-black uppercase tracking-widest text-slate-500">{{ type === 'Sales' ? 'Sale' : 'Purchase' }} Overview</h2>
        </div>
        
        <div class="p-5 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          <div class="space-y-1.5">
            <label class="block text-[9px] font-black uppercase tracking-widest text-slate-400">Invoice #</label>
            <input type="text" disabled value="Auto-generated" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-400 outline-none cursor-not-allowed italic" />
          </div>
          <div class="space-y-1.5">
            <label class="block text-[9px] font-black uppercase tracking-widest text-slate-400">{{ type === 'Sales' ? 'Customer' : 'Supplier' }}</label>
            <div class="relative">
              <select v-model="form.party_id" required class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer">
                <option value="">— Select Party —</option>
                <option v-for="p in parties" :key="p.id" :value="p.id">{{ p.name }}</option>
              </select>
              <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>
          <div class="space-y-1.5">
            <label class="block text-[9px] font-black uppercase tracking-widest text-slate-400">Date</label>
            <input v-model="form.date" type="date" required class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
          </div>
          <div class="space-y-1.5">
            <label class="block text-[9px] font-black uppercase tracking-widest text-slate-400">{{ type === 'Sales' ? 'Sales Manager' : 'Purchaser' }}</label>
            <input v-model="form.sales_manager" type="text" placeholder="e.g. Farman / General" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
          </div>
        </div>
      </section>

      <!-- SECTION 2: ITEMS -->
      <section class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-visible relative">
        <div class="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3">
          <div class="flex items-center gap-3">
             <div class="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 text-xs">💊</div>
             <h2 class="text-xs font-black uppercase tracking-widest text-slate-500">Medicine List</h2>
          </div>
          <div class="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
            <p class="hidden sm:block text-[9px] font-bold text-slate-400 uppercase tracking-tighter whitespace-nowrap">Tip: Use <span class="text-emerald-600 font-black">10+5</span> for bonus</p>
            <button @click="addLine" type="button" class="flex-1 md:flex-none px-5 py-2 rounded-xl bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              Add Item
            </button>
          </div>
        </div>

        <div class="p-0 overflow-x-auto overflow-y-visible">
          <!-- Desktop Table (Visible >= LG) -->
          <table class="hidden lg:table w-full border-collapse min-w-[1200px]">
            <thead class="bg-slate-900 text-white border-b border-slate-800">
              <tr>
                <th class="w-12 py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">#</th>
                <th class="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">Item Name</th>
                <th class="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">Batch</th>
                <th class="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-left tracking-tighter">Expiry</th>
                <th class="w-24 py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Qty</th>
                <th class="w-24 py-4 px-4 text-[10px] font-black uppercase tracking-widest text-emerald-400 text-center">Bonus</th>
                <th class="w-32 py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Rate</th>
                <th class="w-24 py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Disc%</th>
                <th class="w-32 py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Gross</th>
                <th class="w-40 py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Net Value</th>
                <th class="w-12"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(line, idx) in form.items" :key="idx" class="group border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td class="py-4 px-4 text-center text-[10px] font-black text-slate-300 group-hover:text-slate-500">{{ idx + 1 }}</td>
                <td class="py-4 px-6 relative">
                  <div class="relative">
                    <button @click="toggleDropdown(idx)" type="button" class="w-full text-left bg-transparent border-none outline-none text-[13px] font-bold text-slate-600 group-hover:text-slate-900 flex items-center justify-between min-w-[200px]">
                      <span v-if="!line.item_id">— click to select —</span>
                      <span v-else class="text-slate-900 uppercase">{{ getItemName(line.item_id || '') }}</span>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" :class="{'rotate-180': dropdowns[Number(idx)]}" class="transition-transform opacity-30 group-hover:opacity-100"><path d="m6 9 6 6 6-6"/></svg>
                    </button>
                    <!-- Dropdown Implementation (Remains Same Logic) -->
                    <div v-if="dropdowns[Number(idx)]" class="absolute top-full left-0 mt-2 w-[400px] bg-white border border-slate-200 rounded-2xl shadow-2xl z-[70] p-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                       <input v-model="itemSearch" type="text" placeholder="Search medicine..." class="w-full bg-slate-50 border border-slate-100 rounded-lg py-2 px-4 text-xs font-bold outline-none ring-offset-2 focus:ring-2 focus:ring-emerald-500/20" />
                       <div class="max-h-[300px] overflow-y-auto space-y-1 custom-scrollbar">
                         <div v-for="item in filteredInventory" :key="item.id" @click="selectItem(idx, item)" class="p-3 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-100 uppercase">
                            <p class="text-xs font-black text-slate-700">{{ item.name }}</p>
                            <p class="text-[8px] text-slate-400 font-bold mt-0.5 tracking-widest">{{ item.brand || 'No Brand' }}</p>
                         </div>
                       </div>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-4"><input v-model="line.batch_number" type="text" placeholder="B#" class="w-full bg-transparent border-none text-[10px] font-mono font-bold text-slate-600 text-center p-0 uppercase" /></td>
                <td class="py-4 px-4"><input v-model="line.expiry_date" type="text" placeholder="MM/YY" class="w-full bg-transparent border-none text-[10px] font-mono font-bold text-rose-500 text-center p-0" /></td>
                <td class="py-4 px-4"><input v-model="line.qtyInput" @input="parseQuantity(idx)" type="text" class="w-16 bg-slate-50 border border-slate-100 rounded-lg py-1 text-center text-xs font-black font-mono focus:ring-1 focus:ring-emerald-500/20" /></td>
                <td class="py-4 px-4"><input v-model.number="line.bonus_quantity" type="number" class="w-16 bg-transparent border-none text-center text-xs font-black text-emerald-600 font-mono p-0" /></td>
                <td class="py-4 px-4"><input v-model.number="line.rate" type="number" class="w-full bg-transparent border-none text-center text-xs font-black font-mono p-0" /></td>
                <td class="py-4 px-4"><input v-model.number="line.discount_pct" type="number" class="w-16 bg-transparent border-none text-center text-xs font-bold text-slate-500 font-mono p-0" /></td>
                <td class="py-4 px-4 text-right tabular-nums text-xs font-bold text-slate-400">{{ formatAmount(Number(line.quantity) * Number(line.rate)) }}</td>
                <td class="py-4 px-6 text-right tabular-nums text-sm font-black text-slate-900">{{ formatAmount(calculateLineNet(line)) }}</td>
                <td class="py-4 px-2">
                  <button @click="removeLine(idx)" type="button" class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Mobile Card Layout (Visible < LG) -->
          <div class="lg:hidden p-4 space-y-4 bg-slate-50/50">
            <div v-for="(line, idx) in form.items" :key="idx" class="bg-white rounded-3xl border border-slate-200 p-5 space-y-5 shadow-sm relative animate-in fade-in slide-in-from-bottom-2">
               <div class="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div class="flex gap-2 items-center">
                    <span class="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">{{ idx + 1 }}</span>
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inbound Item</span>
                  </div>
                  <button @click="removeLine(idx)" class="w-8 h-8 flex items-center justify-center bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-100 transition-all"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
               </div>
               
               <div class="space-y-4">
                 <div class="relative">
                   <label class="block text-[10px] font-black text-slate-500 uppercase mb-1.5 italic tracking-wider">Select Product</label>
                   <button @click="toggleDropdown(idx)" type="button" class="w-full text-left bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 flex justify-between items-center">
                     <span class="truncate">{{ line.item_id ? getItemName(line.item_id).toUpperCase() : '— Choose Medicine —' }}</span>
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m6 9 6 6 6-6"/></svg>
                   </button>
                   <div v-if="dropdowns[Number(idx)]" class="absolute top-full left-0 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl z-[70] p-4 flex flex-col gap-3">
                      <input v-model="itemSearch" type="text" placeholder="Search brands/names..." class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold outline-none" />
                      <div class="max-h-[250px] overflow-y-auto space-y-1 custom-scrollbar">
                        <div v-for="item in filteredInventory" :key="item.id" @click="selectItem(idx, item)" class="p-4 border-b border-slate-50 text-xs font-black hover:bg-slate-100 uppercase transition-colors">{{ item.name }}</div>
                      </div>
                   </div>
                 </div>

                 <div class="grid grid-cols-2 gap-4">
                   <div class="space-y-1.5">
                     <label class="block text-[10px] font-black text-slate-500 uppercase italic">Batch</label>
                     <input v-model="line.batch_number" type="text" placeholder="e.g. B-01" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono font-bold uppercase" />
                   </div>
                   <div class="space-y-1.5">
                     <label class="block text-[10px] font-black text-slate-500 uppercase italic">Expiry</label>
                     <input v-model="line.expiry_date" type="text" placeholder="MM/YY" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-rose-500" />
                   </div>
                 </div>

                 <div class="grid grid-cols-3 gap-4">
                   <div class="space-y-1.5">
                     <label class="block text-[10px] font-black text-slate-500 uppercase italic">Qty</label>
                     <input v-model="line.qtyInput" @input="parseQuantity(idx)" type="text" placeholder="0" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-center focus:ring-2 focus:ring-slate-900 border-none ring-1 ring-slate-200" />
                   </div>
                   <div class="space-y-1.5">
                     <label class="block text-[10px] font-black text-emerald-600 uppercase italic">Bonus</label>
                     <input v-model.number="line.bonus_quantity" type="number" placeholder="0" class="w-full bg-emerald-50/50 border border-emerald-100 rounded-xl px-4 py-3 text-sm font-black text-emerald-600 text-center" />
                   </div>
                   <div class="space-y-1.5">
                     <label class="block text-[10px] font-black text-slate-500 uppercase italic">Rate</label>
                     <input v-model.number="line.rate" type="number" placeholder="0" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-center" />
                   </div>
                 </div>

                 <div class="flex justify-between items-center pt-4 border-t border-slate-100">
                    <div>
                      <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Item Total</p>
                      <p class="text-base font-black text-slate-900 tabular-nums">PKR {{ formatAmount(calculateLineNet(line)) }}</p>
                    </div>
                    <div class="text-right">
                       <p class="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-0.5">Subtotal Unites</p>
                       <p class="text-xs font-black text-emerald-600">{{ Number(line.quantity) + Number(line.bonus_quantity) }}</p>
                    </div>
                 </div>
               </div>
            </div>
            <!-- Add Button for Mobile -->
            <button @click="addLine" class="w-full py-5 rounded-3xl border-2 border-dashed border-slate-300 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 hover:text-slate-600 transition-all active:scale-[0.98] mt-4 shadow-sm bg-white">
               + Add Another Entry
            </button>
          </div>
        </div>

        <!-- Footer Area -->
        <div class="px-6 py-6 md:py-8 flex flex-col lg:flex-row gap-6 md:gap-8 border-t border-slate-100">
          <div class="flex-1 space-y-4">
            <div class="space-y-1.5">
              <label class="block text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Notes</label>
              <textarea v-model="form.notes" rows="2" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-slate-900/5 transition-all resize-none placeholder:italic" placeholder="Extra details..."></textarea>
            </div>
            <div class="space-y-1.5">
              <label class="block text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Reference #</label>
              <input v-model="form.frappe_reference" type="text" placeholder="Bill ID / Ref..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-slate-900/5" />
            </div>
          </div>

          <!-- Summary Box -->
          <div class="w-full lg:w-[400px] bg-slate-900 rounded-3xl p-6 md:p-7 space-y-5 shadow-2xl relative overflow-hidden text-white animate-in zoom-in-95">
            <div class="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12"></div>
            
            <div class="space-y-3 relative z-10">
              <div class="flex justify-between items-center opacity-50">
                <span class="text-[9px] font-black uppercase tracking-widest">Gross Inventory</span>
                <span class="text-xs font-black tabular-nums">{{ formatRawCurrency(Number(totals.gross)) }}</span>
              </div>
              <div class="flex justify-between items-center text-rose-400">
                <span class="text-[9px] font-black uppercase tracking-widest">Discounts</span>
                <span class="text-xs font-black tabular-nums">-{{ formatRawCurrency(Number(totals.discount)) }}</span>
              </div>
              <div v-if="totals.bonus > 0" class="flex justify-between items-center text-emerald-400 pt-2 border-t border-white/5">
                <span class="text-[9px] font-black uppercase tracking-widest">Free Items</span>
                <span class="text-xs font-black tabular-nums">+{{ totals.bonus }} Units</span>
              </div>
            </div>

            <div class="pt-5 border-t border-white/10 border-dashed flex justify-between items-end relative z-10">
              <span class="text-sm md:text-base font-black uppercase tracking-widest">Net Payable</span>
              <div class="text-right">
                <p class="text-[8px] font-black text-white/30 uppercase tracking-widest mb-0.5 italic">Total Value</p>
                <p class="text-2xl md:text-3xl font-black tabular-nums tracking-tighter">
                  <span class="text-xs md:text-sm font-bold text-white/40 mr-1">PKR</span>{{ formatRawCurrency(Number(totals.grand)) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePartyStore } from '../stores/parties';
import { useInventoryStore } from '../stores/inventory';

interface TransactionItem {
  item_id: string;
  qtyInput: string;
  quantity: number;
  bonus_quantity: number;
  batch_number: string;
  rate: number;
  discount_pct: number;
  expiry_date: string;
  total: number;
}

interface TransactionForm {
  party_id: string;
  date: string;
  sales_manager: string;
  frappe_reference: string;
  notes: string;
  items: TransactionItem[];
}

const props = defineProps<{
  type: 'Sales' | 'Purchase';
  initialData?: any;
}>();

const emit = defineEmits(['submit', 'cancel']);

const partyStore = usePartyStore();
const inventoryStore = useInventoryStore();

const parties = computed(() => props.type === 'Sales' ? partyStore.customers : partyStore.suppliers);
const itemSearch = ref('');
const dropdowns = ref<Record<number, boolean>>({});

const form = ref<TransactionForm>({
  party_id: '',
  date: new Date().toISOString().split('T')[0] || '',
  sales_manager: '',
  frappe_reference: '',
  notes: '',
  items: [
    { item_id: '', qtyInput: '0', quantity: 0, bonus_quantity: 0, batch_number: '', expiry_date: '', rate: 0, discount_pct: 0, total: 0 }
  ]
});

onMounted(() => {
  if (props.initialData) {
    const data = props.initialData;
    form.value = { 
      ...form.value, 
      ...data,
      party_id: (props.type === 'Sales' ? data.customer_id : data.supplier_id) || '',
      date: data.date || form.value.date,
      sales_manager: data.sales_manager || '',
      frappe_reference: data.frappe_reference || '',
      notes: data.notes || '',
      items: (data.items || []).map((i: any): TransactionItem => {
        const qty = Number(i.quantity) || 0;
        const bns = Number(i.bonus_quantity) || 0;
        return {
          item_id: i.item_id || '',
          qtyInput: bns > 0 ? `${qty}+${bns}` : qty.toString(),
          quantity: qty,
          bonus_quantity: bns,
          batch_number: i.batch_number || '',
          expiry_date: i.expiry_date || '',
          rate: Number(i.rate) || 0,
          discount_pct: Number(i.discount_pct) || 0,
          total: Number(i.total) || 0
        };
      })
    };
  }
  inventoryStore.fetchItems();
});

const filteredInventory = computed(() => {
  const items = inventoryStore.items || [];
  if (!itemSearch.value) return items;
  const q = itemSearch.value.toLowerCase();
  return items.filter(i => 
    i.name.toLowerCase().includes(q) || 
    (i.brand && i.brand.toLowerCase().includes(q)) || 
    (i.sku && i.sku.toLowerCase().includes(q))
  );
});

function toggleDropdown(idx: number) {
  const currentState = dropdowns.value[idx];
  dropdowns.value = {}; 
  dropdowns.value[idx] = !currentState;
  itemSearch.value = '';
}

function selectItem(idx: number, item: any) {
  const line = form.value.items[idx];
  if (!line) return;
  line.item_id = item.id || '';
  line.rate = props.type === 'Sales' ? (item.sales_rate || 0) : (item.purchase_rate || 0);
  line.batch_number = item.batch_number || '';
  line.expiry_date = item.expiry_date || '';
  dropdowns.value[idx] = false;
}

function parseQuantity(idx: number) {
  const line = form.value.items[idx];
  if (!line) return;
  const input = line.qtyInput || '';
  
  if (input.includes('+')) {
    const parts = input.split('+');
    const q = parseFloat(parts[0]) || 0;
    const b = parseFloat(parts[1]) || 0;
    line.quantity = q;
    line.bonus_quantity = b;
  } else {
    line.quantity = parseFloat(input) || 0;
  }
}

function addLine() {
  form.value.items.push({ item_id: '', qtyInput: '0', quantity: 0, bonus_quantity: 0, batch_number: '', expiry_date: '', rate: 0, discount_pct: 0, total: 0 });
}

function removeLine(idx: number) {
  if (form.value.items.length > 1) {
    form.value.items.splice(idx, 1);
  }
}

function calculateLineNet(line: TransactionItem): number {
  const quantity = Number(line.quantity) || 0;
  const rate = Number(line.rate) || 0;
  const discount_pct = Number(line.discount_pct) || 0;
  
  const gross = quantity * rate;
  const disc = gross * (discount_pct / 100);
  const net = gross - disc;
  line.total = net;
  return net;
}

const totals = computed(() => {
  return form.value.items.reduce((acc, line) => {
    const quantity = Number(line.quantity) || 0;
    const rate = Number(line.rate) || 0;
    const discount_pct = Number(line.discount_pct) || 0;
    const bonus = Number(line.bonus_quantity) || 0;

    const gross = quantity * rate;
    const disc = gross * (discount_pct / 100);
    acc.gross += gross;
    acc.discount += disc;
    acc.bonus += bonus;
    acc.grand += (gross - disc);
    return acc;
  }, { gross: 0, discount: 0, bonus: 0, grand: 0 });
});

const isFormValid = computed(() => {
  return !!form.value.party_id && 
         !!form.value.date && 
         form.value.items.length > 0 && 
         form.value.items.every(i => !!i.item_id && i.quantity > 0);
});

function handleSubmit() {
  const payload = {
    ...form.value,
    total_amount: totals.value.grand,
    discount_amount: totals.value.discount,
    tax_amount: 0,
    [props.type === 'Sales' ? 'customer_id' : 'supplier_id']: form.value.party_id
  };
  emit('submit', payload);
}

function getItemName(id: string): string {
  if (!id) return '';
  return inventoryStore.items.find(i => i.id === id)?.name || '';
}

function formatRawCurrency(val: number) {
  return (val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatAmount(val: number) {
  return (val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

.transaction-form {
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.01em;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E2E8F0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #CBD5E0;
}

/* Remove Arrows from Number Inputs */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}

.animate-in {
  animation-duration: 200ms;
  animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  fill-mode: forwards;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-in-from-top-2 {
  from { transform: translateY(-0.5rem); }
  to { transform: translateY(0); }
}

.fade-in { animation-name: fade-in; }
.slide-in-from-top-2 { animation-name: slide-in-from-top-2; }
</style>
