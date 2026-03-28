<template>
  <div class="flex items-center justify-between px-4 py-3 sm:px-6 bg-white border-t border-gray-100 mt-4 rounded-b-lg">
    <!-- Mobile version -->
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        @click="$emit('prev')"
        :disabled="currentPage === 1"
        class="relative inline-flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#525252] hover:bg-gray-50 disabled:opacity-30 transition-all active:scale-95"
      >
        Previous
      </button>
      <button
        @click="$emit('next')"
        :disabled="currentPage === totalPages"
        class="relative ml-3 inline-flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#525252] hover:bg-gray-50 disabled:opacity-30 transition-all active:scale-95"
      >
        Next
      </button>
    </div>

    <!-- Desktop version -->
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-[11px] font-bold uppercase tracking-widest text-gray-400">
          Page <span class="text-[#171717]">{{ currentPage }}</span> of <span class="text-[#171717]">{{ totalPages }}</span>
        </p>
      </div>
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button
            @click="$emit('prev')"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-30 transition-colors"
          >
            <span class="sr-only">Previous</span>
            <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="$emit('setPage', page)"
            aria-current="page"
            :class="[
                'relative inline-flex items-center px-4 py-2 text-xs font-black transition-all',
                page === currentPage 
                    ? 'z-10 bg-[#171717] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black' 
                    : 'text-gray-400 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
            ]"
          >
            {{ page }}
          </button>

          <button
            @click="$emit('next')"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-30 transition-colors"
          >
            <span class="sr-only">Next</span>
            <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  currentPage: number;
  totalPages: number;
}>();

defineEmits(['next', 'prev', 'setPage']);

const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, props.currentPage - 2);
  const end = Math.min(props.totalPages, start + 4);
  
  const adjustedStart = Math.max(1, end - 4);
  
  for (let i = adjustedStart; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});
</script>
