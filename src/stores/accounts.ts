import { defineStore } from 'pinia';
import { query, execute, saveDb } from '../db/database';
import type { Account } from '../types/accounting';

export const useAccountStore = defineStore('accounts', {
    state: () => ({
        accounts: [] as Account[]
    }),
    actions: {
        async fetchAccounts() {
            this.accounts = query('SELECT * FROM accounts ORDER BY code ASC') as unknown as Account[];
        },
        async addAccount(account: Omit<Account, 'id' | 'is_active'>) {
            const id = crypto.randomUUID();
            execute(
                `INSERT INTO accounts (id, name, code, parent_id, type, is_group) 
        VALUES (?, ?, ?, ?, ?, ?)`,
                [id, account.name, account.code, account.parent_id, account.type, account.is_group ? 1 : 0]
            );
            saveDb();
            await this.fetchAccounts();
        }
    },
    getters: {
        getAccountById: (state) => (id: string) => state.accounts.find(a => a.id === id),
        rootAccounts: (state) => state.accounts.filter(a => !a.parent_id),
        getChildAccounts: (state) => (parentId: string) => state.accounts.filter(a => a.parent_id === parentId)
    }
});
