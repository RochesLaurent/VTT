import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from '../App.vue'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/auth/login',
      name: 'login',
      component: { template: '<div>Login</div>' }
    }
  ]
})

const pinia = createPinia()

describe('App', () => {
  it('mounts renders properly', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router, pinia]
      }
    })
    
    await router.isReady()
    
    expect(wrapper.text()).toContain('Home View fonctionne !')
  })
})