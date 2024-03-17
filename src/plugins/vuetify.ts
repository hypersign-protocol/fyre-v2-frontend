/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createVuetify, type ThemeDefinition } from 'vuetify'

const custom: ThemeDefinition = {
  dark: true,
  colors: {
    primary: '#02050E',
    secondary: '#2656D6'
  }
}

export default createVuetify({
  theme: {
    defaultTheme: 'custom',
    themes: {
      custom
    }
  },
  defaults: {
    global: {
      ripple: false
    },
    VBtn: {
      style: [{ textTransform: 'none', letterSpacing: '0.5px', fontSize: '18px' }]
    },
    VTab: {
      style: [{ textTransform: 'none', letterSpacing: '0px', fontSize: '16px' }]
    },
    VMain: {
      style: [{ paddingTop: '0px' }]
    },
    VContainer: {
      style: [{ padding: '0px' }]
    }
  }
})
