<template>
  <div class="task__wrap">
    <div class="task__top">
      <p class="text-red-100" v-if="task.isMandatory">Mandatory</p>
      <p class="text-green-100" v-if="!task.isMandatory">Optional</p>
    </div>
    <div class="task__header">
      <div class="task__title">
        <span>
          <img src="@/assets/images/task/quize.png" />
        </span>
        <span class="text text-white-100">{{ task.title }}</span>
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
        <v-container fluid v-if="task.options.isMultipleChoice">
          <v-checkbox @change="check($event)" :label="eachOption" v-for="eachOption in task.options.quizOptions"
            hide-details :value="eachOption" v-model="checkedBoxes" :disabled="isTaskVerified"></v-checkbox>
        </v-container>

        <v-radio-group v-if="!task.options.isMultipleChoice" v-model="radioAnswer" :disabled="isTaskVerified">
          <v-radio :label="eachOption" :value="eachOption" v-for="eachOption in task.options.quizOptions"></v-radio>
        </v-radio-group>
      </div>

      <div class="task__submit" v-if="!isTaskVerified">
        <v-btn :loading="loading" @click="performAction" v-if="!isTaskVerified">Verify</v-btn>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useEventParticipantStore } from '@/store/eventParticipant.ts'
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/store/notification.ts'
import { capitalize } from '@/composables/general.ts'
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

const loading = ref(false)
const showExpand = ref(false)
const isTaskVerified = ref(false)
const inputText = ref(null)
const radioAnswer = ref("")
const checkedBoxes = ref([])
const store = useEventParticipantStore()
const { performResult } = storeToRefs(useEventParticipantStore())

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

    if (!props.task.options.isMultipleChoice) {
      radioAnswer.value = result.proof.quizAnswer[0]
    } else {
      checkedBoxes.value = result.proof.quizAnswer
    }

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


const check = (event: any) => {
  const label = event.target.ariaLabel
  const index = props.task.options.proofConfig.proof.quizAnswer.indexOf(label);
  if (event.target.checked == true) {
    if (index < 0) {
      props.task.options.proofConfig.proof.quizAnswer.push(label)
    }
  } else {
    if (index > -1) {
      props.task.options.proofConfig.proof.quizAnswer.splice(index, 1);
    }
  }
}

const performAction = async () => {
  // remove all empty string
  {
    props.task.options.proofConfig.proof.quizAnswer = props.task.options.proofConfig.proof.quizAnswer.filter((x: string) => x != '')
  }

  if (!props.task.options.isMultipleChoice) {
    if (!radioAnswer.value) {
      notificationStore.SHOW_NOTIFICATION({
        show: true,
        type: 'error',
        message: 'Please choose one option'
      })
      return
    }
    props.task.options.proofConfig.proof.quizAnswer.push(radioAnswer.value)
  } else {
    if (props.task.options.proofConfig.proof.quizAnswer.length <= 0) {
      notificationStore.SHOW_NOTIFICATION({
        show: true,
        type: 'error',
        message: 'Please check one or more option'
      })
      return
    }
  }

  loading.value = true
  await store.PERFORM_EVENT_TASK({
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
