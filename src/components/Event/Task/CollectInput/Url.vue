<template>
  <div class="task__wrap">
    <div class="task__top">
      <p class="text-red-100" v-if="task.isMandatory">Mandatory</p>
      <p class="text-green-100" v-if="!task.isMandatory">Optional</p>
    </div>
    <div class="task__header">
      <div class="task__title">
        <div class="title--div">
        <span>
          <img src="@/assets/images/task/collect-url.png" />
        </span>
        <span class="text text-white-100">{{ task.title }}</span>
        </div>
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
        <v-text-field
          class="base-input"
          variant="outlined"
          hide-details="auto"
          bg-color="transparent"
          v-model="inputText"
          :placeholder="task.options.userInput.collectUrl.label"
          :disabled="isTaskVerified"
        ></v-text-field>
      </div>
      <div class="task__submit" v-if="!isTaskVerified">
        <v-btn :loading="loading" @click="performAction" v-if="!isTaskVerified" :disabled="!token"
          >Verify</v-btn
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
const notificationStore = useNotificationStore()
const { performResult } = storeToRefs(useEventParticipantStore())

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
    inputText.value = result.proof.userUrlInput
  }
}

watch(
  () => performResult.value,
  (value: any) => {
    loading.value = false
    if (performResult.value.tasks.hasOwnProperty(props.task._id)) {
      isTaskVerified.value = true
      showExpand.value = false
    } else {
      isTaskVerified.value = false
      showExpand.value = true
    }
  },
  { deep: true }
)

const performAction = async () => {
  loading.value = true

  let referrer = null
  let params = new URLSearchParams(window.location.search);
  let refValue = params.get('ref');
  if (refValue !== null) {
      referrer = refValue
  } 

  await store.PERFORM_EVENT_TASK({
    eventId: props.task.eventId,
    communityId: props.communityId,
    referrer: referrer,
    task: {
      id: props.task._id,
      proof: {
        userUrlInput: inputText.value
      }
    }
  })
}
</script>
