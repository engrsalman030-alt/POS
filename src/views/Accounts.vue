<template>
  <div class="page-container">
    <header class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
      <div>
        <h1 class="text-heading">Chart of Accounts</h1>
        <p class="text-subheading">Organize your accounts for double-entry bookkeeping.</p>
      </div>
      <button @click="showModal = true" class="btn-primary flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        Add Account
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
                      class="btn-ghost flex-1 py-3 h-auto">Cancel</button>
                    <button type="submit"
                      class="btn-primary flex-1 py-3 h-auto">Create Account</button>
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
