<template>
  <div class="p-8 max-w-4xl mx-auto font-sans">
    
    <!-- Header -->
    <header class="mb-8 flex justify-between items-end pb-4 border-b border-border">
      <div>
        <h1 class="text-2xl font-bold text-text-primary">Tax Settings</h1>
        <p class="text-sm mt-1 text-text-secondary">Configure tax rules for sales and purchases.</p>
      </div>
      <button @click="showModal = true"
        class="px-4 py-2 rounded text-sm font-bold transition-all bg-text-primary text-card-bg hover:opacity-90">
        + Create Tax Rule
      </button>
    </header>

    <div class="border border-border rounded-lg overflow-hidden bg-card-bg">
      <table class="w-full text-left border-collapse">
        <thead class="bg-hover-bg border-b border-border">
          <tr>
            <th class="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-text-muted">Tax Name</th>
            <th class="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-right text-text-muted">Rate (%)</th>
            <th class="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-text-muted">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tax in taxStore.taxes" :key="tax.id"
            class="group text-sm border-b border-hover-bg/50 transition-colors hover:bg-hover-bg cursor-pointer">
            <td class="px-6 py-4 font-semibold text-text-primary">{{ tax.name }}</td>
            <td class="px-6 py-4 text-right font-mono font-bold text-text-primary">{{ tax.rate }}%</td>
            <td class="px-6 py-4 flex items-center justify-between">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-hover-bg text-text-secondary">
                {{ tax.is_active ? 'Active' : 'Inactive' }}
              </span>
              <button @click.stop="handleDelete(tax.id)" class="opacity-0 group-hover:opacity-100 p-1 text-rose-500 hover:bg-rose-50 rounded transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </td>
          </tr>
          <tr v-if="taxStore.taxes.length === 0">
            <td colspan="3" class="px-6 py-20 text-center text-sm text-text-muted">No tax rules defined.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal for new tax -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center p-6 z-[100] bg-black/40 backdrop-blur-[2px]">
      <div class="w-full max-w-md rounded-lg overflow-hidden border border-border shadow-lg bg-card-bg">
 
        <div class="px-6 py-4 flex justify-between items-center bg-hover-bg border-b border-border">
          <h3 class="font-bold text-sm uppercase tracking-widest text-text-secondary">New Tax Rule</h3>
          <button @click="showModal = false" class="text-xl text-text-muted hover:text-text-primary">&times;</button>
        </div>

        <form @submit.prevent="handleAdd" class="p-8 space-y-5">
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-text-muted">Tax Name</label>
            <input v-model="form.name" type="text" required placeholder="e.g. VAT 15%"
              class="w-full px-3 py-2 border border-border rounded text-sm outline-none bg-app-bg text-text-primary focus:border-text-primary">
          </div>
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-text-muted">Tax Rate (%)</label>
            <input v-model.number="form.rate" type="number" step="0.01" required
              class="w-full px-3 py-2 border border-border rounded text-sm outline-none font-mono bg-app-bg text-text-primary focus:border-text-primary">
          </div>
          <div class="pt-4 flex gap-3">
            <button type="button" @click="showModal = false"
              class="flex-1 px-4 py-2 border border-border rounded text-sm font-bold transition-all bg-card-bg text-text-secondary hover:bg-hover-bg">
              Dismiss
            </button>
            <button type="submit"
              class="flex-1 px-4 py-2 rounded text-sm font-bold transition-all bg-text-primary text-card-bg hover:opacity-90">
              Save Rule
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTaxStore } from '../stores/tax';

const taxStore = useTaxStore();
const showModal = ref(false);

const form = ref({
    name: '',
    rate: 0,
    is_active: 1
});

onMounted(() => {
    taxStore.fetchTaxes();
});

async function handleAdd() {
    await taxStore.addTax({ ...form.value });
    showModal.value = false;
    form.value = { name: '', rate: 0, is_active: 1 };
}

async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this tax rule?')) {
        await taxStore.deleteTax(id);
    }
}
</script>
