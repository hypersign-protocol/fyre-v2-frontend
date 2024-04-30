/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'
import './assets/scss/app.scss'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import { blockChainWalletPlugin } from './blockchainWalletPlugin'

// Composables
import { createApp } from 'vue'

const app = createApp(App)

app.config.errorHandler = (error, vm, info) => {
  console.error('An error occurred:', error)
  // Optionally, log additional info about the component
  console.error('Component:', vm)
  console.error('Info:', info)
  // Handle the error, e.g., show a message to the user
}

app.use(ElementPlus)
app.use(blockChainWalletPlugin())

registerPlugins(app)

app.config.warnHandler = () => {}

app.mount('#app')
