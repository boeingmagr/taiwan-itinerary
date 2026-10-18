import Aura from '@primevue/themes/aura'
import { definePreset } from '@primevue/themes'

// Three jade accent ramps. Only the ramp differs; the preset references
// `{primary.600}` (light) / `{primary.400}` (dark), so `updatePrimaryPalette`
// swaps the accent live without touching anything else.
export const jadeDeep = {
  50: '#eef8f3',
  100: '#d5efe4',
  200: '#ade0cd',
  300: '#7bcbb0',
  400: '#48b191',
  500: '#2a9d7f',
  600: '#1d7f68',
  700: '#196553',
  800: '#165244',
  900: '#133f35',
  950: '#082a23',
}

export const jadeVerdant = {
  50: '#edfaf4',
  100: '#d1f3e5',
  200: '#a4e7cd',
  300: '#6fd6b0',
  400: '#3ec296',
  500: '#20ab7e',
  600: '#148c66',
  700: '#117052',
  800: '#105a43',
  900: '#0e4937',
  950: '#052a1f',
}

export const jadePine = {
  50: '#eaf6f1',
  100: '#cdeae0',
  200: '#9ed7c4',
  300: '#66bda3',
  400: '#3a9f83',
  500: '#24836a',
  600: '#1b6a56',
  700: '#175547',
  800: '#15463b',
  900: '#123a31',
  950: '#072019',
}

export const accents = {
  deep: jadeDeep,
  verdant: jadeVerdant,
  pine: jadePine,
} as const

export type AccentName = keyof typeof accents

// Warm off-white neutrals for light mode ("Tea Room" paper feel).
const warm = {
  0: '#ffffff',
  50: '#faf8f4',
  100: '#f2efe8',
  200: '#e6e1d6',
  300: '#d2ccbd',
  400: '#b0a894',
  500: '#8c836e',
  600: '#6e6654',
  700: '#565043',
  800: '#3d3931',
  900: '#28251f',
  950: '#171511',
}

// Deep ink neutrals for dark mode.
const ink = {
  0: '#ffffff',
  50: '#eef1ef',
  100: '#dde2e0',
  200: '#c2cac7',
  300: '#9aa5a1',
  400: '#717d78',
  500: '#525c58',
  600: '#3f4844',
  700: '#313835',
  800: '#202624',
  900: '#121716',
  950: '#0a0f0e',
}

export const TeaRoomPreset = definePreset(Aura, {
  primitive: {
    borderRadius: {
      none: '0',
      xs: '2px',
      sm: '6px',
      md: '12px',
      lg: '16px',
      xl: '20px',
    },
  },
  semantic: {
    primary: jadePine,
    transitionDuration: '0.2s',
    focusRing: {
      width: '2px',
      style: 'solid',
      color: '{primary.color}',
      offset: '2px',
      shadow: 'none',
    },
    colorScheme: {
      light: {
        surface: warm,
        primary: {
          color: '{primary.600}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.700}',
          activeColor: '{primary.800}',
        },
        highlight: {
          background: '{primary.50}',
          focusBackground: '{primary.100}',
          color: '{primary.700}',
          focusColor: '{primary.800}',
        },
      },
      dark: {
        surface: ink,
        primary: {
          color: '{primary.400}',
          contrastColor: '{surface.950}',
          hoverColor: '{primary.300}',
          activeColor: '{primary.200}',
        },
      },
    },
  },
})
