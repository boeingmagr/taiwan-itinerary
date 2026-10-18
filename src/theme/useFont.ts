import { watchEffect } from 'vue'
import { useStorage } from '@vueuse/core'

export type FontName = 'inter' | 'plex' | 'fraunces'

const body = "'Noto Sans TC', system-ui, -apple-system, 'Segoe UI', sans-serif"

export const fonts: Record<FontName, { label: string; sans: string; display: string }> = {
  inter: {
    label: 'Inter',
    sans: `'Inter', ${body}`,
    display: `'Inter', ${body}`,
  },
  plex: {
    label: 'IBM Plex',
    sans: `'IBM Plex Sans', 'IBM Plex Sans TC', ${body}`,
    display: `'IBM Plex Sans', 'IBM Plex Sans TC', ${body}`,
  },
  fraunces: {
    label: 'Fraunces',
    sans: `'Inter', ${body}`,
    display: `'Fraunces', 'Noto Sans TC', Georgia, serif`,
  },
}

export function useFont() {
  const font = useStorage<FontName>('taiwanna.font', 'fraunces')

  watchEffect(() => {
    const chosen = fonts[font.value]
    const root = document.documentElement.style
    root.setProperty('--tw-font-sans', chosen.sans)
    root.setProperty('--tw-font-display', chosen.display)
  })

  return { font }
}
