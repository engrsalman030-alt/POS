import { query } from '../db/database';

export const ReportService = {
    async getProfitAndLoss(startDate: string, endDate: string) {
        const income = query(
            `SELECT a.name, SUM(ji.credit - ji.debit) as balance 
       FROM journal_items ji 
       JOIN journals j ON ji.journal_id = j.id 
       JOIN accounts a ON ji.account_id = a.id 
       WHERE a.type = 'Income' AND j.date BETWEEN ? AND ? 
       GROUP BY a.id`,
            [startDate, endDate]
        );

        const expenses = query(
            `SELECT a.name, SUM(ji.debit - ji.credit) as balance 
       FROM journal_items ji 
       JOIN journals j ON ji.journal_id = j.id 
       JOIN accounts a ON ji.account_id = a.id 
       WHERE a.type = 'Expense' AND j.date BETWEEN ? AND ? 
       GROUP BY a.id`,
            [startDate, endDate]
        );

        const totalIncome = income.reduce((sum, row) => sum + (row.balance as number), 0);
        const totalExpenses = expenses.reduce((sum, row) => sum + (row.balance as number), 0);

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
       WHERE a.type = 'Asset' AND j.date <= ? 
       GROUP BY a.id`,
            [date]
        );

        const liabilities = query(
            `SELECT a.name, SUM(ji.credit - ji.debit) as balance 
       FROM journal_items ji 
       JOIN journals j ON ji.journal_id = j.id 
       JOIN accounts a ON ji.account_id = a.id 
       WHERE a.type = 'Liability' AND j.date <= ? 
       GROUP BY a.id`,
            [date]
        );

        const equity = query(
            `SELECT a.name, SUM(ji.credit - ji.debit) as balance 
       FROM journal_items ji 
       JOIN journals j ON ji.journal_id = j.id 
       JOIN accounts a ON ji.account_id = a.id 
       WHERE a.type = 'Equity' AND j.date <= ? 
       GROUP BY a.id`,
            [date]
        );

        // Add Net Profit to retained earnings for Balance Sheet
        const pl = await this.getProfitAndLoss('1900-01-01', date);

        return {
            assets,
            liabilities,
            equity,
            netProfit: pl.netProfit,
            totalAssets: assets.reduce((sum, row) => sum + (row.balance as number), 0),
            totalLiabilities: liabilities.reduce((sum, row) => sum + (row.balance as number), 0),
            totalEquity: equity.reduce((sum, row) => sum + (row.balance as number), 0) + pl.netProfit
        };
    }
};
