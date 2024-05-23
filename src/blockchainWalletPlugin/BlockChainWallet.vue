<template>
  <div ref="bcWallet" class="bw3-modal">
    <v-dialog v-model="options.showBwModal" max-height="500" max-width="340" persistent>
      <template v-slot:default="{ isActive }">
        <div class="position-relative">
          <v-card v-if="!loading" class="rounded-xl py-0" color="rgba(28, 29, 41, 1)" theme="dark">
            <v-card-actions class="pa-0">
              <p class="font-weight-bold ml-5">Choose Network</p>
              <v-btn class="ml-auto" icon="mdi-close" @click="options.showBwModal = false"></v-btn>
            </v-card-actions>
            <v-divider></v-divider>
            <v-row class="pa-5 ma-0">
              <v-col v-if="options.providers.includes('evm')">
                <div
                  class="d-flex flex-fill flex-column align-center cursor-pointer bg-grey-lighten-5 pa-4 rounded-xl"
                  @click="chooseProvider('evm')"
                >
                  <v-avatar color="#D4D7DE" size="50">
                    <img height="40" src="./assets/images/ethereum.svg" />
                  </v-avatar>
                  <div class="pt-3">EVM</div>
                </div>
              </v-col>
              <v-col v-if="options.providers.includes('interchain')">
                <div
                  class="d-flex flex-fill flex-column align-center cursor-pointer bg-grey-lighten-5 pa-4 rounded-xl"
                  @click="chooseProvider('interchain')"
                >
                  <v-avatar color="#D4D7DE" size="50">
                    <img height="40" src="./assets/images/cosmos.svg" />
                  </v-avatar>
                  <div class="pt-3">Interchain</div>
                </div>
              </v-col>
            </v-row>
          </v-card>
          <v-card
            v-if="loading"
            class="pa-5 rounded-lg d-flex flex-column align-center justify-center loading-state"
            color="rgb(28 29 41 / 70%)"
            height="300"
          >
            <div>
              <svg
                id="loader-1"
                data-v-7cc9fe95=""
                data-v-f98baaca=""
                enable-background="new 0 0 40 40"
                height="40px"
                version="1.1"
                viewBox="0 0 40 40"
                width="40px"
                x="0px"
                xml:space="preserve"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                y="0px"
              >
                <path
                  class="path-1"
                  d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
    s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
    c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"
                  data-v-f98baaca=""
                  fill="#f8f9fa"
                  opacity="0.2"
                ></path>
                <path
                  class="path-2"
                  d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
    C22.32,8.481,24.301,9.057,26.013,10.047z"
                  data-v-f98baaca=""
                  fill="white"
                >
                  <animateTransform
                    attributeName="transform"
                    attributeType="xml"
                    data-v-f98baaca=""
                    dur="0.5s"
                    from="0 20 20"
                    repeatCount="indefinite"
                    to="360 20 20"
                    type="rotate"
                  ></animateTransform>
                </path>
              </svg>
            </div>
            <p class="pt-4 font-15 lh-26 mx-5 text-white-100 font-weight-medium text-center">
              Please sign Fyre message to proceed
            </p>
          </v-card>
        </div>
      </template>
    </v-dialog>
    <InterChainModal
      ref="interchainWallet"
      v-model="interchainModal"
      :options="options"
      @close="closeModal"
      @getSignedData="collectSignedData"
      @getWalletAddress="collectWalletAddress"
      @isError="collectError"
    />
    <EvmModal
      ref="evmWallet"
      v-model="evmModal"
      :options="options"
      @getSignedData="collectSignedData"
      @getEvmWalletAddress="collectEvmWalletAddress"
      @isError="collectError"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import InterChainModal from './InterChain/index.vue'
import EvmModal from './Evm/index.vue'

import { storeToRefs } from 'pinia'
import { useInterChainStore } from './stores/interchain'

const store = useInterChainStore()

const { challenge, walletOptions } = storeToRefs(store)

const loading = ref(false)

const emit = defineEmits({
  emitProvider: (data: any) => {
    if (data) {
      return true
    } else {
      return false
    }
  },

  emitWalletAddress: (data: any) => {
    if (data) {
      return true
    } else {
      return false
    }
  },
  emitSignedData: (data: any) => {
    if (data) {
      return true
    } else {
      return false
    }
  }
})

const props = defineProps({
  text: { type: String, required: false },
  options: {
    type: Object,
    default() {
      return {}
    }
  }
})

const interchainModal = ref(false)
const evmModal = ref(false)

const evmWallet = ref(null)
const interchainWallet = ref(null)

const closeModal = () => {
  interchainModal.value = false
}

const collectEvmWalletAddress = (data: any) => {
  emit('emitWalletAddress', data)
  console.log(data)
}

const collectWalletAddress = (data: any) => {
  emit('emitWalletAddress', data)
  console.log(data)
}

const collectError = (data: any) => {
  // eslint-disable-next-line vue/no-mutating-props
  props.options.showBwModal = false
  loading.value = false
}
const collectSignedData = (data: any) => {
  console.log("Inside collectSignedData  before emiting emitSignedData");
  
  emit('emitSignedData', data)
  // eslint-disable-next-line vue/no-mutating-props
  props.options.showBwModal = false
  loading.value = false
  if (data.network === 'evm') {
    evmWallet.value.closeModal()
  }
}

const chooseProvider = (data: any) => {
  emit('emitProvider', data)
  if (data === 'evm') {
    // eslint-disable-next-line vue/no-mutating-props
    props.options.showBwModal = false
    evmModal.value = true
    evmWallet.value.openModal()
  } else {
    interchainModal.value = true
  }
}

watch(
  () => store.walletOptions,
  (value) => {
    if (value.showBwModal) {
      if (value.selectedNetwork === 'evm') {
        props.options.showBwModal = false
        evmModal.value = true
        evmWallet.value.openModal()
      } else if (value.selectedNetwork === 'interchain') {
        props.options.showBwModal = false
        interchainModal.value = true
      } else {
        props.options.showBwModal = true
      }
    }
  },
  { deep: true }
)
</script>
