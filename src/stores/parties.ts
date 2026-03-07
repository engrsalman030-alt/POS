import { defineStore } from 'pinia';
import { query, execute } from '../db/database';
import type { Party } from '../types/party';

export const usePartyStore = defineStore('parties', {
    state: () => ({
        parties: [] as Party[]
    }),
    actions: {
        async fetchParties() {
            this.parties = query('SELECT * FROM parties ORDER BY name ASC') as unknown as Party[];
        },
        async addParty(party: any) {
            const id = crypto.randomUUID();
            execute(
                'INSERT INTO parties (id, name, type, email, phone, address, tax_id, receivable_account_id, payable_account_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [id, party.name, party.type, party.email, party.phone, party.address, party.tax_id, party.receivable_account_id, party.payable_account_id]
            );
            await this.fetchParties();
        }
    },
    getters: {
        customers: (state) => state.parties.filter(p => p.type === 'Customer'),
        suppliers: (state) => state.parties.filter(p => p.type === 'Supplier')
    }
});
