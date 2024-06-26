<template>
  <div class="task__wrap">
    <div class="task__top">
      <p class="text-red-100" v-if="task.isMandatory">Mandatory</p>
      <p class="text-green-100" v-if="!task.isMandatory">Optional</p>
    </div>
    <div class="task__header">
      <div class="task__title">
        <span>
          <img src="@/assets/images/task/github.svg" />
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
      <div class="task__input">
        <div class="task__submit mb-2">
          <v-btn
            v-if="!socialAccessToken && !isTaskVerified && !redirected"
            class="base-btn"
            @click="handleTwitterLogin"
            :disabled="isTaskVerified"
          >
            <span 
              >Authorize Github
            </span>
          </v-btn>
          <v-btn
            v-if="!isTaskVerified && socialAccessToken && !redirected"
            class="base-btn"
            @click="handleTwitterLogin"
            :disabled="isTaskVerified"
          >
            <span v-if="socialAccessToken" style="text-transform: none">Provide Pull Request</span>
         
          </v-btn>
        </div>
        <v-text-field
          v-if="redirected || isTaskVerified"
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
          v-if="socialAccessToken && !isTaskVerified && redirected"
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
import Url from '../../CollectInput/Url.vue'

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

watch(
  () => socialAccessToken.value,
  (value: any) => {
    console.log(value)
  },
  { deep: true }
)

onMounted(() => {
  fetchResult()
})

const fetchResult = () => {
  if (props.eventParticipants?.tasks?.hasOwnProperty(props.task?._id)) {
    isTaskVerified.value = true
    const result = props.eventParticipants?.tasks[props.task?._id]
    inputText.value = result.proof.githubPrUrl
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

const findGithubOrgs = (url: string) => {
  const orgsplit = url?.split('github.com')[1]

  const secondSplit = orgsplit.split('/')[1]

  return secondSplit
}

const handleTwitterLogin = () => {
  if (!socialAccessToken.value) {
    webAuth.popup.authorize(
      {
        connection: 'github',
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
  } else {
    window.open(props.task?.options?.proofConfig?.proof?.repoUrl + '/pulls', '_blank')
    redirected.value = true
  }
}

const checkGithubPrUrl = (url: string) => {
  try {
    new URL(url)
    const regex = /https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/pull\/\d+/

    if (!regex.test(url)) {
      throw new Error('Regx not matched')
    }
    return true
  } catch (e) {
    return false
  }
}

const performAction = async () => {
  if (!inputText.value) {
    notificationStore.SHOW_NOTIFICATION({
      show: true,
      type: 'error',
      message: 'Please provide Github PR Url'
    })
    return
  }
  if (!checkGithubPrUrl(inputText.value)) {
    notificationStore.SHOW_NOTIFICATION({
      show: true,
      type: 'error',
      message: 'Please provide Github PR Url'
    })
    return
  }
  loading.value = true
  await store.PERFORM_EVENT_TASK({
    socialToken: socialAccessToken.value,
    eventId: props.task.eventId,
    communityId: props.communityId,
    task: {
      id: props.task._id,
      proof: {
        repoUrl: props.task.options.proofConfig.proof.repoUrl,
        githubPrUrl: inputText.value
      }
    }
  })

  loading.value = false
}
</script>
: any: { accessToken: null }: string
