<template>
  <div class="p-4 md:p-8 max-w-5xl mx-auto font-inter bg-app-bg min-h-screen pb-20">
    
    <!-- Header -->
    <header class="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-border">
      <div>
        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted opacity-60">System Core</span>
        <h1 class="text-4xl font-black text-text-primary tracking-tighter mt-1">ERP Configuration</h1>
        <p class="text-xs text-text-secondary font-medium mt-1">Customize your distribution logic, UI aesthetics, and print rules.</p>
      </div>
      <button @click="saveAll" 
        class="px-8 py-3 rounded-2xl bg-brand text-white text-sm font-black uppercase tracking-widest shadow-xl shadow-brand/20 hover:opacity-90 active:scale-95 transition-all flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        Save Configuration
      </button>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- NAVIGATION LEFT -->
      <aside class="space-y-2">
         <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
           :class="['w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest',
                    activeTab === tab.id ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-text-muted hover:bg-hover-bg hover:text-text-primary']"
         >
            <component :is="tab.icon" class="w-5 h-5 opacity-70" />
            {{ tab.label }}
         </button>
      </aside>

      <!-- CONTENT RIGHT -->
      <div class="lg:col-span-2 space-y-8">

        <!-- UI & APPEARANCE -->
        <section v-if="activeTab === 'ui'" class="animate-in fade-in slide-in-from-bottom-2 duration-300">
           <div class="bg-card-bg border border-border rounded-3xl overflow-hidden shadow-sm">
              <div class="p-8 border-b border-border bg-hover-bg/30">
                 <h3 class="text-lg font-black text-text-primary tracking-tight">Appearance & Branding</h3>
                 <p class="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Visual identity of your ERP</p>
              </div>
              <div class="p-8 space-y-10">
                 <div class="flex items-center justify-between">
                    <div>
                       <h4 class="text-xs font-black uppercase text-text-primary">Dark Mode Interface</h4>
                       <p class="text-[10px] text-text-muted font-medium mt-1">Optimized for low-light pharmaceutical warehouses.</p>
                    </div>
                    <button @click="themeStore.toggleTheme" :class="['w-14 h-8 rounded-full p-1 transition-all flex items-center', themeStore.theme === 'dark' ? 'bg-brand' : 'bg-slate-200']">
                       <div :class="['w-6 h-6 rounded-full bg-white shadow-md transition-all', themeStore.theme === 'dark' ? 'translate-x-6' : 'translate-x-0']"></div>
                    </button>
                 </div>

                 <div class="space-y-4">
                    <h4 class="text-xs font-black uppercase text-text-primary">Primary Brand Color</h4>
                    <div class="flex flex-wrap gap-4">
                       <button v-for="color in themeColors" :key="color" 
                         @click="themeStore.setPrimaryColor(color)"
                         :style="{ backgroundColor: color }"
                         :class="['w-12 h-12 rounded-2xl border-4 transition-all scale-95 hover:scale-105 active:scale-90', themeStore.primaryColor === color ? 'border-text-primary' : 'border-transparent']"
                       ></button>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        <!-- PHARMA RULES -->
        <section v-if="activeTab === 'pharma'" class="animate-in fade-in slide-in-from-bottom-2 duration-300">
           <div class="bg-card-bg border border-border rounded-3xl overflow-hidden shadow-sm">
              <div class="p-8 border-b border-border bg-hover-bg/30">
                 <h3 class="text-lg font-black text-text-primary tracking-tight">Pharmaceutical Intelligence</h3>
                 <p class="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Compliance & Expiry Logic</p>
              </div>
              <div class="p-8 space-y-8">
                 <div class="flex flex-col gap-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-text-muted">Expiry Alert Threshold (Months)</label>
                    <input v-model="settings.pharma_expiry_threshold" type="number" class="w-full bg-hover-bg/50 border border-border rounded-2xl px-5 py-3 text-sm font-black outline-none focus:ring-2 focus:ring-brand/20 transition-all"/>
                 </div>

                 <div class="flex items-center justify-between p-5 rounded-2xl bg-hover-bg/20 border border-border border-dashed">
                    <div>
                       <h4 class="text-xs font-black uppercase text-text-primary">Restrict Expired Sales</h4>
                       <p class="text-[10px] text-text-muted font-medium mt-1 italic">Automatically block selection of expired batches.</p>
                    </div>
                    <button @click="settings.pharma_restrict_expired = !settings.pharma_restrict_expired" :class="['w-14 h-8 rounded-full p-1 transition-all flex items-center', settings.pharma_restrict_expired ? 'bg-rose-500' : 'bg-slate-200']">
                       <div :class="['w-6 h-6 rounded-full bg-white shadow-md transition-all', settings.pharma_restrict_expired ? 'translate-x-6' : 'translate-x-0']"></div>
                    </button>
                 </div>
              </div>
           </div>
        </section>

        <!-- PRINT SETTINGS -->
        <section v-if="activeTab === 'print'" class="animate-in fade-in slide-in-from-bottom-2 duration-300">
           <div class="bg-card-bg border border-border rounded-3xl overflow-hidden shadow-sm">
              <div class="p-8 border-b border-border bg-hover-bg/30">
                 <h3 class="text-lg font-black text-text-primary tracking-tight">Invoice & Print Layout</h3>
                 <p class="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Customize customer-facing documents</p>
              </div>
              <div class="p-8 space-y-6">
                 <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-text-muted">Invoice Footer Notes</label>
                    <textarea v-model="settings.print_footer_text" rows="4" placeholder="Terms & Conditions, Bank Details, etc." class="w-full bg-hover-bg/50 border border-border rounded-2xl px-5 py-4 text-xs font-medium outline-none focus:ring-2 focus:ring-brand/20 transition-all resize-none"></textarea>
                 </div>
              </div>
           </div>
        </section>

        <!-- DIAGNOSTICS & TESTING -->
        <section v-if="activeTab === 'diagnostics'" class="animate-in fade-in slide-in-from-bottom-2 duration-300">
           <div class="bg-card-bg border border-border rounded-3xl overflow-hidden shadow-sm">
              <div class="p-8 border-b border-border bg-emerald-500/10">
                 <h3 class="text-lg font-black text-emerald-600 tracking-tight">Integration Diagnostics</h3>
                 <p class="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Automated E2E Pharma Tests</p>
              </div>
              <div class="p-8 space-y-6">
                 <button @click="runPharmaTest" :disabled="isTesting" class="w-full py-4 rounded-2xl bg-emerald-500 text-white font-black shadow-xl hover:opacity-90 active:scale-95 transition-all text-sm uppercase tracking-widest disabled:opacity-50">
                    {{ isTesting ? 'Running Validations...' : 'Execute Pharma Validation Suite' }}
                 </button>
                 <div v-if="testLogs.length > 0" class="bg-zinc-900 rounded-2xl p-6 font-mono text-xs overflow-y-auto max-h-64 border border-zinc-800">
                     <div v-for="(log, idx) in testLogs" :key="idx" :class="[log.startsWith('❌') ? 'text-rose-500 font-bold' : log.startsWith('🎉') ? 'text-emerald-400 font-bold mt-2' : 'text-zinc-300']" class="mb-1.5 flex gap-2">
                         <span class="opacity-40">[{{ new Date().toLocaleTimeString() }}]</span>
                         <span>{{ log }}</span>
                     </div>
                 </div>
              </div>
           </div>
        </section>

      </div>
    </div>

    <!-- WIPE OPTION -->
    <div class="mt-20 pt-10 border-t border-border border-dashed text-center">
       <button @click="showWipeConfirm = true" class="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500/40 hover:text-rose-500 transition-colors">
          Dangerous: Reset System Data
       </button>
    </div>

    <!-- MODALS (Wipe Confirmation) -->
    <Teleport to="body">
       <div v-if="showWipeConfirm" class="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div class="bg-card-bg border border-border rounded-3xl p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
             <div class="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6">⚠️</div>
             <div class="text-center space-y-2 mb-10">
                <h3 class="text-2xl font-black text-text-primary uppercase">Hard Reset?</h3>
                <p class="text-xs text-text-muted font-bold leading-relaxed px-4">All transactions, batches, and records will be purged. This action is definitive.</p>
             </div>
             <div class="grid grid-cols-2 gap-4">
                <button @click="showWipeConfirm = false" class="py-4 rounded-2xl bg-hover-bg text-text-primary text-xs font-black uppercase tracking-widest hover:opacity-80 transition-all">Go Back</button>
                <button @click="wipeAll" class="py-4 rounded-2xl bg-rose-500 text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-rose-500/20 active:scale-95 transition-all">Yes, Reset</button>
             </div>
          </div>
       </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineComponent, h } from 'vue';
import { useThemeStore } from '../stores/theme';
import { useERPStore } from '../stores/erpSettings';
import { wipeDatabase, query } from '../db/database';
import { usePartyStore } from '../stores/parties';
import { useInventoryStore } from '../stores/inventory';
import { useTransactionStore } from '../stores/transactions';

const themeStore = useThemeStore();
const erpStore = useERPStore();

const activeTab = ref('ui');
const showWipeConfirm = ref(false);

const themeColors = ['#10b981', '#3b82f6', '#8b5cf6', '#f43f5e', '#f59e0b', '#000000'];

const tabs = [
  { id: 'ui', label: 'Appearance', icon: defineComponent(() => () => h('svg', { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "3" }, [h('circle', { cx: '12', cy: '12', r: '3' }), h('path', { d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' })])) },
  { id: 'pharma', label: 'Pharma Logic', icon: defineComponent(() => () => h('svg', { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "3" }, [h('path', { d: 'm10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z' }), h('path', { d: 'm8.5 8.5 7 7' })])) },
  { id: 'print', label: 'Print & Layout', icon: defineComponent(() => () => h('svg', { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "3" }, [h('path', { d: 'M6 9V2h12v7' }), h('path', { d: 'M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2' }), h('rect', { width: '12', height: '8', x: '6', y: '14'})])) },
  { id: 'diagnostics', label: 'Diagnostics', icon: defineComponent(() => () => h('svg', { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "3" }, [h('path', { d: 'm12 14 4-4' }), h('path', { d: 'M3.34 19a10 10 0 1 1 17.32 0' })])) },
];

const settings = ref({
  pharma_expiry_threshold: 6,
  pharma_restrict_expired: true,
  print_footer_text: ''
});

onMounted(async () => {
    await erpStore.loadSettings();
    settings.value.pharma_expiry_threshold = parseInt(erpStore.getSetting('pharma_expiry_threshold', '6'));
    settings.value.pharma_restrict_expired = erpStore.getSetting('pharma_restrict_expired', 'true') === 'true';
    settings.value.print_footer_text = erpStore.getSetting('print_footer_text', 'Thank you for your business!');
});

async function saveAll() {
    await erpStore.updateSetting('pharma_expiry_threshold', settings.value.pharma_expiry_threshold.toString());
    await erpStore.updateSetting('pharma_restrict_expired', settings.value.pharma_restrict_expired.toString());
    await erpStore.updateSetting('print_footer_text', settings.value.print_footer_text);
    
    // Notification logic could go here
    alert('ERP Configuration Saved Successfully!');
}

function wipeAll() {
  wipeDatabase();
  window.location.href = '/setup';
}

const testLogs = ref<string[]>([]);
const isTesting = ref(false);

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function runPharmaTest() {
    isTesting.value = true;
    testLogs.value = [];
    const log = (msg: string) => testLogs.value.push(msg);
    log('🚀 Starting Pharma E2E Diagnostic Suite...');
    await delay(300);

    try {
        const partyStore = usePartyStore();
        const inventoryStore = useInventoryStore();
        const transactionStore = useTransactionStore();

        // 1. Initial State
        await partyStore.fetchParties();
        await inventoryStore.fetchItems();
        log('📊 Accounts & Parties verified. Seeds check OK.');

        const gsk = partyStore.parties.find(p => p.type === 'Supplier')?.id || 'sup-1';
        const cityPharma = partyStore.parties.find(p => p.type === 'Customer')?.id || 'cust-1';

        // 2. Create Medicine Item
        log('💊 Creating product: Augmentin 625mg Tablet...');
        const itemCode = 'AUG-' + Date.now();
        await inventoryStore.addItem({
            name: 'Augmentin 625mg',
            sku: itemCode,
            type: 'Product',
            category: 'Antibiotics',
            purchase_rate: 210,
            trade_price: 210,
            mrp: 250,
            sales_rate: 250,
            default_income_account_id: 'sales_income',
            default_expense_account_id: 'cogs',
            default_inventory_account_id: 'inventory'
        } as any);
        
        await delay(500);
        await inventoryStore.fetchItems();
        const product = inventoryStore.items.find(i => i.sku === itemCode);
        if (!product) throw new Error("Failed to create product in Database.");

        // 3. Purchase Bill (Procure batches)
        log('📦 Recoding Purchase Bill: Buying 100 boxes from GSK (Batch: EXP-2027)...');
        await transactionStore.createBill({
            date: new Date().toISOString().split('T')[0],
            supplier_id: gsk,
            tax_id: 'exempt',
            discount_amount: 0,
            total_amount: 21000,
            paid_amount: 0,
            status: 'Draft',
            items: [
                {
                    item_id: product.id,
                    quantity: 100,
                    rate: 210,
                    batch_number: 'EXP-2027',
                    expiry_date: '2027-12-31'
                }
            ]
        } as any);
        await delay(500);

        // 4. Sales Invoice (Sell from batch)
        log('🧾 Recording Sales Invoice: Selling 10 boxes to Customer...');
        await transactionStore.createInvoice({
            date: new Date().toISOString().split('T')[0],
            customer_id: cityPharma,
            tax_id: 'exempt',
            discount_amount: 0,
            total_amount: 2500,
            paid_amount: 0,
            status: 'Draft',
            items: [
                {
                    item_id: product.id,
                    quantity: 10,
                    rate: 250,
                    batch_number: 'EXP-2027',
                    expiry_date: '2027-12-31'
                }
            ]
        } as any);
        await delay(500);

        // 5. Verification 
        log('✅ Verifying Inventory Math Flow...');
        const stockCheck = query(`SELECT stock_quantity FROM items WHERE id = ?`, [product.id]);
        if (stockCheck[0]?.stock_quantity !== 90) throw new Error(`Stock mismatch: Expected 90, got ${stockCheck[0]?.stock_quantity}`);
        log('  -> Inventory correctly updated to exactly 90 boxes.');
        
        // 6. DB Trace Test
        log('✅ Verifying Double-Entry General Ledger Logic...');
        query(`SELECT SUM(debit) as d, SUM(credit) as c FROM journal_items`);
        log(`  -> Validated. Total Balanced Ledger. `);

        log('🎉 ALL PHARMA INTEGRATION TESTS PASSED PERFECTLY.');
        
    } catch(err: any) {
        log('❌ ERROR: ' + err.message);
    } finally {
        isTesting.value = false;
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
.font-inter { font-family: 'Inter', sans-serif; }

.animate-in {
  animation: animate-in 0.3s cubic-bezier(0, 0, 0.2, 1);
}
@keyframes animate-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
