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
      <!-- <template v-if="interChainResultObject.walletAddress">
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
      </template> -->
    </template>
  </v-card>
</template>
<script lang="ts" setup>
import { ref, watch, computed, reactive, toRef, toRefs, onMounted } from 'vue'
import { purposes } from 'jsonld-signatures'
import jsSig from 'jsonld-signatures'
import { base58btc } from 'multiformats/bases/base58'
import { EcdsaSecp256k1Signature2019 } from 'keplr-ecdsasecp256k1signature2019'

import { docloader, initializeDidSDK } from '../utils'
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
const projectId = import.meta.env.VITE_APP_WC_PROJECT_ID

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
  // interChainObject.selectedExtension = 'extension'
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
  console.log(store)

  interChainResultObject.walletObj = await CONTROLLERS[
    store.interChainObject.selectedWallet
  ].connect(store.interChainObject.selectedExtension, chainInfo)
  interChainResultObject.walletAddress = Object.fromEntries(interChainResultObject.walletObj)[
    store.interChainObject.selectedChain
  ].address
}

watch(
  () => interChainResultObject.walletAddress,
  async (value) => {
    if (value) {
      console.log(`Wallet Address: ${value}`)
      loading.value = false
      await signArbitrary()
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
  // [WalletName.STATION]: new StationController(),
  [WalletName.KEPLR]: new KeplrController(WC_PROJECT_ID),
  [WalletName.LEAP]: new LeapController(WC_PROJECT_ID)
  // [WalletName.COMPASS]: new CompassController(),
  // [WalletName.COSMOSTATION]: new CosmostationController(WC_PROJECT_ID),
  // [WalletName.METAMASK_INJECTIVE]: new MetamaskInjectiveController(),
  // [WalletName.NINJI]: new NinjiController()
}

const signArbitrary = async () => {
  const wallet = Object.fromEntries(interChainResultObject.walletObj)[
    store.interChainObject.selectedChain
  ]
  console.log(wallet)
  const publicKey = base58btc.encode(wallet.pubKey.data.key)
  const chainId = wallet.pubKey.data.chainId
  const address = wallet.address
  const hsSDK = initializeDidSDK()
  const didDoc = await hsSDK.createByClientSpec({
    address,
    publicKey,
    methodSpecificId: address,
    chainId,
    clientSpec: 'cosmos-ADR036'
  })

  const prefix = address.split('1')[0]
  try {
    const address = wallet.address

    const eds = new EcdsaSecp256k1Signature2019({
      chainId,
      provider: wallet.ext ? wallet.ext : wallet.wc,
      bech32AddressPrefix: prefix
    })
    const signed = await jsSig.sign(didDoc, {
      suite: eds,
      purpose: new purposes.AuthenticationProofPurpose({
        controller: {
          '@context': ['https://w3id.org/security/v2'],
          id: didDoc.verificationMethod[0].id,
          authentication: didDoc.authentication[0]
        },
        challenge: '123',
        domain: 'https://example.com'
      }),
      documentLoader: docloader
    })
    console.log(signed)
    const verify = await jsSig.verify(signed, {
      suite: new EcdsaSecp256k1Signature2019({
        chainId,
        bech32AddressPrefix: prefix
      }),
      purpose: new purposes.AuthenticationProofPurpose({
        controller: {
          '@context': ['https://w3id.org/security/v2'],
          id: didDoc.verificationMethod[0].id,
          authentication: didDoc.authentication[0]
        },
        challenge: '123',
        domain: 'https://example.com'
      }),
      documentLoader: docloader
    })
    console.log(verify)
  } catch (err) {
    console.error(err)
    alert(err.message)
  }
}
</script>
