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
    }
};
