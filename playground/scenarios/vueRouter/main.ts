import { createApp } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from './App.vue'
import Home from './Home.vue'
import About from './About.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
]

// Use createMemoryHistory instead of createWebHistory in the sandbox environment
const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

// Add router error handling
router.onError((error) => {
  console.error('Vue Router error:', error)
})

const app = createApp(App)
app.use(router)
app.mount('#app')
