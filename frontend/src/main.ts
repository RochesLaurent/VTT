import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

console.log('Main.ts is loading...')

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

console.log('About to mount app...')
app.mount('#app')
console.log('App mounted!')