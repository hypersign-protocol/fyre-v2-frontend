<template>
  <div class="tab__card">
    <v-tabs
      selected-class="tab--active"
      slider-color="secondary"
      v-model="activeTab"
      align-tabs="left"
      color="white"
      class="event__tabs"
    >
      <v-tab :value="item.slug" v-for="(item, index) in tabs" :key="index">
        {{ item.title }}
      </v-tab>
    </v-tabs>
    <v-window v-model="activeTab">
      <v-window-item :eventId="eventId" value="TOKEN">
        <Loader v-if="loading" />
        <TokenType v-if="!loading" :userRewards="userRewards" />
      </v-window-item>
      <v-window-item :eventId="eventId" value="XP">
        <Loader v-if="loading" />
        <XpType v-if="!loading" :userRewards="userRewards" />
      </v-window-item>
    </v-window>
  </div>
</template>
<script lang="ts" setup>
import {
  defineComponent,
  ref,
  shallowRef,
  onMounted,
  onBeforeUnmount,
  computed,
  watch,
  defineAsyncComponent
} from 'vue'

import { useUserStore } from '@/store/user.ts'
import { getToken } from '@/composables/jwtService.ts'
import { storeToRefs } from 'pinia'

const activeTab = ref('tokens')
const props = defineProps({
  eventId: { type: String, required: false, default: '' }
})
const tabs = ref([
  {
    title: 'Tokens',
    slug: 'TOKEN'
  },
  {
    title: 'XP',
    slug: 'XP'
  }
])

const options = reactive({
  page: 1,
  limit: 10,
  search: '',
  filter: 'TOKEN'
})

const store = useUserStore()
const { userRewards } = storeToRefs(useUserStore())

const loading = ref(false)

watch(
  () => activeTab.value,
  (value: any) => {
    options.filter = value
    loadRewards()
  }
)

const token = computed(() => {
  return getToken()
})

watch(
  () => store.userRewards,
  (value: any) => {
    setTimeout(() => {
      loading.value = false
    }, 400)
  },
  { deep: true }
)

const loadRewards = async () => {
  if (token.value) {
    loading.value = true
    let params = `?rewardType=${options.filter}&page=${options.page}&limit=${options.limit}`
    if (props.eventId) {
      params += `&eventId=${props.eventId}`
    }
    await store.USER_REWARD(params)
  }
}
</script>
