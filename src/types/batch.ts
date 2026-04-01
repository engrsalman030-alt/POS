export interface ItemBatch {
    id: string;
    item_id: string;
    batch_number: string;
    mfg_date?: string;
    expiry_date?: string;
    quantity: number;
    purchase_rate: number;
    sales_rate: number;
    supplier_id?: string;
    notes?: string;
    is_active: boolean;
    created_at: string;
}
