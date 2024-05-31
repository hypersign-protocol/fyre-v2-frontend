<template>
  <div class="task__wrap">
    <div class="task__top">
      <p class="text-red-100" v-if="task.isMandatory">Mandatory</p>
      <p class="text-green-100" v-if="!task.isMandatory">Optional</p>
    </div>
    <div class="task__header">
      <div class="task__title">
        <span>
          <img :src="getImage(task.type)" />
        </span>
        <span class="text text-white-100">{{ task.title }}</span>
        <span class="font-18 lh-20 font-weight--bold text-blue-100"> +{{ task.xp }}XP </span>
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
      <div class="task__input mb_2">
        <v-text-field
          v-if="isTaskVerified"
          v-model="inputText"
          :placeholder="task.proof.walletAddress"
          class="base-input"
          variant="outlined"
          hide-details="auto"
          bg-color="transparent"
          :disabled="isTaskVerified"
        ></v-text-field>
      </div>
      <div class="task__submit ">
        <v-btn class="mr-2" @click="connect" :loading="isCollecting" :disabled="walletConnected" v-if="!isTaskVerified">
          <span v-if="!walletConnected">Collect Wallet Address</span>
          <span v-if="walletConnected">Collected</span>
        </v-btn>
        <v-btn v-if="!isTaskVerified" @click="submit" :loading="loading" :disabled="isTaskVerified">Verify Task</v-btn>     
      </div>      
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useEventParticipantStore } from '@/store/eventParticipant.ts'
import { useNotificationStore } from '@/store/notification.ts'
import { storeToRefs } from 'pinia'
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { getUser, saveUser } from '@/composables/jwtService.ts'
import { getImage } from '@/composables/event.ts'
import { useAuthStore } from '@/store/auth.ts'

const emit = defineEmits(['enableWallet', 'removeFormData'])

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
  walletInfo: {
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
const isCollecting = ref(false)
const walletConnected = ref(false)
const isTaskVerified = ref(false)
const inputText = ref(null)

const store = useEventParticipantStore()
const notificationStore = useNotificationStore()
const { performResult } = storeToRefs(useEventParticipantStore())

watch(
  () => store.wallet_connect_error,
  (newVal, oldVal) => {
    if (newVal.taskId === props.task._id && newVal.status) {
      isCollecting.value = false
      walletConnected.value = false
      loading.value = false
      store.SET_WALLET_CONNECT_ERROR({
        status: false,
        message: '',
        taskId: null
      })
    }
  }
)

const user = computed(() => {
  return getUser()
})

onMounted(() => {
  fetchResult()
})

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

const fetchResult = () => {
  if (props.eventParticipants?.tasks?.hasOwnProperty(props.task?._id)) {
    isTaskVerified.value = true
    const result = props.eventParticipants?.tasks[props.task?._id]
    console.log(result)
    inputText.value = result.proof.walletAddress
  }
}

watch(
  () => props.walletInfo,
  (value: any) => {
    if (
      value.taskId === props.task._id &&
      value.walletAddress !== null &&
      value.signedDidDoc !== null
    ) {
      isCollecting.value = false
      walletConnected.value = true
    }
  },
  { deep: true }
)

watch(
  () => showExpand.value,
  (value) => {
    console.log(value)
  }
)

const connect = async (item) => {
  isCollecting.value = true
  emit('enableWallet', { network: 'evm', taskId: props.task._id })
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
      emit('removeFormData')
    }, 500)
  },
  { deep: true }
)

const submit = async () => {
  if (!props.walletInfo.walletAddress) {
    return notificationStore.SHOW_NOTIFICATION({
      show: true,
      type: 'error',
      message: 'Wallet is not connected for this task'
    })
  }

  if (!props.walletInfo.signedDidDoc) {
    return notificationStore.SHOW_NOTIFICATION({
      show: true,
      type: 'error',
      message: 'Wallet signature not found for this task'
    })
  }
  loading.value = true
  const resp = await store.PERFORM_EVENT_TASK({
    eventId: props.task.eventId,
    communityId: props.communityId,
    task: {
      id: props.task._id,
      proof: {
        walletAddress: props.walletInfo.walletAddress,
        signedDidDocument: props.walletInfo.signedDidDoc
      }
    }
  })

  if (!resp) {
    isCollecting.value = false
    walletConnected.value = false
  }
  loading.value = false
  emit('removeFormData');
}
</script>
