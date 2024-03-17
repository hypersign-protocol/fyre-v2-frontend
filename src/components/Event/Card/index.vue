<template>
  <v-card class="community-card rounded-xl cursor-pointer" @click="viewEvent(eventData)">
    <v-img class="align-end text-white" :src="eventData.banner" cover> </v-img>
    <v-card-text>
      <div>{{ eventData.eventName }}</div>
      <p class="my-2 font-12">
        {{ eventDurationMessage }}: {{ eventData.endDate }} {{ eventDataVal }}
        <Duration :eventDate="eventDataVal" />
      </p>
      <div class="d-flex align-center">
        <v-chip size="small" label class="orange--chip mr-2"> 10 EXP </v-chip>
        <v-chip size="small" label class="green--chip"> 500 USTD </v-chip>
      </div>
      <p class="my-2">{{ eventData.participantCount }} Participants</p>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <v-avatar class="cursor-pointer mr-2">
          <v-img alt="John" :src="eventData.communityDetail?.avatar"></v-img>
        </v-avatar>
        <p class="mr-2 font-14 lh-16">{{ eventData.communityDetail?.communityName }}</p>
        <img
          v-if="eventData.communityDetail?.hasDomainVerified"
          src="@/assets/images/verify.svg"
          height="16"
        />
      </div>
      <div class="d-flex align-center">
        <v-avatar size="small" class="cursor-pointer mr-2">
          <v-img alt="John" src="@/assets/images/verify-check.svg"></v-img>
        </v-avatar>
      </div>
    </v-card-actions>
  </v-card>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
const { eventData } = defineProps(['eventData'])
const viewEvent = (event) => {
  window.location.href = `/event/${eventData._id}`
}

const eventDataVal = ref(null)
const eventDurationMessage = ref(null)

onMounted(() => {
  checkEventStarted()
})

const checkEventStarted = () => {
  const startDate = new Date(eventData.startDate)
  const endDate = new Date(eventData.endDate)

  // Get the current date and time
  const currentDate = new Date()

  // Check if the event has started
  if (currentDate < startDate) {
    eventDataVal.value = eventData.startDate
    eventDurationMessage.value = `Starts In`
  } else if (currentDate >= startDate && currentDate <= endDate) {
    eventDataVal.value = eventData.endDate
    eventDurationMessage.value = `Ends In`
  } else {
    eventDataVal.value = null
    eventDurationMessage.value = 'OVER'
  }
}
</script>
