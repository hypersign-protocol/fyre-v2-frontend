<template>
  <div class="bw3-modal" ref="bcWallet">
    <v-dialog v-model="options.showBwModal" max-width="340" max-height="500" persistent>
      <template v-slot:default="{ isActive }">
        {{ walletOptions }}
        <div class="position-relative">
          <v-card color="rgba(28, 29, 41, 1)" theme="dark" class="rounded-xl py-0">
            <v-card-actions class="pa-0">
              <p class="font-weight-bold ml-5">Choose Network</p>
              <v-btn icon="mdi-close" class="ml-auto" @click="options.showBwModal = false"> </v-btn>
            </v-card-actions>
            <v-divider></v-divider>
            <v-row class="pa-5 ma-0">
              <v-col v-if="options.providers.includes('evm')">
                <div
                  class="d-flex flex-fill flex-column align-center cursor-pointer bg-grey-lighten-5 pa-4 rounded-xl"
                  @click="chooseProvider('evm')"
                >
                  <v-avatar color="#D4D7DE" size="50">
                    <img src="./assets/images/ethereum.svg" height="40" />
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
                    <img src="./assets/images/cosmos.svg" height="40" />
                  </v-avatar>
                  <div class="pt-3">Interchain</div>
                </div>
              </v-col>
            </v-row>
          </v-card>
          <v-card
            v-if="loading"
            class="pa-5 rounded-lg d-flex flex-column align-center loading-state"
            color="rgb(28 29 41 / 70%)"
          >
            <div>
              <svg
                data-v-f98baaca=""
                data-v-7cc9fe95=""
                id="loader-1"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                width="40px"
                height="40px"
                viewBox="0 0 40 40"
                enable-background="new 0 0 40 40"
                xml:space="preserve"
              >
                <path
                  data-v-f98baaca=""
                  class="path-1"
                  opacity="0.2"
                  fill="#f8f9fa"
                  d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
    s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
    c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"
                ></path>
                <path
                  data-v-f98baaca=""
                  class="path-2"
                  fill="white"
                  d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
    C22.32,8.481,24.301,9.057,26.013,10.047z"
                >
                  <animateTransform
                    data-v-f98baaca=""
                    attributeType="xml"
                    attributeName="transform"
                    type="rotate"
                    from="0 20 20"
                    to="360 20 20"
                    dur="0.5s"
                    repeatCount="indefinite"
                  ></animateTransform>
                </path>
              </svg>
            </div>
            <p class="pt-4 font-15 lh-26 mx-5 text-white-100 font-weight-medium text-center">
              Please log in to MetaMask and sign Fyre message to proceed
            </p>
          </v-card>
        </div>
      </template>
    </v-dialog>
    <InterChainModal
      v-model="interchainModal"
      v-if="interchainModal"
      @close="closeModal"
      :options="options"
      @getWalletAddress="collectWalletAddress"
      @getSignedData="collectSignedData"
      @updateOptions="collectSignedData"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, watch, inject, onMounted, onUpdated, onUnmounted } from 'vue'
import { walletOptionsInject } from './'
import InterChainModal from './InterChain/index.vue'

import { storeToRefs } from 'pinia'
import { useInterChainStore } from './stores/interchain'
const store = useInterChainStore()
import { docloader, initializeDidSDK, signData, addWallet } from './utils'

import { mainnet, bsc, polygon } from '@wagmi/core/chains'
import { Connection, getAccount, signTypedData } from '@wagmi/core'

import {
  createWeb3Modal,
  defaultWagmiConfig,
  useWeb3Modal,
  useWeb3ModalEvents,
  useWeb3ModalState,
  useWeb3ModalTheme
} from '@web3modal/wagmi/vue'
import { reconnect } from '@wagmi/core'
import { coinbaseWallet, walletConnect, injected } from '@wagmi/connectors'
import { EthereumEip712Signature2021 } from 'ethereumeip712signature2021suite'

const { challenge } = storeToRefs(store)

const loading = ref(false)

const emit = defineEmits([
  'emitProvider',
  'getSignature',
  'getWalletAddress',
  'getSignInProof',
  'emitSignedData'
])

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
const showEvmModal = ref(false)

let reactiveConnector = reactive({
  connector: {} as any as Connection
})

// @ts-expect-error 1. Get projectId
const projectId = import.meta.env.VITE_APP_WC_PROJECT_ID
if (!projectId) {
  throw new Error('VITE_PROJECT_ID is not set')
}

// 2. Create wagmiConfig
const chains = reactive([mainnet, bsc, polygon])
const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  connectors: [coinbaseWallet],
  metadata: {
    name: 'Web3Modal Vue Example',
    description: 'Web3Modal Vue Example',
    url: '',
    icons: [],
    verifyUrl: ''
  }
})

// 3. Create modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-color-mix': 'rgba(28,29,41,1)',
    '--w3m-color-mix-strength': 30
  }
})

// 4. Use modal composable
const modal = useWeb3Modal()
const state = useWeb3ModalState()
const { setThemeMode, themeMode, themeVariables } = useWeb3ModalTheme()
const events = useWeb3ModalEvents()

const evmResultObject = reactive({
  provider: null,
  walletAddress: null,
  signProof: null,
  isSignedVerified: false,
  wagmiConfig: null
})

const closeModal = () => {
  interchainModal.value = false
}

const collectWalletAddress = (data) => {
  console.log(data)
  emit('getWalletAddress', data)
}

const collectSignedData = (data) => {
  console.log(data)
  emit('emitSignedData', data)
  props.options.showBwModal = false
}

const chooseProvider = (data) => {
  emit('emitProvider', data)
  if (data === 'evm') {
    props.options.showBwModal = false
    modal.open({ view: 'Networks' })
  } else {
    interchainModal.value = true
  }
}

store.$subscribe((mutation, state) => {
  if (mutation.payload) {
    let obj = mutation.payload?.walletOptions
    if (store.walletOptions?.isPerformAction) {
      const onlyEvm = obj?.providers.every((element) => element === 'evm')
      if (onlyEvm) {
        props.options.showBwModal = false
        modal.open({ view: 'Networks' })
      } else {
        interchainModal.value = true
        // store.$patch({
        //   interChainActiveStep: 'wallet'
        // })
      }
    }
  }
})

watch(
  () => events.data,
  (value) => {
    console.log(value)
    if (value.event === 'CONNECT_SUCCESS' || value.properties?.connected) {
      // getConfigConnection()
    }
  }
)

// const getConfigConnection = async () => {

//   console.log(wagmiConfig.connectors)

//   const current = JSON.parse(localStorage.getItem("wagmi.store")).state.current;
//   console.log(current)
//   const conn = wagmiConfig.connectors.find((c) => c.uid === current);
//   console.log(conn)
//   const provider = await conn.getProvider();
//   console.log(provider)

//   const { chainId, address } = getAccount(wagmiConfig)
//   console.log(chainId, address)
//   evmResultObject.provider = provider

//   if(store.walletOptions.isPerformAction){
//     signArbitrary()
//   }else{
//     getSignature()
//   }

// }

// watch(
//   () => evmResultObject.signProof,
//   (value: any) => {
//     console.log(value)
//     emit('getSignedData', evmResultObject)
//     // if (value) {
//     //   emit('getSignedData', evmResultObject)
//     // } else {
//     //   console.log('No signature found')
//     // }
//   },
//   { deep: true }
// )

wagmiConfig.subscribe((value) => {
  if (value.status === 'connected') {
    const connectionValue = value.connections.get(value.current)
    collectProvider(connectionValue)
  }
})

const collectProvider = async (connectionValue) => {
  const provider = await connectionValue.connector.getProvider()
  console.log(provider)
  evmResultObject.provider = provider

  const { chainId, address } = getAccount(wagmiConfig)
  console.log(chainId, address)

  if (store.walletOptions.isPerformAction) {
    signArbitrary()
  } else {
    getSignature()
  }
}

const signArbitrary = async () => {
  try {
    loading.value = true

    const { chainId, address } = getAccount(wagmiConfig)

    console.log(chainId, address)

    evmResultObject.walletAddress = address

    const payload = {
      signType: 'eip155',
      localDidDoc: store.walletOptions.didDocument,
      wallet: null,
      chainId: chainId,
      address: address,
      provider: evmResultObject.provider
    }

    const { proof } = await addWallet(payload)

    console.log(proof)

    evmResultObject.signProof = proof
    // evmResultObject.isSignedVerified = verifed

    console.log(evmResultObject)

    emitSigned()

  } catch (err) {
    console.log(err)
    alert(err.message)
  } finally {
    loading.value = false
    props.options.showBwModal = false
  }
}

const emitSigned = () => {
  console.log(evmResultObject)
  setTimeout(() => {
     emit('emitSignedData', evmResultObject)
     props.options.showBwModal = false
  })
}

const getSignature = async () => {
  const { chainId, address } = getAccount(wagmiConfig)

  evmResultObject.walletAddress = address

  const payload = {
    chainId: chainId,
    address: address,
    clientSpec: 'eth-personalSign',
    suiteType: 'eth',
    provider: evmResultObject.provider
  }

  const { proof, verifed } = await signData(payload)

  evmResultObject.signProof = proof
  evmResultObject.isSignedVerified = verifed

  emitSigned()
}
</script>
