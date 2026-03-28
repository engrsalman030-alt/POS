import { defineStore } from 'pinia';
import { query, execute } from '../db/database';
import type { Party } from '../types/party';
import { ReportService } from '../services/reportService';

export const usePartyStore = defineStore('parties', {
    state: () => ({
        parties: [] as Party[]
    }),
    actions: {
        async fetchParties() {
            const partiesList = query('SELECT * FROM parties ORDER BY name ASC') as unknown as Party[];
            const balances = await ReportService.getPartyBalances();
            
            this.parties = partiesList.map(p => ({
                ...p,
                balance: balances[p.id] || 0
            }));
        },
        async addParty(party: any) {
            const id = crypto.randomUUID();
            execute(
                `INSERT INTO parties (
                    id, name, type, company_name, contact_person, email, phone, whatsapp, website, 
                    address, billing_address, shipping_address, city, country, postal_code, 
                    tax_id, cnic, reg_number, credit_limit, payment_terms, 
                    receivable_account_id, payable_account_id, opening_balance, balance_type, 
                    loyalty_program, customer_group, supplier_category, price_list, default_currency, 
                    is_active, notes, tags
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    id, party.name, party.type, party.company_name || null, party.contact_person || null, party.email || null, party.phone || null, party.whatsapp || null, party.website || null,
                    party.address || null, party.billing_address || null, party.shipping_address || null, party.city || null, party.country || null, party.postal_code || null,
                    party.tax_id || null, party.cnic || null, party.reg_number || null, party.credit_limit || 0, party.payment_terms || null,
                    party.receivable_account_id || 'ar', party.payable_account_id || 'ap', party.opening_balance || 0, party.balance_type || 'Debit',
                    party.loyalty_program ? 1 : 0, party.customer_group || null, party.supplier_category || null, party.price_list || null, party.default_currency || null,
                    1, party.notes || null, party.tags || null
                ]
            );
            await this.fetchParties();
        },
        async updateParty(party: Party) {
            execute(
                `UPDATE parties SET 
                    name = ?, type = ?, company_name = ?, contact_person = ?, email = ?, phone = ?, whatsapp = ?, website = ?, 
                    address = ?, billing_address = ?, shipping_address = ?, city = ?, country = ?, postal_code = ?, 
                    tax_id = ?, cnic = ?, reg_number = ?, credit_limit = ?, payment_terms = ?, 
                    receivable_account_id = ?, payable_account_id = ?, opening_balance = ?, balance_type = ?, 
                    loyalty_program = ?, customer_group = ?, supplier_category = ?, price_list = ?, default_currency = ?, 
                    is_active = ?, notes = ?, tags = ?
                WHERE id = ?`,
                [
                    party.name, party.type, party.company_name || null, party.contact_person || null, party.email || null, party.phone || null, party.whatsapp || null, party.website || null,
                    party.address || null, party.billing_address || null, party.shipping_address || null, party.city || null, party.country || null, party.postal_code || null,
                    party.tax_id || null, party.cnic || null, party.reg_number || null, party.credit_limit || 0, party.payment_terms || null,
                    party.receivable_account_id || 'ar', party.payable_account_id || 'ap', party.opening_balance || 0, party.balance_type || 'Debit',
                    party.loyalty_program ? 1 : 0, party.customer_group || null, party.supplier_category || null, party.price_list || null, party.default_currency || null,
                    party.is_active ? 1 : 0, party.notes || null, party.tags || null,
                    party.id
                ]
            );
            await this.fetchParties();
        }
    },
    getters: {
        customers: (state) => state.parties.filter(p => p.type === 'Customer'),
        suppliers: (state) => state.parties.filter(p => p.type === 'Supplier')
    }
});
