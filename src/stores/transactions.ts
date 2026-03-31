import { defineStore } from 'pinia';
import { execute, query, saveDb } from '../db/database';
import type { SalesInvoice, PurchaseBill } from '../types/transactions';
import { AccountingService } from '../services/accountingService';
import { InventoryService } from '../services/inventoryService';

export const useTransactionStore = defineStore('transactions', {
    state: () => ({
        invoices: [] as SalesInvoice[],
        bills: [] as PurchaseBill[]
    }),
    actions: {
        // Actions to create transactions
        async fetchInvoices() {
            const invoices = query('SELECT * FROM sales_invoices ORDER BY date DESC') as any[];
            for (const inv of invoices) {
                inv.items = query('SELECT * FROM sales_invoice_items WHERE invoice_id = ?', [inv.id]) as any[];
            }
            this.invoices = invoices;
        },
        async fetchBills() {
            const bills = query('SELECT * FROM purchase_bills ORDER BY date DESC') as any[];
            for (const bill of bills) {
                bill.items = query('SELECT * FROM purchase_bill_items WHERE bill_id = ?', [bill.id]) as any[];
            }
            this.bills = bills;
        },

        async createInvoice(invoice: Omit<SalesInvoice, 'id' | 'status'>) {
            const id = crypto.randomUUID();
            
            // 1. Insert Header
            execute(
                `INSERT INTO sales_invoices (id, date, customer_id, total_amount, discount_amount, tax_amount, status, outstanding_amount, shift_id, sales_manager, frappe_reference) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [id, invoice.date, invoice.customer_id, invoice.total_amount, invoice.discount_amount || 0, invoice.tax_amount || 0, 'Submitted', invoice.total_amount, invoice.shift_id, invoice.sales_manager || null, invoice.frappe_reference || null]
            );

            // 2. Insert Line Items & Handle Stock
            let totalCogs = 0;
            for (const item of invoice.items) {
                const itemId = crypto.randomUUID();
                execute(
                    `INSERT INTO sales_invoice_items (id, invoice_id, item_id, quantity, bonus_quantity, batch_number, expiry_date, rate, tax_amount, total) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [itemId, id, item.item_id, item.quantity, item.bonus_quantity || 0, item.batch_number || null, item.expiry_date || null, item.rate, item.tax_amount || 0, item.total]
                );

                const cogs = await InventoryService.calculateCogs(item.item_id, item.quantity + (item.bonus_quantity || 0));
                totalCogs += cogs;

                // Record stock movement (out = quantity + bonus)
                await InventoryService.recordStockTransaction({
                    item_id: item.item_id,
                    date: invoice.date,
                    type: 'Out',
                    quantity: item.quantity,
                    bonus_quantity: item.bonus_quantity || 0,
                    rate: item.rate,
                    value: cogs,
                    reference_type: 'Invoice',
                    reference_id: id
                });
            }

            // 3. Post to accounting
            await AccountingService.postSalesInvoice({ ...invoice, id, status: 'Submitted' } as any, totalCogs);
            
            saveDb();
            await this.fetchInvoices();
            return id;
        },

        async createBill(bill: Omit<PurchaseBill, 'id' | 'status'>) {
            const id = crypto.randomUUID();

            // 1. Insert Header
            execute(
                `INSERT INTO purchase_bills (id, date, supplier_id, total_amount, tax_amount, status, outstanding_amount, sales_manager, frappe_reference) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [id, bill.date, bill.supplier_id, bill.total_amount, bill.tax_amount || 0, 'Submitted', bill.total_amount, bill.sales_manager || null, bill.frappe_reference || null]
            );

            // 2. Insert Line Items & Handle Stock
            for (const item of bill.items) {
                const itemId = crypto.randomUUID();
                execute(
                    `INSERT INTO purchase_bill_items (id, bill_id, item_id, quantity, bonus_quantity, batch_number, expiry_date, rate, tax_amount, total) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [itemId, id, item.item_id, item.quantity, item.bonus_quantity || 0, item.batch_number || null, item.expiry_date || null, item.rate, item.tax_amount || 0, item.total]
                );

                await InventoryService.recordStockTransaction({
                    item_id: item.item_id,
                    date: bill.date,
                    type: 'In',
                    quantity: item.quantity,
                    bonus_quantity: item.bonus_quantity || 0,
                    rate: item.rate,
                    value: item.total,
                    reference_type: 'Bill',
                    reference_id: id
                });
            }

            // 3. Post to accounting
            await AccountingService.postPurchaseBill({ ...bill, id, status: 'Submitted' } as any);

            saveDb();
            await this.fetchBills();
            return id;
        },

        async createPayment(payment: Omit<import('../types/transactions').Payment, 'id'>) {
            const id = crypto.randomUUID();
            const fullPayment = { ...payment, id };
            
            // 1. Insert into payments table (Missing in previous version or only handled in AccountingService)
            execute(
                `INSERT INTO payments (id, date, party_id, party_type, payment_type, account_id, amount, reference_type, reference_id, memo) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [id, payment.date, payment.party_id, payment.party_type, payment.payment_type, payment.account_id, payment.amount, payment.reference_type || null, payment.reference_id || null, payment.memo || null]
            );

            // 2. Post to journals via Accounting Service
            await AccountingService.postPayment(fullPayment as any);
            
            saveDb();
            return id;
        },

        async fetchLedger(partyId: string) {
            const invoices = query('SELECT id, date, total_amount as amount, status, "Invoice" as type FROM sales_invoices WHERE customer_id = ?', [partyId]);
            const bills = query('SELECT id, date, total_amount as amount, status, "Bill" as type FROM purchase_bills WHERE supplier_id = ?', [partyId]);
            const payments = query('SELECT id, date, amount, "Posted" as status, "Payment" as type, payment_type FROM payments WHERE party_id = ?', [partyId]);

            const ledger = [...invoices, ...bills, ...payments].sort((a: any, b: any) => 
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            return ledger;
        }
    }
});
