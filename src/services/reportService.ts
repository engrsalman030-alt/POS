import { query } from '../db/database';

/**
 * Pharma ERP Reporting Service
 * Complete reporting suite with accurate calculations for B&H Pharmaceutical
 */

export class ReportService {
  /**
   * A. SSR-WISE SALE REPORT
   * Shows sales performance per SSR and customer
   */
  static getSSRWiseSalesReport(startDate: string, endDate: string) {
    return query(`
      SELECT
        st.name                          AS ssr_name,
        p.name                           AS customer_name,
        p.city                           AS city,
        a.name                           AS area,
        COUNT(si.id)                     AS total_invoices,
        SUM(si.total_amount)             AS gross_sales,
        SUM(si.discount_amount)          AS total_discount,
        SUM(si.tax_amount)               AS total_tax,
        SUM(si.total_amount 
            - si.discount_amount)        AS net_sales,
        COALESCE(SUM(py.amount), 0)      AS collected,
        SUM(si.outstanding_amount)       AS outstanding
      FROM sales_invoices si
      LEFT JOIN staff st   ON si.ssr_id      = st.id
      LEFT JOIN parties p  ON si.customer_id = p.id
      LEFT JOIN areas a    ON si.area_id     = a.id
      LEFT JOIN payments py ON py.reference_id = si.id AND py.reference_type = 'Invoice'
      WHERE si.status = 'Submitted'
        AND si.document_type = 'Invoice'
        AND si.date BETWEEN ? AND ?
      GROUP BY st.id, p.id
      ORDER BY st.name, net_sales DESC
    `, [startDate, endDate]);
  }

  /**
   * B. VENDOR-WISE SALE REPORT
   * Shows sales to each customer
   */
  static getVendorWiseSalesReport(startDate: string, endDate: string) {
    return query(`
      SELECT
        p.name                           AS vendor_name,
        p.city                           AS city,
        COUNT(si.id)                     AS total_invoices,
        SUM(si.total_amount)             AS gross_sales,
        SUM(si.discount_amount)          AS total_discount,
        SUM(si.outstanding_amount)       AS outstanding_balance,
        MAX(si.date)                     AS last_transaction_date
      FROM sales_invoices si
      JOIN parties p ON si.customer_id = p.id
      WHERE si.status = 'Submitted'
        AND si.document_type = 'Invoice'
        AND si.date BETWEEN ? AND ?
      GROUP BY p.id
      ORDER BY gross_sales DESC
    `, [startDate, endDate]);
  }

  /**
   * C. ITEM-WISE SALE REPORT
   * Shows sales quantity, rates, and profitability per item
   */
  static getItemWiseSalesReport(startDate: string, endDate: string) {
    return query(`
      SELECT
        i.name                           AS item_name,
        i.generic_name,
        i.strength,
        i.dosage_form,
        SUM(sii.quantity)                AS qty_sold,
        SUM(sii.bonus_quantity)          AS bonus_qty,
        AVG(sii.rate)                    AS avg_rate,
        SUM(sii.total)                   AS gross_amount,
        SUM(sii.quantity * COALESCE(i.avg_purchase_rate, 0)) AS cogs,
        SUM(sii.total) 
          - SUM(sii.quantity * COALESCE(i.avg_purchase_rate, 0))       AS gross_profit
      FROM sales_invoice_items sii
      JOIN items i         ON sii.item_id    = i.id
      JOIN sales_invoices si ON sii.invoice_id = si.id
      WHERE si.status = 'Submitted'
        AND si.document_type = 'Invoice'
        AND si.date BETWEEN ? AND ?
      GROUP BY i.id
      ORDER BY gross_amount DESC
    `, [startDate, endDate]);
  }

  /**
   * D. AREA-WISE SALE REPORT
   * Shows sales performance by geographical area
   */
  static getAreaWiseSalesReport(startDate: string, endDate: string) {
    return query(`
      SELECT
        a.name                           AS area_name,
        COUNT(DISTINCT si.customer_id)   AS total_customers,
        COUNT(si.id)                     AS total_invoices,
        SUM(si.total_amount)             AS gross_sales,
        SUM(si.outstanding_amount)       AS outstanding
      FROM sales_invoices si
      LEFT JOIN areas a ON si.area_id = a.id
      WHERE si.status = 'Submitted'
        AND si.document_type = 'Invoice'
        AND si.date BETWEEN ? AND ?
      GROUP BY a.id
      ORDER BY gross_sales DESC
    `, [startDate, endDate]);
  }

  /**
   * E. STOCK LEDGER REPORT
   * Complete stock movement history with running balances
   */
  static getStockLedgerReport(startDate: string, endDate: string) {
    return query(`
      SELECT
        i.name                           AS item_name,
        sl.date,
        sl.type                          AS movement_type,
        sl.quantity,
        sl.bonus_quantity,
        sl.rate,
        sl.value,
        sl.reference_type,
        sl.reference_id
      FROM stock_ledger sl
      JOIN items i ON sl.item_id = i.id
      WHERE sl.date BETWEEN ? AND ?
      ORDER BY i.name, sl.date
    `, [startDate, endDate]);
  }

  /**
   * F. PARTY LEDGER / OUTSTANDING REPORT
   * Customer account balances and transaction history
   */
  static getPartyLedgerReport(startDate: string, endDate: string) {
    return query(`
      SELECT
        p.id,
        p.name                           AS party_name,
        p.phone,
        p.city,
        a.name                           AS area,
        COALESCE(p.opening_balance, 0)   AS opening_balance,
        SUM(
          CASE WHEN si.document_type = 'Invoice' AND si.status = 'Submitted'
               THEN si.total_amount ELSE 0 END
        )                                AS total_invoiced,
        SUM(
          CASE WHEN si.document_type = 'Invoice' AND si.status = 'Submitted'
               THEN COALESCE(si.paid_amount, 0) ELSE 0 END
        )                                AS total_paid,
        SUM(
          CASE WHEN si.document_type = 'Invoice' AND si.status = 'Submitted'
               THEN si.outstanding_amount ELSE 0 END
        )                                AS current_outstanding,
        MAX(CASE WHEN si.status = 'Submitted' THEN si.date END) AS last_invoice_date
      FROM parties p
      LEFT JOIN sales_invoices si ON si.customer_id = p.id 
        AND si.date BETWEEN ? AND ?
      LEFT JOIN areas a ON p.area_id = a.id
      WHERE p.type IN ('Customer', 'Both')
      GROUP BY p.id
      ORDER BY current_outstanding DESC
    `, [startDate, endDate]);
  }

  /**
   * G. PURCHASE REPORT (Vendor-wise)
   * Purchase performance and outstanding to suppliers
   */
  static getPurchaseVendorWiseReport(startDate: string, endDate: string) {
    return query(`
      SELECT
        p.name                           AS supplier_name,
        COUNT(pb.id)                     AS total_bills,
        SUM(pb.total_amount)             AS gross_purchase,
        SUM(pb.discount_amount)          AS total_discount,
        SUM(pb.tax_amount)               AS total_tax,
        COALESCE(SUM(pd.amount), 0)      AS paid,
        SUM(pb.outstanding_amount)       AS outstanding
      FROM purchase_bills pb
      JOIN parties p ON pb.supplier_id = p.id
      LEFT JOIN payments pd ON pd.reference_id = pb.id AND pd.reference_type = 'Bill'
      WHERE pb.status = 'Submitted'
        AND pb.document_type = 'Bill'
        AND pb.date BETWEEN ? AND ?
      GROUP BY p.id
      ORDER BY gross_purchase DESC
    `, [startDate, endDate]);
  }

  /**
   * H. EXPIRY / NEAR-EXPIRY REPORT
   * Critical for inventory management - shows expiring stock
   */
  static getExpiryWarningReport(daysToExpiry: number = 90) {
    const todayDate = new Date().toISOString().split('T')[0];
    return query(`
      SELECT
        i.name                           AS item_name,
        i.generic_name,
        ib.batch_number,
        ib.expiry_date,
        ib.quantity,
        (ib.quantity - COALESCE(ib.quantity_sold, 0) - COALESCE(ib.quantity_returned, 0)) AS available_qty,
        ib.purchase_rate,
        (ib.quantity - COALESCE(ib.quantity_sold, 0) - COALESCE(ib.quantity_returned, 0)) 
          * ib.purchase_rate             AS stock_value,
        ROUND(
          julianday(ib.expiry_date) 
          - julianday(?)
        )                                AS days_to_expiry
      FROM item_batches ib
      JOIN items i ON ib.item_id = i.id
      WHERE ib.is_active = 1
        AND (ib.quantity - COALESCE(ib.quantity_sold, 0) - COALESCE(ib.quantity_returned, 0)) > 0
        AND julianday(ib.expiry_date) 
            <= julianday(?, '+' || ? || ' days')
      ORDER BY days_to_expiry ASC
    `, [todayDate, todayDate, daysToExpiry.toString()]);
  }

  /**
   * I. PROFIT & LOSS REPORT
   * Complete P&L with sales, COGS, and expenses
   */
  static getProfitLossReport(startDate: string, endDate: string) {
    const pnlData: any[] = [];

    // Gross Sales
    const grossSalesResult = query(`
      SELECT SUM(total_amount) as amount
      FROM sales_invoices
      WHERE status = 'Submitted'
        AND document_type = 'Invoice'
        AND date BETWEEN ? AND ?
    `, [startDate, endDate]);
    if (grossSalesResult.length > 0) {
      pnlData.push({
        line_item: 'Gross Sales',
        amount: grossSalesResult[0].amount || 0
      });
    }

    // Sales Returns (negative)
    const returnsResult = query(`
      SELECT SUM(total_amount) as amount
      FROM sales_invoices
      WHERE status = 'Submitted'
        AND document_type = 'Return'
        AND date BETWEEN ? AND ?
    `, [startDate, endDate]);
    if (returnsResult.length > 0 && returnsResult[0].amount) {
      pnlData.push({
        line_item: 'Sales Returns',
        amount: -(returnsResult[0].amount || 0)
      });
    }

    // COGS
    const cogsResult = query(`
      SELECT SUM(sii.quantity * COALESCE(i.avg_purchase_rate, 0)) as amount
      FROM sales_invoice_items sii
      JOIN items i ON sii.item_id = i.id
      JOIN sales_invoices si ON sii.invoice_id = si.id
      WHERE si.status = 'Submitted'
        AND si.document_type = 'Invoice'
        AND si.date BETWEEN ? AND ?
    `, [startDate, endDate]);
    if (cogsResult.length > 0) {
      pnlData.push({
        line_item: 'COGS',
        amount: -(cogsResult[0].amount || 0)
      });
    }

    // Gross Profit
    const grossProfit = (
      (grossSalesResult[0]?.amount || 0) -
      (returnsResult[0]?.amount || 0) -
      (cogsResult[0]?.amount || 0)
    );
    pnlData.push({
      line_item: 'Gross Profit',
      amount: grossProfit
    });

    // Total Expenses
    const expensesResult = query(`
      SELECT SUM(amount) as amount
      FROM expenses
      WHERE date BETWEEN ? AND ?
    `, [startDate, endDate]);
    if (expensesResult.length > 0 && expensesResult[0].amount) {
      pnlData.push({
        line_item: 'Total Expenses',
        amount: -(expensesResult[0].amount || 0)
      });
    }

    // Net Profit
    const netProfit = grossProfit - (expensesResult[0]?.amount || 0);
    pnlData.push({
      line_item: 'Net Profit',
      amount: netProfit
    });

    return pnlData;
  }

  /**
   * BALANCE SHEET ACCOUNTS
   * Get account balances for balance sheet
   */
  static getAccountBalances(date: string) {
    return query(`
      SELECT
        a.id,
        a.name,
        a.code,
        a.type,
        a.parent_id,
        SUM(CASE WHEN ji.debit IS NOT NULL THEN ji.debit ELSE 0 END) as debit_total,
        SUM(CASE WHEN ji.credit IS NOT NULL THEN ji.credit ELSE 0 END) as credit_total
      FROM accounts a
      LEFT JOIN journal_items ji ON a.id = ji.account_id
      LEFT JOIN journals j ON ji.journal_id = j.id
      WHERE a.is_active = 1
        AND (j.date IS NULL OR j.date <= ?)
      GROUP BY a.id
      ORDER BY a.parent_id, a.name
    `, [date]);
  }

  /**
   * INVENTORY VALUATION
   * Current stock value by item
   */
  static getInventoryValuation() {
    return query(`
      SELECT
        i.id,
        i.name,
        i.sku,
        i.generic_name,
        i.strength,
        i.dosage_form,
        SUM(ib.quantity - COALESCE(ib.quantity_sold, 0) - COALESCE(ib.quantity_returned, 0)) as current_stock,
        COALESCE(i.avg_purchase_rate, 0) as avg_cost,
        SUM((ib.quantity - COALESCE(ib.quantity_sold, 0) - COALESCE(ib.quantity_returned, 0)) 
            * COALESCE(i.avg_purchase_rate, 0)) as stock_value,
        COUNT(DISTINCT ib.id) as batch_count
      FROM items i
      LEFT JOIN item_batches ib ON i.id = ib.item_id
      WHERE i.is_active = 1
      GROUP BY i.id
      ORDER BY stock_value DESC
    `);
  }

  /**
   * SALES TARGET PERFORMANCE
   * Monitor SSR achievement against targets
   */
  static getSalesTargetPerformance(month: string) {
    return query(`
      SELECT
        st.name as ssr_name,
        COALESCE(tar.target_amount, 0) as target_amount,
        COALESCE(tar.achieved_amount, 0) as achieved_amount,
        COALESCE(tar.achieved_amount, 0) - COALESCE(tar.target_amount, 0) as variance,
        ROUND(
          COALESCE(tar.achieved_amount, 0) / 
            NULLIF(COALESCE(tar.target_amount, 1), 0) * 100, 2
        ) as achievement_pct
      FROM staff st
      LEFT JOIN sales_targets tar ON st.id = tar.staff_id AND tar.month = ?
      WHERE st.role IN ('SSR', 'DSR')
        AND st.is_active = 1
      ORDER BY achievement_pct DESC
    `, [month]);
  }

  /**
   * CREDIT LIMIT UTILIZATION
   * Monitor customer credit usage
   */
  static getCreditLimitUtilization() {
    return query(`
      SELECT
        p.id,
        p.name,
        p.credit_limit,
        SUM(CASE WHEN si.status = 'Submitted' THEN si.outstanding_amount ELSE 0 END) as current_outstanding,
        ROUND(
          SUM(CASE WHEN si.status = 'Submitted' THEN si.outstanding_amount ELSE 0 END) /
            NULLIF(p.credit_limit, 0) * 100, 2
        ) as credit_utilization_pct,
        CASE 
          WHEN SUM(CASE WHEN si.status = 'Submitted' THEN si.outstanding_amount ELSE 0 END) > p.credit_limit 
          THEN 'EXCEEDED'
          WHEN SUM(CASE WHEN si.status = 'Submitted' THEN si.outstanding_amount ELSE 0 END) > p.credit_limit * 0.8 
          THEN 'WARNING'
          ELSE 'OK'
        END as status
      FROM parties p
      LEFT JOIN sales_invoices si ON p.id = si.customer_id
      WHERE p.type IN ('Customer', 'Both')
      GROUP BY p.id
      ORDER BY current_outstanding DESC
    `);
  }

  /**
   * AGING ANALYSIS (Outstanding Invoices)
   * Group outstanding by aging period
   */
  static getAgingAnalysis() {
    const today = new Date().toISOString().split('T')[0];
    return query(`
      SELECT
        p.id,
        p.name,
        si.id as invoice_id,
        si.date,
        si.total_amount,
        si.paid_amount,
        si.outstanding_amount,
        CAST((julianday(?) - julianday(si.date)) as INTEGER) as days_outstanding,
        CASE 
          WHEN (julianday(?) - julianday(si.date)) <= 30 THEN '0-30 Days'
          WHEN (julianday(?) - julianday(si.date)) <= 60 THEN '31-60 Days'
          WHEN (julianday(?) - julianday(si.date)) <= 90 THEN '61-90 Days'
          ELSE '90+ Days'
        END as age_bucket
      FROM sales_invoices si
      JOIN parties p ON si.customer_id = p.id
      WHERE si.status = 'Submitted'
        AND si.outstanding_amount > 0
      ORDER BY si.date ASC
    `, [today, today, today, today]);
  }

  /**
   * PAYMENT PERFORMANCE (By Payment Method)
   * Track payment collection by method
   */
  static getPaymentMethodReport(startDate: string, endDate: string) {
    return query(`
      SELECT
        payment_method,
        COUNT(*) as transaction_count,
        SUM(amount) as total_amount,
        AVG(amount) as avg_amount,
        COUNT(DISTINCT party_id) as unique_parties
      FROM payments
      WHERE date BETWEEN ? AND ?
        AND payment_method IS NOT NULL
      GROUP BY payment_method
      ORDER BY total_amount DESC
    `, [startDate, endDate]);
  }

  /**
   * CHEQUE CLEARING REPORT
   * Monitor pending cheques for bank reconciliation
   */
  static getChequeStatus() {
    return query(`
      SELECT
        id,
        date,
        party_id,
        cheque_number,
        amount,
        is_cleared,
        CASE WHEN is_cleared = 1 THEN 'Cleared' ELSE 'Pending' END as status
      FROM payments
      WHERE cheque_number IS NOT NULL
      ORDER BY cheque_date DESC, is_cleared
    `);
  }

  // ─────── LEGACY METHODS (for backward compatibility) ───────
  static getProfitAndLoss(startDate: string, endDate: string) {
    const income = query(
      `SELECT a.name, SUM(ji.credit - ji.debit) as balance 
       FROM journal_items ji 
       JOIN journals j ON ji.journal_id = j.id 
       JOIN accounts a ON ji.account_id = a.id 
       WHERE a.type = 'Income' AND date(j.date) BETWEEN date(?) AND date(?) 
       GROUP BY a.id`,
      [startDate, endDate]
    ) as unknown as { name: string; balance: number }[];

    const expenses = query(
      `SELECT a.name, SUM(ji.debit - ji.credit) as balance 
       FROM journal_items ji 
       JOIN journals j ON ji.journal_id = j.id 
       JOIN accounts a ON ji.account_id = a.id 
       WHERE a.type = 'Expense' AND date(j.date) BETWEEN date(?) AND date(?) 
       GROUP BY a.id`,
      [startDate, endDate]
    ) as unknown as { name: string; balance: number }[];

    const totalIncome = income.reduce((sum, row) => sum + (row.balance || 0), 0);
    const totalExpenses = expenses.reduce((sum, row) => sum + (row.balance || 0), 0);

    return {
      income,
      expenses,
      totalIncome,
      totalExpenses,
      netProfit: totalIncome - totalExpenses
    };
  }

  static getBalanceSheet(date: string) {
    const assets = query(
      `SELECT a.name, SUM(ji.debit - ji.credit) as balance 
       FROM journal_items ji 
       JOIN journals j ON ji.journal_id = j.id 
       JOIN accounts a ON ji.account_id = a.id 
       WHERE a.type = 'Asset' AND date(j.date) <= date(?) 
       GROUP BY a.id`,
      [date]
    ) as unknown as { name: string; balance: number }[];

    const liabilities = query(
      `SELECT a.name, SUM(ji.credit - ji.debit) as balance 
       FROM journal_items ji 
       JOIN journals j ON ji.journal_id = j.id 
       JOIN accounts a ON ji.account_id = a.id 
       WHERE a.type = 'Liability' AND date(j.date) <= date(?) 
       GROUP BY a.id`,
      [date]
    ) as unknown as { name: string; balance: number }[];

    const equity = query(
      `SELECT a.name, SUM(ji.credit - ji.debit) as balance 
       FROM journal_items ji 
       JOIN journals j ON ji.journal_id = j.id 
       JOIN accounts a ON ji.account_id = a.id 
       WHERE a.type = 'Equity' AND date(j.date) <= date(?) 
       GROUP BY a.id`,
      [date]
    ) as unknown as { name: string; balance: number }[];

    const pl = ReportService.getProfitAndLoss('1900-01-01', date);

    return {
      assets,
      liabilities,
      equity,
      netProfit: pl.netProfit,
      totalAssets: assets.reduce((sum, row) => sum + (row.balance || 0), 0),
      totalLiabilities: liabilities.reduce((sum, row) => sum + (row.balance || 0), 0),
      totalEquity: equity.reduce((sum, row) => sum + (row.balance || 0), 0) + pl.netProfit
    };
  }

  static getPartyBalances() {
    const customerBalances = query(`
      SELECT p.id, 
             IFNULL(SUM(CASE WHEN si.document_type = 'Return' THEN -si.total_amount ELSE si.total_amount END), 0) - IFNULL(p_pay.paid_total, 0) as balance
      FROM parties p
      LEFT JOIN sales_invoices si ON p.id = si.customer_id
      LEFT JOIN (
        SELECT party_id, SUM(amount) as paid_total 
        FROM payments 
        WHERE payment_type = 'Receive' 
        GROUP BY party_id
      ) p_pay ON p.id = p_pay.party_id
      WHERE p.type = 'Customer'
      GROUP BY p.id
    `);

    const supplierBalances = query(`
      SELECT p.id, 
             IFNULL(SUM(CASE WHEN pb.document_type = 'Return' THEN -pb.total_amount ELSE pb.total_amount END), 0) - IFNULL(p_pay.paid_total, 0) as balance
      FROM parties p
      LEFT JOIN purchase_bills pb ON p.id = pb.supplier_id
      LEFT JOIN (
        SELECT party_id, SUM(amount) as paid_total 
        FROM payments 
        WHERE payment_type = 'Pay' 
        GROUP BY party_id
      ) p_pay ON p.id = p_pay.party_id
      WHERE p.type = 'Supplier'
      GROUP BY p.id
    `);

    return { customerBalances, supplierBalances };
  }

  static getParties(type?: 'Customer' | 'Supplier') {
    let sql = `SELECT id, name, type FROM parties WHERE is_active = 1`;
    const params: any[] = [];
    if (type) {
      sql += ` AND (type = ? OR type = 'Both')`;
      params.push(type);
    }
    sql += ' ORDER BY name ASC';
    return query(sql, params) as unknown as { id: string; name: string; type: string }[];
  }

  static getAreaSales(startDate: string, endDate: string) {
    return query(`
      SELECT COALESCE(a.name, p.area, 'Unassigned') as area, 
             COUNT(si.id) as invoice_count,
             SUM(CASE WHEN si.document_type = 'Return' THEN -si.total_amount ELSE si.total_amount END) as net_sales
      FROM parties p
      JOIN sales_invoices si ON p.id = si.customer_id
      LEFT JOIN areas a ON p.area_id = a.id
      WHERE date(si.date) BETWEEN date(?) AND date(?)
      GROUP BY COALESCE(a.name, p.area, 'Unassigned')
      ORDER BY net_sales DESC
    `, [startDate, endDate]);
  }
}

// Default export for backward compatibility
export default ReportService;
