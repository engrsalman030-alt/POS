<template>
  <div class="p-8 max-w-4xl mx-auto">
    <header class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Tax Settings</h1>
        <p class="text-slate-500 text-sm">Configure tax rules for sales and purchases.</p>
      </div>
      <button @click="showModal = true" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
        + Create Tax Rule
      </button>
    </header>

    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-slate-50 border-b border-slate-100">
          <tr>
            <th class="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Tax Name</th>
            <th class="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Rate (%)</th>
            <th class="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="tax in taxes" :key="tax.id" class="hover:bg-slate-50/50 transition-colors">
            <td class="px-6 py-4 font-bold text-slate-700">{{ tax.name }}</td>
            <td class="px-6 py-4 text-right font-mono font-bold text-slate-900">{{ tax.rate }}%</td>
            <td class="px-6 py-4">
                <span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase">Active</span>
            </td>
          </tr>
          <tr v-if="taxes.length === 0">
            <td colspan="3" class="px-6 py-20 text-center text-slate-400 italic">No tax rules defined.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal for new tax -->
    <div v-if="showModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
            <div class="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 class="font-bold text-slate-900">New Tax Rule</h3>
                <button @click="showModal = false" class="text-slate-400 hover:text-slate-600 text-xl">×</button>
            </div>
            <form @submit.prevent="handleAdd" class="p-6 space-y-4">
                <div>
                    <label class="block text-[10px] font-bold uppercase text-slate-500 mb-1">Tax Name</label>
                    <input v-model="form.name" type="text" required placeholder="e.g. VAT 15%" class="w-full px-4 py-2 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm outline-none">
                </div>
                <div>
                    <label class="block text-[10px] font-bold uppercase text-slate-500 mb-1">Tax Rate (%)</label>
                    <input v-model.number="form.rate" type="number" step="0.01" required class="w-full px-4 py-2 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm outline-none">
                </div>
                <div class="pt-6 border-t border-slate-50 flex gap-3">
                    <button type="button" @click="showModal = false" class="flex-1 px-4 py-3 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
                    <button type="submit" class="flex-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Save Rule</button>
                </div>
            </form>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const showModal = ref(false);
const taxes = ref<any[]>([
    { id: '1', name: 'Standard VAT', rate: 15 },
    { id: '2', name: 'Service Tax', rate: 5 }
]);

const form = ref({
    name: '',
    rate: 0
});

function handleAdd() {
    taxes.value.push({ id: crypto.randomUUID(), ...form.value });
    showModal.value = false;
    form.value = { name: '', rate: 0 };
}
</script>
