<template>
  <v-card color="rgba(28, 29, 41, 1)" theme="dark" min-height="280" class="rounded-xl py-0">
    <v-card-actions class="pa-2 d-flex align-center justify-space-between">
      <v-btn icon="mdi-arrow-left" @click="prevStep"></v-btn>
      <p class="font-weight-bold">{{ getWallet(interChainObject.selectedWallet).name }}</p>
      <v-btn icon="mdi-close" @click="$emit('close')"> </v-btn>
    </v-card-actions>
    <v-divider></v-divider>
    <div class="d-flex align-center justify-center fill-height pa-6" v-if="loading">
      <v-progress-circular
        class="d-flex align-center justify-center"
        alicolor="primary"
        size="32"
        indeterminate
      ></v-progress-circular>
    </div>
  </v-card>
</template>
<script lang="ts" setup>
import { ref, watch, computed, reactive, toRef, toRefs, onMounted } from 'vue'
import { purposes } from 'jsonld-signatures'
import jsSig from 'jsonld-signatures'
import { base58btc } from 'multiformats/bases/base58'
import { EcdsaSecp256k1Signature2019 } from 'keplr-ecdsasecp256k1signature2019'

import { docloader, initializeDidSDK, signData, addWallet } from '../utils'
import { getImageUrl } from '../composables/general.ts'
import { getGasPrice } from '../composables/gasUtils.ts'
import { getRpc } from '../composables/rpcUtils.ts'
import { chains } from '../composables/chainsData.ts'

import { storeToRefs } from 'pinia'
import { useInterChainStore } from '../stores/interchain'
const store = useInterChainStore()

const { interChainObject, challenge } = storeToRefs(store)

import { wallets } from '../composables/walletData.ts'

import {
  CompassController,
  ConnectedWallet,
  CosmostationController,
  KeplrController,
  LeapController,
  MetamaskInjectiveController,
  NinjiController,
  StationController,
  WalletController,
  WalletName,
  WalletType
} from 'cosmes/wallet'
import { Buffer } from 'buffer'

const emit = defineEmits(['changeStep', 'close', 'getSignedData'])

const props = defineProps({
  text: { type: String, required: false },
  options: {
    type: Object,
    default() {
      return {}
    }
  }
})

const prevStep = (item) => {
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
  () => store.interChainObject.selectedExtension,
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

const getRpcAndGasPriceByType = (type) => {
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
  }
)

watch(
  () => store.walletOptions,
  (value) => {}
)

watch(
  () => interChainResultObject.isSignedVerified,
  (value) => {
    if (value) {
      loading.value = false
      emit('close')
    }
  }
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
    emit('close')
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
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

  emit('close')
}
</script>
