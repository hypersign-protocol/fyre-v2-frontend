<template>
  <v-card class="pa-5 rounded-lg d-flex flex-column align-center" color="transparent" flat>
    <div class="spinner-box mb-3">
      <div class="pulse-container">
        <div class="pulse-bubble pulse-bubble-1"></div>
        <div class="pulse-bubble pulse-bubble-2"></div>
        <div class="pulse-bubble pulse-bubble-3"></div>
      </div>
    </div>
    <p class="pt-4 font-15 lh-26 mx-5 purple-linear-gradient-text font-weight-medium text-center">
      {{ text }}
    </p>
  </v-card>
</template>
<script setup lang="ts">
  import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
const props = defineProps({
  text: {
    type: String,
    default: 'Please wait, while fetching the data...'
  }
})
</script>
