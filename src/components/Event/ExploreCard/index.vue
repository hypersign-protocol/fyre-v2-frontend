<template>
  <v-card class="rounded-xl" @click="viewEvent(eventData)">
    <v-img class="align-end text-white" height="315" :src="eventData.banner" cover>
      <v-card color="rgb(2 2 2 / 92%)">
        <v-card-actions class="d-flex align-center justify-space-between pb-0">
          <div class="d-flex align-center">
            <v-avatar class="cursor-pointer mr-2">
              <v-img alt="John" :src="eventData.communityDetail?.avatar"></v-img>
            </v-avatar>
            <v-card-title class="pa-0 font-14 lh-16 text-white-100 mr-2">
              {{ eventData.communityDetail?.communityName }}</v-card-title
            >
            <img
              v-if="eventData.communityDetail?.hasDomainVerified"
              src="@/assets/images/verify.svg"
              height="16"
            />
          </div>
          <div class="d-flex align-center"></div>
        </v-card-actions>
        <v-card-text class="pt-2">
          <v-card-title class="pa-0 font-16 text-white-100">{{ eventData.eventName }}</v-card-title>
          <div class="d-flex align-center justify-space-between">
            <p class="my-2 text-orange-100">{{ eventData.participantCount }} Participants</p>
            <EventStatus class="font-12" :eventData="eventData" />
          </div>
          <div class="d-flex">
            <v-avatar size="20" class="mr-2">
              <v-img src="@/assets/images/gift.svg"></v-img>
            </v-avatar>
            <p class="text-white-100">500 USTD</p>
          </div>
        </v-card-text>
      </v-card>
    </v-img>
  </v-card>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { isEventHappening } from '@/composables/event.ts'

const { eventData } = defineProps(['eventData'])
const viewEvent = (event) => {
  window.location.href = `/event/${eventData._id}`
}

const isEventHappeningTrue = ref(true)

onMounted(() => {
  checkEventStarted()
})

const checkEventStarted = () => {
  if (isEventHappening(eventData.startDate, eventData.endDate)) {
    isEventHappeningTrue.value = true
  } else {
    isEventHappeningTrue.value = false
  }
}
</script>
