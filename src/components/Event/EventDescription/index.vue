<!-- EventDescriptionDialog.vue -->

<template>
  <v-dialog class="fyre--modal" persistent>
    <v-card class="modal__card">
      <v-icon class="modal__close cursor-pointer" @click="$emit('close')">mdi-close</v-icon>
      <div class="modal__header">
        <p class="modal__title">Event Description</p>
        <img class="modal__title__img" src="@/assets/images/modal_event_desc.svg" />
      </div>
      <div class="modal__body">
        <p class="modal__content border__dotted">
          {{ eventData.description }}
        </p>
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'

const props = defineProps({
  eventData: {
    type: Object,
    required: false,
    default() {
      return {}
    }
  }
})

const dialog = ref(true)
</script>
