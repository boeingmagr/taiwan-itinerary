import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import { withVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import prettierConfig from 'eslint-config-prettier/flat'
import globals from 'globals'
import { globalIgnores } from 'eslint/config'

// NOTE: `withVueTs` is async and MUST be the direct default export (wrapping it
// in `defineConfig` throws). It registers the Vue SFC parser and TS handling.
export default withVueTs(
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  js.configs.recommended,
  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,

  {
    languageOptions: {
      globals: { ...globals.browser },
    },
    rules: {
      // Render user/imported itinerary text through Vue templates only. Raw HTML
      // is the one real XSS vector in this otherwise client-only app.
      'vue/no-v-html': 'error',
    },
  },

  // MUST be last: disables stylistic rules that conflict with Prettier.
  prettierConfig,
)
