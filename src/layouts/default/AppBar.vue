<template>
  <v-toolbar fixed flat height="100" class="header__wrapper">
    <template v-slot:prepend>
      <a class="cursor-pointer logo" @click="router.push({ path: '/' })"
        ><img src="@/assets/images/logo.svg" height="60"
      /></a>
    </template>
    <template v-slot:append>
      <v-btn
        v-if="!mobile"
        class="cursor-pointer"
        v-for="(item, index) in menu"
        @click="router.push({ path: `${item.link}` })"
        :class="isActive(item) ? 'text-blue-100' : ''"
        >{{ item.title }}</v-btn
      >
      <v-btn
        color="secondary"
        variant="flat"
        class="cursor-pointer login-button"
        @click="showLogin"
        v-if="!isUserLoggedIn"
      >
        Login
      </v-btn>

      <template v-if="mobile && !isUserLoggedIn">
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
          <v-img alt="John" src="@/assets/images/user-profile.png"></v-img>
        </v-avatar>

        <v-menu activator="#menu-activator">
          <v-list density="compact" class="menu__wrap">
            <v-list-subheader class="text-center">Username</v-list-subheader>

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
          </v-list>
        </v-menu>
      </template>
    </template>
  </v-toolbar>
  <template v-if="!isUserLoggedIn">
    <BlockChainWallet
      :options="options"
      @emitProvider="getProvider"
      @getSignedData="collectSignedData"
    />
    <div id="update-challenge" @click="postChallenge(challenge)"></div>
    <div id="emit-options" @click="emitOptions(options)"></div>
  </template>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
const { mobile, mdAndDown } = useDisplay()
const router = useRouter()
const route = useRoute()
import { useAuthStore } from '@/store/auth.ts'
import { useUserStore } from '@/store/user.ts'

const authStore = useAuthStore()
const userStore = useUserStore()
const { challenge, loginRes } = storeToRefs(useAuthStore())
const { userMeta } = storeToRefs(useUserStore())

const options = reactive({
  showBwModal: false,
  providers: ['evm', 'interchain'],
  chains: ['mainnet', 'bsc', 'polygon', 'cosmos', 'osmosis'],
  isRequiredDID: true,
  isPerformAction: false
})

const isUserLoggedIn = computed(() => {
  return localStorage.getItem('accessToken')
})

const userMenu = ref([
  { title: 'Home', icon: 'mdi-home-outline', link: '/' },
  { title: 'My Profile', icon: 'mdi-account-outline', link: '/profile' },
  { title: 'My Rewards', icon: 'mdi-gift-outline', link: '/rewards' },
  { title: 'Log Out', icon: 'mdi-logout', link: '/logout' }
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
    slug: 'explore'
  },
  {
    title: 'About Us',
    link: '/about',
    slug: 'about'
  }
])

watch(
  () => authStore.challenge,
  (value: any) => {
    console.log(value)
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
      await authStore.USER_DETAILS()
    })
  },
  { deep: true }
)

watch(
  () => authStore.userMeta,
  (value: any) => {
    localStorage.setItem('user', JSON.stringify(value))
    location.reload()
  },
  { deep: true }
)

const navigate = (item) => {
  if (item.title === 'Log Out') {
    localStorage.removeItem('accessToken')
    location.reload()
  } else {
    window.location.href = `${item.link}`
  }
}

const showLogin = () => {
  options.showBwModal = true
  document.getElementById('update-challenge').click()
}

const getProvider = async (data) => {
  if (data) {
    await authStore.USER_LOGIN(`?provider=${data}-wallet`)
  } else {
    console.log('Please select the provider before you proceed')
  }
}

const collectSignedData = async (data) => {
  console.log(data)
  if (data) {
    await authStore.USER_AUTHENTICATE({ signedDid: data.signProof })
  } else {
    console.log('Please select the provider before you proceed')
  }
}

const currentRouteName = computed(() => {
  return route.name
})

const isActive = (item) => {
  return currentRouteName.value.includes(item.slug) ? true : false
}

onMounted(() => {
  console.log(mobile.value) // false
})
</script>
