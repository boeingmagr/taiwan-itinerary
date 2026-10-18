import { ref } from 'vue'
import { createPersistedState } from 'pinia-plugin-persistedstate'

// Bump when the persisted shape changes; old keys are simply ignored (never
// migrated or merged), which keeps import/hydration predictable.
const SCHEMA_VERSION = 'v1'

// One key per store: `taiwanna.v1:<store-id>`.
export const PERSIST_PREFIX = `taiwanna.${SCHEMA_VERSION}`

// Last persistence failure (e.g. quota exceeded, storage disabled in private
// mode). Surfaced so views can show a toast instead of silently dropping data.
export const persistenceError = ref<string | null>(null)

// Only the Web Storage pieces the plugin needs; every call is guarded so a
// full/blocked localStorage never breaks the in-memory app.
export const safeLocalStorage = {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value)
      persistenceError.value = null
    } catch (error) {
      persistenceError.value =
        error instanceof Error ? error.message : 'Could not save to local storage.'
    }
  },
}

export function createPersistence() {
  return createPersistedState({
    key: (id) => `${PERSIST_PREFIX}:${id}`,
    storage: safeLocalStorage,
    // Stores opt in individually via `persist: true` / `persist: { ... }`.
    auto: false,
  })
}
