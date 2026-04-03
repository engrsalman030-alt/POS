<template>
  <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full sm:w-80">
    <TransitionGroup 
      name="toast" 
      tag="div" 
      class="flex flex-col gap-3"
    >
      <div 
        v-for="toast in toastStore.toasts" 
        :key="toast.id"
        class="pointer-events-auto relative overflow-hidden group"
      >
        <!-- Toast Body -->
        <div 
          :class="[
            'flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300',
            getBgClass(toast.type),
            getBorderClass(toast.type)
          ]"
        >
          <!-- Icon -->
          <div :class="['shrink-0 mt-0.5', getIconColorClass(toast.type)]">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" :d="getIconPath(toast.type)" />
            </svg>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-text-primary mb-0.5 capitalize leading-none">
              {{ toast.type }}
            </p>
            <p class="text-[11px] text-text-muted leading-relaxed break-words">
              {{ toast.message }}
            </p>
          </div>

          <!-- Close Button -->
          <button 
            @click="toastStore.remove(toast.id)"
            class="shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <!-- Progress Bar -->
          <div 
            v-if="toast.duration > 0"
            class="absolute bottom-0 left-0 h-0.5 opacity-20"
            :style="{ 
              width: '100%',
              animation: `progress ${toast.duration}ms linear forwards`
            }"
            :class="getProgressBarClass(toast.type)"
          ></div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToastStore, type ToastType } from '../stores/toast';

const toastStore = useToastStore();

const getIconPath = (type: ToastType) => {
  switch (type) {
    case 'success': return 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    case 'error': return 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z';
    case 'warning': return 'M12 9v3.75m0 3.75h.008v.008H12v-.008zM2.25 12c0 5.385 4.365 9.75 9.75 9.75s9.75-4.365 9.75-9.75S17.385 2.25 12 2.25 2.25 6.615 2.25 12z';
    case 'info': return 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12v-.008z';
    default: return 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12v-.008z';
  }
};

const getBgClass = (type: ToastType) => {
  switch (type) {
    case 'success': return 'bg-white/80 dark:bg-emerald-950/20';
    case 'error': return 'bg-white/80 dark:bg-rose-950/20';
    case 'warning': return 'bg-white/80 dark:bg-amber-950/20';
    case 'info': return 'bg-white/80 dark:bg-sky-950/20';
    default: return 'bg-white/80 dark:bg-slate-900/40';
  }
};

const getBorderClass = (type: ToastType) => {
  switch (type) {
    case 'success': return 'border-emerald-100 dark:border-emerald-500/20';
    case 'error': return 'border-rose-100 dark:border-rose-500/20';
    case 'warning': return 'border-amber-100 dark:border-amber-500/20';
    case 'info': return 'border-sky-100 dark:border-sky-500/20';
    default: return 'border-border';
  }
};

const getIconColorClass = (type: ToastType) => {
  switch (type) {
    case 'success': return 'text-emerald-500';
    case 'error': return 'text-rose-500';
    case 'warning': return 'text-amber-500';
    case 'info': return 'text-sky-500';
    default: return 'text-brand';
  }
};

const getProgressBarClass = (type: ToastType) => {
  switch (type) {
    case 'success': return 'bg-emerald-500';
    case 'error': return 'bg-rose-500';
    case 'warning': return 'bg-amber-500';
    case 'info': return 'bg-sky-500';
    default: return 'bg-brand';
  }
};
</script>


<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.9);
}

.toast-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

@keyframes progress {
  from { width: 100%; }
  to { width: 0%; }
}
</style>
