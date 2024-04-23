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

router.beforeEach((to, from, next) => {
  if (to.path === 'rewards' && !isAuthenticated()) {
    console.log('hhhh')
  } else {
    next()
  }
})

export default router
