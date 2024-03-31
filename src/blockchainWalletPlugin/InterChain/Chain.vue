<template>
  <v-card color="rgba(28, 29, 41, 1)" theme="dark" min-height="280" class="rounded-xl py-0">
    <v-card-actions class="pa-2 d-flex align-center justify-space-between">
      <p class="font-weight-bold ml-5">Choose Chain</p>
      <v-btn icon="mdi-close" @click="$emit('close')"> </v-btn>
    </v-card-actions>
    <v-divider></v-divider>
    <div class="bw3-modal__card__wrapper">
      <template v-for="(item, index) in chains" :key="index">
        <div
          class="card__item"
          :class="interChainObject.selectedChain === item.type ? 'active' : ''"
          v-if="item.showOption"
          @click="nextStep(item)"
        >
          <div class="image__wrap">
            <img :src="item.image" height="40" />
          </div>
          <div class="content__wrap">{{ item.name }}</div>
        </div>
      </template>
    </div>
  </v-card>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { getImageUrl } from '../composables/general.ts'

import { chains } from '../composables/chainsData.ts'
import { storeToRefs } from 'pinia'
import { useInterChainStore } from '../stores/interchain.ts'
const store = useInterChainStore()

const emit = defineEmits(['changeStep', 'close'])

const { interChainObject } = storeToRefs(store)

const nextStep = (item) => {
  store.$patch({
    interChainObject: {
      ...{
        selectedChain: item.type
      }
    },
    interChainActiveStep: 'wallet'
  })
  emit('changeStep', 'wallet')
}
</script>
