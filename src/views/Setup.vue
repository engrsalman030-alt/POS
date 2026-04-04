<template>
  <div class="min-h-screen flex items-center justify-center p-6 bg-app-bg font-sans">

    <div class="max-w-md w-full rounded-lg overflow-hidden border border-border shadow-sm bg-card-bg">

      <div class="p-10">
        <!-- Header -->
        <div class="text-center mb-10">
          <h1 class="text-heading">Setup Your Company</h1>
          <p class="text-subheading">Initialize your local-first accounting system</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSetup" class="space-y-6">

          <div>
            <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-text-muted">Company Name</label>
            <input v-model="form.name" type="text" required
              placeholder="e.g. Acme Pakistan (Pvt) Ltd"
              class="w-full px-3 py-2 border border-border bg-app-bg rounded-xl text-sm outline-none transition-all focus:border-text-primary focus:bg-card-bg text-text-primary placeholder:text-text-muted"
            >
          </div>

          <div class="grid grid-cols-2 gap-5">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-text-muted">Base Currency</label>
              <select v-model="form.currency"
                class="w-full px-3 py-2 border border-border bg-app-bg rounded-xl text-sm outline-none focus:border-text-primary text-text-primary"
              >
                <option value="PKR">PKR (Rs.)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-text-muted">NTN / Tax ID</label>
              <input v-model="form.ntn" type="text" placeholder="Optional"
                class="w-full px-3 py-2 border border-border bg-app-bg rounded-xl text-sm outline-none font-mono focus:border-text-primary focus:bg-card-bg text-text-primary placeholder:text-text-muted"
              >
            </div>
          </div>

          <div>
             <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-text-muted">Drug License Number (DLN)</label>
             <input v-model="form.license_number" type="text" placeholder="e.g. 1234-DLN-PB"
               class="w-full px-3 py-2 border border-border bg-app-bg rounded text-sm outline-none font-mono focus:border-text-primary focus:bg-card-bg text-text-primary placeholder:text-text-muted"
             >
          </div>

          <div class="grid grid-cols-2 gap-5">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-text-muted">Country</label>
              <input v-model="form.country" type="text" placeholder="Pakistan"
                class="w-full px-3 py-2 border border-border bg-app-bg rounded-xl text-sm outline-none focus:border-text-primary focus:bg-card-bg text-text-primary placeholder:text-text-muted"
              >
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-text-muted">Fiscal Year Start</label>
              <input v-model="form.fiscalYearStart" type="date" required
                class="w-full px-3 py-2 border border-border bg-app-bg rounded-xl text-sm outline-none focus:border-text-primary focus:bg-card-bg text-text-primary"
              >
            </div>
          </div>

          <!-- Info Box -->
          <div class="p-4 rounded border border-border bg-hover-bg/30">
            <p class="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Contextual Setup</p>
            <p class="text-[10px] mt-1 text-text-muted">
              Defaulting to PKR and local fiscal cycles. Tax IDs will be used for reporting.
            </p>
          </div>

          <!-- Submit -->
          <button type="submit" :disabled="loading"
            class="btn-primary w-full py-3 h-auto mt-2">
            {{ loading ? 'Initializing...' : (isExistingCompany ? 'Login to Company' : 'Create Company') }}
          </button>

        </form>

        <!-- Existing Companies Section -->
        <div v-if="companyStore.existingCompanies.length > 0" class="mt-10 pt-8 border-t border-border/50">
          <p class="text-[10px] font-black uppercase tracking-widest text-text-muted mb-4">Existing Companies</p>
          <div class="space-y-2">
            <button 
              v-for="comp in companyStore.existingCompanies" 
              :key="comp.id"
              @click="selectCompany(comp)"
              class="w-full text-left p-3 rounded-lg border border-border bg-hover-bg/30 hover:bg-hover-bg hover:border-text-muted transition-all flex items-center justify-between group"
            >
              <div>
                <p class="text-sm font-bold text-text-primary group-hover:text-brand transition-colors">{{ comp.name }}</p>
                <p class="text-[10px] text-text-muted mt-0.5">{{ comp.country }} • {{ comp.currency }}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-text-muted group-hover:translate-x-1 transition-transform"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
* { font-family: 'Inter', sans-serif; }
</style>

<script setup lang="ts">
import { reactive, ref, toRaw, onMounted, computed } from 'vue';
import { useCompanyStore } from '../stores/company';
import { useToastStore } from '../stores/toast';

const companyStore = useCompanyStore();
const toastStore = useToastStore();
const loading = ref(false);

onMounted(async () => {
    // We no longer aggressively clear old tests so that the user doesn't lose data upon logout.
    await companyStore.fetchCompanies();
});

const isExistingCompany = computed(() => {
  return companyStore.existingCompanies.some(c => c.name.toLowerCase() === form.name.toLowerCase());
});

function selectCompany(comp: any) {
  form.name = comp.name;
  form.currency = comp.currency;
  form.country = comp.country;
  form.ntn = comp.ntn || '';
  form.license_number = comp.license_number || '';
  // Trigger setup immediately or just let them click the button
}

// Default fiscal year start: July 1st of current year
const currentYear = new Date().getFullYear();
const fiscalStart = new Date(currentYear, 6, 1).toISOString().split('T')[0];

const form = reactive({
  name: '',
  currency: 'PKR',
  country: 'Pakistan',
  ntn: '',
  license_number: '',
  fiscalYearStart: fiscalStart
});

async function handleSetup() {
  loading.value = true;
  try {
    // Validate company name
    if (!form.name.trim()) {
      toastStore.warning('Company name is required');
      loading.value = false;
      return;
    }

    console.log('Form before submit:', { ...toRaw(form) });

    // Setup company and seed accounts & taxes
    await companyStore.setupCompany({ ...toRaw(form) });

    toastStore.success('Company setup successful! Reloading to start fresh.');
    setTimeout(() => {
        window.location.href = '/'; // hard reload to wipe memory state
    }, 2000);
  } catch (err: any) {
    console.error('Setup error:', err);
    toastStore.error('Setup failed: ' + (err.message ?? err));
  } finally {
    loading.value = false;
  }
}
</script>