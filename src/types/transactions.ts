export type TransactionStatus = 'Draft' | 'Submitted' | 'Paid' | 'Cancelled';

export interface PurchaseBill {
    id: string;
    date: string;
    supplier_id: string;
    status: TransactionStatus;
    items: PurchaseBillItem[];
    tax_id?: string;
    tax_amount: number;
    total_amount: number;
    paid_amount: number;
    outstanding_amount: number;
    sales_manager?: string;
    frappe_reference?: string;
}

export interface PurchaseBillItem {
    id: string;
    item_id: string;
    quantity: number;
    bonus_quantity?: number;
    batch_number?: string;
    expiry_date?: string;
    rate: number;
    tax_id?: string;
    tax_amount: number;
    total: number;
}

export interface SalesInvoice {
    id: string;
    date: string;
    customer_id: string;
    status: TransactionStatus;
    items: SalesInvoiceItem[];
    tax_id?: string;
    tax_amount: number;
    discount_amount: number;
    total_amount: number;
    paid_amount: number;
    outstanding_amount: number;
    shift_id?: string; // Linking invoice to shift
    notes?: string;
    sales_manager?: string;
    frappe_reference?: string;
}

export interface SalesInvoiceItem {
    id: string;
    item_id: string;
    quantity: number;
    bonus_quantity?: number;
    batch_number?: string;
    expiry_date?: string;
    rate: number;
    tax_id?: string;
    tax_amount: number;
    total: number;
}

export interface Payment {
    id: string;
    date: string;
    party_id: string;
    party_type: 'Customer' | 'Supplier';
    payment_type: 'Pay' | 'Receive';
    account_id: string; // Bank or Cash
    amount: number;
    reference_type?: string;
    reference_id?: string;
    shift_id?: string; // Linking payment to shift
    memo?: string;
}
