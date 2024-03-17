<template>
  <template v-for="(item, index) in eventTasks">
    <component
      :task="task"
      :communityId="communityId"
      :is="item.path"
      v-if="checkComponent(item)"
    />
  </template>
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

// Split the string by underscores
const parts = props.task.type.split('_')

// Capitalize the first letter of each part and convert the rest to lowercase
const componentParts = parts.map(
  (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
)

// Join the parts with slashes
const formattedComp = componentParts.join('')

const checkComponent = (item) => {
  return item.type === formattedComp ? true : false
}
</script>
