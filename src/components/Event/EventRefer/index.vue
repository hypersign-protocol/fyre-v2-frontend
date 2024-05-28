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
              {{ eventParticipants.myReferralsCount }}/{{ eventData.referral.limit }}
            </p>
            <p v-else class="mr-2">
             0/{{ eventData.referral.limit }}
            </p>
            <img src="@/assets/images/user.svg" />
          </div>
          <p class="font-16 font-weight-bold mb-2">
            Refer and gain +{{ eventData.referral.referralXp }}XP points
          </p>
          <p class="font-16 font-weight-medium">
            You can gain more points by referring your friends
          </p>
        </div>
        <div v-if="checkIfLoggedIn()" class="border__dotted pa-6 d-flex flex-column align-center mt-4">
          <p class="font-16 font-weight-medium mb-2">Your Referral Code</p>
          <v-btn class="base-btn overflow-hidden text-truncate">
            <span class="mr-2">{{ eventParticipants.myReferralInvitationCode }}</span>
          </v-btn>
        </div>
        <v-btn v-if="checkIfLoggedIn()"
          height="53"
          block
          color="secondary"
          class="claim--button mt-4"
          @click="copyContent(getReferralUrl())"
        >
          <v-icon>mdi-link-variant</v-icon>
          <span class="ml-2"> Copy Link</span>
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
<script lang="ts" setup>
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { copyContent } from '@/composables/general.ts'

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
  if (props.token) {
    return true
  } else {
    return false
  }
}

const dialog = ref(true)

const getReferralUrl = () => {
  const url = window.location.href
  return `${url}?referrer=${props.eventParticipants.myReferralInvitationCode}`
}
</script>
