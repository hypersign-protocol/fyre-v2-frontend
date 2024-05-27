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
    }
  }),
  actions: {
    SET_EVM_RESULT(payload: any) {
      this.evmResultObject = { ...payload }
    }
  }
})

// Not using
export const evmChainStore = defineStore('evmChainStore', {
  state: () => ({
    chains: [mainnet, bsc, polygon]
  }),
  actions: {
    SET_CHAIN_LIST(payload: any) {
      this.chains = { ...payload }
    }
  }
})
