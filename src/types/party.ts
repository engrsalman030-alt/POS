export type PartyType = 'Customer' | 'Supplier';

export interface Party {
    id: string;
    name: string;
    type: PartyType;
    email?: string;
    phone?: string;
    address?: string;
    is_active: boolean;
    receivable_account_id?: string;
    payable_account_id?: string;
}
