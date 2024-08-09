/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { isTokenExpired, isAuthRequired } from '@/utils/tokenCheck.ts'
import { trackRouter, useGtag } from "vue-gtag-next";
const { event } = useGtag()

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  extendRoutes: setupLayouts,
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 }
  }
})

trackRouter(router);

router.beforeEach((to, from, next) => {

  //GA
  event('Router', {
    'event_category': 'Router',
    'event_label': to.path
  })
  const token = localStorage.getItem('accessToken')
  const authRequired = isAuthRequired(to.path)
  const tokenExpired = isTokenExpired(token)

  if (authRequired && tokenExpired) {
    localStorage.clear()
    next('/')
  } else if (!authRequired && tokenExpired) {
    localStorage.clear()
    next()
  } else {
    next()
  }
})

export default router