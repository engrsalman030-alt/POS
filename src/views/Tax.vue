<template>
  <div class="page-container">
    
    <!-- Header -->
    <header class="mb-8 flex justify-between items-end pb-4 border-b border-border">
      <div>
        <h1 class="text-heading">Tax Settings</h1>
        <p class="text-subheading underline decoration-brand/20 underline-offset-4">Configure tax rules for global sales and regional procurement.</p>
      </div>
      <button @click="showModal = true" class="btn-primary">
        + Create Tax Rule
      </button>
    </header>

    <div class="border border-border rounded-lg overflow-hidden bg-card-bg">
      <table class="w-full text-left border-collapse">
        <thead class="bg-hover-bg border-b border-border">
          <tr>
            <th class="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-text-muted">Tax Name</th>
            <th class="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-text-muted">Type & Context</th>
            <th class="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-right text-text-muted">Rate/Amount</th>
            <th class="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-text-muted text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tax in taxStore.taxes" :key="tax.id"
            class="group text-sm border-b border-hover-bg/50 transition-colors hover:bg-hover-bg cursor-pointer">
            <td class="px-6 py-4">
              <span class="font-semibold text-text-primary block">{{ tax.name }}</span>
              <span class="text-[9px] text-text-muted uppercase mt-0.5 block" v-if="tax.effective_date">Effective: {{ tax.effective_date }}</span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                 <span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-brand/10 text-brand">{{ tax.type }}</span>
                 <span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase border border-border text-text-muted">{{ tax.applicable_on }}</span>
              </div>
            </td>
            <td class="px-6 py-4 text-right font-mono font-bold text-text-primary">
              <div class="flex flex-col items-end gap-1">
                 <span>{{ tax.type === 'Percentage' ? tax.rate + '%' : 'PKR ' + tax.rate }}</span>
                 <span v-if="tax.is_inclusive" class="text-[8px] uppercase font-black text-rose-500 tracking-widest">Inclusive</span>
              </div>
            </td>
            <td class="px-6 py-4 flex items-center justify-between gap-4">
              <span :class="['px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest flex-1 text-center', tax.is_active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-hover-bg text-text-secondary']">
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
          <div class="grid grid-cols-2 gap-4">
             <div class="col-span-2">
               <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-text-muted">Tax Name</label>
               <input v-model="form.name" type="text" required placeholder="e.g. Sales Tax 15%"
                 class="w-full px-3 py-2 border border-border rounded text-sm outline-none bg-app-bg text-text-primary focus:border-text-primary">
             </div>
             
             <div>
               <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-text-muted">Type</label>
               <select v-model="form.type" class="w-full px-3 py-2 border border-border rounded text-sm outline-none bg-app-bg text-text-primary focus:border-text-primary">
                 <option value="Percentage">Percentage (%)</option>
                 <option value="Fixed">Fixed Amount</option>
               </select>
             </div>
             
             <div>
               <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-text-muted">Rate / Amount</label>
               <input v-model.number="form.rate" type="number" step="0.01" required
                 class="w-full px-3 py-2 border border-border rounded text-sm outline-none font-mono bg-app-bg text-text-primary focus:border-text-primary">
             </div>

             <div>
               <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-text-muted">Applicable On</label>
               <select v-model="form.applicable_on" class="w-full px-3 py-2 border border-border rounded text-sm outline-none bg-app-bg text-text-primary focus:border-text-primary">
                 <option value="Both">Both (Sales & Purchase)</option>
                 <option value="Sales">Sales Only</option>
                 <option value="Purchases">Purchases Only</option>
               </select>
             </div>

             <div>
               <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-text-muted">Effective Date</label>
               <input v-model="form.effective_date" type="date"
                 class="w-full px-3 py-2 border border-border rounded text-sm outline-none bg-app-bg text-text-primary focus:border-text-primary">
             </div>

             <div class="col-span-2 mt-2">
                <label class="flex items-center gap-3 cursor-pointer">
                   <input type="checkbox" v-model="form.is_inclusive" :true-value="1" :false-value="0" class="w-4 h-4 rounded text-brand border-border bg-app-bg">
                   <div class="flex flex-col">
                      <span class="text-sm font-bold text-text-primary">Inclusive Tax</span>
                      <span class="text-[10px] text-text-muted mt-0.5">Check if product prices already contain this tax.</span>
                   </div>
                </label>
             </div>
          </div>
          <div class="pt-4 flex gap-3">
            <button type="button" @click="showModal = false" class="btn-ghost border border-border flex-1">
              Dismiss
            </button>
            <button type="submit" class="btn-primary flex-1">
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

const form = ref<any>({
    name: '',
    rate: 0,
    type: 'Percentage',
    applicable_on: 'Both',
    is_inclusive: 0,
    effective_date: '',
    is_active: 1
});

onMounted(() => {
    taxStore.fetchTaxes();
});

async function handleAdd() {
    await taxStore.addTax({ ...form.value } as any);
    showModal.value = false;
    form.value = { name: '', rate: 0, type: 'Percentage', applicable_on: 'Both', is_inclusive: 0, effective_date: '', is_active: 1 };
}

async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this tax rule?')) {
        await taxStore.deleteTax(id);
    }
}
</script>
