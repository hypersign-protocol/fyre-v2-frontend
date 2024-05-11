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
import { capitalize } from '@/composables/general.ts'
import { storeToRefs } from 'pinia'
const store = useNotificationStore()
const { response } = storeToRefs(useNotificationStore())

import { ElNotification } from 'element-plus'

watch(
  () => store.response,
  (value: any) => {
    console.log(value)
    notify()
  },
  { deep: true }
)

const notify = () => {
  ElNotification({
    title: `${capitalize(store.response.type)}`,
    message: `${store.response.message}`,
    type: `${store.response.type}`
  })
}
</script>
