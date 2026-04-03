import { defineStore } from 'pinia';
import { ref } from 'vue';
import { query, execute, saveDb } from '../db/database';

export interface Area {
  id: string;
  name: string;
  is_active: number;
}

export const useAreaStore = defineStore('areas', () => {
  const areas = ref<Area[]>([]);
  const loading = ref(false);

  async function fetchAreas() {
    loading.value = true;
    try {
      const results = query('SELECT * FROM areas ORDER BY name ASC');
      areas.value = results as unknown as Area[];
    } catch (error) {
      console.error('Failed to fetch areas:', error);
    } finally {
      loading.value = false;
    }
  }

  async function addArea(name: string) {
    const id = crypto.randomUUID();
    try {
      execute('INSERT INTO areas (id, name, is_active) VALUES (?, ?, 1)', [id, name]);
      await saveDb();
      await fetchAreas();
      return id;
    } catch (error) {
      console.error('Failed to add area:', error);
      throw error;
    }
  }

  async function updateArea(id: string, name: string, is_active: number = 1) {
    try {
      execute('UPDATE areas SET name = ?, is_active = ? WHERE id = ?', [name, is_active, id]);
      await saveDb();
      await fetchAreas();
    } catch (error) {
      console.error('Failed to update area:', error);
      throw error;
    }
  }

  async function deleteArea(id: string) {
    try {
      // Check if any parties are using this area
      const inUse = query('SELECT COUNT(*) as count FROM parties WHERE area_id = ?', [id]) as any[];
      if (inUse[0].count > 0) {
        throw new Error('This area is in use by customers or suppliers and cannot be deleted.');
      }
      
      execute('DELETE FROM areas WHERE id = ?', [id]);
      await saveDb();
      await fetchAreas();
    } catch (error) {
      console.error('Failed to delete area:', error);
      throw error;
    }
  }

  return {
    areas,
    loading,
    fetchAreas,
    addArea,
    updateArea,
    deleteArea
  };
});
