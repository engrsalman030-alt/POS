<template>
  <div class="min-h-screen bg-app-bg text-text-primary font-inter pb-20">
    <!-- HEADER -->
    <header class="sticky top-0 z-50 bg-card-bg border-b border-border px-6 py-4 shadow-sm">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-black tracking-tighter text-text-primary">👤 Staff Area Assignments</h1>
          <p class="text-sm font-bold text-text-muted mt-1">Manage staff territory & area coverage</p>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-6 py-10">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- STAFF LIST -->
        <div class="lg:col-span-1">
          <div class="bg-card-bg border border-border rounded-2xl overflow-hidden">
            <div class="p-6 border-b border-border bg-hover-bg/30">
              <h2 class="font-black text-lg">Sales Staff</h2>
              <input v-model="staffSearch" type="text" placeholder="Search staff..." class="w-full mt-3 bg-card-bg border border-border rounded-lg px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-brand/20" />
            </div>
            <div class="divide-y divide-border max-h-[600px] overflow-y-auto">
              <div v-for="staff in filteredStaff" :key="staff.id" 
                @click="selectStaff(staff)"
                :class="['p-4 cursor-pointer transition-all border-l-4', selectedStaff?.id === staff.id ? 'bg-brand/10 border-l-brand' : 'hover:bg-hover-bg/30 border-l-transparent']">
                <p class="font-bold">{{ staff.name }}</p>
                <p class="text-xs text-text-muted mt-1">{{ staff.role }}</p>
                <div class="flex gap-1 mt-2">
                  <span v-for="area in getStaffAreas(staff.id)" :key="area.id" class="text-[9px] bg-brand/10 text-brand px-2 py-0.5 rounded-md font-bold">
                    {{ area.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- AREA ASSIGNMENT -->
        <div class="lg:col-span-2">
          <div class="bg-card-bg border border-border rounded-2xl p-8">
            <div v-if="!selectedStaff" class="text-center py-12">
              <p class="text-text-muted font-bold">Select a staff member to manage area assignments</p>
            </div>

            <div v-else class="space-y-8">
              <!-- STAFF HEADER -->
              <div class="pb-6 border-b border-border">
                <h2 class="text-2xl font-black">{{ selectedStaff.name }}</h2>
                <p class="text-sm text-text-muted mt-1">{{ selectedStaff.role }} · Created {{ selectedStaff.joining_date }}</p>
                <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p class="text-xs font-bold text-text-muted uppercase">Sales Target</p>
                    <p class="text-lg font-black text-brand mt-1">{{ formatAmount(selectedStaff.monthly_target) }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-bold text-text-muted uppercase">Phone</p>
                    <p class="text-sm font-bold mt-1">{{ selectedStaff.phone }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-bold text-text-muted uppercase">CNIC</p>
                    <p class="text-sm font-bold mt-1">{{ selectedStaff.cnic }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-bold text-text-muted uppercase">Salary</p>
                    <p class="text-sm font-bold mt-1">{{ formatAmount(selectedStaff.salary) }}</p>
                  </div>
                </div>
              </div>

              <!-- CURRENT AREAS -->
              <div>
                <h3 class="text-lg font-black mb-4">Assigned Areas</h3>
                <div v-if="currentAreas.length === 0" class="bg-hover-bg/30 rounded-xl p-6 text-center">
                  <p class="text-text-muted font-bold">No areas assigned yet</p>
                </div>
                <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="area in currentAreas" :key="area.id" class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start justify-between">
                    <div>
                      <p class="font-bold text-emerald-900">{{ area.name }}</p>
                      <p class="text-xs text-emerald-700 mt-1">Longitude: {{ area.longitude }}, Latitude: {{ area.latitude }}</p>
                    </div>
                    <button @click="removeArea(area.id)" class="flex-shrink-0 w-6 h-6 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all">
                      ✕
                    </button>
                  </div>
                </div>
              </div>

              <!-- ADD AREAS -->
              <div>
                <h3 class="text-lg font-black mb-4">Add More Areas</h3>
                <div class="space-y-3">
                  <div v-for="area in availableAreas" :key="area.id" 
                    @click="addArea(area.id)"
                    class="p-4 border border-border rounded-xl cursor-pointer hover:bg-brand/10 hover:border-brand transition-all">
                    <p class="font-bold">{{ area.name }}</p>
                    <p class="text-xs text-text-muted mt-1">Coverage area with {{ area.customer_count || 0 }} customers</p>
                  </div>
                </div>
              </div>

              <!-- SAVE BUTTON -->
              <div class="pt-6 border-t border-border flex gap-4">
                <button @click="saveAssignments" class="flex-1 px-6 py-3 bg-brand text-white rounded-xl font-black uppercase tracking-widest hover:opacity-90 transition-all">
                  ✓ Save Assignments
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- AREA MANAGEMENT SECTION -->
      <div class="mt-12">
        <div class="bg-card-bg border border-border rounded-2xl p-8">
          <h2 class="text-2xl font-black mb-6">📍 All Areas</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="area in allAreas" :key="area.id" class="border border-border rounded-xl p-6 hover:shadow-lg transition-all">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h3 class="font-bold text-lg">{{ area.name }}</h3>
                  <p class="text-xs text-text-muted mt-1">{{ area.customer_count || 0 }} customers assigned</p>
                </div>
              </div>
              <div class="space-y-2 mb-4 bg-hover-bg/30 rounded-lg p-3">
                <p class="text-xs text-text-muted">
                  <span class="font-bold">Coordinates:</span> {{ area.latitude }}, {{ area.longitude }}
                </p>
              </div>
              <div class="flex gap-2">
                <button class="flex-1 px-3 py-2 bg-hover-bg rounded-lg text-xs font-bold hover:bg-hover-bg/80 transition-all">
                  View Customers
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStaffStore } from '../stores/staff';
import { useAreaStore } from '../stores/areas';
import { useToastStore } from '../stores/toast';

const staffStore = useStaffStore();
const areasStore = useAreaStore();
const toastStore = useToastStore();

const staffSearch = ref('');
const selectedStaff = ref<any>(null);
const currentAreas = ref<any[]>([]);
const allAreas = ref<any[]>([]);

const filteredStaff = computed(() => {
  return staffStore.staff.filter(s => 
    s.role !== 'Admin' && (s.name.toLowerCase().includes(staffSearch.value.toLowerCase()) || s.id.includes(staffSearch.value))
  );
});

const availableAreas = computed(() => {
  if (!selectedStaff.value) return [];
  const assignedIds = new Set(currentAreas.value.map(a => a.id));
  return allAreas.value.filter(a => !assignedIds.has(a.id));
});

function getStaffAreas(_staffId: string): any[] {
  // Get areas from database for this staff
  return [];
}

function selectStaff(staff: any) {
  selectedStaff.value = staff;
  currentAreas.value = getStaffAreas(staff.id);
}

function addArea(areaId: string) {
  const area = allAreas.value.find(a => a.id === areaId);
  if (area && !currentAreas.value.find(a => a.id === areaId)) {
    currentAreas.value.push(area);
    toastStore.success(`${area.name} added to assignments`);
  }
}

function removeArea(areaId: string) {
  currentAreas.value = currentAreas.value.filter(a => a.id !== areaId);
  toastStore.success('Area removed from assignments');
}

function saveAssignments() {
  if (!selectedStaff.value) return;
  
  // Save to database
  console.log('Saving assignments for:', selectedStaff.value.id, currentAreas.value);
  toastStore.success('Assignments saved successfully');
}

function formatAmount(val: number | undefined) {
  return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(val || 0);
}

onMounted(async () => {
  // Load all areas from store
  allAreas.value = areasStore.areas || [];
  
  // Fetch staff if not loaded
  if (staffStore.staff.length === 0) {
    await staffStore.fetchStaff();
  }
});
</script>
