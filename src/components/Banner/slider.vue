<template>
  <div class="homepage-section">
    <div class="section-content">
      <Loader v-if="loading" />
      <el-carousel
        v-if="!loading"
        class="home-slider"
        :interval="5000"
        arrow="always"
        indicator-position="outside"
      >
        <el-carousel-item
          class="home-slider-item--wrap cursor-pointer"
          v-for="(event, index) in popular.slice(0, 3)"
          :key="index"
          @click="viewEvent(event)"
        >
          <div class="home-slider-item--wrap--row">
            <div class="home-slider-item--wrap--row--image">
              <div class="image">
                <img :src="event.banner" />
              </div>
            </div>
            <div class="home-slider-item--wrap--row--content">
              <div class="slider__content">
                <div class="d-flex align-center mb-5">
                  <v-avatar size="x-large" class="cursor-pointer avatar">
                    <v-img alt="John" :src="event.communityDetail?.avatar"></v-img>
                  </v-avatar>
                  <p class="community-name">{{ event.communityDetail?.communityName }}</p>
                  <v-avatar size="x-small" v-if="event.communityDetail?.hasDomainVerified">
                    <v-img src="@/assets/images/verify.svg" height="30"></v-img>
                  </v-avatar>
                </div>
                <h1 class="event-name">{{ event.eventName }}</h1>
                <div class="d-flex align-center">
                  <v-avatar size="x-small" class="mr-2">
                    <v-img src="@/assets/images/gift.svg" height="30"></v-img>
                  </v-avatar>
                  
                  <p class="purple-linear-gradient-text text-one" v-if="event.rewards.length>0">{{ numberToWords( getRewards(event).token?.at(0)?.at(1)) }} {{ getRewards(event).token?.at(0)?.at(0) }}</p>
                  <p class="text-one text-blue-100">{{ event.totalEventXp }} XP</p>
                </div>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useEventStore } from '@/store/event'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getRewards } from '@/utils/calculateRewards'
import {numberToWords} from '@/utils/numberToWords'
import { storeToRefs } from 'pinia'
const eventStore = useEventStore()
const router = useRouter()
const loading = ref(false)

const popular = computed(() => eventStore.getPopularEvents)

watch(
  () => popular.value,
  (value: any) => {
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
  await eventStore.POPULAR_EVENTS(`?page=1&limit=10&filter=popular`)
})
</script>
<style scoped></style>
