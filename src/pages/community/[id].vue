<template>
  <v-container fluid class="background-left padding-global-y">
    <div class="w-100 h-25">
      <img :src="communityById.banner" height="200" class="w-100 object-cover" />
    </div>
    <v-container style="background: url('@/assets/images/bg-center.png') center/cover no-repeat">
      <v-card color="transparent">
        <v-card-text>
          <div class="logo--wrapper">
            <div class="d-flex">
              <div class="logo">
                <v-avatar size="100">
                  <v-img :src="communityById.avatar"></v-img>
                </v-avatar>
                <img
                  v-if="communityById.hasDomainVerified"
                  class="verify"
                  src="@/assets/images/verify.svg"
                />
              </div>
              <div class="ml-10 d-flex align-end">
                <div class="d-flex flex-column pa-2 ml-6">
                  <p class="font-18 font-weight-bold mb-4">{{ communityById.followerCount }}</p>
                  <p class="font-14">Followers</p>
                </div>
                <div class="d-flex flex-column pa-2 ml-6">
                  <p class="font-18 font-weight-bold mb-4">{{ communityById.participantCount }}</p>
                  <p class="font-14">Participants</p>
                </div>
                <div class="d-flex flex-column pa-2 ml-6">
                  <p class="font-18 font-weight-bold mb-4">{{ communityById.eventCount }}</p>
                  <p class="font-14">Events</p>
                </div>
              </div>
            </div>
            <v-btn color="white" height="53" class="rounded-10 px-15 cursor-pointer">
              Follow
            </v-btn>
          </div>
        </v-card-text>
        <v-card-text class="py-7">
          <p class="font-30 font-weight-bold mb-5">{{ communityById.communityName }}</p>
          <p class="font-16 font-weight-medium mb-5 text-gray-100">
            {{ communityById.description }}
          </p>
        </v-card-text>
        <v-card-text>
          <p class="font-20 font-weight-medium mb-5">Social Links</p>
          <div class="d-flex align-start justify-start">
            <img class="mr-2 cursor-pointer" src="@/assets/images/twitter.png" height="45" />
            <img class="mr-2 cursor-pointer" src="@/assets/images/discord.png" height="45" />
            <img class="mr-2 cursor-pointer" src="@/assets/images/telegram.png" height="45" />
            <img class="mr-2 cursor-pointer" src="@/assets/images/globe.png" height="45" />
          </div>
        </v-card-text>
        <v-card-text>
          <v-tabs
            selected-class="tab--active"
            slider-color="secondary"
            v-model="activeTab"
            align-tabs="left"
            color="white"
            class="event__tabs"
          >
            <v-tab :value="item.slug" v-for="(item, index) in tabs" :key="index">{{
              item.title
            }}</v-tab>
          </v-tabs>
          <v-window v-model="activeTab">
            <v-window-item :eager="true" value="events">
              <Loader v-if="loading" />
              <v-row class="mt-5" v-if="!loading && communityEvents.length > 0">
                <v-col v-for="(event, index) in communityEvents" cols="12" sm="6" md="6" lg="4">
                  <v-hover v-slot="{ isHovering, props }">
                    <v-card class="community-card rounded-xl cursor-pointer" v-bind="props">
                      <v-img class="align-end text-white" :src="event.banner"> </v-img>
                      <v-card-text>
                        <div class="font-16 font-weight-medium">{{ event.eventName }}</div>
                        <p class="my-2 font-12">Ends in: <Duration :eventDate="event.endDate" /></p>
                        <div class="d-flex align-center">
                          <v-chip size="small" label class="orange--chip mr-2"> 10 EXP </v-chip>
                          <v-chip size="small" label class="green--chip"> 500 USTD </v-chip>
                        </div>
                        <p class="my-2">{{ event.participantCount }} Participants</p>
                        <div class="d-flex align-center py-4">
                          <v-chip class="tag__chip" size="x-small">PlayEarn</v-chip>

                          <v-chip class="tag__chip" size="x-small">Avalanche</v-chip>

                          <v-chip class="tag__chip" size="x-small">Ethereum</v-chip>

                          <v-chip class="tag__chip" size="x-small">Airpod</v-chip>
                        </div>
                      </v-card-text>
                      <v-divider></v-divider>
                      <v-overlay
                        :model-value="isHovering"
                        class="align-center justify-center"
                        scrim="#036358"
                        contained
                      >
                        <v-chip
                          @click="viewEvent(event)"
                          color="white"
                          height="53"
                          class="rounded-10 px-15 cursor-pointer"
                          label
                        >
                          View Event
                        </v-chip>
                      </v-overlay>
                    </v-card>
                  </v-hover>
                </v-col>
              </v-row>
              <v-row class="mt-5" v-if="!loading && communityEvents.length === 0">
                <v-col cols="12">
                  <div class="d-flex align-center justify-center height-200">
                    <p class="font-25 lh-26 mx-5 purple-linear-gradient-text font-weight-medium">
                      No events found!
                    </p>
                  </div>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </v-container>
  </v-container>
</template>
<script lang="ts" setup>
  import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
const toggleDescription = ref(false)
const toggleRewards = ref(false)
const toggleRefer = ref(false)
const toggleParticipant = ref(false)
const rating = ref('3.2')
const activeTab = ref('events')
const tabs = ref([
  {
    title: 'All Events',
    slug: 'events'
  },
  {
    title: 'Ongoing',
    slug: 'ongoing'
  },
  {
    title: 'Completed',
    slug: 'completed'
  }
])

import { useCommunityStore } from '@/store/community.ts'

import { storeToRefs } from 'pinia'
const store = useCommunityStore()
const route = useRoute()
const router = useRouter()

const loading = ref(false)
const dialog = ref(true)

const communityById = computed(() => store.getCommunityByIdData)
const communityEvents = computed(() => store.getEventsByCommunityId)

onMounted(async () => {
  fetchCommunity()
})

watch(
  () => activeTab.value,
  (value: any)  => {}
)

watch(
  () => communityById.value,
  (value: any)  => {
    setTimeout(() => {
      loading.value = false
    }, 1000)
  }
)

watch(
  () => communityEvents.value,
  (value: any)  => {
    setTimeout(() => {
      loading.value = false
    }, 1000)
  }
)

const viewEvent = (event) => {
  router.push({ path: `/event/${event._id}` })
}

const fetchCommunity = async () => {
  loading.value = true
  await store.GET_COMMUNITY_ID(route.params.id)
  await store.GET_EVENT_BY_COMMUNITY(`${route.params.id}`)
}
</script>
