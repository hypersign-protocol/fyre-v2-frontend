<template>
  <div class="task__wrap">
    <div class="task__top">
      <p class="text-red-100" v-if="task.isMandatory">Mandatory</p>
      <p class="text-green-100" v-if="!task.isMandatory">Optional</p>
    </div>
    <div class="task__header">
      <div class="task__title">
        <span>
          <img src="@/assets/images/discord.png" />
        </span>
        <span class="font-18 lh-20 font-weight--regular text-white-100 text-capitalize">{{
          task.title
        }}</span>
        <span class="font-18 lh-20 font-weight--regular text-blue-100"> +{{ task.xp }}XP </span>
      </div>
      <div class="task__action" v-if="!isTaskVerified" @click="showExpand = !showExpand">
        <v-btn v-if="!showExpand">Verify Task(s)</v-btn>
        <v-icon v-if="showExpand" color="white">mdi-close</v-icon>
      </div>
      <div class="task__action" v-if="isTaskVerified">
        <v-btn variant="outlined">
          <img src="@/assets/images/blue-tick.svg" class="mr-2" />
          Verified</v-btn
        >
      </div>
    </div>
    <div class="task__body" v-if="showExpand && !isTaskVerified">
      <div class="task__submit">
        <v-btn @click="authenticateWithDiscord"> Join our Discord</v-btn>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useEventParticipantStore } from '@/store/eventParticipant.ts'
import { storeToRefs } from 'pinia'

interface Task {
  _id: string
  type: string
  year: number
}

const props = defineProps<{
  task: Task
  communityId: string
}>()
const showExpand = ref(false)
const isTaskVerified = ref(false)
const inputText = ref(null)
const store = useEventParticipantStore()
const { performResult } = storeToRefs(useEventParticipantStore())

watch(
  () => performResult.value,
  (value) => {
    console.log(performResult.value.tasks)
    if (performResult.value.tasks.hasOwnProperty(props.task._id)) {
      isTaskVerified.value = true
    } else {
      isTaskVerified.value = false
    }
  },
  { deep: true }
)

const authenticateWithDiscord = () => {
  const url =
    'https://discord.com/oauth2/authorize' +
    `?client_id=1212288490151346246` +
    '&redirect_uri=http://localhost:3000/callback' +
    '&response_type=code' +
    '&scope=identify' // Add additional scopes as needed

  const authWindow = window.open(url, '_blank', 'width=600,height=400')

  window.addEventListener('message', (event) => {
    if (event.origin === window.location.origin) {
      const { oauthToken, oauthVerifier } = event.data

      if (oauthToken && oauthVerifier) {
        authWindow.close()
        console.log('OAuth Token:', oauthToken)
        console.log('OAuth Verifier:', oauthVerifier)
      }
    }
  })
}

const performAction = async () => {
  await store.PERFORM_EVENT_TASK({
    eventId: props.task.eventId,
    communityId: props.communityId,
    task: {
      id: props.task._id,
      proof: {
        discordHandle: ''
      }
    }
  })
}
</script>
