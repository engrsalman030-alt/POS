import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import { useCompanyStore } from './stores/company'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Load company BEFORE router so the guard has correct state on first visit
const companyStore = useCompanyStore()
companyStore.loadCompany().then(() => {
    app.use(router)
    app.mount('#app')
})