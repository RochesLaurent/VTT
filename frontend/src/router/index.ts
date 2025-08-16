import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('@/views/auth/LoginPage.vue')
  },
  {
    path: '/auth/register',
    name: 'register',
    component: () => import('@/views/auth/RegisterPage.vue')
  },
  {
    path: '/auth/forgot-password',
    name: 'forgot-password',
    component: () => import('@/views/auth/ForgotPasswordPage.vue')
  },
  // Redirections
  {
    path: '/login',
    redirect: '/auth/login'
  },
  {
    path: '/register',
    redirect: '/auth/register'
  },
  // 404
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/components/TempPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router