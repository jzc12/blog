// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// 定义路由
const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../md/home.md')
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('../md/about.md')
    },
    {
        path: '/category',
        name: 'category',
        component: () => import('../md/category.md')
    },
    {
        path: '/tags',
        name: 'tags',
        component: () => import('../md/tags.md')
    },
    { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router

