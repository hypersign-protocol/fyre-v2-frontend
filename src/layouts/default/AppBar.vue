<template>
  <v-app-bar absolute flat height="100" class="header__wrapper">
    <v-app-bar-title class="cursor-pointer" @click="router.push({ path: '/' })">
      <img src="@/assets/images/logo.svg" height="60" />
    </v-app-bar-title>

    <template v-slot:append>
      <v-card variant="flat" class="mx-auto d-flex align-center" color="transparent">
        <template v-if="!mobile">
          <v-toolbar-items class="mr-4">
            <v-btn
              class="cursor-pointer"
              v-for="(item, index) in menu"
              @click="router.push({ path: `${item.link}` })"
              :class="isActive(item) ? 'text-blue-100' : ''"
              >{{ item.name }}</v-btn
            >
          </v-toolbar-items>
          <v-btn
            color="secondary"
            variant="flat"
            height="53"
            width="180"
            class="mr-4 cursor-pointer rounded-lg"
          >
            Login
          </v-btn>
        </template>
        <template v-if="mobile">
          <v-app-bar-nav-icon></v-app-bar-nav-icon>
        </template>
        <v-btn variant="tonal" icon size="x-small" color="white" class="mr-4 cursor-pointer">
          <v-icon size="18">mdi-bell-outline</v-icon>
        </v-btn>
        <v-avatar class="cursor-pointer">
          <v-img alt="John" src="https://cdn.vuetifyjs.com/images/john.jpg"></v-img>
        </v-avatar>
      </v-card>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()
const router = useRouter()
const route = useRoute()

const menu = ref([
  {
    name: 'Home',
    link: '/',
    slug: '/'
  },
  {
    name: 'Explore',
    link: '/explore',
    slug: 'explore'
  },
  {
    name: 'About Us',
    link: '/',
    slug: 'about'
  }
])

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
