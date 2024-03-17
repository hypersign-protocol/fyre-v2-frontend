<!-- EventDescriptionDialog.vue -->

<template>
  <v-dialog max-width="680" persistent>
    <v-card class="modal__card">
      <v-icon class="modal__close cursor-pointer" @click="$emit('close')">mdi-close</v-icon>
      <div class="modal__header">
        <p class="modal__title">Refer</p>
        <img class="modal__title__img ml-2" src="@/assets/images/modal_refer.svg" height="24" />
      </div>
      <div class="modal__body">
        <div class="border__dotted pa-6 d-flex flex-column align-center">
          <div class="d-flex align-center mb-2">
            <p class="mr-2">0/10</p>
            <img src="@/assets/images/user.svg" />
          </div>
          <p class="font-16 font-weight-bold mb-2">Refer and gain +15XP points</p>
          <p class="font-16 font-weight-medium">
            You can gain more points by referring your friends
          </p>
        </div>
        <div class="border__dotted pa-6 d-flex flex-column align-center mt-4">
          <p class="font-16 font-weight-medium mb-2">Your Referral Code</p>
          <v-btn variant="outlined" class="rounded-lg">
            <span class="mr-2">fyre.id/jlttoken-veevaa-231dcw1d</span>
            <v-icon>mdi-link-variant</v-icon>
          </v-btn>
        </div>
        <v-btn height="53" block color="secondary" class="claim--button mt-4">
          <v-icon size="30">mdi-share-outline</v-icon>
          <span class="ml-2"> Share now</span>
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
