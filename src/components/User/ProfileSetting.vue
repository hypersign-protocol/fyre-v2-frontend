<template>
  <Loader v-if="loading" />
  <div class="profile__setting__container" v-if="!loading">
    <p class="title">Avatar</p>
    <v-hover v-slot="{ isHovering, props }" v-if="userMeta.avatar">
      <v-avatar v-bind="props">
        <v-img :src="userMeta.avatar" class="rounded-circle">
          <div class="d-flex align-center justify-center h-100" v-if="isHovering">
            <v-btn
              @click="openFilePicker"
              color="blue"
              icon="mdi-upload-outline"
              variant="text"
            ></v-btn>
          </div>
        </v-img>
      </v-avatar>
    </v-hover>
    <v-hover v-slot="{ isHovering, props }" v-if="!userMeta.avatar">
      <v-avatar v-bind="props">
        <v-img src="@/assets/images/user-profile.png" class="rounded-circle">
          <div class="d-flex align-center justify-center h-100" v-if="isHovering">
            <v-btn
              @click="openFilePicker"
              color="blue"
              icon="mdi-upload-outline"
              variant="text"
            ></v-btn>
          </div>
        </v-img>
      </v-avatar>
    </v-hover>
    <input
      type="file"
      multiple
      id="filePicker"
      @change="onFileChange($event.target.name, $event.target.files)"
      style="display: none"
    />
    <v-form @submit.prevent>
      <div>
        <label>User Name</label>
        <v-text-field v-model="userMeta.userName" hide-details="auto" variant="solo"></v-text-field>
      </div>
      <div class="button__wrapper">
        <v-btn variant="outlined" color="secondary">Cancel</v-btn>

        <v-btn
          color="secondary"
          variant="flat"
          :disabled="loading"
          :loading="loading"
          @click="updateProfile"
          >Save</v-btn
        >
      </div>
      <v-btn variant="text" class="text-red-100" @click="deletePopup = true">
        <v-icon>mdi-delete</v-icon>
        Delete the account permanently
      </v-btn>
    </v-form>
  </div>
  <DeleteModal @close="deletePopup = false" v-model="deletePopup" />
  <BlockChainWallet
    :options="options"
    @emitWalletAddress="collectWalletAddress"
    @emitSignedData="collectSignedData"
  />
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
  shallowReactive,
  reactive
} from 'vue'
import { useAuthStore } from '@/store/auth.ts'
import { useNotificationStore } from '@/store/notification.ts'

import { getUser, saveUser } from '@/composables/jwtService.ts'
import { removeDuplicatesInSignedDidDoc } from '@/composables/general.ts'
import { storeToRefs } from 'pinia'

const { userMeta, fileUpload } = storeToRefs(useAuthStore())

const router = useRouter()
const store = useAuthStore()
const notificationStore = useNotificationStore()
const deletePopup = ref(false)
const loading = ref(false)
const avatar = ref(null)
const userName = ref(null)

const formData = reactive({
  walletAddress: null,
  signedDidDoc: null
})

const getProvider = async (data) => {
  if (data) {
    await store.USER_LOGIN(`?provider=${data}-wallet`)
  } else {
    console.log('Please select the provider before you proceed')
  }
}

const collectWalletAddress = async (data) => {
  formData.walletAddress = data.walletAddress
}

const collectSignedData = async (data) => {
  formData.walletAddress = data.walletAddress
  data.signProof.alsoKnownAs.push(store.userMeta.userName)
  data.signProof.alsoKnownAs = [...new Set(data.signProof.alsoKnownAs)]
  formData.signedDidDoc = removeDuplicatesInSignedDidDoc(data.signProof)
}

watch(
  () => store.userMeta,
  (value: any) => {
    setTimeout(() => {
      loading.value = false
    }, 400)
  },
  { deep: true }
)

onMounted(async () => {
  await fetchUserData()
})

const fetchUserData = async () => {
  loading.value = true
  setTimeout(async () => {
    await store.USER_AUTHORIZE()
  }, 200)
}

const options = reactive({
  showBwModal: false,
  providers: ['evm', 'interchain'],
  chains: ['mainnet', 'bsc', 'polygon', 'cosmos', 'osmosis'],
  isRequiredDID: true,
  isPerformAction: true,
  didDocument: store.userMeta.didDocument,
  addVerificationMethod: false,
  selectedNetwork: null
})

watch(
  () => store.fileUpload,
  (value: any) => {
    console.log(value)
    store.userMeta.avatar = value.publicUrl
  },
  { deep: true }
)

watch(
  () => store.userProfileResponse,
  (value: any) => {
    loading.value = false
    fetchUserData()
  },
  { deep: true }
)

watch(
  () => formData.signedDidDoc,
  (value: any) => {
    console.log(value)
    if (value) {
      updateProfileSendRequest()
    }
  },
  { deep: true }
)

const updateProfile = () => {
  if (store.userMeta.userName) {
    const vm = store.userMeta.didDocument.verificationMethod[0]
    const chainId = vm.blockchainAccountId.split(':')[1]
    if (vm.blockchainAccountId.includes('eip')) {
      options.selectedNetwork = 'evm'
    } else {
      options.selectedNetwork = 'interchain'
    }
    options.didDocument = store.userMeta.didDocument
    options.showBwModal = true
    setTimeout(async () => {
      document.getElementById('emit-options').click()
    }, 100)
    loading.value = true
  } else {
    notificationStore.SHOW_NOTIFICATION({
      show: true,
      type: 'error',
      message: 'Please enter name'
    })
  }
}

const updateProfileSendRequest = () => {
  if (formData.walletAddress !== null && formData.signedDidDoc !== null) {
    setTimeout(async () => {
      await store.UPDATE_USER_PROFILE({
        editMode: 'profile',
        userName: store.userMeta.userName,
        avatar: store.userMeta.avatar,
        signedDidDoc: formData.signedDidDoc
      })
    }, 100)
  }
}

const openFilePicker = () => {
  document.getElementById('filePicker').click()
}

const onFileChange = async (fieldName, files) => {
  let formData = new FormData()

  for (let file of files) {
    formData.append('file', file, file.name)
  }

  try {
    await store.FILE_UPLOAD(formData)
  } catch (e) {
    console.log('error: ', e)
  }
}
</script>
