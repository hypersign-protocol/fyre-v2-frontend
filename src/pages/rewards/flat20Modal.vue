<template>
  <v-dialog class="fyre--modal" persistent>
    <v-card color="white" class="reward__modal" rounded="lg">
      <div class="d-flex align-end justify-end pa-2 close-icon">
        <v-icon class="cursor-pointer" @click="$emit('close')">mdi-close</v-icon>
      </div>
      <div class="gift-wrap__image">
        <img src="@/assets/images/gift-wrap.png" height="200" width="170" />
      </div>
      <div class="d-flex flex-column align-center justify-center won-wrap">
        <p class="font-16 font-weight-medium">You have won a</p>
        <p class="font-60 font-weight-bold">
          Flat 20% <br />
          Off
        </p>
        <p class="font-16 font-weight-medium">
          On an ethereal depiction of a <br />
          cosmic nebula, limited to 100<br />
          editions.
        </p>
      </div>
    </v-card>
    <v-card color="transparent">
      <div class="d-flex align-center justify-center flex-column text-center cong-wrap">
        <p class="font-28">Congratulations!!</p>
        <p class="font-14 mt-2">
          You've just unlocked a special <br />
          voucher that grants you exclusive <br />
          access to discounted prices on <br />
          coveted NFTs from our premium<br />
          collections. 🚀
        </p>
      </div>
    </v-card>
  </v-dialog>
</template>
<script lang="ts" setup>
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
</script>
<style lang="scss" scoped></style>
