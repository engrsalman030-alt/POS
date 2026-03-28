import { ref, computed, watch } from 'vue';

export function usePagination<T>(items: { value: T[] } | T[], itemsPerPage: number = 10) {
  const currentPage = ref(1);
  
  const totalItems = computed(() => {
    return Array.isArray(items) ? items.length : items.value.length;
  });

  const totalPages = computed(() => {
    return Math.ceil(totalItems.value / itemsPerPage) || 1;
  });

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const rawItems = Array.isArray(items) ? items : items.value;
    return rawItems.slice(start, end);
  });

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };

  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  // Reset to page 1 if data changes significantly (e.g. filtered)
  watch(() => totalItems.value, () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = 1;
    }
  });

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    totalItems,
    paginatedItems,
    nextPage,
    prevPage,
    setPage
  };
}
