<template>
  <div class="p-8 max-w-5xl mx-auto font-sans">
    <header class="mb-6 flex justify-between items-end pb-4 border-b border-border">
      <div>
        <h1 class="text-2xl font-bold text-text-primary">Chart of Accounts</h1>
        <p class="text-sm mt-1 text-text-secondary">Organize your accounts for double-entry bookkeeping.</p>
      </div>
      <button @click="showModal = true"
        class="px-4 py-2 rounded text-sm font-bold transition-all bg-text-primary text-card-bg hover:opacity-90">
        + Add Account
      </button>
    </header>

    <div class="bg-card-bg rounded-lg border border-border overflow-hidden">
        <div class="grid grid-cols-12 px-6 py-3 font-semibold text-xs tracking-widest uppercase bg-hover-bg border-b border-border text-text-secondary">
            <div class="col-span-1">Code</div>
            <div class="col-span-7">Account Name</div>
            <div class="col-span-2">Type</div>
            <div class="col-span-2 text-right">Balance</div>
        </div>
        <div class="text-text-primary">
            <template v-for="root in accountStore.rootAccounts" :key="root.id">
                <AccountRow :account="root" :depth="0" />
            </template>
        </div>
    </div>

    <!-- Modal for adding account -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center p-6 z-[100] bg-black/40 backdrop-blur-[4px]">
        <div class="w-full max-w-lg rounded-xl overflow-hidden shadow-2xl bg-card-bg border border-border">
            <div class="px-6 py-4 flex justify-between items-center bg-hover-bg border-b border-border">
                <h3 class="font-bold text-base text-text-primary">New Account</h3>
                <button @click="showModal = false" class="text-text-muted hover:text-text-primary text-2xl">×</button>
            </div>
            
            <form @submit.prevent="handleAdd" class="p-6 space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-text-muted">Account Code</label>
                        <input v-model="form.code" type="text"
                          class="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none transition-all bg-app-bg text-text-primary">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-text-muted">Type</label>
                        <select v-model="form.type"
                          class="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none bg-app-bg text-text-primary">
                            <option value="Asset">Asset</option>
                            <option value="Liability">Liability</option>
                            <option value="Equity">Equity</option>
                            <option value="Income">Income</option>
                            <option value="Expense">Expense</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-text-muted">Account Name</label>
                    <input v-model="form.name" type="text" required 
                      class="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none transition-all bg-app-bg text-text-primary">
                </div>
                <div>
                    <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-text-muted">Parent Account</label>
                    <select v-model="form.parent_id"
                      class="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none bg-app-bg text-text-primary">
                        <option :value="null">None (Root)</option>
                        <option v-for="acc in accountStore.accounts.filter(a => a.is_group)" :key="acc.id" :value="acc.id">
                            {{ acc.code }} - {{ acc.name }}
                        </option>
                    </select>
                </div>
                <div class="flex items-center gap-2 pt-2">
                    <input v-model="form.is_group" type="checkbox" id="is_group" class="accent-text-primary">
                    <label for="is_group" class="text-sm text-text-secondary">This is a group account (can have children)</label>
                </div>
                
                <div class="pt-4 flex gap-3 border-t border-border">
                    <button type="button" @click="showModal = false"
                      class="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm font-semibold transition-all bg-card-bg text-text-secondary hover:bg-hover-bg">Cancel</button>
                    <button type="submit"
                      class="flex-1 px-4 py-2.5 rounded text-sm font-bold transition-all bg-text-primary text-card-bg hover:opacity-90">Create Account</button>
                </div>
            </form>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAccountStore } from '../stores/accounts';
import AccountRow from '../components/AccountRow.vue';

const accountStore = useAccountStore();
const showModal = ref(false);

const form = ref({
    name: '',
    code: '',
    type: 'Asset' as any,
    parent_id: null,
    is_group: false
});

onMounted(() => {
    accountStore.fetchAccounts();
});

async function handleAdd() {
    await accountStore.addAccount(form.value);
    showModal.value = false;
    form.value = { name: '', code: '', type: 'Asset' as any, parent_id: null, is_group: false };
}
</script>
