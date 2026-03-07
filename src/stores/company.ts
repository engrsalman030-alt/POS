import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import { useCompanyStore } from './stores/company'

async function bootstrap() {
    const app = createApp(App)
    const pinia = createPinia()

    app.use(pinia) // ← pinia must be used BEFORE calling useCompanyStore

    const companyStore = useCompanyStore()
    await companyStore.loadCompany() // ← now fully awaited before router starts

    app.use(router)
    app.mount('#app')
}

bootstrap()