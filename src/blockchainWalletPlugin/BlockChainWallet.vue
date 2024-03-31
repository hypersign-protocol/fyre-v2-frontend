<template>
  <div class="bw3-modal">
    <v-dialog v-model="options.showBwModal" max-width="340" max-height="340" persistent>
      <template v-slot:default="{ isActive }">
        <v-card color="rgba(28, 29, 41, 1)" theme="dark" class="rounded-xl py-0">
          <v-card-actions class="pa-0">
            <p class="font-weight-bold ml-5">Choose Network</p>
            <v-btn icon="mdi-close" class="ml-auto" @click="options.showBwModal = false"> </v-btn>
          </v-card-actions>
          <v-divider></v-divider>
          <v-row class="pa-5 ma-0">
            <v-col>
              <div
                class="d-flex flex-fill flex-column align-center cursor-pointer bg-grey-lighten-5 pa-4 rounded-xl"
                @click="showEvm"
              >
                <v-avatar color="#D4D7DE" size="50">
                  <img src="./assets/images/ethereum.svg" height="40" />
                </v-avatar>
                <div class="pt-3">EVM</div>
              </div>
            </v-col>
            <v-col>
              <div
                class="d-flex flex-fill flex-column align-center cursor-pointer bg-grey-lighten-5 pa-4 rounded-xl"
                @click="interchainModal = true"
              >
                <v-avatar color="#D4D7DE" size="50">
                  <img src="./assets/images/cosmos.svg" height="40" />
                </v-avatar>
                <div class="pt-3">Interchain</div>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </template>
    </v-dialog>
    <InterChainModal v-model="interchainModal" v-if="interchainModal" @close="closeModal" />
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, watch, inject } from 'vue'
import { walletOptionsInject } from './'
import InterChainModal from './InterChain/index.vue'

const emit = defineEmits(['userAuthSuccess'])

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

import { mainnet, bsc } from '@wagmi/core/chains'
import { getAccount, signTypedData } from '@wagmi/core'

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

// @ts-expect-error 1. Get projectId
const projectId = '46808fcc7a91e0856a6734652cf14fa2'
if (!projectId) {
  throw new Error('VITE_PROJECT_ID is not set')
}

// 2. Create wagmiConfig
const chains = [mainnet, bsc]
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

const evemResultObject = ref({
  walletAddress: null,
  signature: null
})

const closeModal = () => {
  interchainModal.value = false
  emit('userAuthSuccess')
}

const showEvm = () => {
  props.options.showBwModal = false
  modal.open({ view: 'Networks' })
}

watch(
  () => events.data,
  (value) => {
    if (value.event === 'CONNECT_SUCCESS') {
      evemResultObject.value.walletAddress = getAccount(wagmiConfig).address
    }
  }
)

watch(
  () => evemResultObject.value.walletAddress,
  (value) => {
    if (value) {
      console.log(`Wallet Address: ${value}`)
      getSignature()
    }
  }
)

watch(
  () => evemResultObject.value.signature,
  (value) => {
    if (value) {
      console.log(`Signature: ${value}`)
      emit('userAuthSuccess')
    }
  }
)

const getSignature = async () => {
  console.log('heree')
  const chainId = getAccount(wagmiConfig).chainId

  const domain = {
    name: 'Ether Mail',
    version: '1',
    chainId: chainId,
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
  }

  const types = {
    Person: [
      { name: 'name', type: 'string' },
      { name: 'wallet', type: 'address' }
    ],
    Mail: [
      { name: 'from', type: 'Person' },
      { name: 'to', type: 'Person' },
      { name: 'contents', type: 'string' }
    ]
  }

  const message = {
    from: {
      name: 'Cow',
      wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826'
    },
    to: {
      name: 'Bob',
      wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'
    },
    contents: 'Hello, Bob!'
  }
  try {
    const signature = await signTypedData(wagmiConfig, {
      domain,
      message,
      primaryType: 'Mail',
      types
    })
    evemResultObject.value.signature = signature
  } catch (e) {
    console.log(e)
  }
}
</script>
