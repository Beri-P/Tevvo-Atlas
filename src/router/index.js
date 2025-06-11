import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
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
    name: 'Home',
    component: HomeView,
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
  const { user } = await authService.getCurrentUser()
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !user) {
    next('/login')
    return
  }
  
  // Prevent authenticated users from accessing login
  if (to.meta.requiresGuest && user) {
    next('/countries')
    return
  }
  
  next()
})

export default router