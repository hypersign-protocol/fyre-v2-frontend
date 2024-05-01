<template>
  <!-- <p class="text-right">{{ task.type }}</p> -->
  <component
    :task="task"
    :communityId="communityId"
    :is="checkComponent"
    :eventParticipants="eventParticipants"
    class="mb-10"
  />
</template>
<script lang="ts" setup>
import { tasks as eventTasks } from '@/data/event/Actions.ts'
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
const props = defineProps({
  communityId: { type: String, required: true },
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
const componentName = ref(null)

const getPathWhereActionExists = (actionToCheck) => {
  const foundObject = eventTasks.find((obj) => obj.types.includes(actionToCheck))
  return foundObject
}

const checkComponent = computed(() => {
  const task = getPathWhereActionExists(props.task.type)
  if (task) {
    return task.path
  } else {
    console.error(`Task with type not found.`)
  }
})
</script>
