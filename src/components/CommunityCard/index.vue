<template>
  <v-card class="community-card rounded-xl cursor-pointer text-center" @click="viewCommunity">
    <v-avatar size="74" class="my-4">
      <v-img :src="communityData.avatar"></v-img>
    </v-avatar>
    <v-card-title class="px-0 font-20 text-white-100 font-weight-bold">{{
      communityData.communityName
    }}</v-card-title>
    <div class="d-flex align-center justify-center py-4">
      <img class="mr-4" size="16" src="@/assets/images/telegram_out.svg" />
      <img class="mr-4" size="16" src="@/assets/images/twitter_out.svg" />
      <img class="mr-4" size="16" src="@/assets/images/discord_out.svg" />
    </div>
    <v-divider></v-divider>
    <v-card-actions>
      <div class="d-flex align-center justify-space-between w-100 px-8">
        <div class="d-flex flex-column">
          <p class="font-12 font-weight-regular">Followers</p>
          <p class="font-14 font-weight-bold mt-2">{{ communityData.followerCount }}</p>
        </div>
        <div class="d-flex flex-column">
          <p class="font-12 font-weight-regular">Participants</p>
          <p class="font-14 font-weight-bold mt-2">
            {{ communityData.participantCount }}
          </p>
        </div>
      </div>
    </v-card-actions>
  </v-card>
</template>
<script lang="ts" setup>
const { communityData } = defineProps(['communityData'])

const viewCommunity = (event) => {
  window.location.href = `/community/${communityData._id}`
}
</script>
