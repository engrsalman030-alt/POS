<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Party (If not passed from props) -->
      <div v-if="!props.party" class="col-span-1 md:col-span-2">
        <label class="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 italic">Select Party</label>
        <AutoCompleteWithCreate
           v-model="form.party_id"
           :options="[...partyStore.customers, ...partyStore.suppliers].map(p => ({ id: p.id, name: p.name, sub: p.type }))"
           placeholder="Search Customer or Supplier..."
           @select="(opt) => { form.party_type = (opt as any).sub; form.payment_type = (opt as any).sub === 'Supplier' ? 'Pay' : 'Receive'; }"
        />
      </div>

      <!-- Date -->
      <div>
        <label class="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 italic">Payment Date</label>
        <input v-model="form.date" type="date" required
          class="w-full bg-hover-bg border border-border rounded-xl px-4 py-3 text-sm font-bold text-text-primary focus:ring-2 focus:ring-brand/20 outline-none transition-all" />
      </div>

      <!-- Payment Type (Read only based on context usually, but selectable here) -->
      <div>
        <label class="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 italic">Transaction Type</label>
        <AutoCompleteWithCreate
           v-model="form.payment_type"
           :options="[{id:'Receive',name:'Receive (from Customer)'},{id:'Pay',name:'Pay (to Supplier)'}]"
           placeholder="Type"
           allow-free-text
        />
      </div>

      <!-- Amount -->
      <div>
        <label class="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 italic">Amount (PKR)</label>
        <div class="relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold text-xs">Rs.</span>
          <input v-model.number="form.amount" type="number" step="0.01" required
            class="w-full bg-hover-bg border border-border rounded-xl pl-12 pr-4 py-3 text-sm font-black text-text-primary focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" />
        </div>
      </div>

      <!-- Account (Bank/Cash) -->
      <div>
        <label class="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 italic">Payment Method</label>
        <AutoCompleteWithCreate
           v-model="form.account_id"
           :options="accountStore.accounts.filter(a => a.type === 'Asset').map(a => ({ id: a.id, name: a.name, sub: a.code }))"
           placeholder="Search Bank/Cash..."
           allow-free-text
        />
      </div>
    </div>

    <!-- Memo -->
    <div>
      <label class="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 italic">Memo / Reference</label>
      <textarea v-model="form.memo" rows="2" placeholder="e.g. Check #1234, Online Transfer Ref..."
        class="w-full bg-hover-bg border border-border rounded-xl px-4 py-3 text-sm font-medium text-text-primary focus:ring-2 focus:ring-brand/20 outline-none transition-all resize-none"></textarea>
    </div>

    <div class="flex gap-4 pt-4 border-t border-border">
      <button type="button" @click="$emit('cancel')"
        class="flex-1 px-6 py-3 rounded-xl border border-border text-[10px] font-black uppercase tracking-widest text-text-secondary hover:bg-hover-bg transition-all active:scale-95">
        Cancel
      </button>
      <button type="submit"
        class="flex-1 px-6 py-3 rounded-xl bg-text-primary text-card-bg text-[10px] font-black uppercase tracking-widest hover:opacity-90 shadow-xl transition-all active:scale-95">
        Post Payment
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Party } from '../types/party';
import AutoCompleteWithCreate from './AutoCompleteWithCreate.vue';
import { useAccountStore } from '../stores/accounts';
import { usePartyStore } from '../stores/parties';
import { useToastStore } from '../stores/toast';

const accountStore = useAccountStore();
const partyStore = usePartyStore();
const toastStore = useToastStore();

const props = defineProps<{
  party?: Party | null;
}>();

const emit = defineEmits(['submit', 'cancel']);

const form = ref({
  date: new Date().toISOString().split('T')[0],
  party_id: props.party?.id || '',
  party_type: props.party?.type || 'Customer',
  payment_type: props.party?.type === 'Supplier' ? 'Pay' : 'Receive',
  account_id: 'cash',
  amount: 0,
  memo: ''
});

onMounted(() => {
   accountStore.fetchAccounts();
   if (partyStore.customers.length === 0 && partyStore.suppliers.length === 0) {
      partyStore.fetchParties();
   }
});

function handleSubmit() {
    if (form.value.amount <= 0) {
        toastStore.warning('Amount must be greater than 0');
        return;
    }
    emit('submit', { ...form.value });
}
</script>
