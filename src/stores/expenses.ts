import { defineStore } from 'pinia';
import { ERPService } from '../services/erpService';
import { AccountingService } from '../services/accountingService';

export const useExpenseStore = defineStore('expenses', {
    state: () => ({
        expenses: [] as any[],
        categories: [] as any[],
        loading: false
    }),
    actions: {
        async fetchCategories() {
            this.categories = await ERPService.getExpenseCategories();
        },
        async fetchExpenses(startDate?: string, endDate?: string) {
            this.loading = true;
            try {
                this.expenses = await ERPService.getExpenses(startDate, endDate);
            } finally {
                this.loading = false;
            }
        },
        async addCategory(name: string) {
            const id = await ERPService.addExpenseCategory(name);
            await this.fetchCategories();
            return id;
        },
        async addExpense(expense: { date: string, category_id: string, amount: number, notes: string, merchant?: string, payment_method?: string }) {
            const id = await ERPService.addExpense(expense);
            const category = this.categories.find(c => c.id === expense.category_id);
            
            // Post to General Ledger
            await AccountingService.postExpense({
                id,
                date: expense.date,
                amount: expense.amount,
                category_name: category?.name || 'Expense',
                notes: expense.notes
            });

            await this.fetchExpenses();
        }
    }
});
