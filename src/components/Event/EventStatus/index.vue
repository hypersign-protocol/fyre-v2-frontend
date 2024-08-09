<template>
  <p class="my-2">
    <template v-if="!eventStarted && !eventInProgress">
      <span class="mr-2 text-white-100">Starts In:</span>
      <Duration :eventDate="eventData.startDate" />
    </template>
    <template v-if="eventStarted && eventInProgress">
      <span class="mr-2 text-white-100">Ends In:</span>
      <Duration :eventDate="eventData.endDate" />
    </template>
    <template v-if="eventStarted && !eventInProgress">
      <span class="text-red-100 mr-2">Event Over!</span>
    </template>
  </p>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { isEventHappening } from '@/composables/event.ts'

const { eventData } = defineProps(['eventData'])

const eventStarted = ref(false)
const eventInProgress = ref(false)

onMounted(() => {
  checkEventStarted()
})

const checkEventStarted = () => {
  const res = isEventHappening(eventData.startDate, eventData.endDate)
  eventStarted.value = res.eventStarted
  eventInProgress.value = res.eventInProgress
}
</script>
