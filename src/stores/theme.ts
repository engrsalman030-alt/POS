import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { ERPService } from '../services/erpService';

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<'light' | 'dark'>((localStorage.getItem('app-theme') as 'light' | 'dark') || 'dark');
  const primaryColor = ref<string>(localStorage.getItem('app-primary-color') || '#10b981');

  const toggleTheme = async () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    await ERPService.updateSetting('ui_dark_mode', (theme.value === 'dark').toString());
  };

  const setTheme = async (newTheme: 'light' | 'dark') => {
    theme.value = newTheme;
    await ERPService.updateSetting('ui_dark_mode', (newTheme === 'dark').toString());
  };

  const setPrimaryColor = async (color: string) => {
    primaryColor.value = color;
    localStorage.setItem('app-primary-color', color);
    document.documentElement.style.setProperty('--brand', color);
    await ERPService.updateSetting('ui_primary_color', color);
  };

  // Initial load from DB if available
  const loadFromDb = async () => {
    const settings = await ERPService.getSettings();
    const darkSetting = settings.find(s => s.key === 'ui_dark_mode');
    const colorSetting = settings.find(s => s.key === 'ui_primary_color');
    
    if (darkSetting) {
      theme.value = darkSetting.value === 'true' ? 'dark' : 'light';
    }
    if (colorSetting) {
      primaryColor.value = colorSetting.value as string;
      document.documentElement.style.setProperty('--brand', colorSetting.value as string);
    }
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
    primaryColor,
    toggleTheme,
    setTheme,
    setPrimaryColor,
    loadFromDb
  };
});
