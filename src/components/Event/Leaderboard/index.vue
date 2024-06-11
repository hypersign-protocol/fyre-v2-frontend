<template>
  <template v-if="leaderBoardList.length > 0">
    <div class="d-flex align-center justify-space-between pa-5 mt-4">
      <p class="font-25 font-weight--bold">Live Leaderboard</p>
      <p class="font-16 font-weight--bold">
        <span class="text-blue-100">Total Participants </span>
        <span>{{ leaderBoardList.length }}</span>
      </p>
    </div>
    <v-card class="event-task--card">
      <div
        class="d-flex align-center justify-space-between bg-black-100 pa-2 rounded-10 mb-4"
        v-for="(item, index) in leaderBoardList"
        :key="index"
      >
        <div class="d-flex align-center">
          <div class="leader-slot">
            <img src="@/assets/images/crown-amber.svg" class="mr-2" v-if="index === 0" />
            <img src="@/assets/images/crown-silver.svg" class="mr-2" v-else-if="index === 1" />
            <img src="@/assets/images/crown-bronze.svg" class="mr-2" v-else-if="index === 2" />
            <img src="@/assets/images/crown-reg.svg" class="mr-2" v-else />
            <div class="number">{{ index + 1 }}</div>
          </div>
          <v-avatar size="large" class="mr-2">
            <v-img :src="item.avatar" v-if="item.avatar"> </v-img>
            <v-img src="@/assets/images/avatar01.png" v-else> </v-img>
          </v-avatar>
          <p class="ml-2 font-22 font-weight-bold">{{ item.userName }}</p>
        </div>
        <div class="d-flex align-center">
          <p class="font-22 font-weight-medium">{{ item.xp }} XP</p>
        </div>
      </div>
    </v-card>
  </template>
  <template v-else>
    <v-card height="200" class="event-task--card mt-5 d-flex align-center justify-center">
      <h3>No data found!</h3>
    </v-card>
  </template>
</template>
<script lang="ts" setup>
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useEventParticipantStore } from '@/store/eventParticipant.ts'
import { storeToRefs } from 'pinia'
import { getToken } from '@/composables/jwtService.ts'

const eventParticipantStore = useEventParticipantStore()
const { leaderBoard } = storeToRefs(useEventParticipantStore())

const leaderBoardList = ref([])

const token = computed(() => {
  return getToken()
})

const props = defineProps<{
  eventId: string
  communityId: string
}>()

const loading = ref(true)

onMounted(async () => {
  if (token.value) {
    loading.value = true
    fetchLeaderboard()
  }
})

watch(
  () => leaderBoard.value,
  (value: any) => {
    loading.value = false
    leaderBoardList.value = value.sort((a, b) => b.xp - a.xp)
  },
  { deep: true }
)

const fetchLeaderboard = async () => {
  await eventParticipantStore.GET_LEADER_BOARD(props.communityId, props.eventId, true)
}
</script>
