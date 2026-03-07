import { execute, query, saveDb } from '../db/database';
import type { Item, StockTransaction } from '../types/inventory';

export const InventoryService = {
    async addItem(item: Omit<Item, 'id' | 'stock_quantity' | 'stock_value'>) {
        const id = crypto.randomUUID();
        execute(
            `INSERT INTO items (id, name, sku, type, is_inventory, default_income_account_id, 
        default_expense_account_id, default_inventory_account_id, purchase_rate, sales_rate) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, item.name, item.sku, item.type, item.is_inventory ? 1 : 0,
                item.default_income_account_id, item.default_expense_account_id,
                item.default_inventory_account_id, item.purchase_rate, item.sales_rate]
        );
        saveDb();
        return id;
    },

    async recordStockTransaction(tx: Omit<StockTransaction, 'id'>) {
        const id = crypto.randomUUID();
        execute(
            `INSERT INTO stock_ledger (id, item_id, date, type, quantity, rate, value, reference_type, reference_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, tx.item_id, tx.date, tx.type, tx.quantity, tx.rate, tx.value, tx.reference_type, tx.reference_id]
        );

        // Update item stock quantity and value
        const multiplier = tx.type === 'In' ? 1 : -1;
        execute(
            `UPDATE items SET 
        stock_quantity = stock_quantity + ?, 
        stock_value = stock_value + ? 
        WHERE id = ?`,
            [tx.quantity * multiplier, tx.value * multiplier, tx.item_id]
        );

        saveDb();
    },

    async getStockOnHand(itemId: string) {
        const result = query('SELECT stock_quantity, stock_value FROM items WHERE id = ?', [itemId]);
        return result[0] || { stock_quantity: 0, stock_value: 0 };
    },

    /**
     * Calculate COGS for a sale using FIFO (or Weighted Average - let's use Weighted Average for simplicity)
     */
    async calculateCogs(itemId: string, quantityToSell: number): Promise<number> {
        const item = await this.getStockOnHand(itemId);
        const stockQty = Number(item.stock_quantity || 0);
        const stockVal = Number(item.stock_value || 0);

        if (stockQty <= 0) return 0;

        const averageRate = stockVal / stockQty;
        return quantityToSell * averageRate;
    }
};
