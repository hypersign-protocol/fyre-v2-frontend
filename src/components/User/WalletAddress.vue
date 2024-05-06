<template>
  <div class="profile__setting__container">
    <p class="title">Network Lists</p>
    <Loader v-if="loading" />
    <v-row v-if="!loading">
      <v-col cols="12" sm="6" md="6" lg="4" xl="4" v-for="(item, index) in items">
        <div class="wallet__address__container" :class="checkIfExists(item) ? 'address' : ''">
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
            <v-btn
              v-if="!item.address"
              color="secondary"
              variant="flat"
              @click="connectWallet(item)"
              >Connect Wallet</v-btn
            >
            <v-btn v-if="item.address" color="white" variant="text" class="btn-copy">
              {{ getAddress(item.address) }}
              <v-icon @click="copyContent(item.address)" class="ml-2" size="15"
                >mdi-content-copy</v-icon
              >
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
    @emitSignedData="collectSignedData"
  />
  <div id="emit-options" @click="emitOptions(options)"></div>
  <div id="receive-options" @click="receiveSignedData"></div>
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
const router = useRouter()
const store = useAuthStore()

const user = computed(() => {
  return getUser()
})

const options = reactive({
  showBwModal: false,
  providers: ['evm', 'interchain'],
  chains: [''],
  isRequiredDID: false,
  isPerformAction: true,
  didDocument: user.value.didDocument,
  addVerificationMethod: true
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

const getProvider = async (data) => {
  formData.chainName = data === 'evm' ? 'EVM' : 'COSMOS'
}

const collectWalletAddress = async (data) => {
  console.log(data)
  formData.walletAddress = data.walletAddress
}

const collectSignedData = async (data) => {
  console.log(data)
  formData.walletAddress = data.walletAddress
  formData.signedDidDoc = data.signProof
  console.log(formData)
}

watch(
  () => formData,
  (value: any) => {
    console.log(value)
    if (value.walletAddress !== null && value.signedDidDoc !== null) {
      updateWallet()
    }
  },
  { deep: true }
)

watch(
  () => store.userProfileResponse,
  (value: any) => {
    console.log(value)
    loading.value = false
    saveUser(value)
    setTimeout(async () => {
      checkWalletStatus()
    }, 100)
  },
  { deep: true }
)

const updateWallet = () => {
  setTimeout(async () => {
    await store.UPDATE_USER_PROFILE(formData)
  }, 100)
}

const connectWallet = async (item) => {
  options.providers = item.provider === 'cosmos' ? ['interchain'] : ['evm']
  options.chains = [item.chainId]

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
  let itemFound = null
  for (const item of addresses) {
    if (item.blockchainAccountId.includes(searchString)) {
      itemFound = item
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
  const result = `${firstFour}....${lastFour}`
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
    image: new URL(`@/assets/images/task/archway.png`, import.meta.url).href,
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
