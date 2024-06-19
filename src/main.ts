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

// Composable
import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import VueGtag from "vue-gtag-next";

const app = createApp(App)
const head = createHead()

app.config.errorHandler = (error, vm, info) => {
  console.error('An error occurred:', error)
  // Optionally, log additional info about the component
  console.error('Component:', vm)
  console.error('Info:', info)
  // Handle the error, e.g., show a message to the user
}

app.use(ElementPlus)
app.use(blockChainWalletPlugin())
app.use(head)
app.use(VueGtag, {
  config: { 
    id: "G-DFMNJXNKCM1"
  }
})
registerPlugins(app)

app.config.warnHandler = () => {}

app.mount('#app')
