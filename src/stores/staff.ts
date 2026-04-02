import { defineStore } from 'pinia';
import { query, execute, saveDb } from '../db/database';

export interface Staff {
  id: string;
  name: string;
  role: 'SSR' | 'DSR' | 'Admin' | 'Sales Manager' | 'Accountant';
  phone?: string;
  is_active: number;
  cnic?: string;
  address?: string;
  salary?: number;
  joining_date?: string;
  permissions_json?: string;
}

export const useStaffStore = defineStore('staff', {
  state: () => ({
    staff: [] as Staff[]
  }),
  actions: {
    async fetchStaff() {
      this.staff = query('SELECT * FROM staff WHERE is_active = 1 ORDER BY name ASC') as unknown as Staff[];
    },
    async addStaff(member: Omit<Staff, 'id'>) {
      const id = crypto.randomUUID();
      execute(
        'INSERT INTO staff (id, name, role, phone, is_active, cnic, address, salary, joining_date, permissions_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, member.name, member.role, member.phone || '', member.is_active ?? 1, member.cnic || null, member.address || null, member.salary || 0, member.joining_date || null, member.permissions_json || null]
      );
      saveDb();
      await this.fetchStaff();
      return id;
    },
    async updateStaff(member: Staff) {
      execute(
        'UPDATE staff SET name = ?, role = ?, phone = ?, is_active = ?, cnic = ?, address = ?, salary = ?, joining_date = ?, permissions_json = ? WHERE id = ?',
        [member.name, member.role, member.phone || '', member.is_active, member.cnic || null, member.address || null, member.salary || 0, member.joining_date || null, member.permissions_json || null, member.id]
      );
      saveDb();
      await this.fetchStaff();
    }
  },
  getters: {
    ssrs: (state) => state.staff.filter(s => s.role === 'SSR'),
    dsrs: (state) => state.staff.filter(s => s.role === 'DSR')
  }
});
