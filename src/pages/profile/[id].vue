<template>
  <Loader v-if="loading" />
  <template v-if="!loading">
    <v-container fluid class="background-left pt-8">
      <div class="homepage-section">
        <div class="section-content">
          <v-container class="padding-global-y">
            <v-row>
              <v-col cols="12" sm="6" md="6" lg="3" xl="3">
                <div class="edit__profile__menu">
                  <ul>
                    <li class="cursor-pointer" @click="router.push({ path: `/profile` })">
                      <img src="@/assets/images/arrow-left.svg" />
                      <span>Edit Profile</span>
                    </li>
                    <li
                      v-for="(item, index) in menu"
                      :class="activeTab === item.slug ? 'active' : ''"
                      @click="navigateScreens(item, index)"
                      class="cursor-pointer"
                    >
                      <span>{{ item.title }}</span>
                    </li>
                  </ul>
                </div>
              </v-col>
              <v-col cols="12" sm="6" md="6" lg="9" xl="9">
                <component v-if="defaultComp.active" :is="defaultComp.active" />
              </v-col>
            </v-row>
          </v-container>
        </div>
      </div>
    </v-container>
  </template>
</template>
<script lang="ts" setup>
import {
  defineComponent,
  ref,
  shallowRef,
  onMounted,
  onBeforeUnmount,
  computed,
  watch,
  defineAsyncComponent
} from 'vue'

const loading = ref(false)
const activeTab = ref('profile-setting')
const defaultComp = shallowRef({
  active: defineAsyncComponent(() => import('@/components/User/ProfileSetting.vue'))
})

const menu = shallowRef([
  {
    title: 'Profile Setting',
    slug: 'profile-setting',
    path: defineAsyncComponent(() => import('@/components/User/ProfileSetting.vue'))
  },
  {
    title: 'Wallet Address',
    slug: 'wallet-address',
    path: defineAsyncComponent(() => import('@/components/User/WalletAddress.vue'))
  },
  {
    title: 'Social Accounts',
    slug: 'social-accounts',
    path: defineAsyncComponent(() => import('@/components/User/SocialAccount.vue'))
  }
])

const navigateScreens = (item, index) => {
  activeTab.value = item.slug
  defaultComp.value.active = item.path
  triggerRef(defaultComp)
}
</script>
