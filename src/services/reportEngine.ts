/**
 * ReportEngine - Central dynamic report dispatcher
 * To add a new report: add a case in getReport(), add to reportFilterConfig & reportLabels
 */
import { ReportService } from './reportService';
import { ERPService } from './erpService';

export type ReportType =
  | 'pl' | 'bs' | 'ssr' | 'dsr' | 'vendor_sales'
  | 'customer_ledger' | 'supplier_ledger' | 'shifts'
  | 'expiry' | 'batch_stock' | 'profit_by_product'
  | 'salesman_summary' | 'customer_summary';

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  customerId?: string;
  supplierId?: string;
  productId?: string;
  brand?: string;
  groupBy?: 'product' | 'brand' | 'category' | 'date';
  ssrId?: string;
  dsrId?: string;
}

export interface ColumnDef {
  key: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  format?: 'currency' | 'number' | 'date' | 'text';
}

export interface ReportResult {
  columns: ColumnDef[];
  rows: Record<string, any>[];
  summary: Record<string, any>;
  title: string;
}

/** Dynamic filter config: maps report type → which filter controls to render */
export const reportFilterConfig: Record<string, string[]> = {
  pl:                [],
  bs:                [],
  ssr:               ['dateRange', 'groupBy'],
  dsr:               ['dateRange', 'ssrFilter', 'dsrFilter'],
  vendor_sales:      ['dateRange', 'brand'],
  customer_ledger:   ['dateRange', 'customer'],
  supplier_ledger:   ['dateRange', 'supplier'],
  shifts:            ['shiftTimeframe'],
  expiry:            ['dateRange'],
  batch_stock:       ['brand'],
  profit_by_product: ['dateRange', 'brand'],
};

export const reportLabels: Record<string, string> = {
  pl:                'Profit & Loss Statement',
  bs:                'Balance Sheet',
  ssr:               'Stock Sales Report (SSR)',
  dsr:               'Daily Sales Report (DSR)',
  vendor_sales:      'Vendor-wise Sales Report',
  customer_ledger:   'Customer Ledger',
  supplier_ledger:   'Supplier Ledger',
  shifts:            'Shift Performance',
  expiry:            'Expiry Report',
  batch_stock:       'Batch-wise Stock Report',
  profit_by_product: 'Profit by Product',
  salesman_summary:  'Salesman Performance Summary',
  customer_summary:  'Customer Sales Summary',
};

export const ReportEngine = {
  async getReport(type: ReportType, filters: ReportFilters = {}): Promise<ReportResult> {
    const today = new Date().toISOString().split('T')[0];
    const {
      startDate = today, endDate = today,
      customerId, supplierId,
      groupBy = 'product', ssrId, dsrId,
    } = filters;
    const sd = startDate as string;
    const ed = endDate as string;

    switch (type) {
      case 'ssr': {
        const rows = await ERPService.getSSRReport({ startDate: sd, endDate: ed, groupBy }) as any[];
        return {
          title: reportLabels.ssr,
          columns: [
            { key: 'name',      label: 'Item / Description', align: 'left',  format: 'text'   },
            { key: 'opening',   label: 'Opening',            align: 'right', format: 'number' },
            { key: 'purchased', label: 'Purchased',          align: 'right', format: 'number' },
            { key: 'sold',      label: 'Sold',               align: 'right', format: 'number' },
            { key: 'closing',   label: 'Closing',            align: 'right', format: 'number' },
          ],
          rows,
          summary: {
            totalOpening:   rows.reduce((s, r) => s + (Number(r.opening)   || 0), 0),
            totalPurchased: rows.reduce((s, r) => s + (Number(r.purchased) || 0), 0),
            totalSold:      rows.reduce((s, r) => s + (Number(r.sold)      || 0), 0),
            totalClosing:   rows.reduce((s, r) => s + (Number(r.closing)   || 0), 0),
          },
        };
      }

      case 'dsr': {
        const rows = await ERPService.getDSRReport({ startDate: sd, endDate: ed, ssrId, dsrId }) as any[];
        return {
          title: reportLabels.dsr,
          columns: [
            { key: 'date',          label: 'Date',     align: 'left',  format: 'date'     },
            { key: 'invoice_id',    label: 'Invoice #', align: 'left', format: 'text'     },
            { key: 'customer_name', label: 'Customer', align: 'left',  format: 'text'     },
            { key: 'ssr_name',      label: 'SSR',      align: 'left',  format: 'text'     },
            { key: 'dsr_name',      label: 'DSR',      align: 'left',  format: 'text'     },
            { key: 'total_amount',  label: 'Total',    align: 'right', format: 'currency' },
            { key: 'paid_amount',   label: 'Paid',     align: 'right', format: 'currency' },
            { key: 'credit_amount', label: 'Credit',   align: 'right', format: 'currency' },
            { key: 'profit',        label: 'Profit',   align: 'right', format: 'currency' },
          ],
          rows,
          summary: {
            totalSales:  rows.reduce((s, r) => s + (Number(r.total_amount)  || 0), 0),
            totalPaid:   rows.reduce((s, r) => s + (Number(r.paid_amount)   || 0), 0),
            totalCredit: rows.reduce((s, r) => s + (Number(r.credit_amount) || 0), 0),
            totalProfit: rows.reduce((s, r) => s + (Number(r.profit)        || 0), 0),
          },
        };
      }

      case 'customer_ledger': {
        if (!customerId) return { title: reportLabels.customer_ledger, columns: [], rows: [], summary: {} };
        const result = await ReportService.getCustomerLedger(customerId, sd, ed);
        return {
          title: reportLabels.customer_ledger,
          columns: [
            { key: 'date',        label: 'Date',              align: 'left',  format: 'date'     },
            { key: 'reference',   label: 'Reference',         align: 'left',  format: 'text'     },
            { key: 'description', label: 'Description',       align: 'left',  format: 'text'     },
            { key: 'debit',       label: 'Debit (Sales)',     align: 'right', format: 'currency' },
            { key: 'credit',      label: 'Credit (Received)', align: 'right', format: 'currency' },
            { key: 'balance',     label: 'Running Balance',   align: 'right', format: 'currency' },
          ],
          rows: result.rows,
          summary: {
            openingBalance: result.openingBalance,
            closingBalance: result.closingBalance,
            totalDebit:  result.rows.reduce((s: number, r: any) => s + (r.debit  || 0), 0),
            totalCredit: result.rows.reduce((s: number, r: any) => s + (r.credit || 0), 0),
          },
        };
      }

      case 'supplier_ledger': {
        if (!supplierId) return { title: reportLabels.supplier_ledger, columns: [], rows: [], summary: {} };
        const result = await ReportService.getSupplierLedger(supplierId, sd, ed);
        return {
          title: reportLabels.supplier_ledger,
          columns: [
            { key: 'date',        label: 'Date',               align: 'left',  format: 'date'     },
            { key: 'reference',   label: 'Reference',          align: 'left',  format: 'text'     },
            { key: 'description', label: 'Description',        align: 'left',  format: 'text'     },
            { key: 'debit',       label: 'Debit (Paid)',       align: 'right', format: 'currency' },
            { key: 'credit',      label: 'Credit (Purchases)', align: 'right', format: 'currency' },
            { key: 'balance',     label: 'Running Balance',    align: 'right', format: 'currency' },
          ],
          rows: result.rows,
          summary: {
            openingBalance: result.openingBalance,
            closingBalance: result.closingBalance,
            totalDebit:  result.rows.reduce((s: number, r: any) => s + (r.debit  || 0), 0),
            totalCredit: result.rows.reduce((s: number, r: any) => s + (r.credit || 0), 0),
          },
        };
      }

      default:
        return { title: String(type), columns: [], rows: [], summary: {} };
    }
  },

  getFiltersFor(type: string): string[] {
    return reportFilterConfig[type] || [];
  },
};
