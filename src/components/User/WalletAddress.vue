<template>
  <Loader v-if="loading" />
  <div class="profile__setting__container" v-if="!loading">
    <p class="title">Network Lists</p>
    <v-row>
      <v-col cols="12" sm="6" md="6" lg="4" xl="4" v-for="(item, index) in items">
        <div class="wallet__address__container base-style" :class="checkIfExists(item) ? 'address' : ''">
          <div class="tag" v-if="item.address">Controller</div>
          <div class="wallet__header">
            <div class="wallet__meta">
              <img :src="item.image" />
              <p>{{ item.title }}</p>
            </div>
            <div class="wallet__action" v-if="!checkIfExists(item)">
              <v-icon>mdi-dots-vertical</v-icon>
            </div>
          </div>
          <div class="wallet__footer">
            <v-btn v-if="!item.address" color="white" variant="flat" @click="connectWallet(item)">Connect Wallet</v-btn>
            <v-btn class="base-btn" v-if="item.address" color="white" variant="text">
              {{ getAddress(item.address) }}
              <v-icon @click="copyContent(item.address)" class="ml-2" size="15">mdi-content-copy</v-icon>
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
  <BlockChainWallet :options="options" @emitProvider="getProvider" @emitWalletAddress="collectWalletAddress"
    @emitSignedData="collectSignedData" />
  <div id="emit-options" @click="emitOptions(options)"></div>
</template>
<script lang="ts" setup>
import {
  defineComponent,
  ref,
  onMounted,
  onBeforeUnmount,
  computed,
  watch,
  defineAsyncComponent
} from 'vue'

import { useAuthStore } from '@/store/auth.ts'
import { getUser, saveUser } from '@/composables/jwtService.ts'
import { copyContent } from '@/composables/general.ts'
import { storeToRefs } from 'pinia'
import { watchEffect } from 'vue'
const router = useRouter()
const store = useAuthStore()

const { userMeta, userProfileResponse } = storeToRefs(useAuthStore())

const loading = ref(false)

watch(
  () => store.userMeta,
  (value: any) => {
    setTimeout(() => {
      loading.value = false
    }, 400)
  },
  { deep: true }
)

onMounted(() => {
  loading.value = true
  fetchUserData()
})

const options = reactive({
  showBwModal: false,
  providers: ['evm', 'interchain'],
  chains: [''],
  isRequiredDID: false,
  isPerformAction: true,
  didDocument: store.userMeta.didDocument,
  addVerificationMethod: true,
  selectedNetwork: null
})

const formData = reactive({
  walletAddress: null,
  chainName: null,
  signedDidDoc: null,
  walletPrefix: null,
  selectedWallet: null,
  editMode: 'wallet'
})

const getProvider = async (data) => {
  formData.chainName = data === 'evm' ? 'EVM' : 'COSMOS'
}

const collectWalletAddress = async (data) => {
  console.log('Inside collectWalletAddress', data)

  formData.walletAddress = data.walletAddress
}

const collectSignedData = async (data) => {
  console.log('Inside collect Sign data method', data)

  formData.walletAddress = data.walletAddress
  formData.signedDidDoc = data.signProof

  if (formData.walletAddress !== null && formData.signedDidDoc !== null) {
    console.log('Before calling update wallet')

    updateWallet()
  } else {
    console.log('formData wallet and signDiddoc is null')
  }
}

const fetchUserData = async () => {
  setTimeout(async () => {
    await store.USER_AUTHORIZE()
    setTimeout(async () => {
      checkWalletStatus()
    }, 100)
  }, 200)
}

watchEffect(() => {
  if (store.userProfileResponse) {
    loading.value = false
    fetchUserData()
    formData.walletAddress = null
    formData.signedDidDoc = null
    delete options.didDocument.proof;
  }
})

const updateWallet = () => {
  setTimeout(async () => {
    console.log('Before calling store update user profile')

    await store.UPDATE_USER_PROFILE(formData)
  }, 100)
}

const connectWallet = async (item) => {
  options.selectedNetwork = item.provider === 'cosmos' ? 'interchain' : 'evm'
  options.chains = [item.chainId]
  options.showBwModal = true

  setTimeout(async () => {
    document.getElementById('emit-options').click()
  }, 100)

  formData.selectedWallet = item
  formData.walletPrefix = item.title
  formData.chainId = item.chainId
  formData.chainName = item.provider === 'cosmos' ? 'COSMOS' : 'EVM'
}

const checkIfWalletExists = async (item) => {
  const searchAccountId = `${formData.selectedWallet.provider}:${formData.selectedWallet.chainId}:${formData.selectedWallet.walletAddress}`
  const addresses = store.userMeta.didDocument.verificationMethod
  const IfExists = accountIdExists(addresses, searchAccountId)

  if (!IfExists) {
    updateWallet()
  } else {
    console.log('Wallet Address is already connected')
  }
}

const checkIfExists = (item) => {
  const searchString = `${item.provider}:${item.chainId}`
  const addresses = store.userMeta.didDocument.verificationMethod
  let itemFound = null
  let blockchainAccountIdItems = "";
  let blockchainText = "";
  for (const item of addresses) {
    if (item.blockchainAccountId) {
      blockchainAccountIdItems = item.blockchainAccountId.split(':');
      blockchainText = `${blockchainAccountIdItems[0]}:${blockchainAccountIdItems[1]}`;
      if (blockchainText == searchString) {
        itemFound = item
      }
    }

  }
  return itemFound
}

function hasBlockchainAccountId(data, searchString) {
  return data.some((item) => item.blockchainAccountId.includes(searchString))
}

const accountIdExists = (dataArray, accountId) => {
  for (const item of dataArray) {
    if (item.blockchainAccountId === accountId) {
      return true
    }
  }
  return false
}

const getAddress = (accountId) => {
  const segments = accountId.split(':')
  const lastSegment = segments[segments.length - 1]
  const firstFour = lastSegment.substring(0, 7)
  const lastFour = lastSegment.substring(lastSegment.length - 7)
  const result = `${firstFour}....${lastFour} `
  return result
}

onMounted(() => {
  checkWalletStatus()
})

const checkWalletStatus = () => {
  loading.value = true
  // Ensure that items.value is an array
  if (!Array.isArray(items.value)) {
    console.error('items.value is not an array.')
    return
  }

  for (const item of items.value) {
    const foundItem = checkIfExists(item)
    // Ensure that checkIfExists returns the correct result
    if (foundItem !== null && typeof foundItem === 'object') {
      item.address = foundItem.blockchainAccountId
      item.isAddress = true
    } else {
      item.address = null
      item.isAddress = false
    }
  }

  loading.value = false
}

const items = ref([
  {
    title: 'Cosmos',
    address: null,
    tag: 'CONTROLLER',
    image: new URL(`@/assets/images/task/cosmos.png`, import.meta.url).href,
    isAddress: false,
    chainId: 'cosmoshub-4',
    provider: 'cosmos'
  },
  {
    title: 'Polygon',
    address: null,
    image: new URL(`@/assets/images/task/polygon.png`, import.meta.url).href,
    isAddress: false,
    chainId: '137',
    provider: 'eip155'
  },
  {
    title: 'Ethereum',
    address: null,
    image: new URL(`@/assets/images/task/ethereum.png`, import.meta.url).href,
    isAddress: false,
    chainId: '1',
    provider: 'eip155'
  },
  {
    title: 'Binance Smart Chain',
    address: null,
    image: new URL(`@/assets/images/task/binance.png`, import.meta.url).href,
    isAddress: false,
    chainId: '56',
    provider: 'eip155'
  },
  // {
  //   title: 'Comdex',
  //   address: null,
  //   image: new URL(`@/assets/images/task/comdex.png`, import.meta.url).href,
  //   isAddress: false,
  //   chainId: 'comdex-1',
  //   provider: 'cosmos'
  // },
  {
    title: 'Nibiru',
    address: null,
    image: new URL(`@/assets/images/task/nibiru.png`, import.meta.url).href,
    isAddress: false,
    chainId: 'cataclysm-1',
    provider: 'cosmos'
  },
  {
    title: 'Archway',
    address: null,
    image: new URL(`@/assets/images/task/archway.png`, import.meta.url).href,
    isAddress: false,
    chainId: 'archway-1',
    provider: 'cosmos'
  },
  {
    title: 'Hypersign',
    address: null,
    image: new URL(`@/assets/images/task/hypersign.png`, import.meta.url).href,
    isAddress: false,
    chainId: 'prajna',
    provider: 'cosmos'
  },
  {
    title: 'Agoric',
    address: null,
    image: new URL(`@/assets/images/task/agoric.png`, import.meta.url).href,
    isAddress: false,
    chainId: 'agoric-3',
    provider: 'cosmos'
  },
  {
    title: 'Omniflix',
    address: null,
    image: new URL(`@/assets/images/task/omniflex.png`, import.meta.url).href,
    isAddress: false,
    chainId: 'omniflixhub-1',
    provider: 'cosmos'
  },
  {
    title: 'Secret',
    address: null,
    image: new URL(`@/assets/images/task/secret.png`, import.meta.url).href,
    isAddress: false,
    chainId: 'secret-4',
    provider: 'cosmos'
  },
  {
    title: 'Osmosis',
    address: null,
    image: new URL(`@/assets/images/task/osmosis.png`, import.meta.url).href,
    isAddress: false,
    chainId: 'osmosis-1',
    provider: 'cosmos'
  }
])
</script>
