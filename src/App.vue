<template>
  <v-app>
    <router-view />
    <Notification />
  </v-app>
</template>

<script lang="ts" setup>
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
</script>
<style lang="scss" scoped></style>
