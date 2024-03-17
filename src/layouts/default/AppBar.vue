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
        >{{ item.name }}</v-btn
      >
      <v-btn color="secondary" variant="flat" class="cursor-pointer login-button"> Login </v-btn>

      <template v-if="mobile">
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
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
