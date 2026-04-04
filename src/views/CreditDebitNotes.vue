<template>
  <div class="min-h-screen bg-app-bg text-text-primary font-inter pb-20">
    <!-- HEADER -->
    <header class="sticky top-0 z-50 bg-card-bg border-b border-border px-6 py-4 shadow-sm">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-black tracking-tighter text-text-primary">📝 Credit & Debit Notes</h1>
          <p class="text-sm font-bold text-text-muted mt-1">Manage returns, credits, and debit notes</p>
        </div>
        <button @click="openNewNote" class="px-6 py-3 bg-brand text-white rounded-xl font-black uppercase tracking-widest hover:opacity-90 transition-all active:scale-95">
          + New Note
        </button>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-6 py-10">
      <!-- FILTERS & SEARCH -->
      <div class="bg-card-bg border border-border rounded-2xl p-6 mb-8 flex gap-4 items-end">
        <div class="flex-1">
          <label class="text-xs font-bold text-text-muted uppercase mb-2 block">Search Party / Document</label>
          <input v-model="searchTerm" type="text" placeholder="Search..." class="w-full bg-hover-bg border border-border rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-brand/20" />
        </div>
        <div class="w-40">
          <label class="text-xs font-bold text-text-muted uppercase mb-2 block">Type</label>
          <select v-model="filterType" class="w-full bg-hover-bg border border-border rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-brand/20">
            <option value="">All Types</option>
            <option value="Credit Note">Credit Note</option>
            <option value="Debit Note">Debit Note</option>
          </select>
        </div>
        <div class="w-40">
          <label class="text-xs font-bold text-text-muted uppercase mb-2 block">Status</label>
          <select v-model="filterStatus" class="w-full bg-hover-bg border border-border rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-brand/20">
            <option value="">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Submitted">Submitted</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <!-- NOTES LIST -->
      <div class="space-y-4">
        <div v-if="filteredNotes.length === 0" class="bg-card-bg border border-border rounded-2xl p-12 text-center">
          <p class="text-text-muted font-bold">No notes found</p>
        </div>

        <div v-for="note in filteredNotes" :key="note.id" class="bg-card-bg border border-border rounded-2xl p-6 hover:shadow-md transition-all">
          <div class="flex items-start justify-between mb-4">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <span v-if="note.type === 'Credit Note'" class="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg text-xs font-black uppercase">
                  📋 Credit Note
                </span>
                <span v-else class="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-lg text-xs font-black uppercase">
                  📋 Debit Note
                </span>
                <span :class="['px-3 py-1 rounded-lg text-xs font-black uppercase', 
                  note.status === 'Draft' ? 'bg-slate-500/10 text-slate-600' : 
                  note.status === 'Submitted' ? 'bg-emerald-500/10 text-emerald-600' : 
                  'bg-rose-500/10 text-rose-600']">
                  {{ note.status }}
                </span>
              </div>
              <h3 class="text-lg font-black text-text-primary">{{ note.type }} - {{ note.id?.substring(0, 8) }}</h3>
            </div>
            <div class="text-right">
              <p class="text-2xl font-black text-brand">{{ formatAmount(note.amount) }}</p>
              <p class="text-xs text-text-muted font-bold mt-1">{{ note.date }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 py-4 border-y border-border">
            <div>
              <p class="text-xs font-bold text-text-muted uppercase">Party</p>
              <p class="font-bold text-sm mt-1">{{ note.party_name }}</p>
            </div>
            <div>
              <p class="text-xs font-bold text-text-muted uppercase">Reference</p>
              <p class="font-bold text-sm mt-1">{{ note.reference_invoice_id?.substring(0, 8) || '-' }}</p>
            </div>
            <div>
              <p class="text-xs font-bold text-text-muted uppercase">Reason</p>
              <p class="font-bold text-sm mt-1">{{ note.reason || '-' }}</p>
            </div>
            <div>
              <p class="text-xs font-bold text-text-muted uppercase">Items</p>
              <p class="font-bold text-sm mt-1">{{ note.items?.length || 0 }}</p>
            </div>
          </div>

          <div v-if="note.items && note.items.length > 0" class="mb-6">
            <p class="text-xs font-black uppercase text-text-muted mb-3">Line Items</p>
            <div class="space-y-2">
              <div v-for="item in note.items" :key="item.id" class="flex justify-between items-center text-xs bg-hover-bg/30 p-3 rounded-lg">
                <span class="font-bold">{{ item.item_name }}</span>
                <span class="text-right">
                  <span class="font-black">Qty: {{ item.quantity }}</span>
                  <span class="ml-4 font-black text-text-muted">@ {{ formatAmount(item.rate) }}</span>
                </span>
              </div>
            </div>
          </div>

          <div class="flex gap-3 justify-end">
            <button v-if="note.status === 'Draft'" @click="editNote(note)" class="px-4 py-2 bg-hover-bg text-text-primary rounded-lg text-xs font-bold hover:bg-hover-bg/80 transition-all">
              ✎ Edit
            </button>
            <button v-if="note.status === 'Draft'" @click="submitNote(note.id)" class="px-4 py-2 bg-brand text-white rounded-lg text-xs font-bold hover:opacity-90 transition-all">
              Submit
            </button>
            <button @click="viewNote(note)" class="px-4 py-2 bg-brand/10 text-brand rounded-lg text-xs font-bold hover:bg-brand/20 transition-all">
              View
            </button>
            <button v-if="note.status !== 'Cancelled'" @click="cancelNote(note.id)" class="px-4 py-2 bg-rose-500/10 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-500 hover:text-white transition-all">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- NEW/EDIT NOTE MODAL -->
    <Teleport to="body">
      <div v-if="showNoteModal" class="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
        <div class="bg-card-bg border border-border rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div class="p-10">
            <header class="mb-8 flex justify-between items-start">
              <div>
                <h2 class="text-2xl font-black tracking-tighter text-text-primary">{{ editingNote ? 'Edit' : 'Create' }} Credit/Debit Note</h2>
              </div>
              <button @click="showNoteModal = false" class="w-10 h-10 rounded-full bg-hover-bg flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">✕</button>
            </header>

            <form @submit.prevent="saveNote" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="text-xs font-bold text-text-muted uppercase mb-2 block">Note Type</label>
                  <select v-model="noteForm.type" class="w-full bg-hover-bg border border-border rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-brand/20">
                    <option value="Credit Note">Credit Note</option>
                    <option value="Debit Note">Debit Note</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs font-bold text-text-muted uppercase mb-2 block">Date</label>
                  <input v-model="noteForm.date" type="date" class="w-full bg-hover-bg border border-border rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-brand/20" />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="text-xs font-bold text-text-muted uppercase mb-2 block">Party</label>
                  <input v-model="noteForm.party_id" type="text" placeholder="Party name or ID" class="w-full bg-hover-bg border border-border rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-brand/20" />
                </div>
                <div>
                  <label class="text-xs font-bold text-text-muted uppercase mb-2 block">Reference Invoice/Bill</label>
                  <input v-model="noteForm.reference_invoice_id" type="text" placeholder="Original doc ID" class="w-full bg-hover-bg border border-border rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-brand/20" />
                </div>
              </div>

              <div>
                <label class="text-xs font-bold text-text-muted uppercase mb-2 block">Reason</label>
                <textarea v-model="noteForm.reason" rows="3" placeholder="Why is this note being created?" class="w-full bg-hover-bg border border-border rounded-xl px-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-brand/20 resize-none"></textarea>
              </div>

              <div class="flex gap-4 pt-4 border-t border-border">
                <button type="button" @click="showNoteModal = false" class="flex-1 px-6 py-3 rounded-xl border border-border text-sm font-black uppercase hover:bg-hover-bg transition-all">
                  Cancel
                </button>
                <button type="submit" class="flex-1 px-6 py-3 rounded-xl bg-brand text-white text-sm font-black uppercase hover:opacity-90 transition-all">
                  {{ editingNote ? 'Update' : 'Create' }} Note
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useToastStore } from '../stores/toast';

const toastStore = useToastStore();

const showNoteModal = ref(false);
const searchTerm = ref('');
const filterType = ref('');
const filterStatus = ref('');
const editingNote = ref<any>(null);

const notes = ref<any[]>([
  // Sample data - will be replaced with actual DB data
  {
    id: 'CDN-001',
    type: 'Credit Note',
    date: '2024-04-01',
    party_name: 'Ahmed Pharma Shop',
    amount: 25000,
    status: 'Submitted',
    reference_invoice_id: 'INV-001',
    reason: 'Damaged goods returned',
    items: [
      { id: '1', item_name: 'Antibiotics Tablet', quantity: 20, rate: 1250 }
    ]
  }
]);

const noteForm = ref({
  type: 'Credit Note',
  date: new Date().toISOString().split('T')[0],
  party_id: '',
  reference_invoice_id: '',
  reason: '',
  amount: 0
});

const filteredNotes = computed(() => {
  return notes.value.filter(n => {
    const matchesSearch = n.party_name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                         n.id.toLowerCase().includes(searchTerm.value.toLowerCase());
    const matchesType = !filterType.value || n.type === filterType.value;
    const matchesStatus = !filterStatus.value || n.status === filterStatus.value;
    return matchesSearch && matchesType && matchesStatus;
  });
});

function formatAmount(val: number | undefined) {
  return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(val || 0);
}

function openNewNote() {
  editingNote.value = null;
  noteForm.value = {
    type: 'Credit Note',
    date: new Date().toISOString().split('T')[0],
    party_id: '',
    reference_invoice_id: '',
    reason: '',
    amount: 0
  };
  showNoteModal.value = true;
}

function editNote(note: any) {
  editingNote.value = note;
  noteForm.value = { ...note };
  showNoteModal.value = true;
}

function viewNote(note: any) {
  console.log('View note:', note);
}

async function saveNote() {
  try {
    if (editingNote.value) {
      // Update existing note
      const idx = notes.value.findIndex(n => n.id === editingNote.value.id);
      if (idx >= 0) {
        notes.value[idx] = { ...editingNote.value, ...noteForm.value };
      }
      toastStore.success('Note updated successfully');
    } else {
      // Create new note
      const newNote = {
        id: `CDN-${Date.now()}`,
        ...noteForm.value,
        status: 'Draft',
        items: []
      };
      notes.value.push(newNote);
      toastStore.success('Note created successfully');
    }
    showNoteModal.value = false;
  } catch (err) {
    toastStore.error('Failed to save note');
  }
}

async function submitNote(noteId: string) {
  const note = notes.value.find(n => n.id === noteId);
  if (note) {
    note.status = 'Submitted';
    toastStore.success('Note submitted');
  }
}

async function cancelNote(noteId: string) {
  const note = notes.value.find(n => n.id === noteId);
  if (note) {
    note.status = 'Cancelled';
    toastStore.success('Note cancelled');
  }
}
</script>
