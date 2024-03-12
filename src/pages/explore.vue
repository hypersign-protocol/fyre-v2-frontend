<template>
  <v-container fluid class="background-center">
    <v-container fluid class="padding-global-y background-center">
      <v-card color="transparent" max-width="800" class="mx-auto">
        <v-text-field
          hide-details
          class="rounded-pill is-border-radius mb-8 bg-light-100"
          placeholder="Search communities and events"
          variant="solo"
          bg-color="transparent"
          height="70"
        >
          <template v-slot:append-inner>
            <v-icon icon="mdi-magnify" />
          </template>
        </v-text-field>
      </v-card>
      <v-card class="bg-light-100 mx-auto mt-10" max-width="400">
        <v-tabs
          selected-class="tab--active"
          slider-color="secondary"
          v-model="activeTab"
          align-tabs="center"
          color="#ADB9C7"
        >
          <v-tab :value="item.slug" v-for="(item, index) in tabs" :key="index">{{
            item.name
          }}</v-tab>
        </v-tabs>
      </v-card>
    </v-container>
    <v-window v-model="activeTab">
      <v-window-item value="events">
        <v-container fluid class="background-center">
          <h2 class="padding-global-y text-center font-48 pt-15 pb-3">Popular Events</h2>
          <v-carousel height="400" show-arrows="hover" hide-delimiters>
            <v-carousel-item v-for="(slide, i) in slides" :key="i">
              <v-row>
                <v-col
                  v-for="(event, index) in popular.slice(i * 4, (i + 1) * 4)"
                  :key="index"
                  cols="12"
                  md="3"
                >
                  <v-card class="rounded-xl" @click="viewEvent(event)">
                    <v-img class="align-end text-white" height="315" :src="event.banner" cover>
                      <v-card color="rgb(2 2 2 / 92%)">
                        <v-card-actions class="d-flex align-center justify-space-between">
                          <div class="d-flex align-center">
                            <v-avatar class="cursor-pointer mr-2">
                              <v-img alt="John" :src="event.communityDetail.avatar"></v-img>
                            </v-avatar>
                            <p class="mr-2 font-14 lh-16 text-white-100">
                              {{ event.communityDetail.communityName }}
                            </p>
                            <img
                              v-if="event.communityDetail.hasDomainVerified"
                              src="@/assets/images/verify.svg"
                              height="16"
                            />
                          </div>
                          <div class="d-flex align-center">
                            <p class="my-2 font-11 text-white-100">
                              Ends in: <span> <Duration :eventDate="event.endDate" /></span>
                            </p>
                          </div>
                        </v-card-actions>
                        <v-card-text>
                          <div class="text-white-100">{{ event.eventName }}</div>

                          <p class="my-2 text-orange-100">
                            {{ event.participantCount }} Participants
                          </p>
                          <div class="d-flex">
                            <v-avatar size="20" class="mr-2">
                              <v-img src="@/assets/images/gift.svg"></v-img>
                            </v-avatar>
                            <p class="text-white-100">500 USTD</p>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-img>
                  </v-card>
                </v-col>
              </v-row>
            </v-carousel-item>
          </v-carousel>
        </v-container>
        <v-container class="container-large">
          <Tabs class="padding-global-y" />
        </v-container>
      </v-window-item>
      <v-window-item value="communities">
        <v-container>
          <h2 class="text-center font-48 pt-15 pb-3">Popular Communities</h2>
          <div class="padding-global-y background-center">
            <v-row>
              <v-col
                cols="12"
                md="4"
                v-for="(event, index) in communities.slice(0, 3)"
                :key="index"
              >
                <v-card
                  class="community-card rounded-xl cursor-pointer text-center"
                  @click="viewCommunity(event)"
                >
                  <v-avatar size="74" class="my-4">
                    <v-img :src="event.avatar"></v-img>
                  </v-avatar>
                  <p class="font-28 font-weight-bold mb-4">{{ event.communityName }}</p>
                  <p class="font-12 font-weight-regular mb-4">{{ event.description }}</p>
                  <div class="d-flex align-center justify-center py-4">
                    <img class="mr-4" size="16" src="@/assets/images/telegram_out.svg" />
                    <img class="mr-4" size="16" src="@/assets/images/twitter_out.svg" />
                    <img class="mr-4" size="16" src="@/assets/images/discord_out.svg" />
                  </div>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <div class="d-flex align-center justify-space-between w-100 px-8">
                      <div class="d-flex flex-column">
                        <p class="font-12 font-weight-regular">Followers</p>
                        <p class="font-14 font-weight-bold mt-2">{{ event.followerCount }}</p>
                      </div>
                      <div class="d-flex flex-column">
                        <p class="font-12 font-weight-regular">Participants</p>
                        <p class="font-14 font-weight-bold mt-2">{{ event.participantCount }}</p>
                      </div>
                      <div class="d-flex flex-column">
                        <p class="font-12 font-weight-regular">Events</p>
                        <p class="font-14 font-weight-bold mt-2">{{ event.eventCount }}</p>
                      </div>
                    </div>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </div>
          <div class="padding-global-y">
            <h2 class="text-center font-48">All Communities</h2>
            <v-row class="py-4">
              <v-col>
                <v-text-field
                  hide-details
                  density="compact"
                  class="rounded-pill is-border-radius"
                  placeholder="Search communities"
                  variant="solo"
                  height="53"
                >
                  <template v-slot:prepend-inner>
                    <v-icon icon="mdi-magnify" />
                  </template>
                </v-text-field>
              </v-col>

              <v-spacer></v-spacer>

              <v-col>
                <div class="d-flex align-center justify-end">
                  <v-btn
                  variant="outlined"
                  rounded="xl"
                  size="x-large"
                  height="40"
                  class="cursor-pointer font-16"
                  >Create Your Community</v-btn
                >
              </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="3" v-for="(event, index) in communities" :key="index">
                <v-card
                  class="community-card rounded-xl cursor-pointer text-center"
                  @click="viewCommunity(event)"
                >
                  <v-avatar size="74" class="my-4">
                    <v-img :src="event.avatar"></v-img>
                  </v-avatar>
                  <p class="font-28 font-weight-bold mb-4">{{ event.communityName }}</p>
                  <div class="d-flex align-center justify-center py-4">
                    <img class="mr-4" size="16" src="@/assets/images/telegram_out.svg" />
                    <img class="mr-4" size="16" src="@/assets/images/twitter_out.svg" />
                    <img class="mr-4" size="16" src="@/assets/images/discord_out.svg" />
                  </div>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <div class="d-flex align-center justify-space-between w-100 px-8">
                      <div class="d-flex flex-column">
                        <p class="font-12 font-weight-regular">Followers</p>
                        <p class="font-14 font-weight-bold mt-2">{{ event.followerCount }}</p>
                      </div>
                      <div class="d-flex flex-column">
                        <p class="font-12 font-weight-regular">Participants</p>
                        <p class="font-14 font-weight-bold mt-2">{{ event.participantCount }}</p>
                      </div>
                    </div>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-container>
      </v-window-item>
    </v-window>
  </v-container>
</template>
<script lang="ts" setup>
const activeTab = ref('events')

const slides = ref(['First', 'Second'])
const items = ref([
  {
    src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg'
  },
  {
    src: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg'
  },
  {
    src: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg'
  },
  {
    src: 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg'
  }
])
const tabs = ref([
  {
    name: 'Events',
    slug: 'events'
  },
  {
    name: 'Communities',
    slug: 'communities'
  }
])
import { useEventStore } from '@/store/event.ts'
import { useCommunityStore } from '@/store/community.ts'
import { ref, onMounted } from 'vue'

import { storeToRefs } from 'pinia'
const eventStore = useEventStore()
const communityStore = useCommunityStore()
const router = useRouter()

const loading = ref(false)

const popular = computed(() => eventStore.getPopularEvents)
const communities = computed(() => communityStore.getPopularCommunities)

watch(
  () => popular.value,
  (value) => {
    setTimeout(() => {
      loading.value = false
    }, 1000)
  }
)

watch(
  () => communities.value,
  (value) => {
    setTimeout(() => {
      loading.value = false
    }, 1000)
  }
)

const viewCommunity = (event) => {
  router.push({ path: `/community/${event._id}` })
}

const viewEvent = (event) => {
  router.push({ path: `/event/${event._id}` })
}

onMounted(async () => {
  loading.value = true
  await eventStore.POPULAR_EVENTS(`?page=1&limit=10`)
  await communityStore.POPULAR_COMMUNITIES(`?page=1&limit=10`)
})
</script>
