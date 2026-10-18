import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, nextTick } from 'vue'
import { createPinia, defineStore, setActivePinia } from 'pinia'
import { PERSIST_PREFIX, createPersistence, persistenceError } from '@/stores/persistence'

const useDemo = defineStore('demo', {
  state: () => ({ count: 0, items: [] as string[] }),
  getters: { doubled: (state) => state.count * 2 },
  persist: true,
})

// Pinia 4 only applies plugins once the pinia instance is installed into an app.
function freshPinia() {
  const pinia = createPinia()
  pinia.use(createPersistence())
  createApp({}).use(pinia)
  setActivePinia(pinia)
}

function stored(storeId = 'demo') {
  return localStorage.getItem(`${PERSIST_PREFIX}:${storeId}`)
}

describe('pinia persistence', () => {
  beforeEach(() => {
    localStorage.clear()
    persistenceError.value = null
  })

  it('writes state under a versioned, per-store key', async () => {
    freshPinia()
    const store = useDemo()
    store.count = 5
    store.items.push('x')
    await nextTick()

    expect(JSON.parse(stored() as string)).toEqual({ count: 5, items: ['x'] })
  })

  it('does not persist derived getters', async () => {
    freshPinia()
    useDemo().count = 3
    await nextTick()

    expect(stored()).not.toContain('doubled')
  })

  it('hydrates a new store instance from storage', async () => {
    freshPinia()
    useDemo().count = 7
    await nextTick()

    freshPinia()
    expect(useDemo().count).toBe(7)
  })

  it('surfaces an error instead of throwing when storage is full', async () => {
    freshPinia()
    const store = useDemo()
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('quota', 'QuotaExceededError')
    })

    store.count = 99
    await nextTick()
    expect(persistenceError.value).toBeTruthy()
  })
})
