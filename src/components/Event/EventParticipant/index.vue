<!-- EventDescriptionDialog.vue -->

<template>
  <v-dialog max-width="680" persistent>
    <v-card class="modal__card">
      <v-icon class="modal__close cursor-pointer" @click="$emit('close')">mdi-close</v-icon>
      <div class="modal__header">
        <p class="modal__title">Participants(1900)</p>
      </div>
      <div class="modal__body">
        <div
          class="d-flex align-center justify-space-between my-4"
          v-for="(item, index) in 10"
          :key="index"
        >
          <div class="d-flex align-center">
            <v-avatar size="large">
              <v-img src="@/assets/images/avatar01.png"> </v-img>
            </v-avatar>
            <p class="ml-2 font-22 font-weight-bold">Kelvin</p>
          </div>
          <div class="d-flex align-start">
            <v-avatar size="large">
              <v-img src="@/assets/images/avatar01.png"> </v-img>
            </v-avatar>
            <p class="ml-2 font-22 font-weight-bold">Kelvin</p>
          </div>
        </div>
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
