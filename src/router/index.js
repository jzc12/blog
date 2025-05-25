// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// 定义路由
const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../md/home.md'),
        meta: { title: '首页' }
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('../md/about.md'),
        meta: { title: '关于' }
    },
    {
        path: '/category',
        name: 'category',
        component: () => import('../md/category.md'),
        meta: { title: '分类' }
    },
    {
        path: '/tags',
        name: 'tags',
        component: () => import('../md/tags.md'),
        meta: { title: '标签' }
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    base: process.env.BASE_URL,
    routes
})

export default router

