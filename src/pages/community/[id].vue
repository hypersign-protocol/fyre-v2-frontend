<template>
  <Loader v-if="loading" />
  <template v-if="!loading">
    <v-container fluid class="background-left">
      <div class="w-100 community-banner">
        <img :src="communityById.banner" />
      </div>
      <v-container style="background: url('@/assets/images/bg-center.png') center/cover no-repeat">
        <v-card color="transparent">
          <v-card-text>
            <div class="logo--wrapper">
              <div class="d-flex">
                <div class="logo">
                  <v-avatar size="100" vif="communityById">
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
                    <p class="font-18 font-weight-bold mb-4">
                      {{ communityById.participantCount }}
                    </p>
                    <p class="font-14">Participants</p>
                  </div>
                  <div class="d-flex flex-column pa-2 ml-6">
                    <p class="font-18 font-weight-bold mb-4">{{ communityById.eventCount }}</p>
                    <p class="font-14">Events</p>
                  </div>
                </div>
              </div>
              <v-btn
                color="white"
                height="53"
                class="rounded-10 px-15 cursor-pointer"
                :loading="following"
                v-if="!isFollowed"
                @click="followCommunity"
              >
                <span>Follow</span>
              </v-btn>
              <v-btn
                v-if="isFollowed"
                color="rgb(255,255,255,8%)"
                height="53"
                class="rounded-10 px-15 cursor-pointer"
              >
                <v-icon class="mr-2">mdi-check</v-icon> Following
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
            <div class="d-flex align-start justify-start" v-if="communityById.socials">
              <a v-if="communityById.socials.twitterHandle"
                :href="`https://twitter.com/${communityById.socials.twitterHandle}`"
                target="_blank"
              >
                <img
                  class="mr-2 cursor-pointer"
                  src="@/assets/images/twitter-icon.svg"
                  height="45"
                />
              </a>
              <a v-if="communityById.socials.discordHandle"
                :href="`https://discord.com/${communityById.socials.discorHandle}`"
                target="_blank"
              >
                <img
                  class="mr-2 cursor-pointer"
                  src="@/assets/images/skill-icons_discord.svg"
                  height="45"
                />
              </a>
              <a v-if="communityById.socials.telegramHandle"
                :href="`https://t.me/${communityById.socials.telegramHandle}`"
                target="_blank"
              >
                <img
                  class="mr-2 cursor-pointer"
                  src="@/assets/images/logos_telegram.svg"
                  height="45"
                />
              </a>
              <a v-if="communityById.socials.githubHandle"
              :href="`https://github.com/${communityById.socials.githubHandle}`" target="_blank">
                <img
                  class="mr-2 cursor-pointer"
                  src="@/assets/images/task/github.svg"
                  height="45"
                />
              </a>
              <a v-if="communityById.domainUrl"
              :href="`${communityById.domainUrl}`" target="_blank">
                <img
                  class="mr-2 cursor-pointer"
                  src="@/assets/images/globe.svg"
                  height="53"
                />
              </a>
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
                    <Card :eventData="event" />
                  </v-col>
                </v-row>
                <v-row class="mt-5" v-if="!loading && communityEvents.length === 0">
                  <v-col cols="12">
                    <div class="d-flex align-center justify-center height-200">
                      <p class="font-25 lh-26 mx-5 purple-linear-gradient-text font-weight-medium">
                        No results found!
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
</template>
<script lang="ts" setup>
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'

const toggleDescription = ref(false)
const toggleRewards = ref(false)
const toggleRefer = ref(false)
const toggleParticipant = ref(false)
const following = ref(false)
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
import { useUserStore } from '@/store/user.ts'
import { useAuthStore } from '@/store/auth.ts'
import { getToken } from '@/composables/jwtService.ts'
import { useNotificationStore } from '@/store/notification.ts'
import { storeToRefs } from 'pinia'
const store = useCommunityStore()
const userStore = useUserStore()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const dialog = ref(true)
const isFollowed = ref(false)

const communityById = computed(() => store.getCommunityByIdData)
const communityEvents = computed(() => store.getEventsByCommunityId)
const communityFollowSuccess = computed(() => store.getCommunityFollow)

const { userMeta } = storeToRefs(useAuthStore)

const token = computed(() => {
  return getToken()
})

onMounted(async () => {
  loading.value = true
  fetchCommunity()
})

watch(
  () => authStore.userMeta,
  (value: any) => {
    isFollowed.value = value.communityIds.includes(route.params.id)
  }
)

watch(
  () => communityById.value,
  (value: any) => {
    setTimeout(async () => {
      loading.value = false
      if (token.value) {
        await authStore.USER_AUTHORIZE()
      }
    }, 1000)
  }
)

watch(
  () => communityEvents.value,
  (value: any) => {
    setTimeout(() => {
      loading.value = false
    }, 1000)
  }
)

watch(
  () => communityFollowSuccess.value,
  (value: any) => {
    following.value = false
    isFollowed.value = value
  }
)

const viewEvent = (event) => {
  router.push({ path: `/event/${event._id}` })
}

const followCommunity = async () => {
  if (token.value) {
    following.value = true
    await store.FOLLOW_COMMUNITY(`${route.params.id}`)
  } else {
    notificationStore.SHOW_NOTIFICATION({
      show: true,
      type: 'error',
      message: 'Please login to perform action'
    })
  }
}

const fetchCommunity = async () => {
  await store.GET_COMMUNITY_ID(route.params.id)
  await store.GET_EVENT_BY_COMMUNITY(`${route.params.id}`)
}
</script>
