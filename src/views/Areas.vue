<template>
  <div class="page-container">
    <!-- Header -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h1 class="text-heading">Geographic Areas</h1>
        <p class="text-subheading">Manage distribution regions and customer sectors</p>
      </div>
      <button @click="openAddModal" class="btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        New Area
      </button>
    </div>

    <!-- Stats Row (Optional, showing distribution) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
       <div class="card-std p-6 flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-brand/10 text-brand flex items-center justify-center">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <p class="text-[10px] font-black uppercase text-text-muted tracking-widest">Total Regions</p>
            <h3 class="text-2xl font-black text-text-primary tabular-nums">{{ areaStore.areas.length }}</h3>
          </div>
       </div>
    </div>

    <!-- Search & Filter -->
    <div class="mb-6">
      <div class="relative max-w-md">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search areas..." 
          class="w-full bg-card-bg border border-border rounded-xl px-4 py-2.5 pl-10 text-xs font-bold outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
        />
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </div>
    </div>

    <!-- Areas List -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div v-for="area in filteredAreas" :key="area.id" 
        class="group bg-card-bg border border-border rounded-2xl p-5 hover:shadow-xl hover:border-brand/40 transition-all duration-300 flex flex-col gap-4 relative overflow-hidden"
      >
        <!-- Background Accent -->
        <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-brand/5 rounded-full blur-2xl group-hover:bg-brand/10 transition-colors"></div>

        <div class="flex items-center justify-between relative z-10">
          <div class="w-10 h-10 rounded-xl bg-hover-bg flex items-center justify-center text-brand font-black group-hover:scale-110 transition-transform">
             {{ area.name.charAt(0).toUpperCase() }}
          </div>
          <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button @click="openEditModal(area)" class="p-2 hover:bg-brand/10 text-brand rounded-lg transition-colors" title="Edit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button @click="handleDelete(area)" class="p-2 hover:bg-rose-500/10 text-rose-500 rounded-lg transition-colors" title="Delete">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </button>
          </div>
        </div>

        <div class="relative z-10">
          <h3 class="text-sm font-black text-text-primary uppercase tracking-tight truncate">{{ area.name }}</h3>
          <p class="text-[9px] font-bold text-text-muted uppercase tracking-widest mt-0.5 opacity-60">Distribution Sector</p>
        </div>

        <!-- Status Tag -->
        <div class="mt-2 relative z-10">
          <span class="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest"
            :class="area.is_active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-text-muted/10 text-text-muted'">
            {{ area.is_active ? 'Active' : 'Archived' }}
          </span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredAreas.length === 0" class="col-span-full py-20 flex flex-col items-center justify-center text-center opacity-60">
        <div class="w-16 h-16 rounded-full bg-hover-bg flex items-center justify-center mb-4">
           <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
        </div>
        <p class="text-xs font-bold uppercase tracking-widest">No areas found</p>
        <button @click="openAddModal" class="mt-4 text-xs font-black text-brand underline uppercase tracking-tighter">Create first area</button>
      </div>
    </div>

    <!-- Modal for Add/Edit -->
    <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div class="bg-card-bg border border-border shadow-2xl rounded-[2rem] w-full max-w-md overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
        <div class="px-8 py-6 border-b border-border flex justify-between items-center bg-hover-bg/30">
           <div>
              <h3 class="text-lg font-black text-text-primary uppercase tracking-tighter">{{ editMode ? 'Edit Area' : 'New Area' }}</h3>
              <p class="text-[9px] text-text-muted font-bold uppercase tracking-widest mt-0.5">Define Distribution Region</p>
           </div>
           <button @click="showModal = false" class="w-8 h-8 rounded-full hover:bg-hover-bg flex items-center justify-center text-text-muted transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
           </button>
        </div>

        <form @submit.prevent="handleSave" class="p-8 space-y-6">
          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase text-text-muted tracking-widest">Area Name</label>
            <input 
              v-model="form.name"
              type="text"
              required
              class="w-full bg-hover-bg/30 border border-border rounded-xl px-4 py-3 text-sm font-bold placeholder:text-text-muted/40 outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
              placeholder="e.g. Khwaza Khela, Swat..."
            />
          </div>

          <div class="flex items-center gap-3">
             <input v-model="form.is_active" type="checkbox" id="is_active" class="w-4 h-4 rounded border-border text-brand focus:ring-brand"/>
             <label for="is_active" class="text-[10px] font-black uppercase text-text-primary tracking-widest cursor-pointer">Active Distribution Region</label>
          </div>

          <div class="pt-4 flex gap-3">
            <button type="button" @click="showModal = false" class="flex-1 px-6 py-3 rounded-xl border border-border text-xs font-black uppercase tracking-widest hover:bg-hover-bg transition-all">Cancel</button>
            <button type="submit" class="flex-1 px-6 py-3 rounded-xl bg-brand text-white text-xs font-black uppercase tracking-widest hover:shadow-lg shadow-brand/20 transition-all flex items-center justify-center gap-2">
               {{ editMode ? 'Update Area' : 'Create Area' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAreaStore, type Area } from '../stores/areas';

const areaStore = useAreaStore();
const searchQuery = ref('');
const showModal = ref(false);
const editMode = ref(false);
const selectedArea = ref<Area | null>(null);

const form = ref({
  name: '',
  is_active: true
});

onMounted(() => {
  areaStore.fetchAreas();
});

const filteredAreas = computed(() => {
  if (!searchQuery.value) return areaStore.areas;
  const q = searchQuery.value.toLowerCase();
  return areaStore.areas.filter(a => a.name.toLowerCase().includes(q));
});

function openAddModal() {
  editMode.value = false;
  selectedArea.value = null;
  form.value = { name: '', is_active: true };
  showModal.value = true;
}

function openEditModal(area: Area) {
  editMode.value = true;
  selectedArea.value = area;
  form.value = { name: area.name, is_active: area.is_active === 1 };
  showModal.value = true;
}

async function handleSave() {
  try {
    if (editMode.value && selectedArea.value) {
      await areaStore.updateArea(selectedArea.value.id, form.value.name, form.value.is_active ? 1 : 0);
    } else {
      await areaStore.addArea(form.value.name);
    }
    showModal.value = false;
  } catch (error: any) {
    alert(error.message || 'Failed to save area');
  }
}

async function handleDelete(area: Area) {
  if (confirm(`Are you sure you want to delete "${area.name}"? This action cannot be undone.`)) {
    try {
      await areaStore.deleteArea(area.id);
    } catch (error: any) {
      alert(error.message || 'Failed to delete area');
    }
  }
}
</script>
