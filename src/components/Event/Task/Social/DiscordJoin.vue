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
      <div class="task__action" @click="checkIfUserLogged">
        <v-btn v-if="!showExpand && !isTaskVerified"> Verify </v-btn>
        <v-btn variant="outlined" v-else-if="!showExpand && isTaskVerified">
          <img src="@/assets/images/blue-tick.svg" class="mr-2" />
          Verified
        </v-btn>
        <v-icon v-if="showExpand" color="white">mdi-close</v-icon>
      </div>
    </div>
    <div class="task__body" v-if="showExpand">
      <div class="task__submit">
        <v-btn
          class="base-btn"
          @click="authenticateWithDiscord"
          :disabled="socialAccessToken || isTaskVerified"
        >
          <span v-if="socialAccessToken || isTaskVerified">Joined</span>
          <span v-else>Join our Discord</span>
        </v-btn>
      </div>
      <div class="task__submit">
        <v-btn
          :loading="loading"
          @click="performAction"
          v-if="socialAccessToken && !isTaskVerified"
        >
          Verify</v-btn
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useEventParticipantStore } from '@/store/eventParticipant.ts'
import { storeToRefs } from 'pinia'
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useNotificationStore } from '@/store/notification.ts'
import { webAuth } from '@/composables/twitterAuth.ts'

const props = defineProps({
  communityId: { type: String, required: true },
  token: { type: String, required: true },
  task: {
    type: Object,
    required: true,
    default() {
      return {}
    }
  },
  eventParticipants: {
    type: Object,
    required: true,
    default() {
      return {}
    }
  }
})
const showExpand = ref(false)
const loading = ref(false)
const isTaskVerified = ref(false)
const inputText = ref(null)
const store = useEventParticipantStore()
const { performResult } = storeToRefs(useEventParticipantStore())

const socialAccessToken = ref(null)
const discordId = ref(null)
const discordUserName = ref(null)

const notificationStore = useNotificationStore()

const checkIfUserLogged = () => {
  if (props.token) {
    showExpand.value = !showExpand.value
  } else {
    notificationStore.SHOW_NOTIFICATION({
      show: true,
      type: 'error',
      message: 'Please login to perform action'
    })
  }
}

onMounted(() => {
  fetchResult()
})

const fetchResult = () => {
  if (props.eventParticipants?.tasks?.hasOwnProperty(props.task?._id)) {
    isTaskVerified.value = true
    const result = props.eventParticipants?.tasks[props.task?._id]
    console.log(result)
    inputText.value = result.proof.retweetUrl
  }
}

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
    setTimeout(() => {
      loading.value = false
      if (performResult.value.tasks.hasOwnProperty(props.task._id)) {
        isTaskVerified.value = true
        showExpand.value = false
      }
    }, 500)
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
  loading.value = true
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
