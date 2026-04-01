import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ERPService } from '../services/erpService';

export const useERPStore = defineStore('erp', () => {
    const settings = ref<Record<string, string>>({});
    const loading = ref(false);

    const loadSettings = async () => {
        loading.value = true;
        try {
            const raw = await ERPService.getSettings();
            const map: Record<string, string> = {};
            raw.forEach(s => {
                const k = String(s.key);
                const v = String(s.value);
                map[k] = v;
            });
            settings.value = map;
        } finally {
            loading.value = false;
        }
    };

    const updateSetting = async (key: string, value: string) => {
        settings.value[key] = value;
        await ERPService.updateSetting(key, value);
    };

    const getSetting = (key: string, defaultValue: string = '') => {
        return settings.value[key] || defaultValue;
    };

    return {
        settings,
        loading,
        loadSettings,
        updateSetting,
        getSetting
    };
});
