<template>
  <div class="task__wrap">
    <div class="task__top">
      <p class="text-red-100" v-if="task.isMandatory">Mandatory</p>
      <p class="text-green-100" v-if="!task.isMandatory">Optional</p>
    </div>
    <div class="task__header">
      <div class="task__title">
        <span class="text text-white-100">{{ task.title }}</span>
        <span class="points text-blue-100"> +{{ task.xp }}XP </span>
      </div>
      <div class="task__action">
        <v-btn v-if="!showExpand && !isTaskVerified" @click="checkIfUserLogged()">Verify</v-btn>
        <v-btn variant="outlined" v-if="isTaskVerified">
          <img src="@/assets/images/blue-tick.svg" class="mr-2" />
          Verified</v-btn>
        <v-icon v-if="showExpand" class="cursor-pointer" color="white">mdi-close</v-icon>
      </div>
    </div>
    <div class="task__body" v-if="showExpand">
      <div class="task__input">
        <v-text-field class="rounded-xl" variant="outlined" hide-details="auto" bg-color="transparent"
          v-model="inputText" :placeholder="task.options.userInput?.collectUrl.label"
          :disabled="isTaskVerified || eventParticipants?.tasks?.hasOwnProperty(task._id)"></v-text-field>
      </div>
      <div class="task__submit" v-if="!isTaskVerified">
        <v-btn @click="performAction">Verify</v-btn>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useEventParticipantStore } from '@/store/eventParticipant.ts'
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/store/notification.ts'

import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
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
const isTaskVerified = ref(false)
const inputText = ref(null)
const store = useEventParticipantStore()
const { performResult } = storeToRefs(useEventParticipantStore())
const notificationStore = useNotificationStore()

watch(
  () => performResult.value,
  (value: any) => {
    if (performResult.value.tasks.hasOwnProperty(props.task._id)) {
      isTaskVerified.value = true
    } else {
      isTaskVerified.value = false
    }
  },
  { deep: true }
)

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


const performAction = async () => {
  await store.PERFORM_EVENT_TASK({
    eventId: props.task.eventId,
    communityId: '65e43eca9a3b5d2bd597e43b',
    task: {
      id: props.task._id,
      proof: {
        userUrlInput: inputText.value
      }
    }
  })
}
</script>
