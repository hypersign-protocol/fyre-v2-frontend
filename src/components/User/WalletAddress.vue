<template>
  <div class="profile__setting__container">
    <p class="title">Network Lists</p>
    <v-row>
      <v-col cols="12" sm="6" md="6" lg="4" xl="4" v-for="(item, index) in items">
        <div class="wallet__address__container" :class="item.isAddress ? 'address' : ''">
          <div class="tag">{{ item.tag }}</div>
          <div class="wallet__header">
            <div class="wallet__meta">
              <img :src="item.image" />
              <p>{{ item.title }}</p>
            </div>
            <div class="wallet__action" v-if="!item.isAddress">
              <v-icon>mdi-dots-vertical</v-icon>
            </div>
          </div>
          <div class="wallet__footer">
            <v-btn v-if="!item.isAddress" color="secondary" variant="flat">Connect Wallet</v-btn>
            <v-btn v-if="item.isAddress" color="white" variant="text" class="btn-copy">
              {{ item.address }}
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
    title: 'Cosmos',
    address: '0xd42dc40cc6...7814a0da',
    tag: 'CONTROLLER',
    image: new URL(`@/assets/images/task/cosmos.png`, import.meta.url).href,
    isAddress: true
  },
  {
    title: 'Polygon',
    address: null,
    image: new URL(`@/assets/images/task/polygon.png`, import.meta.url).href,
    isAddress: false
  },
  {
    title: 'Ethereum',
    address: null,
    image: new URL(`@/assets/images/task/archway.png`, import.meta.url).href,
    isAddress: false
  },
  {
    title: 'Binance Smart Chain',
    address: null,
    image: new URL(`@/assets/images/task/binance.png`, import.meta.url).href,
    isAddress: false
  },
  {
    title: 'Comdex',
    address: null,
    image: new URL(`@/assets/images/task/comdex.png`, import.meta.url).href,
    isAddress: false
  },
  {
    title: 'Nibiru',
    address: null,
    image: new URL(`@/assets/images/task/nibiru.png`, import.meta.url).href,
    isAddress: false
  },
  {
    title: 'Archway',
    address: null,
    image: new URL(`@/assets/images/task/archway.png`, import.meta.url).href,
    isAddress: false
  },
  {
    title: 'Hypersign',
    address: null,
    image: new URL(`@/assets/images/task/hypersign.png`, import.meta.url).href,
    isAddress: false
  },
  {
    title: 'Agoric',
    address: null,
    image: new URL(`@/assets/images/task/agoric.png`, import.meta.url).href,
    isAddress: false
  },
  {
    title: 'Omniflex',
    address: null,
    image: new URL(`@/assets/images/task/omniflex.png`, import.meta.url).href,
    isAddress: false
  },
  {
    title: 'Secret',
    address: null,
    image: new URL(`@/assets/images/task/secret.png`, import.meta.url).href,
    isAddress: false
  },
  {
    title: 'Osmosis',
    address: null,
    image: new URL(`@/assets/images/task/osmosis.png`, import.meta.url).href,
    isAddress: false
  }
])
</script>
