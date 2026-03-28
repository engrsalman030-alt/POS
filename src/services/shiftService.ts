import { query, execute } from '../db/database';
import type { Shift } from '../types/shift';

export const shiftService = {
  getActiveShift(): Shift | null {
    const results = query('SELECT * FROM shifts WHERE status = ? LIMIT 1', ['Open']);
    if (results.length > 0) {
      return (results[0] as unknown) as Shift;
    }
    return null;
  },

  getAllShifts(): Shift[] {
    return (query('SELECT * FROM shifts ORDER BY start_time DESC') as unknown) as Shift[];
  },

  getShiftSales(shiftId: string): number {
    const results = query('SELECT SUM(total_amount) as total FROM sales_invoices WHERE shift_id = ?', [shiftId]);
    if (results.length > 0 && results[0]?.total) {
      return (results[0] as any).total;
    }
    return 0;
  },

  getTodaysShiftSales(): number {
    const today = new Date().toISOString().split('T')[0];
    const sql = `
      SELECT SUM(si.total_amount) as total
      FROM shifts s
      LEFT JOIN sales_invoices si ON si.shift_id = s.id
      WHERE date(s.start_time) = ?
    `;
    const results = query(sql, [today]);
    if (results.length > 0 && results[0]?.total) {
      return (results[0] as any).total;
    }
    return 0;
  },

  getHistoricalShiftSales(days: number = 14): number[] {
    const history: number[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const sql = `
        SELECT IFNULL(SUM(si.total_amount), 0) as total
        FROM shifts s
        LEFT JOIN sales_invoices si ON si.shift_id = s.id
        WHERE date(s.start_time) = ?
      `;
      const results = query(sql, [dateStr]);
      history.push(results.length > 0 ? ((results[0] as any).total || 0) : 0);
    }
    return history;
  },

  openShift(opening_balance: number, notes?: string): Shift {
    const existing = this.getActiveShift();
    if (existing) {
      throw new Error('A shift is already open. Close it before opening a new one.');
    }

    const newShift: Shift = {
      id: crypto.randomUUID(),
      start_time: new Date().toISOString(),
      end_time: null,
      opening_balance,
      closing_balance: 0,
      status: 'Open',
      notes: notes || null
    };

    execute(`
      INSERT INTO shifts (id, start_time, end_time, opening_balance, closing_balance, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      newShift.id,
      newShift.start_time,
      newShift.end_time,
      newShift.opening_balance,
      newShift.closing_balance,
      newShift.status,
      newShift.notes
    ]);

    return newShift;
  },

  closeShift(shiftId: string, closing_balance: number, notes?: string): Shift {
    const results = query('SELECT * FROM shifts WHERE id = ?', [shiftId]);
    if (results.length === 0) throw new Error('Shift not found');

    const shift = (results[0] as unknown) as Shift;
    if (shift.status === 'Closed') {
      throw new Error('Shift is already closed');
    }

    const end_time = new Date().toISOString();
    
    // Concatenate notes if provided
    let updatedNotes = shift.notes || '';
    if (notes) {
      updatedNotes = updatedNotes ? updatedNotes + '\\n' + notes : notes;
    }

    execute(`
      UPDATE shifts 
      SET end_time = ?, closing_balance = ?, status = ?, notes = ?
      WHERE id = ?
    `, [
      end_time,
      closing_balance,
      'Closed',
      updatedNotes,
      shiftId
    ]);

    return { ...shift, end_time, closing_balance, status: 'Closed', notes: updatedNotes };
  },

  getShiftPerformance(timeframe: 'daily' | 'monthly' | 'yearly'): any[] {
    let groupFormat = '';
    if (timeframe === 'daily') groupFormat = '%Y-%m-%d';
    else if (timeframe === 'monthly') groupFormat = '%Y-%m';
    else if (timeframe === 'yearly') groupFormat = '%Y';

    const sql = `
      SELECT 
        strftime('${groupFormat}', s.start_time) as period,
        COUNT(DISTINCT s.id) as total_shifts,
        SUM(si.total_amount) as total_sales,
        SUM(s.opening_balance) as total_opening,
        SUM(s.closing_balance) as total_closing
      FROM shifts s
      LEFT JOIN sales_invoices si ON si.shift_id = s.id
      WHERE s.status = 'Closed'
      GROUP BY period
      ORDER BY period DESC
    `;
    
    return query(sql);
  }
};
