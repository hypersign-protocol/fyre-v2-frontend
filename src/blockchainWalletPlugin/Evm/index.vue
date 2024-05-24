<template>
  <div></div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'

import { storeToRefs } from 'pinia'
import { useInterChainStore } from '../stores/interchain'
import { addWallet, signData } from '../utils'

import { bsc, mainnet, polygon } from '@wagmi/core/chains'
import { Connection, getAccount, disconnect } from '@wagmi/core'

import {
  createWeb3Modal,
  defaultWagmiConfig,
  useWeb3Modal,
  useWeb3ModalEvents,
  useWeb3ModalState,
  useWeb3ModalTheme
} from '@web3modal/wagmi/vue'

import { coinbaseWallet } from '@wagmi/connectors'
import { evmWalletsStore } from '../stores/evmchain';
const evmStore = evmWalletsStore()
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

const emit = defineEmits({
  // Validate getWalletAddress event
  getEvmWalletAddress: (data: any) => {
    console.log(data)
    if (data.walletAddress) {
      return true
    } else {
      return false
    }
  },

  // Validate getSignedData event
  getSignedData: (data: any) => {
    if (data) {
      return true
    } else {
      return false
    }
  }
})

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
let modal = createWeb3Modal({
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
  network: 'evm',
  connector: null
})

watch(
  () => evmResultObject.signProof,
  (value) => {
    if (value) {
      setTimeout(() => {
        console.log('watch:: Beofre emiting eve/index.js from gandchild to parent')
        emit('getSignedData', evmResultObject)
        props.options.showBwModal = false
      }, 100)
    }
  }
)
watch(
  () => evmStore.evmResultObject.signProof,
  (newCount, oldCount) => {
    if (Object.keys(newCount).length > 0) {
      emit('getSignedData', evmStore.evmResultObject)
      evmStore.SET_EVM_RESULT({})
    } else {
      console.log("no state change");
    }
  }
);

watch(
  () => events.data,
  (value) => {
    if (value.event === 'CONNECT_SUCCESS' || value.properties?.connected) {
      // getConfigConnection()
      console.log(getAccount(wagmiConfig))
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

modal.subscribeEvents(async (e) => {
  console.log(e)
  if (
    (e.data.event == 'MODAL_CLOSE' || e.data.event == 'CONNECT_SUCCESS') &&
    (e.data.properties.connected == true || e.data.properties.method == 'browser')
  ) {
    const connetor = wagmiConfig.connectors.filter((e) => e.uid == wagmiConfig.state.current)
    if (connetor.length > 0) {
      const provider = await Promise.resolve(connetor[0].getProvider())
      await collectProvider(provider);
    } else {
      console.log('======== No connector===============')
    }
  }
})

const collectProvider = async (connectionValue) => {
  const provider = connectionValue
  evmResultObject.provider = provider
  evmResultObject.connector = getAccount(wagmiConfig)
  console.log(evmResultObject.connector)
  evmResultObject.chainId = evmResultObject.connector.chainId
  evmResultObject.walletAddress = evmResultObject.connector.address
  console.log(evmResultObject)
  emit('getEvmWalletAddress', evmResultObject)

  if (props.options.isPerformAction) {
    await signArbitrary();
  } else {
    generateDidDoc()
  }
}

const signArbitrary = async () => {
  try {
    loading.value = true

    const payload = {
      signType: 'eip155',
      localDidDoc: store.walletOptions.didDocument,
      wallet: null,
      chainId: evmResultObject.chainId,
      address: evmResultObject.walletAddress,
      provider: evmResultObject.provider
    }

    const { proof, verifed } = await addWallet(payload)

    evmResultObject.signProof = proof
    evmResultObject.isSignedVerified = verifed

    console.log(evmResultObject)
    evmStore.SET_EVM_RESULT(evmResultObject)
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
    props.options.showBwModal = false
  }
}

const generateDidDoc = async () => {
  const payload = {
    chainId: evmResultObject.chainId,
    address: evmResultObject.walletAddress,
    clientSpec: 'eth-personalSign',
    suiteType: 'eth',
    provider: evmResultObject.provider
  }

  const { proof, verifed } = await signData(payload)

  console.log(proof, verifed)

  evmResultObject.signProof = proof
  evmResultObject.isSignedVerified = verifed

  // evmStore.SET_EVM_RESULT(evmResultObject)

  // setTimeout(() => {
  //   emit('getSignedData', evmResultObject)
  //   props.options.showBwModal = false
  // }, 100)
}

const openModal = () => {
  store.walletOptions.showBwModal = false
  open({ view: 'Networks' })
}

const closeModal = async () => {
  console.log('kkk')
  console.log(evmResultObject.connector.connector)
  const connector = evmResultObject.connector.connector
  const result = await disconnect(wagmiConfig, {
    connector
  })
  console.log(result)
  store.walletOptions.showBwModal = false
}

defineExpose({
  openModal,
  generateDidDoc,
  signArbitrary,
  closeModal
})
</script>
