<template>
  <v-card class="event-card rounded-xl cursor-pointer" @click="viewEvent(eventData)">
    <v-img class="align-end text-white" height="200" :src="eventData.banner" cover> </v-img>
    <v-card-text class="card__body">
      <v-card-title class="pa-0 font-16">{{ eventData.eventName }}</v-card-title>
      <EventStatus class="font-12" :eventData="eventData" />
      <div class="d-flex align-center">
        <v-chip size="small" label class="orange--chip mr-2"> 10 EXP </v-chip>
        <v-chip size="small" label class="green--chip"> 500 USTD </v-chip>
      </div>
      <p class="my-2">{{ eventData.participantCount }} Participants</p>
      <div class="d-flex align-center mb-2">
        <v-chip class="tag__chip" size="x-small" v-for="(item, index) in eventData.tags">{{
          item
        }}</v-chip>
      </div>
    </v-card-text>
    <div class="card__footer">
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
    </div>
  </v-card>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'

const { eventData } = defineProps(['eventData'])
const viewEvent = (event) => {
  window.location.href = `/event/${eventData._id}`
}
</script>
