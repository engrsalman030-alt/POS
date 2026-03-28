export type ItemType = 'Product' | 'Service';

export interface Item {
    id: string;
    name: string;
    sku: string;
    barcode?: string;
    type: ItemType;
    category?: string;
    brand?: string;
    is_inventory: boolean;
    default_income_account_id: string;
    default_expense_account_id: string; // COGS
    default_inventory_account_id: string;
    purchase_rate: number;
    sales_rate: number;
    wholesale_rate?: number;
    min_sales_rate?: number;
    discount_allowed: boolean;
    stock_quantity: number;
    stock_value: number;
    reorder_level?: number;
    uom?: string;
    warehouse?: string;
    image?: string;
    is_active: boolean;
    
    // Pharmacy Data
    batch_number?: string;
    expiry_date?: string;
    mfg_date?: string;
    medicine_type?: string;
    prescription_required?: boolean;

    // Mobile Data
    imei_number?: string;
    serial_number?: string;
    warranty_period?: string;

    // Grocery Data
    weight?: number;
    pack_size?: string;
    unit_type?: string;

    notes?: string;
}

export interface StockTransaction {
    id: string;
    item_id: string;
    date: string;
    type: 'In' | 'Out';
    quantity: number;
    rate: number;
    value: number;
    reference_type: string; // 'Bill', 'Invoice', 'Adjustment'
    reference_id: string;
}
