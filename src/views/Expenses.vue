<template>
  <div class="page-container">
    <!-- HEADER -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h1 class="text-heading">Expense Management</h1>
        <p class="text-subheading">Track and categorize your business operational costs.</p>
      </div>
 
      <div class="flex items-center gap-3">
        <button @click="showCategoryModal = true" class="btn-ghost border border-border">
          Categories
        </button>
        <button @click="showExpenseModal = true" class="btn-dark">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12h14"/></svg>
          Record Expense
        </button>
      </div>
    </div>

    <!-- DASHBOARD STATS -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
       <div class="bg-card-bg border border-border p-6 rounded-2xl shadow-sm">
          <p class="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Total This Month</p>
          <div class="flex items-end gap-3">
            <h2 class="text-3xl font-black text-text-primary tracking-tighter">{{ formatCurrency(totalThisMonth) }}</h2>
            <span class="text-[10px] font-bold text-rose-500 mb-1.5">{{ expenseCountThisMonth }} Entries</span>
          </div>
       </div>
       <div class="bg-card-bg border border-border p-6 rounded-2xl shadow-sm">
          <p class="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Top Category</p>
          <h2 class="text-xl font-black text-text-primary tracking-tight">{{ topCategory || '---' }}</h2>
          <p class="text-[10px] font-bold text-text-secondary mt-1">Highest spending area</p>
       </div>
       <div class="bg-card-bg border border-border p-6 rounded-2xl shadow-sm border-l-4 border-l-brand">
          <p class="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Cash Impact</p>
          <h2 class="text-xl font-black text-brand tracking-tight">-{{ formatCurrency(totalThisMonth) }}</h2>
          <p class="text-[10px] font-bold text-text-secondary mt-1">Deducted from general ledger</p>
       </div>
    </div>

    <!-- EXPENSE TABLE -->
    <div class="card-std overflow-hidden">
      <div class="p-4 border-b border-border bg-hover-bg/30 flex justify-between items-center">
         <h3 class="text-label-small">Transaction History</h3>
         <div class="flex gap-2">
            <input v-model="filterDate" type="month" class="input-std py-1 text-[10px] w-32"/>
         </div>
      </div>
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-hover-bg/20 border-b border-border">
            <th class="px-4 py-3 text-left text-[9px] font-black uppercase tracking-widest text-text-muted">Date</th>
            <th class="px-4 py-3 text-left text-[9px] font-black uppercase tracking-widest text-text-muted">Category</th>
            <th class="px-4 py-3 text-left text-[9px] font-black uppercase tracking-widest text-text-muted">Merchant / Payee</th>
            <th class="px-4 py-3 text-left text-[9px] font-black uppercase tracking-widest text-text-muted">Description</th>
            <th class="px-4 py-3 text-left text-[9px] font-black uppercase tracking-widest text-text-muted">Method</th>
            <th class="px-4 py-3 text-right text-[9px] font-black uppercase tracking-widest text-text-muted">Amount</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border/50">
          <tr v-for="expense in filteredExpenses" :key="expense.id" class="hover:bg-hover-bg/10 transition-colors border-b border-border/30 last:border-0 text-xs">
            <td class="px-4 py-3 font-mono font-bold text-text-muted">{{ expense.date }}</td>
            <td class="px-4 py-3">
               <span class="px-2 py-0.5 rounded bg-brand/5 text-brand text-[9px] font-black uppercase tracking-widest border border-brand/10">
                 {{ expense.category_name }}
               </span>
            </td>
            <td class="px-4 py-3 font-black text-text-primary">{{ expense.merchant || '---' }}</td>
            <td class="px-4 py-3 text-text-secondary truncate max-w-[150px]">{{ expense.notes || '---' }}</td>
            <td class="px-4 py-3">
              <span class="px-2 py-0.5 rounded bg-hover-bg text-text-muted text-[9px] font-black uppercase tracking-widest">
                {{ expense.payment_method || 'Cash' }}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <span class="font-black text-rose-500 tabular-nums">{{ formatCurrency(expense.amount) }}</span>
            </td>
          </tr>
          <tr v-if="filteredExpenses.length === 0">
            <td colspan="4" class="py-20 text-center">
               <div class="w-16 h-16 bg-hover-bg rounded-2xl mx-auto flex items-center justify-center opacity-20 text-2xl">💸</div>
               <p class="text-xs font-bold text-text-muted uppercase tracking-widest mt-4">No expenses recorded for this period.</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- NEW EXPENSE MODAL -->
    <Teleport to="body">
      <div v-if="showExpenseModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-app-bg/60 backdrop-blur-md animate-in fade-in duration-200">
        <div class="bg-card-bg border border-border rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
          <div class="p-8">
            <header class="flex justify-between items-start mb-8">
               <div>
                  <h2 class="text-2xl font-black text-text-primary tracking-tighter uppercase">Record Expense</h2>
                  <p class="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Operating Expenditure</p>
               </div>
               <button @click="showExpenseModal = false" class="text-text-muted hover:text-text-primary transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
               </button>
            </header>

            <form @submit.prevent="saveExpense" class="space-y-6">
                <div class="grid grid-cols-2 gap-4">
                   <div class="space-y-2">
                      <label class="text-label-small ml-1">Date</label>
                      <input v-model="newExpense.date" type="date" required class="input-std"/>
                   </div>
                   <div class="space-y-2">
                      <label class="text-label-small ml-1">Amount</label>
                      <input v-model.number="newExpense.amount" type="number" step="0.01" required placeholder="0.00" class="input-std font-black"/>
                   </div>
                </div>
 
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                     <label class="text-label-small ml-1">Category</label>
                     <AutoCompleteWithCreate
                        v-model="newExpense.category_id"
                        :options="expenseStore.categories.map(c => ({ id: c.id, name: c.name }))"
                        placeholder="Select Category"
                        allow-create
                        create-label="Add New Category"
                        @create="async (name) => { newExpense.category_id = await expenseStore.addCategory(name); }"
                     />
                  </div>
                  <div class="space-y-2">
                     <label class="text-label-small ml-1">Payment Method</label>
                     <AutoCompleteWithCreate
                        v-model="newExpense.payment_method"
                        :options="[{id:'Cash',name:'Cash'},{id:'Bank Transfer',name:'Bank Transfer'},{id:'Check',name:'Check'},{id:'Card',name:'Card'}]"
                        placeholder="Select Method"
                        allow-free-text
                     />
                  </div>
                </div>
 
                <div class="space-y-2">
                   <label class="text-label-small ml-1">Merchant / Payee</label>
                   <AutoCompleteWithCreate
                      v-model="newExpense.merchant"
                      :options="uniqueMerchants"
                      placeholder="e.g. Shell Petrol, K-Electric"
                      allow-free-text
                   />
                </div>

                <div class="space-y-2">
                   <label class="text-label-small ml-1">Note / Narrative</label>
                   <textarea v-model="newExpense.notes" rows="2" placeholder="Describe the expenditure..." class="input-std resize-none"></textarea>
                </div>
 
                <button type="submit" class="btn-dark w-full py-4 text-sm mt-4">
                   Confirm Expenditure
                </button>
            </form>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- CATEGORY MODAL -->
    <Teleport to="body">
      <div v-if="showCategoryModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-app-bg/60 backdrop-blur-md animate-in fade-in duration-200">
        <div class="bg-card-bg border border-border rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
          <div class="p-8">
            <header class="flex justify-between items-start mb-6">
               <h2 class="text-xl font-black text-text-primary tracking-tight uppercase">Expense Categories</h2>
               <button @click="showCategoryModal = false" class="text-text-muted hover:text-text-primary transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
               </button>
            </header>

            <div class="space-y-4 max-h-64 overflow-y-auto custom-scrollbar pr-2 mb-6">
               <div v-for="cat in expenseStore.categories" :key="cat.id" class="flex justify-between items-center p-3 rounded-xl bg-hover-bg/50 border border-border font-bold text-xs">
                  {{ cat.name }}
                  <span class="text-[10px] text-text-muted opacity-40">SYSTEM</span>
               </div>
            </div>

            <div class="pt-6 border-t border-border">
               <label class="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1 block mb-2">Add New Category</label>
               <div class="flex gap-2">
                  <input v-model="newCategoryName" type="text" placeholder="e.g. Rent, Salaries" class="flex-1 bg-hover-bg/50 border border-border rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-brand/20 transition-all"/>
                  <button @click="addCategory" :disabled="!newCategoryName" class="px-4 py-2.5 bg-text-primary text-card-bg rounded-xl font-black text-[10px] uppercase tracking-widest disabled:opacity-30">
                    Add
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useExpenseStore } from '../stores/expenses';
import { useCompanyStore } from '../stores/company';
import AutoCompleteWithCreate from '../components/AutoCompleteWithCreate.vue';

const expenseStore = useExpenseStore();
const companyStore = useCompanyStore();

const showExpenseModal = ref(false);
const showCategoryModal = ref(false);
const filterDate = ref(new Date().toISOString().slice(0, 7)); // YYYY-MM
const newCategoryName = ref('');

const newExpense = ref({
  date: new Date().toISOString().split('T')[0],
  category_id: '',
  amount: 0,
  notes: '',
  merchant: '',
  payment_method: 'Cash'
});

onMounted(() => {
  expenseStore.fetchCategories();
  expenseStore.fetchExpenses();
});

const uniqueMerchants = computed(() => {
    return Array.from(new Set(expenseStore.expenses.map(e => e.merchant).filter(Boolean))).map(m => ({ id: m as string, name: m as string }));
});

const filteredExpenses = computed(() => {
  if (!filterDate.value) return expenseStore.expenses;
  return expenseStore.expenses.filter(e => e.date.startsWith(filterDate.value));
});

const totalThisMonth = computed(() => {
  return filteredExpenses.value.reduce((sum, e) => sum + e.amount, 0);
});

const expenseCountThisMonth = computed(() => filteredExpenses.value.length);

const topCategory = computed(() => {
  if (filteredExpenses.value.length === 0) return null;
  const categories: Record<string, number> = {};
  filteredExpenses.value.forEach(e => {
    const name = e.category_name || 'Uncategorized';
    categories[name] = (categories[name] || 0) + e.amount;
  });
  const entries = Object.entries(categories);
  if (entries.length === 0) return null;
  return entries.sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';
});

async function saveExpense() {
  if (!newExpense.value.category_id || !newExpense.value.amount || !newExpense.value.date) return;
  
  await expenseStore.addExpense({ 
    date: newExpense.value.date as string,
    category_id: newExpense.value.category_id,
    amount: newExpense.value.amount,
    notes: newExpense.value.notes
  });
  
  showExpenseModal.value = false;
  newExpense.value = {
    date: new Date().toISOString().split('T')[0],
    category_id: '',
    amount: 0,
    notes: '',
    merchant: '',
    payment_method: 'Cash'
  };
}

async function addCategory() {
  if (!newCategoryName.value) return;
  await expenseStore.addCategory(newCategoryName.value);
  newCategoryName.value = '';
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: companyStore.company?.currency || 'PKR'
  }).format(val || 0);
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
.font-inter { font-family: 'Inter', sans-serif; }

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 10px;
}

.animate-in {
  animation: animate-in 0.2s cubic-bezier(0, 0, 0.2, 1);
}
@keyframes animate-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
