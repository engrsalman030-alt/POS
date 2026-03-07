import { defineStore } from 'pinia';
import { execute, query, saveDb } from '../db/database';
import { AccountingService } from '../services/accountingService';

export interface Company {
    id: string;
    name: string;
    country: string;
    currency: string;
    fiscal_year_start: string;
    is_setup: boolean;
    ntn?: string;
}

export const useCompanyStore = defineStore('company', {
    state: () => ({
        company: null as Company | null,
        isInitialized: false
    }),
    actions: {
        async loadCompany() {
            const rows = query('SELECT * FROM company LIMIT 1') as any[];
            if (rows.length > 0) {
                const is_setup = Boolean(rows[0].is_setup);
                this.company = { ...rows[0], is_setup };
                this.isInitialized = is_setup;
            } else {
                this.company = null;
                this.isInitialized = false;
            }
        },
        async setupCompany(form: any) {
            const id = this.company?.id || crypto.randomUUID();
            execute('DELETE FROM company', []);
            execute(
                `INSERT INTO company (id, name, country, currency, fiscal_year_start, is_setup, ntn)
                 VALUES (?, ?, ?, ?, ?, 1, ?)`,
                [id, form.name, form.country, form.currency, form.fiscalYearStart || form.fiscal_year_start, form.ntn]
            );
            saveDb();

            await AccountingService.seedChartOfAccounts();
            await AccountingService.seedTaxes();

            await this.loadCompany();
        }
    }
});