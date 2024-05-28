<template>
  <!-- <p class="text-right">{{ task.type }}</p> -->
  <component :task="task" :token="token" :communityId="communityId" :is="checkComponent"
    :eventParticipants="eventParticipants" v-if="checkComponent" class="mb-10" @enableWallet="connectWallet"
    @removeFormData="emit('removeFormData')" />
</template>
<script lang="ts" setup>
import { tasks as eventTasks } from '@/data/event/Actions.ts'
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useAuthStore } from '@/store/auth.ts'
import { storeToRefs } from 'pinia'

const emit = defineEmits(['emitShowWallet', 'removeFormData'])

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
const showWalletPopup = ref(false)
const isTaskVerified = ref(false)
const componentName = ref(null)

const authStore = useAuthStore()
const { userMeta } = storeToRefs(useAuthStore())

const connectWallet = async (data) => {
  emit('emitShowWallet', data)
}

const getPathWhereActionExists = (actionToCheck) => {
  const foundObject = eventTasks.find((obj) => obj.types.includes(actionToCheck))
  return foundObject
}

const checkComponent = computed(() => {
  const task = getPathWhereActionExists(props.task.type)
  if (task) {
    return task.path
  } else {
    return null
  }
})
</script>
