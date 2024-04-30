/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  extendRoutes: setupLayouts,
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 }
  }
})

// Define a function to check if the user is authenticated
function isAuthenticated(): boolean {
  const token = localStorage.getItem('accessToken')
  return !!token
}

// Define a function to check if auth required
function isAuthRequired(routeName): boolean {
  if (
    routeName === '/' ||
    routeName === '/explore' ||
    routeName === '/rewards' ||
    routeName.startsWith('/community/') ||
    routeName.startsWith('/event/')
  ) {
    return false
  }
  return true
}

router.beforeEach((to, from, next) => {
  console.log(to.path)
  if (isAuthRequired(to.path) && !isAuthenticated()) {
    next('/')
  } else {
    next()
  }
})

export default router
