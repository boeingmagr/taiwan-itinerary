import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import App from '@/App.vue'
import { TeaRoomPreset } from '@/theme/preset'

// Sanity check: proves Vitest + jsdom + @vue/test-utils + the `@` alias + the
// PrimeVue theme preset all work together. Real tests for the optimizer/geo/budget
// logic arrive with T-20/T-21.
describe('Taiwanna scaffold', () => {
  it('mounts the app shell', () => {
    const wrapper = mount(App, {
      global: { plugins: [[PrimeVue, { theme: { preset: TeaRoomPreset } }]] },
    })
    expect(wrapper.text()).toContain('Taiwanna')
  })
})
