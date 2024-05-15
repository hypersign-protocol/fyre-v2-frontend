import { defineAsyncComponent } from 'vue'
import { defu } from 'defu'
export const walletOptionsInject = Symbol()

import { updateChallenge, receiveOptions } from './blockChainWallet.ts'
import './assets/style.scss'

type PluginOptions = Partial<Props>

export function blockChainWalletPlugin(options: PluginOptions) {
  return (app: any) => {
    options = defu(options, {
      arrow: false
    })

    app.config.globalProperties.postChallenge = updateChallenge
    app.config.globalProperties.emitOptions = receiveOptions

    app.provide(walletOptionsInject, options)
    app.component(
      'BlockChainWallet',
      defineAsyncComponent(() => import('./BlockChainWallet.vue'))
    )
  }
}
