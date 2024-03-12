<!-- EventDescriptionDialog.vue -->

<template>
  <v-dialog v-model="dialog" :max-width="maxWidth" persistent>
    <v-card class="modal__card">
      <v-icon class="modal__close cursor-pointer" @click="closeDialog">mdi-close</v-icon>
      <div class="modal__header">
        <p class="modal__title">{{ title }}</p>
        <img v-if="showImage" class="modal__title__img" :src="imageSrc" />
      </div>
      <div class="modal__body">
        <p class="modal__content">{{ content }}</p>
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
const props = defineProps<{
  dialog: boolean
  maxWidth: string | number
  title: string
  showImage: boolean
  imageSrc: string
  content: string
}>()

const dialog = ref(props.dialog)

watch(() => {
  dialog.value = props.dialog
})

const closeDialog = () => {
  dialog.value = false
}
</script>
