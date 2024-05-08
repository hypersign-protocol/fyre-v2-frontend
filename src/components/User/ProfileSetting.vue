<template>
  <Loader v-if="loading" />
  <div class="profile__setting__container" v-if="!loading">
    <p class="title">Avatar</p>
    <v-hover v-slot="{ isHovering, props }" v-if="avatar">
      <v-avatar v-bind="props">
        <v-img :src="avatar" class="rounded-circle">
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
    <v-hover v-slot="{ isHovering, props }" v-if="!avatar">
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
        <v-text-field v-model="userName" hide-details="auto" variant="solo"></v-text-field>
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
    @getWalletAddress="collectWalletAddress"
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
import { storeToRefs } from 'pinia'

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
  formData.signedDidDoc = data.signProof
  formData.signedDidDoc.alsoKnownAs.push(userName.value)
  console.log(formData)
}

const user = computed(() => {
  const res = getUser()
  avatar.value = res.avatar
  userName.value = res.userName
  return res
})

watch(
  () => user.value,
  (value: any) => {
    console.log(value)
  },
  { deep: true }
)

const options = reactive({
  showBwModal: false,
  providers: ['evm', 'interchain'],
  chains: ['mainnet', 'bsc', 'polygon', 'cosmos', 'osmosis'],
  isRequiredDID: true,
  isPerformAction: true,
  didDocument: user.value.didDocument,
  addVerificationMethod: false
})

const { userMeta, fileUpload } = storeToRefs(useAuthStore())

watch(
  () => store.fileUpload,
  (value: any) => {
    console.log(value)
    avatar.value = value.publicUrl
  },
  { deep: true }
)

watch(
  () => store.userProfileResponse,
  (value: any) => {
    loading.value = false
    saveUser(value)
  },
  { deep: true }
)

watch(
  () => formData,
  (value: any) => {
    console.log(value)
    if (value.walletAddress !== null && value.signedDidDoc !== null) {
      updateProfileSendRequest()
    }
  },
  { deep: true }
)

const updateProfile = () => {
  
  if(userName.value){
    const vm = user.value.didDocument.verificationMethod[0]
    const chainId = vm.blockchainAccountId.split(':')[1]
    if (vm.blockchainAccountId.includes('eip')) {
      options.providers = ['evm']
    } else {
      options.providers = ['interchain']
    }
    setTimeout(async () => {
      document.getElementById('emit-options').click()
    }, 100)
    loading.value = true
  }else{
     notificationStore.SHOW_NOTIFICATION({
      show: true,
      type: 'error',
      message: 'Please enter name'
    })
  }
}

const updateProfileSendRequest = () => {
  setTimeout(async () => {
    await store.UPDATE_USER_PROFILE({
      editMode: 'profile',
      userName: userName.value,
      avatar: avatar.value,
      signedDidDoc: formData.signedDidDoc
    })
  }, 100)
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
