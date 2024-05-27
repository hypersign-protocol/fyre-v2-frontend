import { defineStore } from 'pinia'
import { bsc, mainnet, polygon } from '@wagmi/core/chains'

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
    },
    hasSigningStarted: false, 
    error: {
      status: false,
      message: "" 
    },
  }),
  actions: {
    SET_EVM_RESULT (payload: any) {
        this.evmResultObject = {...payload}
    },
    SET_SIGNING_STARTED (payload: boolean) {
      this.hasSigningStarted = payload
    },
    SET_ERROR (payload: any) {
      this.error = {...payload}
    }
  }
})
