import { defineStore } from 'pinia';
import { execute, query, saveDb } from '../db/database';
import type { ItemBatch } from '../types/batch';

export const useBatchStore = defineStore('batches', {
    state: () => ({
        batches: [] as ItemBatch[]
    }),
    getters: {
        getBatchesForItem: (state) => (itemId: string) => {
            return state.batches.filter(b => b.item_id === itemId && b.is_active);
        },
        expiredBatches: (state) => {
            const now = new Date().toISOString().split('T')[0];
            return state.batches.filter(b => b.is_active && b.expiry_date && b.expiry_date < now);
        },
        expiringSoonBatches: (state) => {
            const now = new Date();
            const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const today = now.toISOString().split('T')[0];
            return state.batches.filter(b => b.is_active && b.expiry_date && b.expiry_date >= today && b.expiry_date <= thirtyDays);
        }
    },
    actions: {
        async fetchBatches() {
            const rows = query('SELECT * FROM item_batches WHERE is_active = 1 ORDER BY created_at DESC') as any[];
            this.batches = rows.map(r => ({
                ...r,
                is_active: !!r.is_active,
                quantity: Number(r.quantity) || 0,
                purchase_rate: Number(r.purchase_rate) || 0,
                sales_rate: Number(r.sales_rate) || 0
            }));
        },

        async fetchBatchesForItem(itemId: string) {
            const rows = query('SELECT * FROM item_batches WHERE item_id = ? AND is_active = 1 ORDER BY created_at DESC', [itemId]) as any[];
            return rows.map(r => ({
                ...r,
                is_active: !!r.is_active,
                quantity: Number(r.quantity) || 0,
                purchase_rate: Number(r.purchase_rate) || 0,
                sales_rate: Number(r.sales_rate) || 0
            })) as ItemBatch[];
        },

        async addBatch(batch: Omit<ItemBatch, 'id' | 'is_active' | 'created_at'>) {
            const id = crypto.randomUUID();
            const now = new Date().toISOString();
            execute(
                `INSERT INTO item_batches (id, item_id, batch_number, mfg_date, expiry_date, quantity, purchase_rate, sales_rate, supplier_id, notes, is_active, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
                [id, batch.item_id, batch.batch_number, batch.mfg_date || null, batch.expiry_date || null, batch.quantity || 0, batch.purchase_rate || 0, batch.sales_rate || 0, batch.supplier_id || null, batch.notes || null, now]
            );
            saveDb();
            await this.fetchBatches();
            return id;
        },

        async updateBatch(batch: ItemBatch) {
            execute(
                `UPDATE item_batches SET batch_number = ?, mfg_date = ?, expiry_date = ?, quantity = ?, purchase_rate = ?, sales_rate = ?, supplier_id = ?, notes = ? WHERE id = ?`,
                [batch.batch_number, batch.mfg_date || null, batch.expiry_date || null, batch.quantity, batch.purchase_rate, batch.sales_rate, batch.supplier_id || null, batch.notes || null, batch.id]
            );
            saveDb();
            await this.fetchBatches();
        },

        async deleteBatch(id: string) {
            execute('UPDATE item_batches SET is_active = 0 WHERE id = ?', [id]);
            saveDb();
            await this.fetchBatches();
        },

        async updateBatchQuantity(batchId: string, quantityChange: number) {
            execute('UPDATE item_batches SET quantity = MAX(0, quantity + ?) WHERE id = ?', [quantityChange, batchId]);
            saveDb();
        }
    }
});
