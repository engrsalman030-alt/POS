import { defineStore } from 'pinia';
import { execute, query, saveDb, getDb } from '../db/database';
import { AccountingService } from '../services/accountingService';

export interface Company {
    id: string;
    name: string;
    country: string;
    currency: string;
    fiscal_year_start: string;
    is_setup: boolean;
    ntn?: string;
    address?: string;
    phone?: string;
    business_type: 'Pharmacy' | 'Mobile' | 'Grocery' | 'General';
    license_number?: string;
}

export const useCompanyStore = defineStore('company', {
    state: () => ({
        company: null as Company | null,
        isInitialized: false,
        existingCompanies: [] as Company[]
    }),
    actions: {
        async loadCompany() {
            await getDb(); // Ensure database is initialized before query
            const rows = query('SELECT * FROM company LIMIT 1') as any[];
            if (rows.length > 0) {
                const is_setup = Boolean(rows[0].is_setup);
                this.company = { 
                    ...rows[0], 
                    is_setup,
                    business_type: rows[0].business_type || 'Pharmacy'
                };
                this.isInitialized = is_setup;
            } else {
                this.company = null;
                this.isInitialized = false;
            }
            await this.fetchCompanies();
        },
        async fetchCompanies() {
            await getDb();
            const rows = query('SELECT * FROM company') as any[];
            this.existingCompanies = rows.map(r => ({ 
                ...r, 
                is_setup: Boolean(r.is_setup) 
            }));
        },
        async updateCompany(data: Partial<Company>) {
            if (!this.company) return;
            const updated = { ...this.company, ...data };
            execute(
                `UPDATE company SET name = ?, country = ?, currency = ?, ntn = ?, address = ?, phone = ?, business_type = ?, license_number = ? WHERE id = ?`,
                [updated.name, updated.country, updated.currency, updated.ntn || '', updated.address || '', updated.phone || '', updated.business_type, updated.license_number || '', updated.id]
            );
            saveDb();
            this.company = updated;
        },
        async setupCompany(form: any) {
            await getDb();
            // Check if company already exists by name
            const existing = query('SELECT * FROM company WHERE name = ?', [form.name]) as any[];
            
            if (existing.length > 0) {
                // Resume existing company
                const id = existing[0].id;
                execute('UPDATE company SET is_setup = 1 WHERE id = ?', [id]);
                saveDb();
                await this.loadCompany();
                return;
            }

            // Create new company
            const id = crypto.randomUUID();
            execute(
                `INSERT INTO company (id, name, country, currency, fiscal_year_start, is_setup, ntn, license_number)
                 VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
                [id, form.name, form.country, form.currency, form.fiscalYearStart || form.fiscal_year_start, form.ntn, form.license_number]
            );
            saveDb();

            await AccountingService.seedChartOfAccounts();
            await AccountingService.seedTaxes();

            await this.loadCompany();
        },
        async logout() {
            if (this.company) {
                execute('UPDATE company SET is_setup = 0 WHERE id = ?', [this.company.id]);
                saveDb();
            }
            this.company = null;
            this.isInitialized = false;
            window.location.href = '/setup';
        },
        getMonogram(name: string) {
            if (!name) return 'B&H';
            const upper = name.toUpperCase();
            if (upper.includes('B & H') || upper.includes('B&H')) return 'B&H';
            return name.split(' ').map(n => n[0]).slice(0, 3).join('').toUpperCase();
        }
    }
});