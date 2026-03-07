<template>
  <div class="p-8 max-w-5xl mx-auto">
    <header class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Chart of Accounts</h1>
        <p class="text-slate-500 text-sm">Organize your accounts for double-entry bookkeeping</p>
      </div>
      <button @click="showModal = true" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
        + Add Account
      </button>
    </header>

    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="grid grid-cols-12 px-6 py-4 bg-slate-50 border-b border-slate-100 text-[10px] uppercase tracking-widest font-black text-slate-400">
            <div class="col-span-1">Code</div>
            <div class="col-span-7">Account Name</div>
            <div class="col-span-2">Type</div>
            <div class="col-span-2 text-right">Balance</div>
        </div>
        <div class="divide-y divide-slate-50">
            <template v-for="root in accountStore.rootAccounts" :key="root.id">
                <AccountRow :account="root" :depth="0" />
            </template>
        </div>
    </div>

    <!-- Modal for adding account -->
    <div v-if="showModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
            <div class="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 class="font-bold text-slate-900">New Account</h3>
                <button @click="showModal = false" class="text-slate-400 hover:text-slate-600 text-xl">×</button>
            </div>
            <form @submit.prevent="handleAdd" class="p-6 space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-[10px] font-bold uppercase text-slate-500 mb-1">Account Code</label>
                        <input v-model="form.code" type="text" class="w-full px-4 py-2 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm outline-none">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold uppercase text-slate-500 mb-1">Type</label>
                        <select v-model="form.type" class="w-full px-4 py-2 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm outline-none">
                            <option value="Asset">Asset</option>
                            <option value="Liability">Liability</option>
                            <option value="Equity">Equity</option>
                            <option value="Income">Income</option>
                            <option value="Expense">Expense</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block text-[10px] font-bold uppercase text-slate-500 mb-1">Account Name</label>
                    <input v-model="form.name" type="text" required class="w-full px-4 py-2 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm outline-none">
                </div>
                <div>
                    <label class="block text-[10px] font-bold uppercase text-slate-500 mb-1">Parent Account</label>
                    <select v-model="form.parent_id" class="w-full px-4 py-2 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm outline-none">
                        <option :value="null">None (Root)</option>
                        <option v-for="acc in accountStore.accounts.filter(a => a.is_group)" :key="acc.id" :value="acc.id">
                            {{ acc.code }} - {{ acc.name }}
                        </option>
                    </select>
                </div>
                <div class="flex items-center gap-2 pt-2">
                    <input v-model="form.is_group" type="checkbox" id="is_group" class="rounded text-indigo-600 focus:ring-indigo-500">
                    <label for="is_group" class="text-sm text-slate-700">This is a group account (can have children)</label>
                </div>
                <div class="pt-6 border-t border-slate-50 flex gap-3">
                    <button type="button" @click="showModal = false" class="flex-1 px-4 py-3 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
                    <button type="submit" class="flex-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Create Account</button>
                </div>
            </form>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAccountStore } from '../stores/accounts';
import { useCompanyStore } from '../stores/company';
import AccountRow from '../components/AccountRow.vue';

const accountStore = useAccountStore();
const companyStore = useCompanyStore();
const showModal = ref(false);

const form = ref({
    name: '',
    code: '',
    type: 'Asset' as any,
    parent_id: null,
    is_group: false
});

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: companyStore.company?.currency || 'PKR'
  }).format(val || 0);
}

onMounted(() => {
    accountStore.fetchAccounts();
});

async function handleAdd() {
    await accountStore.addAccount(form.value);
    showModal.value = false;
    form.value = { name: '', code: '', type: 'Asset' as any, parent_id: null, is_group: false };
}
</script>
