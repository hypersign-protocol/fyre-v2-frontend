// import { defineAsyncComponent } from 'vue'
// import { defu } from 'defu'

// import './assets/style.scss'

// export const walletOptionsInject = Symbol()
// export function blockChainWalletPlugin(app, options) {
//   options = defu(options, {
//     arrow: false
//   })

//   app.provide(walletOptionsInject, options)

//   app.component(
//     'BlockChainWallet',
//     defineAsyncComponent(() => import('./BlockChainWallet.vue'))
//   )
//   console.log('Hello plugin', options)
// }

import { defineAsyncComponent } from 'vue'
import { defu } from 'defu'
export const walletOptionsInject = Symbol()
import type { App } from 'vue'
import type { PluginOptions } from './types'
import './assets/style.scss'
export function blockChainWalletPlugin(options: PluginOptions = {}) {
  return (app: App) => {
    options = defu(options, {
      arrow: false
    })

    app.provide(walletOptionsInject, options)
    app.component(
      'BlockChainWallet',
      defineAsyncComponent(() => import('./BlockChainWallet.vue'))
    )
  }
}
