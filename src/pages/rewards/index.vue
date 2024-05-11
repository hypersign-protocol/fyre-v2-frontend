<template>
  <Loader v-if="loading" />
  <template v-if="!loading">
    <v-container fluid class="background-left reward__background">
      <div class="homepage-section">
        <div class="section-content">
          <v-container class="pt-8">
            {{ userMeta }}
            <v-row>
              <v-col cols="12" md="6">
                <div class="rewards__wrapper">
                  <p class="title">Your total experience points</p>
                  <p class="xp">{{ user.totalXps }} XP</p>
                  <p class="level">Level {{ user.levelReached }}</p>
                  <v-progress-linear
                    :model-value="user.levelReached"
                    :height="12"
                  ></v-progress-linear>
                  <p class="points">
                    Need {{ user.xpRequiredForNextLevel }} points to reach the next level
                  </p>
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
            <!-- <v-row class="pt-8">
              <v-col><h1>Scratch Cards</h1></v-col>
            </v-row>
            <v-row class="pt-8 scratch-wrap">
              <v-col cols="12" sm="6" md="3" lg="3" xl="3">
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
              <v-col cols="12" sm="6" md="3" lg="3" xl="3">
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
              <v-col cols="12" sm="6" md="3" lg="3" xl="3">
                <div class="scratch-card">
                  <img src="@/assets/images/scratch.png" />
                </div>
              </v-col>
              <v-col cols="12" sm="6" md="3" lg="3" xl="3">
                <div class="scratch-card">
                  <img src="@/assets/images/scratch.png" />
                </div>
              </v-col>
            </v-row> -->
          </v-container>
          <v-container>
            <RewardTab :eventTab="eventTab" />
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
import { useAuthStore } from '@/store/auth.ts'
import { getUser } from '@/composables/jwtService.ts'
import { storeToRefs } from 'pinia'
import tenXpModal from './tenXpModal.vue'
import flat20Modal from './flat20Modal.vue'
const router = useRouter()
const store = useUserStore()
const authStore = useAuthStore()
const { userMeta } = storeToRefs(useAuthStore())

const eventTab = ref(null)
const loading = ref(false)
const show10xp = ref(false)
const flat20 = ref(false)
const show10xpModal = ref(false)
const show20Modal = ref(false)
const activeTab = ref('tokens')
const tabs = ref([
  {
    title: 'Tokens',
    slug: 'TOKEN'
  },
  {
    title: 'XP',
    slug: 'XP'
  }
])

onMounted(() => {
  // getDetails()
})

const getDetails = async () => {
  await authStore.USER_DETAILS()
}

const user = computed(() => {
  return getUser()
})
</script>
