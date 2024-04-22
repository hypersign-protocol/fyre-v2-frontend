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
        <span class="text text-white-100">{{ task.title }} Test</span>
        <span class="font-18 lh-20 font-weight--bold text-blue-100"> +{{ task.xp }}XP </span>
      </div>
      <div class="task__action" v-if="!isTaskVerified" @click="showExpand = !showExpand">
        <v-btn v-if="!showExpand">Verify</v-btn>
        <v-icon v-if="showExpand" color="white" class="cursor-pointer">mdi-close</v-icon>
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
        <v-btn
          @click="(options.showBwModal = true), (isCollecting = true)"
          :loading="isCollecting"
          :disabled="walletAddress"
          >Collect Wallet Address</v-btn
        >
        <v-btn @click="submit" :loading="loading">Verify Task</v-btn>
      </div>
    </div>
  </div>
  <BlockChainWallet :options="options" @getSignedData="collectSignedData" />
</template>
<script lang="ts" setup>
import { useEventParticipantStore } from '@/store/eventParticipant.ts'
import { storeToRefs } from 'pinia'
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'

import { getImage } from '@/composables/event.ts'

interface Task {
  _id: string
  type: string
  year: number
}

const props = defineProps<{
  task: Task
  communityId
}>()
const showExpand = ref(false)
const loading = ref(false)
const isCollecting = ref(false)
const isTaskVerified = ref(false)
const inputText = ref(null)

const store = useEventParticipantStore()
const { performResult } = storeToRefs(useEventParticipantStore())

const wAddress = ref(null)
const sProof = ref(null)

const options = reactive({
  showBwModal: false,
  providers: ['interchain'],
  chains: ['cosmos'],
  isRequiredDID: false,
  isPerformAction: true
})

const collectSignedData = async (data) => {
  console.log(data)
  wAddress.value = data.walletAddress
  sProof.value = data.signProof
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
  console.log(wAddress.value)
  console.log(sProof.value)

  loading.value = true
  await store.PERFORM_EVENT_TASK({
    eventId: props.task.eventId,
    communityId: props.communityId,
    task: {
      id: props.task._id,
      proof: {
        walletAddress: wAddress.value,
        signedDidDocument: sProof.value
      }
    }
  })
}
</script>
