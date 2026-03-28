import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Shift } from '../types/shift';
import { shiftService } from '../services/shiftService';

export const useShiftStore = defineStore('shift', () => {
  const activeShift = ref<Shift | null>(null);
  const isLoading = ref(false);

  async function initializeActiveShift() {
    isLoading.value = true;
    try {
      activeShift.value = await shiftService.getActiveShift();
    } finally {
      isLoading.value = false;
    }
  }

  return {
    activeShift,
    isLoading,
    initializeActiveShift
  };
});
