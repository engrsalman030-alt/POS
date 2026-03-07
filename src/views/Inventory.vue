<template>
  <div class="p-8 max-w-6xl mx-auto" style="font-family:'Inter',sans-serif;">

    <!-- Header -->
    <header class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold" style="color:#171717;">Items & Inventory</h1>
        <p class="text-sm mt-1" style="color:#999;">Track products, stock levels, and COGS automatically.</p>
      </div>
      <button @click="showModal = true"
        class="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
        style="background:#46B37E; color:#fff; box-shadow:0 2px 8px rgba(70,179,126,0.3);"
        onmouseover="this.style.background='#278F5E'"
        onmouseout="this.style.background='#46B37E'">
        + Add New Item
      </button>
    </header>

    <!-- Table -->
    <div class="rounded-xl overflow-hidden" style="background:#fff; border:1px solid #E2E2E2;">
      <table class="w-full text-left">
        <thead style="background:#F6F6F6; border-bottom:1px solid #E2E2E2;">
  <tr>
    <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest" style="color:#C7C7C7;">SKU</th>
    <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest" style="color:#C7C7C7;">Item Name</th>
    <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-right" style="color:#C7C7C7;">Qty on Hand</th>
    <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-right" style="color:#C7C7C7;">Valuation</th>
    <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-right" style="color:#C7C7C7;">Sales Price</th>
    <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-right" style="color:#C7C7C7;">Add Stock</th>
  </tr>
</thead>
        <tbody>
          <tr v-for="item in inventoryStore.items" :key="item.id"
            class="text-sm transition-colors"
            style="border-bottom:1px solid #F6F6F6;"
            onmouseover="this.style.background='#F6F6F6'"
            onmouseout="this.style.background='transparent'">
            <td class="px-6 py-4 font-mono text-xs" style="color:#999;">{{ item.sku }}</td>
            <td class="px-6 py-4 font-semibold" style="color:#171717;">{{ item.name }}</td>
            <td class="px-6 py-4 text-right">
              <span class="px-2 py-1 rounded-full font-bold text-xs"
                :style="item.stock_quantity > 0
                  ? 'background:#EDFBF4; color:#278F5E;'
                  : 'background:#FFF0F0; color:#E03636;'">
                {{ item.stock_quantity }}
              </span>
            </td>
            <td class="px-6 py-4 text-right font-semibold" style="color:#171717;">{{ formatCurrency(item.stock_value) }}</td>
            <td class="px-6 py-4 text-right font-semibold" style="color:#171717;">{{ formatCurrency(item.sales_rate) }}</td>
          </tr>
          <tr v-if="inventoryStore.items.length === 0">
            <td colspan="5" class="px-6 py-20 text-center text-sm" style="color:#C7C7C7;">
              No items found. Click "+ Add New Item" to start.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal"
      class="fixed inset-0 flex items-center justify-center p-6 z-50"
      style="background:rgba(23,23,23,0.5); backdrop-filter:blur(4px);">
      <div class="w-full max-w-lg rounded-xl overflow-hidden shadow-2xl" style="background:#fff;">
        
        <!-- Modal Header -->
        <div class="px-6 py-4 flex justify-between items-center" style="border-bottom:1px solid #E2E2E2;">
          <h3 class="font-bold text-base" style="color:#171717;">New Inventory Item</h3>
          <button @click="showModal = false"
            class="w-7 h-7 rounded-full flex items-center justify-center text-lg transition-all"
            style="color:#999;"
            onmouseover="this.style.background='#F6F6F6'"
            onmouseout="this.style.background='transparent'">×</button>
        </div>

        <!-- Modal Form -->
        <form @submit.prevent="handleAdd" class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style="color:#999;">SKU</label>
              <input v-model="form.sku" type="text"
                class="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                style="background:#F6F6F6; border:1px solid #E2E2E2; color:#171717;"
                onfocus="this.style.borderColor='#46B37E'; this.style.background='#fff'"
                onblur="this.style.borderColor='#E2E2E2'; this.style.background='#F6F6F6'">
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style="color:#999;">Type</label>
              <select v-model="form.type"
                class="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                style="background:#F6F6F6; border:1px solid #E2E2E2; color:#171717;">
                <option value="Product">Product (Inventory)</option>
                <option value="Service">Service (Non-Inventory)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style="color:#999;">Item Name</label>
            <input v-model="form.name" type="text" required
              class="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
              style="background:#F6F6F6; border:1px solid #E2E2E2; color:#171717;"
              onfocus="this.style.borderColor='#46B37E'; this.style.background='#fff'"
              onblur="this.style.borderColor='#E2E2E2'; this.style.background='#F6F6F6'">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style="color:#999;">Purchase Rate</label>
              <input v-model.number="form.purchase_rate" type="number" step="0.01"
                class="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                style="background:#F6F6F6; border:1px solid #E2E2E2; color:#171717;"
                onfocus="this.style.borderColor='#46B37E'; this.style.background='#fff'"
                onblur="this.style.borderColor='#E2E2E2'; this.style.background='#F6F6F6'">
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style="color:#999;">Sales Price</label>
              <input v-model.number="form.sales_rate" type="number" step="0.01"
                class="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                style="background:#F6F6F6; border:1px solid #E2E2E2; color:#171717;"
                onfocus="this.style.borderColor='#46B37E'; this.style.background='#fff'"
                onblur="this.style.borderColor='#E2E2E2'; this.style.background='#F6F6F6'">
            </div>
          </div>

          <!-- Footer -->
          <div class="pt-4 flex gap-3" style="border-top:1px solid #F0F0F0;">
            <button type="button" @click="showModal = false"
              class="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style="color:#525252; background:#F6F6F6; border:1px solid #E2E2E2;"
              onmouseover="this.style.background='#EDEDED'"
              onmouseout="this.style.background='#F6F6F6'">
              Cancel
            </button>
            <button type="submit"
              class="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style="background:#46B37E; color:#fff; box-shadow:0 2px 8px rgba(70,179,126,0.3);"
              onmouseover="this.style.background='#278F5E'"
              onmouseout="this.style.background='#46B37E'">
              Create Item
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
div { font-family: 'Inter', sans-serif; }
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useInventoryStore } from '../stores/inventory';
import { useCompanyStore } from '../stores/company';

const inventoryStore = useInventoryStore();
const companyStore = useCompanyStore();
const showModal = ref(false);

const form = ref({
    name: '',
    sku: '',
    type: 'Product',
    is_inventory: true,
    default_income_account_id: 'sales_income',
    default_expense_account_id: 'cogs',
    default_inventory_account_id: 'inventory',
    purchase_rate: 0,
    sales_rate: 0
});

onMounted(() => {
    inventoryStore.fetchItems();
});

async function handleAdd() {
    await inventoryStore.addItem(form.value as any);
    showModal.value = false;
    form.value = { 
        name: '', sku: '', type: 'Product', is_inventory: true, 
        default_income_account_id: 'sales_income', 
        default_expense_account_id: 'cogs', 
        default_inventory_account_id: 'inventory', 
        purchase_rate: 0, sales_rate: 0 
    };
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: companyStore.company?.currency || 'USD'
  }).format(val || 0);
}
</script>
