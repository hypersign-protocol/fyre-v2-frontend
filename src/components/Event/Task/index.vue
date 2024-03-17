<template>
  <component :task="task" :communityId="communityId" :is="checkComponent" class="mb-10" />
</template>
<script lang="ts" setup>
import { tasks as eventTasks } from '@/data/EventTasks.ts'
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
interface Task {
  _id: string
  type: string
  year: number
}

const props = defineProps<{
  task: Task
  communityId: string
}>()
const showExpand = ref(false)
const isTaskVerified = ref(false)
const componentName = ref(null)

// Split the string by underscores
const parts = props.task.type.split('_')

// Capitalize the first letter of each part and convert the rest to lowercase
const componentParts = parts.map(
  (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
)

// Join the parts with slashes
const formattedComp = componentParts.join('')

const checkComponent = computed(() => {
  const task = eventTasks.find((task) => task.type === props.task.type)
  if (task) {
    return task.path
  } else {
    console.error(`Task with type ${targetType} not found.`)
  }
})
</script>
