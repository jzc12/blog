// src/main.js

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './css/style.css'
import './css/lapis.css'
import router from './router'
import tooltip from './utils/tooltip.js'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 还原 GitHub Pages 的 fallback 路由
const redirectPath = sessionStorage.getItem('redirect')
if (redirectPath) {
    sessionStorage.removeItem('redirect')
    window.history.replaceState(null, '', redirectPath)
}

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.directive('tooltip', tooltip)
app.mount('#app')
