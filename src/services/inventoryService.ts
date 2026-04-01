import { execute, query, saveDb } from '../db/database';
import type { Item, StockTransaction } from '../types/inventory';

export const InventoryService = {
    async addItem(item: Omit<Item, 'id' | 'stock_quantity' | 'stock_value'>) {
        const id = crypto.randomUUID();
        execute(
            `INSERT INTO items (
                id, name, sku, barcode, type, category, brand, is_inventory, 
                default_income_account_id, default_expense_account_id, default_inventory_account_id, 
                purchase_rate, sales_rate, wholesale_rate, min_sales_rate, discount_allowed,
                reorder_level, uom, warehouse, image, is_active,
                batch_number, expiry_date, mfg_date, medicine_type, prescription_required,
                imei_number, serial_number, warranty_period,
                weight, pack_size, unit_type, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id, item.name, item.sku, item.barcode || null, item.type, item.category || 'General', item.brand || null, item.is_inventory ? 1 : 0,
                item.default_income_account_id, item.default_expense_account_id, item.default_inventory_account_id,
                item.purchase_rate, item.sales_rate, item.wholesale_rate || 0, item.min_sales_rate || 0, item.discount_allowed ? 1 : 0,
                item.reorder_level || 0, item.uom || 'Units', item.warehouse || null, item.image || null, item.is_active ? 1 : 0,
                item.batch_number || null, item.expiry_date || null, item.mfg_date || null, item.medicine_type || null, item.prescription_required ? 1 : 0,
                item.imei_number || null, item.serial_number || null, item.warranty_period || null,
                item.weight || null, item.pack_size || null, item.unit_type || null, item.notes || null
            ]
        );
        saveDb();
        return id;
    },

    async updateItem(item: Item) {
        execute(
            `UPDATE items SET 
                name = ?, sku = ?, barcode = ?, type = ?, category = ?, brand = ?, is_inventory = ?,
                purchase_rate = ?, sales_rate = ?, wholesale_rate = ?, min_sales_rate = ?, discount_allowed = ?,
                reorder_level = ?, uom = ?, warehouse = ?, image = ?, is_active = ?,
                batch_number = ?, expiry_date = ?, mfg_date = ?, medicine_type = ?, prescription_required = ?,
                imei_number = ?, serial_number = ?, warranty_period = ?,
                weight = ?, pack_size = ?, unit_type = ?, notes = ?
            WHERE id = ?`,
            [
                item.name, item.sku, item.barcode || null, item.type, item.category || 'General', item.brand || null, item.is_inventory ? 1 : 0,
                item.purchase_rate, item.sales_rate, item.wholesale_rate || 0, item.min_sales_rate || 0, item.discount_allowed ? 1 : 0,
                item.reorder_level || 0, item.uom || 'Units', item.warehouse || null, item.image || null, item.is_active ? 1 : 0,
                item.batch_number || null, item.expiry_date || null, item.mfg_date || null, item.medicine_type || null, item.prescription_required ? 1 : 0,
                item.imei_number || null, item.serial_number || null, item.warranty_period || null,
                item.weight || null, item.pack_size || null, item.unit_type || null, item.notes || null,
                item.id
            ]
        );
        saveDb();
    },

    async recordStockTransaction(tx: Omit<StockTransaction, 'id'>) {
        const id = crypto.randomUUID();
        execute(
            `INSERT INTO stock_ledger (id, item_id, date, type, quantity, bonus_quantity, rate, value, reference_type, reference_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, tx.item_id, tx.date, tx.type, tx.quantity, tx.bonus_quantity || 0, tx.rate, tx.value, tx.reference_type, tx.reference_id]
        );

        // Update item stock quantity and value
        const multiplier = tx.type === 'In' ? 1 : -1;
        execute(
            `UPDATE items SET 
            stock_quantity = stock_quantity + ?, 
            stock_value = stock_value + ? 
            WHERE id = ?`,
            [(tx.quantity + (tx.bonus_quantity || 0)) * multiplier, tx.value * multiplier, tx.item_id]
        );

        saveDb();
    },

    async recordBatchQuantity(batchId: string, quantityChange: number) {
        execute(
            `UPDATE item_batches SET quantity = quantity + ? WHERE id = ?`,
            [quantityChange, batchId]
        );
        saveDb();
    },

    async findOrCreateBatch(itemId: string, batchNumber: string, expiryDate?: string, rate?: number) {
        if (!batchNumber) return null;
        const existing = query('SELECT id FROM item_batches WHERE item_id = ? AND UPPER(batch_number) = ? AND is_active = 1', [itemId, batchNumber.toUpperCase()]);
        if (existing.length > 0) {
            const batchId = (existing[0] as any).id;
            // Optionally update expiry if provided and missing
            if (expiryDate) {
                execute('UPDATE item_batches SET expiry_date = COALESCE(expiry_date, ?) WHERE id = ?', [expiryDate, batchId]);
            }
            return batchId;
        }

        const id = crypto.randomUUID();
        execute(
            `INSERT INTO item_batches (id, item_id, batch_number, expiry_date, purchase_rate, quantity, is_active, created_at) 
             VALUES (?, ?, ?, ?, ?, 0, 1, ?)`,
            [id, itemId, batchNumber.toUpperCase(), expiryDate || null, rate || 0, new Date().toISOString()]
        );
        saveDb();
        return id;
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
    },

    async deleteItem(id: string) {
        execute('UPDATE items SET is_active = 0 WHERE id = ?', [id]);
        saveDb();
    }
};
