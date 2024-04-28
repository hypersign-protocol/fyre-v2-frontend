<template>
  <div class="tab__card">
    <v-tabs
      selected-class="tab--active"
      slider-color="secondary"
      v-model="activeTab"
      align-tabs="left"
      color="white"
      class="event__tabs"
    >
      <v-tab :value="item.slug" v-for="(item, index) in tabs" :key="index">
        {{ item.title }}
      </v-tab>
    </v-tabs>
    <v-window v-model="activeTab">
      <v-window-item :eager="true" :eventId="eventId" value="TOKEN">
        <TokenType />
      </v-window-item>
      <v-window-item :eager="true" :eventId="eventId" value="XP">
        <XpType />
      </v-window-item>
      <v-window-item :eager="true" :eventId="eventId" value="NFT">
        <NftType />
      </v-window-item>
      <v-window-item :eager="true" :eventId="eventId" value="OTHER">
        <OtherType />
      </v-window-item>
    </v-window>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const activeTab = ref('tokens')
const props = defineProps({
  eventId: { type: String, required: false, default: '' }
})
const tabs = ref([
  {
    title: 'Tokens',
    slug: 'TOKEN'
  },
  {
    title: 'XP',
    slug: 'XP'
  }
])
</script>
