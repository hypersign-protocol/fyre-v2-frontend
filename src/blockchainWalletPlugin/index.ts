import { defineAsyncComponent } from 'vue'
import { defu } from 'defu'
export const walletOptionsInject = Symbol()
import { updateChallenge } from './blockChainWallet.ts'
import './assets/style.scss'

type PluginOptions = Partial<Props>

export function blockChainWalletPlugin(options: PluginOptions) {
  return (app) => {
    options = defu(options, {
      arrow: false
    })

    app.config.globalProperties.postChallenge = updateChallenge

    app.provide(walletOptionsInject, options)
    app.component(
      'BlockChainWallet',
      defineAsyncComponent(() => import('./BlockChainWallet.vue'))
    )
  }
}
