<template>
  <span class="text-green-100">
    {{ liveTimeUntilEvent }}
  </span>
</template>
<script lang="ts" setup>
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
import { getTimeUntilEvent } from '@/composables/duration.ts'

const { eventDate } = defineProps(['eventDate'])
const intervalId = ref(null)

const liveTimeUntilEvent = ref(getTimeUntilEvent(eventDate))

const updateLiveTime = () => {
  liveTimeUntilEvent.value = getTimeUntilEvent(eventDate)
}

// Use onMounted to execute the code when the component is mounted
onMounted(() => {
  updateLiveTime()
  setInterval(updateLiveTime, 1000)
})

// Use onBeforeUnmount to clear the interval when the component is about to be unmounted
onBeforeUnmount(() => {
  clearInterval(intervalId)
})
</script>
