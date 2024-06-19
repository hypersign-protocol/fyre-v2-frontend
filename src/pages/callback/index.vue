<!-- Callback.vue -->
<template>
  <div>
    <p>Callback Page</p>
  </div>
</template>
<script lang="ts" setup>
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const handleAuthorizationCode = () => {
  let currentPathObject = router.currentRoute.value;
  const code = currentPathObject.query.code
  if (code) {
    console.log('gauth:indexvue:: Authorization Code:', code)
    window.opener.postMessage({ code }, window.location.origin);
    window.close()
  } else {
    console.error('Authorization code not found.')
  }
}

onMounted(() => {
  handleAuthorizationCode()
})
</script>
