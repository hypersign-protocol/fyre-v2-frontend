<template>
  <v-card class="event-card rounded-xl cursor-pointer" @click="viewEvent(eventData)">
    <!-- <div class="overlay" v-if="checkEventEnded()"></div> -->
    <v-overlay
      :model-value="checkEventEnded()"
      class="align-center justify-center"
      scrim="grey"
      contained
    >
    </v-overlay>

    <div>
      <v-img class="align-end text-white" height="200" :src="eventData.banner" cover> </v-img>
      <v-card-text class="card__body">
        <v-card-title class="pa-0 font-16">{{ eventData.eventName }}</v-card-title>
        <EventStatus class="font-12" :eventData="eventData" />
        <div class="d-flex align-center">
          <v-chip size="small" label class="orange--chip mr-2">
            {{
              eventData.totalEventXp
                ? eventData.totalEventXp
                : eventDataComputed.totalEventXp
                  ? eventDataComputed.totalEventXp
                  : 0
            }}
            XP
          </v-chip>
          <v-chip
            size="small"
            label
            class="green--chip mr-2"
            v-if="getRewards(eventData).token.length > 0"
          >
            {{ numberToWords(Number(getRewards(eventData).token?.at(0)?.at(1))) }}
            {{ getRewards(eventData).token?.at(0)?.at(0) }}
          </v-chip>
          <v-chip
            size="small"
            label
            class="green--chip mr-2"
            v-if="getRewards(eventData).token.length > 1"
          >
            {{ numberToWords(Number(getRewards(eventData).token?.at(1)?.at(1))) }}
            {{ getRewards(eventData).token?.at(1)?.at(0) }}
          </v-chip>

          <v-chip
            size="small"
            label
            class="purple--chip mr-2"
            v-if="getRewards(eventData).nft.length > 0"
          >
            {{ numberToWords(Number(getRewards(eventData).nft?.at(0).at(1))) }}
            {{ getRewards(eventData).nft?.at(0).at(0) }}
          </v-chip>
          <v-chip
            size="small"
            label
            class="purple--chip mr-2"
            v-if="getRewards(eventData).nft.length > 1"
          >
            {{ numberToWords(Number(getRewards(eventData).nft?.at(1)?.at(1))) }}
            {{ getRewards(eventData).nft?.at(1).at(0) }}
          </v-chip>
        </div>
        <p class="my-2">
          {{
            eventData.participantCount
              ? eventData.participantCount
              : eventDataComputed.participantCount
                ? eventDataComputed.participantCount
                : 0
          }}
          Participants
        </p>
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
              <v-img alt="John" :src="eventData.communityDetail?eventData.communityDetail.avatar:eventDataComputed.communityDetail?.avatar"></v-img>
            </v-avatar>
            <p class="mr-2 font-14 lh-16">{{ eventData.communityDetail?.communityName }}</p>
            <img
              v-if="eventData.communityDetail?eventData.communityDetail.hasDomainVerified:eventDataComputed.communityDetail?.hasDomainVerified"
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
    </div>
  </v-card>
</template>
<script lang="ts" setup>
import { isEventHappening } from '@/composables/event'
import { getRewards } from '@/utils/calculateRewards'
import { numberToWords } from '@/utils/numberToWords'
import { useEventStore } from '@/store/event'
import { computed, onMounted, ref } from 'vue'

const { eventData } = defineProps(['eventData'])
const eventDataComputed = ref({})

const eventStore = useEventStore()
const viewEvent = (event: any) => {
  window.location.href = `/event/${eventData._id}`
}

const getActualEventData = async () => {  
  if (!(eventData.totalEventXp && eventData.participantCount && eventData.communityDetail)) {
    
    eventDataComputed.value = await eventStore.GET_EVENT_BY_ID_STORE_INDIPENDENT(eventData._id)

    return eventDataComputed
  } else return eventData
}

onMounted(getActualEventData)

const checkEventEnded = () => {
  const res = isEventHappening(eventData.startDate, eventData.endDate)
  return !res.eventInProgress ? true : false
}
</script>
