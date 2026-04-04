<template>
  <div class="page-container">
    
    <!-- HEADER -->
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 class="text-heading uppercase">Staff Management</h1>
        <p class="text-subheading underline decoration-brand/20 underline-offset-4 uppercase italic tracking-widest">HR, Sales & Delivery Force Personnel</p>
      </div>
      <button @click="openModal()" class="btn-primary w-full md:w-auto px-6">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12h14"/></svg>
        Add Staff
      </button>
    </header>

    <!-- LIST -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div v-for="s in staffStore.staff" :key="s.id" 
        class="bg-card-bg border border-border rounded-2xl p-5 hover:border-brand/40 transition-all hover:shadow-xl hover:shadow-brand/5 group relative overflow-hidden"
      >
        <div class="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full -mr-12 -mt-12 group-hover:bg-brand/10 transition-colors"></div>
        
        <div class="flex items-start justify-between relative z-10">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold" 
              :class="s.role === 'SSR' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'">
              {{ s.role === 'SSR' ? '🩺' : '🚚' }}
            </div>
            <div>
              <h3 class="font-bold text-text-primary text-sm uppercase tracking-tight">{{ s.name }}</h3>
              <div class="flex items-center gap-2 mt-1">
                <span class="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest" 
                  :class="s.role === 'SSR' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'">
                  {{ s.role }}
                </span>
                <span class="text-[9px] font-bold text-text-muted">{{ s.phone || 'No Phone' }}</span>
              </div>
            </div>
          </div>
          <button @click="openModal(s)" class="p-2 text-text-muted hover:text-brand transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>
        </div>
      </div>
    </div>

    <!-- EMPTY STATE -->
    <div v-if="staffStore.staff.length === 0" class="py-20 text-center space-y-4">
      <div class="w-20 h-20 bg-hover-bg rounded-3xl mx-auto flex items-center justify-center text-3xl opacity-20">👥</div>
      <div class="max-w-xs mx-auto">
        <p class="font-bold text-text-primary uppercase tracking-widest text-[10px]">No sales team found</p>
        <p class="text-xs text-text-muted mt-1 leading-relaxed">Add your Secondary Sales Reps and Delivery Sales Reps to get started.</p>
      </div>
    </div>

    <!-- MODAL -->
    <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div class="bg-card-bg w-full max-w-md rounded-2xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
        <div class="px-6 py-4 border-b border-border flex justify-between items-center bg-hover-bg/30">
          <h2 class="text-xs font-black uppercase tracking-widest">{{ isEditing ? 'Edit Team Member' : 'New Team Member' }}</h2>
          <button @click="showModal = false" class="text-text-muted hover:text-text-primary transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
        </div>
        
        <form @submit.prevent="save" class="p-6">
          <!-- Form Scrollable Area -->
          <div class="h-[50vh] overflow-y-auto pr-2 custom-scrollbar space-y-6">
            
            <!-- Basic Info Section -->
            <div class="space-y-4">
              <h3 class="text-[10px] font-black text-brand uppercase tracking-[0.2em] border-b border-border pb-1">Basic Info</h3>
              
              <div class="space-y-1">
                <label class="block text-[10px] font-bold text-text-muted uppercase tracking-widest">Full Name *</label>
                <input v-model="form.name" type="text" required placeholder="e.g. Ali Ahmed" class="w-full bg-hover-bg border border-border rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-brand/20 transition-all"/>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="block text-[10px] font-bold text-text-muted uppercase tracking-widest">Phone</label>
                  <input v-model="form.phone" type="text" placeholder="03xx-xxxxxxx" class="w-full bg-hover-bg border border-border rounded-xl px-4 py-3 text-xs font-mono font-bold outline-none border-transparent focus:border-brand"/>
                </div>
                <div class="space-y-1">
                  <label class="block text-[10px] font-bold text-text-muted uppercase tracking-widest">CNIC</label>
                  <input v-model="form.cnic" type="text" placeholder="00000-0000000-0" class="w-full bg-hover-bg border border-border rounded-xl px-4 py-3 text-xs font-mono font-bold outline-none border-transparent focus:border-brand"/>
                </div>
              </div>

              <div class="space-y-1">
                <label class="block text-[10px] font-bold text-text-muted uppercase tracking-widest">Address</label>
                <input v-model="form.address" type="text" placeholder="Street, City" class="w-full bg-hover-bg border border-border rounded-xl px-4 py-3 text-xs font-bold outline-none"/>
              </div>
            </div>

            <!-- Job Info Section -->
            <div class="space-y-4">
              <h3 class="text-[10px] font-black text-brand uppercase tracking-[0.2em] border-b border-border pb-1">Job Info</h3>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="block text-[10px] font-bold text-text-muted uppercase tracking-widest">Role *</label>
                  <select v-model="form.role" class="w-full bg-hover-bg border border-border rounded-xl px-4 py-3 text-xs font-bold outline-none border-transparent focus:border-brand h-[42px]">
                    <option value="SSR">SSR (Order Taker)</option>
                    <option value="DSR">DSR (Delivery)</option>
                    <option value="Sales Manager">Sales Manager</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div class="space-y-1">
                  <label class="block text-[10px] font-bold text-text-muted uppercase tracking-widest">Salary</label>
                  <input v-model.number="form.salary" type="number" placeholder="0.00" class="w-full bg-hover-bg border border-border rounded-xl px-4 py-3 text-xs font-bold outline-none border-transparent focus:border-brand h-[42px]"/>
                </div>
              </div>

              <div class="space-y-1">
                <label class="block text-[10px] font-bold text-text-muted uppercase tracking-widest">Joining Date</label>
                <input v-model="form.joining_date" type="date" class="w-full bg-hover-bg border border-border rounded-xl px-4 py-3 text-xs font-bold outline-none font-mono"/>
              </div>
            </div>

            <!-- Status Section -->
            <div class="space-y-4">
              <h3 class="text-[10px] font-black text-brand uppercase tracking-[0.2em] border-b border-border pb-1">Network Status</h3>
              
              <div class="flex items-center gap-3 bg-hover-bg/50 p-4 rounded-xl border border-border">
                <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input v-model="form.is_active" :true-value="1" :false-value="0" type="checkbox" name="toggle" id="toggle" class="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer" style="border-color: var(--card-bg) !important;"/>
                    <label for="toggle" class="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"></label>
                </div>
                <div>
                  <label class="text-xs font-bold text-text-primary block leading-none">Active Employee</label>
                  <span class="text-[10px] text-text-muted mt-1 leading-none">Can login and access the system</span>
                </div>
              </div>
            </div>

          </div>

          <!-- Footer Buttons -->
          <div class="pt-6 mt-2 border-t border-border flex gap-4 bg-card-bg">
             <button type="button" @click="showModal = false" class="btn-ghost border border-border flex-1">Cancel</button>
             <button type="submit" class="btn-primary flex-1">Save Profile</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStaffStore, type Staff } from '../stores/staff';

const staffStore = useStaffStore();
const showModal = ref(false);
const isEditing = ref(false);

const form = ref<any>({
  name: '',
  role: '',
  phone: '',
  cnic: '',
  address: '',
  salary: '',
  joining_date: '',
  is_active: 0
});

onMounted(() => {
  staffStore.fetchStaff();
});

function openModal(member?: Staff) {
  if (member) {
    form.value = { ...member };
    isEditing.value = true;
  } else {
    form.value = { name: '', role: '', phone: '', cnic: '', address: '', salary: '', joining_date: '', is_active: 0 };
    isEditing.value = false;
  }
  showModal.value = true;
}

async function save() {
  if (isEditing.value) {
    await staffStore.updateStaff(form.value);
  } else {
    await staffStore.addStaff(form.value);
  }
  showModal.value = false;
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
.font-inter { font-family: 'Inter', sans-serif; }
</style>
