<template>
  <div class="profile__setting__container">
    <p class="title">Network Lists</p>
    <v-row>
      <v-col cols="12" sm="6" md="6" lg="4" xl="4" v-for="(item, index) in items">
        <div class="wallet__address__container base-style" :class="item.handle ? 'address' : ''">
          <div class="wallet__header">
            <div class="wallet__meta">
              <img :src="item.image" />
              <p>{{ item.title }}</p>
            </div>
            <div class="wallet__action" v-if="item.handle">
              <v-icon>mdi-dots-vertical</v-icon>
            </div>
          </div>
          <div class="wallet__footer">
            <template v-if="item.title === 'Twitter'">
              <v-btn
                v-if="!user.socials?.twitterHandle"
                color="white"
                variant="flat"
                @click="socialConnect(item)"
                >Connect</v-btn
              >
              <template v-if="user.socials?.twitterHandle">
                <v-btn
                  color="white"
                  variant="text"
                  class="btn-copy base-btn"
                  @click="copyContent(user.socials?.twitterHandle)"
                >
                  {{ user.socials?.twitterHandle }}
                  <img src="@/assets/images/content-copy.svg" class="ml-2" />
                </v-btn>
              </template>
            </template>

            <template v-if="item.title === 'Discord'">
              <v-btn
                v-if="!user.socials?.discordHandle"
                color="white"
                variant="flat"
                @click="socialConnect(item)"
                >Connect</v-btn
              >
              <template v-if="user.socials?.discordHandle">
                <v-btn color="white" variant="text" class="btn-copy">
                  {{ user.socials?.discordHandle }}
                  <img src="@/assets/images/content-copy.svg" class="ml-2" />
                </v-btn>
              </template>
            </template>

            <template v-if="item.title === 'Telegram'">
              <v-btn
                v-if="!user.socials?.telegramHandle"
                color="white"
                variant="flat"
                @click="socialConnect(item)"
                >Connect</v-btn
              >
              <template v-if="user.socials?.telegramHandle">
                <v-btn color="white" variant="text" class="btn-copy">
                  {{ user.socials?.telegramHandle }}
                  <img src="@/assets/images/content-copy.svg" class="ml-2" />
                </v-btn>
              </template>
            </template>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
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

import { webAuth } from '@/composables/twitterAuth.ts'
import { useAuthStore } from '@/store/auth.ts'
import { getUser, saveUser } from '@/composables/jwtService.ts'
import { copyContent } from '@/composables/general.ts'

const store = useAuthStore()

const user = computed(() => {
  return getUser()
})

const formData = reactive({
  socialType: null,
  selectedSocial: null,
  socialAccessToken: null,
  tgUserId: null,
  editMode: 'social'
})

const loading = ref(false)

const socialConnect = (item) => {
  formData.selectedSocial = item
  formData.socialType = item.title
  if (item.title === 'Twitter') {
    twitterConnection()
  } else if (item.title === 'Discord') {
    discordConnection()
  } else if (item.title === 'Telegram') {
    telegramConnection()
  }
}

const telegramConnection = () => {
  window.Telegram.Login.auth(
    { bot_id: import.meta.env.VITE_APP_TELEGRAM_BOT_ID, request_access: true },
    (data) => {
      console.log(data)
      if (data) {
        formData.tgUserId = data.id
      } else {
        console.log('Something went wrong')
      }
    }
  )
}

const discordConnection = () => {
  webAuth.popup.authorize(
    {
      connection: 'discord',
      owp: true
    },
    (err, response) => {
      if (response) {
        formData.socialAccessToken = response.accessToken
      } else {
        console.log('Something went wrong')
      }
    }
  )
}

const twitterConnection = () => {
  webAuth.popup.authorize(
    {
      connection: 'twitter',
      owp: true
    },
    (err, response) => {
      if (response) {
        formData.socialAccessToken = response.accessToken
      } else {
        console.error(err)
        console.log('Something went wrong')
      }
    }
  )
}

watch(
  () => formData.socialAccessToken,
  (value: any) => {
    console.log(value)
    updateSocialProfile()
  },
  { deep: true }
)

watch(
  () => formData.tgUserId,
  (value: any) => {
    console.log(value)
    updateSocialProfile()
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

const updateSocialProfile = () => {
  setTimeout(async () => {
    delete formData.selectedSocial
    await store.UPDATE_USER_PROFILE(formData)
  }, 100)
}

const items = ref([
  // {
  //   title: 'Mail',
  //   image: new URL(`@/assets/images/email-filled.png`, import.meta.url).href,
  //   handle: 'jhon@xyz.com'
  // },
  {
    title: 'Discord',
    address: null,
    image: new URL(`@/assets/images/discord.png`, import.meta.url).href,
    isAddress: false
  },
  {
    title: 'Twitter',
    address: null,
    image: new URL(`@/assets/images/twitter.png`, import.meta.url).href,
    isAddress: false
  },
  {
    title: 'Telegram',
    address: null,
    image: new URL(`@/assets/images/telegram.png`, import.meta.url).href,
    isAddress: false
  }
])
</script>
