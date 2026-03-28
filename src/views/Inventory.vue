<template>
  <div class="p-8 max-w-6xl mx-auto font-sans">
    
    <!-- Header -->
    <header class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b border-border">
      <div>
        <h1 class="text-2xl font-bold text-text-primary">Items & Inventory</h1>
        <p class="text-sm mt-1 text-text-secondary">Track products, stock levels, and COGS automatically.</p>
      </div>
      <button @click="openAddModal"
        class="w-full sm:w-auto px-4 py-2 rounded text-sm font-bold transition-all bg-text-primary text-card-bg hover:opacity-90">
        + Add New Item
      </button>
    </header>

    <!-- Cards Grid -->
    <div class="space-y-6">
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div v-for="(item, index) in paginatedItems" :key="item.id"
          class="card-animate group relative bg-card-bg rounded-2xl border border-border p-4 transition-all hover:border-brand hover:shadow-xl hover:shadow-brand/5 flex flex-col"
          :style="{ animationDelay: `${index * 50}ms` }">
          
          <!-- Edit button floating -->
          <button @click.stop="openEditModal(item)" 
            class="absolute top-2 left-2 w-7 h-7 rounded-full bg-card-bg/90 backdrop-blur border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-brand hover:text-white z-20 shadow-sm"
            title="Edit Item">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          </button>
          
          <!-- Stock Badge -->
          <div v-if="item.stock_quantity > 0" class="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center px-1 rounded-full bg-emerald-600 text-white text-[10px] font-black z-30 shadow-md border-2 border-card-bg">
            {{ item.stock_quantity }}
          </div>

          <!-- Image Area -->
          <div class="w-full aspect-square bg-hover-bg rounded-xl mb-4 flex items-center justify-center overflow-hidden border border-border group-hover:bg-hover-bg/80 relative">
            <img v-if="item.image" :src="item.image" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div v-else class="w-full h-full flex items-center justify-center opacity-20">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            </div>
          </div>

          <!-- Text Details -->
          <h3 class="text-xs font-black text-text-primary line-clamp-1 mb-1">{{ item.name }}</h3>
          <p class="text-[9px] text-text-muted font-bold uppercase tracking-widest">{{ item.category || 'General' }}</p>
          <p class="mt-3 text-[11px] font-black text-brand">{{ formatCurrency(item.sales_rate) }}</p>

          <!-- Add Stock Action (Updated for cleaner fit) -->
          <div class="mt-4 pt-3 border-t border-border border-dashed">
            <template v-if="!showInlineAdd[item.id]">
              <button @click="showInlineAdd[item.id] = true" 
                class="w-full text-center text-[9px] font-black uppercase tracking-widest text-text-muted hover:text-brand transition-colors">+ Add Stock</button>
            </template>
            <div v-else class="flex items-center gap-1.5">
              <input type="number" v-model="addQtyMap[item.id]" 
                class="w-12 px-1 py-1 text-[10px] border border-border rounded outline-none text-center bg-hover-bg text-text-primary font-bold"
                placeholder="Qty" @keyup.enter="quickAddStock(item)">
              <button @click="quickAddStock(item)" class="flex-1 py-1 rounded text-[9px] font-black uppercase bg-brand text-white shadow-sm hover:opacity-90 active:scale-95 transition-all">Add</button>
              <button @click="showInlineAdd[item.id] = false" class="text-sm font-bold text-text-muted px-1">&times;</button>
            </div>
          </div>
        </div>
      </div>

        <!-- Empty State -->
        <div v-if="paginatedItems.length === 0" class="col-span-full py-20 text-center text-sm text-text-muted">
          No items found. Click "+ Add New Item" to create one.
        </div>
      </div>

      <!-- Pagination Component -->
      <Pagination 
        :currentPage="currentPage" 
        :totalPages="totalPages" 
        @next="nextPage" 
        @prev="prevPage"
        @setPage="setPage"
      />

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center p-6 z-[100] bg-black/40 backdrop-blur-[4px] overflow-y-auto">
      <div class="w-full max-w-4xl my-auto rounded-3xl overflow-hidden border border-border shadow-2xl animate-in fade-in zoom-in duration-300 bg-app-bg">

        <div class="px-8 py-6 flex justify-between items-center bg-card-bg border-b border-border">
          <div class="flex items-center gap-4">
             <div class="w-12 h-12 bg-text-primary text-card-bg rounded-2xl flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>
             </div>
             <div>
               <h3 class="font-black text-xl text-text-primary">{{ isEditMode ? 'Edit Inventory Item' : 'New Product Registration' }}</h3>
               <p class="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em] mt-0.5">ERP-Grade Inventory Control</p>
             </div>
          </div>
          <button @click="closeModal" class="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-hover-bg text-text-muted hover:text-rose-500 transition-all active:scale-95">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <!-- Error Message Bar -->
        <div v-if="errorMessage" class="px-8 py-3 bg-rose-50 border-b border-rose-100 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span class="text-xs font-bold text-rose-600">{{ errorMessage }}</span>
        </div>

        <div class="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
           <ItemForm 
             :initialData="isEditMode ? editingItem : null" 
             @submit="handleFormSubmit" 
             @cancel="closeModal" 
           />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useInventoryStore } from '../stores/inventory';
import { useCompanyStore } from '../stores/company';
import { usePagination } from '../composables/usePagination';
import Pagination from '../components/Pagination.vue';
import ItemForm from '../components/ItemForm.vue';

const inventoryStore = useInventoryStore();
const companyStore = useCompanyStore();

const { 
    currentPage, 
    totalPages, 
    paginatedItems, 
    nextPage, 
    prevPage, 
    setPage 
} = usePagination(computed(() => inventoryStore.items), 12);
const showModal = ref(false);
const isEditMode = ref(false);
const editingItem = ref<any>(null);
const errorMessage = ref('');

const addQtyMap = ref<Record<string, number>>({});
const showInlineAdd = ref<Record<string, boolean>>({});

async function quickAddStock(item: any) {
  const qty = addQtyMap.value[item.id] || 1;
  if (qty <= 0) return;
  await inventoryStore.addStock(item.id, qty, item.purchase_rate || 0);
  addQtyMap.value[item.id] = 1;
  showInlineAdd.value[item.id] = false;
}



const openAddModal = () => {
    closeModal();
    showModal.value = true;
};

const openEditModal = (item: any) => {
    isEditMode.value = true;
    editingItem.value = { ...item };
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    isEditMode.value = false;
    editingItem.value = null;
    errorMessage.value = '';
};

// handleFileUpload removed as it is now in ItemForm.vue

onMounted(() => {
  inventoryStore.fetchItems();
});

async function handleFormSubmit(itemData: any) {
  try {
    errorMessage.value = '';
    if (isEditMode.value) {
        await inventoryStore.updateItem(itemData);
    } else {
        await inventoryStore.addItem(itemData, itemData.opening_quantity || 0);
    }
    closeModal();
  } catch (err: any) {
    if (err.message?.includes('UNIQUE constraint failed: items.sku')) {
      errorMessage.value = `An item with SKU "${itemData.sku}" already exists.`;
    } else {
      errorMessage.value = `Failed to ${isEditMode.value ? 'update' : 'create'} item. Please try again.`;
      console.error(err);
    }
  }
} // handleAdd removed as we use handleFormSubmit now

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: companyStore.company?.currency || 'PKR'
  }).format(val || 0);
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
div { font-family: 'Inter', sans-serif; }

.card-animate {
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

