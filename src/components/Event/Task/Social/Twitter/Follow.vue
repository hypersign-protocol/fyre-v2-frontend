<template>
  <div class="task__wrap">
    <div class="task__top">
      <p class="text-red-100" v-if="task.isMandatory">Mandatory</p>
      <p class="text-green-100" v-if="!task.isMandatory">Optional</p>
    </div>
    <div class="task__header">
      <div class="task__title">
        <span>
          <img src="@/assets/images/task/twitter.svg" />
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
    <div class="task__body" v-if="showExpand">
      <div class="task__submit">
        <v-btn
          @click="handleTwitterLogin"
          :disabled="isTaskVerified"
          v-if="!socialAccessToken && !isTaskVerified"
        >
          <span v-if="!isTaskVerified">Authorize Twitter / X</span>
        </v-btn>
        <v-btn
          @click="redirectToTwitterFollowPage"
          :disabled="isTaskVerified"
          v-if="socialAccessToken && !redirected"
        >
          <span v-if="!isTaskVerified">Follow @{{ task.options.cta.visitUrl }}</span>
        </v-btn>
        <v-btn v-if="redirected && !isTaskVerified " @click="performAction" :disabled="isTaskVerified">
          <span v-if="!isTaskVerified">Verify</span>
        </v-btn>
        <v-btn
          v-if="isTaskVerified"
          @click="performAction"
          :disabled="isTaskVerified"
        >
          <span v-if="isTaskVerified"
            >Followed @{{ props.task.options.proofConfig.proof.twitterHandle }}</span
          >
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
const redirected = ref(false)
const showExpand = ref(false)
const loading = ref(false)
const isTaskVerified = ref(false)
const inputText = ref(null)
const store = useEventParticipantStore()
const { performResult } = storeToRefs(useEventParticipantStore())

const socialAccessToken = ref(null)
console.log(props)

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
    inputText.value = result.proof
  }
}

console.log(inputText)

watch(
  () => socialAccessToken.value,
  (value: any) => {
    console.log(value)
    // performAction()
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

const handleTwitterLogin = () => {
  webAuth.popup.authorize(
    {
      connection: 'twitter',
      owp: true
    },
    (err, response) => {
      if (response) {
        socialAccessToken.value = response.accessToken
      } else {
        console.log('Something went wrong')
      }
    }
  )
}

const redirectToTwitterFollowPage = () => {
  const handle = props.task.options.proofConfig.proof.twitterHandle
  const url = 'https://x.com/intent/user?screen_name=' + handle
  window.open(url, '_blank')
  redirected.value = true
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
  loading.value = false
}
</script>
