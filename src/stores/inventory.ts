import { defineStore } from 'pinia';
import { query } from '../db/database';
import type { Item } from '../types/inventory';
import { InventoryService } from '../services/inventoryService';

export const useInventoryStore = defineStore('inventory', {
    state: () => ({
        items: [] as Item[]
    }),
    actions: {
        async fetchItems() {
            this.items = query('SELECT * FROM items ORDER BY name ASC') as unknown as Item[];
        },
        async addItem(item: Omit<Item, 'id' | 'stock_quantity' | 'stock_value' | 'is_active'>) {
            await InventoryService.addItem(item as any);
            await this.fetchItems();
        }
    }
});
