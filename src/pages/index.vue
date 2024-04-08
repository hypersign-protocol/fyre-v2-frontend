<template>
  <Banner />
  <Slider />
  <v-container fluid class="background-left">
    <h1 class="homepage__section__title">Top Campaigns</h1>
    <div class="homepage-section">
      <div class="section-content">
        <Tabs />
        <div
          class="d-flex align-center justify-center my-5"
          @click="router.push({ path: `/explore` })"
        >
          <v-btn variant="outlined" rounded>See more</v-btn>
        </div>
      </div>
    </div>
  </v-container>
  <v-container fluid class="background-left">
    <div class="homepage-section">
      <div class="section-content">
        <h1 class="homepage__section__title">Explore Communities</h1>
        <div class="explore__community_wrapper">
          <div class="row_wrap">
            <div
              class="explore-community-card"
              style="cursor: pointer"
              v-for="(item, index) in communities"
              @click="viewCommunity(item._id)"
            >
              <img :src="item.avatar" />
              <p>{{ item.communityName }}</p>
            </div>
          </div>
          <div
            class="d-flex align-center justify-center my-5"
            @click="router.push({ path: `/explore` })"
          >
            <v-btn variant="outlined" rounded>See more</v-btn>
          </div>
        </div>
      </div>
    </div>
  </v-container>
  <v-container fluid class="background-left">
    <div class="homepage-section">
      <div class="section-content">
        <div class="get_sarted_wrapper">
          <h2 class="homepage__section__title">How To Get Started</h2>
          <p class="body__text">
            With just a few clicks, you can access a variety of rewards and benefits. Browse and
            claim the rewards that interest you the most and start earning now!
          </p>
        </div>
        <div>
          <v-row class="mt-5">
            <v-col cols="12" sm="4" md="4">
              <div class="card__wrap">
                <img src="@/assets/images/check-mark.png" class="icon" />
                <h4 class="title__text">Choose a Event</h4>
                <p>
                  Browse our list of exciting events. Find the one that resonates with your
                  interests or cause. Click on the event to get started.
                </p>
              </div>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <div class="card__wrap">
                <img src="@/assets/images/task.png" class="icon" />
                <h4 class="title__text">Complete the Tasks</h4>
                <p>
                  Participate in the event by completing tasks or activities associated with it and
                  unlock rewards or badges for your achievements.
                </p>
              </div>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <div class="card__wrap">
                <img src="@/assets/images/reward.png" class="icon" />
                <h4 class="title__text">Receive the Rewards</h4>
                <p>
                  As you complete tasks and engage in the event, you'll earn rewards or recognition.
                  Celebrate your achievements!
                </p>
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
  </v-container>

  <v-container fluid class="background-left">
    <div class="homepage-section">
      <div class="section-content">
        <div class="numbers__wrap">
          <v-row class="mt-5">
            <v-col cols="12" sm="6" md="6" lg="3" xl="3">
              <div class="camp--card">
                <div class="camp--icon">
                  <img src="@/assets/images/camp001.svg" />
                </div>
                <div class="orange-number">+112,256</div>
                <div class="title__text">Campaigns</div>
                <div class="description__text">Total Campaigns</div>
              </div>
            </v-col>
            <v-col cols="12" sm="6" md="6" lg="3" xl="3">
              <div class="camp--card">
                <div class="camp--icon">
                  <img src="@/assets/images/camp002.svg" />
                </div>
                <div class="purple-number">+1,600,000</div>
                <div class="title__text">Rewards</div>
                <div class="description__text">Total Rewards</div>
              </div>
            </v-col>
            <v-col cols="12" sm="6" md="6" lg="3" xl="3">
              <div class="camp--card">
                <div class="camp--icon">
                  <img src="@/assets/images/camp003.svg" />
                </div>
                <div class="green-number">+50</div>
                <div class="title__text">Communities</div>
                <div class="description__text">Total Communities</div>
              </div>
            </v-col>
            <v-col cols="12" sm="6" md="6" lg="3" xl="3">
              <div class="camp--card">
                <div class="camp--icon">
                  <img src="@/assets/images/camp004.svg" />
                </div>
                <div class="yellow-number">+116,000</div>
                <div class="title__text">Participants</div>
                <div class="description__text">Total Participants</div>
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
  </v-container>
  <SupportedChain />

  <Faq />
</template>
<script lang="ts" setup>
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'

import { useCommunityStore } from '@/store/community.ts'

const communityStore = useCommunityStore()
const router = useRouter()

const communities = computed(() => communityStore.getPopularCommunities)

onMounted(async () => {
  await communityStore.POPULAR_COMMUNITIES(`?page=2&limit=10`)
})

const viewCommunity = (id) => {
  router.replace({ path: `/community/${id}` })
}
</script>
