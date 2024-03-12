<template>
  <div class="task__wrap">
    <div class="task__top">
      <p class="text-red-100" v-if="task.isMandatory">Mandatory</p>
      <p class="text-green-100" v-if="!task.isMandatory">Optional</p>
    </div>
    <div class="task__header">
      <div class="task__title">
        <span class="font-18 lh-20 font-weight--regular text-white-100">{{ task.title }}</span>
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
      <div class="task__input text-center">
        <v-btn :href="task.options.cta.visitUrl" target="_blank" @click="performAction"
          >Collect Url</v-btn
        >
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

const performAction = async () => {
  await store.PERFORM_EVENT_TASK({
    eventId: props.task.eventId,
    communityId: '65e43eca9a3b5d2bd597e43b',
    task: {
      id: props.task._id,
      proof: true
    }
  })
}
</script>
