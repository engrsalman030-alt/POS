<template>
  <div class="p-8 max-w-6xl mx-auto" style="font-family:'Inter',sans-serif;">

    <header class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold" style="color:#171717;">Purchase Bills</h1>
        <p class="text-sm mt-1" style="color:#999;">Record bills from suppliers and track payables.</p>
      </div>
      <button @click="showModal = true"
        class="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
        style="background:#46B37E; color:#fff; box-shadow:0 2px 8px rgba(70,179,126,0.3);"
        onmouseover="this.style.background='#278F5E'"
        onmouseout="this.style.background='#46B37E'">
        + Create Bill
      </button>
    </header>

    <!-- Table -->
    <div class="rounded-xl overflow-hidden" style="background:#fff; border:1px solid #E2E2E2;">
      <table class="w-full text-left">
        <thead style="background:#F6F6F6; border-bottom:1px solid #E2E2E2;">
          <tr>
            <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest" style="color:#C7C7C7;">Date</th>
            <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest" style="color:#C7C7C7;">Supplier</th>
            <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest" style="color:#C7C7C7;">Status</th>
            <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-right" style="color:#C7C7C7;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bill in transactionStore.bills" :key="bill.id"
            class="text-sm transition-colors"
            style="border-bottom:1px solid #F6F6F6;"
            onmouseover="this.style.background='#F6F6F6'"
            onmouseout="this.style.background='transparent'">
            <td class="px-6 py-4 font-mono text-xs" style="color:#999;">{{ bill.date }}</td>
            <td class="px-6 py-4 font-semibold" style="color:#171717;">{{ getSupplierName(bill.supplier_id) }}</td>
            <td class="px-6 py-4">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                style="background:#FFFBEE; color:#E79913;">{{ bill.status }}</span>
            </td>
            <td class="px-6 py-4 text-right font-bold" style="color:#171717;">{{ formatCurrency(bill.total_amount) }}</td>
          </tr>
          <tr v-if="transactionStore.bills.length === 0">
            <td colspan="4" class="px-6 py-20 text-center text-sm" style="color:#C7C7C7;">No bills found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center p-6 z-50"
      style="background:rgba(23,23,23,0.5); backdrop-filter:blur(4px);">
      <div class="w-full max-w-4xl flex flex-col overflow-hidden rounded-xl shadow-2xl"
        style="background:#fff; max-height:90vh;">

        <div class="px-6 py-4 flex justify-between items-center" style="background:#F6F6F6; border-bottom:1px solid #E2E2E2;">
          <h3 class="font-bold text-base" style="color:#171717;">New Purchase Bill</h3>
          <button @click="showModal = false" style="color:#999;"
            onmouseover="this.style.color='#171717'" onmouseout="this.style.color='#999'">×</button>
        </div>

        <form @submit.prevent="handleSave" class="flex-1 overflow-y-auto p-8 space-y-8">
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style="color:#999;">Supplier</label>
              <select v-model="form.supplier_id" required
                class="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                style="background:#F6F6F6; border:1px solid #E2E2E2; color:#171717;">
                <option value="">Select Supplier</option>
                <option v-for="c in partyStore.suppliers" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style="color:#999;">Date</label>
              <input v-model="form.date" type="date" required
                class="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                style="background:#F6F6F6; border:1px solid #E2E2E2; color:#171717;"
                onfocus="this.style.borderColor='#46B37E'" onblur="this.style.borderColor='#E2E2E2'">
            </div>
          </div>

          <div class="space-y-3">
            <h4 class="text-[10px] font-bold uppercase tracking-widest" style="color:#999;">Inventory Items</h4>
            <div class="rounded-xl p-6" style="background:#F6F6F6; border:1px solid #E2E2E2;">
              <table class="w-full border-separate border-spacing-y-2">
                <thead>
                  <tr class="text-left">
                    <th class="text-[10px] uppercase tracking-widest px-2 pb-2" style="color:#C7C7C7;">Item</th>
                    <th class="text-[10px] uppercase tracking-widest px-2 pb-2 w-24" style="color:#C7C7C7;">Qty</th>
                    <th class="text-[10px] uppercase tracking-widest px-2 pb-2 w-32" style="color:#C7C7C7;">Rate</th>
                    <th class="text-[10px] uppercase tracking-widest px-2 pb-2 text-right" style="color:#C7C7C7;">Total</th>
                    <th class="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in form.items" :key="idx">
                    <td class="px-3 py-2.5 rounded-l-lg" style="background:#fff; border:1px solid #E2E2E2; border-right:none;">
                      <select v-model="item.item_id" @change="onItemChange(idx)"
                        class="w-full text-sm outline-none" style="background:transparent; color:#171717;">
                        <option value="">Choose item...</option>
                        <option v-for="i in inventoryStore.items" :key="i.id" :value="i.id">{{ i.name }}</option>
                      </select>
                    </td>
                    <td class="px-3 py-2.5" style="background:#fff; border-top:1px solid #E2E2E2; border-bottom:1px solid #E2E2E2;">
                      <input v-model.number="item.quantity" type="number"
                        class="w-full text-sm outline-none text-center" style="background:transparent; color:#171717;">
                    </td>
                    <td class="px-3 py-2.5" style="background:#fff; border-top:1px solid #E2E2E2; border-bottom:1px solid #E2E2E2;">
                      <input v-model.number="item.rate" type="number" step="0.01"
                        class="w-full text-sm outline-none" style="background:transparent; color:#171717;">
                    </td>
                    <td class="px-3 py-2.5 text-right font-semibold text-sm" style="background:#fff; border-top:1px solid #E2E2E2; border-bottom:1px solid #E2E2E2; color:#171717;">
                      {{ formatCurrency(item.quantity * item.rate) }}
                    </td>
                    <td class="px-2 py-2.5 text-center rounded-r-lg" style="background:#fff; border:1px solid #E2E2E2; border-left:none;">
                      <button @click="removeItem(idx)" type="button" style="color:#E03636;">×</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button @click="addItem" type="button"
                class="mt-3 text-xs font-semibold transition-all"
                style="color:#278F5E;"
                onmouseover="this.style.color='#46B37E'"
                onmouseout="this.style.color='#278F5E'">+ Add Line Item</button>
            </div>
          </div>

          <div class="flex flex-col items-end gap-2 pt-6" style="border-top:1px solid #F0F0F0;">
            <div class="flex justify-between w-64 items-center">
              <span class="text-xs font-semibold uppercase" style="color:#999;">Subtotal</span>
              <span class="text-lg font-bold" style="color:#171717;">{{ formatCurrency(total) }}</span>
            </div>
            <div class="flex justify-between w-64 items-center p-4 rounded-lg mt-2"
              style="background:#EDFBF4; border:1px solid #c6f0db;">
              <span class="text-xs font-bold uppercase" style="color:#278F5E;">Grand Total</span>
              <span class="text-xl font-bold" style="color:#278F5E;">{{ formatCurrency(total) }}</span>
            </div>
          </div>
        </form>

        <div class="px-6 py-4 flex gap-4" style="background:#F6F6F6; border-top:1px solid #E2E2E2;">
          <button type="button" @click="showModal = false"
            class="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
            style="background:#fff; color:#525252; border:1px solid #E2E2E2;"
            onmouseover="this.style.background='#F6F6F6'"
            onmouseout="this.style.background='#fff'">Cancel</button>
          <button @click="handleSave" :disabled="!isFormValid"
            class="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
            style="background:#46B37E; color:#fff; box-shadow:0 2px 8px rgba(70,179,126,0.3);"
            onmouseover="this.style.background='#278F5E'"
            onmouseout="this.style.background='#46B37E'">Save & Update Stock</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
div { font-family: 'Inter', sans-serif; }
</style>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useTransactionStore } from '../stores/transactions';
import { usePartyStore } from '../stores/parties';
import { useInventoryStore } from '../stores/inventory';
import { useCompanyStore } from '../stores/company';

const transactionStore = useTransactionStore();
const partyStore = usePartyStore();
const inventoryStore = useInventoryStore();
const companyStore = useCompanyStore();

const showModal = ref(false);

const form = ref({
    supplier_id: '',
    date: new Date().toISOString().split('T')[0],
    items: [
        { item_id: '', quantity: 1, rate: 0, total: 0 }
    ],
    tax_amount: 0,
    total_amount: 0
});

const total = computed(() => {
    return form.value.items.reduce((sum, i) => sum + (i.quantity * i.rate), 0);
});

const isFormValid = computed(() => {
    return form.value.supplier_id && form.value.items.length > 0 && form.value.items.every(i => i.item_id && i.quantity > 0);
});

onMounted(() => {
    transactionStore.fetchBills();
    partyStore.fetchParties();
    inventoryStore.fetchItems();
});

function addItem() {
    form.value.items.push({ item_id: '', quantity: 1, rate: 0, total: 0 });
}

function removeItem(idx: number) {
    if (form.value.items.length > 1) {
        form.value.items.splice(idx, 1);
    }
}

function onItemChange(idx: number) {
    const item = inventoryStore.items.find(i => i.id === form.value.items[idx].item_id);
    if (item) {
        form.value.items[idx].rate = item.purchase_rate;
    }
}

async function handleSave() {
    await transactionStore.createBill({
        ...form.value,
        total_amount: total.value,
        paid_amount: 0,
        outstanding_amount: total.value
    });
    showModal.value = false;
    form.value = {
        supplier_id: '',
        date: new Date().toISOString().split('T')[0],
        items: [{ item_id: '', quantity: 1, rate: 0, total: 0 }],
        tax_amount: 0,
        total_amount: 0
    };
}

function getSupplierName(id: string) {
    return partyStore.parties.find(p => p.id === id)?.name || 'Unknown';
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: companyStore.company?.currency || 'PKR'
  }).format(val || 0);
}
</script>
