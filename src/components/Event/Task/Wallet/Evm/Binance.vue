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
      <div class="task__action" @click="showExpand = !showExpand">
        <v-btn v-if="
          !showExpand && !isTaskVerified && !eventParticipants?.tasks?.hasOwnProperty(task._id)
        ">
          Verify
        </v-btn>
        <v-btn variant="outlined" v-else-if="
          !showExpand && (isTaskVerified || eventParticipants?.tasks?.hasOwnProperty(task._id))
        ">
          <v-icon>mdi-check</v-icon>
          Verified
        </v-btn>
        <v-icon v-if="showExpand" color="white" @click="makeshowExpandFalse">mdi-close</v-icon>
      </div>
      <div class="task__action" v-if="isTaskVerified">
        <v-btn variant="outlined">
          <v-icon>mdi-check</v-icon>
          Verified</v-btn>
      </div>
    </div>
    <div class="task__body" v-if="showExpand && !isTaskVerified">
      <div class="task__input"></div>
      <div class="task__submit">
        <v-btn @click="getWalletAddress">Connect Wallet</v-btn>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useEventParticipantStore } from '@/store/eventParticipant.ts'
import { storeToRefs } from 'pinia'
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
const inputText = ref(null)
const walletAddress = ref(null)
const signature = ref(null)
const store = useEventParticipantStore()
const { performResult } = storeToRefs(useEventParticipantStore())

watch(
  () => performResult.value,
  (value: any) => {
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
const makeshowExpandFalse = () => { showExpand.value = false } 

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
