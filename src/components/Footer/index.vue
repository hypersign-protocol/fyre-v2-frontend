<template>
  <v-footer class="bg-black-100 background-left footer_wrapper d-flex flex-column">
    <v-row>
      <v-col cols="12" md="4" sm="12" xl="4" lg="4">
        <div class="d-flex flex-column">
          <div class="d-flex">
            <img src="@/assets/images/logo.svg" height="68" />
          </div>
          <p class="py-8">
            Hundreds of companies trust Fyre to grow and engage their community through Contests,
            Giveaways, Email Forms, Sweepstakes, Campaigns & Collecting User Generated Content.
          </p>
          <div class="d-flex py-8">
            <v-btn v-for="icon in icons" :key="icon" :icon="icon" class="mx-4" size="small" variant="plain"></v-btn>
          </div>
        </div>
      </v-col>
      <v-spacer class="spacer"></v-spacer>
      <v-col cols="12" md="6" sm="12" xl="6" lg="6">
        <v-row>
          <v-col cols="6" md="6" sm="3" xl="3" lg="3">
            <h5>My Account</h5>
            <v-list bg-color="transparent" density="compact" class="cursor-pointer">
              <v-list-item class="pl-0">
                <v-list-item-title class="mb-2 font-14" variant="plain" @click="navigate(items.Profile)">Profile
                </v-list-item-title>
              </v-list-item>
              <v-list-item class="pl-0">
                <v-list-item-title class="mb-2 font-14" variant="plain"
                  @click="navigate(items.Explore)">Events</v-list-item-title>
              </v-list-item>
              <v-list-item class="pl-0">
                <v-list-item-title class="mb-2 font-14" variant="plain"
                  @click="navigate(items.Support)">Subscriptions</v-list-item-title>
              </v-list-item>
              <v-list-item class="pl-0">
                <v-list-item-title class="mb-2 font-14" variant="plain"
                  @click="navigate(items.Home)">Settings</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="6" md="6" sm="3" xl="3" lg="3">
            <h5>Marketplace</h5>
            <v-list bg-color="transparent" density="compact" class="cursor-pointer">
              <v-list-item class="pl-0">
                <v-list-item-title class="mb-2 font-14" variant="plain"
                  @click="navigate(items.Explore)">Explore</v-list-item-title>
              </v-list-item>
              <v-list-item class="pl-0">
                <v-list-item-title class="mb-2 font-14" variant="plain"
                  @click="navigate(items.Explore)">Communities</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="6" md="6" sm="3" xl="3" lg="3">
            <h5>Resources</h5>
            <v-list bg-color="transparent" density="compact" class="cursor-pointer">
              <v-list-item class="pl-0">
                <v-list-item-title class="mb-2 font-14" variant="plain" @click="navigate(items.Support)">Help
                  Center</v-list-item-title>
              </v-list-item>
              <v-list-item class="pl-0">
                <v-list-item-title class="mb-2 font-14" variant="plain"
                  @click="navigate(items.AboutUs)">Partners</v-list-item-title>
              </v-list-item>
              <v-list-item class="pl-0">
                <v-list-item-title class="mb-2 font-14" variant="plain"
                  @click="navigate(items.AboutUs)">Blog</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="6" md="6" sm="3" xl="3" lg="3">
            <h5>Company</h5>
            <v-list bg-color="transparent" density="compact" class="cursor-pointer">
              <v-list-item class="pl-0">
                <v-list-item-title class="mb-2 font-14" variant="plain" @click="navigate(items.AboutUs)">About
                  Us</v-list-item-title>
              </v-list-item>
              <v-list-item class="pl-0">
                <v-list-item-title class="mb-2 font-14" variant="plain"
                  @click="navigate(items.Support)">Support</v-list-item-title>
              </v-list-item>
              <v-list-item class="pl-0">
                <v-list-item-title class="mb-2 font-14" variant="plain"
                  @click="navigate(items.Explore)">Rankings</v-list-item-title>
              </v-list-item>
              <v-list-item class="pl-0">
                <v-list-item-title class="mb-2 font-14" variant="plain" @click="navigate(items.Privacy)">Privacy &
                  Policy</v-list-item-title>
              </v-list-item>
              <v-list-item class="pl-0">
                <v-list-item-title class="mb-2 font-14" variant="plain" @click="navigate(items.Explore)">Terms &
                  Conditions</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="12" sm="12" xl="12" lg="12">
        <div class="d-flex align-center justify-start">
          <p class="text-left">
            {{ new Date().getFullYear() }} © Copyright hypersign. All Rights Reserved
          </p>
        </div>
      </v-col>
    </v-row>
  </v-footer>
</template>
<script lang="ts" setup>
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
const icons = ref(['mdi-facebook', 'mdi-twitter', 'mdi-linkedin', 'mdi-instagram'])

const items = ref({
  'Profile': { link: '/profile' },
  'Explore': { link: '/explore' },
  'Privacy': { link: 'https://docs.hypersign.id/privacy-policy' },
  'Support': { link: 'https://t.me/fyredrops' },
  'AboutUs': { link: 'https://twitter.com/fyredrops' },
  'Home': { link: '/' }
})

const navigate = (item: any) => {
  window.open(item.link, '_blank');
}
</script>
