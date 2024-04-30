// Utilities
import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    response: {}
  }),
  actions: {
    async SHOW_NOTIFICATION(payload) {
      this.response = payload
    }
  }
})
