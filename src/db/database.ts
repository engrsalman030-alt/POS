import initSqlJs, { type Database } from 'sql.js';

let db: Database | null = null;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS company (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT,
  currency TEXT,
  fiscal_year_start TEXT,
  is_setup INTEGER DEFAULT 0,
  ntn TEXT
);

CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  parent_id TEXT,
  type TEXT NOT NULL, -- Asset, Liability, Equity, Income, Expense
  is_group INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  description TEXT,
  FOREIGN KEY (parent_id) REFERENCES accounts(id)
);

CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT UNIQUE,
  type TEXT NOT NULL, -- Product, Service
  is_inventory INTEGER DEFAULT 1,
  default_income_account_id TEXT,
  default_expense_account_id TEXT, -- COGS
  default_inventory_account_id TEXT,
  purchase_rate REAL DEFAULT 0,
  sales_rate REAL DEFAULT 0,
  stock_quantity REAL DEFAULT 0,
  stock_value REAL DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  FOREIGN KEY (default_income_account_id) REFERENCES accounts(id),
  FOREIGN KEY (default_expense_account_id) REFERENCES accounts(id),
  FOREIGN KEY (default_inventory_account_id) REFERENCES accounts(id)
);

CREATE TABLE IF NOT EXISTS parties (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- Customer, Supplier
  email TEXT,
  phone TEXT,
  address TEXT,
  tax_id TEXT,
  is_active INTEGER DEFAULT 1,
  receivable_account_id TEXT,
  payable_account_id TEXT,
  FOREIGN KEY (receivable_account_id) REFERENCES accounts(id),
  FOREIGN KEY (payable_account_id) REFERENCES accounts(id)
);

CREATE TABLE IF NOT EXISTS journals (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  reference_type TEXT,
  reference_id TEXT,
  memo TEXT,
  status TEXT DEFAULT 'Draft'
);

CREATE TABLE IF NOT EXISTS journal_items (
  id TEXT PRIMARY KEY,
  journal_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  debit REAL DEFAULT 0,
  credit REAL DEFAULT 0,
  FOREIGN KEY (journal_id) REFERENCES journals(id),
  FOREIGN KEY (account_id) REFERENCES accounts(id)
);

CREATE TABLE IF NOT EXISTS stock_ledger (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL,
  date TEXT NOT NULL,
  type TEXT NOT NULL, -- In, Out
  quantity REAL NOT NULL,
  rate REAL NOT NULL,
  value REAL NOT NULL,
  reference_type TEXT,
  reference_id TEXT,
  FOREIGN KEY (item_id) REFERENCES items(id)
);
CREATE TABLE IF NOT EXISTS taxes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  rate REAL NOT NULL,
  is_active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS sales_invoices (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  customer_id TEXT,
  status TEXT DEFAULT 'Draft',
  tax_id TEXT,
  tax_amount REAL DEFAULT 0,
  total_amount REAL DEFAULT 0,
  paid_amount REAL DEFAULT 0,
  outstanding_amount REAL DEFAULT 0,
  FOREIGN KEY (customer_id) REFERENCES parties(id)
);

CREATE TABLE IF NOT EXISTS sales_invoice_items (
  id TEXT PRIMARY KEY,
  invoice_id TEXT NOT NULL,
  item_id TEXT,
  quantity REAL DEFAULT 0,
  rate REAL DEFAULT 0,
  tax_id TEXT,
  tax_amount REAL DEFAULT 0,
  total REAL DEFAULT 0,
  FOREIGN KEY (invoice_id) REFERENCES sales_invoices(id),
  FOREIGN KEY (item_id) REFERENCES items(id)
);

CREATE TABLE IF NOT EXISTS purchase_bills (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  supplier_id TEXT,
  status TEXT DEFAULT 'Draft',
  tax_id TEXT,
  tax_amount REAL DEFAULT 0,
  total_amount REAL DEFAULT 0,
  paid_amount REAL DEFAULT 0,
  outstanding_amount REAL DEFAULT 0,
  FOREIGN KEY (supplier_id) REFERENCES parties(id)
);

CREATE TABLE IF NOT EXISTS purchase_bill_items (
  id TEXT PRIMARY KEY,
  bill_id TEXT NOT NULL,
  item_id TEXT,
  quantity REAL DEFAULT 0,
  rate REAL DEFAULT 0,
  tax_id TEXT,
  tax_amount REAL DEFAULT 0,
  total REAL DEFAULT 0,
  FOREIGN KEY (bill_id) REFERENCES purchase_bills(id),
  FOREIGN KEY (item_id) REFERENCES items(id)
);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  party_id TEXT,
  party_type TEXT,
  payment_type TEXT,
  account_id TEXT,
  amount REAL DEFAULT 0,
  reference_type TEXT,
  reference_id TEXT,
  FOREIGN KEY (party_id) REFERENCES parties(id),
  FOREIGN KEY (account_id) REFERENCES accounts(id)
);
`;

export async function getDb(): Promise<Database> {
  if (db) return db;

  const SQL = await initSqlJs({
    locateFile: (file) => `/${file}`
  });

  const savedDb = localStorage.getItem('pos_db');
  if (savedDb) {
    const uint8Array = new Uint8Array(JSON.parse(savedDb));
    db = new SQL.Database(uint8Array);
  } else {
    db = new SQL.Database();
  }

  // Always run schema to ensure all tables exist (IF NOT EXISTS is safe)
  db.run(SCHEMA);
  saveDb();

  return db;
}

export function saveDb() {
  if (!db) return;
  const data = db.export();
  const array = Array.from(data);
  localStorage.setItem('pos_db', JSON.stringify(array));
}

export function query(sql: string, params: any[] = []) {
  if (!db) throw new Error('Database not initialized');
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

export function execute(sql: string, params: any[] = []) {
  if (!db) throw new Error('Database not initialized');
  const stmt = db.prepare(sql);
  if (params.length > 0) {
    stmt.bind(params);
  }
  stmt.step();
  stmt.free();
  saveDb();
}

export function wipeDatabase() {
  localStorage.removeItem('pos_db');
  db = null;
}
