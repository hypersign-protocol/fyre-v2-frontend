<!-- Callback.vue -->
<template>
  <div>
    <p>Callback Page</p>
  </div>
</template>
<script lang="ts" setup>
  import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
const handleAuthorizationCode = () => {
  // Retrieve the authorization code from the current route query parameters
  const code = $route.query.code

  if (code) {
    console.log('Authorization Code:', code)
    // You can now use the authorization code as needed
    // For example, send it to your server to exchange it for an access token
  } else {
    console.error('Authorization code not found.')
  }
}

onMounted(() => {
  // Call a method to handle the authorization code retrieval
  handleAuthorizationCode()
})
</script>
