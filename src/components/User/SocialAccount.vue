<template>
  <div class="profile__setting__container">
    <p class="title">Network Lists</p>
    <v-row>
      <v-col cols="12" sm="6" md="6" lg="4" xl="4" v-for="(item, index) in items">
        <div class="wallet__address__container" :class="item.handle ? 'address' : ''">
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
            <v-btn v-if="!item.handle" color="secondary" variant="flat">Connect</v-btn>
            <v-btn v-if="item.handle" color="white" variant="text" class="btn-copy">
              {{ item.handle }}
              <img src="@/assets/images/content-copy.svg" class="ml-2" />
            </v-btn>
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

const items = ref([
  {
    title: 'Mail',
    image: new URL(`@/assets/images/email-filled.png`, import.meta.url).href,
    handle: 'jhon@xyz.com'
  },
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
