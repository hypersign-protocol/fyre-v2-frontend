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
    <template v-if="!loading">
      <template v-if="interChainResultObject.walletAddress">
        <div class="d-flex flex-column align-center justify-center pa-5">
          <p class="font-weight-bold mb-2">Wallet Authentication Success.</p>
          <v-text-field
            v-model="interChainResultObject.arbitraryMessage"
            clearable
            variant="solo"
            class="w-100"
            bg-color="white"
            placeholder="Message"
          ></v-text-field>
          <v-btn rounded="xl" color="#303133" width="204" @click="signArbitrary"> Sign In </v-btn>
        </div>
      </template>
      <template v-else>
        <div class="bw3-modal_extension__wrapper my-4">
          <div
            class="extension__item cursor-pointer"
            :class="interChainObject.selectedExtension === 'walletconnect' ? 'active' : ''"
            @click="interChainObject.selectedExtension = 'walletconnect'"
          >
            <div class="image__wrap">
              <img src="../assets/images/smartphone.png" />
            </div>
            <div class="content__wrap">Mobile</div>
          </div>
          <div
            class="extension__item cursor-pointer"
            :class="interChainObject.selectedExtension === 'extension' ? 'active' : ''"
            @click="interChainObject.selectedExtension = 'extension'"
          >
            <div class="image__wrap">
              <img src="../assets/images/extension.png" />
            </div>
            <div class="content__wrap">Browser</div>
          </div>
        </div>
        <div v-if="showQrCode">
          <div class="bw3-modal_browser__wrap pa-5"></div>
        </div>
        <div v-if="!showQrCode">
          <div class="bw3-modal_browser__wrap pa-5">
            <div class="image__wrap">
              <img :src="getWallet(interChainObject.selectedWallet).image" />
            </div>
            <div class="content__wrap">
              <p>Continue in {{ getWallet(interChainObject.selectedWallet).name }}</p>
              <p>Accept connection request in the wallet</p>
            </div>
          </div>
        </div>
      </template>
    </template>
  </v-card>
</template>
<script lang="ts" setup>
import { ref, watch, computed, reactive, toRef, toRefs, onMounted } from 'vue'

import { getImageUrl } from '../composables/general.ts'
import { getGasPrice } from '../composables/gasUtils.ts'
import { getRpc } from '../composables/rpcUtils.ts'

import { storeToRefs } from 'pinia'
import { useInterChainStore } from '../stores/interchain'
const store = useInterChainStore()

const { interChainObject } = storeToRefs(store)

import { wallets } from '../composables/walletData.ts'
import { mainnet, bsc } from 'viem/chains'
import { getAccount, reconnect } from '@wagmi/core'
import {
  createWeb3Modal,
  defaultWagmiConfig,
  useWeb3Modal,
  useWeb3ModalEvents,
  useWeb3ModalState,
  useWeb3ModalTheme
} from '@web3modal/wagmi/vue'

// @ts-expect-error 1. Get projectId
const projectId = '46808fcc7a91e0856a6734652cf14fa2'

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

const emit = defineEmits(['changeStep', 'close'])

store.$subscribe((mutation, state) => {
  console.log(mutation, state)
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
  interChainObject.selectedExtension = 'extension'
  setTimeout(() => {
    makeConnection()
  }, 200)
})

const getWallet = (walletType: string) => {
  const wallet = wallets.find((wallet) => wallet.type === walletType)
  return wallet
}

const interChainResultObject = reactive({
  walletAddress: null,
  signature: null,
  arbitraryMessage: null,
  walletObj: null
})

const makeConnection = async () => {
  loading.value = true
  let chainInfo = []
  chainInfo.push({
    chainId: store.interChainObject.selectedChain,
    rpc: getRpc(store.interChainObject.selectedChain),
    gasPrice: getGasPrice(store.interChainObject.selectedChain)
  })
  console.log(chainInfo)

  interChainResultObject.walletObj = await CONTROLLERS[
    store.interChainObject.selectedWallet
  ].connect(store.interChainObject.selectedExtension, chainInfo)
  interChainResultObject.walletAddress = Object.fromEntries(interChainResultObject.walletObj)[
    store.interChainObject.selectedChain
  ].address
}

watch(
  () => interChainResultObject.walletAddress,
  (value) => {
    if (value) {
      console.log(`Wallet Address: ${value}`)
      setTimeout(() => {
        loading.value = false
      }, 200)
    }
  }
)

watch(
  () => interChainResultObject.signature,
  (value) => {
    if (value) {
      loading.value = false
      console.log(`Signature: ${value}`)
      localStorage.setItem('userLoggedIn', true)
      emit('close')
    }
  }
)

const WC_PROJECT_ID = '2b7d5a2da89dd74fed821d184acabf95'
const SIGN_ARBITRARY_MSG = Buffer.from(
  'Hi from CosmeES! This is a test message just to prove that the wallet is working.'
)
const TX_MEMO = 'signed via cosmes'

const CONTROLLERS = {
  [WalletName.STATION]: new StationController(),
  [WalletName.KEPLR]: new KeplrController(WC_PROJECT_ID),
  [WalletName.LEAP]: new LeapController(WC_PROJECT_ID),
  [WalletName.COMPASS]: new CompassController(),
  [WalletName.COSMOSTATION]: new CosmostationController(WC_PROJECT_ID),
  [WalletName.METAMASK_INJECTIVE]: new MetamaskInjectiveController(),
  [WalletName.NINJI]: new NinjiController()
}

const signArbitrary = async () => {
  if (interChainResultObject.arbitraryMessage) {
    loading.value = true
    console.log(interChainResultObject.walletObj)
    const wallet = Object.fromEntries(interChainResultObject.walletObj)[
      store.interChainObject.selectedChain
    ]
    console.log(wallet)
    try {
      const res = await wallet.signArbitrary(Buffer.from(interChainResultObject.arbitraryMessage))
      console.log(res)
      const data = Buffer.from(new Uint8Array(res.data)).toString('utf-8')
      res.data = data
      interChainResultObject.signature = res.signature
      alert('Sign success! Check console logs for details.')
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  } else {
    alert('Please enter Sign Arbitrary message before signing...')
  }
}
</script>
