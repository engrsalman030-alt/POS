import { defineStore } from 'pinia';
import { query } from '../db/database';
import type { Item } from '../types/inventory';
import { InventoryService } from '../services/inventoryService';

export const useInventoryStore = defineStore('inventory', {
    state: () => ({
        items: [] as Item[]
    }),
    actions: {
        // Actions
        async fetchItems() {
            this.items = query('SELECT * FROM items WHERE is_active = 1 ORDER BY name ASC') as unknown as Item[];
        },
        async addItem(item: Omit<Item, 'id' | 'stock_quantity' | 'stock_value' | 'is_active'>, openingQuantity: number = 0, openingBonus: number = 0) {
            const newItemId = await InventoryService.addItem(item as any);

            if (openingQuantity > 0 || openingBonus > 0) {
                await InventoryService.recordStockTransaction({
                    item_id: newItemId,
                    date: new Date().toISOString(),
                    type: 'In',
                    quantity: openingQuantity,
                    bonus_quantity: openingBonus,
                    rate: item.purchase_rate || 0,
                    value: openingQuantity * (item.purchase_rate || 0),
                    reference_type: 'Opening Stock',
                    reference_id: crypto.randomUUID()
                });
            }

            await this.fetchItems();
        },
        async updateItem(item: Item) {
            await InventoryService.updateItem(item);
            await this.fetchItems();
        },
        async addStock(itemId: string, quantity: number, rate: number = 0) {
            await InventoryService.recordStockTransaction({
                item_id: itemId,
                date: new Date().toISOString(),
                type: 'In',
                quantity: quantity,
                rate: rate,
                value: quantity * rate,
                reference_type: 'Manual Adjustment',
                reference_id: crypto.randomUUID()
            });
            await this.fetchItems();
        },
        async deleteItem(id: string) {
            await InventoryService.deleteItem(id);
            await this.fetchItems();
        }
    }
});
