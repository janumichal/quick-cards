import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import 'vuetify/styles'
import { createVuetify, type ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VNumberInput } from 'vuetify/labs/VNumberInput'
import '@mdi/font/css/materialdesignicons.css'

const customDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#000000',
    surface: '#2e2c34',
    'surface-darken-1': '#242329',
    'surface-darken-2': '#1a1a1e',
    'surface-variant': '#696872', // off toggle
    'on-surface-variant': '#EEEEEE',
    primary: '#1867C0',
    secondary: '#000000',
    error: '#e72c2c',
    info: '#2196F3',
    success: '#4bc365',
    warning: '#db6856',
  },
}

const pinia = createPinia();
const vuetify = createVuetify({
  components: {
    ...components,
    VNumberInput
  },
  directives,
  theme: {
    defaultTheme: 'customDarkTheme',
    themes: {
      customDarkTheme,
    }
  },
  defaults: {
    VSwitch: {
      color: "success",
      ripple: false,
      hideDetails: true,
      inline: true,
      flat: true,
    },
    VDivider: {
      thickness: 3,
    },
    VTextField: {
      variant: "solo-filled",
      width: "350",
      hideDetails: true,
    },
    VCard: {
      color: "surface-darken-2"
    },
    VCardText: {
      class: "bg-surface-darken-1"
    },
    VFileInput: {
      variant: "solo-filled",
      chips: true,
      prependIcon: "mdi-image-plus",
      accept: "image/png, image/jpeg",
      hideDetails: true,
    },
    VBtnToggle: {
      density: "comfortable",
      variant: "tonal",
      mandatory: true
    },
    VColorPicker: {
      mode: "hex",
      dotSize: 20,
      modes: ['hex']
    }
  }
})
const app = createApp(App);

app.use(pinia);
app.use(vuetify);
app.mount("#app");
