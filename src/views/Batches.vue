<template>
  <div class="page-container">
    <!-- Header -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h1 class="text-heading">Batch Management</h1>
        <p class="text-subheading">Track and manage medicine batches, expiry dates, and stock levels.</p>
      </div>
      <button @click="showForm = true; editingBatch = undefined" class="btn-primary flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
        Add Batch
      </button>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="bg-card-bg rounded-xl border border-border p-4">
        <p class="text-[9px] font-bold text-text-muted uppercase tracking-widest">Total Batches</p>
        <p class="text-lg font-black text-text-primary mt-1">{{ batchStore.batches.length }}</p>
      </div>
      <div class="bg-card-bg rounded-xl border border-border p-4">
        <p class="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Active</p>
        <p class="text-lg font-black text-emerald-600 mt-1">{{ activeBatches.length }}</p>
      </div>
      <div class="bg-card-bg rounded-xl border border-border p-4">
        <p class="text-[9px] font-bold text-amber-600 uppercase tracking-widest">Expiring Soon</p>
        <p class="text-lg font-black text-amber-600 mt-1">{{ expiringSoon.length }}</p>
      </div>
      <div class="bg-card-bg rounded-xl border border-border p-4">
        <p class="text-[9px] font-bold text-danger uppercase tracking-widest">Expired</p>
        <p class="text-lg font-black text-danger mt-1">{{ expired.length }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input v-model="search" type="text" placeholder="Search batches by item, batch # ..." class="w-full bg-card-bg border border-border rounded-lg pl-9 pr-3 py-2 text-xs font-medium text-text-primary outline-none focus:ring-1 focus:ring-brand/20" />
      </div>
      <select v-model="statusFilter" class="bg-card-bg border border-border rounded-lg px-3 py-2 text-xs font-semibold text-text-primary outline-none appearance-none cursor-pointer">
        <option value="all">All Batches</option>
        <option value="active">Active Only</option>
        <option value="expiring">Expiring Soon</option>
        <option value="expired">Expired</option>
      </select>
    </div>

    <!-- Table -->
    <div class="bg-card-bg rounded-xl border border-border overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[900px]">
          <thead class="bg-hover-bg border-b border-border">
            <tr>
              <th class="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-text-muted">Item</th>
              <th class="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-text-muted">Batch #</th>
              <th class="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-text-muted">Mfg Date</th>
              <th class="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-text-muted">Expiry</th>
              <th class="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-text-muted text-center">Qty</th>
              <th class="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-text-muted text-right">Purchase Rate</th>
              <th class="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-text-muted text-right">Sales Rate</th>
              <th class="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-text-muted text-center">Status</th>
              <th class="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-text-muted text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="batch in filteredBatches" :key="batch.id" class="border-b border-border hover:bg-hover-bg/30 transition-colors group">
              <td class="py-3 px-4">
                <p class="text-xs font-bold text-text-primary uppercase">{{ getItemName(batch.item_id) }}</p>
                <p class="text-[9px] text-text-muted font-medium">{{ getItemBrand(batch.item_id) }}</p>
              </td>
              <td class="py-3 px-4 text-xs font-mono font-bold text-brand uppercase">{{ batch.batch_number }}</td>
              <td class="py-3 px-4 text-xs font-medium text-text-secondary">{{ batch.mfg_date || '—' }}</td>
              <td class="py-3 px-4">
                <span :class="expiryClass(batch.expiry_date)" class="text-xs font-bold">{{ batch.expiry_date || '—' }}</span>
              </td>
              <td class="py-3 px-4 text-xs font-bold text-text-primary text-center tabular-nums">{{ batch.quantity }}</td>
              <td class="py-3 px-4 text-xs font-medium text-text-secondary text-right tabular-nums">{{ formatCurrency(batch.purchase_rate) }}</td>
              <td class="py-3 px-4 text-xs font-medium text-text-secondary text-right tabular-nums">{{ formatCurrency(batch.sales_rate) }}</td>
              <td class="py-3 px-4 text-center">
                <span :class="statusBadgeClass(batch)" class="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                  {{ getStatus(batch) }}
                </span>
              </td>
              <td class="py-3 px-4 text-center">
                <div class="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button @click="editBatch(batch)" class="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-brand transition-colors" title="Edit">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button @click="deleteBatch(batch.id)" class="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-danger transition-colors" title="Delete">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredBatches.length === 0">
              <td colspan="9" class="py-12 text-center">
                <p class="text-sm text-text-muted font-medium">No batches found</p>
                <p class="text-[10px] text-text-muted mt-1">Add your first batch to get started.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Form Modal -->
    <div v-if="showForm" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showForm = false"></div>
      <div class="relative w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <BatchForm :initialData="editingBatch" @close="showForm = false" @saved="onBatchSaved" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useBatchStore } from '../stores/batches';
import { useInventoryStore } from '../stores/inventory';
import BatchForm from '../components/BatchForm.vue';
import type { ItemBatch } from '../types/batch';

const batchStore = useBatchStore();
const inventoryStore = useInventoryStore();

const search = ref('');
const statusFilter = ref('all');
const showForm = ref(false);
const editingBatch = ref<ItemBatch | undefined>(undefined);

onMounted(async () => {
  await inventoryStore.fetchItems();
  await batchStore.fetchBatches();
});

const today = computed(() => new Date().toISOString().split('T')[0]);
const thirtyDaysOut = computed(() => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split('T')[0];
});

const activeBatches = computed(() => batchStore.batches.filter(b => {
  if (!b.expiry_date) return true;
  return b.expiry_date >= today.value!;
}));

const expiringSoon = computed(() => batchStore.batches.filter(b => {
  if (!b.expiry_date) return false;
  return b.expiry_date >= today.value! && b.expiry_date <= thirtyDaysOut.value!;
}));

const expired = computed(() => batchStore.batches.filter(b => {
  if (!b.expiry_date) return false;
  return b.expiry_date < today.value!;
}));

const filteredBatches = computed(() => {
  let list = batchStore.batches;
  
  if (statusFilter.value === 'active') list = activeBatches.value;
  else if (statusFilter.value === 'expiring') list = expiringSoon.value;
  else if (statusFilter.value === 'expired') list = expired.value;
  
  if (search.value) {
    const q = search.value.toLowerCase();
    list = list.filter(b => {
      const itemName = getItemName(b.item_id).toLowerCase();
      return itemName.includes(q) || b.batch_number.toLowerCase().includes(q);
    });
  }
  
  return list;
});

function getItemName(id: string): string {
  return inventoryStore.items.find(i => i.id === id)?.name || 'Unknown Item';
}

function getItemBrand(id: string): string {
  return inventoryStore.items.find(i => i.id === id)?.brand || '';
}

function getStatus(batch: ItemBatch): string {
  if (!batch.expiry_date) return 'Active';
  if (batch.expiry_date < today.value!) return 'Expired';
  if (batch.expiry_date <= thirtyDaysOut.value!) return 'Expiring';
  return 'Active';
}


function expiryClass(date?: string): string {
  if (!date) return 'text-text-secondary';
  if (date < today.value!) return 'text-danger';
  if (date <= thirtyDaysOut.value!) return 'text-amber-600';
  return 'text-text-secondary';
}

function statusBadgeClass(batch: ItemBatch): string {
  const s = getStatus(batch);
  if (s === 'Expired') return 'bg-danger-bg text-danger';
  if (s === 'Expiring') return 'bg-warning-bg text-warning';
  return 'bg-success-bg text-success';
}

function formatCurrency(val: number): string {
  return (val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function editBatch(batch: ItemBatch) {
  editingBatch.value = batch;
  showForm.value = true;
}

async function deleteBatch(id: string) {
  if (confirm('Delete this batch?')) {
    await batchStore.deleteBatch(id);
  }
}

async function onBatchSaved() {
  await batchStore.fetchBatches();
  showForm.value = false;
}
</script>
