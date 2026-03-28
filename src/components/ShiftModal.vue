<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useShiftStore } from '../stores/shift';
import { shiftService } from '../services/shiftService';

const props = defineProps<{
  type: 'open' | 'close';
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const shiftStore = useShiftStore();

const amount = ref(0);
const notes = ref('');

onMounted(() => {
  if (props.type === 'close' && shiftStore.activeShift) {
    const shiftSales = shiftService.getShiftSales(shiftStore.activeShift.id);
    amount.value = shiftStore.activeShift.opening_balance + shiftSales;
  }
});

const handleSubmit = async () => {
  if (props.type === 'open') {
    shiftService.openShift(amount.value, notes.value);
  } else {
    if (shiftStore.activeShift) {
      shiftService.closeShift(shiftStore.activeShift.id, amount.value, notes.value);
    }
  }
  
  await shiftStore.initializeActiveShift();
  emit('close');
};
</script>

<template>
  <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-gray-900 rounded-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
      <div class="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
        <h2 class="text-lg font-bold text-white">
          {{ type === 'open' ? 'Open Shift' : 'Close Shift' }}
        </h2>
        <button v-if="type === 'close'" @click="emit('close')" class="text-gray-400 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="p-6 overflow-y-auto">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">
              {{ type === 'open' ? 'Opening Balance' : 'Closing Balance' }}
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                Rs
              </span>
              <input 
                v-model="amount" 
                type="number" 
                step="0.01" 
                min="0"
                class="w-full pl-10 pr-4 py-2 bg-gray-800 border-gray-700 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Notes</label>
            <textarea 
              v-model="notes" 
              rows="3"
              class="w-full px-4 py-2 bg-gray-800 border-gray-700 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Any additional notes..."
            ></textarea>
          </div>
          <div class="pt-4 flex gap-3">
            <button 
              type="submit"
              class="flex-1 py-2 px-4 rounded-lg font-medium transition-colors text-white"
              :class="type === 'open' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'"
            >
              {{ type === 'open' ? 'Open Shift' : 'End Shift' }}
            </button>
            <button 
              v-if="type === 'close'"
              type="button"
              @click="emit('close')"
              class="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
