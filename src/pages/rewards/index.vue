<template>
  <div v-if="loading" class="height-500 d-flex align-center justify-center fill-height">
    <v-progress-circular
      class="d-flex align-center justify-center"
      alicolor="primary"
      size="64"
      indeterminate
    ></v-progress-circular>
  </div>
  <template v-if="!loading">
    <v-container fluid class="background-left reward__background">
      <div class="homepage-section">
        <div class="section-content">
          <v-container class="pt-8">
            <v-row>
              <v-col cols="12" md="6">
                <div class="rewards__wrapper">
                  <p class="title">Your total experience points</p>
                  <p class="xp">360 XP</p>
                  <p class="level">Level 37</p>
                  <v-progress-linear model-value="20" :height="12"></v-progress-linear>
                  <p class="points">Need 140 points to reach the next level</p>
                </div>
              </v-col>
            </v-row>
            <v-row class="pt-8">
              <v-col cols="12" md="3">
                <div class="rewards-column">
                  <div class="left">
                    <p class="title">Value</p>
                    <p class="number">$0</p>
                  </div>
                  <div class="right">
                    <img src="@/assets/images/money.svg" />
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="rewards-column">
                  <div class="left">
                    <p class="title">Vouchers</p>
                    <p class="number">0</p>
                  </div>
                  <div class="right">
                    <img src="@/assets/images/discount-ticket.svg" />
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="rewards-column">
                  <div class="left">
                    <p class="title">NFTs</p>
                    <p class="number">0</p>
                  </div>
                  <div class="right">
                    <img src="@/assets/images/nft.svg" />
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-row class="pt-8">
              <v-col cols="12" md="6">
                <div class="check-in">
                  <div>
                    <img src="@/assets/images/reward-prize.png" />
                  </div>
                  <div>
                    <h1>Daily Check-In</h1>
                    <p>Get 10Xp Points Daily</p>
                    <span>Check In</span>
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-row class="pt-8">
              <v-col><h1>Scratch Cards</h1></v-col>
            </v-row>
            <v-row class="pt-8 scratch-wrap">
              <v-col cols="12" md="3">
                <div
                  v-if="!show10xp"
                  class="scratch-card cursor-pointer"
                  @click="show10xpModal = true"
                >
                  <img src="@/assets/images/scratch.png" />
                </div>
                <div v-if="show10xp" class="scratch-card">
                  <img src="@/assets/images/10xp-rewards.png" />
                  <div class="scratch-content">
                    <p>10XP</p>
                    <p>Point Rewards</p>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <div v-if="!flat20" class="scratch-card cursor-pointer" @click="show20Modal = true">
                  <img src="@/assets/images/scratch.png" />
                </div>
                <div v-if="flat20" class="scratch-card">
                  <img src="@/assets/images/flat-20.png" />
                  <div class="scratch-content">
                    <p>Flat 20% <br />Off</p>
                    <p>On an ethereal depiction of a cosmic nebula, limited to 100 editions.</p>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="scratch-card">
                  <img src="@/assets/images/scratch.png" />
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="scratch-card">
                  <img src="@/assets/images/scratch.png" />
                </div>
              </v-col>
            </v-row>
          </v-container>
          <v-container>
            <div class="tab__card">
              <v-tabs
                selected-class="tab--active"
                slider-color="secondary"
                v-model="activeTab"
                align-tabs="left"
                color="white"
                class="event__tabs"
              >
                <v-tab :value="item.slug" v-for="(item, index) in tabs" :key="index">
                  {{ item.title }}
                </v-tab>
              </v-tabs>
              <v-window v-model="activeTab">
                <v-window-item :eager="true" value="tokens">
                  <div class="user__profile">
                    <v-card class="bg__card pa-10 mt-8">
                      <v-row class="token__row" v-for="(item, index) in tokenItems">
                        <v-col>
                          <p class="d-flex align-center">
                            <img src="@/assets/images/trophy.svg" class="mr-2" />
                            {{ item.name }}
                          </p>
                        </v-col>
                        <v-col>
                          <p>{{ item.price }}</p>
                        </v-col>
                        <v-col>
                          <p>{{ item.expiry }}</p>
                        </v-col>
                        <v-col>
                          <p class="text-green-accent-3" v-if="item.status === 'Claimed'">
                            {{ item.status }}
                          </p>
                          <v-btn class="bg-blue-accent-3" v-if="item.status === 'Claim Now'">{{
                            item.status
                          }}</v-btn>
                        </v-col>
                      </v-row>
                    </v-card>
                  </div>
                </v-window-item>
              </v-window>
            </div>
          </v-container>
        </div>
      </div>
    </v-container>
  </template>
  <tenXpModal v-model="show10xpModal" @close="(show10xpModal = false), (show10xp = true)" />
  <flat20Modal v-model="show20Modal" @close="(show20Modal = false), (flat20 = true)" />
</template>
<script lang="ts" setup>
import {
  defineComponent,
  ref,
  shallowRef,
  onMounted,
  onBeforeUnmount,
  computed,
  watch,
  defineAsyncComponent
} from 'vue'
import { useUserStore } from '@/store/user.ts'
import { storeToRefs } from 'pinia'
import tenXpModal from './tenXpModal.vue'
import flat20Modal from './flat20Modal.vue'
const router = useRouter()
const store = useUserStore()

const loading = ref(false)
const show10xp = ref(false)
const flat20 = ref(false)
const show10xpModal = ref(false)
const show20Modal = ref(false)
const activeTab = ref('tokens')
const tabs = ref([
  {
    title: 'Tokens',
    slug: 'tokens'
  },
  {
    title: 'Vouchers',
    slug: 'vouchers'
  },
  {
    title: 'NFTs',
    slug: 'nfts'
  },
  {
    title: 'OATs',
    slug: 'oats'
  },
  {
    title: 'Tx History',
    slug: 'tx-history'
  }
])

const tokenItems = ref([
  {
    name: 'Premium Event 1',
    price: '3000$ in USDT',
    expiry: 'Expiring in 2 days',
    status: 'Claimed'
  },
  {
    name: 'Premium Event 1',
    price: '3000$ in USDT',
    expiry: 'Expiring in 2 days',
    status: 'Claim Now'
  },
  {
    name: 'Premium Event 1',
    price: '3000$ in USDT',
    expiry: 'Expiring in 2 days',
    status: 'Claimed'
  },
  {
    name: 'Premium Event 1',
    price: '3000$ in USDT',
    expiry: 'Expired',
    status: 'Expired'
  }
])
</script>
