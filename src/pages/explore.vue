<template>
  <v-container fluid class="background-center">
    <!-- <div class="homepage-section padding-global-y background-center"> -->
    <div class="homepage-section background-center pt-10">
      <div class="section-content">
        <v-card class="bg-light-100 mx-auto" max-width="500">
          <v-tabs
            selected-class="tab--active"
            slider-color="secondary"
            v-model="activeTab"
            align-tabs="center"
            class="nav--tabs"
          >
            <v-tab :value="item.slug" v-for="(item, index) in tabs" :key="index">{{
              item.name
            }}</v-tab>
          </v-tabs>
        </v-card>
      </div>
    </div>
    <v-window v-model="activeTab">
      <v-window-item value="events">
        <v-container fluid class="background-center">
          <h2 class="homepage__section__title">Popular Events</h2>
          <div class="homepage-section">
            <div class="section-content">
              <PopularEvents />
            </div>
          </div>
        </v-container>
        <div class="homepage-section padding-global-y">
          <div class="section-content">
            <Tabs />
          </div>
        </div>
      </v-window-item>
      <v-window-item value="communities">
        <v-container fluid class="background-center">
          <h2 class="homepage__section__title">Popular Communities</h2>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="4"
                md="4"
                xl="4"
                lg="4"
                v-for="(event, index) in communities?.data.slice(0, 3)"
                :key="index"
              >
                <v-card
                  class="community-card rounded-xl cursor-pointer text-center"
                  @click="viewCommunity(event)"
                >
                  <v-card-title class="pa-0 text-gradient-purple-1 communit-header">
                    <div :class="`community-curve-${index}`"></div>
                    <v-avatar size="74" class="my-4">
                      <v-img :src="event.avatar"></v-img>
                    </v-avatar>
                  </v-card-title>
                  <v-card-title class="px-0 font-28 text-white-100 font-weight-bold">{{
                    event.communityName
                  }}</v-card-title>
                  <p class="font-12 font-weight-regular mb-4">{{ event.description }}</p>
                  <div class="d-flex align-center justify-center py-4">
                    <img
                      class="mr-4"
                      size="16"
                      @click="socials"
                      src="@/assets/images/telegram_out.svg"
                    />
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
          </v-container>
        </v-container>

        <div class="homepage-section padding-global-y">
          <div class="section-content">
            <h2 class="text-center font-48">All Communities</h2>
            <v-row class="py-4">
              <v-col md="4">
                <v-text-field
                  hide-details
                  density="compact"
                  class="base-input"
                  placeholder="Search communities"
                  variant="solo"
                  v-model="options.search"
                >
                  <template v-slot:prepend-inner>
                    <v-icon icon="mdi-magnify" />
                  </template>
                </v-text-field>
              </v-col>

              <v-spacer></v-spacer>

              <!-- <v-col>
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
              </v-col> -->
            </v-row>
            <Loader v-if="loading" />
            <v-row v-if="!loading && communities?.data?.length">
              <v-col
                cols="12"
                sm="4"
                md="4"
                xl="3"
                lg="3"
                v-for="(community, index) in communities?.data"
                :key="index"
              >
                <CommunityCard :communityData="community" />
              </v-col>
            </v-row>
            <div
              class="text-center d-flex align-center justify-center my-6"
              v-if="communities.total > 8"
            >
              <Pagination
                :page="options.page"
                :limit="options.limit"
                :total="communities.total"
                @pageChange="pageChange"
              />
            </div>
          </div>
        </div>
      </v-window-item>
    </v-window>
  </v-container>
</template>
<script lang="ts" setup>
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'

import _ from 'lodash'
import { isEventHappening } from '@/composables/event.ts'
import paginate from '@/utils/paginate'

import { useEventStore } from '@/store/event.ts'
import { useCommunityStore } from '@/store/community.ts'

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

const activeTab = ref('events')
const search = ref(null)

const options = reactive({
  page: 1,
  limit: 8,
  search: '',
  filter: ''
})

import { storeToRefs } from 'pinia'
const eventStore = useEventStore()
const communityStore = useCommunityStore()
const router = useRouter()

const loading = ref(false)

const communities = computed(() => communityStore.getPopularCommunities)

watch(
  () => communities.value,
  (value: any) => {
    setTimeout(() => {
      loading.value = false
    }, 1000)
  }
)

const pageChange = (page) => {
  options.page = page
}

const searchKey = _.debounce(() => {
  setTimeout(async () => {
    options.page = 1
    getPopularCommunities()
  })
}, 500)

watch(() => options.search, searchKey)

watch(
  () => options.page,
  (value: any) => {
    //(value)
    setTimeout(async () => {
      getPopularCommunities()
    }, 100)
  }
)

const viewCommunity = (event) => {
  router.push({ path: `/community/${event._id}` })
}

const getPopularCommunities = async () => {
  loading.value = true
  let params = `?page=${options.page}&limit=${options.limit}`

  if (options.filter) {
    params += `&filter=${options.filter}`
  }

  if (options.search) {
    params += `&searchString=${options.search}`
  }

  await communityStore.POPULAR_COMMUNITIES(params)
}

onMounted(async () => {
  getPopularCommunities()
})
</script>
