<template>
  <v-overlay
    v-if="loading && !errorMessage"
    v-model="loading"
    class="align-center justify-center fill-height"
  >
    <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
  </v-overlay>

  <template v-else-if="errorMessage">
    <v-container fluid class="background-left">
      <v-container class="padding-global-y">
        <div class="d-flex align-center justify-center height-200 font-30">
          {{ errorMessage }}
        </div>
      </v-container>
    </v-container>
  </template>

  <template v-else>
    <v-container fluid class="background-left">
      <v-container class="padding-global-y">
        <v-card color="transparent" class="rounded-lg">
          <div class="d-flex align-center justify-space-between pa-3 bg-black-100">
            <div
              class="d-flex align-center cursor-pointer"
              @click="viewCommunity(eventById.communityId)"
            >
              <div class="d-flex align-center">
                <v-avatar class="cursor-pointer mr-2">
                  <v-img alt="John" :src="eventById.communityDetail?.avatar"></v-img>
                </v-avatar>
                <p class="mr-2 font-14 lh-16 cursor-pointer">
                  {{ eventById.communityDetail?.communityName }}
                </p>
                <img
                  v-if="eventById.communityDetail?.hasDomainVerified"
                  src="@/assets/images/verify.svg"
                  height="16"
                  class="cursor-pointer"
                />
              </div>
              <div class="d-flex align-center ml-2">
                <v-avatar size="small" class="cursor-pointer mr-2">
                  <v-img alt="John" src="@/assets/images/verify-check.svg"></v-img>
                </v-avatar>
              </div>
            </div>
            <div class="d-flex align-center flex-row">
              <div class="d-flex flex-column">
                <div class="d-flex flex-row align-center">
                  <p class="font-20 font-weight-bold">3.2</p>
                  <p class="font-10 ml-3 font-weight-medium">
                    Out of <br />
                    5 stars
                  </p>
                </div>
                <div class="d-flex">
                  <p class="font-10 text-yellow-100">Based on 25 reviews</p>
                </div>
              </div>
              <div class="text-center">
                <v-rating
                  v-model="rating"
                  hover
                  active-color="#FFD02B"
                  density="compact"
                  color="white"
                ></v-rating>
              </div>
            </div>
          </div>
          <div class="image-container">
            <img :src="eventById.banner" alt="Your Image Description" />
            <div class="tags__wrapper">
              <v-card-text class="d-flex py-4">
                <v-chip class="event_tag__chip cursor-pointer" size="large">
                  <img src="@/assets/images/label-tag.svg" height="16" />
                  <span class="ml-2 font-16 font-weight-medium">PlayEarn</span>
                </v-chip>
                <v-chip class="event_tag__chip cursor-pointer" size="large">
                  <img src="@/assets/images/label-tag.svg" height="16" />
                  <span class="ml-2 font-16 font-weight-medium">Ethereum</span>
                </v-chip>
                <v-chip class="event_tag__chip cursor-pointer" size="large">
                  <img src="@/assets/images/label-tag.svg" height="16" />
                  <span class="ml-2 font-16 font-weight-medium">Avalanche</span>
                </v-chip>
              </v-card-text>
            </div>
          </div>
        </v-card>
        <v-card color="transparent">
          <v-card-text class="d-flex align-center">
            <div
              class="text-gray-100 font-20 font-weight-medium mr-2 cursor-pointer d-flex align-center"
              @click="toggleParticipant = true"
            >
              <div class="d-flex mr-2">
                <img class="ml-n3" src="@/assets/images/avatar01.png" height="28" />
                <img class="ml-n3" src="@/assets/images/avatar01.png" height="28" />
                <img class="ml-n3" src="@/assets/images/avatar01.png" height="28" />
                <img class="ml-n3" src="@/assets/images/avatar01.png" height="28" />
              </div>
              {{ eventById.participantCount }} <v-divider vertical></v-divider>
            </div>
            <div class="font-20 font-weight-medium mx-2">
              Ends In <Duration v-if="eventById.endDate" :eventDate="eventById.endDate" />
            </div>
            <div class="ml-3"><span class="text-green-100">Active</span></div>
          </v-card-text>
          <v-card-title class="pl-0 font-weight-bold font-30"
            >{{ eventById.eventName }}
          </v-card-title>
          <v-card-text class="pl-0 d-flex py-4">
            <v-chip
              class="event__chip cursor-pointer"
              size="large"
              @click="toggleDescription = true"
            >
              <img src="@/assets/images/description.svg" height="16" />
              <span class="ml-2 font-16 font-weight-medium">Description</span>
            </v-chip>
            <v-chip class="event__chip cursor-pointer" size="large" @click="toggleRewards = true">
              <img src="@/assets/images/reward01.svg" height="16" />
              <span class="ml-2 font-16 font-weight-medium">Rewards</span>
            </v-chip>
            <v-chip class="event__chip cursor-pointer" size="large" @click="toggleRefer = true">
              <img src="@/assets/images/refer.svg" height="16" />
              <span class="ml-2 font-16 font-weight-medium">Refer</span>
            </v-chip>
          </v-card-text>
          <v-card-text class="pl-0">
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
              <v-window-item :eager="true" value="task">
                <div class="d-flex align-center justify-space-between pa-5 mt-4">
                  <p class="font-25 font-weight--bold">Tasks</p>
                  <p class="font-16 font-weight--bold">0 of 5</p>
                </div>
                <v-card class="event-task--card">
                  <template v-for="(task, index) in tasks">
                    <Task :task="task" :communityId="eventById.communityId" class="mb-5" />
                  </template>
                </v-card>
              </v-window-item>
              <v-window-item :eager="true" value="leaderboard">
                <div class="d-flex align-center justify-space-between pa-5 mt-4">
                  <p class="font-25 font-weight--bold">Live Leaderboard</p>
                  <p class="font-16 font-weight--bold">
                    <span class="text-blue-100">Total Participants </span>
                    <span>1900</span>
                  </p>
                </div>
                <v-card class="event-task--card">
                  <div
                    class="d-flex align-center justify-space-between bg-black-100 pa-2 rounded-10 mb-4"
                    v-for="(item, index) in 10"
                    :key="index"
                  >
                    <div class="d-flex align-center">
                      <img src="@/assets/images/leader01.svg" class="mr-2" />
                      <v-avatar size="large" class="mr-2">
                        <v-img src="@/assets/images/avatar01.png"> </v-img>
                      </v-avatar>
                      <p class="ml-2 font-22 font-weight-bold">Kelvin</p>
                    </div>
                    <div class="d-flex align-center">
                      <p class="font-22 font-weight-medium">900 XP</p>
                    </div>
                  </div>
                </v-card>
              </v-window-item>
              <v-window-item :eager="true" value="result">
                <div class="d-flex align-center justify-space-between pa-5 mt-4">
                  <p class="font-25 font-weight--bold">Results</p>
                  <p class="font-16 font-weight--bold">
                    <span class="text-blue-100">Total winners </span>
                    <span>4</span>
                  </p>
                </div>
                <v-card class="event-task--card">
                  <v-row>
                    <v-col cols="12" md="4" v-for="(item, index) in 4">
                      <div
                        class="d-flex bg-black-100 pa-4 rounded-xl justify-space-between result--block"
                      >
                        <div class="d-flex align-center">
                          <v-avatar size="63" class="mr-2">
                            <v-img src="@/assets/images/avatar01.png"> </v-img>
                          </v-avatar>
                          <div class="d-flex flex-column">
                            <p>Kelvin</p>
                            <p>Won 2 NFTs</p>
                            <p class="text-orange-200">Rank: 1st</p>
                          </div>
                        </div>
                        <div class="d-flex align-end justify-end">
                          <p class="text-blue-100">50$</p>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-card>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>

        <div class="padding-global-y">
          <h4 class="font-42 font-weight-bold">Explore other Events</h4>

          <v-row class="mt-5">
            <v-col v-for="(event, index) in popular.slice(0, 4)" cols="12" sm="6" md="6" lg="3">
              <v-hover v-slot="{ isHovering, props }">
                <v-card class="community-card rounded-xl cursor-pointer" v-bind="props">
                  <v-img class="align-end text-white" :src="event.banner" cover> </v-img>
                  <v-card-text>
                    <div>{{ event.eventName }}</div>
                    <p class="my-2 font-12">Starts in: <Duration :eventDate="event.startDate" /></p>
                    <div class="d-flex align-center">
                      <v-chip size="small" label class="orange--chip mr-2"> 10 EXP </v-chip>
                      <v-chip size="small" label class="green--chip"> 500 USTD </v-chip>
                    </div>
                    <p class="my-2">{{ event.participantCount }} Participants</p>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center">
                      <v-avatar class="cursor-pointer mr-2">
                        <v-img alt="John" :src="event.communityDetail.avatar"></v-img>
                      </v-avatar>
                      <p class="mr-2 font-14 lh-16">{{ event.communityDetail.communityName }}</p>
                      <img
                        v-if="event.communityDetail.hasDomainVerified"
                        src="@/assets/images/verify.svg"
                        height="16"
                      />
                    </div>
                    <div class="d-flex align-center">
                      <v-avatar size="small" class="cursor-pointer mr-2">
                        <v-img alt="John" src="@/assets/images/verify-check.svg"></v-img>
                      </v-avatar>
                    </div>
                  </v-card-actions>
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
        </div>
      </v-container>
    </v-container>
    <EventDescription
      @close="toggleDescription = false"
      v-model="toggleDescription"
      :description="eventById.description"
    />
    <EventRewards @close="toggleRewards = false" v-model="toggleRewards" />
    <EventRefer @close="toggleRefer = false" v-model="toggleRefer" />
    <EventParticipant @close="toggleParticipant = false" v-model="toggleParticipant" />
  </template>
</template>
<script lang="ts" setup>
  import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
const toggleDescription = ref(false)
const toggleRewards = ref(false)
const toggleRefer = ref(false)
const toggleParticipant = ref(false)
const rating = ref('3.2')
const activeTab = ref('task')
const tabs = ref([
  {
    title: 'Tasks',
    slug: 'task'
  },
  {
    title: 'Leaderboard',
    slug: 'leaderboard'
  },
  {
    title: 'Results',
    slug: 'result'
  },
  {
    title: 'Rewards',
    slug: 'reward'
  }
])

import { useEventStore } from '@/store/event.ts'

import { storeToRefs } from 'pinia'
const eventStore = useEventStore()
const route = useRoute()
const router = useRouter()

const loading = ref(true)
const dialog = ref(true)
const errorMessage = ref('')

const tasks = computed(() => eventStore.getEventTasksList)

const eventById = computed(() => eventStore.getEventByIdData)

const eventErr = computed(() => eventStore.geteventError)

onMounted(async () => {
  loading.value = true
  loadEventTasks()
})

watch(
  () => activeTab.value,
  (value: any)  => {}
)

watch(
  () => eventErr.value,
  (value: any)  => {
    loading.value = false
    console.log(value.success)
    console.log(value.error.details)
    errorMessage.value = value.error.details[0]
  }
)

watch(
  () => tasks.value,
  (value: any)  => {
    setTimeout(() => {
      loading.value = false
      getOtherEvents()
    }, 1000)
  }
)

watch(
  () => eventById.value,
  (value: any)  => {
    console.log(`value ${value}`)
    setTimeout(() => {
      getTasks()
    }, 1000)
  }
)

const viewCommunity = (id) => {
  router.replace({ path: `/community/${id}` })
}

const popular = computed(() => eventStore.getPopularEvents)

watch(
  () => popular.value,
  (value: any)  => {
    setTimeout(() => {
      loading.value = false
    }, 1000)
  }
)

const viewEvent = async (event) => {
  await router.push({ path: `/event/${event._id}` })
  router.go(0)
}

const getTasks = async () => {
  await eventStore.GET_EVENT_TASKS(route.params.id)
}

const getOtherEvents = async () => {
  await eventStore.POPULAR_EVENTS(`?page=1&limit=10`)
}

const loadEventTasks = async () => {
  await eventStore.GET_EVENT_BY_ID(route.params.id)
}
</script>
