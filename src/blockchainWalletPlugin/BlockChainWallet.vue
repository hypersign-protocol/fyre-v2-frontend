<template>
  <div class="bw3-modal" ref="bcWallet">
    <v-dialog v-model="options.showBwModal" max-width="340" max-height="340" persistent>
      <template v-slot:default="{ isActive }">
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
      </template>
    </v-dialog>
    <InterChainModal
      v-model="interchainModal"
      v-if="interchainModal"
      @close="closeModal"
      :options="options"
      @getWalletAddress="collectWalletAddress"
      @getSignedData="collectSignedData"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, watch, inject, onMounted, onUpdated, onUnmounted } from 'vue'
import { walletOptionsInject } from './'
import InterChainModal from './InterChain/index.vue'
import { purposes } from 'jsonld-signatures'
import jsSig from 'jsonld-signatures'

import { storeToRefs } from 'pinia'
import { useInterChainStore } from './stores/interchain'
const store = useInterChainStore()
import { docloader, initializeDidSDK } from './utils'

const { challenge } = storeToRefs(store)

const didDocResult = ref(null)

const emit = defineEmits([
  'emitProvider',
  'getSignature',
  'getWalletAddress',
  'getSignInProof',
  'getSignedData'
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

let reactiveConnector = ref({
  connector: {} as any as Connection
})

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

// @ts-expect-error 1. Get projectId
const projectId = import.meta.env.VITE_APP_WC_PROJECT_ID
if (!projectId) {
  throw new Error('VITE_PROJECT_ID is not set')
}

// 2. Create wagmiConfig
let chains = reactive([mainnet, bsc, polygon])
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

const evmResultObject = ref({
  provider: null,
  walletAddress: null,
  signProof: null,
  isSignedVerified: false
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
  emit('getSignedData', data)
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

watch(
  () => props.options,
  (value) => {
    console.log(value)
  }
)

watch(
  () => events.data,
  (value) => {
    if (value.event === 'CONNECT_SUCCESS' || value.properties?.connected === true) {
      evmResultObject.value.walletAddress = getAccount(wagmiConfig).address
    }
  }
)

watch(
  () => evmResultObject.value.walletAddress,
  (value) => {
    if (value) {
      emit('getWalletAddress', evmResultObject.value.walletAddress)

      if (props.options.isPerformAction) {
        signArbitrary()
      } else {
        getSignature()
      }
    }
  }
)

wagmiConfig.subscribe((value) => {
  if (value.status === 'connected') {
    reactiveConnector = { connector: value.connections.get(value.current) }
  }
})

const signArbitrary = async () => {
  const hsSDK = initializeDidSDK()

  const chainId = getAccount(wagmiConfig).chainId
  const address = getAccount(wagmiConfig).address

  console.log(address)

  const didDoc = await hsSDK.createByClientSpec({
    address,
    methodSpecificId: address,
    chainId,
    clientSpec: 'eth-personalSign'
  })

  didDocResult.value = didDoc

  const addVerification = await hsSDK.addVerificationMethod({
    didDocument: didDoc,
    type: 'EcdsaSecp256k1RecoveryMethod2020',
    id: `${didDoc.id}#key-2`,
    controller: didDoc.controller,
    blockchainAccountId: `eip155:${chainId}:${evmResultObject.value.walletAddress}`
  })

  delete didDoc.keyAgreement

  const provider = await reactiveConnector.connector.connector.getProvider()

  const eth = new EthereumEip712Signature2021({}, { _provider: provider })

  const proof = await jsSig.sign(didDoc, {
    suite: eth,
    purpose: new purposes.AssertionProofPurpose({
      controller: {
        '@context': ['https://w3id.org/security/v2'],
        id: didDoc.id,
        assertionMethod: didDoc.authentication
      }
    }),
    verificationMethod: didDoc.verificationMethod[0].id,
    domain: {},
    documentLoader: docloader
  })
  console.log(proof)

  evmResultObject.value.signProof = proof

  const verifed = await jsSig.verify(proof, {
    suite: new EthereumEip712Signature2021({}),
    purpose: new purposes.AssertionProofPurpose({
      controller: {
        '@context': ['https://w3id.org/security/v2'],
        id: didDoc.id,
        assertionMethod: didDoc.authentication
      },
      challenge: challenge,
      domain: 'http://example.com'
    }),
    verificationMethod: didDoc.verificationMethod[0].id,
    domain: {},
    documentLoader: docloader
  })
  console.log(verifed)
  console.log(verifed)
  evmResultObject.value.isSignedVerified = verifed

  emit('getSignedData', evmResultObject.value)
  options.showBwModal = false
}

const getSignature = async () => {
  const hsSDK = initializeDidSDK()

  const chainId = getAccount(wagmiConfig).chainId
  const address = getAccount(wagmiConfig).address
  console.log(address)

  const didDoc = await hsSDK.createByClientSpec({
    address,
    methodSpecificId: address,
    chainId,
    clientSpec: 'eth-personalSign'
  })

  delete didDoc.keyAgreement

  const provider = await reactiveConnector.connector.connector.getProvider()

  const eth = new EthereumEip712Signature2021({}, { _provider: provider })

  const proof = await jsSig.sign(didDoc, {
    suite: eth,
    purpose: new purposes.AuthenticationProofPurpose({
      controller: {
        '@context': ['https://w3id.org/security/v2'],
        id: didDoc.id,
        authentication: didDoc.authentication
      },
      challenge: store.challenge,
      domain: 'http://example.com'
    }),
    verificationMethod: didDoc.verificationMethod[0].id,
    domain: {},
    documentLoader: docloader
  })
  console.log(proof)

  evmResultObject.value.signProof = proof

  const verifed = await jsSig.verify(proof, {
    suite: new EthereumEip712Signature2021({}),
    purpose: new purposes.AuthenticationProofPurpose({
      controller: {
        '@context': ['https://w3id.org/security/v2'],
        id: didDoc.id,
        authentication: didDoc.authentication
      },
      challenge: store.challenge,
      domain: 'http://example.com'
    }),
    verificationMethod: didDoc.verificationMethod[0].id,
    domain: {},
    documentLoader: docloader
  })
  console.log(verifed)
  evmResultObject.value.isSignedVerified = verifed

  emit('getSignedData', evmResultObject.value)
  props.options.showBwModal = false
}
</script>
