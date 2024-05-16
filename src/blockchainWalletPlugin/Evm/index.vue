<template>
  <div></div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'

import { storeToRefs } from 'pinia'
import { useInterChainStore } from '../stores/interchain'
import { addWallet, signData } from '../utils'

import { bsc, mainnet, polygon } from '@wagmi/core/chains'
import { Connection, getAccount } from '@wagmi/core'

import {
  createWeb3Modal,
  defaultWagmiConfig,
  useWeb3Modal,
  useWeb3ModalEvents,
  useWeb3ModalState,
  useWeb3ModalTheme
} from '@web3modal/wagmi/vue'
import { coinbaseWallet } from '@wagmi/connectors'

const store = useInterChainStore()

const { challenge } = storeToRefs(store)

const props = defineProps({
  text: { type: String, required: false },
  options: {
    type: Object,
    default() {
      return {}
    }
  }
})

const loading = ref(false)

const emit = defineEmits(['close', 'getSignedData', 'getWalletAddress'])
reactive({
  connector: {} as any as Connection
})

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
const { open, close } = useWeb3Modal()
const state = useWeb3ModalState()
// const { disconnect } = useDisconnect()
const { setThemeMode, themeMode, themeVariables } = useWeb3ModalTheme()
const events = useWeb3ModalEvents()

const evmResultObject = reactive({
  provider: null,
  walletAddress: null,
  signProof: null,
  isSignedVerified: false,
  wagmiConfig: null,
  chainId: null,
  network: 'evm'
})

watch(
  () => evmResultObject.signProof,
  (value) => {
    if (value) {
      setTimeout(() => {
        emit('getSignedData', evmResultObject)
        props.options.showBwModal = false
      }, 100)
    }
  }
)

watch(
  () => events.data,
  (value) => {
    if (value.event === 'CONNECT_SUCCESS' || value.properties?.connected) {
      // getConfigConnection()
    }
  }
)

// wagmiConfig.subscribe((value) => {
//   if (value.status === 'connected') {
//     const connectionValue = value.connections.get(value.current)
//     collectProvider(connectionValue)
//   }
// })

// the damn fix

let collectProviderInvoked = false
wagmiConfig.subscribe((value) => {
  if (value.status === 'connected') {
    const connectionValue = value.connections.get(value.current)
    if (!collectProviderInvoked) {
      collectProviderInvoked = true
      collectProvider(connectionValue)
    }
  }
})

const collectProvider = async (connectionValue) => {
  const provider = await connectionValue.connector.getProvider()

  evmResultObject.provider = provider

  const { chainId, address } = getAccount(wagmiConfig)

  evmResultObject.chainId = chainId
  evmResultObject.walletAddress = address

  emit('getWalletAddress', evmResultObject)
}

const signArbitrary = async () => {
  try {
    loading.value = true

    const { chainId, address } = getAccount(wagmiConfig)

    evmResultObject.walletAddress = address

    const payload = {
      signType: 'eip155',
      localDidDoc: store.walletOptions.didDocument,
      wallet: null,
      chainId: chainId,
      address: address,
      provider: evmResultObject.provider
    }

    const { proof, verifed } = await addWallet(payload)

    evmResultObject.signProof = proof
    evmResultObject.isSignedVerified = verifed

    setTimeout(() => {
      emit('getSignedData', evmResultObject)
      props.options.showBwModal = false
    }, 100)
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
    props.options.showBwModal = false
  }
}

const generateDidDoc = async () => {
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
}

const openModal = () => {
  store.walletOptions.showBwModal = false
  open({ view: 'Networks' })
}

const closeModal = () => {
  store.walletOptions.showBwModal = false
  close()
}

defineExpose({
  openModal,
  generateDidDoc,
  signArbitrary,
  closeModal
})
</script>
