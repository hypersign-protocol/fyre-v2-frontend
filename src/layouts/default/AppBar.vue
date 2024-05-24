<template>
  <v-toolbar fixed flat height="100" class="header__wrapper">
    <template v-slot:prepend>
      <a class="cursor-pointer logo" @click="router.push({ path: '/' })"
        ><img src="@/assets/images/logo.svg" height="60"
      /></a>
    </template>
    <template v-slot:append>
      <div class="mr-6" v-if="!mobile">
        <v-btn
          class="cursor-pointer"
          v-for="(item, index) in menu"
          :key="index"
          @click="router.push({ path: `${item.link}` })"
          :class="isActive(item) ? 'text-blue-100' : 'text-gray-100'"
          >{{ item.title }}
        </v-btn>
      </div>
      <v-btn
        color="secondary"
        variant="flat"
        class="cursor-pointer login-button"
        @click="showLogin"
        v-if="!isUserLoggedIn"
      >
        Login
      </v-btn>

      <template v-if="mobile">
        <v-app-bar-nav-icon id="website-menu-activator" class="mr-3"></v-app-bar-nav-icon>

        <v-menu activator="#website-menu-activator">
          <v-list density="compact" class="menu__wrap">
            <v-list-item
              v-for="(item, i) in menu"
              :key="i"
              :value="item"
              color="white"
              base-color="#ADB9C7"
              @click="navigate(item)"
            >
              <v-list-item-title class="font-14" v-text="item.title"></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <template v-if="isUserLoggedIn">
        <v-avatar id="menu-activator" class="cursor-pointer">
          <v-img v-if="userMeta?.avatar" :src="userMeta?.avatar"></v-img>
          <v-img v-else src="@/assets/images/user-profile.png"></v-img>
        </v-avatar>

        <v-menu activator="#menu-activator">
          <v-list density="compact" class="menu__wrap">
            <v-list-subheader class="text-center">
              Welcome,
              <strong v-if="userMeta?.userName">{{ userMeta?.userName }}</strong>
              <strong v-else>User</strong>
            </v-list-subheader>
            <v-list-item
              v-for="(item, i) in userMenu"
              :key="i"
              :value="item"
              color="white"
              base-color="#ADB9C7"
              @click="navigate(item)"
            >
              <template v-slot:prepend>
                <v-icon class="pr-2" :icon="item.icon"></v-icon>
              </template>
              <v-list-item-title class="font-14" v-text="item.title"></v-list-item-title>
            </v-list-item>

            <v-btn class="logout-btn" @click="logout()">Log Out</v-btn>
          </v-list>
        </v-menu>
      </template>
    </template>
  </v-toolbar>
  <template v-if="!isUserLoggedIn">
    <BlockChainWallet
      :options="options"
      @emitProvider="getProvider"
      @emitWalletAddress="collectWalletAddress"
      @emitSignedData="collectSignedData"
    />
    <div id="update-challenge" @click="postChallenge(challenge)"></div>
    <div id="emit-options" @click="emitOptions(options)"></div>
  </template>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref, onMounted, computed, watch, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
const router = useRouter()
const route = useRoute()
import { useAuthStore } from '@/store/auth.ts'
import { getUser } from '@/composables/jwtService.ts'

const authStore = useAuthStore()
const { challenge, userMeta } = storeToRefs(useAuthStore())

const user = computed(() => {
  return getUser()
})

const options = reactive({
  showBwModal: false,
  providers: ['evm', 'interchain'],
  chains: [],
  isAuth: true,
  isRequiredDID: true,
  isPerformAction: false,
  didDocument: user.value.didDocument,
  addVerificationMethod: false,
  selectedNetwork: null
})

const isUserLoggedIn = computed(() => {
  return localStorage.getItem('accessToken')
})

const userMenu = ref([
  { title: 'Home', icon: 'mdi-home-outline', link: '/' },
  { title: 'My Profile', icon: 'mdi-account-outline', link: '/profile' },
  { title: 'My Rewards', icon: 'mdi-gift-outline', link: '/rewards' }
])

const menu = ref([
  {
    title: 'Home',
    link: '/',
    slug: '/'
  },
  {
    title: 'Explore',
    link: '/explore',
    slug: '/explore'
  }
])

watch(
  () => authStore.challenge,
  (value: any) => {
    options.challenge = value.challenge
    document.getElementById('update-challenge').click()
  },
  { deep: true }
)

watch(
  () => authStore.loginRes,
  (value: any) => {
    localStorage.setItem('accessToken', value)
    setTimeout(async () => {
      await authStore.USER_AUTHORIZE()
      location.reload()
    })
  },
  { deep: true }
)

const navigate = (item: any) => {
  window.location.href = `${item.link}`
}

const showLogin = () => {
  options.showBwModal = true
  document.getElementById('emit-options').click()
  document.getElementById('update-challenge').click()
}

const getProvider = async (data: any) => {
  if (data) {
    await authStore.USER_LOGIN(`?provider=${data}-wallet`)
  } else {
    console.log('Please select the provider before you proceed')
  }
}

const collectWalletAddress = async (data: any) => {}

const collectSignedData = async (data: any) => {
  if (data.signProof) {
    await authStore.USER_AUTHENTICATE({ signedDid: data.signProof })
  } else {
    console.log('Please select the provider before you proceed')
  }
}

const currentRouteName = computed(() => {
  return route.name
})

const logout = () => {
  localStorage.clear()
  location.reload()
}

const isActive = (item: any) => {
  return currentRouteName.value === item.link
}
</script>
