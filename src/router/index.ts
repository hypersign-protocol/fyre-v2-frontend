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
  console.log(to.path);
  if (
    (to.path !== "/" && to.path !== "/explore" && !to.path.startsWith("/event/")) &&
    !isAuthenticated()
  ) {
    // If the route is neither '/', '/explore', nor starts with '/event/' and user is not authenticated, redirect to '/'
    next("/");
  } else {
    // Otherwise, allow navigation
    next();
  }
});



export default router
