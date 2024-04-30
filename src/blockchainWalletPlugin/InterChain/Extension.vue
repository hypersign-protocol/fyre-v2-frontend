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

import { docloader, initializeDidSDK, signData } from '../utils'
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
  console.log(props.options)
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
  walletObj: null,
  walletAddress: null,
  signProof: null,
  isSignedVerified: false
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
}

watch(
  () => interChainResultObject.walletAddress,
  async (value) => {
    if (value) {
      console.log(`Wallet Address: ${value}`)
      emit('getWalletAddress', value)
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
  (value) => {
    console.log(value)
  }
)

watch(
  () => interChainResultObject.signProof,
  (value) => {
    console.log(value)
  }
)

watch(
  () => interChainResultObject.isSignedVerified,
  (value) => {
    console.log(value)
    if (value) {
      loading.value = false
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

const verifyBlockchainAccountId = (didDoc, provider, chainId, chainAddress) => {
  const verificationMethods = didDoc.verificationMethod

  for (const method of verificationMethods) {
    if (
      method.blockchainAccountId &&
      method.blockchainAccountId.startsWith(`${provider}:${chainId}:${chainAddress}`)
    ) {
      return true // Found matching blockchainAccountId
    }
  }

  return false // Not found
}

// Example usage:
// const didDoc = JSON.parse(localStorage.getItem("user")).didDocument;
// const chainId = 'cosmoshub-4';
// const chainAddress = 'cosmos1exvdggfhft0vr3x5qlmq025j6zf2qzl4rrgwjj';

// const isBlockchainAccountIdVerified = verifyBlockchainAccountId(didDoc, provider, chainId, chainAddress);
// console.log(isBlockchainAccountIdVerified);

const signArbitrary = async () => {
  try {
    loading.value = true

    const wallet = Object.fromEntries(interChainResultObject.walletObj)[
      store.interChainObject.selectedChain
    ]

    console.log(wallet)

    let chainId, address, publicKey, blockchainAccountId, provider, suite

    if (wallet.pubKey) {
      // Assuming wallet.pubKey exists for Cosmos

      chainId = wallet.pubKey.data.chainId
      address = wallet.address
      publicKey = base58btc.encode(wallet.pubKey.data.key)
      blockchainAccountId = `cosmos:${chainId}:${interChainResultObject.walletAddress}`
      const prefix = address.split('1')[0]
      suite = new EcdsaSecp256k1Signature2019({
        chainId,
        provider: wallet.ext ? wallet.ext : wallet.wc,
        bech32AddressPrefix: prefix
      })
    } else {
      chainId = getAccount(wagmiConfig).chainId
      address = getAccount(wagmiConfig).address
      // publicKey = base58btc.encode(wallet.pubKey.data.key);
      blockchainAccountId = `eip155:${chainId}:${interChainResultObject.walletAddress}`
      provider = await reactiveConnector.connector.connector.getProvider()
      suite = new EthereumEip712Signature2021({}, { _provider: provider })
    }

    console.log(chainId)

    const hsSDK = initializeDidSDK()

    // const didDoc = await hsSDK.createByClientSpec({
    //   address,
    //   publicKey,
    //   methodSpecificId: address,
    //   chainId,
    //   clientSpec: wallet.pubKey ? 'cosmos-ADR036' : 'eth-personalSign'
    // });

    const localDidDoc = JSON.parse(localStorage.getItem('user')).didDocument

    const isBlockchainAccountIdVerified = verifyBlockchainAccountId(
      localDidDoc,
      'cosmos',
      chainId,
      wallet.address
    )
    console.log(isBlockchainAccountIdVerified)

    console.log({
      didDocument: localDidDoc,
      type: wallet.pubKey
        ? 'EcdsaSecp256k1VerificationKey2019'
        : 'EcdsaSecp256k1RecoveryMethod2020',
      id: `${localDidDoc.id}#key-2`,
      controller: localDidDoc.controller,
      blockchainAccountId,
      publicKeyMultibase: wallet.pubKey ? base58btc.encode(wallet.pubKey.data.key) : undefined
    })

    if (!isBlockchainAccountIdVerified) {
      const addVerification = await hsSDK.addVerificationMethod({
        didDocument: localDidDoc,
        type: wallet.pubKey
          ? 'EcdsaSecp256k1VerificationKey2019'
          : 'EcdsaSecp256k1RecoveryMethod2020',
        id: `${localDidDoc.id}#key-2`,
        controller: localDidDoc.controller,
        blockchainAccountId,
        publicKeyMultibase: wallet.pubKey ? base58btc.encode(wallet.pubKey.data.key) : undefined
      })
    }

    console.log(localDidDoc)

    const signed = await jsSig.sign(localDidDoc, {
      suite,
      purpose: new purposes.AssertionProofPurpose({
        controller: {
          '@context': ['https://w3id.org/security/v2'],
          id: `${localDidDoc.id}#key-2`,
          assertionMethod: localDidDoc.authentication
        }
      }),
      documentLoader: docloader
    })

    console.log(signed)
    interChainResultObject.signProof = signed

    const verify = await jsSig.verify(signed, {
      suite,
      purpose: new purposes.AssertionProofPurpose({
        controller: {
          '@context': ['https://w3id.org/security/v2'],
          id: `${localDidDoc.id}#key-2`,
          assertionMethod: localDidDoc.authentication
        }
      }),
      documentLoader: docloader
    })

    console.log(verify)
    interChainResultObject.isSignedVerified = verify

    emit('getSignedData', interChainResultObject)
  } catch (err) {
    console.log(err)
    alert(err.message)
  } finally {
    loading.value = false
    props.options.showBwModal = false
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
}
</script>
