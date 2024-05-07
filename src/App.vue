<template>
  <v-app>
    <router-view />
    <Notification />
  </v-app>
</template>

<script lang="ts" setup>
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { getToken } from '@/composables/jwtService.ts'
const router = useRouter()
const token = ref(getToken())
const route = useRoute()


onMounted(() => {
  checkTokenExpiry()
})

watch(token, (newValue, oldValue) => {
  checkTokenExpiry()
})

const checkTokenExpiry = () => {
  if (route.path !== '/') {
    const expiry = (JSON.parse(atob(token.value.split('.')[1]))).exp;
    const isExpired =  (Math.floor((new Date()).getTime() / 1000)) >= expiry;
    console.log(isExpired)
    if (isExpired) {
      window.location.href = "/"
    } else {
      router.push(to); 
    }
  }
}
</script>
<style lang="scss" scoped></style>
