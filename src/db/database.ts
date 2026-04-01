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
  ntn TEXT,
  address TEXT,
  phone TEXT,
  business_type TEXT DEFAULT 'Pharmacy'
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
  barcode TEXT,
  type TEXT NOT NULL, -- Product, Service
  category TEXT,
  brand TEXT,
  is_inventory INTEGER DEFAULT 1,
  default_income_account_id TEXT,
  default_expense_account_id TEXT, -- COGS
  default_inventory_account_id TEXT,
  purchase_rate REAL DEFAULT 0,
  sales_rate REAL DEFAULT 0,
  wholesale_rate REAL DEFAULT 0,
  min_sales_rate REAL DEFAULT 0,
  discount_allowed INTEGER DEFAULT 1,
  stock_quantity REAL DEFAULT 0,
  stock_value REAL DEFAULT 0,
  reorder_level REAL DEFAULT 0,
  uom TEXT DEFAULT 'Units',
  warehouse TEXT,
  image TEXT,
  is_active INTEGER DEFAULT 1,
  -- Pharmacy Fields
  batch_number TEXT,
  expiry_date TEXT,
  mfg_date TEXT,
  medicine_type TEXT,
  prescription_required INTEGER DEFAULT 0,
  -- Mobile Fields
  imei_number TEXT,
  serial_number TEXT,
  warranty_period TEXT,
  -- Grocery Fields
  weight REAL,
  pack_size TEXT,
  unit_type TEXT,
  -- Pharmacy Distribution Fields
  generic_name TEXT,
  strength TEXT,
  dosage_form TEXT,
  mrp REAL DEFAULT 0,
  trade_price REAL DEFAULT 0,
  discount_on_tp REAL DEFAULT 0,
  notes TEXT,
  FOREIGN KEY (default_income_account_id) REFERENCES accounts(id),
  FOREIGN KEY (default_expense_account_id) REFERENCES accounts(id),
  FOREIGN KEY (default_inventory_account_id) REFERENCES accounts(id)
);

CREATE TABLE IF NOT EXISTS parties (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- Customer, Supplier, Both
  company_name TEXT,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  website TEXT,
  address TEXT, -- Legacy/Default
  billing_address TEXT,
  shipping_address TEXT,
  city TEXT,
  country TEXT,
  postal_code TEXT,
  tax_id TEXT,
  cnic TEXT,
  reg_number TEXT,
  credit_limit REAL DEFAULT 0,
  payment_terms TEXT,
  receivable_account_id TEXT,
  payable_account_id TEXT,
  opening_balance REAL DEFAULT 0,
  balance_type TEXT DEFAULT 'Debit',
  loyalty_program INTEGER DEFAULT 0,
  customer_group TEXT,
  supplier_category TEXT,
  price_list TEXT,
  default_currency TEXT,
  is_active INTEGER DEFAULT 1,
  notes TEXT,
  tags TEXT,
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
  bonus_quantity REAL DEFAULT 0,
  rate REAL NOT NULL,
  value REAL NOT NULL,
  reference_type TEXT,
  reference_id TEXT,
  FOREIGN KEY (item_id) REFERENCES items(id)
);

CREATE TABLE IF NOT EXISTS item_batches (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL,
  batch_number TEXT NOT NULL,
  mfg_date TEXT,
  expiry_date TEXT,
  quantity REAL DEFAULT 0,
  purchase_rate REAL DEFAULT 0,
  sales_rate REAL DEFAULT 0,
  supplier_id TEXT,
  notes TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT,
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
  discount_amount REAL DEFAULT 0,
  discount_pct REAL DEFAULT 0,
  total_amount REAL DEFAULT 0,
  paid_amount REAL DEFAULT 0,
  outstanding_amount REAL DEFAULT 0,
  sales_manager TEXT,
  frappe_reference TEXT,
  shift_id TEXT,
  ssr_id TEXT,
  dsr_id TEXT,
  FOREIGN KEY (customer_id) REFERENCES parties(id),
  FOREIGN KEY (shift_id) REFERENCES shifts(id),
  FOREIGN KEY (ssr_id) REFERENCES staff(id),
  FOREIGN KEY (dsr_id) REFERENCES staff(id)
);

CREATE TABLE IF NOT EXISTS staff (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL, -- SSR, DSR, Admin, etc.
  phone TEXT,
  is_active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS sales_invoice_items (
  id TEXT PRIMARY KEY,
  invoice_id TEXT NOT NULL,
  item_id TEXT,
  quantity REAL DEFAULT 0,
  bonus_quantity REAL DEFAULT 0,
  batch_number TEXT,
  expiry_date TEXT,
  rate REAL DEFAULT 0,
  tax_id TEXT,
  tax_amount REAL DEFAULT 0,
  total REAL DEFAULT 0,
  batch_id TEXT,
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
  discount_amount REAL DEFAULT 0,
  discount_pct REAL DEFAULT 0,
  total_amount REAL DEFAULT 0,
  paid_amount REAL DEFAULT 0,
  outstanding_amount REAL DEFAULT 0,
  sales_manager TEXT,
  frappe_reference TEXT,
  FOREIGN KEY (supplier_id) REFERENCES parties(id)
);

CREATE TABLE IF NOT EXISTS purchase_bill_items (
  id TEXT PRIMARY KEY,
  bill_id TEXT NOT NULL,
  item_id TEXT,
  quantity REAL DEFAULT 0,
  bonus_quantity REAL DEFAULT 0,
  batch_number TEXT,
  expiry_date TEXT,
  rate REAL DEFAULT 0,
  tax_id TEXT,
  tax_amount REAL DEFAULT 0,
  total REAL DEFAULT 0,
  batch_id TEXT,
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
  shift_id TEXT,
  memo TEXT,
  FOREIGN KEY (party_id) REFERENCES parties(id),
  FOREIGN KEY (account_id) REFERENCES accounts(id),
  FOREIGN KEY (shift_id) REFERENCES shifts(id)
);

CREATE TABLE IF NOT EXISTS shifts (
  id TEXT PRIMARY KEY,
  start_time TEXT NOT NULL,
  end_time TEXT,
  opening_balance REAL DEFAULT 0,
  closing_balance REAL DEFAULT 0,
  status TEXT DEFAULT 'Open',
  notes TEXT
);

CREATE TABLE IF NOT EXISTS expense_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  category_id TEXT NOT NULL,
  amount REAL NOT NULL,
  notes TEXT,
  paid_by TEXT,
  FOREIGN KEY (category_id) REFERENCES expense_categories(id)
);

CREATE TABLE IF NOT EXISTS erp_settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_stock_ledger_item_date ON stock_ledger(item_id, date);
CREATE INDEX IF NOT EXISTS idx_sales_invoices_date ON sales_invoices(date);
CREATE INDEX IF NOT EXISTS idx_journal_items_account ON journal_items(account_id);
CREATE INDEX IF NOT EXISTS idx_item_batches_item ON item_batches(item_id);
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

  // Enhanced Migration Logic
  const migrations = [
    // Items table migrations
    { table: 'items', column: 'barcode', type: 'TEXT' },
    { table: 'items', column: 'brand', type: 'TEXT' },
    { table: 'items', column: 'wholesale_rate', type: 'REAL DEFAULT 0' },
    { table: 'items', column: 'min_sales_rate', type: 'REAL DEFAULT 0' },
    { table: 'items', column: 'discount_allowed', type: 'INTEGER DEFAULT 1' },
    { table: 'items', column: 'reorder_level', type: 'REAL DEFAULT 0' },
    { table: 'items', column: 'uom', type: "TEXT DEFAULT 'Units'" },
    { table: 'items', column: 'warehouse', type: 'TEXT' },
    { table: 'items', column: 'batch_number', type: 'TEXT' },
    { table: 'items', column: 'expiry_date', type: 'TEXT' },
    { table: 'items', column: 'mfg_date', type: 'TEXT' },
    { table: 'items', column: 'medicine_type', type: 'TEXT' },
    { table: 'items', column: 'prescription_required', type: 'INTEGER DEFAULT 0' },
    { table: 'items', column: 'imei_number', type: 'TEXT' },
    { table: 'items', column: 'serial_number', type: 'TEXT' },
    { table: 'items', column: 'warranty_period', type: 'TEXT' },
    { table: 'items', column: 'weight', type: 'REAL' },
    { table: 'items', column: 'pack_size', type: 'TEXT' },
    { table: 'items', column: 'unit_type', type: 'TEXT' },
    { table: 'items', column: 'notes', type: 'TEXT' },
    
    // Parties table migrations
    { table: 'parties', column: 'company_name', type: 'TEXT' },
    { table: 'parties', column: 'contact_person', type: 'TEXT' },
    { table: 'parties', column: 'whatsapp', type: 'TEXT' },
    { table: 'parties', column: 'website', type: 'TEXT' },
    { table: 'parties', column: 'billing_address', type: 'TEXT' },
    { table: 'parties', column: 'shipping_address', type: 'TEXT' },
    { table: 'parties', column: 'city', type: 'TEXT' },
    { table: 'parties', column: 'country', type: 'TEXT' },
    { table: 'parties', column: 'postal_code', type: 'TEXT' },
    { table: 'parties', column: 'reg_number', type: 'TEXT' },
    { table: 'parties', column: 'credit_limit', type: 'REAL DEFAULT 0' },
    { table: 'parties', column: 'payment_terms', type: 'TEXT' },
    { table: 'parties', column: 'opening_balance', type: 'REAL DEFAULT 0' },
    { table: 'parties', column: 'balance_type', type: "TEXT DEFAULT 'Debit'" },
    { table: 'parties', column: 'loyalty_program', type: 'INTEGER DEFAULT 0' },
    { table: 'parties', column: 'customer_group', type: 'TEXT' },
    { table: 'parties', column: 'supplier_category', type: 'TEXT' },
    { table: 'parties', column: 'price_list', type: 'TEXT' },
    { table: 'parties', column: 'default_currency', type: 'TEXT' },
    { table: 'parties', column: 'notes', type: 'TEXT' },
    { table: 'parties', column: 'tags', type: 'TEXT' },
    
    // Transaction items migrations
    { table: 'sales_invoice_items', column: 'bonus_quantity', type: 'REAL DEFAULT 0' },
    { table: 'sales_invoice_items', column: 'batch_number', type: 'TEXT' },
    { table: 'sales_invoice_items', column: 'expiry_date', type: 'TEXT' },
    { table: 'purchase_bill_items', column: 'bonus_quantity', type: 'REAL DEFAULT 0' },
    { table: 'purchase_bill_items', column: 'batch_number', type: 'TEXT' },
    { table: 'purchase_bill_items', column: 'expiry_date', type: 'TEXT' },
    { table: 'stock_ledger', column: 'bonus_quantity', type: 'REAL DEFAULT 0' },
    { table: 'stock_ledger', column: 'batch_id', type: 'TEXT' },
    
    // Batch tracking on invoice/bill items
    { table: 'sales_invoice_items', column: 'batch_id', type: 'TEXT' },
    { table: 'purchase_bill_items', column: 'batch_id', type: 'TEXT' },
    
    // Shift migrations
    { table: 'sales_invoices', column: 'shift_id', type: 'TEXT' },
    { table: 'payments', column: 'shift_id', type: 'TEXT' },
    
    // Distribution Metadata migrations
    { table: 'sales_invoices', column: 'sales_manager', type: 'TEXT' },
    { table: 'purchase_bills', column: 'frappe_reference', type: 'TEXT' },
    
    // New Pharmacy Distribution Fields
    { table: 'items', column: 'generic_name', type: 'TEXT' },
    { table: 'items', column: 'strength', type: 'TEXT' },
    { table: 'items', column: 'dosage_form', type: 'TEXT' },
    { table: 'items', column: 'mrp', type: 'REAL DEFAULT 0' },
    { table: 'items', column: 'trade_price', type: 'REAL DEFAULT 0' },
    { table: 'items', column: 'discount_on_tp', type: 'REAL DEFAULT 0' },
    
    // Company migrations
    { table: 'company', column: 'business_type', type: "TEXT DEFAULT 'Pharmacy'" },
    { table: 'company', column: 'address', type: 'TEXT' },
    { table: 'company', column: 'phone', type: 'TEXT' },
    
    // SSR/DSR migrations
    { table: 'sales_invoices', column: 'ssr_id', type: 'TEXT' },
    { table: 'sales_invoices', column: 'dsr_id', type: 'TEXT' },
    
    // Settings & Expenses migrations
    { table: 'erp_settings', column: 'key', type: 'TEXT' },
    { table: 'expenses', column: 'category_id', type: 'TEXT' },
    { table: 'expenses', column: 'paid_by', type: 'TEXT' },

    // Invoices / Bills missing columns
    { table: 'sales_invoices', column: 'discount_amount', type: 'REAL DEFAULT 0' },
    { table: 'sales_invoices', column: 'discount_pct', type: 'REAL DEFAULT 0' },
    { table: 'purchase_bills', column: 'discount_amount', type: 'REAL DEFAULT 0' },
    { table: 'purchase_bills', column: 'discount_pct', type: 'REAL DEFAULT 0' },
  ];

  for (const m of migrations) {
    try {
      db.run(`ALTER TABLE ${m.table} ADD COLUMN ${m.column} ${m.type};`);
    } catch (e) {
      // Column likely already exists
    }
  }

  // Ensure mandatory legacy columns exist (re-running for safety)
  try { db.run("ALTER TABLE items ADD COLUMN image TEXT;"); } catch (e) {}
  try { db.run("ALTER TABLE parties ADD COLUMN cnic TEXT;"); } catch (e) {}
  try { 
    db.run("ALTER TABLE items ADD COLUMN category TEXT;");
    db.run("UPDATE items SET category = 'General' WHERE category IS NULL;");
  } catch (e) {}

  // Rebranding Migration: Set default name to B & H Pharmaceutical (PVT) LTD
  try {
    db.run("UPDATE company SET name = 'B & H Pharmaceutical (PVT) LTD' WHERE name = 'Nexus POS' OR name = 'Pharmacy Dashboard' OR name = 'VTS SOLUTIONS';");
  } catch (e) {}

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
