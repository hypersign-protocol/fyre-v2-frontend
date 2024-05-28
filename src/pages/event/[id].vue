<template>
  <Loader v-if="loading && !errorMessage" />
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
      <v-container class="event__wrapper pt-8">
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
            <div class="rating__container">
              <div class="rating__review">
                <div class="rating__item">
                  <p class="font-20 font-weight-bold">3.2</p>
                  <p class="font-10 ml-3 font-weight-medium">
                    Out of <br />
                    5 stars
                  </p>
                </div>
                <div class="rating__count">
                  <p class="font-10 text-yellow-100">Based on 25 reviews</p>
                </div>
              </div>
              <div class="rating__star">
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
              <v-chip
                class="event_tag__chip cursor-pointer"
                size="large"
                v-for="(tag, index) in eventById.tags.slice(0, 2)"
                :key="index"
              >
                <img src="@/assets/images/label-tag.svg" class="icon" />
                <span class="content">{{ tag }}</span>
              </v-chip>
            </div>
          </div>
        </v-card>
        <v-card color="transparent">
          <v-card-text class="event-information">
            <div
              class="text-gray-100 cursor-pointer partipant--sec"
              @click="toggleParticipant = true"
            >
              <div class="img-wrap mr-2">
                <img class="ml-n3" src="@/assets/images/avatar01.png" height="28" />
                <img class="ml-n3" src="@/assets/images/avatar01.png" height="28" />
                <img class="ml-n3" src="@/assets/images/avatar01.png" height="28" />
                <img class="ml-n3" src="@/assets/images/avatar01.png" height="28" />
              </div>
              <span class="count">{{ eventById.participantCount }}+ </span>
              <v-divider vertical></v-divider>
            </div>
            <div class="event-time">
              <EventStatus :eventData="eventById" />
            </div>
            <div class="event-status"><span class="text-green-100">Active</span></div>
          </v-card-text>
          <v-card-title class="event-title">{{ eventById.eventName }} </v-card-title>
          <v-card-text class="event-meta">
            <v-chip
              class="event__chip cursor-pointer"
              size="large"
              @click="toggleDescription = true"
            >
              <img src="@/assets/images/description.svg" class="icon" />
              <span class="content">Description</span>
            </v-chip>
            <v-chip class="event__chip cursor-pointer" size="large" @click="toggleRewards = true">
              <img src="@/assets/images/reward01.svg" class="icon" />
              <span class="content">Rewards</span>
            </v-chip>
            <v-chip class="event__chip cursor-pointer" size="large" @click="toggleRefer = true">
              <img src="@/assets/images/refer.svg" class="icon" />
              <span class="content">Refer</span>
            </v-chip>
          </v-card-text>
          <v-card-text class="pt-5">
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
              <v-window-item value="task">
                <div class="d-flex align-center justify-space-between pa-5 mt-4">
                  <p class="font-25 font-weight--bold">Tasks</p>
                  <p class="font-16 font-weight--bold">
                    <span v-if="eventParticipants && eventParticipants.tasks"
                      >{{ Object.keys(eventParticipants.tasks).length }}
                    </span>
                    <span v-else>0</span> of
                    <span v-if="tasks">{{ tasks.length }}</span>
                    <span v-else>0</span>
                  </p>
                </div>
                <v-card class="event-task--card">
                  <template v-if="tasks.length > 0">
                    <template v-for="(task, index) in tasks" :key="index">
                      <Task
                        :task="task"
                        :communityId="eventById.communityId"
                        :eventParticipants="eventParticipants"
                        :token="token"
                        :walletInfo="formData"
                        class="mb-5"
                        @emitShowWallet="logWallet"
                        @removeFormData="clearWalletInfo"
                      />
                    </template>
                  </template>
                  <template v-if="tasks.length === 0">
                    <p class="text-center font-16 lh-18">No Tasks found!</p>
                  </template>
                </v-card>
              </v-window-item>
              <v-window-item value="leaderboard">
                <Leaderboard :eventId="eventById._id" :communityId="eventById.communityId" />
              </v-window-item>
              <v-window-item value="reward">
                <RewardTab :eventId="eventById._id" />
              </v-window-item>
              <v-window-item value="result">
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
      </v-container>
      <div class="homepage-section">
        <div class="section-content">
          <h4 class="homepage__section__title text-left">Explore other Events</h4>
          <v-row class="mt-5">
            <v-col v-for="(event, index) in popular.slice(0, 4)" cols="12" sm="6" md="6" lg="3">
              <Card :eventData="event" />
            </v-col>
          </v-row>
          <div
            class="d-flex align-center justify-center my-5"
            @click="router.push({ path: `/explore` })"
          >
            <v-btn class="base-btn" variant="outlined" rounded>See more</v-btn>
          </div>
        </div>
      </div>
    </v-container>
    <EventDescription
      v-if="eventById"
      @close="toggleDescription = false"
      v-model="toggleDescription"
      :eventData="eventById"
    />
    <EventRewards :eventData="eventById" @close="toggleRewards = false" v-model="toggleRewards" />
    <EventRefer
      :eventData="eventById"
      :eventParticipants="eventParticipants"
      @close="toggleRefer = false"
      v-model="toggleRefer"
    />
    <EventParticipant
      :eventId="eventById._id"
      :communityId="eventById.communityId"
      @close="toggleParticipant = false"
      v-model="toggleParticipant"
    />
  </template>

  <BlockChainWallet :options="options" @emitProvider="getProvider" @emitWalletAddress="collectWalletAddress"
    @emitSignedData="collectSignedData" @emitError="collectError" />
  <div id="emit-options" @click="emitOptions(options)"></div>
</template>
<script lang="ts" setup>
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useNotificationStore } from '@/store/notification.ts'


const notificationStore = useNotificationStore()
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
  // {
  //   title: 'Results',
  //   slug: 'result'
  // },
  {
    title: 'Rewards',
    slug: 'reward'
  }
])

import { useEventStore } from '@/store/event.ts'
import { useAuthStore } from '@/store/auth.ts'
import { isEventHappening } from '@/composables/event.ts'
import { useEventParticipantStore } from '@/store/eventParticipant.ts'
import { getToken, getUser } from '@/composables/jwtService.ts'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()

const eventStore = useEventStore()
const eventParticipantStore = useEventParticipantStore()

const { eventParticipants } = storeToRefs(useEventParticipantStore())
const { userMeta } = storeToRefs(useAuthStore())

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const isEventHappeningTrue = ref(true)
const dialog = ref(true)
const errorMessage = ref('')

const tasks = computed(() => eventStore.getEventTasksList)

const eventById = computed(() => eventStore.getEventByIdData)

const eventErr = computed(() => eventStore.geteventError)

const token = computed(() => {
  return getToken()
})

const authUser = computed(() => {
  return getUser()
})

const formData = reactive({
  walletAddress: null,
  signedDidDoc: null,
  taskId: null
})

const options = reactive({
  showBwModal: false,
  providers: ['evm', 'interchain'],
  chains: [''],
  isRequiredDID: false,
  isPerformAction: authUser.value.didDocument ? true : false, // by changing to true, 
  didDocument: authUser.value.didDocument,
  addVerificationMethod: true,
  selectedNetwork: null
})

watch(
  () => formData,
  (value: any) => {
    if (value.walletAddress !== null && value.signedDidDoc !== null) {
      console.log(value)
    }
  },
  { deep: true }
)
const getProvider = async (data: any) => {
  console.log('Inside getProvider handler for event emitProvider')
  if (data) {
    await authStore.USER_LOGIN(`?provider=${data}-wallet`)
  } else {
    console.log('Please select the provider before you proceed')
  }
}

const collectWalletAddress = async (data) => {
  console.log(data)
  formData.walletAddress = data.walletAddress
}

// const collectSignedData = async (data) => {

// }

const collectError = (data: any) => {
  debugger
  console.error(data)
  notificationStore.SHOW_NOTIFICATION({
    show: true,
    type: 'error',
    message: data
  })
}

const collectSignedData = async (data: any) => {
  console.log('Inside collectSignedData...')
  if (authUser.value.didDocument) {

    formData.walletAddress = data.walletAddress
    formData.signedDidDoc = data.signProof
  } else {
    if (data.signProof) {
      await authStore.USER_AUTHENTICATE({ signedDid: data.signProof })
    } else {
      console.log('Please select the provider before you proceed')
    }
  }

}

const clearWalletInfo = async () => {
  console.log('clear')
  formData.walletAddress = null
  formData.signedDidDoc = null
  formData.taskId = null
  delete options.didDocument.proof;
}

const logWallet = async (data) => {
  console.log(authUser.value)
  console.log(typeof data.network)
  console.log(data.network)
  options.providers = data.network === 'evm' ? ['evm'] : ['interchain']
  options.selectedNetwork = data.network
  options.showBwModal = true
  formData.taskId = data.taskId
  options.didDocument = authUser.value.didDocument
  console.log(options)

  setTimeout(async () => {
    document.getElementById('emit-options').click()
  }, 100)
}

onMounted(async () => {
  loading.value = true
  loadEventTasks()
})

const checkEventStarted = () => {
  const x = isEventHappening(eventById.value.startDate, eventById.value.endDate)

  if (x) {
    isEventHappeningTrue.value = true
  } else {
    isEventHappeningTrue.value = false
  }
}

watch(
  () => activeTab.value,
  (value: any) => {}
)

watch(
  () => eventErr.value,
  (value: any) => {
    loading.value = false
    errorMessage.value = value.error.details[0]
  }
)

watch(
  () => eventParticipantStore.eventParticipants,
  (value: any) => {
    setTimeout(async () => {
      loading.value = false
    }, 1000)
  }
)

watch(
  () => tasks.value,
  (value: any) => {
    setTimeout(async () => {
      if (token.value) {
        await eventParticipantStore.EVENT_PARTICIPANTS(route.params.id)
      } else {
        loading.value = false
      }
      await getOtherEvents()
    }, 1000)
  }
)

watch(
  () => eventById.value,
  (value: any) => {
    setTimeout(() => {
      getTasks()
      checkEventStarted()
    }, 1000)
  }
)

const viewCommunity = (id) => {
  router.replace({ path: `/community/${id}` })
}

const popular = computed(() => eventStore.getPopularEvents)

watch(
  () => popular.value,
  (value: any) => {
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
