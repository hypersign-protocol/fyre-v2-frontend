<template>
  <template v-if="leaderBoard.length > 0">
    <div class="d-flex align-center justify-space-between pa-5 mt-4">
      <p class="font-25 font-weight--bold">Live Leaderboard</p>
      <p class="font-16 font-weight--bold">
        <span class="text-blue-100">Total Participants </span>
        <span>{{ leaderBoard.length }}</span>
      </p>
    </div>
    <v-card class="event-task--card">
      <div
        class="d-flex align-center justify-space-between bg-black-100 pa-2 rounded-10 mb-4"
        v-for="(item, index) in leaderBoard"
        :key="index"
      >
        <div class="d-flex align-center">
          <img src="@/assets/images/leader01.svg" class="mr-2" />
          <v-avatar size="large" class="mr-2">
            <v-img src="@/assets/images/avatar01.png"> </v-img>
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
  },
  { deep: true }
)

const fetchLeaderboard = async () => {
  await eventParticipantStore.GET_LEADER_BOARD(props.communityId, props.eventId, true)
}
</script>
