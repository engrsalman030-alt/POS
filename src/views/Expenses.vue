<template>
  <div class="p-4 md:p-8 max-w-6xl mx-auto font-inter min-h-screen pb-20">
    
    <!-- HEADER -->
    <header class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-6">
      <div>
        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted opacity-60">Finance & Operations</span>
        <h1 class="text-4xl font-black text-text-primary tracking-tighter mt-1">Expense Management</h1>
        <p class="text-xs text-text-secondary font-medium mt-1">Track and categorize your business operational costs.</p>
      </div>

      <div class="flex items-center gap-3">
        <button @click="showCategoryModal = true" class="px-5 py-2.5 rounded-xl border border-border bg-card-bg text-text-primary font-bold text-xs uppercase tracking-widest hover:bg-hover-bg transition-all active:scale-95">
          Categories
        </button>
        <button @click="showExpenseModal = true" class="px-5 py-2.5 rounded-xl bg-brand text-white font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-brand/20 flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12h14"/></svg>
          Record Expense
        </button>
      </div>
    </header>

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
    <div class="bg-card-bg border border-border rounded-2xl overflow-hidden shadow-xl shadow-app-bg/50">
      <div class="p-6 border-b border-border bg-hover-bg/30 flex justify-between items-center">
         <h3 class="text-xs font-black uppercase tracking-widest text-text-primary">Transaction History</h3>
         <div class="flex gap-2">
            <input v-model="filterDate" type="month" class="bg-card-bg border border-border rounded-lg px-3 py-1.5 text-xs font-bold outline-none uppercase"/>
         </div>
      </div>
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-hover-bg/50 border-b border-border">
            <th class="px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-text-muted">Date</th>
            <th class="px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-text-muted">Category</th>
            <th class="px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-text-muted">Description / Notes</th>
            <th class="px-6 py-4 text-right text-[9px] font-black uppercase tracking-widest text-text-muted">Amount</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border/50">
          <tr v-for="expense in filteredExpenses" :key="expense.id" class="hover:bg-hover-bg/30 transition-colors">
            <td class="px-6 py-4 text-xs font-mono font-bold text-text-muted">{{ expense.date }}</td>
            <td class="px-6 py-4">
               <span class="px-2.5 py-1 rounded-lg bg-brand/5 text-brand text-[10px] font-black uppercase tracking-widest border border-brand/10">
                 {{ expense.category_name }}
               </span>
            </td>
            <td class="px-6 py-4 text-xs font-medium text-text-secondary">{{ expense.notes || '---' }}</td>
            <td class="px-6 py-4 text-right">
              <span class="text-sm font-black text-rose-500 tabular-nums">{{ formatCurrency(expense.amount) }}</span>
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
                     <label class="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Date</label>
                     <input v-model="newExpense.date" type="date" required class="w-full bg-hover-bg/50 border border-border rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-brand/20 transition-all"/>
                  </div>
                  <div class="space-y-2">
                     <label class="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Amount</label>
                     <input v-model.number="newExpense.amount" type="number" step="0.01" required placeholder="0.00" class="w-full bg-hover-bg/50 border border-border rounded-2xl px-4 py-3 text-sm font-black outline-none focus:ring-2 focus:ring-brand/20 transition-all"/>
                  </div>
               </div>

               <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Category</label>
                  <select v-model="newExpense.category_id" required class="w-full bg-hover-bg/50 border border-border rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-brand/20 transition-all appearance-none cursor-pointer">
                     <option value="" disabled>Select Category</option>
                     <option v-for="cat in expenseStore.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                  </select>
               </div>

               <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Description / Notes</label>
                  <textarea v-model="newExpense.notes" rows="3" placeholder="e.g. Electricity bill for March 2024" class="w-full bg-hover-bg/50 border border-border rounded-2xl px-4 py-3 text-xs font-medium outline-none focus:ring-2 focus:ring-brand/20 transition-all resize-none"></textarea>
               </div>

               <button type="submit" class="w-full py-4 bg-brand text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-brand/20 hover:opacity-90 transition-all active:scale-95 mt-4">
                  Confirm Transaction
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
  notes: ''
});

onMounted(() => {
  expenseStore.fetchCategories();
  expenseStore.fetchExpenses();
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
  return entries.sort((a, b) => b[1] - a[1])[0][0];
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
    notes: ''
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
