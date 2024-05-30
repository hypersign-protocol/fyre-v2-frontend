<template>
  <v-card class="rounded-xl py-0" color="rgba(28, 29, 41, 1)" min-height="280" theme="dark">
    <v-card-actions class="pa-2 d-flex align-center justify-space-between">
      <v-btn icon="mdi-arrow-left" @click="prevStep"></v-btn>
      <p class="font-weight-bold">{{ getWallet(interChainObject?.selectedWallet).name }}</p>
      <v-btn icon="mdi-close" @click="$emit('close')"></v-btn>
    </v-card-actions>
    <v-divider></v-divider>
    <div v-if="loading" class="d-flex align-center justify-center fill-height pa-6">
      <v-progress-circular alicolor="primary" class="d-flex align-center justify-center" indeterminate
        size="32"></v-progress-circular>
    </div>
  </v-card>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue'

import { addWallet, signData } from '../utils'
import { chains } from '../composables/chainsData.ts'

import { storeToRefs } from 'pinia'
import { useInterChainStore } from '../stores/interchain'
import { wallets } from '../composables/walletData.ts'

import { KeplrController, LeapController, WalletName } from 'cosmes/wallet'

const store = useInterChainStore()

const { interChainObject } = storeToRefs(store)

const emit = defineEmits(['changeStep', 'close', 'getSignedData', 'getWalletAddress', 'justClose'])

const props = defineProps({
  text: { type: String, required: false },
  options: {
    type: Object,
    default() {
      return {}
    }
  }
})

const prevStep = (item: any) => {
  store.$patch({
    interChainObject: {
      ...{
        interChainActiveStep: null
      }
    }
  })
  showQrCode.value = false
  emit('changeStep', 'wallet')
}

const extension = ref(null)
const showQrCode = ref(false)
const loading = ref(false)

watch(
  () => store.interChainObject?.selectedExtension,
  (value) => {
    if (value) {
      showQrCode.value = value !== 'extension' ? true : false
      makeConnection()
    }
  }
)

onMounted(() => {
  setTimeout(() => {
    makeConnection()
  }, 200)
})

const getWallet = (walletType: string) => {
  const wallet = wallets.find((wallet) => wallet.type === walletType)
  return wallet
}

const interChainResultObject = reactive({
  walletObj: null,
  walletAddress: null,
  signProof: null,
  isSignedVerified: false,
  network: 'interchain',
  chainId: null
})

const getRpcAndGasPriceByType = (type: any) => {
  for (const obj of chains) {
    if (obj.type === type) {
      return {
        rpc: obj.rpc,
        gasPrice: obj.gasPrice
      }
    }
  }
  return null
}

const makeConnection = async () => {
  loading.value = true
  let chainInfo = []

  const chainObj = getRpcAndGasPriceByType(store.interChainObject.selectedChain)

  chainInfo.push({
    chainId: store.interChainObject.selectedChain,
    rpc: chainObj ? chainObj.rpc : null,
    gasPrice: chainObj ? chainObj.gasPrice : null
  })

  interChainResultObject.walletObj = await CONTROLLERS[
    store.interChainObject.selectedWallet
  ].connect(store.interChainObject.selectedExtension, chainInfo)

  interChainResultObject.walletAddress = Object.fromEntries(interChainResultObject.walletObj)[
    store.interChainObject.selectedChain
  ].address

  interChainObject.walletObj = interChainResultObject.walletObj
}

watch(
  () => interChainResultObject.walletAddress,
  async (value) => {
    if (value) {
      emit('getWalletAddress', interChainResultObject)
      if (props.options.isPerformAction) {
        signArbitrary()
      } else {
        getSignature()
      }
    }
  },
  { deep: true }
)

watch(
  () => interChainResultObject.isSignedVerified,
  (value) => {
    if (value) {
      loading.value = false
      emit('justClose')
    }
  },
  { deep: true }
)

const WC_PROJECT_ID = '2b7d5a2da89dd74fed821d184acabf95'

const CONTROLLERS = {
  [WalletName.KEPLR]: new KeplrController(WC_PROJECT_ID),
  [WalletName.LEAP]: new LeapController(WC_PROJECT_ID)
}

const signArbitrary = async () => {
  try {
    loading.value = true

    const wallet = Object.fromEntries(interChainResultObject.walletObj)[
      store.interChainObject.selectedChain
    ]

    const payload = {
      signType: 'cosmos',
      localDidDoc: store.walletOptions.didDocument,
      wallet: wallet
    }

    const { proof, verifed } = await addWallet(payload)

    interChainResultObject.signProof = proof
    interChainResultObject.isSignedVerified = verifed

    emit('getSignedData', interChainResultObject)
    emit('justClose')
  } catch (err) {
    console.log(err)
    emit('close')
  }
}

const getSignature = async () => {
  const wallet = Object.fromEntries(interChainResultObject.walletObj)[
    store.interChainObject.selectedChain
  ]

  const payload = {
    chainId: wallet.pubKey.data.chainId,
    address: wallet.address,
    clientSpec: 'cosmos-ADR036',
    suiteType: 'cosmos',
    wallet: wallet
  }

  const { proof, verifed } = await signData(payload)

  interChainResultObject.signProof = proof
  interChainResultObject.isSignedVerified = verifed

  emit('getSignedData', interChainResultObject)

  emit('justClose')
}
</script>
