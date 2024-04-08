<template>
  <div class="task__wrap">
    <div class="task__top">
      <p class="text-red-100" v-if="task.isMandatory">Mandatory</p>
      <p class="text-green-100" v-if="!task.isMandatory">Optional</p>
    </div>
    <div class="task__header">
      <div class="task__title">
        <span>
          <img src="@/assets/images/task/discord.svg" v-if="task.type === 'SOCIAL_DISCORD_JOIN'" />
          <img
            src="@/assets/images/task/telegram.svg"
            v-if="task.type === 'SOCIAL_TELEGRAM_JOIN'"
          />
        </span>
        <span class="text text-white-100 text-capitalize">{{ task.title }}</span>
        <span class="points text-blue-100"> +{{ task.xp }}XP </span>
      </div>
      <div class="task__action" v-if="!isTaskVerified" @click="showExpand = !showExpand">
        <v-btn v-if="!showExpand">Verify</v-btn>
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
        <v-btn @click="authenticateWithDiscord" class="mr-2"> Join our Discord</v-btn>
        <v-btn @click="performAction"> Verify</v-btn>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useEventParticipantStore } from '@/store/eventParticipant.ts'
import { storeToRefs } from 'pinia'
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'

import { webAuth } from '@/composables/twitterAuth.ts'

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

const socialAccessToken = ref(null)
const discordId = ref(null)
const discordUserName = ref(null)

watch(
  () => socialAccessToken.value,
  (value: any) => {
    console.log(value)
    getUserInfo()
  },
  { deep: true }
)

watch(
  () => discordId.value,
  (value: any) => {
    console.log(value)
  },
  { deep: true }
)

watch(
  () => performResult.value,
  (value: any) => {
    console.log(performResult.value.tasks)
    if (performResult.value.tasks.hasOwnProperty(props.task._id)) {
      isTaskVerified.value = true
    } else {
      isTaskVerified.value = false
    }
  },
  { deep: true }
)

const getUserInfo = () => {
  webAuth.client.userInfo(socialAccessToken.value, async (err, user) => {
    console.log(user)

    discordId.value = user.sub.split('|')[2]
    discordUserName.value = user.name
  })
}

const authenticateWithDiscord = () => {
  const url = `${props.task.options.cta.visitUrl}`
  webAuth.popup.authorize(
    {
      connection: 'discord',
      owp: true
    },
    (err, response) => {
      if (response) {
        socialAccessToken.value = response.accessToken
        window.open(url, '_blank')
      } else {
        console.log('Something went wrong')
      }
    }
  )
}

const performAction = async () => {
  await store.PERFORM_EVENT_TASK({
    socialToken: socialAccessToken.value,
    eventId: props.task.eventId,
    communityId: props.communityId,
    task: {
      id: props.task._id,
      ...props.task.options.proofConfig
    }
  })
}
</script>