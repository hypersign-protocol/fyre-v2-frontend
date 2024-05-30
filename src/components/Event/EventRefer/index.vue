<!-- EventDescriptionDialog.vue -->

<template>
  <v-dialog class="fyre--modal" persistent>
    <v-card class="modal__card">
      <v-icon class="modal__close cursor-pointer" @click="$emit('close')">mdi-close</v-icon>
      <div class="modal__header">
        <p class="modal__title">Refer</p>
        <img class="modal__title__img ml-2" src="@/assets/images/modal_refer.svg" height="24" />
      </div>
      <div class="modal__body">
        <div class="border__dotted pa-6 d-flex flex-column align-center">
          <div class="d-flex align-center mb-2">
            <p v-if="checkIfLoggedIn()" class="mr-2">
              {{ getReferralCount() }}/{{ eventData.referral.limit }}
            </p>
            <p v-else class="mr-2">
              0/{{ eventData.referral.limit }}
            </p>
            <img src="@/assets/images/user.svg" />
          </div>
          <p class="font-16 font-weight-bold mb-2">
            Refer and gain +{{ eventData.referral.refereeXp }}XP points
          </p>
          <p class="font-16 font-weight-medium">
            You can gain more points by referring your friends
          </p>
        </div>
        <!-- <div v-if="checkIfLoggedIn()" class="border__dotted pa-6 d-flex flex-column align-center mt-4">
          <p class="font-16 font-weight-medium mb-2">Your Referral Url</p>
          <v-btn class="base-btn overflow-hidden text-truncate">
            <span class="mr-2"> {{ getReferralUrl }}</span>
          </v-btn>
        </div> -->
        <v-btn v-if="checkIfLoggedIn()" height="53" block color="secondary" class="claim--button mt-4"
          :disabled="!getInvitationCode()" @click="copyContent(getReferralUrl())">
          <v-icon>mdi-link-variant</v-icon>
          <span class="ml-2"> Copy Your Referral Link</span>
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
<script lang="ts" setup>
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { copyContent } from '@/composables/general.ts'
import { getToken } from '@/composables/jwtService.ts'
import { useEventParticipantStore } from '@/store/eventParticipant.ts'

const eventParticipantStore = useEventParticipantStore()

const authToken = computed(() => {
  return getToken()
})


const props = defineProps({
  token: { type: String, required: true },
  eventData: {
    type: Object,
    required: true,
    default() {
      return {}
    }
  },
  eventParticipants: {
    type: Object,
    required: true,
    default() {
      return {}
    }
  }
})

const checkIfLoggedIn = () => {
  if (authToken.value) {
    return true
  } else {
    return false
  }
}

const dialog = ref(true)

const getReferralCount = () => {
  return eventParticipantStore.performResult.myReferralsCount ? eventParticipantStore.performResult.myReferralsCount : (
    props.eventParticipants.myReferralsCount ? props.eventParticipants.myReferralsCount : 0
  )
}

const getInvitationCode = () => {
  const referrarCode = eventParticipantStore.performResult.myReferralInvitationCode ? eventParticipantStore.performResult.myReferralInvitationCode : props.eventParticipants.myReferralInvitationCode
  return referrarCode
}
const getReferralUrl = () => {
  const origin = window.location.origin
  const pathname = window.location.pathname
  const url = origin + pathname
  const referrarCode = getInvitationCode();
  return `${url}?referrer=${referrarCode}`
}
</script>
