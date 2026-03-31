import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/about.vue'
import questionnaire from '@/views/questionnaire.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/questionnaire', component: questionnaire },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from) => {
  if (!isAuthenticated && to.name !== 'Login') {
    return { name: 'Login' }
  }
})

export default router