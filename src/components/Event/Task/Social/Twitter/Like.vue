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
      <div class="task__action" v-if="!isTaskVerified" @click="showExpand = !showExpand">
        <v-btn v-if="!showExpand">Verify</v-btn>
        <v-icon v-if="showExpand" color="white">mdi-close</v-icon>
      </div>
      <div class="task__action" v-if="isTaskVerified">
        <v-btn variant="outlined">
          <img src="@/assets/images/blue-tick.svg" class="mr-2" />
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
interface Task {
  _id: string
  type: string
  year: number
}

const props = defineProps<{
  task: Task
}>()
const showExpand = ref(false)
const isTaskVerified = ref(false)
</script>
