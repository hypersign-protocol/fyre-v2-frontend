<template>
  <v-dialog class="fyre--modal" persistent>
    <v-card class="modal__card">
      <div class="d-flex align-center justify-center flex-column delete__modal">
        <p class="modal__content">Are you sure you want to delete the account?</p>
        <div class="button__wrapper">
          <v-btn variant="outlined" color="secondary" @click="$emit('close')">No</v-btn>
          <v-btn color="secondary" variant="flat">Yes</v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>
<script lang="ts" setup>
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
</script>
<style lang="scss" scoped></style>
