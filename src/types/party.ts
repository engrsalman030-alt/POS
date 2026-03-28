export type PartyType = 'Customer' | 'Supplier' | 'Both';

export interface Party {
    id: string;
    name: string;
    type: PartyType;
    company_name?: string;
    contact_person?: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
    website?: string;
    address?: string; // Legacy
    billing_address?: string;
    shipping_address?: string;
    city?: string;
    country?: string;
    postal_code?: string;
    is_active: boolean;
    receivable_account_id?: string;
    payable_account_id?: string;
    tax_id?: string;
    cnic?: string;
    reg_number?: string;
    credit_limit?: number;
    payment_terms?: string;
    opening_balance?: number;
    balance_type?: 'Debit' | 'Credit';
    loyalty_program?: boolean;
    customer_group?: string;
    supplier_category?: string;
    price_list?: string;
    default_currency?: string;
    balance?: number;
    notes?: string;
    tags?: string;
}
