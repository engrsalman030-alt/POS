<template>
  <div class="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
    <div :class="['w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-xl', colorClasses]">
      {{ icon }}
    </div>
    <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">{{ title }}</p>
    <p class="text-2xl font-black text-slate-900 mt-1">{{ formattedValue }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCompanyStore } from '../stores/company';

const props = defineProps<{
  title: string;
  value: number;
  icon: string;
  color: 'emerald' | 'indigo' | 'rose' | 'amber';
}>();

const companyStore = useCompanyStore();

const formattedValue = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: companyStore.company?.currency || 'USD'
  }).format(props.value || 0);
});

const colorClasses = computed(() => {
  const maps = {
    emerald: 'bg-emerald-50 text-emerald-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    rose: 'bg-rose-50 text-rose-600',
    amber: 'bg-amber-50 text-amber-600'
  };
  return maps[props.color];
});
</script>
