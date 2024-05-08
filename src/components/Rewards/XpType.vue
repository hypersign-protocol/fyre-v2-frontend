<template>
  <template v-if="userRewards.length > 0">
    <div class="user__profile">
      <v-card class="bg__card pa-10 mt-8">
        <v-row class="token__row d-flex" v-for="(item, index) in userRewards">
          <v-col>
            <p class="d-flex align-center">
              <img src="@/assets/images/trophy.svg" class="mr-2" />
              {{ item.reward.distributionMediumType }}
            </p>
          </v-col>
          <v-col>
            <p>{{ item.reward.denomination }}</p>
          </v-col>
          <v-col>
            <p>{{ calculateDaysUntilExpiry(item?.reward?.options?.expiresAt) }}</p>
          </v-col>
          <v-col>
            <p class="text-green-accent-3" v-if="item.hasClaimed">Claimed</p>
            <v-btn class="bg-blue-accent-3 font-12" v-if="!item.hasClaimed"> Claim Now </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </div>
  </template>
  <template v-else>
    <v-card height="200" class="event-task--card mt-5 d-flex align-center justify-center">
      <h3>No data found!</h3>
    </v-card>
  </template>
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
const store = useUserStore()
const { userRewards } = storeToRefs(useUserStore())

const loading = ref(false)
const props = defineProps({
  eventId: { type: String, required: false, default: '' }
})

const token = computed(() => {
  return getToken()
})

watch(
  () => store.userRewards,
  (value: any) => {
    loading.value = false
  },
  { deep: true }
)

const calculateDaysUntilExpiry = (expiryDate) => {
  const now = new Date()
  const expiresAt = new Date(expiryDate)
  const diffInMilliseconds = expiresAt - now
  let remainingDaysCount = ''
  if (diffInMilliseconds < 0) {
    remainingDaysCount = 'Expired'
  } else {
    remainingDaysCount = `Expiring in ${Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24))} days`
  }

  return remainingDaysCount
}

onMounted(async () => {
  if (token.value) {
    loading.value = true
    if (props.eventId) {
      await store.USER_REWARD(`?rewardType=XP&eventId=${props.eventId}&page=1&limit=10`)
    } else {
      await store.USER_REWARD(`?rewardType=XP&page=1&limit=10`)
    }
  }
})
</script>
