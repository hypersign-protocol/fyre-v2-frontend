<template>
  <v-container fluid>
    <v-container fluid>
      <div class="banner__container">
        <div class="text__wrapper">
          <h1 class="banner__title">Quest Hub <br />for the Interchain</h1>
          <p class="banner__subtitle">Build Legendary Communities</p>
          <div class="responsive-container button-container">
            <v-btn color="white" height="53" class="rounded-lg mr-3 cursor-pointer" @click="router.push({ path: `/explore` })">
              50+ Trusted Communties
            </v-btn>
            <v-btn variant="outlined" height="53" class="rounded-lg cursor-pointer" disabled>
              Create Your Community
            </v-btn>
          </div>
        </div>
        <div class="banner__image__right">
          <img src="@/assets/images/start.gif" alt="Image 2" />
        </div>
      </div>
    </v-container>
  </v-container>
</template>
<script lang="ts" setup>
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()
const router = useRouter()
</script>
