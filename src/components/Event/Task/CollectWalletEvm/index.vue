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
    <div class="task__body" v-if="showExpand && !isTaskVerified">
      <div class="task__input"></div>
      <div class="task__submit">
        <v-btn
          class="mr-2"
          @click="connectWallet"
          :loading="isCollecting"
          :disabled="isTaskVerified"
          >Collect Wallet Address</v-btn
        >
        <v-btn @click="submit" :loading="loading" :disabled="isTaskVerified">Verify Task</v-btn>
      </div>
    </div>
  </div>
  <BlockChainWallet
    :options="options"
    @getWalletAddress="collectWalletAddress"
    @getSignedData="collectSignedData"
  />
  <div id="emit-options" @click="emitOptions(options)"></div>
</template>
<script lang="ts" setup>
import { useEventParticipantStore } from '@/store/eventParticipant.ts'
import { useNotificationStore } from '@/store/notification.ts'
import { storeToRefs } from 'pinia'
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { getUser, saveUser } from '@/composables/jwtService.ts'
import { getImage } from '@/composables/event.ts'

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
const isCollecting = ref(false)
const isTaskVerified = ref(false)
const inputText = ref(null)

const store = useEventParticipantStore()
const notificationStore = useNotificationStore()
const { performResult } = storeToRefs(useEventParticipantStore())

const wAddress = ref(null)
const sProof = ref(null)

const formData = reactive({
  walletAddress: null,
  signedDidDoc: null
})

const user = computed(() => {
  return getUser()
})

const checkIfUserLogged = () => {
  if (props.token) {
    showExpand = !showExpand
  } else {
    notificationStore.SHOW_NOTIFICATION({
      show: true,
      type: 'error',
      message: 'Please login to perform action'
    })
  }
}

const options = reactive({
  showBwModal: false,
  providers: ['evm'],
  chains: [''],
  isRequiredDID: false,
  isPerformAction: true,
  didDocument: user.value.didDocument,
  addVerificationMethod: true
})

const collectWalletAddress = async (data) => {
  formData.walletAddress = data
}

const collectSignedData = async (data) => {
  formData.walletAddress = data.walletAddress
  formData.signedDidDoc = data.signProof
  isCollecting.value = false
}

onMounted(() => {
  fetchResult()
})

const fetchResult = () => {
  if (props.eventParticipants?.tasks?.hasOwnProperty(props.task?._id)) {
    isTaskVerified.value = true
    const result = props.eventParticipants?.tasks[props.task?._id]
    console.log(result)
    inputText.value = result.proof.retweetUrl
  }
}

const connectWallet = async (item) => {
  options.chains = ['Etherem']
  isCollecting.value = true
  setTimeout(async () => {
    document.getElementById('emit-options').click()
  }, 100)
}

watch(
  () => performResult.value,
  (value: any) => {
    console.log(performResult.value.tasks)
    loading.value = false
    if (performResult.value.tasks.hasOwnProperty(props.task._id)) {
      isTaskVerified.value = true
    } else {
      isTaskVerified.value = false
    }
  },
  { deep: true }
)

const submit = async () => {
  console.log(formData)
  console.log(formData.walletAddress)
  console.log(formData.signedDidDoc)
  loading.value = true
  await store.PERFORM_EVENT_TASK({
    eventId: props.task.eventId,
    communityId: props.communityId,
    task: {
      id: props.task._id,
      proof: {
        walletAddress: formData.walletAddress,
        signedDidDocument: formData.signedDidDoc
      }
    }
  })
}
</script>
