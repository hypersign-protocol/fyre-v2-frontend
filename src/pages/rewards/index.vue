<template>
  <Loader v-if="loading" />
  <template v-if="!loading">
    <v-container fluid class="background-left reward__background">
      <div class="homepage-section">
        <div class="section-content">
          <v-container class="pt-8">
            <v-row>
              <v-col cols="12" md="6">
                <div class="rewards__wrapper">
                  <p class="title">Your total experience points</p>
                  <p class="xp">{{ userMeta.totalXps }} XP</p>
                  <p class="level">Level {{ userMeta.levelReached }}</p>
                  <v-progress-linear
                    :model-value="userMeta.levelReached"
                    :height="12"
                  ></v-progress-linear>
                  <p class="points">
                    Need {{ userMeta.xpRequiredForNextLevel }} points to reach the next level
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
            <RewardTab ref="rewardComp" />
          </v-container>
        </div>
      </div>
    </v-container>
  </template>
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
import { useAuthStore } from '@/store/auth.ts'
import { storeToRefs } from 'pinia'

const router = useRouter()
const authStore = useAuthStore()
const { userMeta } = storeToRefs(useAuthStore())

const loading = ref(false)
const rewardComp = ref(null)

watch(
  () => authStore.userMeta,
  (value: any) => {
    setTimeout(() => {
      loading.value = false
    }, 400)
  },
  { deep: true }
)

onMounted(() => {
   loading.value = true
   getDetails()
})

const getDetails = async () => {
  setTimeout(async () => {
    await authStore.USER_AUTHORIZE()
  }, 200)
}
</script>
