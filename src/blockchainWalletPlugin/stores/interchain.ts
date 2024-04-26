import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useInterChainStore = defineStore('interchain', {
  state: () => ({
    interChainObject: {},
    interChainActiveStep: 'chain',
    challenge: null,
    options: null

  }),
  actions: {
    RESET_STORE() {
      this.interChainObject = {}
      this.interChainActiveStep = 'chain'
    }
  }
})
