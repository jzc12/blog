// src/main.js

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './css/style.css'
import './css/lapis.css'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import background1 from './assets/background1.png';

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.mount('#app')

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const img = new Image();
    img.src = background1;
    img.onload = () => {
        body.style.backgroundImage = `url(${img.src})`;
    };
});


