import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<'light' | 'dark'>((localStorage.getItem('app-theme') as 'light' | 'dark') || 'light');

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
  };

  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme;
  };

  watch(theme, (newTheme) => {
    localStorage.setItem('app-theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, { immediate: true });

  return {
    theme,
    toggleTheme,
    setTheme,
  };
});
