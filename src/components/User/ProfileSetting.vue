<template>
  <div v-if="loading" class="height-500 d-flex align-center justify-center fill-height">
    <v-progress-circular
      class="d-flex align-center justify-center"
      alicolor="primary"
      size="64"
      indeterminate
    ></v-progress-circular>
  </div>
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
        <v-text-field v-model="user.userName" hide-details="auto" variant="solo"></v-text-field>
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
</template>
<script lang="ts" setup>
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useAuthStore } from '@/store/auth.ts'
import { getUser, saveUser } from '@/composables/jwtService.ts'
import { storeToRefs } from 'pinia'
const router = useRouter()
const store = useAuthStore()
const deletePopup = ref(false)
const loading = ref(false)
const avatar = ref(null)

const user = computed(() => {
  const res = getUser()
  avatar.value = res.avatar
  return res
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
    console.log(value)
    loading.value = false
    saveUser(value)
  },
  { deep: true }
)

const updateProfile = () => {
  loading.value = true
  user.value.didDocument.alsoKnownAs.push(user.value.userName)
  setTimeout(async () => {
    await store.UPDATE_USER_PROFILE({
      editMode: 'profile',
      userName: user.value.userName,
      avatar: avatar.value,
      signedDidDoc: user.value.didDocument
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
