<template>
  <div class="min-h-screen flex items-center justify-center p-6"
    style="background:#F6F6F6; font-family:'Inter',sans-serif;">

    <div class="max-w-md w-full rounded-xl overflow-hidden shadow-sm"
      style="background:#fff; border:1px solid #E2E2E2;">

      <!-- Top accent bar -->
      <div class="h-1 w-full" style="background:#46B37E;"></div>

      <div class="p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4"
            style="background:#EDFBF4;">
            <span class="text-3xl">🏗️</span>
          </div>
          <h1 class="text-2xl font-bold" style="color:#171717;">Setup Your Company</h1>
          <p class="text-sm mt-2" style="color:#999;">Initialize your local-first accounting system</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSetup" class="space-y-4">

          <div>
            <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style="color:#999;">Company Name</label>
            <input v-model="form.name" type="text" required
              placeholder="e.g. Acme Pakistan (Pvt) Ltd"
              class="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
              style="background:#F6F6F6; border:1px solid #E2E2E2; color:#171717;"
              onfocus="this.style.borderColor='#46B37E'; this.style.background='#fff'"
              onblur="this.style.borderColor='#E2E2E2'; this.style.background='#F6F6F6'">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style="color:#999;">Base Currency</label>
              <select v-model="form.currency"
                class="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                style="background:#F6F6F6; border:1px solid #E2E2E2; color:#171717;"
                onfocus="this.style.borderColor='#46B37E'" onblur="this.style.borderColor='#E2E2E2'">
                <option value="PKR">PKR (Rs.)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style="color:#999;">NTN / Registration</label>
              <input v-model="form.ntn" type="text" placeholder="e.g. 1234567-8"
                class="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                style="background:#F6F6F6; border:1px solid #E2E2E2; color:#171717;"
                onfocus="this.style.borderColor='#46B37E'; this.style.background='#fff'"
                onblur="this.style.borderColor='#E2E2E2'; this.style.background='#F6F6F6'">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style="color:#999;">Country</label>
              <input v-model="form.country" type="text" placeholder="Pakistan"
                class="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                style="background:#F6F6F6; border:1px solid #E2E2E2; color:#171717;"
                onfocus="this.style.borderColor='#46B37E'; this.style.background='#fff'"
                onblur="this.style.borderColor='#E2E2E2'; this.style.background='#F6F6F6'">
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style="color:#999;">Fiscal Year Start</label>
              <input v-model="form.fiscalYearStart" type="date" required
                class="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                style="background:#F6F6F6; border:1px solid #E2E2E2; color:#171717;"
                onfocus="this.style.borderColor='#46B37E'; this.style.background='#fff'"
                onblur="this.style.borderColor='#E2E2E2'; this.style.background='#F6F6F6'">
            </div>
          </div>

          <!-- Info Box -->
          <div class="p-4 rounded-lg" style="background:#EDFBF4; border:1px solid #c6f0db;">
            <p class="text-xs font-semibold flex items-center gap-2" style="color:#278F5E;">
              <span>🇵🇰</span> Pakistani Context Active
            </p>
            <p class="text-[10px] mt-1" style="color:#46B37E;">
              Defaulted to PKR and July-June fiscal cycle. NTN field added for tax compliance.
            </p>
          </div>

          <!-- Submit -->
          <button type="submit" :disabled="loading"
            class="w-full py-3 rounded-lg text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
            style="background:#46B37E; color:#fff; box-shadow:0 2px 8px rgba(70,179,126,0.3);"
            onmouseover="this.style.background='#278F5E'"
            onmouseout="this.style.background='#46B37E'">
            {{ loading ? 'Initializing...' : 'Create Company' }}
          </button>

        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
* { font-family: 'Inter', sans-serif; }
</style>

<script setup lang="ts">
import { reactive, ref, toRaw, onMounted } from 'vue';
import { useCompanyStore } from '../stores/company';
import { wipeDatabase } from '../db/database';

const companyStore = useCompanyStore();
const loading = ref(false);

onMounted(() => {
    // Aggressively clear old tests so the user starts with 0 items, 0 parties, 0 bills
    wipeDatabase();
});

// Default fiscal year start: July 1st of current year
const currentYear = new Date().getFullYear();
const fiscalStart = new Date(currentYear, 6, 1).toISOString().split('T')[0];

const form = reactive({
  name: '',
  currency: 'PKR',
  country: 'Pakistan',
  ntn: '',
  fiscalYearStart: fiscalStart
});

async function handleSetup() {
  loading.value = true;
  try {
    // Validate company name
    if (!form.name.trim()) {
      alert('Company name is required');
      loading.value = false;
      return;
    }

    console.log('Form before submit:', { ...toRaw(form) });

    // Setup company and seed accounts & taxes
    await companyStore.setupCompany({ ...toRaw(form) });

    alert('Company setup successful! Reloading to start fresh.');
    window.location.href = '/'; // hard reload to wipe memory state
  } catch (err: any) {
    console.error('Setup error:', err);
    alert('Setup failed: ' + (err.message ?? err));
  } finally {
    loading.value = false;
  }
}
</script>