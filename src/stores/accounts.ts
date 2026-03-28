import { defineStore } from 'pinia';
import { query, execute, saveDb } from '../db/database';
import type { Account } from '../types/accounting';

export const useAccountStore = defineStore('accounts', {
    state: () => ({
        accounts: [] as Account[],
        balances: {} as Record<string, number>
    }),
    actions: {
        async fetchAccounts() {
            this.accounts = query('SELECT * FROM accounts ORDER BY code ASC') as unknown as Account[];
            
            // Pre-calculate all leaf balances
            const balances: Record<string, number> = {};
            const ledgerResults = query(`
                SELECT account_id, SUM(debit) as debits, SUM(credit) as credits 
                FROM journal_items 
                GROUP BY account_id
            `);
            
            // Map leaf balances
            this.accounts.forEach(acc => {
                if (!acc.is_group) {
                    const row: any = ledgerResults.find((r: any) => r.account_id === acc.id);
                    const debits = row?.debits || 0;
                    const credits = row?.credits || 0;
                    
                    if (acc.type === 'Asset' || acc.type === 'Expense') {
                        balances[acc.id] = (debits as number) - (credits as number);
                    } else {
                        balances[acc.id] = (credits as number) - (debits as number);
                    }
                }
            });
            
            this.balances = balances;
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
        getChildAccounts: (state) => (parentId: string) => state.accounts.filter(a => a.parent_id === parentId),
        
        // Recursive balance getter with safety check
        getAccountBalance: (state) => {
            const calculate = (accId: string, visited = new Set()): number => {
                if (visited.has(accId)) return 0; // Prevent infinite loop
                visited.add(accId);
                
                const acc = state.accounts.find(a => a.id === accId);
                if (!acc) return 0;
                
                if (!acc.is_group) {
                    return state.balances[accId] || 0;
                }
                
                const children = state.accounts.filter(a => a.parent_id === accId);
                return children.reduce((sum, child) => sum + calculate(child.id, visited), 0);
            };
            
            return (id: string) => calculate(id);
        }
    }
});
