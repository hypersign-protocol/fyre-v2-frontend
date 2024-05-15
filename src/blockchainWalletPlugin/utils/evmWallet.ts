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
    if (value.event === 'CONNECT_SUCCESS' || value.properties?.connected) {
      // getConfigConnection()
    }
  }
)

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

export const signArbitrary = async () => {
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

    setTimeout(() => {
      emit('emitSignedData', evmResultObject)
      props.options.showBwModal = false
    }, 100)
  } catch (err) {
    console.log(err)
    alert(err.message)
  } finally {
    loading.value = false
    props.options.showBwModal = false
  }
}

export const getSignature = async () => {
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

  setTimeout(() => {
    emit('emitSignedData', evmResultObject)
    props.options.showBwModal = false
  }, 100)
}
