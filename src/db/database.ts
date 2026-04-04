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
  business_type TEXT DEFAULT 'Pharmacy',
  license_number TEXT
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
  license_number TEXT,
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

CREATE TABLE IF NOT EXISTS areas (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  is_active INTEGER DEFAULT 1
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

CREATE TABLE IF NOT EXISTS staff_areas (
  id TEXT PRIMARY KEY,
  staff_id TEXT NOT NULL,
  area_id TEXT NOT NULL,
  FOREIGN KEY (staff_id) REFERENCES staff(id),
  FOREIGN KEY (area_id) REFERENCES areas(id)
);

CREATE TABLE IF NOT EXISTS staff_parties (
  id TEXT PRIMARY KEY,
  staff_id TEXT NOT NULL,
  party_id TEXT NOT NULL,
  role TEXT,
  FOREIGN KEY (staff_id) REFERENCES staff(id),
  FOREIGN KEY (party_id) REFERENCES parties(id)
);

CREATE TABLE IF NOT EXISTS sales_targets (
  id TEXT PRIMARY KEY,
  staff_id TEXT NOT NULL,
  month TEXT NOT NULL,
  target_amount REAL DEFAULT 0,
  achieved_amount REAL DEFAULT 0,
  FOREIGN KEY (staff_id) REFERENCES staff(id)
);

CREATE TABLE IF NOT EXISTS opening_balances (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  fiscal_year TEXT NOT NULL,
  debit REAL DEFAULT 0,
  credit REAL DEFAULT 0,
  FOREIGN KEY (account_id) REFERENCES accounts(id)
);

CREATE TABLE IF NOT EXISTS credit_debit_notes (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  type TEXT NOT NULL,
  party_id TEXT,
  reference_invoice_id TEXT,
  amount REAL DEFAULT 0,
  tax_amount REAL DEFAULT 0,
  reason TEXT,
  status TEXT DEFAULT 'Draft',
  ssr_id TEXT,
  FOREIGN KEY (party_id) REFERENCES parties(id),
  FOREIGN KEY (ssr_id) REFERENCES staff(id)
);

CREATE TABLE IF NOT EXISTS credit_debit_note_items (
  id TEXT PRIMARY KEY,
  note_id TEXT NOT NULL,
  item_id TEXT,
  batch_id TEXT,
  quantity REAL DEFAULT 0,
  rate REAL DEFAULT 0,
  total REAL DEFAULT 0,
  FOREIGN KEY (note_id) REFERENCES credit_debit_notes(id),
  FOREIGN KEY (item_id) REFERENCES items(id)
);

CREATE TABLE IF NOT EXISTS erp_settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_stock_ledger_item_date ON stock_ledger(item_id, date);
CREATE INDEX IF NOT EXISTS idx_sales_invoices_date ON sales_invoices(date);
CREATE INDEX IF NOT EXISTS idx_sales_invoices_customer ON sales_invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_purchase_bills_supplier ON purchase_bills(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_bills_date ON purchase_bills(date);
CREATE INDEX IF NOT EXISTS idx_journal_items_account ON journal_items(account_id);
CREATE INDEX IF NOT EXISTS idx_journals_date ON journals(date);
CREATE INDEX IF NOT EXISTS idx_payments_party ON payments(party_id, payment_type);
CREATE INDEX IF NOT EXISTS idx_item_batches_item ON item_batches(item_id);
CREATE INDEX IF NOT EXISTS idx_items_brand ON items(brand);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
`;

// --- IndexedDB Helpers ---
const DB_NAME = 'POS_DB_STORE';
const STORE_NAME = 'sqlite_store';
const DB_KEY = 'pos_db_binary';

function openIDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function saveToIDB(data: Uint8Array): Promise<void> {
  return openIDB().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(data, DB_KEY);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  });
}

function loadFromIDB(): Promise<Uint8Array | null> {
  return openIDB().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(DB_KEY);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  });
}

function clearIDB(): Promise<void> {
  return openIDB().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(DB_KEY);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  });
}
// ------------------------

export async function getDb(): Promise<Database> {
  if (db) return db;

  const SQL = await initSqlJs({
    locateFile: (file) => `/${file}`
  });

  try {
    let uint8Array = await loadFromIDB();

    if (!uint8Array) {
      // Data Migration from localStorage (Legacy)
      const savedDb = localStorage.getItem('pos_db');
      if (savedDb) {
        console.log("Migrating database from localStorage to IndexedDB...");
        uint8Array = new Uint8Array(JSON.parse(savedDb));
        
        // Save to the new more sustainable IndexedDB immediately
        await saveToIDB(uint8Array);
        
        // Clear old storage to free up the 5MB browser limit
        localStorage.removeItem('pos_db');
        console.log("Migration successful!");
      }
    }

    if (uint8Array) {
      db = new SQL.Database(uint8Array);
    } else {
      db = new SQL.Database();
    }
  } catch (error) {
    console.error("Failed to load DB from IDB:", error);
    db = new SQL.Database(); // Fallback to empty DB on catastrophic error
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
    { table: 'expenses', column: 'merchant', type: 'TEXT' },
    { table: 'expenses', column: 'payment_method', type: 'TEXT' },

    // Invoices / Bills missing columns
    { table: 'sales_invoices', column: 'discount_amount', type: 'REAL DEFAULT 0' },
    { table: 'sales_invoices', column: 'discount_pct', type: 'REAL DEFAULT 0' },
    { table: 'purchase_bills', column: 'discount_amount', type: 'REAL DEFAULT 0' },
    { table: 'purchase_bills', column: 'discount_pct', type: 'REAL DEFAULT 0' },
    
    // Returns
    { table: 'sales_invoices', column: 'document_type', type: "TEXT DEFAULT 'Invoice'" },
    { table: 'purchase_bills', column: 'document_type', type: "TEXT DEFAULT 'Bill'" },

    // ERP Upgrade
    { table: 'parties', column: 'company_type', type: 'TEXT' },
    { table: 'parties', column: 'default_percentage', type: 'REAL DEFAULT 0' },
    { table: 'parties', column: 'code', type: 'TEXT' },
    { table: 'staff', column: 'cnic', type: 'TEXT' },
    { table: 'staff', column: 'address', type: 'TEXT' },
    { table: 'staff', column: 'salary', type: 'REAL DEFAULT 0' },
    { table: 'staff', column: 'joining_date', type: 'TEXT' },
    { table: 'staff', column: 'permissions_json', type: 'TEXT' },
    { table: 'taxes', column: 'type', type: "TEXT DEFAULT 'Percentage'" },
    { table: 'taxes', column: 'applicable_on', type: "TEXT DEFAULT 'Invoice'" },
    { table: 'taxes', column: 'is_inclusive', type: 'INTEGER DEFAULT 0' },
    { table: 'taxes', column: 'effective_date', type: 'TEXT' },
    { table: 'items', column: 'code', type: 'TEXT' },
    { table: 'company', column: 'license_number', type: 'TEXT' },
    { table: 'parties', column: 'license_number', type: 'TEXT' },
    { table: 'parties', column: 'area', type: 'TEXT' },
    { table: 'parties', column: 'area_id', type: 'TEXT' },
    
    // PHARMA ERP ENHANCEMENTS - Sales Invoices
    { table: 'sales_invoices', column: 'area_id', type: 'TEXT' },
    { table: 'sales_invoices', column: 'return_reference_id', type: 'TEXT' },
    
    // PHARMA ERP ENHANCEMENTS - Purchase Bills
    { table: 'purchase_bills', column: 'area_id', type: 'TEXT' },
    { table: 'purchase_bills', column: 'return_reference_id', type: 'TEXT' },
    { table: 'purchase_bills', column: 'ssr_id', type: 'TEXT' },
    
    // PHARMA ERP ENHANCEMENTS - Items (Tax & Pricing)
    { table: 'items', column: 'sale_tax_pct', type: 'REAL DEFAULT 0' },
    { table: 'items', column: 'purchase_tax_pct', type: 'REAL DEFAULT 0' },
    { table: 'items', column: 'last_purchase_rate', type: 'REAL DEFAULT 0' },
    { table: 'items', column: 'avg_purchase_rate', type: 'REAL DEFAULT 0' },
    { table: 'items', column: 'opening_stock', type: 'REAL DEFAULT 0' },
    { table: 'items', column: 'opening_stock_value', type: 'REAL DEFAULT 0' },
    
    // PHARMA ERP ENHANCEMENTS - Item Batches (Tracking)
    { table: 'item_batches', column: 'quantity_sold', type: 'REAL DEFAULT 0' },
    { table: 'item_batches', column: 'quantity_returned', type: 'REAL DEFAULT 0' },
    { table: 'item_batches', column: 'landing_cost', type: 'REAL DEFAULT 0' },
    
    // PHARMA ERP ENHANCEMENTS - Payments (Payment Methods)
    { table: 'payments', column: 'payment_method', type: "TEXT DEFAULT 'Cash'" },
    { table: 'payments', column: 'bank_account', type: 'TEXT' },
    { table: 'payments', column: 'cheque_number', type: 'TEXT' },
    { table: 'payments', column: 'cheque_date', type: 'TEXT' },
    { table: 'payments', column: 'is_cleared', type: 'INTEGER DEFAULT 0' },
    
    // PHARMA ERP ENHANCEMENTS - Expenses (Enhanced Tracking)
    { table: 'expenses', column: 'payment_method', type: "TEXT DEFAULT 'Cash'" },
    { table: 'expenses', column: 'reference_number', type: 'TEXT' },
    { table: 'expenses', column: 'approved_by', type: 'TEXT' },
    { table: 'expenses', column: 'account_id', type: 'TEXT' },
    
    // PHARMA ERP ENHANCEMENTS - Shifts (Enhanced Reporting)
    { table: 'shifts', column: 'staff_id', type: 'TEXT' },
    { table: 'shifts', column: 'total_sales', type: 'REAL DEFAULT 0' },
    { table: 'shifts', column: 'total_collections', type: 'REAL DEFAULT 0' },
    { table: 'shifts', column: 'total_expenses', type: 'REAL DEFAULT 0' },
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

  // Rebranding Migration: Set default name and address
  try {
    db.run("UPDATE company SET name = 'B & H Pharmaceutical (PVT) LTD', address = 'Ismail Adda, Khwaza Khela. Swat'");
  } catch (e) {}

  // ─── Formalize Areas Migration ──────────────────────────────────
  if (db) {
    try {
      // 1. Get all unique areas from parties
      const existingAreas = db.exec("SELECT DISTINCT area FROM parties WHERE area IS NOT NULL AND area != ''") as any[];
      if (existingAreas.length > 0 && existingAreas[0].values) {
        existingAreas[0].values.forEach((row: any[]) => {
          const areaName = row[0];
          if (!areaName) return;
          // 2. Insert into areas table (will fail if exists due to UNIQUE)
          try {
            const areaId = crypto.randomUUID();
            db?.run("INSERT OR IGNORE INTO areas (id, name) VALUES (?, ?)", [areaId, areaName]);
            
            // 3. Update parties with the new area_id for this area name
            const res = db?.exec("SELECT id FROM areas WHERE name = ?", [areaName]) as any[];
            if (res.length > 0 && res[0].values) {
               const actualId = res[0].values[0][0];
               db?.run("UPDATE parties SET area_id = ? WHERE area = ?", [actualId as string, areaName]);
            }
          } catch (e) {}
        });
      }
    } catch (e) {
      console.error("Area migration error:", e);
    }
  }

  saveDb();

  return db;
}

let isSaving = false;
let pendingSave = false;

export async function saveDb() {
  if (!db) return;

  // Queued saving to prevent blocking the UI thread and concurrent writes
  if (isSaving) {
    pendingSave = true;
    return;
  }

  isSaving = true;
  pendingSave = false;

  try {
    const data = db.export(); // Binary array direct export
    await saveToIDB(data);
  } catch (error) {
    console.error("Failed to save DB to IDB:", error);
  } finally {
    isSaving = false;
    // Process next save if an execution happened while we were saving
    if (pendingSave) {
      saveDb();
    }
  }
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
  clearIDB().catch(e => console.error("Failed to wipe IDB:", e));
  db = null;
}

export async function backupDatabase() {
  if (!db) return;
  const data = db.export();
  const blob = new Blob([data.buffer as ArrayBuffer], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().split('T')[0];
  const a = document.createElement('a');
  a.href = url;
  a.download = `pos_backup_${dateStr}.sqlite`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function restoreDatabase(file: File) {
  return new Promise<void>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        await saveToIDB(uint8Array);
        resolve();
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}
