// src/main.js

import { createApp } from 'vue'
import App from './App.vue'
import './css/style.css'
import './css/lapis.css'
import './assets/styles/katex-fonts.css'
import router from './router'

createApp(App).use(router).mount('#app')


