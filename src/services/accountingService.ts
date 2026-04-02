import { getDb, execute, query, saveDb } from '../db/database';
import type { JournalEntry, JournalEntryItem } from '../types/accounting';
import type { SalesInvoice, PurchaseBill, Payment } from '../types/transactions';

export const AccountingService = {
    async seedChartOfAccounts() {
        await getDb();
        const existing = query('SELECT * FROM accounts');
        if (existing.length > 0) return;

        const coa = [
            { id: '1', name: 'Assets', code: '1000', type: 'Asset', is_group: 1, parent_id: null },
            { id: '1-1', name: 'Current Assets', code: '1100', type: 'Asset', is_group: 1, parent_id: '1' },
            { id: 'cash', name: 'Cash', code: '1110', type: 'Asset', is_group: 0, parent_id: '1-1' },
            { id: 'bank', name: 'Bank', code: '1120', type: 'Asset', is_group: 0, parent_id: '1-1' },
            { id: 'inventory', name: 'Inventory', code: '1130', type: 'Asset', is_group: 0, parent_id: '1-1' },
            { id: 'ar', name: 'Accounts Receivable', code: '1140', type: 'Asset', is_group: 0, parent_id: '1-1' },

            { id: '2', name: 'Liabilities', code: '2000', type: 'Liability', is_group: 1, parent_id: null },
            { id: 'ap', name: 'Accounts Payable', code: '2100', type: 'Liability', is_group: 0, parent_id: '2' },

            { id: '3', name: 'Equity', code: '3000', type: 'Equity', is_group: 1, parent_id: null },
            { id: 'retained_earnings', name: 'Retained Earnings', code: '3100', type: 'Equity', is_group: 0, parent_id: '3' },

            { id: '4', name: 'Income', code: '4000', type: 'Income', is_group: 1, parent_id: null },
            { id: 'sales_income', name: 'Sales Income', code: '4100', type: 'Income', is_group: 0, parent_id: '4' },

            { id: '5', name: 'Expenses', code: '5000', type: 'Expense', is_group: 1, parent_id: null },
            { id: 'cogs', name: 'Cost of Goods Sold', code: '5100', type: 'Expense', is_group: 0, parent_id: '5' },
            { id: 'operating_expenses', name: 'Operating Expenses', code: '5200', type: 'Expense', is_group: 0, parent_id: '5' },
        ];

        for (const acc of coa) {
            execute(
                'INSERT INTO accounts (id, name, code, type, is_group, parent_id) VALUES (?, ?, ?, ?, ?, ?)',
                [acc.id, acc.name, acc.code, acc.type, acc.is_group, acc.parent_id]
            );
        }
        saveDb();
    },

    async seedTaxes() {
        await getDb();
        const existing = query('SELECT * FROM taxes');
        if (existing.length > 0) return;

        const taxes = [
            { id: 'gst-18', name: 'GST (Standard) 18%', rate: 18 },
            { id: 'srb-13', name: 'SRB (Sindh) 13%', rate: 13 },
            { id: 'exempt', name: 'Exempt / Zero Rated', rate: 0 },
        ];

        for (const tax of taxes) {
            execute(
                'INSERT INTO taxes (id, name, rate) VALUES (?, ?, ?)',
                [tax.id, tax.name, tax.rate]
            );
        }
        saveDb();
    },

    async seedParties() {
        await getDb();
        const existing = query('SELECT * FROM parties');
        if (existing.length > 0) return;

        const parties = [
            { id: 'cust-1', name: 'Ali Electronics', type: 'Customer', email: 'ali@electronics.pk', phone: '0321-1234567', address: 'Saddar, Karachi', tax_id: '1234567-1', receivable_account_id: 'ar', payable_account_id: 'ap' },
            { id: 'cust-2', name: 'Fatima Traders', type: 'Customer', email: 'fatima@traders.pk', phone: '0300-9876543', address: 'Gulberg, Lahore', tax_id: '2345678-2', receivable_account_id: 'ar', payable_account_id: 'ap' },
            { id: 'cust-3', name: 'Hassan & Sons', type: 'Customer', email: '', phone: '0333-5551234', address: 'Blue Area, Islamabad', tax_id: '', receivable_account_id: 'ar', payable_account_id: 'ap' },
            { id: 'sup-1', name: 'Karachi Wholesale Co.', type: 'Supplier', email: 'info@kwholesale.pk', phone: '021-34567890', address: 'Jodia Bazaar, Karachi', tax_id: '3456789-3', receivable_account_id: 'ar', payable_account_id: 'ap' },
            { id: 'sup-2', name: 'Punjab Distributors', type: 'Supplier', email: 'punjab@dist.pk', phone: '042-35678901', address: 'Anarkali, Lahore', tax_id: '4567890-4', receivable_account_id: 'ar', payable_account_id: 'ap' },
        ];

        for (const p of parties) {
            execute(
                'INSERT INTO parties (id, name, type, email, phone, address, tax_id, receivable_account_id, payable_account_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [p.id, p.name, p.type, p.email, p.phone, p.address, p.tax_id, p.receivable_account_id, p.payable_account_id]
            );
        }
        saveDb();
    },

    async seedItems() {
        await getDb();
        const existing = query('SELECT * FROM items');
        if (existing.length > 0) return;

        const items = [
            { id: 'item-1', name: 'LED Bulb 12W', sku: 'LED-12W', type: 'Product', is_inventory: 1, purchase_rate: 120, sales_rate: 200, category: 'Electrical', default_income_account_id: 'sales_income', default_expense_account_id: 'cogs', default_inventory_account_id: 'inventory' },
            { id: 'item-2', name: 'Extension Board 4-Port', sku: 'EXT-4P', type: 'Product', is_inventory: 1, purchase_rate: 350, sales_rate: 550, category: 'Electrical', default_income_account_id: 'sales_income', default_expense_account_id: 'cogs', default_inventory_account_id: 'inventory' },
            { id: 'item-3', name: 'USB Cable Type-C', sku: 'USB-TC', type: 'Product', is_inventory: 1, purchase_rate: 80, sales_rate: 150, category: 'Accessories', default_income_account_id: 'sales_income', default_expense_account_id: 'cogs', default_inventory_account_id: 'inventory' },
            { id: 'item-4', name: 'Wireless Mouse', sku: 'WM-001', type: 'Product', is_inventory: 1, purchase_rate: 450, sales_rate: 750, category: 'Accessories', default_income_account_id: 'sales_income', default_expense_account_id: 'cogs', default_inventory_account_id: 'inventory' },
            { id: 'item-5', name: 'Installation Service', sku: 'SVC-INST', type: 'Service', is_inventory: 0, purchase_rate: 0, sales_rate: 2000, category: 'Services', default_income_account_id: 'sales_income', default_expense_account_id: 'cogs', default_inventory_account_id: 'inventory' },
        ];

        for (const item of items) {
            execute(
                'INSERT INTO items (id, name, sku, type, is_inventory, purchase_rate, sales_rate, category, default_income_account_id, default_expense_account_id, default_inventory_account_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [item.id, item.name, item.sku, item.type, item.is_inventory, item.purchase_rate, item.sales_rate, item.category, item.default_income_account_id, item.default_expense_account_id, item.default_inventory_account_id]
            );
        }
        saveDb();
    },

    async postJournalEntry(entry: Omit<JournalEntry, 'id'> & { id?: string }) {
        const id = entry.id || crypto.randomUUID();
        execute(
            'INSERT INTO journals (id, date, reference_type, reference_id, memo, status) VALUES (?, ?, ?, ?, ?, ?)',
            [id, entry.date, entry.reference_type, entry.reference_id, entry.memo, 'Submitted']
        );

        for (const item of entry.items) {
            execute(
                'INSERT INTO journal_items (id, journal_id, account_id, debit, credit) VALUES (?, ?, ?, ?, ?)',
                [crypto.randomUUID(), id, item.account_id, item.debit, item.credit]
            );
        }
        saveDb();
    },

    async postPurchaseBill(bill: PurchaseBill, isReturn: boolean = false) {
        const items: JournalEntryItem[] = [];

        // Debit/Credit Inventory (or Expense if not inventory)
        items.push({
            id: crypto.randomUUID(),
            journal_entry_id: '',
            account_id: 'inventory',
            debit: isReturn ? 0 : bill.total_amount,
            credit: isReturn ? bill.total_amount : 0
        });

        // Credit/Debit Accounts Payable
        items.push({
            id: crypto.randomUUID(),
            journal_entry_id: '',
            account_id: 'ap',
            debit: isReturn ? bill.total_amount : 0,
            credit: isReturn ? 0 : bill.total_amount
        });

        await this.postJournalEntry({
            date: bill.date,
            reference_type: 'PurchaseBill',
            reference_id: bill.id,
            memo: `Purchase Bill for ${bill.supplier_id}`,
            status: 'Submitted',
            items
        });
    },

    async postSalesInvoice(invoice: SalesInvoice, cogsAmount: number, isReturn: boolean = false) {
        const items: JournalEntryItem[] = [];

        // Debit/Credit Acc Receivable
        items.push({
            id: crypto.randomUUID(),
            journal_entry_id: '',
            account_id: 'ar',
            debit: isReturn ? 0 : invoice.total_amount,
            credit: isReturn ? invoice.total_amount : 0
        });

        // Credit/Debit Sales Income
        items.push({
            id: crypto.randomUUID(),
            journal_entry_id: '',
            account_id: 'sales_income',
            debit: isReturn ? invoice.total_amount : 0,
            credit: isReturn ? 0 : invoice.total_amount
        });

        // COGS impact
        if (cogsAmount > 0) {
            items.push({
                id: crypto.randomUUID(),
                journal_entry_id: '',
                account_id: 'cogs',
                debit: isReturn ? 0 : cogsAmount,
                credit: isReturn ? cogsAmount : 0
            });
            items.push({
                id: crypto.randomUUID(),
                journal_entry_id: '',
                account_id: 'inventory',
                debit: isReturn ? cogsAmount : 0,
                credit: isReturn ? 0 : cogsAmount
            });
        }

        await this.postJournalEntry({
            date: invoice.date,
            reference_type: 'SalesInvoice',
            reference_id: invoice.id,
            memo: `Sales Invoice for ${invoice.customer_id}`,
            status: 'Submitted',
            items
        });
    },

    async postPayment(payment: Payment) {
        const items: JournalEntryItem[] = [];

        if (payment.payment_type === 'Pay') {
            // Pay supplier: Debit AP, Credit Bank/Cash
            items.push({
                id: crypto.randomUUID(),
                journal_entry_id: '',
                account_id: 'ap',
                debit: payment.amount,
                credit: 0
            });
            items.push({
                id: crypto.randomUUID(),
                journal_entry_id: '',
                account_id: payment.account_id,
                debit: 0,
                credit: payment.amount
            });
        } else {
            // Receive from customer: Debit Bank/Cash, Credit AR
            items.push({
                id: crypto.randomUUID(),
                journal_entry_id: '',
                account_id: payment.account_id,
                debit: payment.amount,
                credit: 0
            });
            items.push({
                id: crypto.randomUUID(),
                journal_entry_id: '',
                account_id: 'ar',
                debit: 0,
                credit: payment.amount
            });
        }

        await this.postJournalEntry({
            date: payment.date,
            reference_type: 'Payment',
            reference_id: payment.id,
            memo: payment.memo || `Payment for ${payment.party_id}`,
            status: 'Submitted',
            items
        });
    },

    async postExpense(expense: { id: string, date: string, amount: number, category_name: string, notes: string }) {
        const items: JournalEntryItem[] = [];

        // Debit Operating Expenses
        items.push({
            id: crypto.randomUUID(),
            journal_entry_id: '',
            account_id: 'operating_expenses',
            debit: expense.amount,
            credit: 0
        });

        // Credit Cash (Simple default for now, can be bank)
        items.push({
            id: crypto.randomUUID(),
            journal_entry_id: '',
            account_id: 'cash',
            debit: 0,
            credit: expense.amount
        });

        await this.postJournalEntry({
            date: expense.date,
            reference_type: 'Expense',
            reference_id: expense.id,
            memo: `${expense.category_name}: ${expense.notes || 'No description'}`,
            status: 'Submitted',
            items
        });
    }
};
