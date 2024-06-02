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
          <v-icon>mdi-check</v-icon>
          Verified
        </v-btn>
        <v-icon v-if="showExpand" color="white">mdi-close</v-icon>
      </div>
    </div>
    <div class="task__body" v-if="showExpand && !isTaskVerified">
      <div class="task__submit">
        <v-btn
          v-if="!tgUserID"
          class="base-btn"
          @click="authenticate"
          :disabled="tgUserID || isTaskVerified"
        >
          <span v-if="isTaskVerified">{{ task.proof.tgGroupId }}</span>
          <span v-if="!isTaskVerified"
            >Authorize Telegram</span
          >
        </v-btn>
        <v-btn v-if="tgUserID && !redirected" class="base-btn" @click="visitTelegramChannel">
          <span>Join Telegram  {{ task.options.proofConfig.proof.tgGroupId }} </span>
        </v-btn>
      </div>
      <div class="task__submit">
        <v-btn
          :loading="loading"
          @click="performAction"
          v-if="tgUserID && !isTaskVerified && showVerifyBtn"
        >
          Verify</v-btn
        >
      </div>
    </div>
    <div class="task__body" v-if="showExpand && isTaskVerified">
      <div class="task__submit">
        <v-btn class="base-btn" :disabled="tgUserID || isTaskVerified">
          <span v-if="isTaskVerified"
            >Joined Telegram {{ task.options.proofConfig.proof.tgGroupId }}
          </span>
        </v-btn>
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
const tgUserID = ref(null)
const showVerifyBtn = ref(false)
const store = useEventParticipantStore()
const { performResult } = storeToRefs(useEventParticipantStore())
const redirected=ref(false)
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

const visitTelegramChannel = () => {
  const url = `https://telegram.me/${props.task.options.cta.visitUrl}`
  try {
    window.open(url, '_blank')
    redirected.value=true
    showVerifyBtn.value = true
  } catch (error) {
    console.log(error)
  }
}
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

const authenticate = () => {
  window.Telegram.Login.auth(
    { bot_id: import.meta.env.VITE_APP_TELEGRAM_BOT_ID, request_access: true },
    (data) => {
      console.log(data)
      if (data) {
        tgUserID.value = data.id
      } else {
        console.log('Telegram not authorized')
      }
    }
  )
}

const performAction = async () => {
  loading.value = true
  await store.PERFORM_EVENT_TASK({
    eventId: props.task.eventId,
    communityId: props.communityId,
    task: {
      id: props.task._id,
      proof: {
        tgUserID: tgUserID.value,
        tgGroupId: props.task.options.proofConfig.proof.tgGroupId
      }
    }
  })
  loading.value = false
}
</script>
