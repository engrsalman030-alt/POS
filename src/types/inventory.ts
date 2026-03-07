export type ItemType = 'Product' | 'Service';

export interface Item {
    id: string;
    name: string;
    sku: string;
    type: ItemType;
    is_inventory: boolean;
    default_income_account_id: string;
    default_expense_account_id: string; // COGS
    default_inventory_account_id: string;
    purchase_rate: number;
    sales_rate: number;
    stock_quantity: number;
    stock_value: number;
    is_active: boolean;
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
