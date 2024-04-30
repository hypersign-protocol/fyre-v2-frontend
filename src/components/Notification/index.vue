<template></template>
<script lang="ts" setup>
import {
  defineComponent,
  ref,
  shallowRef,
  onMounted,
  onBeforeUnmount,
  computed,
  watch,
  defineAsyncComponent
} from 'vue'

import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import { useNotificationStore } from '@/store/notification.ts'
import { storeToRefs } from 'pinia'
const store = useNotificationStore()
const { response } = storeToRefs(useNotificationStore())
const snackbar = ref(true)

watch(
  () => store.response,
  (value: any) => {
    console.log(value)
    notify()
  },
  { deep: true }
)

const notify = () => {
  toast(`${store.response.message}`, {
    theme: 'dark',
    type: `${store.response.type}`,
    transition: 'bounce',
    closeOnClick: true,
    autoClose: true,
    position: toast.POSITION.TOP_RIGHT
  })
}
</script>
