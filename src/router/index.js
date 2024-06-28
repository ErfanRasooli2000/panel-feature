import Vue from 'vue'
import VueRouter from 'vue-router'

// Routes
import { canNavigate } from '@/libs/acl/routeProtection'
import { getUserData, getHomeRouteForLoggedInUser } from '@/auth/utils'
import artists from '@/router/routes/posts'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/dashboard.vue'),
      meta:{
        authRequired: true
      }
    },
    {
      path: '/auth/login',
      name: 'auth-login',
      component: () => import('@/views/auth/Login-v1.vue'),
      meta: {
        layout: 'full',
        resource: 'Auth',
        redirectIfLoggedIn: true,
      },
    },
    {
      path: '/auth/reset-password',
      name: 'auth-reset-password',
      component: () => import('@/views/auth/resetPassword.vue'),
      meta: {
        layout: 'full',
        resource: 'Auth',
        redirectIfLoggedIn: true,
      },
    },
    {
      path: '/not-found',
      name: 'error-404',
      component: () => import('@/views/error/Error404.vue'),
      meta: {
        layout: 'full',
        resource: 'Auth',
        action: 'read',
      },
    },
    {
      path: '/pages/miscellaneous/not-authorized',
      name: 'not-authorized',
      component: () => import('@/views/auth/NotAuthorized.vue'),
      meta: {
        layout: 'full',
        resource: 'Auth',
      },
    },
    ...artists,
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

router.beforeEach(async (to, _, next) => {
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'block'
    appLoading.style.zIndex = 999
  }
  const userData = await getUserData()
  if (to.meta.authRequired && !userData){
    return next({name: 'auth-login'})
  }

  if (to.name === 'auth-login' && userData){
    return next({path: '/'})
  }

  //todo : fix this after adding roles

  // if (userData && !userData.roles.includes('Administrator')){
    // if (to.meta.authRequired && to.meta.permission) {
    //   if (!userData.permissions || !userData.permissions.includes(to.meta.permission)) return next({ name: 'not-authorized' })
    // }
  // }

  return next()
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach((to, from) => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

export default router
