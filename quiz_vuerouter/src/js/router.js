import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/about.vue'
import questionnaire from '@/views/questionnaire.vue'
import jouer from '@/views/jouer.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/questionnaire', component: questionnaire },
  { path: '/jouer', component: jouer },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router