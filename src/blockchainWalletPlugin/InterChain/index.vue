<template>
  <v-dialog max-width="340" persistent>
    <template v-slot:default="{ isActive }">
      <component :is="checkComponent" @changeStep="monitorChanges" @close="handleClose" />
    </template>
  </v-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { componentsList } from './data/ImportComponent.ts'

import { storeToRefs } from 'pinia'
import { useInterChainStore } from '../stores/interchain.ts'
const store = useInterChainStore()
const { interChainObject } = storeToRefs(store)

const emit = defineEmits(['close'])
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

const handleClose = (done: () => void) => {
  store.RESET_STORE()
  emit('close')
}
</script>
