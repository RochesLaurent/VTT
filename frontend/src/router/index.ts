import { createRouter, createWebHistory } from 'vue-router';
import { authGuard, guestGuard } from './guards';
import HomeView from '../views/HomeView.vue';

import LoginPage from '@/views/auth/LoginPage.vue';
import RegisterPage from '@/views/auth/RegisterPage.vue';
import ForgotPasswordPage from '@/views/auth/ForgotPasswordPage.vue';

import ProfilePage from '@/views/ProfilePage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/auth',
      redirect: '/auth/login',
      children: [
        {
          path: 'login',
          name: 'login',
          component: LoginPage,
          beforeEnter: guestGuard,
          meta: { 
            title: 'Connexion',
            layout: 'auth'
          }
        },
        {
          path: 'register',
          name: 'register',
          component: RegisterPage,
          beforeEnter: guestGuard,
          meta: { 
            title: 'Inscription',
            layout: 'auth'
          }
        },
        {
          path: 'forgot-password',
          name: 'forgot-password',
          component: ForgotPasswordPage,
          beforeEnter: guestGuard,
          meta: { 
            title: 'Mot de passe oublié',
            layout: 'auth'
          }
        },
        // {
        //   path: 'reset-password/:token',
        //   name: 'reset-password',
        //   component: () => import('@/views/auth/ResetPasswordPage.vue'),
        //   beforeEnter: guestGuard,
        //   meta: { 
        //     title: 'Réinitialiser le mot de passe',
        //     layout: 'auth'
        //   }
        // }
      ]
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfilePage,
      beforeEnter: authGuard,
      meta: { 
        title: 'Mon Profil',
        requiresAuth: true,
        layout: 'default'
      }
    },
    // {
    //   path: '/dashboard',
    //   name: 'dashboard',
    //   component: () => import('@/views/DashboardView.vue'),
    //   beforeEnter: authGuard,
    //   meta: { 
    //     title: 'Tableau de bord',
    //     requiresAuth: true,
    //     layout: 'default'
    //   }
    // },
    // {
    //   path: '/games',
    //   name: 'games',
    //   component: () => import('@/views/GamesView.vue'),
    //   beforeEnter: authGuard,
    //   meta: { 
    //     title: 'Mes Parties',
    //     requiresAuth: true,
    //     layout: 'default'
    //   }
    // },
    // {
    //   path: '/:pathMatch(.*)*',
    //   name: 'not-found',
    //   component: () => import('@/views/NotFoundView.vue'),
    //   meta: { 
    //     title: 'Page non trouvée',
    //     layout: 'minimal'
    //   }
    // }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

router.beforeEach((to, from, next) => {
  const defaultTitle = 'OnlyRoll - Plateforme VTT D&D 5e';
  document.title = to.meta.title ? `${to.meta.title} | OnlyRoll` : defaultTitle;
  next();
});

export default router;