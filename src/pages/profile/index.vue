<template>
  <v-container fluid class="background-left pt-8">
    <div class="homepage-section">
      <div class="section-content">
        <div class="user__profile">
          <Profile />
          <ProfileTab />
        </div>
      </div>
    </div>
  </v-container>
</template>
<script lang="ts" setup>
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
</script>
