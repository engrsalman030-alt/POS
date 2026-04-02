import { query, execute } from '../db/database';

export interface TaxRule {
    id: string;
    name: string;
    rate: number;
    is_active: number;
    type: 'Percentage' | 'Fixed';
    applicable_on: 'Sales' | 'Purchases' | 'Both';
    is_inclusive: number;
    effective_date: string;
}

export const TaxService = {
    async getAll(): Promise<TaxRule[]> {
        const res = await query('SELECT * FROM taxes');
        return res as unknown as TaxRule[];
    },

    async create(tax: Omit<TaxRule, 'id'>): Promise<string> {
        const id = crypto.randomUUID();
        execute(
            'INSERT INTO taxes (id, name, rate, is_active, type, applicable_on, is_inclusive, effective_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, tax.name, tax.rate, tax.is_active ?? 1, tax.type || 'Percentage', tax.applicable_on || 'Both', tax.is_inclusive ?? 0, tax.effective_date || null]
        );
        return id;
    },

    async update(tax: TaxRule): Promise<void> {
        execute(
            'UPDATE taxes SET name = ?, rate = ?, is_active = ?, type = ?, applicable_on = ?, is_inclusive = ?, effective_date = ? WHERE id = ?',
            [tax.name, tax.rate, tax.is_active, tax.type || 'Percentage', tax.applicable_on || 'Both', tax.is_inclusive ?? 0, tax.effective_date || null, tax.id]
        );
    },

    async delete(id: string): Promise<void> {
        execute('DELETE FROM taxes WHERE id = ?', [id]);
    }
};
