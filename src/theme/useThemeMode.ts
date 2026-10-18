import { computed, watchEffect } from 'vue'
import { usePreferredDark, useStorage } from '@vueuse/core'

export type ThemeMode = 'light' | 'dark' | 'system'

// Must match `darkModeSelector` in main.ts.
const DARK_CLASS = 'p-dark'

export function useThemeMode() {
  const mode = useStorage<ThemeMode>('taiwanna.theme', 'system')
  const preferredDark = usePreferredDark()

  const isDark = computed(() =>
    mode.value === 'system' ? preferredDark.value : mode.value === 'dark',
  )

  watchEffect(() => {
    document.documentElement.classList.toggle(DARK_CLASS, isDark.value)
    document.documentElement.style.colorScheme = isDark.value ? 'dark' : 'light'
  })

  function toggle() {
    mode.value = isDark.value ? 'light' : 'dark'
  }

  return { mode, isDark, toggle }
}
