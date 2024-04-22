<template>
  <div v-if="loading" class="height-500 d-flex align-center justify-center fill-height">
    <v-progress-circular
      class="d-flex align-center justify-center"
      alicolor="primary"
      size="64"
      indeterminate
    ></v-progress-circular>
  </div>
  <div class="tab__card" v-if="!loading">
    <v-tabs
      selected-class="tab--active"
      slider-color="secondary"
      v-model="activeTab"
      align-tabs="left"
      color="white"
      class="event__tabs"
    >
      <v-tab
        :value="item.slug"
        v-for="(item, index) in tabs"
        :key="index"
        @click="handleTab(item, index)"
      >
        {{ item.title }}
        <span class="ml-2 text-blue-100" v-if="item.slug === 'events' && eventData.length > 0"
          >({{ eventData[0]?.events?.length }})</span
        >
        <span
          class="ml-2 text-blue-100"
          v-if="item.slug === 'communities' && communityData.length > 0"
          >({{ communityData[0]?.communities?.length }})</span
        >
      </v-tab>
    </v-tabs>
    <v-window v-model="activeTab">
      <v-window-item :eager="true" value="events">
        <Loader v-if="loading" />
        <v-card class="bg__card tab__card" v-if="!loading && eventData.length > 0">
          <v-row class="py-4">
            <v-col cols="12" md="6">
              <v-text-field
                hide-details
                density="compact"
                class="rounded-pill is-border-radius"
                placeholder="Search Events"
                variant="solo"
                height="53"
                flat
              >
                <template v-slot:prepend-inner>
                  <v-icon icon="mdi-magnify" />
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row class="mt-5">
            <template v-for="(item, index) in eventData">
              <v-col v-for="(event, index) in item.events" cols="12" sm="6" md="6" xl="3" lg="3">
                <Card :eventData="event" />
              </v-col>
            </template>
          </v-row>
        </v-card>
        <v-row class="mt-5" v-if="!loading && eventData.length === 0">
          <v-col cols="12">
            <div class="d-flex align-center justify-center height-200">
              <p class="font-25 lh-26 mx-5 purple-linear-gradient-text font-weight-medium">
                No events found!
              </p>
            </div>
          </v-col>
        </v-row>
      </v-window-item>
      <v-window-item :eager="true" value="communities">
        <Loader v-if="loading" />
        <v-card class="bg__card tab__card" v-if="!loading && communityData.length > 0">
          <v-row class="py-4">
            <v-col cols="12" md="6">
              <v-text-field
                hide-details
                density="compact"
                class="rounded-pill is-border-radius"
                placeholder="Search Community"
                variant="solo"
                height="53"
                flat
              >
                <template v-slot:prepend-inner>
                  <v-icon icon="mdi-magnify" />
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <template v-for="(item, index) in communityData">
              <v-col
                cols="12"
                sm="6"
                md="6"
                xl="3"
                lg="3"
                v-for="(community, index) in item.communities"
                :key="index"
              >
                <CommunityCard :communityData="community" />
              </v-col>
            </template>
          </v-row>
        </v-card>
        <v-row class="mt-5" v-if="!loading && communityData.length === 0">
          <v-col cols="12">
            <div class="d-flex align-center justify-center height-200">
              <p class="font-25 lh-26 mx-5 purple-linear-gradient-text font-weight-medium">
                No communities found!
              </p>
            </div>
          </v-col>
        </v-row>
      </v-window-item>
      <v-window-item :eager="true" value="credentials">
        <v-card class="bg__card tab__card">
          <v-row class="py-4">
            <v-col cols="12" md="6">
              <v-text-field
                hide-details
                density="compact"
                class="rounded-pill is-border-radius"
                placeholder="Search Credentials"
                variant="solo"
                height="53"
                flat
              >
                <template v-slot:prepend-inner>
                  <v-icon icon="mdi-magnify" />
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6" md="6" xl="3" lg="3" v-for="(item, index) in 5" :key="index">
              <div class="credentials__card">
                <div class="header">
                  <div class="tittle__card">
                    <h1>Discord Join</h1>
                    <p>VC: HID...DXDFSDF21DS21</p>
                  </div>
                  <div class="image">
                    <img src="@/assets/images/skill-icons_discord.svg" />
                  </div>
                </div>
                <div class="footer">
                  <div>
                    <label>Curated By</label>
                    <p>Taskonxyz</p>
                  </div>
                  <div>
                    <label>Validity</label>
                    <p>08/21</p>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-window-item>
    </v-window>
  </div>
</template>
<script lang="ts" setup>
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useUserStore } from '@/store/user.ts'
import { storeToRefs } from 'pinia'
const store = useUserStore()
const router = useRouter()
const loading = ref(false)
const eventData = computed(() => store.getUserEvents)
const communityData = computed(() => store.getUserCommunities)
const activeTab = ref('events')
const tabs = ref([
  {
    title: 'Participated Events',
    slug: 'events'
  },
  {
    title: 'Communities Joined',
    slug: 'communities'
  },
  {
    title: 'Credentials',
    slug: 'credentials'
  }
])

onMounted(async () => {
  loading.value = true
  userEvents()
})

const handleTab = (item, index) => {
  if (item.slug == 'events') {
    userEvents()
  } else if (item.slug == 'communities') {
    userCommunities()
  }
}

watch(
  () => eventData.value,
  (value: any) => {
    setTimeout(async () => {
      loading.value = false
      // await store.USER_AUTH()
    }, 1000)
  }
)

watch(
  () => communityData.value,
  (value: any) => {
    setTimeout(() => {
      loading.value = false
    }, 1000)
  }
)

const userEvents = async () => {
  await store.USER_EVENTS()
}

const userCommunities = async () => {
  await store.USER_COMMUNITIES()
}
</script>
