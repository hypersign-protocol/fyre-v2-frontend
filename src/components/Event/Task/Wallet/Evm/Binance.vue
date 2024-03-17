<template>
  <div class="task__wrap">
    <div class="task__top">
      <p class="text-red-100" v-if="task.isMandatory">Mandatory</p>
      <p class="text-green-100" v-if="!task.isMandatory">Optional</p>
    </div>
    <div class="task__header">
      <div class="task__title">
        <span>
          <img src="@/assets/images/wallet.png" />
        </span>
        <span class="text text-white-100">{{ task.title }}</span>
        <span class="font-18 lh-20 font-weight--bold text-blue-100"> +{{ task.xp }}XP </span>
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
      <div class="task__input"></div>
      <div class="task__submit">
        <v-btn @click="getWalletAddress">Collect Wallet Address</v-btn>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useEventParticipantStore } from '@/store/eventParticipant.ts'
import { storeToRefs } from 'pinia'
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
const inputText = ref(null)
const walletAddress = ref(null)
const signature = ref(null)
const store = useEventParticipantStore()
const { performResult } = storeToRefs(useEventParticipantStore())

watch(
  () => performResult.value,
  (value: any) => {
    console.log(performResult.value.tasks)
    if (performResult.value.tasks.hasOwnProperty(props.task._id)) {
      isTaskVerified.value = true
    } else {
      isTaskVerified.value = false
    }
  },
  { deep: true }
)

const getWalletAddress = async () => {
  const res = await window.ethereum.request({ method: 'eth_requestAccounts' })

  if (res) {
    walletAddress.value = res[0]
  }
}

watch(
  () => walletAddress.value,
  (value: any) => {
    performAction()
    props.task.options.proofConfig.proof.walletAddress = value
  },
  { deep: true }
)

const performAction = async () => {
  const res = await window.ethereum.request({
    method: 'eth_signTypedData_v4',
    params: [
      walletAddress.value,
      {
        domain: {
          name: 'Provide your wallet address',
          version: '1'
        },
        message: {
          purpose: 'We request your wallet address to verify your identity.',
          information:
            'We will only access your public wallet address ([unique string of characters]). We will not access any private information or your token balances without your explicit consent.',
          permissions:
            'By connecting your wallet, you are granting us permission to view your public address only.'
        },
        primaryType: 'Consent',
        types: {
          EIP712Domain: [
            {
              name: 'name',
              type: 'string'
            },
            {
              name: 'version',
              type: 'string'
            }
          ],
          Consent: [
            {
              name: 'purpose',
              type: 'string'
            },
            {
              name: 'information',
              type: 'string'
            },
            {
              name: 'permissions',
              type: 'string'
            }
          ]
        }
      }
    ]
  })

  signature.value = res
  props.task.options.proofConfig.proof.signature = res
}

watch(
  () => signature.value,
  (value: any) => {
    submit()
  },
  { deep: true }
)

const submit = async () => {
  await store.PERFORM_EVENT_TASK({
    eventId: props.task.eventId,
    communityId: props.communityId,
    task: {
      id: props.task._id,
      ...props.task.options.proofConfig
    }
  })
}
</script>
