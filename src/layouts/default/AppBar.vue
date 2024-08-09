<template>
  <v-toolbar fixed flat height="70" class="header__wrapper">
    <template v-slot:prepend>
      <a class="cursor-pointer logo" @click="router.push({ path: '/' })"><img src="@/assets/images/logo.svg"
          height="20" /></a>
    </template>
    <template v-slot:append>
      <div class="mr-6" v-if="!mobile">
        <v-btn class="cursor-pointer" v-for="(item, index) in menu" :key="index"
          @click="router.push({ path: `${item.link}` })" :class="isActive(item) ? 'text-blue-100' : 'text-gray-100'">{{
            item.title }}
        </v-btn>
      </div>
      <v-btn color="secondary" variant="flat" class="cursor-pointer login-button" @click="showLogin"
        v-if="!isUserLoggedIn">
        Login
      </v-btn>

      <template v-if="mobile">
        <v-app-bar-nav-icon id="website-menu-activator" class="mr-3"></v-app-bar-nav-icon>

        <v-menu activator="#website-menu-activator">
          <v-list density="compact" class="menu__wrap">
            <v-list-item v-for="(item, i) in menu" :key="i" :value="item" color="white" base-color="#ADB9C7"
              @click="navigate(item)">
              <v-list-item-title class="font-14" v-text="item.title"></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <template v-if="isUserLoggedIn">
        <v-btn class="text-none" v-if="!mobile && isUserLoggedIn" stacked
          @click="navigate({ link: '/inappNotification' })">
          <v-badge color="error" :content="userNotificaionSize">
            <v-icon transition="fab-transition">mdi-bell-outline</v-icon>
          </v-badge>
        </v-btn>

        <v-avatar id="menu-activator" class="cursor-pointer">
          <v-img v-if="user?.avatar" :src="user?.avatar"></v-img>
          <v-img v-else src="@/assets/images/user-profile.png"></v-img>
        </v-avatar>

        <v-menu activator="#menu-activator">
          <v-list density="compact" class="menu__wrap">
            <v-list-subheader class="text-center">
              Welcome,
              <strong v-if="user?.userName">{{ user?.userName }}</strong>
              <strong v-else>User</strong>
            </v-list-subheader>
            <v-list-item v-for="(item, i) in userMenu" :key="i" :value="item" color="white" base-color="#ADB9C7"
              @click="navigate(item)">
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
    <Loader v-if="loading" />
    <BlockChainWallet :options="options" @emitProvider="getProvider" @emitWalletAddress="collectWalletAddress"
      @emitSignedData="collectSignedData" @emitSendGoogleCode="collectGoogleCode" />
    <div id="update-challenge" @click="postChallenge(challenge)"></div>
    <div id="emit-options" @click="emitOptions(options)"></div>
  </template>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref, onMounted, computed, watch, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { useGtag } from "vue-gtag-next";
import { useUserStore } from '@/store/user.ts'

const { mobile } = useDisplay()
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const loading = ref(false)
import { useAuthStore } from '@/store/auth.ts'
import { getUser } from '@/composables/jwtService.ts'

const authStore = useAuthStore()
const { challenge, userMeta } = storeToRefs(useAuthStore())



const usernotifications = computed(() => {
  if (isUserLoggedIn) {
    return userStore.getUserNotifcations
  } else {
    return []
  }
})

setInterval(() => {
  userStore.USER_NOTIFICATIONS()
}, 10000)

const userNotificaionSize = computed(() => {
  if (isUserLoggedIn) {
    const num = usernotifications.value.length
    if (num >= 1e6) {
      return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
    } else {
      return num;
    }
  }

})


let user = computed(() => {
  return getUser()
})
const { event } = useGtag()

const options = reactive({
  showBwModal: false,
  providers: ['evm', 'interchain', 'google'],
  chains: [],
  isAuth: true,
  isRequiredDID: true,
  isPerformAction: false,
  didDocument: user.value.didDocument,
  addVerificationMethod: false,
  selectedNetwork: null,
  googleClientId: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID,
  googleCallBackUrl: window.location.origin + '/gauth-cb'
})

const isUserLoggedIn = computed(() => {
  return localStorage.getItem('accessToken')
})

const userMenu = ref([
  { title: 'Home', icon: 'mdi-home-outline', link: '/' },
  { title: 'My Profile', icon: 'mdi-account-outline', link: '/profile' },
  { title: 'My Rewards', icon: 'mdi-gift-outline', link: '/rewards' },
  { title: 'My Notifications', icon: 'mdi-bell-outline', link: '/inappNotification' }
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

watch(
  () => authStore.userMeta,
  (value: any, oldVal: any) => {
    if (value) {
      user = computed(() => {
        return getUser()
      })
    }
  }
)

const navigate = (item: any) => {
  console.log('item.link')
  event('navigate', {
    'event_category': 'Navigation',
    'event_label': item.link
  })
  window.location.href = `${item.link}`
}

const showLogin = () => {
  event('showLogin', {
    'event_category': 'Login',
    'event_label': 'showLogin'
  })
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

const collectWalletAddress = async (data: any) => { }

const collectSignedData = async (data: any) => {
  if (data) {
    await authStore.USER_AUTHENTICATE({ signedDid: data.signProof })
  } else {
    console.log('Please select the provider before you proceed')
  }
}

const collectGoogleCode = async (data: any) => {
  console.log('AppBar:: collectGoogleCode code ' + data);
  if (data) {
    loading.value = true;
    await authStore.USER_AUTHENTICATE({ code: data }, { provider: 'google' })
    loading.value = false
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
