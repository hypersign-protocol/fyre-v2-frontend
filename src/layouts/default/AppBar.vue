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
        @click="login"
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
          <v-img alt="John" src="https://cdn.vuetifyjs.com/images/john.jpg"></v-img>
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
</template>

<script lang="ts" setup>
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
const { mobile, mdAndDown } = useDisplay()
const router = useRouter()
const route = useRoute()

const isUserLoggedIn = computed(() => {
  return localStorage.getItem('userLoggedIn')
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

const login = () => {
  localStorage.setItem('userLoggedIn', true)
  location.reload()
}

const navigate = (item) => {
  if (item.title === 'Log Out') {
    localStorage.removeItem('userLoggedIn')
    location.reload()
  } else {
    router.push({ path: `${item.link}` })
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
