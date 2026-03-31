import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/about.vue'
import Login from '@/views/login.vue'
import editQuestionnaire from '@/views/editQuestionnaire.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  {
    path: '/edit-questionnaire',
    name: 'editQuestionnaire',
    component: editQuestionnaire,
    meta: { requiresAuth: true }
  },
  { path: '/login', name: 'Login', component: Login },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const isAuthenticated = Boolean(localStorage.getItem('authToken'))

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'Login' }
  }
})

export default router