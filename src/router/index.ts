/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { isTokenExpired, isAuthRequired } from '@/utils/tokenCheck.ts'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  extendRoutes: setupLayouts,
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('accessToken');
  const authRequired = isAuthRequired(to.path);
  const tokenExpired = isTokenExpired(token);

  if (authRequired && tokenExpired) {
    localStorage.clear();
    next("/");
  } else if (!authRequired && tokenExpired) {
    localStorage.clear();
    next();
  } else {
    next();
  }
});


export default router
