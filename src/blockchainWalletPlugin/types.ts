import type BlockChainWallet from './BlockChainWallet.vue'
export type PluginOptions = Partial<Props>
export * from './index'

declare module 'vue' {
  interface GlobalComponents {
    BlockChainWallet: typeof BlockChainWallet
  }
}
