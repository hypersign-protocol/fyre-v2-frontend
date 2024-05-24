import { defineStore } from 'pinia'

export const evmWalletsStore = defineStore('evmstore', {
  state: () => ({
    evmResultObject: {
        provider: {},
        walletAddress: {},
        signProof: {},
        isSignedVerified: false,
        wagmiConfig: {},
        chainId: {},
        network: 'evm',
        connector: {}
    }
  }),
  actions: {
    SET_EVM_RESULT (payload: any) {
        this.evmResultObject = {...payload}
    }
  }
})
