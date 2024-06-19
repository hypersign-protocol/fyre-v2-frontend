<template>
  <Loader v-if="loading" />
  <v-card color="transparent" class="bg__card" v-if="!loading">
    <v-card-text class="profile__container">
      <div class="profile__section">
        <div class="profile__img">
          <v-avatar>
            <v-img v-if="userMeta.avatar" :src="userMeta.avatar"></v-img>
            <v-img v-else src="@/assets/images/user-profile.png"></v-img>
          </v-avatar>
          <!-- <p class="profile__badge">
            <span>#232</span>
          </p> -->
        </div>
        <div class="profile__content">
          <h1 class="profile__name" v-if="userMeta.userName">
            {{ userMeta.userName }}
            <img src="@/assets/images/check-amber.svg" />
          </h1>
          <div class="profile__meta">
            <label>Controller:</label>
            <p>{{ getAddress(userMeta.didDocument) }}</p>
          </div>
          <!-- <div class="profile__meta">
            <div class="profile__meta__item">
              <label>Invites:</label>
              <p>3</p>
            </div>
            <div class="profile__meta__item">
              <label>Rewards:</label>
              <p>3</p>
            </div>
          </div> -->
        </div>
      </div>
      <div class="profile__social__meta">
        <a href="">
          <svg
            width="20"
            height="15"
            viewBox="0 0 20 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 5.62V11.25C0 12.2446 0.395088 13.1984 1.09835 13.9017C1.80161 14.6049 2.75544 15 3.75 15H16.25C17.2446 15 18.1984 14.6049 18.9017 13.9017C19.6049 13.1984 20 12.2446 20 11.25V5.62L10.5125 9.89C10.3514 9.96244 10.1767 9.99989 10 9.99989C9.82332 9.99989 9.64865 9.96244 9.4875 9.89L0 5.62ZM0.0924999 2.92L10 7.38L19.9075 2.92C19.7193 2.09069 19.2548 1.34998 18.5902 0.819398C17.9256 0.28882 17.1004 -0.00011487 16.25 3.42586e-08H3.75C2.8996 -0.00011487 2.07441 0.28882 1.40982 0.819398C0.745234 1.34998 0.280723 2.09069 0.0924999 2.92Z"
              fill="white"
              fill-opacity="0.2"
            />
          </svg>
        </a>
        <a href="">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_8102_12971)">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M15.002 4C15.746 4 16.532 4.26 17.252 4.547L17.779 4.763C19.039 5.291 19.747 6.399 20.296 7.616C21.187 9.591 21.806 12.224 22.02 14.226C22.122 15.176 22.147 16.132 21.964 16.775C21.767 17.462 21.097 17.948 20.446 18.33L20.124 18.513L19.79 18.699C19.618 18.795 19.441 18.89 19.265 18.983L18.743 19.253L18.026 19.61L17.449 19.894C17.3312 19.9576 17.2017 19.9968 17.0684 20.0094C16.9351 20.022 16.8006 20.0077 16.6729 19.9673C16.5452 19.9269 16.4269 19.8613 16.3251 19.7743C16.2232 19.6874 16.1399 19.5808 16.08 19.461C16.0201 19.3413 15.9849 19.2107 15.9764 19.077C15.9679 18.9433 15.9864 18.8094 16.0307 18.683C16.075 18.5566 16.1443 18.4404 16.2343 18.3413C16.3244 18.2422 16.4335 18.1622 16.555 18.106L17.345 17.716L16.765 17.107C15.375 17.677 13.738 18 11.999 18C10.26 18 8.62304 17.678 7.23304 17.107L6.65304 17.715L7.44604 18.105C7.56357 18.1637 7.66839 18.245 7.75451 18.3442C7.84064 18.4434 7.90637 18.5586 7.94798 18.6832C7.98958 18.8078 8.00622 18.9394 7.99697 19.0705C7.98771 19.2015 7.95274 19.3295 7.89404 19.447C7.83534 19.5645 7.75406 19.6694 7.65485 19.7555C7.55564 19.8416 7.44044 19.9073 7.31582 19.9489C7.06415 20.033 6.78941 20.0136 6.55204 19.895L6.00804 19.625C5.60604 19.425 5.20304 19.227 4.80504 19.018L3.87704 18.513L3.55604 18.33C2.90504 17.948 2.23404 17.462 2.03804 16.775C1.85404 16.132 1.88004 15.177 1.98104 14.225C2.19504 12.224 2.81404 9.591 3.70504 7.616C4.25404 6.399 4.96204 5.291 6.22204 4.763C7.05804 4.413 8.07104 4 8.99904 4C9.60204 4 10.076 4.555 9.98904 5.147C10.6545 5.04854 11.3263 4.9994 11.999 5C12.69 5 13.365 5.05 14.013 5.148C13.9938 5.00599 14.0049 4.8615 14.0456 4.72411C14.0864 4.58671 14.1559 4.45954 14.2495 4.35101C14.3431 4.24248 14.4586 4.15507 14.5885 4.09456C14.7185 4.03404 14.8587 4.00181 15.002 4ZM8.74904 10.5C8.28491 10.5 7.83979 10.6844 7.5116 11.0126C7.18341 11.3408 6.99904 11.7859 6.99904 12.25C6.99904 12.7141 7.18341 13.1592 7.5116 13.4874C7.83979 13.8156 8.28491 14 8.74904 14C9.21317 14 9.65829 13.8156 9.98647 13.4874C10.3147 13.1592 10.499 12.7141 10.499 12.25C10.499 11.7859 10.3147 11.3408 9.98647 11.0126C9.65829 10.6844 9.21317 10.5 8.74904 10.5ZM15.249 10.5C14.7849 10.5 14.3398 10.6844 14.0116 11.0126C13.6834 11.3408 13.499 11.7859 13.499 12.25C13.499 12.7141 13.6834 13.1592 14.0116 13.4874C14.3398 13.8156 14.7849 14 15.249 14C15.7132 14 16.1583 13.8156 16.4865 13.4874C16.8147 13.1592 16.999 12.7141 16.999 12.25C16.999 11.7859 16.8147 11.3408 16.4865 11.0126C16.1583 10.6844 15.7132 10.5 15.249 10.5Z"
                fill="white"
                fill-opacity="0.2"
              />
            </g>
            <defs>
              <clipPath id="clip0_8102_12971">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </a>
        <a href="">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_8102_12975)">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M19.7767 4.42997C20.0238 4.32596 20.2943 4.29008 20.5599 4.32608C20.8256 4.36208 21.0768 4.46863 21.2873 4.63465C21.4979 4.80067 21.6601 5.02008 21.757 5.27005C21.854 5.52002 21.8822 5.79141 21.8387 6.05597L19.5707 19.813C19.3507 21.14 17.8947 21.901 16.6777 21.24C15.6597 20.687 14.1477 19.835 12.7877 18.946C12.1077 18.501 10.0247 17.076 10.2807 16.062C10.5007 15.195 14.0007 11.937 16.0007 9.99997C16.7857 9.23897 16.4277 8.79997 15.5007 9.49997C13.1987 11.238 9.50265 13.881 8.28065 14.625C7.20265 15.281 6.64065 15.393 5.96865 15.281C4.74265 15.077 3.60565 14.761 2.67765 14.376C1.42365 13.856 1.48465 12.132 2.67665 11.63L19.7767 4.42997Z"
                fill="white"
                fill-opacity="0.2"
              />
            </g>
            <defs>
              <clipPath id="clip0_8102_12975">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </a>
        <a :href="`https://twitter.com/${userMeta?.socials?.twitterHandle}`" target="_blank">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1 2H3.27273L16.9091 20.1818H14.6364L1 2Z" fill="white" fill-opacity="0.2" />
            <path
              d="M5.0918 2H7.36452L21.0009 20.1818H18.7282L5.0918 2Z"
              fill="white"
              fill-opacity="0.2"
            />
            <path d="M2.81836 2H7.36381V3.81818H2.81836V2Z" fill="white" fill-opacity="0.2" />
            <path
              d="M14.6367 20.1815H19.1822V18.3633H14.6367V20.1815Z"
              fill="white"
              fill-opacity="0.2"
            />
            <path
              d="M16.9096 2H20.0914L4.6369 20.1818H1.45508L16.9096 2Z"
              fill="white"
              fill-opacity="0.2"
            />
          </svg>
        </a>
        <a class="edit--icon cursor-pointer base-style" :href="`/profile/${userMeta?._id}`"
          ><img src="@/assets/images/user_edit.svg"
        /></a>
      </div>
    </v-card-text>
    <v-card-text class="profile__container">
      <v-row>
        <v-col cols="12" md="6">
          <div class="points__sec base-style">
            <div class="left">
              <p>Total Experience Points Collected</p>
              <p>{{ numberToWords(userMeta.totalXps) }} XP</p>
            </div>
            <div class="right">
              <v-btn class="base-btn" @click="router.push({ path: `/rewards` })"
                >Check Rewards</v-btn
              >
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="6">
          <div class="level__sec base-style">
            <p>Level {{ userMeta.levelReached }}</p>
            <v-progress-linear
              :model-value="userMeta.totalXps"
              :height="12"
              :max="userMeta.xpRequiredForNextLevel + userMeta.totalXps"
            ></v-progress-linear>
            <p>Need {{ userMeta.xpRequiredForNextLevel }} points to reach the next level</p>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script lang="ts" setup>
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useAuthStore } from '@/store/auth.ts'
import { storeToRefs } from 'pinia'
const authStore = useAuthStore()
import { numberToWords } from '@/utils/numberToWords'

const loading = ref(false)
const { userMeta } = storeToRefs(useAuthStore())
const router = useRouter()
const getAddress = (obj) => {
  if (obj) {
    const segments = obj.id.split(':')
    const lastSegment = segments[segments.length - 1]
    const firstFour = lastSegment.substring(0, 6)
    const lastFour = lastSegment.substring(lastSegment.length - 6)
    const result = `${firstFour}....${lastFour}`
    return result
  }
}

watch(
  () => authStore.userMeta,
  (value: any) => {
    setTimeout(() => {
      loading.value = false
    }, 400)
  },
  { deep: true }
)

onMounted(() => {
  loading.value = true
  setTimeout(async () => {
    await authStore.USER_AUTHORIZE()
  }, 200)
})
</script>
