<!-- EventDescriptionDialog.vue -->
<template>
  <v-dialog class="fyre--modal" persistent>
    <v-card class="modal__card">
      <v-icon class="modal__close cursor-pointer" @click="$emit('close')">mdi-close</v-icon>
      <div class="modal__header">
        <p class="modal__title">Rewards</p>
        <img class="modal__title__img ml-2" src="@/assets/images/gift.svg" height="24" />
      </div>
      <div class="modal__body">
        <v-carousel show-arrows="hover" hide-delimiter-background>

          <v-carousel-item v-for="(item, index) in eventData.rewards">

            <div class=" pa-6 mt-5 border__dotted dynamic_background"
              :style="{ 'background-image': 'url(' + getRewardTypeUrl(item.rewardType) + ')' }">
              <div class=" d-flex align-center justify-space-between mb-3">
                <p class="text-grey font-20 font-weight-bold">
                  {{ item.title }}
                </p>
              </div>

              <div class="d-flex align-center justify-space-between">
                <p class="">
                  <span class="text-gradient-blue font-22 font-weight-bold">{{ item.rewardPerPerson }}</span>&nbsp;
                  <span class="text-white font-20 font-weight-bold">{{
                    item.denomination
                    }}</span><span class="font-15 font-weight-bold">/Winner</span>
                </p>

              </div>

              <div class="d-flex align-center justify-space-between mb-4">
                <p>
                  <span class="text-green font-20 font-weight-bold">{{ item.winnerCount }}</span> <span
                    class="text-white font-15 font-weight-bold">winner(s)</span>
                </p>
              </div>

              <div class="d-flex align-center justify-space-between mb-5">
                <div class="row">
                  <div class="col mb-1">
                    <v-chip class=" mb-1" v-if="item.network">
                      <img :src="getImage(item.network)" style="height: 20px;" /> <span class="ms-1">{{
                        resolveConnectWalletTaskType(item.network)?.network }}</span>
                    </v-chip>
                    <v-chip class="mb-1 ms-1">
                      <span class="ml-2">
                        <v-icon icon="mdi-adjust" class="text-green"></v-icon>
                        <span class="ms-1">Announcement on</span>
                        <span class="text-blue ms-1">{{
                          (new Date(eventData.endDate)).toDateString() }}
                        </span>
                      </span>
                    </v-chip>
                  </div>
                </div>
              </div>


            </div>
            <v-btn height="53" block class="claim--button mt-3">
              <img src="@/assets/images/gift_open.svg" />
              <span class="ml-2"> Claim Rewards</span>
            </v-btn>
          </v-carousel-item>

        </v-carousel>
      </div>
    </v-card>
  </v-dialog>
</template>
<style scoped>
.dynamic_background {
  background-position: right;
  background-repeat:
    no-repeat;
  background-size: 182px 220px;
  background-color: rgb(23 31 50 / 72%);
}
</style>
<script lang="ts" setup>
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { getImage, resolveConnectWalletTaskType } from '@/composables/event.ts'
const props = defineProps({
  eventData: {
    type: Object,
    required: true,
    default() {
      return {}
    }
  }
})

const getRewardTypeUrl = (rewardType: string) => {
  if (rewardType === 'NFT') {
    return "https://fyre.id/assets/nft-kozf1p3h.svg"
  } else if (rewardType === 'TOKEN') {
    return "https://fyre.id/assets/money-Cc8nUKC2.svg"
  }

  return "https://fyre.id/assets/nft-kozf1p3h.svg"
}

const dialog = ref(true)
</script>
