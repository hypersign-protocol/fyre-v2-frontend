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
      <div class="task__action">
        <v-btn v-if="!showExpand && !isTaskVerified" @click="checkIfUserLogged"> Verify </v-btn>
        <v-btn variant="outlined" v-else-if="!showExpand && isTaskVerified">
          <v-icon>mdi-check</v-icon>
          Verified
        </v-btn>
        <v-icon v-if="showExpand" color="white" @click="makeshowExpandFalse">mdi-close</v-icon>
      </div>
    </div>
    <div class="task__body" v-if="showExpand && !isTaskVerified">
      <div class="task__input">
        <div id='div_iframe'>
          <iframe id='frame' scrolling="no" frameborder="0" border="0" cellspacing="0" :src='pool_url'
            style="pointer-events: none;"></iframe>
        </div>
      </div>
      <div class="task__submit">
        <v-btn @click="redirectToOsmosisTrade()" :loading="loading" :disabled="isTaskVerified" v-if="!redirected">Start
          Trading</v-btn>
        <div v-else>
          <v-btn class="mr-2" @click="connect" :loading="isCollecting" :disabled="walletConnected">
            <span v-if="!walletConnected">Connect Wallet</span>
            <span v-if="walletConnected">Connected</span>
          </v-btn>
          <v-btn @click="submit" :loading="loading" :disabled="isTaskVerified">Verify Task</v-btn>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
// document.getElementById('div_iframe').scrollTop = 1670

import { useEventParticipantStore } from '@/store/eventParticipant.ts'
import { storeToRefs } from 'pinia'
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useNotificationStore } from '@/store/notification.ts'
import { getImage } from '@/composables/event.ts'
import { getUser, saveUser } from '@/composables/jwtService.ts'



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
const poolData = ref(null)
const redirected = ref(false)


const ibcToken0DenomRef = ref(null)
const ibcToken1DenomRef = ref(null)
const store = useEventParticipantStore()
const notificationStore = useNotificationStore()
const { performResult } = storeToRefs(useEventParticipantStore())
const pool_url = ref("")

const emit = defineEmits(['enableWallet', 'removeFormData'])

const user = computed(() => {
  return getUser()
})

onMounted(async () => {
  fetchResult()
  setTimeout(()=>{
    ibcDenomTrace()
  },4000)
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

const makeshowExpandFalse = () => { showExpand.value = false } 

const getPoolInfo = async () => {
  const data = await store.FETCH_POOL_ID(props.task.options.proofConfig.proof.poolId)
  const pool = data.pool
  return pool
}


const ibcDenomTrace = async () => {
  const pool = await getPoolInfo();
  const token0 = await store.PERFORM_IBCDENOM_TRACE(pool.token0)
  ibcToken0DenomRef.value = token0.denom_trace.base_denom.substr(1, token0.denom_trace.base_denom.length).toUpperCase()

  const token1 = await store.PERFORM_IBCDENOM_TRACE(pool.token1)
  ibcToken1DenomRef.value = token1.denom_trace.base_denom.substr(1, token1.denom_trace.base_denom.length).toUpperCase()


  pool_url.value = `https://app.osmosis.zone/?from=${ibcToken1DenomRef.value}&to=${ibcToken0DenomRef.value}`
  console.log(pool_url.value)
}

const redirectToOsmosisTrade = () => {
  // const url = 'https://app.osmosis.zone/?from=ATOM&to=OSMO'
  window.open(pool_url.value, '_blank')
  redirected.value = true
}

const fetchResult = () => {
  if (props.eventParticipants?.tasks?.hasOwnProperty(props.task?._id)) {
    isTaskVerified.value = true
    const result = props.eventParticipants?.tasks[props.task?._id]
    inputText.value = result.proof.retweetUrl
  }
}

watch(
  () => props.walletInfo,
  (value: any) => {
    console.log(value)

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
// https://lcd.osmosis.zone/ibc/apps/transfer/v1/denom_traces/498A0751C798A0D9A389AA3691123DADA57DAA4FE165D5C75894505B876BA6E4
watch(
  () => store.wallet_connect_error,
  (newVal, oldVal) => {
    if (newVal.taskId === props.task._id && newVal.status) {
      setTimeout(() => {
        isCollecting.value = false
        walletConnected.value = false
        loading.value = false
        store.SET_WALLET_CONNECT_ERROR({
          status: false,
          message: '',
          taskId: null
        })
      }, 100)
    }
  }
)

const connect = async (item) => {
  isCollecting.value = true

  emit('enableWallet', { network: 'interchain', taskId: props.task._id })
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
  loading.value = false
  if (!resp) {
    isCollecting.value = false
    walletConnected.value = false
  }
  emit('removeFormData')
}
</script>
