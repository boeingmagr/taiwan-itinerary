import { onMounted, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import { updatePrimaryPalette } from '@primevue/themes'
import { accents, type AccentName } from './preset'

export function useAccent() {
  const accent = useStorage<AccentName>('taiwanna.accent', 'pine')

  // Applied after mount and on change only — calling `updatePrimaryPalette`
  // inside a reactive effect that runs during render recurses in PrimeVue.
  onMounted(() => updatePrimaryPalette(accents[accent.value]))
  watch(accent, (name) => updatePrimaryPalette(accents[name]))

  return { accent }
}
