import { defineStore } from 'pinia';
import { execute, query, saveDb } from '../db/database';
import type { SalesInvoice, PurchaseBill, Payment } from '../types/transactions';
import { AccountingService } from '../services/accountingService';
import { InventoryService } from '../services/inventoryService';

export const useTransactionStore = defineStore('transactions', {
    state: () => ({
        invoices: [] as SalesInvoice[],
        bills: [] as PurchaseBill[]
    }),
    actions: {
        async fetchInvoices() {
            this.invoices = query('SELECT * FROM sales_invoices ORDER BY date DESC') as any;
        },
        async fetchBills() {
            this.bills = query('SELECT * FROM purchase_bills ORDER BY date DESC') as any;
        },

        async createInvoice(invoice: Omit<SalesInvoice, 'id' | 'status'>) {
            const id = crypto.randomUUID();
            // Basic insert logic (Simplified for now, in real app we'd insert line items too)
            execute(
                `INSERT INTO sales_invoices (id, date, customer_id, total_amount, status) 
        VALUES (?, ?, ?, ?, ?)`,
                [id, invoice.date, invoice.customer_id, invoice.total_amount, 'Submitted']
            );

            // Post to accounting
            let totalCogs = 0;
            for (const item of invoice.items) {
                const cogs = await InventoryService.calculateCogs(item.item_id, item.quantity);
                totalCogs += cogs;

                // Record stock movement
                await InventoryService.recordStockTransaction({
                    item_id: item.item_id,
                    date: invoice.date,
                    type: 'Out',
                    quantity: item.quantity,
                    rate: item.rate,
                    value: cogs,
                    reference_type: 'Invoice',
                    reference_id: id
                });
            }

            await AccountingService.postSalesInvoice({ ...invoice, id, status: 'Submitted' } as any, totalCogs);
            saveDb();
            await this.fetchInvoices();
        },

        async createBill(bill: Omit<PurchaseBill, 'id' | 'status'>) {
            const id = crypto.randomUUID();
            execute(
                `INSERT INTO purchase_bills (id, date, supplier_id, total_amount, status) 
        VALUES (?, ?, ?, ?, ?)`,
                [id, bill.date, bill.supplier_id, bill.total_amount, 'Submitted']
            );

            // Post to accounting
            await AccountingService.postPurchaseBill({ ...bill, id, status: 'Submitted' } as any);

            // Record stock movement
            for (const item of bill.items) {
                await InventoryService.recordStockTransaction({
                    item_id: item.item_id,
                    date: bill.date,
                    type: 'In',
                    quantity: item.quantity,
                    rate: item.rate,
                    value: item.total,
                    reference_type: 'Bill',
                    reference_id: id
                });
            }

            saveDb();
            await this.fetchBills();
        }
    }
});
