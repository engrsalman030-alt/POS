import { defineStore } from 'pinia';
import type { Item } from '../types/inventory';

export interface CartItem extends Item {
    quantity: number;
    bonus_quantity: number;
    batch_number: string;
    expiry_date: string;
}

export interface HeldOrder {
    id: string;
    customerId: string | null;
    items: CartItem[];
    discount: number;
    orderNote: string;
    date: string;
}

export const usePosStore = defineStore('pos', {
    state: () => ({
        cart: [] as CartItem[],
        customerId: null as string | null,
        discount: 0,
        orderNote: '',
        heldOrders: [] as HeldOrder[],
        isReturnMode: false,
        viewMode: 'list' as 'list' | 'grid',
    }),
    actions: {
        toggleViewMode() {
            this.viewMode = this.viewMode === 'list' ? 'grid' : 'list';
        },
        setViewMode(mode: 'list' | 'grid') {
            this.viewMode = mode;
        },
        setDiscount(amount: number) {
            this.discount = amount;
        },
        setOrderNote(note: string) {
            this.orderNote = note;
        },
        addToCart(item: Item) {
            const existing = this.cart.find(c => c.id === item.id);
            const qtyToAdd = this.isReturnMode ? -1 : 1;

            if (existing) {
                existing.quantity += qtyToAdd;
            } else {
                this.cart.push({
                    ...item,
                    quantity: qtyToAdd,
                    bonus_quantity: 0,
                    batch_number: item.batch_number || '',
                    expiry_date: item.expiry_date || ''
                });
            }
            this.cleanupCart();
        },
        updateQuantity(itemId: string, quantity: number) {
            const item = this.cart.find(c => c.id === itemId);
            if (item) {
                item.quantity = quantity;
            }
            this.cleanupCart();
        },
        updateBonus(itemId: string, bonus: number) {
            const item = this.cart.find(c => c.id === itemId);
            if (item) {
                item.bonus_quantity = bonus;
            }
        },
        updateBatch(itemId: string, batch: string) {
            const item = this.cart.find(c => c.id === itemId);
            if (item) {
                item.batch_number = batch;
            }
        },
        updateExpiry(itemId: string, date: string) {
            const item = this.cart.find(c => c.id === itemId);
            if (item) {
                item.expiry_date = date;
            }
        },
        cleanupCart() {
            this.cart = this.cart.filter(i => i.quantity !== 0);
        },
        clearCart() {
            this.cart = [];
            this.customerId = null;
            this.discount = 0;
            this.orderNote = '';
            this.isReturnMode = false;
        },
        holdOrder() {
            if (this.cart.length === 0) return;

            this.heldOrders.push({
                id: crypto.randomUUID(),
                customerId: this.customerId,
                items: [...this.cart],
                discount: this.discount,
                orderNote: this.orderNote,
                date: new Date().toISOString()
            });
            this.clearCart();
        },
        resumeOrder(heldOrder: HeldOrder) {
            this.cart = [...heldOrder.items];
            this.customerId = heldOrder.customerId;
            this.discount = heldOrder.discount;
            this.orderNote = heldOrder.orderNote;
            this.heldOrders = this.heldOrders.filter(o => o.id !== heldOrder.id);
        },
        toggleReturnMode() {
            this.isReturnMode = !this.isReturnMode;
        }
    },
    getters: {
        totalQuantity: (state) => state.cart.reduce((sum, item) => sum + item.quantity + (item.bonus_quantity || 0), 0),
        totalBilledQuantity: (state) => state.cart.reduce((sum, item) => sum + item.quantity, 0),
        totalBonusQuantity: (state) => state.cart.reduce((sum, item) => sum + (item.bonus_quantity || 0), 0),
        subtotal: (state) => state.cart.reduce((sum, item) => sum + (item.quantity * item.sales_rate), 0),
        grandTotal: (state) => {
            const sub = state.cart.reduce((sum, item) => sum + (item.quantity * item.sales_rate), 0);
            return sub - state.discount;
        }
    }
});
