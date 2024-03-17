<!-- EventDescriptionDialog.vue -->

<template>
  <v-dialog max-width="680" persistent>
    <v-card class="modal__card">
      <v-icon class="modal__close cursor-pointer" @click="$emit('close')">mdi-close</v-icon>
      <div class="modal__header">
        <p class="modal__title">Rewards</p>
        <img class="modal__title__img ml-2" src="@/assets/images/gift.svg" height="24" />
      </div>
      <div class="modal__body">
        <div class="d-flex border__dotted pa-6 align-center justify-space-between">
          <p class="font-16 font-weight-medium">Your Total Points</p>
          <p class="font-22 font-weight-bold">15XP</p>
        </div>
        <div class="border__dotted pa-6 mt-5">
          <div class="d-flex align-center justify-space-between mb-3">
            <p class="font-16 font-weight-medium">Reward</p>
            <p class="text-gradient-purple font-22 font-weight-bold">200 USTD</p>
          </div>
          <div class="d-flex align-center justify-space-between mb-3">
            <p class="font-16 font-weight-medium">Reward Per Winner</p>
            <p class="text-gradient-blue font-22 font-weight-bold">50 USTD</p>
          </div>
          <div class="d-flex align-center justify-space-between">
            <p class="font-16 font-weight-medium">Winner Count</p>
            <p class="text-gradient-green font-22 font-weight-bold">10</p>
          </div>
        </div>
        <div class="pa-6 mt-5">
          <div class="d-flex align-center justify-space-between mb-3">
            <p class="font-16 font-weight-medium">Winner Selection Method</p>
            <p class="text-gray-100 font-14 font-weight-medium">Mannual</p>
          </div>
          <div class="d-flex align-center justify-space-between mb-3">
            <p class="font-16 font-weight-medium">Winner Announcement</p>
            <p class="text-gray-100 font-14 font-weight-medium">After Uploading the list</p>
          </div>
          <div class="d-flex align-center justify-space-between">
            <p class="font-16 font-weight-medium">Reward Distributed On</p>
            <p class="text-gray-100 font-14 font-weight-medium">Ethereum</p>
          </div>
        </div>
        <v-btn height="53" block class="claim--button">
          <img src="@/assets/images/gift_open.svg" />
          <span class="ml-2"> Claim Rewards</span>
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
const props = defineProps<{
  description: string
}>()

const dialog = ref(true)
</script>
