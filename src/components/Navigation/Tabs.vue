<template>
  <v-card color="transparent">
    <v-tabs
      selected-class="tab--active"
      slider-color="secondary"
      v-model="activeTab"
      align-tabs="left"
      class="nav--tabs"
    >
      <v-tab :value="item.slug" v-for="(item, index) in tabs" :key="index">{{ item.name }}</v-tab>
    </v-tabs>
    <v-window v-model="activeTab">
      <v-window-item
        :value="item.slug"
        v-for="(item, index) in tabs"
        :key="index"
        class="tabs--panel"
      >
        <v-row class="py-5" no-gutters>
          <v-col cols="2">
            <v-select
              hide-details
              class="base-select"
              v-model="rewardFilter"
              density="compact"
              :items="rewards"
              item-title="name"
              item-value="slug"
              variant="solo"
              placeholder="All Rewards"
            >
            </v-select>
          </v-col>
          <v-col cols="4" offset="6">
            <v-text-field
              hide-details
              class="base-input"
              density="compact"
              placeholder="Search events by name or tags"
              variant="solo"
              v-model="options.search"
            >
              <template v-slot:prepend-inner>
                <v-icon icon="mdi-magnify" />
              </template>
            </v-text-field>
          </v-col>
        </v-row>
        <!--   <v-card class="filter-panel">
          <div class="menu">
            <div class="field__label">Reward Type</div>
            <div class="field__content">
              <div class="field__tag" v-for="(item,index) in rewards" :key="index">
                {{item.name}}
              </div>
            </div>
          </div>
          <div class="field__action">
            <v-btn color="white" class="white">Reset</v-btn>
            <v-btn color="primary" class="fill">Confirm</v-btn>
          </div>
        </v-card> -->
        <Loader v-if="loading" />
        <v-row class="mt-5" v-if="!loading && events?.data?.length > 0">
          <v-col v-for="(event, index) in events?.data" cols="12" sm="6" md="4" lg="3">
            <Card :eventData="event" />
          </v-col>
        </v-row>
        <v-row class="mt-5" v-if="!loading && events?.data?.length === 0">
          <v-col cols="12">
            <div class="d-flex align-center justify-center height-200">
              <p class="font-25 lh-26 mx-5 text-white font-weight-medium">No results found!</p>
            </div>
          </v-col>
        </v-row>
        <div class="text-center d-flex align-center justify-center my-6" v-if="events.total > 8">
          <Pagination
            :page="options.page"
            :limit="options.limit"
            :total="events.total"
            @pageChange="pageChange"
          />
        </div>
      </v-window-item>
    </v-window>
  </v-card>
</template>
<script lang="ts" setup>
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import _ from 'lodash'
const loading = ref(false)
const activeTab = ref('coming_soon')
const rewardFilter = ref(null)
const tabs = ref([
  {
    name: 'All',
    slug: 'all'
  },
  {
    name: 'Coming Soon',
    slug: 'coming_soon'
  },
  {
    name: 'Ends in 24h',
    slug: 'ends_in_24h'
  }
])

const rewards = ref([
  {
    name: 'Token',
    slug: 'token'
  },
  {
    name: 'NFT',
    slug: 'nft'
  },
  {
    name: 'Assured Reward',
    slug: 'assured_reward'
  },
  {
    name: 'Pending Reward',
    slug: 'pending_reward'
  }
])
import { useEventStore } from '@/store/event.ts'

import { storeToRefs } from 'pinia'
const eventStore = useEventStore()
const router = useRouter()

const options = reactive({
  page: 1,
  limit: 8,
  search: '',
  filter: 'coming_soon'
})

const events = computed(() => eventStore.getTabEvents)

onMounted(async () => {
  loadEvents()
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
  () => activeTab.value,
  (value: any) => {
    options.page = 1
    options.search = ''
    options.filter = value
    loadEvents()
  }
)

watch(
  () => rewardFilter.value,
  (value: any) => {
    options.filter = value
    loadEvents()
  }
)

watch(
  () => options.page,
  (value: any) => {
    console.log(value)
    setTimeout(async () => {
      loadEvents()
    }, 100)
  }
)

watch(
  () => events.value,
  (value: any) => {
    setTimeout(() => {
      loading.value = false
    }, 1000)
  }
)

const viewEvent = (event) => {
  window.location.href = `/event/${event._id}`
}

const loadEvents = async () => {
  loading.value = true
  let params = `?page=${options.page}&limit=${options.limit}`

  if (options.filter !== 'all') {
    params += `&filter=${options.filter}`
  }

  if (options.search) {
    params += `&searchString=${options.search}`
  }
  await eventStore.TAB_EVENTS(params)
}
</script>
