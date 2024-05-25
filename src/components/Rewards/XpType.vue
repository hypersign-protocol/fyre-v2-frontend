<template>
  <template v-if="userRewards.length > 0">
    <div class="user__profile">
      <v-card class="bg__card pa-10 mt-8">
        <v-row class="token__row d-flex" v-for="(item, index) in userRewards">
          <v-col md="6">
            <p class="d-flex align-center">
              <img src="@/assets/images/trophy.svg" class="mr-2" />
              {{ item.reward.distributionMediumType }}
            </p>
          </v-col>
          <v-col md="2">
            <p>{{ item.reward.amount }} {{ item.reward.denomination }}</p>
          </v-col>
          <v-col md="2" v-if="item?.reward?.options?.expiresAt">
            <p>
              {{ item?.reward?.options?.expiresAt
              }}{{ calculateDaysUntilExpiry(item?.reward?.options?.expiresAt) }}
            </p>
          </v-col>
          <v-col md="2">
            {{ (new Date(item.createdAt)).toLocaleDateString() }}
          </v-col>
          <v-col md="2">
            <p class="text-green-accent-3" v-if="item.hasClaimed">Claimed</p>
            <v-btn class="bg-blue-accent-3 font-12" v-if="!item.hasClaimed"> Claim Now </v-btn>
          </v-col>

        </v-row>
      </v-card>
    </div>
  </template>
  <template v-else>
    <v-card height="200" class="event-task--card mt-5 d-flex align-center justify-center">
      <h3>No results found!</h3>
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

import { calculateDaysUntilExpiry } from '@/composables/general.ts'



const props = defineProps({
  userRewards: {
    type: Array,
    required: true,
    default() {
      return []
    }
  }
})
</script>
