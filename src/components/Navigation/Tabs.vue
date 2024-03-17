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
      <v-window-item :eager="true" :value="item.slug" v-for="(item, index) in tabs" :key="index">
        <v-row class="py-5" no-gutters>
          <v-col cols="2">
            <v-select
              hide-details
              density="compact"
              :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
              variant="solo"
              placeholder="All Rewards"
            >
            </v-select>
          </v-col>
          <v-col cols="4" offset="6">
            <v-text-field
              hide-details
              density="compact"
              class="rounded-pill is-border-radius"
              placeholder="Search events by name or tags"
              variant="solo"
            >
              <template v-slot:prepend-inner>
                <v-icon icon="mdi-magnify" />
              </template>
            </v-text-field>
          </v-col>
        </v-row>
        <Loader v-if="loading" />
        <v-row class="mt-5" v-if="!loading && events.length > 0">
          <v-col v-for="(event, index) in events.slice(0, 8)" cols="12" sm="6" md="4" lg="3">
            <Card :eventData="event" />
          </v-col>
        </v-row>
        <v-row class="mt-5" v-if="!loading && events.length === 0">
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
  </v-card>
</template>

<script lang="ts" setup>
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
const loading = ref(false)
const activeTab = ref('coming_soon')
const tabs = ref([
  {
    name: 'Coming Soon',
    slug: 'coming_soon'
  },
  {
    name: 'Ends in 24h',
    slug: 'ends_in_24h'
  }
])
import { useEventStore } from '@/store/event.ts'

import { storeToRefs } from 'pinia'
const eventStore = useEventStore()
const router = useRouter()

const events = computed(() => eventStore.getTabEvents)

onMounted(async () => {
  loadEvents()
})

watch(
  () => activeTab.value,
  (value: any) => {
    loadEvents()
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
  await eventStore.TAB_EVENTS(`?page=2&limit=10`)
}
</script>
