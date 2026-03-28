import { query, execute } from '../db/database';

export interface TaxRule {
    id: string;
    name: string;
    rate: number;
    is_active: number;
}

export const TaxService = {
    async getAll(): Promise<TaxRule[]> {
        const res = await query('SELECT * FROM taxes');
        return res as unknown as TaxRule[];
    },

    async create(tax: Omit<TaxRule, 'id'>): Promise<string> {
        const id = crypto.randomUUID();
        execute(
            'INSERT INTO taxes (id, name, rate, is_active) VALUES (?, ?, ?, ?)',
            [id, tax.name, tax.rate, tax.is_active ?? 1]
        );
        return id;
    },

    async update(tax: TaxRule): Promise<void> {
        execute(
            'UPDATE taxes SET name = ?, rate = ?, is_active = ? WHERE id = ?',
            [tax.name, tax.rate, tax.is_active, tax.id]
        );
    },

    async delete(id: string): Promise<void> {
        execute('DELETE FROM taxes WHERE id = ?', [id]);
    }
};
