<template>
  <div class="task__wrap">
    <div class="task__top">
      <p class="text-red-100" v-if="task.isMandatory">Mandatory</p>
      <p class="text-green-100" v-if="!task.isMandatory">Optional</p>
    </div>
    <div class="task__header">
      <div class="task__title">
        <span>
          <img src="@/assets/images/task/twitter.svg" />
        </span>
        <span class="text text-white-100 text-capitalize">{{ task.title }}</span>
        <span class="points text-blue-100"> +{{ task.xp }}XP </span>
      </div>
      <div class="task__action" @click="showExpand = !showExpand">
        <v-btn
          v-if="
            !showExpand && !isTaskVerified && !eventParticipants?.tasks?.hasOwnProperty(task._id)
          "
        >
          Verify
        </v-btn>
        <v-btn
          variant="outlined"
          v-else-if="
            !showExpand && (isTaskVerified || eventParticipants?.tasks?.hasOwnProperty(task._id))
          "
        >
          <v-icon>mdi-check</v-icon>
          Verified
        </v-btn>
        <v-icon v-if="showExpand" color="white">mdi-close</v-icon>
      </div>
      <div class="task__action" v-if="isTaskVerified">
        <v-btn variant="outlined">
          <v-icon>mdi-check</v-icon>
          Verified</v-btn
        >
      </div>
    </div>
    <div class="task__body" v-if="showExpand && !isTaskVerified">
      <div class="task__input">
        <v-text-field
          v-model="inputText"
          :placeholder="task.options.userInput.collectUrl.label"
          variant="solo"
        ></v-text-field>
      </div>
      <div class="task__submit">
        <v-btn @click="isTaskVerified = true">Verify</v-btn>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
const props = defineProps({
  communityId: { type: String, required: true },
  task: {
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
const showExpand = ref(false)
const isTaskVerified = ref(false)
</script>
