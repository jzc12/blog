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
        component: () => import('../views/CategoryList.vue')
    },
    {
        path: '/:articleId',
        name: 'article',
        component: () => import('../views/ArticleDetail.vue')
    },
    {
        path: '/message',
        name: 'message',
        component: () => import('../views/Message.vue')
    },
    {
        path: '/404',
        name: 'notfound',
        component: () => import('@/md/404.md')
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/404'
    }
]

const router = createRouter({
    history: createWebHistory('/blog/'),
    routes
})

export default router

