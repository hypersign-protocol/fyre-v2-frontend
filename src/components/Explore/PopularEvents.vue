<template>
  <Loader v-if="loading" />
  <el-carousel
    v-if="!loading"
    class="event__slider"
    :interval="5000"
    arrow="never"
    indicator-position="outside"
    autoplay="true"
  >
    <el-carousel-item
      class="home-slider-item--wrap cursor-pointer"
      v-for="(popular, i) in paginatedPopular"
      :key="i"
    >
      <v-row>
        <v-col v-for="(event, index) in popular" :key="index" cols="12" sm="3" md="3" xl="3" lg="3">
          <ExploreCard :eventData="event" />
        </v-col>
      </v-row>
    </el-carousel-item>
  </el-carousel>
</template>
<script lang="ts" setup>
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'

import { useEventStore } from '@/store/event.ts'

import { storeToRefs } from 'pinia'
const eventStore = useEventStore()
const router = useRouter()
import paginate from '@/utils/paginate'

const loading = ref(false)

const popularRaw = computed(() => eventStore.getPopularEvents)
let paginatedPopular = paginate(popularRaw.value, 4)

watch(
  () => popularRaw.value,
  (value: any) => {
    setTimeout(() => {
      loading.value = false
      paginatedPopular = paginate(popularRaw.value, 4)
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
