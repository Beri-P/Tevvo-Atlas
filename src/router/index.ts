import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '@/services/supabase'
import LoginView from '@/views/LoginView.vue'
import CountriesView from '@/views/CountriesView.vue'
import CountryDetail from '@/views/CountryDetail.vue'

const routes = [
  {
    path: '/',
    redirect: '/countries'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true }
  },
  {
    path: '/countries',
    name: 'Countries',
    component: CountriesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/country/:code',
    name: 'CountryDetail',
    component: CountryDetail,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/countries'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards for authentication
router.beforeEach(async (to, from, next) => {
  try {
    const { user } = await authService.getCurrentUser()
    
    if (to.meta.requiresAuth && !user) {
      next('/login')
      return
    }
    
    if (to.meta.requiresGuest && user) {
      next('/countries')
      return
    }
    
    next()
  } catch (error) {
    console.error('Auth check failed:', error)
    // If auth check fails, redirect to login for protected routes
    if (to.meta.requiresAuth) {
      next('/login')
    } else {
      next()
    }
  }
})

export default router