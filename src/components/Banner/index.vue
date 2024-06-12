<template>
  <v-container fluid>
    <v-container fluid>
      <div class="banner__container">
        <div class="text__wrapper">
          <h1 class="banner__title">Quest Hub <br />for the Interchain</h1>
          <p class="banner__subtitle">Build Legendary Communities</p>
          <div class="responsive-container button-container">
            <v-btn color="white" height="53" class="rounded-lg mr-3 cursor-pointer"
              @click="navigate({ link: `/explore` })">
              50+ Trusted Communties
            </v-btn>
            <v-btn variant="outlined" height="53" class="rounded-lg cursor-pointer"
              @click="navigate({ link: 'https://t.me/fyredrops' })">
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
import { ref, watch } from 'vue'
import { useHead } from '@vueuse/head'
import { useRoute } from 'vue-router'

const route = useRoute()

const title = ref('Dynamic Page Title')
const description = ref('This is a dynamically generated description for the page.')
const imageUrl = ref('https://example.com/image.jpg')
const type = ref('website')
const url = ref(window.location.href)
watch(
  route,
  () => {
    title.value = `Fyre`
    description.value = `Quest Hub For The Interchain`
    imageUrl.value = `https://i.ibb.co/Sty0F7b/Screenshot-2024-06-09-at-10-04-53-AM.png`

    useHead({
      title: title.value,
      meta: [
        {
          property: 'og:title',
          content: title.value
        },
        {
          property: 'og:description',
          content: description.value
        },
        {
          property: 'og:image',
          content: imageUrl.value
        },
        {
          property: 'og:url',
          content: url.value
        }
      ]
    })
  },
  { immediate: true }
)

const navigate = (item: any) => {
  window.open(item.link, '_blank');
}
</script>
