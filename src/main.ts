import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import 'primeicons/primeicons.css'
import './theme/tokens.css'
import './style.css'
import { TeaRoomPreset } from './theme/preset'
import { pinia } from './stores'
import { router } from './router'
import App from './App.vue'

createApp(App)
  .use(pinia)
  .use(router)
  .use(PrimeVue, {
    theme: {
      preset: TeaRoomPreset,
      options: {
        // Toggled by useThemeMode(); defaults to the system preference.
        darkModeSelector: '.p-dark',
        cssLayer: false,
      },
    },
  })
  .mount('#app')
