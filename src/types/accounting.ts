export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';
export type AccountRootType = 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';

export interface Account {
  id: string;
  name: string;
  code: string;
  parent_id: string | null;
  type: AccountType;
  is_group: boolean;
  is_active: boolean;
  description?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  reference_type: string; // 'Invoice', 'Bill', 'Payment', 'Manual'
  reference_id: string;
  memo: string;
  status: 'Draft' | 'Submitted';
  items: JournalEntryItem[];
}

export interface JournalEntryItem {
  id: string;
  journal_entry_id: string;
  account_id: string;
  debit: number;
  credit: number;
}

export interface LedgerEntry {
  id: string;
  account_id: string;
  date: string;
  debit: number;
  credit: number;
  balance: number;
  reference_type: string;
  reference_id: string;
  memo: string;
}
