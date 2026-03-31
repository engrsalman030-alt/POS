<template>
  <div class="p-8 max-w-6xl mx-auto" style="font-family:'Inter',sans-serif;">
    
    <!-- Header -->
    <header class="mb-8 flex justify-between items-end pb-4 border-b border-border">
      <div>
        <h1 class="text-2xl font-bold text-text-primary">Settings</h1>
        <p class="text-sm mt-1 text-text-secondary">Manage application preferences, database backups, and configurations.</p>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

      <!-- Appearance Settings -->
      <div class="rounded-lg overflow-hidden border bg-card-bg border-border">
        <div class="px-6 py-3 bg-hover-bg border-b border-border">
          <h2 class="text-[10px] font-bold uppercase tracking-widest text-text-muted">Appearance</h2>
        </div>

        <div class="p-8 space-y-6">
          <p class="text-sm leading-relaxed text-text-secondary">
            Choose how the application looks to you. Select between light and dark themes.
          </p>

          <div class="grid grid-cols-2 gap-4">
            <!-- Light Theme Option -->
            <button 
              @click="themeStore.setTheme('light')"
              :class="['flex flex-col gap-3 p-4 rounded-xl border-2 transition-all text-left group', 
                       themeStore.theme === 'light' ? 'border-brand bg-brand/5' : 'border-border bg-app-bg hover:border-text-muted']"
            >
              <div class="w-full aspect-video rounded-lg border border-border bg-[#FBFBFB] overflow-hidden flex flex-col p-1 gap-1">
                <div class="h-2 w-full bg-white border-b border-gray-100 flex items-center px-1">
                  <div class="w-1 h-1 rounded-full bg-gray-200"></div>
                </div>
                <div class="flex-1 flex gap-1">
                  <div class="w-4 h-full bg-white border-r border-gray-100"></div>
                  <div class="flex-1 space-y-1 p-1">
                    <div class="h-1 w-3/4 bg-gray-100 rounded"></div>
                    <div class="h-1 w-1/2 bg-gray-100 rounded"></div>
                  </div>
                </div>
              </div>
              <div>
                <p class="text-sm font-bold text-text-primary">Light Mode</p>
                <p class="text-[10px] text-text-muted uppercase font-bold tracking-tight">Default style</p>
              </div>
            </button>

            <!-- Dark Theme Option -->
            <button 
              @click="themeStore.setTheme('dark')"
              :class="['flex flex-col gap-3 p-4 rounded-xl border-2 transition-all text-left group', 
                       themeStore.theme === 'dark' ? 'border-brand bg-brand/5' : 'border-border bg-app-bg hover:border-text-muted']"
            >
              <div class="w-full aspect-video rounded-lg border border-border bg-[#0A0A0A] overflow-hidden flex flex-col p-1 gap-1">
                <div class="h-2 w-full bg-[#141414] border-b border-[#262626] flex items-center px-1">
                  <div class="w-1 h-1 rounded-full bg-[#262626]"></div>
                </div>
                <div class="flex-1 flex gap-1">
                  <div class="w-4 h-full bg-[#141414] border-r border-[#262626]"></div>
                  <div class="flex-1 space-y-1 p-1">
                    <div class="h-1 w-3/4 bg-[#262626] rounded"></div>
                    <div class="h-1 w-1/2 bg-[#262626] rounded"></div>
                  </div>
                </div>
              </div>
              <div>
                <p class="text-sm font-bold text-text-primary">Dark Mode</p>
                <p class="text-[10px] text-text-muted uppercase font-bold tracking-tight">Professional dark</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Database Settings -->
      <div class="rounded-lg overflow-hidden border bg-card-bg border-border">
        
        <div class="px-6 py-3 bg-hover-bg border-b border-border">
          <h2 class="text-[10px] font-bold uppercase tracking-widest text-text-muted">Database Management</h2>
        </div>

        <div class="p-8 space-y-5">
          <p class="text-sm leading-relaxed text-text-secondary">
            Backup your local database or restore from a previous backup file. All data is stored locally.
          </p>

          <div class="grid grid-cols-1 gap-3">
            <button @click="exportDb"
              class="px-4 py-2 border rounded text-sm font-bold transition-all bg-card-bg border-border text-text-secondary hover:bg-hover-bg">
              Backup Database
            </button>
            <button @click="triggerFileInput"
              class="px-4 py-2 border rounded text-sm font-bold transition-all bg-card-bg border-border text-text-secondary hover:bg-hover-bg">
              Restore Backup
            </button>
            <input type="file" ref="fileInput" @change="importDb" class="hidden" accept=".json,.sqlite">
            
            <div class="pt-4 border-t border-border mt-2">
              <button @click="handleResetData" 
                class="w-full px-4 py-2 border rounded text-sm font-bold transition-all bg-danger-bg border-danger/20 text-danger hover:bg-danger/20 uppercase tracking-widest">
                Reset Application Data
              </button>
              <p class="text-[10px] text-text-muted mt-2 text-center italic">This will delete all your local data permanently.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Company Profile -->
      <div class="rounded-lg overflow-hidden border bg-card-bg border-border lg:col-span-2">
        <div class="px-6 py-3 bg-hover-bg border-b border-border flex justify-between items-center">
          <h2 class="text-[10px] font-bold uppercase tracking-widest text-text-muted">Company Profile</h2>
          <button @click="saveCompany" class="text-[10px] font-bold uppercase tracking-widest text-brand hover:underline">Save Changes</button>
        </div>

        <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-[10px] font-bold uppercase tracking-widest text-text-muted">Company Name</label>
            <input v-model="companyForm.name" type="text" class="w-full bg-app-bg border border-border rounded-lg px-4 py-2.5 text-sm font-semibold text-text-primary focus:border-brand outline-none" placeholder="e.g. My Business">
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-bold uppercase tracking-widest text-text-muted">Tax ID / NTN</label>
            <input v-model="companyForm.ntn" type="text" class="w-full bg-app-bg border border-border rounded-lg px-4 py-2.5 text-sm font-semibold text-text-primary focus:border-brand outline-none" placeholder="e.g. 1234567-8">
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-bold uppercase tracking-widest text-text-muted">Currency</label>
            <select v-model="companyForm.currency" class="w-full bg-app-bg border border-border rounded-lg px-4 py-2.5 text-sm font-semibold text-text-primary focus:border-brand outline-none">
              <option value="PKR">PKR (₨)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-bold uppercase tracking-widest text-text-muted">Address</label>
            <input v-model="companyForm.address" type="text" class="w-full bg-app-bg border border-border rounded-lg px-4 py-2.5 text-sm font-semibold text-text-primary focus:border-brand outline-none" placeholder="Business Address">
          </div>
        </div>
      </div>
    </div>

    <!-- Data Safety Warning -->
    <div class="mt-10 rounded-lg p-8 border bg-card-bg border-border">
      <div>
        <h3 class="font-bold text-sm uppercase tracking-widest mb-3 text-text-primary">Data Privacy & Safety</h3>
        <p class="text-sm leading-relaxed text-text-secondary">
          This application uses a local-first architecture. All your accounting data stays on this device and is never uploaded to any server. 
          We recommend backing up your data regularly. If you clear your browser's local storage or switch devices without a backup, your data will be permanently lost.
        </p>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useThemeStore } from '../stores/theme';
import { useCompanyStore } from '../stores/company';
import { wipeDatabase } from '../db/database';

const themeStore = useThemeStore();
const companyStore = useCompanyStore();
const fileInput = ref<HTMLInputElement | null>(null);

const companyForm = ref({
  name: '',
  ntn: '',
  currency: 'PKR',
  address: ''
});

async function handleResetData() {
  if (confirm('Are you absolutely sure? This will delete all your settings, items, sales, and customers permanently. This action cannot be undone.')) {
    wipeDatabase();
    alert('Application data wiped. Redirecting to setup.');
    window.location.href = '/setup';
  }
}

onMounted(async () => {
    if (!companyStore.company) await companyStore.loadCompany();
    if (companyStore.company) {
      companyForm.value = {
        name: companyStore.company.name,
        ntn: companyStore.company.ntn || '',
        currency: companyStore.company.currency,
        address: companyStore.company.address || ''
      };
    }
});

async function saveCompany() {
  await companyStore.updateCompany(companyForm.value);
  alert('Settings saved successfully!');
}

function exportDb() {
  const db_data = localStorage.getItem('pos_db');
  if (!db_data) {
    alert('No active database found to backup.');
    return;
  }
  
  const blob = new Blob([db_data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fb_clone_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function triggerFileInput() {
    fileInput.value?.click();
}

function importDb(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
            JSON.parse(content); // Validate JSON
            localStorage.setItem('pos_db', content);
            alert('Database restored successfully. The page will now reload.');
            window.location.reload();
        } catch (err) {
            alert('Invalid backup file.');
        }
    };
    reader.readAsText(file);
}
</script>
