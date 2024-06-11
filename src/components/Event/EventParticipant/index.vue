<!-- EventDescriptionDialog.vue -->

<template>
  <v-dialog class="fyre--modal" persistent>
    <v-card class="modal__card">
      <v-icon class="modal__close cursor-pointer" @click="$emit('close')">mdi-close</v-icon>
      <div class="modal__header">
        <p class="modal__title">Participants({{ leaderBoardList.length }})</p>
      </div>
      <div class="modal__body">
        <div
          class="d-flex align-center justify-space-between my-4"
          v-for="(item, index) in leaderBoardList"
          :key="index"
        >
          <div class="d-flex align-center">
            <v-avatar size="large" class="mr-2">
            <v-img :src="item.avatar" v-if="item.avatar"> </v-img>
            <v-img src="@/assets/images/avatar01.png" v-else> </v-img>
            </v-avatar>
            <p class="ml-2 font-22 font-weight-bold">{{ item.userName }}</p>
          </div>
        </div>
      </div>
    </v-card>
  </v-dialog>
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
