import { defineStore } from 'pinia';
import { ref } from 'vue';
import { TaxService, type TaxRule } from '../services/taxService';

export const useTaxStore = defineStore('tax', () => {
    const taxes = ref<TaxRule[]>([]);
    const loading = ref(false);

    async function fetchTaxes() {
        loading.value = true;
        try {
            taxes.value = await TaxService.getAll();
        } finally {
            loading.value = false;
        }
    }

    async function addTax(tax: Omit<TaxRule, 'id'>) {
        const id = await TaxService.create(tax);
        taxes.value.push({ ...tax, id });
    }

    async function updateTax(tax: TaxRule) {
        await TaxService.update(tax);
        const idx = taxes.value.findIndex(t => t.id === tax.id);
        if (idx !== -1) taxes.value[idx] = tax;
    }

    async function deleteTax(id: string) {
        await TaxService.delete(id);
        taxes.value = taxes.value.filter(t => t.id !== id);
    }

    return {
        taxes,
        loading,
        fetchTaxes,
        addTax,
        updateTax,
        deleteTax
    };
});
