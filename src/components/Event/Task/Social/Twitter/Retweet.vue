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
          <img src="@/assets/images/blue-tick.svg" class="mr-2" />
          Verified
        </v-btn>
        <v-icon v-if="showExpand" color="white">mdi-close</v-icon>
      </div>
    </div>
    <div class="task__body" v-if="showExpand">
      <div class="task__input">
        <div class="task__submit mb-2">
          <v-btn
            class="base-btn"
            @click="handleTwitterLogin"
            :disabled="socialAccessToken || isTaskVerified"
          >
            <span v-if="socialAccessToken || isTaskVerified">Authorized</span>
            <span v-else>Authorize Twitter</span>
          </v-btn>
        </div>
        <v-text-field
          v-if="socialAccessToken"
          v-model="inputText"
          :placeholder="task.options.userInput.collectUrl.label"
          class="base-input"
          variant="outlined"
          hide-details="auto"
          bg-color="transparent"
          :disabled="isTaskVerified"
        ></v-text-field>
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

import { webAuth } from '@/composables/twitterAuth.ts'
import { useNotificationStore } from '@/store/notification.ts'

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
    //(result)
    inputText.value = result.proof.retweetUrl
  }
}

watch(
  () => socialAccessToken.value,
  (value: any) => {
    //(value)
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
      } else {
        isTaskVerified.value = false
        showExpand.value = true
      }
    }, 500)
  },
  { deep: true }
)

const handleTwitterLogin = () => {
  const url = `https://twitter.com/intent/tweet?text=${props.task.options.cta.visitUrl}`
  webAuth.popup.authorize(
    {
      connection: 'twitter',
      owp: true
    },
    (err, response) => {
      if (response) {
        socialAccessToken.value = response.accessToken
        window.open(url, '_blank')
      } else {
        //('Something went wrong')
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
      proof: {
        tweetUrl: props.task.options.proofConfig.proof.tweetUrl,
        retweetUrl: inputText.value
      }
    }
  })
}
</script>
