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
import { docloader, initializeDidSDK, signData } from './utils'

const { challenge } = storeToRefs(store)

const loading = ref(false)

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
  () => store.walletOptions,
  (value) => {
    console.log(value)
    const onlyEvm = value.providers.every((element) => element === 'evm')
    console.log(onlyEvm)
    if (onlyEvm) {
      props.options.showBwModal = false
      modal.open({ view: 'Networks' })
    } else {
      interchainModal.value = true
    }
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
      console.log(props)
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

const signArbitrary = async (params?, addVm?) => {
  console.log(props.options)

  const hsSDK = initializeDidSDK()

  const provider = await reactiveConnector.connector.connector.getProvider()
  const eth = new EthereumEip712Signature2021({}, { _provider: provider })

  if (props.didDocument) {
    const didDoc = props.didDocument
    delete props.didDocument.proof
    let length = didDoc.verificationMethod.length
    const chainId = props.didDocument.verificationMethod[0].blockchainAccountId.split(':')[1]
    const address = props.didDocument.verificationMethod[0].blockchainAccountId.split(':')[2]
    if (addVm) {
      await hsSDK.addVerificationMethod({
        didDocument: didDoc,
        type: 'EcdsaSecp256k1RecoveryMethod2020',
        id: `${didDoc.id}#key-${length++}`,
        controller: didDoc.controller,
        blockchainAccountId: `eip155:${chainId}:${evmResultObject.value.walletAddress}`
      })
    }
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
    evmResultObject.value.signProof = proof
    emit('getSignedData', evmResultObject.value)
  } else {
    const chainId = getAccount(wagmiConfig).chainId
    const address = getAccount(wagmiConfig).address

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
  }
  props.options.showBwModal = false
}

const getSignature = async () => {
  const { chainId, address } = getAccount(wagmiConfig)

  const payload = {
    chainId: chainId,
    address: address,
    clientSpec: 'eth-personalSign',
    suiteType: 'eth',
    reactiveConnector: reactiveConnector
  }

  const { proof, verifed } = await signData(payload)

  evmResultObject.value.signProof = proof
  evmResultObject.value.isSignedVerified = verifed

  emit('getSignedData', evmResultObject.value)
  props.options.showBwModal = false
}
</script>
