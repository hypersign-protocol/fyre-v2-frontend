<template>
  <Loader v-if="loading" />
  <div class="tab__card" v-if="!loading">
    <v-tabs selected-class="tab--active" slider-color="secondary" v-model="activeTab" align-tabs="left" color="white"
      class="event__tabs">
      <v-tab :value="item.slug" v-for="(item, index) in tabs" :key="index" @click="handleTab(item, index)">
        {{ item.title }}
        <span class="ml-2 text-blue-100" v-if="item.slug === 'events' && eventData.length > 0">({{
          eventData[0]?.events?.length }})</span>
        <span class="ml-2 text-blue-100" v-if="item.slug === 'communities' && communityData.length > 0">({{
          communityData[0]?.communities?.length }})</span>
      </v-tab>
    </v-tabs>
    <v-window v-model="activeTab">
      <v-window-item :eager="true" value="events">
        <Loader v-if="loading" />
        <v-card class="bg__card tab__card" v-if="!loading">
          <v-row class="mt-5" v-if="!loading && eventData.data.events.length > 0">
            <template v-for="(item, index) in eventData.data.events">
              <v-col cols="12" sm="6" md="6" xl="3" lg="3">
                <Card :eventData="item" />
              </v-col>
            </template>
          </v-row>
          <v-row class="mt-5" v-else="!loading && eventData.data.events.length === 0">
            <v-col cols="12">
              <div class="d-flex align-center justify-center height-200">
                <p class="font-25 lh-26 mx-5 purple-linear-gradient-text font-weight-medium">
                  No events found!
                </p>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-window-item>
      <v-window-item :eager="true" value="communities">
        <Loader v-if="loading" />
        <v-card class="bg__card tab__card" v-if="!loading">
          <Loader v-if="loading" />
          <v-row v-if="!loading && communityData.data.communities.length > 0">
            <template :key="index" v-for="(item, index) in communityData.data.communities">
              <v-col cols="12" sm="6" md="6" xl="3" lg="3">
                <CommunityCard :communityData="item" />
              </v-col>
            </template>
            <div class="text-center d-flex align-center justify-center my-6" v-if="communityData.total > 8">
              <Pagination :page="options.page" :limit="options.limit" :total="communityData.total"
                @pageChange="pageChange" />
            </div>
          </v-row>
          <v-row class="mt-5" v-else="communityData.communities.length === 0">
            <v-col cols="12">
              <div class="d-flex align-center justify-center height-200">
                <p class="font-25 lh-26 mx-5 purple-linear-gradient-text font-weight-medium">
                  No communities found!
                </p>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-window-item>
      <v-window-item :eager="true" value="credentials">
        <Loader v-if="loading" />
        <v-card class="bg__card tab__card" v-if="!loading">
          <Loader v-if="loading" />
          <!-- <v-row class="py-4">
            <v-col cols="12" md="6">
              <v-text-field hide-details density="compact" class="rounded-pill is-border-radius"
                placeholder="Search Credentials" variant="solo" height="53" flat>
                <template v-slot:prepend-inner>
                  <v-icon icon="mdi-magnify" />
                </template>
              </v-text-field>
            </v-col>
          </v-row> -->
          <v-row v-if="!loading && credentialsData.length > 0">
            <v-col cols="12" sm="6" md="6" xl="3" lg="3" v-for="(item, index) in credentialsData" :key="index">
              <div class="credentials__card">
                <div class="header">
                  <div class="tittle__card">
                    <h1>{{ parseActionCategory(item.credential.type[1]) }}</h1>
                    <p> {{ formateDID(item.credential.id) }}</p>
                  </div>
                  <div class="image">
                    <img :src="getActionCategoryIconUrl(item.credential.type[1])" height=40 />
                  </div>
                </div>
                <div class="footer">
                  <div>
                    <label>Curated By</label>
                    <!-- <p>{{ item.community.communityName }}</p> -->
                    <div class="d-flex align-center cursor-pointer">
                      <div class="d-flex align-center">
                        <div
                          class="v-avatar v-theme--custom v-avatar--density-default v-avatar--size-default v-avatar--variant-flat cursor-pointer mr-2">
                          <div class="v-responsive v-img" aria-label="John" role="img">
                            <div class="v-responsive__sizer" style="padding-bottom: 105.469%;"></div>
                            <img class="v-img__img v-img__img--cover" :src="item.community.avatar" alt="John">
                          </div><span class="v-avatar__underlay"></span>
                        </div>
                        <p class="mr-2 font-14 lh-16 cursor-pointer"><a href="#">{{ item.community.communityName }}</a>
                        </p>
                        <!--v-if-->
                      </div>
                    </div>
                  </div>
                  <div>
                    <label>Validity</label>
                    <p>{{ formatExpiryDate(item.credential.expirationDate) }}</p>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row class="mt-5" v-else="credentialsData.length === 0">
            <v-col cols="12">
              <div class="d-flex align-center justify-center height-200">
                <p class="font-25 lh-26 mx-5 purple-linear-gradient-text font-weight-medium">
                  No credentials found!
                </p>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-window-item>
    </v-window>
  </div>
</template>
<script lang="ts" setup>
import _ from 'lodash'
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useUserStore } from '@/store/user.ts'
import { storeToRefs } from 'pinia'
import { images as actionIcons } from '@/data/event/Images.ts'

const store = useUserStore()
const router = useRouter()
const loading = ref(false)
const eventData = computed(() => store.getUserEvents)
const communityData = computed(() => store.getUserCommunities)
const credentialsData = computed(() => store.getUserCredentials)
const activeTab = ref('events')

const parseActionCategory = (actionType) => {
  console.log(actionType)
  const result = actionType.replace(/([a-z])([A-Z])/g, '$1 $2');
  return result
}

const getActionCategoryIconUrl = (actionType) => {
  const result = parseActionCategory(actionType)
  const category: string = result.split(' ')[0].toLowerCase();
  const url = actionIcons[category];
  console.log({
    result,
    category,
    url
  })
  return url;
}

const formatExpiryDate = (expDate: string) => {
  const date = new Date(expDate);
  const formattedDate = date.getMonth() + '/' + date.getFullYear();
  return formattedDate;
}

const formateDID = (did: string) => {
  const first = did.substring(0, 12)
  const last = did.substring(did.length - 5, did.length)
  return (first + '...' + last).toUpperCase();
}

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

const options = reactive({
  page: 1,
  limit: 8,
  search: ''
})

const pageChange = (page) => {
  options.page = page
}

const searchKey = _.debounce(() => {
  setTimeout(async () => {
    options.page = 1
    loadEvents()
  })
}, 500)

watch(() => options.search, searchKey)

watch(
  () => options.page,
  (value: any) => {
    setTimeout(async () => {
      userCommunities()
    }, 100)
  }
)

onMounted(async () => {
  loading.value = true
  userEvents()
})

const handleTab = (item, index) => {
  loading.value = true
  if (item.slug == 'events') {
    userEvents()
  } else if (item.slug == 'communities') {
    userCommunities()
  } else if (item.slug == 'credentials') {
    userCredentials()
  } else {
    loading.value = false
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
  () => credentialsData.value,
  (value: any) => {
    setTimeout(async () => {
      loading.value = false
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
  let params = `?page=${options.page}&limit=${options.limit}`

  if (options.search) {
    params += `&searchString=${options.search}`
  }
  await store.USER_COMMUNITIES(params)
}

const userCredentials = async () => {

  // let params = `?page=${options.page}&limit=${options.limit}`

  // if (options.search) {
  //   params += `&searchString=${options.search}`
  // }
  const resp = await store.USER_CREDENTIALS("")
  if (!resp || resp.length === 0) {
    loading.value = false;
  }
}
</script>
