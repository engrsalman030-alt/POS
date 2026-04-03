import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import { useCompanyStore } from '../stores/company';

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }
    },
    {
        path: '/setup',
        name: 'Setup',
        component: () => import('../views/Setup.vue')
    },
    {
        path: '/accounts',
        name: 'Accounts',
        component: () => import('../views/Accounts.vue')
    },
    {
        path: '/inventory',
        name: 'Inventory',
        component: () => import('../views/Inventory.vue')
    },
    {
        path: '/batches',
        name: 'Batches',
        component: () => import('../views/Batches.vue')
    },
    {
        path: '/sales',
        name: 'Sales',
        component: () => import('../views/Sales.vue')
    },
    {
        path: '/purchases',
        name: 'Purchases',
        component: () => import('../views/Purchases.vue')
    },
    {
        path: '/parties',
        name: 'Parties',
        component: () => import('../views/Parties.vue')
    },
    {
        path: '/bank',
        name: 'Bank',
        component: () => import('../views/Bank.vue')
    },
    {
        path: '/tax',
        name: 'Tax',
        component: () => import('../views/Tax.vue')
    },
    {
        path: '/reports',
        name: 'Reports',
        component: () => import('../views/Reports.vue')
    },
    {
        path: '/settings',
        name: 'Settings',
        component: () => import('../views/Settings.vue')
    },
    {
        path: '/pos',
        name: 'POS',
        component: () => import('../views/POS.vue'),
        meta: { hideSidebar: true }
    },
    {
        path: '/guide',
        name: 'Guide',
        component: () => import('../views/Guide.vue')
    },
    {
        path: '/staff',
        name: 'Staff',
        component: () => import('../views/Staff.vue')
    },
    {
        path: '/expenses',
        name: 'Expenses',
        component: () => import('../views/Expenses.vue')
    },
    {
        path: '/areas',
        name: 'Areas',
        component: () => import('../views/Areas.vue')
    },
    {
        path: '/ledger/:id',
        name: 'GeneralLedger',
        component: () => import('../views/GeneralLedger.vue'),
        props: true
    }

];

const router = createRouter({
    history: createWebHistory(),
    routes
});
router.beforeEach(async (to) => {
    const companyStore = useCompanyStore();

    console.log('🔍 Guard triggered, to:', to.name);
    console.log('🔍 isInitialized BEFORE load:', companyStore.isInitialized);

    if (!companyStore.isInitialized) {
        await companyStore.loadCompany();
    }

    console.log('🔍 isInitialized AFTER load:', companyStore.isInitialized);
    console.log('🔍 company data:', companyStore.company);

    if (to.name !== 'Setup' && !companyStore.isInitialized) {
        console.log('➡️ Redirecting to Setup');
        return { name: 'Setup' };
    }

    if (to.name === 'Setup' && companyStore.isInitialized) {
        console.log('➡️ Redirecting to Dashboard');
        return { name: 'Dashboard' };
    }

    console.log('✅ Proceeding to:', to.name);
    return true;
});

export default router;
