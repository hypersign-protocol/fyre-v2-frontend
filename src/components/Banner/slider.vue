<template>
  <v-container fluid class="background-left">
    <v-container class="container-large">
      <Loader v-if="loading" />
      <v-card color="transparent" flat height="400" v-if="!loading">
        <v-carousel hide-delimiters cycle continuous class="w-100" height="400">
          <v-hover v-slot="{ isHovering, props }">
            <v-carousel-item
              color="black"
              height="400"
              class="rounded-xl"
              v-for="(event, index) in popular"
              :key="index"
              v-bind="props"
            >
              <v-row class="pa-8">
                <v-col cols="12" lg="6" md="6" sm="6">
                  <img :src="event.banner" class="w-100 h-100 rounded-xl" />
                </v-col>
                <v-col cols="12" lg="6" md="6" sm="6" class="slider__content__wrapper">
                  <div class="slider__content">
                    <div class="d-flex align-center mb-5">
                      <v-avatar size="x-large" class="cursor-pointer mr-2">
                        <v-img alt="John" :src="event.communityDetail.avatar"></v-img>
                      </v-avatar>
                      <p class="mr-2 font-22 lh-32">{{ event.communityDetail.communityName }}</p>
                      <v-avatar size="x-small" v-if="event.communityDetail.hasDomainVerified">
                        <v-img src="@/assets/images/verify.svg" height="30"></v-img>
                      </v-avatar>
                    </div>
                    <h1 class="font-30 lh-42 mb-5">{{ event.eventName }}</h1>
                    <div class="d-flex align-center">
                      <v-avatar size="x-small">
                        <v-img src="@/assets/images/gift.svg" height="30"></v-img>
                      </v-avatar>
                      <p class="font-25 lh-26 mx-5 purple-linear-gradient-text font-weight-medium">
                        3040 BXX
                      </p>
                      <p class="font-25 lh-26 font-weight-medium text-blue-100">10XP</p>
                    </div>
                  </div>
                </v-col>
              </v-row>
              <v-overlay
                :model-value="isHovering"
                class="align-center justify-center"
                scrim="#000"
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
            </v-carousel-item>
          </v-hover>
        </v-carousel>
      </v-card>
    </v-container>
  </v-container>
</template>
<script setup lang="ts">
import { useEventStore } from '@/store/event.ts'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { storeToRefs } from 'pinia'
const eventStore = useEventStore()
const router = useRouter()
const loading = ref(false)

const popular = computed(() => eventStore.getPopularEvents)

watch(
  () => popular.value,
  (value: any)  => {
    setTimeout(() => {
      loading.value = false
    }, 1000)
  }
)

const viewEvent = (event) => {
  router.push({ path: `/event/${event._id}` })
}

onMounted(async () => {
  loading.value = true
  await eventStore.POPULAR_EVENTS(`?page=1&limit=10`)
})
</script>
