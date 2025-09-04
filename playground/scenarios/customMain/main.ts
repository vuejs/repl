import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.config.globalProperties.$hi = () => alert('hi Vue')
app.mount('#app')
