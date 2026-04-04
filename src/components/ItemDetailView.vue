<template>
  <div class="item-detail-container bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-300 max-w-2xl w-full mx-auto">
    
    <div class="p-8">
      <!-- Header -->
      <div class="flex items-start justify-between mb-8 pb-6 border-b-2 border-slate-200">
        <div class="flex items-center gap-4">
          <div v-if="item.image" class="w-20 h-20 rounded-xl overflow-hidden border-2 border-slate-200">
            <img :src="item.image" class="w-full h-full object-cover" />
          </div>
          <div v-else class="w-20 h-20 rounded-xl border-2 border-slate-200 bg-slate-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-slate-300">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
            </svg>
          </div>
          <div>
            <h2 class="text-2xl font-black text-black uppercase tracking-tight mb-1">{{ item.name }}</h2>
            <p class="text-sm font-bold text-slate-600 uppercase tracking-widest">{{ item.category || 'General' }}</p>
            <p class="text-xl font-black text-emerald-600 mt-2">{{ formatCurrency(item.sales_rate) }}</p>
          </div>
        </div>
        <button @click="$emit('close')" class="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-rose-500 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      <!-- Details Grid -->
      <div class="grid grid-cols-2 gap-6 mb-8">
        <!-- Left Column -->
        <div class="space-y-6">
          <div>
            <p class="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Item Code (SKU)</p>
            <p class="text-lg font-black text-black">{{ item.sku }}</p>
          </div>
          <div>
            <p class="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Category</p>
            <p class="text-base font-bold text-black">{{ item.category || 'General' }}</p>
          </div>
          <div>
            <p class="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Unit</p>
            <p class="text-base font-bold text-black">{{ item.unit || 'Piece' }}</p>
          </div>
          <div>
            <p class="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">COGS Method</p>
            <p class="text-base font-bold text-black capitalize">{{ item.cogs_method || 'FIFO' }}</p>
          </div>
        </div>

        <!-- Right Column -->
        <div class="space-y-6">
          <div>
            <p class="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Purchase Price</p>
            <p class="text-lg font-black text-black">{{ formatCurrency(item.purchase_rate || 0) }}</p>
          </div>
          <div>
            <p class="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Sales Price</p>
            <p class="text-lg font-black text-emerald-600">{{ formatCurrency(item.sales_rate) }}</p>
          </div>
          <div>
            <p class="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Margin</p>
            <p class="text-base font-bold text-black">{{ margin }}%</p>
          </div>
          <div>
            <p class="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Taxable</p>
            <p class="text-base font-bold text-black">{{ item.is_taxable ? 'Yes' : 'No' }}</p>
          </div>
        </div>
      </div>

      <!-- Stock Information -->
      <div class="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
        <h3 class="text-sm font-black uppercase tracking-widest text-slate-600 mb-4">Stock Information</h3>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <p class="text-xs font-bold text-slate-500 mb-1">Current Stock</p>
            <p class="text-2xl font-black text-black">{{ item.stock_quantity || 0 }}</p>
            <p class="text-[10px] text-slate-500 mt-1">Units</p>
          </div>
          <div>
            <p class="text-xs font-bold text-slate-500 mb-1">Reorder Level</p>
            <p class="text-2xl font-black text-black">{{ item.reorder_level || 0 }}</p>
            <p class="text-[10px] text-slate-500 mt-1">Units</p>
          </div>
          <div>
            <p class="text-xs font-bold text-slate-500 mb-1">Stock Value</p>
            <p class="text-xl font-black text-emerald-600">{{ formatCurrency((item.stock_quantity || 0) * (item.purchase_rate || 0)) }}</p>
            <p class="text-[10px] text-slate-500 mt-1">@ Purchase Rate</p>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div v-if="item.description" class="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-8">
        <h3 class="text-sm font-black uppercase tracking-widest text-blue-600 mb-2">Description</h3>
        <p class="text-sm text-black leading-relaxed">{{ item.description }}</p>
      </div>

      <!-- Meta Information -->
      <div class="bg-slate-50 rounded-xl p-6 border border-slate-200 text-xs">
        <div class="grid grid-cols-2 gap-4 text-slate-600">
          <div>
            <span class="font-bold">Created:</span>
            <p class="text-slate-800">{{ formatDate(item.created_at) }}</p>
          </div>
          <div>
            <span class="font-bold">Updated:</span>
            <p class="text-slate-800">{{ formatDate(item.updated_at) }}</p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 mt-8 pt-6 border-t border-slate-200">
        <button @click="$emit('close')" class="flex-1 py-3 px-4 rounded-lg bg-slate-100 text-black font-bold uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95">
          Close
        </button>
        <button @click="$emit('edit')" class="flex-1 py-3 px-4 rounded-lg bg-emerald-600 text-white font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          Edit
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCompanyStore } from '../stores/company';
import { computed } from 'vue';

const props = defineProps<{
  item: any;
}>();

const companyStore = useCompanyStore();

const margin = computed(() => {
  if (!props.item.purchase_rate || !props.item.sales_rate) return 0;
  const m = ((props.item.sales_rate - props.item.purchase_rate) / props.item.sales_rate) * 100;
  return Math.round(m);
});

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: companyStore.company?.currency || 'PKR'
  }).format(val || 0);
}

function formatDate(date: string) {
  if (!date) return '---';
  return new Date(date).toLocaleDateString('en-PK');
}

defineEmits<{
  close: [];
  edit: [];
}>();
</script>

<style scoped>
</style>
