<template>
  <div class="profile__setting__container">
    <p class="title">Avatar</p>
    <v-avatar>
      <v-img src="@/assets/images/user-avatar.png"></v-img>
    </v-avatar>
    <v-form @submit.prevent>
      <div>
        <label>User Name</label>
        <v-text-field value="Alvin" hide-details="auto" variant="solo"></v-text-field>
      </div>
      <div class="button__wrapper">
        <v-btn variant="outlined" color="secondary">Cancel</v-btn>
        <v-btn color="secondary" variant="flat">Save</v-btn>
      </div>
      <v-btn variant="text" class="text-red-100" @click="deletePopup = true">
        <v-icon>mdi-delete</v-icon>
        Delete the account permanently
      </v-btn>
    </v-form>
  </div>
  <DeleteModal @close="deletePopup = false" v-model="deletePopup" />
</template>
<script lang="ts" setup>
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'

const deletePopup = ref(false)
</script>
