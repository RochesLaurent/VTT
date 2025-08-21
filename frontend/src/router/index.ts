// frontend/src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// Pages publiques
import HomePage from '@/views/HomeView.vue'
import LoginPage from '@/views/auth/LoginPage.vue'
import RegisterPage from '@/views/auth/RegisterPage.vue'
import ForgotPasswordPage from '@/views/auth/ForgotPasswordPage.vue'

// Pages authentifiées
// const DashboardPage = () => import('@/views/DashboardPage.vue')
const Profile = () => import('@/views/Profile.vue')
// const GamesListPage = () => import('@/views/GamesListPage.vue')
// const GamePage = () => import('@/views/GamePage.vue')
// const CreateGamePage = () => import('@/views/CreateGamePage.vue')

// Pages Wiki (publiques)
// const WikiHomePage = () => import('@/views/wiki/WikiHomePage.vue')
// const SpellsListPage = () => import('@/views/wiki/SpellsListPage.vue')
// const SpellDetailPage = () => import('@/views/wiki/SpellDetailPage.vue')

const routes: RouteRecordRaw[] = [
  // Routes publiques
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: { requiresAuth: false }
  },
  {
    path: '/auth/login',
    name: 'login',
    component: LoginPage,
    meta: { requiresAuth: false, guestOnly: true }
  },
  {
    path: '/auth/register',
    name: 'register',
    component: RegisterPage,
    meta: { requiresAuth: false, guestOnly: true }
  },
  {
    path: '/auth/forgot-password',
    name: 'forgot-password',
    component: ForgotPasswordPage,
    meta: { requiresAuth: false, guestOnly: true }
  },

  // Routes authentifiées
  // {
  //   path: '/dashboard',
  //   name: 'dashboard',
  //   component: DashboardPage,
  //   meta: { requiresAuth: true }
  // },
  {
    path: '/profile',
    name: 'profile',
    component: Profile, // ✅ Utilise le bon composant
    meta: { requiresAuth: true }
  },
  // {
  //   path: '/games',
  //   name: 'games',
  //   component: GamesListPage,
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: '/games/create',
  //   name: 'create-game',
  //   component: CreateGamePage,
  //   meta: { requiresAuth: true, requiresRole: 'ROLE_MASTER' }
  // },
  // {
  //   path: '/games/:code',
  //   name: 'game',
  //   component: GamePage,
  //   meta: { requiresAuth: true },
  //   props: true
  // },

  // Routes Wiki (publiques mais peuvent avoir des fonctionnalités supplémentaires si connecté)
  // {
  //   path: '/wiki',
  //   name: 'wiki',
  //   component: WikiHomePage,
  //   meta: { requiresAuth: false }
  // },
  // {
  //   path: '/wiki/spells',
  //   name: 'spells-list',
  //   component: SpellsListPage,
  //   meta: { requiresAuth: false }
  // },
  // {
  //   path: '/wiki/spells/:id',
  //   name: 'spell-detail',
  //   component: SpellDetailPage,
  //   meta: { requiresAuth: false },
  //   props: true
  // },

  // Route 404
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'not-found',
  //   component: () => import('@/views/NotFoundPage.vue'),
  //   meta: { requiresAuth: false }
  // }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialiser l'auth store si nécessaire
  if (!authStore.isAuthenticated && localStorage.getItem('token')) {
    try {
      await authStore.initialize()
    } catch (error) {
      console.error('Erreur d\'initialisation:', error)
    }
  }

  const requiresAuth = to.meta.requiresAuth
  const guestOnly = to.meta.guestOnly
  const requiresRole = to.meta.requiresRole as string | undefined
  const isAuthenticated = authStore.isAuthenticated

  // Redirection pour les pages guest-only
  if (guestOnly && isAuthenticated) {
    return next({ name: 'dashboard' })
  }

  // Vérification de l'authentification
  if (requiresAuth && !isAuthenticated) {
    return next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
  }

  // Vérification des rôles
  if (requiresRole && isAuthenticated) {
    if (!authStore.hasRole(requiresRole)) {
      return next({ name: 'dashboard' })
    }
  }

  next()
})

// Gestion des erreurs de navigation
router.onError((error) => {
  console.error('Erreur de navigation:', error)
  
  // Si c'est une erreur de chargement de module
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    // Recharger la page pour forcer le rechargement des modules
    window.location.reload()
  }
})

export default router