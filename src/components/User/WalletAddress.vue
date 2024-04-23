<template>
  <div class="profile__setting__container">
    <p class="title">Network Lists</p>
    <v-row>
      <v-col cols="12" sm="6" md="6" lg="4" xl="4" v-for="(item, index) in items">
        <div class="wallet__address__container" :class="item.isAddress ? 'address' : ''">
          <div class="tag">{{ item.tag }}</div>
          <div class="wallet__header">
            <div class="wallet__meta">
              <img :src="item.image" />
              <p>{{ item.title }}</p>
            </div>
            <div class="wallet__action" v-if="!item.isAddress">
              <v-icon>mdi-dots-vertical</v-icon>
            </div>
          </div>
          <div class="wallet__footer">
            <v-btn
              v-if="!checkIfExists(item)"
              color="secondary"
              variant="flat"
              @click="connectWallet(item)"
              >Connect Wallet</v-btn
            >
            <v-btn v-if="checkIfExists(item)" color="white" variant="text" class="btn-copy">
              {{ item.address }}
              <img src="@/assets/images/content-copy.svg" class="ml-2" />
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
  <BlockChainWallet
    :options="options"
    @emitProvider="getProvider"
    @getWalletAddress="collectWalletAddress"
    @getSignedData="collectSignedData"
  />
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
import { storeToRefs } from 'pinia'
const router = useRouter()
const store = useAuthStore()

const options = reactive({
  showBwModal: false,
  providers: ['evm', 'interchain'],
  chains: [''],
  isRequiredDID: false,
  isPerformAction: true
})

const formData = reactive({
  walletAddress: null,
  chainName: null,
  signedDidDoc: null,
  walletPrefix: null,
  selectedWallet: null,
  editMode: 'wallet'
})

const loading = ref(false)

const user = computed(() => {
  return getUser()
})

const getProvider = async (data) => {
  formData.chainName = data === 'evm' ? 'EVM' : 'COSMOS'
}

const collectWalletAddress = async (data) => {
  formData.walletAddress = data
}

const collectSignedData = async (data) => {
  formData.signedDidDoc = data.signProof
  console.log(formData)
}

watch(
  () => formData.signedDidDoc,
  (value) => {
    if (value) {
      checkIfWalletExists()
    }
  }
)

watch(
  () => store.userProfileResponse,
  (value: any) => {
    console.log(value)
    loading.value = false
    saveUser(value)
  },
  { deep: true }
)

const updateWallet = () => {
  setTimeout(async () => {
    await store.UPDATE_USER_PROFILE(formData)
  }, 100)
}

const connectWallet = async (item) => {
  options.showBwModal = true
  formData.selectedWallet = item
  formData.walletPrefix = item.title
  formData.chainId = item.chainId
}

const checkIfWalletExists = async (item) => {
  const searchAccountId = `${formData.selectedWallet.provider}:${formData.selectedWallet.chainId}:${formData.selectedWallet.walletAddress}`
  const addresses = user.value.didDocument.verificationMethod
  const IfExists = accountIdExists(addresses, searchAccountId)

  if (!IfExists) {
    updateWallet()
  } else {
    console.log('Wallet Address is already connected')
  }
}

const checkIfExists = (item) => {
  const searchString = `${item.provider}:${item.chainId}`
  const addresses = user.value.didDocument.verificationMethod
  const IfExists = hasBlockchainAccountId(addresses, searchString)
  return IfExists
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

const items = ref([
  {
    title: 'Cosmos',
    address: '0xd42dc40cc6...7814a0da',
    tag: 'CONTROLLER',
    image: new URL(`@/assets/images/task/cosmos.png`, import.meta.url).href,
    isAddress: true,
    chainId: 'cosmoshub-4',
    provider: 'cosmos'
  },
  {
    title: 'Polygon',
    address: null,
    image: new URL(`@/assets/images/task/polygon.png`, import.meta.url).href,
    isAddress: false,
    chainId: 'eip155:1',
    provider: 'eip155'
  },
  {
    title: 'Ethereum',
    address: null,
    image: new URL(`@/assets/images/task/archway.png`, import.meta.url).href,
    isAddress: false,
    chainId: 'eip155:56',
    provider: 'eip155'
  },
  {
    title: 'Binance Smart Chain',
    address: null,
    image: new URL(`@/assets/images/task/binance.png`, import.meta.url).href,
    isAddress: false,
    chainId: 'eip155:137',
    provider: 'eip155'
  },
  {
    title: 'Comdex',
    address: null,
    image: new URL(`@/assets/images/task/comdex.png`, import.meta.url).href,
    isAddress: false,
    chainId: 'comdex-1',
    provider: 'cosmos'
  },
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
    title: 'Omniflex',
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
    chainId: 'osmos-1',
    provider: 'cosmos'
  }
])
</script>
