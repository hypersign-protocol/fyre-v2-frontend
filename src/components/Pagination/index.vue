<template>
  <div class="text-center d-flex align-center justify-center my-6" v-if="total > 8">
    <v-pagination
      v-model="currentPage"
      :length="Math.ceil(total / limit)"
      @update:modelValue="$emit('pageChange', currentPage)"
    ></v-pagination>
  </div>
</template>
<script setup lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
const props = defineProps({
  page: {
    type: Number,
    default: 1
  },
  limit: {
    type: Number,
    default: 10
  },
  total: {
    type: Number,
    default: 10
  },
  height: {
    type: String,
    default: '300'
  }
})
const currentPage = ref(props.page)
</script>
