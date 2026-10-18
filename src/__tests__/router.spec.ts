import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { routes } from '@/router'

const router = createRouter({ history: createMemoryHistory(), routes })

describe('router', () => {
  it.each([
    ['/', 'trips'],
    ['/trips/1', 'trip'],
    ['/trips/1/days/2', 'day'],
    ['/trips/1/print', 'print'],
    ['/theme', 'theme'],
  ])('resolves %s to route "%s"', (path, name) => {
    expect(router.resolve(path).name).toBe(name)
  })
})
