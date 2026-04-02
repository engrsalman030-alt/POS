import { query, execute, saveDb } from '../db/database';

export interface SSRFilter {
  startDate: string;
  endDate: string;
  itemId?: string;
  categoryId?: string;
  groupBy?: 'product' | 'brand' | 'category';
}

export interface DSRFilter {
  startDate: string;
  endDate: string;
  ssrId?: string;
  dsrId?: string;
}

export const ERPService = {
  // SSR: Stock Sales Report (Opening, Purchased, Sold, Closing)
  async getSSRReport(filters: SSRFilter) {
    const { startDate, endDate, itemId, categoryId, groupBy = 'product' } = filters;

    // ── Brand-level groupBy ──────────────────────────────────────────────────
    if (groupBy === 'brand') {
      const sql = `
        WITH AllBrands AS (
          SELECT DISTINCT i.brand FROM stock_ledger sl
          JOIN items i ON sl.item_id = i.id
          WHERE i.brand IS NOT NULL AND i.brand != ''
        ),
        OpeningStock AS (
          SELECT i.brand,
            SUM(CASE WHEN sl.type='In' THEN (sl.quantity+sl.bonus_quantity) ELSE -(sl.quantity+sl.bonus_quantity) END) as opening
          FROM stock_ledger sl JOIN items i ON sl.item_id = i.id
          WHERE sl.date < ? AND i.brand IS NOT NULL GROUP BY i.brand
        ),
        Movement AS (
          SELECT i.brand,
            SUM(CASE WHEN sl.type='In' THEN sl.quantity ELSE 0 END) as purchased,
            SUM(CASE WHEN sl.type='In' THEN sl.bonus_quantity ELSE 0 END) as p_bonus,
            SUM(CASE WHEN sl.type='Out' THEN sl.quantity ELSE 0 END) as sold,
            SUM(CASE WHEN sl.type='Out' THEN sl.bonus_quantity ELSE 0 END) as s_bonus
          FROM stock_ledger sl JOIN items i ON sl.item_id = i.id
          WHERE sl.date BETWEEN ? AND ? AND i.brand IS NOT NULL GROUP BY i.brand
        )
        SELECT ab.brand as name, '' as barcode, '' as category, ab.brand as brand, '' as uom,
          IFNULL(os.opening,0) as opening,
          IFNULL(m.purchased,0) as purchased, IFNULL(m.p_bonus,0) as p_bonus,
          IFNULL(m.sold,0) as sold, IFNULL(m.s_bonus,0) as s_bonus,
          (IFNULL(os.opening,0)+IFNULL(m.purchased,0)+IFNULL(m.p_bonus,0)-IFNULL(m.sold,0)-IFNULL(m.s_bonus,0)) as closing
        FROM AllBrands ab
        LEFT JOIN OpeningStock os ON ab.brand = os.brand
        LEFT JOIN Movement m ON ab.brand = m.brand
        ORDER BY ab.brand ASC
      `;
      return query(sql, [startDate, startDate, endDate]);
    }

    // ── Category-level groupBy ───────────────────────────────────────────────
    if (groupBy === 'category') {
      const sql = `
        WITH AllCats AS (
          SELECT DISTINCT i.category FROM stock_ledger sl
          JOIN items i ON sl.item_id = i.id
          WHERE i.category IS NOT NULL AND i.category != ''
        ),
        OpeningStock AS (
          SELECT i.category,
            SUM(CASE WHEN sl.type='In' THEN (sl.quantity+sl.bonus_quantity) ELSE -(sl.quantity+sl.bonus_quantity) END) as opening
          FROM stock_ledger sl JOIN items i ON sl.item_id = i.id
          WHERE sl.date < ? AND i.category IS NOT NULL GROUP BY i.category
        ),
        Movement AS (
          SELECT i.category,
            SUM(CASE WHEN sl.type='In' THEN sl.quantity ELSE 0 END) as purchased,
            SUM(CASE WHEN sl.type='In' THEN sl.bonus_quantity ELSE 0 END) as p_bonus,
            SUM(CASE WHEN sl.type='Out' THEN sl.quantity ELSE 0 END) as sold,
            SUM(CASE WHEN sl.type='Out' THEN sl.bonus_quantity ELSE 0 END) as s_bonus
          FROM stock_ledger sl JOIN items i ON sl.item_id = i.id
          WHERE sl.date BETWEEN ? AND ? AND i.category IS NOT NULL GROUP BY i.category
        )
        SELECT ac.category as name, '' as barcode, ac.category as category, '' as brand, '' as uom,
          IFNULL(os.opening,0) as opening,
          IFNULL(m.purchased,0) as purchased, IFNULL(m.p_bonus,0) as p_bonus,
          IFNULL(m.sold,0) as sold, IFNULL(m.s_bonus,0) as s_bonus,
          (IFNULL(os.opening,0)+IFNULL(m.purchased,0)+IFNULL(m.p_bonus,0)-IFNULL(m.sold,0)-IFNULL(m.s_bonus,0)) as closing
        FROM AllCats ac
        LEFT JOIN OpeningStock os ON ac.category = os.category
        LEFT JOIN Movement m ON ac.category = m.category
        ORDER BY ac.category ASC
      `;
      return query(sql, [startDate, startDate, endDate]);
    }

    // ── Product-level groupBy (default) ─────────────────────────────────────
    let sql = `
      WITH OpeningStock AS (
        SELECT item_id, SUM(CASE WHEN type='In' THEN (quantity + bonus_quantity) ELSE -(quantity + bonus_quantity) END) as opening 
        FROM stock_ledger 
        WHERE date < ? 
        GROUP BY item_id
      ),
      Movement AS (
        SELECT 
          item_id,
          SUM(CASE WHEN type='In' THEN quantity ELSE 0 END) as purchased,
          SUM(CASE WHEN type='In' THEN bonus_quantity ELSE 0 END) as p_bonus,
          SUM(CASE WHEN type='Out' THEN quantity ELSE 0 END) as sold,
          SUM(CASE WHEN type='Out' THEN bonus_quantity ELSE 0 END) as s_bonus
        FROM stock_ledger 
        WHERE date BETWEEN ? AND ? 
        GROUP BY item_id
      )
      SELECT 
        i.name, i.barcode, i.category, i.brand, i.uom, i.purchase_rate, i.sales_rate,
        ifnull(os.opening, 0) as opening,
        ifnull(m.purchased, 0) as purchased,
        ifnull(m.p_bonus, 0) as p_bonus,
        ifnull(m.sold, 0) as sold,
        ifnull(m.s_bonus, 0) as s_bonus,
        (ifnull(os.opening, 0) + ifnull(m.purchased, 0) + ifnull(m.p_bonus, 0) - ifnull(m.sold, 0) - ifnull(m.s_bonus, 0)) as closing,
        -- Value calculations
        i.purchase_rate as tp,
        i.sales_rate as mrp,
        ((ifnull(os.opening, 0) + ifnull(m.purchased, 0) + ifnull(m.p_bonus, 0) - ifnull(m.sold, 0) - ifnull(m.s_bonus, 0)) * i.purchase_rate) as value_at_tp,
        ((ifnull(os.opening, 0) + ifnull(m.purchased, 0) + ifnull(m.p_bonus, 0) - ifnull(m.sold, 0) - ifnull(m.s_bonus, 0)) * i.sales_rate) as value_at_mrp
      FROM items i
      LEFT JOIN OpeningStock os ON i.id = os.item_id
      LEFT JOIN Movement m ON i.id = m.item_id
      WHERE 1=1
    `;
    const params: any[] = [startDate, startDate, endDate];

    if (itemId) { sql += " AND i.id = ?"; params.push(itemId); }
    if (categoryId) { sql += " AND i.category = ?"; params.push(categoryId); }
    sql += " ORDER BY i.name ASC";
    return query(sql, params);
  },

  // Vendorwise Sales Report (The "Image" Report)
  async getVendorWiseSalesReport(brand: string, startDate: string, endDate: string) {
    const sql = `
      WITH OpeningStock AS (
        SELECT item_id, SUM(CASE WHEN type='In' THEN (quantity + bonus_quantity) ELSE -(quantity + bonus_quantity) END) as opening 
        FROM stock_ledger 
        WHERE date < ? 
        GROUP BY item_id
      ),
      Movement AS (
        SELECT 
          item_id,
          -- Receipts (In from Bill)
          SUM(CASE WHEN type='In' AND reference_type='Bill' THEN quantity ELSE 0 END) as r_qty,
          SUM(CASE WHEN type='In' AND reference_type='Bill' THEN bonus_quantity ELSE 0 END) as r_bns,
          -- Sales (Out from Invoice)
          SUM(CASE WHEN type='Out' AND reference_type='Invoice' THEN quantity ELSE 0 END) as s_qty,
          SUM(CASE WHEN type='Out' AND reference_type='Invoice' THEN bonus_quantity ELSE 0 END) as s_bns,
          -- Returns (In from Sales Return)
          SUM(CASE WHEN type='In' AND reference_type='Sales Return' THEN quantity ELSE 0 END) as ret_qty,
          SUM(CASE WHEN type='In' AND reference_type='Sales Return' THEN bonus_quantity ELSE 0 END) as ret_bns,
          -- Transfers / Adjustments (Manual Adjustment or Stock Transfer)
          SUM(CASE WHEN reference_type IN ('Manual Adjustment', 'Transfer') THEN (CASE WHEN type='Out' THEN quantity ELSE -quantity END) ELSE 0 END) as t_qty,
          SUM(CASE WHEN reference_type IN ('Manual Adjustment', 'Transfer') THEN (CASE WHEN type='Out' THEN bonus_quantity ELSE -bonus_quantity END) ELSE 0 END) as t_bns
        FROM stock_ledger 
        WHERE date BETWEEN ? AND ? 
        GROUP BY item_id
      )
      SELECT 
        i.id, i.name, i.sku, i.brand, i.sales_rate, i.generic_name,
        ifnull(os.opening, 0) as open_stock,
        ifnull(m.r_qty, 0) as receipt_qty, ifnull(m.r_bns, 0) as receipt_bns,
        ifnull(m.s_qty, 0) as sale_qty, ifnull(m.s_bns, 0) as sale_bns,
        ifnull(m.ret_qty, 0) as return_qty, ifnull(m.ret_bns, 0) as return_bns,
        ifnull(m.t_qty, 0) as transfer_qty, ifnull(m.t_bns, 0) as transfer_bns
      FROM items i
      LEFT JOIN OpeningStock os ON i.id = os.item_id
      LEFT JOIN Movement m ON i.id = m.item_id
      WHERE i.brand = ?
      ORDER BY i.name ASC
    `;
    return query(sql, [startDate, startDate, endDate, brand]);
  },

  async getBrands() {
    return query("SELECT DISTINCT brand FROM items WHERE brand IS NOT NULL AND brand != '' ORDER BY brand ASC") as unknown as { brand: string }[];
  },

  // DSR: Daily Sales Report (Salesman-wise, Profit, Cash vs Credit)
  async getDSRReport(filters: DSRFilter) {
    const { startDate, endDate, ssrId, dsrId } = filters;

    let sql = `
      SELECT 
        s.date,
        s.id as invoice_id,
        p.name as customer_name,
        st_ssr.name as ssr_name,
        st_dsr.name as dsr_name,
        s.total_amount,
        s.paid_amount,
        (s.total_amount - s.paid_amount) as credit_amount,
        -- Profit calculation (Sales Price - Item Purchase Rate)
        (SELECT SUM((si.rate - i.purchase_rate) * si.quantity) 
         FROM sales_invoice_items si 
         JOIN items i ON si.item_id = i.id 
         WHERE si.invoice_id = s.id) as profit
      FROM sales_invoices s
      LEFT JOIN parties p ON s.customer_id = p.id
      LEFT JOIN staff st_ssr ON s.ssr_id = st_ssr.id
      LEFT JOIN staff st_dsr ON s.dsr_id = st_dsr.id
      WHERE s.date BETWEEN ? AND ?
    `;
    const params: any[] = [startDate, endDate];

    if (ssrId) {
      sql += " AND s.ssr_id = ?";
      params.push(ssrId);
    }
    if (dsrId) {
      sql += " AND s.dsr_id = ?";
      params.push(dsrId);
    }

    sql += " ORDER BY s.date DESC";
    return query(sql, params);
  },

  // Detailed DSR (Includes all invoice items)
  async getDetailedDSRReport(filters: DSRFilter) {
    const { startDate, endDate, ssrId, dsrId } = filters;

    let sql = `
      SELECT 
        s.date,
        s.id as invoice_id,
        p.name as customer_name,
        st_ssr.name as ssr_name,
        st_dsr.name as dsr_name,
        i.name as item_name,
        si.batch_number,
        si.expiry_date,
        si.quantity,
        si.bonus_quantity,
        si.rate,
        si.discount_amount,
        (si.quantity * si.rate) - si.discount_amount as net_total,
        (si.rate - i.purchase_rate) * si.quantity as profit
      FROM sales_invoices s
      JOIN sales_invoice_items si ON s.id = si.invoice_id
      LEFT JOIN items i ON si.item_id = i.id
      LEFT JOIN parties p ON s.customer_id = p.id
      LEFT JOIN staff st_ssr ON s.ssr_id = st_ssr.id
      LEFT JOIN staff st_dsr ON s.dsr_id = st_dsr.id
      WHERE s.date BETWEEN ? AND ?
    `;
    const params: any[] = [startDate, endDate];

    if (ssrId) { sql += " AND s.ssr_id = ?"; params.push(ssrId); }
    if (dsrId) { sql += " AND s.dsr_id = ?"; params.push(dsrId); }

    sql += " ORDER BY s.date DESC, s.id DESC";
    return query(sql, params);
  },

  // Settings CRUD
  async updateSetting(key: string, value: string) {
    execute('INSERT OR REPLACE INTO erp_settings (key, value) VALUES (?, ?)', [key, value]);
    saveDb();
  },

  async getSettings() {
    return query('SELECT * FROM erp_settings');
  },

  // Expenses CRUD
  async addExpense(expense: { date: string, category_id: string, amount: number, notes: string, merchant?: string, payment_method?: string }) {
    const id = crypto.randomUUID();
    execute('INSERT INTO expenses (id, date, category_id, amount, notes, merchant, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?)', 
      [id, expense.date, expense.category_id, expense.amount, expense.notes, expense.merchant || '', expense.payment_method || 'Cash']);
    saveDb();
    return id;
  },

  async getExpenses(startDate?: string, endDate?: string) {
    let sql = 'SELECT e.*, ec.name as category_name FROM expenses e JOIN expense_categories ec ON e.category_id = ec.id';
    const params = [];
    if (startDate && endDate) {
      sql += ' WHERE e.date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }
    sql += ' ORDER BY e.date DESC';
    return query(sql, params);
  },

  async addExpenseCategory(name: string) {
    const id = crypto.randomUUID();
    execute('INSERT INTO expense_categories (id, name) VALUES (?, ?)', [id, name]);
    saveDb();
    return id;
  },

  async getExpenseCategories() {
    return query('SELECT * FROM expense_categories ORDER BY name ASC');
  },

  // ─── Staff ────────────────────────────────────────────────────────────────
  async getStaff(role?: string) {
    let sql = 'SELECT id, name, role FROM staff WHERE is_active = 1';
    const params: any[] = [];
    if (role) { sql += ' AND role = ?'; params.push(role); }
    sql += ' ORDER BY name ASC';
    return query(sql, params) as unknown as { id: string; name: string; role: string }[];
  },

  // ─── Summarized Reports for Distributor Shortcuts ──────────────────────────
  async getCustomerSalesSummary(startDate: string, endDate: string) {
    const sql = `
      SELECT 
        p.name as customer_name,
        p.city as city,
        COUNT(s.id) as total_visits,
        SUM(s.total_amount) as total_billed,
        SUM(s.paid_amount) as total_paid,
        SUM(s.total_amount - s.paid_amount) as outstanding
      FROM parties p
      JOIN sales_invoices s ON s.customer_id = p.id
      WHERE s.date BETWEEN ? AND ?
      GROUP BY p.id
      ORDER BY total_billed DESC
    `;
    return query(sql, [startDate, endDate]);
  },

  async getSalesmanPerformanceReport(startDate: string, endDate: string) {
    const sql = `
      SELECT 
        st.name as salesman_name,
        st.role as role,
        COUNT(s.id) as total_invoices,
        SUM(s.total_amount) as total_sales,
        SUM(s.paid_amount) as total_recovered,
        SUM(s.total_amount - s.paid_amount) as total_credit
      FROM staff st
      LEFT JOIN sales_invoices s ON (s.dsr_id = st.id OR s.ssr_id = st.id) AND s.date BETWEEN ? AND ?
      WHERE st.is_active = 1
      GROUP BY st.id
      HAVING total_sales > 0
      ORDER BY total_sales DESC
    `;
    return query(sql, [startDate, endDate, startDate, endDate]);
  }
};
