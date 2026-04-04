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

      <!-- Payment Method Type (Cash, Cheque, Bank, etc) -->
      <div>
        <label class="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 italic">Payment Method Type</label>
        <select v-model="form.payment_method" 
          class="w-full bg-hover-bg border border-border rounded-xl px-4 py-3 text-xs font-bold text-text-primary outline-none focus:ring-2 focus:ring-brand/20 transition-all">
          <option value="">Select Method...</option>
          <option value="Cash">Cash</option>
          <option value="Cheque">Cheque</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Mobile Money">Mobile Money</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <!-- Account (Bank/Cash) -->
      <div>
        <label class="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 italic">Account / Bank</label>
        <AutoCompleteWithCreate
           v-model="form.account_id"
           :options="accountStore.accounts.filter(a => a.type === 'Asset').map(a => ({ id: a.id, name: a.name, sub: a.code }))"
           placeholder="Search Bank/Cash..."
           allow-free-text
        />
      </div>

      <!-- Cheque Details (show only if payment_method is 'Cheque') -->
      <div v-if="form.payment_method === 'Cheque'" class="col-span-1 md:col-span-2">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 italic">Cheque Number</label>
            <input v-model="form.cheque_number" type="text" placeholder="e.g. CHK-001234"
              class="w-full bg-hover-bg border border-border rounded-xl px-4 py-3 text-sm font-bold text-text-primary focus:ring-2 focus:ring-brand/20 outline-none transition-all" />
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 italic">Cheque Date</label>
            <input v-model="form.cheque_date" type="date"
              class="w-full bg-hover-bg border border-border rounded-xl px-4 py-3 text-sm font-bold text-text-primary focus:ring-2 focus:ring-brand/20 outline-none transition-all" />
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 italic">Cleared?</label>
            <select v-model="form.is_cleared" class="w-full bg-hover-bg border border-border rounded-xl px-4 py-3 text-xs font-bold text-text-primary outline-none focus:ring-2 focus:ring-brand/20 transition-all">
              <option :value="false">Pending</option>
              <option :value="true">Cleared</option>
            </select>
          </div>
        </div>
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
  date: '',
  party_id: props.party?.id || '',
  party_type: props.party?.type || '',
  payment_type: '',
  payment_method: '',
  account_id: '',
  amount: 0,
  cheque_number: '',
  cheque_date: '',
  is_cleared: false,
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
