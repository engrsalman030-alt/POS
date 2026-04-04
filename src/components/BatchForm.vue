<template>
  <div class="batch-form">
    <div class="bg-card-bg rounded-xl border border-border p-5 md:p-6 space-y-5">
      <div class="flex items-center justify-between pb-3 border-b border-border">
        <h3 class="text-sm font-bold text-text-primary">{{ isEdit ? 'Edit Batch' : 'New Batch' }}</h3>
        <button @click="$emit('close')" class="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-danger transition-all">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      <!-- Item Selector -->
      <div class="space-y-1">
        <label class="block text-[9px] font-bold text-text-muted uppercase tracking-widest">Item *</label>
        <AutoCompleteWithCreate
           v-model="form.item_id"
           :options="items.map(i => ({ id: i.id, name: i.name, sub: (i as any).brand }))"
           placeholder="Search Item..."
           :disabled="isEdit"
        />
      </div>

      <!-- Batch # & Supplier -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1">
          <label class="block text-[9px] font-bold text-text-muted uppercase tracking-widest">Batch Number *</label>
          <input v-model="form.batch_number" type="text" required placeholder="e.g. BN-2026-001" class="w-full bg-hover-bg border border-border rounded-lg px-3 py-2 text-xs font-semibold text-text-primary outline-none focus:ring-1 focus:ring-emerald-500/20 uppercase" />
        </div>
        <div class="space-y-1">
          <label class="block text-[9px] font-bold text-text-muted uppercase tracking-widest">Supplier</label>
          <AutoCompleteWithCreate
             v-model="form.supplier_id"
             :options="suppliers.map(s => ({ id: s.id, name: s.name }))"
             placeholder="Search Supplier..."
          />
        </div>
      </div>

      <!-- Dates -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1">
          <label class="block text-[9px] font-bold text-text-muted uppercase tracking-widest">Manufacturing Date</label>
          <SmartDateInput v-model="form.mfg_date" />
        </div>
        <div class="space-y-1">
          <label class="block text-[9px] font-bold text-text-muted uppercase tracking-widest">Expiry Date</label>
          <SmartDateInput v-model="form.expiry_date" />
        </div>
      </div>

      <!-- Qty & Rates -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="space-y-1">
          <label class="block text-[9px] font-bold text-text-muted uppercase tracking-widest">Quantity</label>
          <input v-model.number="form.quantity" type="number" placeholder="0" class="w-full bg-hover-bg border border-border rounded-lg px-3 py-2 text-xs font-bold text-text-primary outline-none focus:ring-1 focus:ring-emerald-500/20 text-center" />
        </div>
        <div class="space-y-1">
          <label class="block text-[9px] font-bold text-text-muted uppercase tracking-widest">Purchase Rate</label>
          <input v-model.number="form.purchase_rate" type="number" placeholder="0" class="w-full bg-hover-bg border border-border rounded-lg px-3 py-2 text-xs font-bold text-text-primary outline-none focus:ring-1 focus:ring-emerald-500/20 text-center" />
        </div>
        <div class="space-y-1">
          <label class="block text-[9px] font-bold text-text-muted uppercase tracking-widest">Sales Rate</label>
          <input v-model.number="form.sales_rate" type="number" placeholder="0" class="w-full bg-hover-bg border border-border rounded-lg px-3 py-2 text-xs font-bold text-text-primary outline-none focus:ring-1 focus:ring-emerald-500/20 text-center" />
        </div>
      </div>

      <!-- Notes -->
      <div class="space-y-1">
        <label class="block text-[9px] font-bold text-text-muted uppercase tracking-widest">Notes</label>
        <textarea v-model="form.notes" rows="2" placeholder="Optional notes..." class="w-full bg-hover-bg border border-border rounded-lg p-2 text-xs font-medium text-text-primary outline-none focus:ring-1 focus:ring-emerald-500/20 resize-none"></textarea>
      </div>

      <div class="flex gap-3 pt-3 border-t border-border">
        <button @click="$emit('close')" class="btn-ghost flex-1 py-2 h-auto text-xs">Cancel</button>
        <button @click="handleSubmit" :disabled="!isValid" class="btn-primary flex-[2] py-2 h-auto text-xs">
          {{ isEdit ? 'Update Batch' : 'Create Batch' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useInventoryStore } from '../stores/inventory';
import { usePartyStore } from '../stores/parties';
import { useBatchStore } from '../stores/batches';
import SmartDateInput from './SmartDateInput.vue';
import AutoCompleteWithCreate from './AutoCompleteWithCreate.vue';
import type { ItemBatch } from '../types/batch';

const props = defineProps<{
  initialData?: ItemBatch;
  preselectedItemId?: string;
}>();

const emit = defineEmits(['close', 'saved']);

const inventoryStore = useInventoryStore();
const partyStore = usePartyStore();
const batchStore = useBatchStore();

const items = computed(() => inventoryStore.items || []);
const suppliers = computed(() => partyStore.suppliers || []);
const isEdit = computed(() => !!props.initialData?.id);

const form = ref({
  item_id: props.initialData?.item_id || props.preselectedItemId || '',
  batch_number: props.initialData?.batch_number || '',
  mfg_date: props.initialData?.mfg_date || '',
  expiry_date: props.initialData?.expiry_date || '',
  quantity: props.initialData?.quantity || 0,
  purchase_rate: props.initialData?.purchase_rate || 0,
  sales_rate: props.initialData?.sales_rate || 0,
  supplier_id: props.initialData?.supplier_id || '',
  notes: props.initialData?.notes || '',
});

const isValid = computed(() => !!form.value.item_id && !!form.value.batch_number);

async function handleSubmit() {
  if (!isValid.value) return;
  
  if (isEdit.value && props.initialData) {
    await batchStore.updateBatch({
      ...props.initialData,
      ...form.value,
      is_active: true
    });
  } else {
    await batchStore.addBatch(form.value);
  }
  
  emit('saved');
  emit('close');
}
</script>
