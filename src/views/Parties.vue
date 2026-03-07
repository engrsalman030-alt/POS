<template>
  <div class="p-8 max-w-6xl mx-auto" style="font-family:'Inter',sans-serif;">

    <!-- Header -->
    <header class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold" style="color:#171717;">Parties</h1>
        <p class="text-sm mt-1" style="color:#999;">Manage relationships and account balances.</p>
      </div>
      <button @click="showModal = true"
        class="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
        style="background:#46B37E; color:#fff; box-shadow:0 2px 8px rgba(70,179,126,0.3);"
        onmouseover="this.style.background='#278F5E'"
        onmouseout="this.style.background='#46B37E'">
        + Add New Party
      </button>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <!-- Customers -->
      <div class="rounded-xl overflow-hidden" style="background:#fff; border:1px solid #E2E2E2;">
        <div class="px-6 py-4 flex justify-between items-center" style="background:#EDFBF4; border-bottom:1px solid #c6f0db;">
          <h2 class="text-xs font-bold uppercase tracking-widest" style="color:#278F5E;">Customers</h2>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full" style="background:#46B37E; color:#fff;">
            {{ partyStore.customers.length }}
          </span>
        </div>
        <div style="min-height:100px;">
          <div v-for="p in partyStore.customers" :key="p.id"
            class="px-6 py-4 flex justify-between items-center transition-colors"
            style="border-bottom:1px solid #F6F6F6;"
            onmouseover="this.style.background='#F6F6F6'"
            onmouseout="this.style.background='transparent'">
            <div>
              <p class="font-semibold text-sm" style="color:#171717;">{{ p.name }}</p>
              <p class="text-xs mt-0.5" style="color:#C7C7C7;">{{ p.email || 'No email' }}</p>
            </div>
            <div class="text-right">
              <p class="text-[10px] font-bold uppercase" style="color:#C7C7C7;">Balance</p>
              <p class="text-sm font-bold mt-0.5" style="color:#171717;">{{ formatCurrency(0) }}</p>
            </div>
          </div>
          <div v-if="partyStore.customers.length === 0"
            class="p-10 text-center text-sm" style="color:#C7C7C7;">
            No customers yet.
          </div>
        </div>
      </div>

      <!-- Suppliers -->
      <div class="rounded-xl overflow-hidden" style="background:#fff; border:1px solid #E2E2E2;">
        <div class="px-6 py-4 flex justify-between items-center" style="background:#FFF0F0; border-bottom:1px solid #ffd6d6;">
          <h2 class="text-xs font-bold uppercase tracking-widest" style="color:#E03636;">Suppliers</h2>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full" style="background:#E03636; color:#fff;">
            {{ partyStore.suppliers.length }}
          </span>
        </div>
        <div style="min-height:100px;">
          <div v-for="p in partyStore.suppliers" :key="p.id"
            class="px-6 py-4 flex justify-between items-center transition-colors"
            style="border-bottom:1px solid #F6F6F6;"
            onmouseover="this.style.background='#F6F6F6'"
            onmouseout="this.style.background='transparent'">
            <div>
              <p class="font-semibold text-sm" style="color:#171717;">{{ p.name }}</p>
              <p class="text-xs mt-0.5" style="color:#C7C7C7;">{{ p.email || 'No email' }}</p>
            </div>
            <div class="text-right">
              <p class="text-[10px] font-bold uppercase" style="color:#C7C7C7;">Payable</p>
              <p class="text-sm font-bold mt-0.5" style="color:#171717;">{{ formatCurrency(0) }}</p>
            </div>
          </div>
          <div v-if="partyStore.suppliers.length === 0"
            class="p-10 text-center text-sm" style="color:#C7C7C7;">
            No suppliers yet.
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center p-6 z-50"
      style="background:rgba(23,23,23,0.5); backdrop-filter:blur(4px);">
      <div class="w-full max-w-lg rounded-xl overflow-hidden shadow-2xl" style="background:#fff;">

        <div class="px-6 py-4 flex justify-between items-center" style="border-bottom:1px solid #E2E2E2;">
          <h3 class="font-bold text-base" style="color:#171717;">New Party</h3>
          <button @click="showModal = false"
            class="w-7 h-7 rounded-full flex items-center justify-center text-lg"
            style="color:#999;"
            onmouseover="this.style.background='#F6F6F6'"
            onmouseout="this.style.background='transparent'">×</button>
        </div>

        <form @submit.prevent="handleAdd" class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style="color:#999;">Party Type</label>
              <select v-model="form.type"
                class="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                style="background:#F6F6F6; border:1px solid #E2E2E2; color:#171717;">
                <option value="Customer">Customer</option>
                <option value="Supplier">Supplier</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style="color:#999;">Company / Person Name</label>
            <input v-model="form.name" type="text" required placeholder="e.g. ABC Trading"
              class="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
              style="background:#F6F6F6; border:1px solid #E2E2E2; color:#171717;"
              onfocus="this.style.borderColor='#46B37E'; this.style.background='#fff'"
              onblur="this.style.borderColor='#E2E2E2'; this.style.background='#F6F6F6'">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style="color:#999;">NTN / CNIC</label>
              <input v-model="form.tax_id" type="text" placeholder="e.g. 1234567-8"
                class="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                style="background:#F6F6F6; border:1px solid #E2E2E2; color:#171717;"
                onfocus="this.style.borderColor='#46B37E'; this.style.background='#fff'"
                onblur="this.style.borderColor='#E2E2E2'; this.style.background='#F6F6F6'">
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style="color:#999;">Email</label>
              <input v-model="form.email" type="email"
                class="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                style="background:#F6F6F6; border:1px solid #E2E2E2; color:#171717;"
                onfocus="this.style.borderColor='#46B37E'; this.style.background='#fff'"
                onblur="this.style.borderColor='#E2E2E2'; this.style.background='#F6F6F6'">
            </div>
          </div>

          <div class="pt-4 flex gap-3" style="border-top:1px solid #F0F0F0;">
            <button type="button" @click="showModal = false"
              class="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style="background:#F6F6F6; color:#525252; border:1px solid #E2E2E2;"
              onmouseover="this.style.background='#EDEDED'"
              onmouseout="this.style.background='#F6F6F6'">Cancel</button>
            <button type="submit"
              class="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style="background:#46B37E; color:#fff; box-shadow:0 2px 8px rgba(70,179,126,0.3);"
              onmouseover="this.style.background='#278F5E'"
              onmouseout="this.style.background='#46B37E'">Create Party</button>
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
import { usePartyStore } from '../stores/parties';
import { useCompanyStore } from '../stores/company';

const partyStore = usePartyStore();
const companyStore = useCompanyStore();
const showModal = ref(false);

const form = ref({
    name: '',
    type: 'Customer' as any,
    email: '',
    phone: '',
    address: '',
    tax_id: '',
    receivable_account_id: 'ar',
    payable_account_id: 'ap'
});

onMounted(() => {
    partyStore.fetchParties();
});

async function handleAdd() {
    await partyStore.addParty(form.value);
    showModal.value = false;
    form.value = { name: '', type: 'Customer', email: '', phone: '', address: '', tax_id: '', receivable_account_id: 'ar', payable_account_id: 'ap' };
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: companyStore.company?.currency || 'PKR'
  }).format(val || 0);
}
</script>
