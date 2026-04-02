import { query } from '../db/database';

export const ReportService = {
    async getProfitAndLoss(startDate: string, endDate: string) {
        const income = query(
            `SELECT a.name, SUM(ji.credit - ji.debit) as balance 
       FROM journal_items ji 
       JOIN journals j ON ji.journal_id = j.id 
       JOIN accounts a ON ji.account_id = a.id 
       WHERE a.type = 'Income' AND date(j.date) BETWEEN date(?) AND date(?) 
       GROUP BY a.id`,
            [startDate, endDate]
        ) as unknown as { name: string; balance: number }[];

        const expenses = query(
            `SELECT a.name, SUM(ji.debit - ji.credit) as balance 
       FROM journal_items ji 
       JOIN journals j ON ji.journal_id = j.id 
       JOIN accounts a ON ji.account_id = a.id 
       WHERE a.type = 'Expense' AND date(j.date) BETWEEN date(?) AND date(?) 
       GROUP BY a.id`,
            [startDate, endDate]
        ) as unknown as { name: string; balance: number }[];

        const totalIncome = income.reduce((sum, row) => sum + (row.balance || 0), 0);
        const totalExpenses = expenses.reduce((sum, row) => sum + (row.balance || 0), 0);

        return {
            income,
            expenses,
            totalIncome,
            totalExpenses,
            netProfit: totalIncome - totalExpenses
        };
    },

    async getBalanceSheet(date: string) {
        const assets = query(
            `SELECT a.name, SUM(ji.debit - ji.credit) as balance 
       FROM journal_items ji 
       JOIN journals j ON ji.journal_id = j.id 
       JOIN accounts a ON ji.account_id = a.id 
       WHERE a.type = 'Asset' AND date(j.date) <= date(?) 
       GROUP BY a.id`,
            [date]
        ) as unknown as { name: string; balance: number }[];

        const liabilities = query(
            `SELECT a.name, SUM(ji.credit - ji.debit) as balance 
       FROM journal_items ji 
       JOIN journals j ON ji.journal_id = j.id 
       JOIN accounts a ON ji.account_id = a.id 
       WHERE a.type = 'Liability' AND date(j.date) <= date(?) 
       GROUP BY a.id`,
            [date]
        ) as unknown as { name: string; balance: number }[];

        const equity = query(
            `SELECT a.name, SUM(ji.credit - ji.debit) as balance 
       FROM journal_items ji 
       JOIN journals j ON ji.journal_id = j.id 
       JOIN accounts a ON ji.account_id = a.id 
       WHERE a.type = 'Equity' AND date(j.date) <= date(?) 
       GROUP BY a.id`,
            [date]
        ) as unknown as { name: string; balance: number }[];

        // Add Net Profit to retained earnings for Balance Sheet
        const pl = await this.getProfitAndLoss('1900-01-01', date);

        return {
            assets,
            liabilities,
            equity,
            netProfit: pl.netProfit,
            totalAssets: assets.reduce((sum, row) => sum + (row.balance || 0), 0),
            totalLiabilities: liabilities.reduce((sum, row) => sum + (row.balance || 0), 0),
            totalEquity: equity.reduce((sum, row) => sum + (row.balance || 0), 0) + pl.netProfit
        };
    },

    async getHistoricalBalances(accountType: 'Asset' | 'Liability' | 'Income' | 'Expense', days: number = 7, accountNames: string[] = []) {
        const dates = [];
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dates.push(d.toISOString().split('T')[0]);
        }

        const history = [];
        for (const date of dates) {
            let sql = '';
            const params: any[] = [];

            let nameFilter = '';
            if (accountNames.length > 0) {
                nameFilter = ` AND a.name IN (${accountNames.map(() => '?').join(',')})`;
                params.push(...accountNames);
            }

            if (accountType === 'Asset') {
                sql = `SELECT SUM(ji.debit - ji.credit) as balance FROM journal_items ji JOIN journals j ON ji.journal_id = j.id JOIN accounts a ON ji.account_id = a.id WHERE a.type = 'Asset'${nameFilter} AND j.date <= ?`;
            } else if (accountType === 'Liability') {
                sql = `SELECT SUM(ji.credit - ji.debit) as balance FROM journal_items ji JOIN journals j ON ji.journal_id = j.id JOIN accounts a ON ji.account_id = a.id WHERE a.type = 'Liability'${nameFilter} AND j.date <= ?`;
            } else if (accountType === 'Income' || accountType === 'Expense') {
                const startOfDay = `${date} 00:00:00`;
                const endOfDay = `${date} 23:59:59`;
                if (accountType === 'Income') {
                    sql = `SELECT SUM(ji.credit - ji.debit) as balance FROM journal_items ji JOIN journals j ON ji.journal_id = j.id JOIN accounts a ON ji.account_id = a.id WHERE a.type = 'Income'${nameFilter} AND j.date BETWEEN ? AND ?`;
                } else {
                    sql = `SELECT SUM(ji.debit - ji.credit) as balance FROM journal_items ji JOIN journals j ON ji.journal_id = j.id JOIN accounts a ON ji.account_id = a.id WHERE a.type = 'Expense'${nameFilter} AND j.date BETWEEN ? AND ?`;
                }
                params.push(startOfDay, endOfDay);
                const result = query(sql, params);
                history.push((result[0]?.balance as number) || 0);
                continue;
            }

            params.push(date);
            const result = query(sql, params);
            history.push((result[0]?.balance as number) || 0);
        }
        return history;
    },

    async getPartyBalances() {
        // Calculate balance for each customer (Debit Invoices - Credit Payments)
        const customerBalances = query(`
            SELECT p.id, 
                   IFNULL(SUM(si.total_amount), 0) - IFNULL(p_pay.paid_total, 0) as balance
            FROM parties p
            LEFT JOIN sales_invoices si ON p.id = si.customer_id
            LEFT JOIN (
                SELECT party_id, SUM(amount) as paid_total 
                FROM payments 
                WHERE payment_type = 'Receive' 
                GROUP BY party_id
            ) p_pay ON p.id = p_pay.party_id
            WHERE p.type = 'Customer'
            GROUP BY p.id
        `);

        // Calculate balance for each supplier (Credit Bills - Debit Payments)
        const supplierBalances = query(`
            SELECT p.id, 
                   IFNULL(SUM(pb.total_amount), 0) - IFNULL(p_pay.paid_total, 0) as balance
            FROM parties p
            LEFT JOIN purchase_bills pb ON p.id = pb.supplier_id
            LEFT JOIN (
                SELECT party_id, SUM(amount) as paid_total 
                FROM payments 
                WHERE payment_type = 'Pay' 
                GROUP BY party_id
            ) p_pay ON p.id = p_pay.party_id
            WHERE p.type = 'Supplier'
            GROUP BY p.id
        `);

        const balances: Record<string, number> = {};
        [...customerBalances, ...supplierBalances].forEach((row: any) => {
            balances[row.id] = row.balance || 0;
        });

        return balances;
    },

    // ─── Customer Ledger ────────────────────────────────────────────────────────
    async getCustomerLedger(customerId: string, startDate: string, endDate: string) {
        // Opening balance = party's manual opening + all invoices before startDate - all payments before startDate
        const partyRow = query(
            `SELECT opening_balance, balance_type, name FROM parties WHERE id = ?`,
            [customerId]
        ) as any[];
        const party = partyRow[0] || {};
        const manualOpening = party.balance_type === 'Debit'
            ? (party.opening_balance || 0)
            : -(party.opening_balance || 0);

        const invBefore = query(
            `SELECT COALESCE(SUM(total_amount), 0) as total FROM sales_invoices WHERE customer_id = ? AND date < ?`,
            [customerId, startDate]
        ) as any[];
        const payBefore = query(
            `SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE party_id = ? AND payment_type = 'Receive' AND date < ?`,
            [customerId, startDate]
        ) as any[];
        const openingBalance = manualOpening + (invBefore[0]?.total || 0) - (payBefore[0]?.total || 0);

        const transactions = query(
            `SELECT date, id as reference, 'Sales Invoice' as description, total_amount as debit, 0 as credit
             FROM sales_invoices WHERE customer_id = ? AND date BETWEEN ? AND ?
             UNION ALL
             SELECT date, id as reference, 'Payment Received' as description, 0 as debit, amount as credit
             FROM payments WHERE party_id = ? AND payment_type = 'Receive' AND date BETWEEN ? AND ?
             ORDER BY date ASC, reference ASC`,
            [customerId, startDate, endDate, customerId, startDate, endDate]
        ) as any[];

        let runningBalance = openingBalance;
        const rows = transactions.map(t => {
            runningBalance += (t.debit || 0) - (t.credit || 0);
            return { ...t, balance: runningBalance };
        });

        return { rows, openingBalance, closingBalance: runningBalance, partyName: party.name };
    },

    // ─── Supplier Ledger ─────────────────────────────────────────────────────────
    async getSupplierLedger(supplierId: string, startDate: string, endDate: string) {
        const partyRow = query(
            `SELECT opening_balance, balance_type, name FROM parties WHERE id = ?`,
            [supplierId]
        ) as any[];
        const party = partyRow[0] || {};
        const manualOpening = party.balance_type === 'Credit'
            ? (party.opening_balance || 0)
            : -(party.opening_balance || 0);

        const billsBefore = query(
            `SELECT COALESCE(SUM(total_amount), 0) as total FROM purchase_bills WHERE supplier_id = ? AND date < ?`,
            [supplierId, startDate]
        ) as any[];
        const payBefore = query(
            `SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE party_id = ? AND payment_type = 'Pay' AND date < ?`,
            [supplierId, startDate]
        ) as any[];
        const openingBalance = manualOpening + (billsBefore[0]?.total || 0) - (payBefore[0]?.total || 0);

        const transactions = query(
            `SELECT date, id as reference, 'Purchase Bill' as description, 0 as debit, total_amount as credit
             FROM purchase_bills WHERE supplier_id = ? AND date BETWEEN ? AND ?
             UNION ALL
             SELECT date, id as reference, 'Payment Made' as description, amount as debit, 0 as credit
             FROM payments WHERE party_id = ? AND payment_type = 'Pay' AND date BETWEEN ? AND ?
             ORDER BY date ASC, reference ASC`,
            [supplierId, startDate, endDate, supplierId, startDate, endDate]
        ) as any[];

        let runningBalance = openingBalance;
        const rows = transactions.map(t => {
            runningBalance += (t.credit || 0) - (t.debit || 0);
            return { ...t, balance: runningBalance };
        });

        return { rows, openingBalance, closingBalance: runningBalance, partyName: party.name };
    },

    // ─── Parties List ────────────────────────────────────────────────────────────
    async getParties(type?: 'Customer' | 'Supplier') {
        let sql = `SELECT id, name, type FROM parties WHERE is_active = 1`;
        const params: any[] = [];
        if (type) {
            sql += ` AND (type = ? OR type = 'Both')`;
            params.push(type);
        }
        sql += ' ORDER BY name ASC';
        return query(sql, params) as unknown as { id: string; name: string; type: string }[];
    },
};
