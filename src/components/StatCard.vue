<template>
  <div class="p-5 bg-card-bg rounded-xl border border-border shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
    <div class="flex flex-wrap justify-between items-start gap-2 mb-4">
      <div class="min-w-0 flex-1">
        <p class="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1 truncate">{{ title }}</p>
        <h3 class="text-xl md:text-2xl font-black text-text-primary tracking-tight truncate" :title="formattedValue">{{ formattedValue }}</h3>
      </div>
      <div class="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center border border-border bg-hover-bg transition-colors group-hover:border-text-primary">
        <span class="text-sm">{{ icon }}</span>
      </div>
    </div>
    
    <div class="mt-auto pt-4 flex items-end justify-between gap-4">
      <!-- Sparkline SVG -->
      <div v-if="trend && trend.length > 1" class="flex-1 h-12">
        <svg class="w-full h-full overflow-visible" preserveAspectRatio="none">
          <path
            :d="pathData"
            fill="none"
            :stroke="trendColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div v-else class="h-12 flex items-center text-[10px] text-text-muted italic">
        No trend data
      </div>
      
      <div v-if="percentageChange !== null" class="text-right shrink-0">
        <p :class="['text-[10px] font-bold', percentageChange >= 0 ? 'text-emerald-500' : 'text-rose-500']">
          {{ percentageChange >= 0 ? '+' : '' }}{{ percentageChange.toFixed(1) }}%
        </p>
        <p class="text-[8px] text-text-muted uppercase font-black mt-0.5">vs last period</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCompanyStore } from '../stores/company';

const props = defineProps<{
  title: string;
  value: number;
  icon: string;
  trend?: number[];
}>();

const companyStore = useCompanyStore();

const formattedValue = computed(() => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: companyStore.company?.currency || 'PKR',
    minimumFractionDigits: 0
  }).format(props.value || 0);
});

const percentageChange = computed(() => {
  if (!props.trend || props.trend.length < 2) return null;
  const oldVal = props.trend[0] ?? 0;
  const newVal = props.trend[props.trend.length - 1] ?? 0;
  if (oldVal === 0) return newVal === 0 ? 0 : 100;
  return ((newVal - oldVal) / Math.abs(oldVal)) * 100;
});

const trendColor = computed(() => {
  if (percentageChange.value === null) return '#E2E2E2';
  return percentageChange.value >= 0 ? '#10B981' : '#F43F5E';
});

const pathData = computed(() => {
  if (!props.trend || props.trend.length < 2) return '';
  
  const height = 40; // Reference height
  const points = props.trend;
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const range = max - min || 1;

  return points.map((val, i) => {
    const x = (i / (points.length - 1)) * 100;
    const y = height - ((val - min) / range) * height;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
});
</script>

<style scoped>
/* SVG styles */
</style>
