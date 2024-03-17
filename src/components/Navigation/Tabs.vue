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
          <v-col v-for="(event, index) in events.slice(0, 8)" cols="12" sm="6" md="6" lg="3">
            <v-hover v-slot="{ isHovering, props }">
              <v-card class="community-card rounded-xl cursor-pointer" v-bind="props">
                <v-img class="align-end text-white" :src="event.banner" cover> </v-img>
                <v-card-text>
                  <div>{{ event.eventName }}</div>
                  <p class="my-2 font-12">Ends in: <Duration :eventDate="event.endDate" /></p>
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
                      <v-img alt="John" :src="event.communityDetail?.avatar"></v-img>
                    </v-avatar>
                    <p class="mr-2 font-14 lh-16">{{ event.communityDetail?.communityName }}</p>
                    <img
                      v-if="event.communityDetail?.hasDomainVerified"
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
