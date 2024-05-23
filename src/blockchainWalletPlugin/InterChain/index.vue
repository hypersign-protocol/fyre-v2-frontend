<template>
  <v-dialog max-width="340" persistent>
    <template v-slot:default="{ isActive }">
      <component
        :is="checkComponent"
        :options="options"
        @changeStep="monitorChanges"
        @close="handleClose"
        @getSignedData="sendSignedData"
        @getWalletAddress="sendWalletAddress"
      />
    </template>
  </v-dialog>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { componentsList } from './data/ImportComponent.ts'

import { storeToRefs } from 'pinia'
import { useInterChainStore } from '../stores/interchain.ts'

const store = useInterChainStore()
const { interChainObject } = storeToRefs(store)

const emit = defineEmits(['close', 'getSignedData', 'getWalletAddress'])

const props = defineProps({
  text: { type: String, required: false },
  options: {
    type: Object,
    default() {
      return {}
    }
  }
})

const monitorChanges = (component, selectedValue) => {
  store.$patch({
    interChainActiveStep: component
  })
}

const checkComponent = computed(() => {
  const itemFound = componentsList.find((item) => item.type === store.interChainActiveStep)
  if (itemFound) {
    return itemFound.path
  } else {
    console.error(`not found.`)
  }
})

const sendWalletAddress = (data) => {
  emit('getWalletAddress', data)
}
const sendSignedData = (data) => {
  console.log("Inside sendSignedData  before emiting getSignedData");

  emit('getSignedData', data)
}

const handleClose = (done: () => void) => {
  store.RESET_STORE()
  emit('close')
}
</script>
