<template>
  <v-card color="rgba(28, 29, 41, 1)" theme="dark" min-height="280" class="rounded-xl py-0">
    <v-card-actions class="pa-2 d-flex align-center justify-space-between">
      <v-btn icon="mdi-arrow-left" @click="prevStep"></v-btn>
      <p class="font-weight-bold">Choose Wallet</p>
      <v-btn icon="mdi-close" @click="$emit('close')"> </v-btn>
    </v-card-actions>
    <v-divider></v-divider>
    <div class="bw3-modal_wallet__wrapper">
      <div
        class="wallet_item"
        :class="interChainObject.selectedWallet === item.type ? 'active' : ''"
        v-for="(item, index) in wallets"
        :key="index"
        @click="nextStep(item)"
      >
        <div class="image__wrap">
          <img :src="item.image" />
        </div>
        <div class="content__wrap">{{ item.name }}</div>
      </div>
    </div>
  </v-card>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

import { getImageUrl } from '../composables/general.ts'
import { wallets } from '../composables/walletData.ts'
import { storeToRefs } from 'pinia'
import { useInterChainStore } from '../stores/interchain'

const store = useInterChainStore()

const emit = defineEmits(['changeStep', 'close'])

const { interChainObject } = storeToRefs(store)

const prevStep = (item) => {
  emit('changeStep', 'chain')
}

const nextStep = (item) => {
  store.$patch({
    interChainObject: {
      ...{
        selectedWallet: item.type
      },
      ...{
        selectedWalletName: item.name
      },
      ...{
        selectedExtension: 'extension'
      }
    },
    interChainActiveStep: 'extension'
  })
  emit('changeStep', 'extension')
}
</script>
