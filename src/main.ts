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

// Composables
import { createApp } from 'vue'

const app = createApp(App)

app.use(ElementPlus)

registerPlugins(app)

app.mount('#app')
