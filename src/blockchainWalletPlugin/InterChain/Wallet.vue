<template>
  <v-card class="rounded-xl py-0" color="rgba(28, 29, 41, 1)" min-height="280" theme="dark">
    <v-card-actions class="pa-2 d-flex align-center justify-space-between">
      <v-btn icon="mdi-arrow-left" @click="prevStep"></v-btn>
      <p class="font-weight-bold">Choose Wallet</p>
      <v-btn icon="mdi-close" @click="$emit('close')"></v-btn>
    </v-card-actions>
    <v-divider></v-divider>
    <div class="bw3-modal_wallet__wrapper">
      <div
        v-for="(item, index) in wallets"
        :key="index"
        :class="interChainObject.selectedWallet === item.type ? 'active' : ''"
        class="wallet_item"
        @click="nextStep(item)"
      >
        <div class="image__wrap">
          <img :src="item.image" alt="" />
        </div>
        <div class="content__wrap">{{ item.name }}</div>
      </div>
    </div>
  </v-card>
</template>
<script lang="ts" setup>
import { wallets } from '../composables/walletData.ts'
import { storeToRefs } from 'pinia'
import { useInterChainStore } from '../stores/interchain'

const store = useInterChainStore()

const emit = defineEmits(['changeStep', 'close'])

const props = defineProps({
  text: { type: String, required: false },
  options: {
    type: Object,
    default() {
      return {}
    }
  }
})

const { interChainObject } = storeToRefs(store)

const prevStep = (item) => {
  emit('changeStep', 'chain')
}

const nextStep = (item) => {
  console.log(item)

  store.$patch({
    interChainObject: {
      ...{
        selectedWallet: item.type
      },
      ...{
        selectedWalletName: item.name
      },
      ...{
        selectedExtension: item.walletType
      }
    },
    interChainActiveStep: item.walletType
  })

  emit('changeStep', 'extension')
}
</script>
