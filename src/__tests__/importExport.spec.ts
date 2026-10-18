import { describe, expect, it } from 'vitest'
import {
  EXPORT_VERSION,
  createTripExport,
  parseTripExport,
  stringifyTripExport,
} from '@/utils/importExport'
import type { Day, Trip } from '@/types'

const trip: Trip = {
  id: 'trip-1',
  name: 'Taipei + 九份',
  startDate: '2027-02-01',
  endDate: '2027-02-16',
  companions: ['Alex', 'Sam'],
  createdAt: '2027-01-01T00:00:00.000Z',
  updatedAt: '2027-01-02T00:00:00.000Z',
}

const day: Day = {
  id: 'day-1',
  tripId: 'trip-1',
  date: '2027-02-01',
  title: 'Arrival',
  transportMode: 'mrt',
  activities: [
    {
      id: 'act-1',
      title: '台北 101',
      type: 'sight',
      time: '14:30',
      durationMin: 90,
      costTWD: 600,
      done: true,
      locked: true,
      placeId: 'place-1',
    },
  ],
}

function exportObject(overrides: Record<string, unknown> = {}) {
  return {
    app: 'taiwanna',
    version: EXPORT_VERSION,
    trips: [trip],
    days: [day],
    ...overrides,
  }
}

describe('parseTripExport', () => {
  it('parses a valid export and keeps the shape intact', () => {
    const result = parseTripExport(exportObject())
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.data.trips).toEqual([trip])
    expect(result.data.days).toEqual([day])
    expect(result.data.app).toBe('taiwanna')
    expect(result.data.version).toBe(EXPORT_VERSION)
  })

  it('accepts a JSON string', () => {
    const result = parseTripExport(JSON.stringify(exportObject()))
    expect(result.ok).toBe(true)
  })

  it('rejects invalid JSON', () => {
    const result = parseTripExport('{not json')
    expect(result).toEqual({ ok: false, error: 'Not valid JSON.' })
  })

  it('rejects non-Taiwanna files', () => {
    expect(parseTripExport(exportObject({ app: 'other' }))).toEqual({
      ok: false,
      error: 'Not a Taiwanna export file.',
    })
  })

  it('rejects a newer export version', () => {
    const result = parseTripExport(exportObject({ version: EXPORT_VERSION + 1 }))
    expect(result.ok).toBe(false)
  })

  it('strips prototype-pollution keys', () => {
    const polluted = JSON.parse(
      '{"app":"taiwanna","version":1,"sequences":[],' +
        '"trips":[{"id":"t1","name":"x","startDate":"2027-02-01","endDate":"2027-02-16",' +
        '"__proto__":{"polluted":true},"constructor":{"prototype":{"polluted":true}}}],"days":[]}',
    )
    const result = parseTripExport(polluted)
    expect(result.ok).toBe(true)
    expect(({} as Record<string, unknown>).polluted).toBeUndefined()
    expect('polluted' in {}).toBe(false)
    if (result.ok) {
      expect(Object.prototype.hasOwnProperty.call(result.data.trips[0], 'polluted')).toBe(
        false,
      )
    }
  })

  it('clamps over-long strings and drops unknown fields', () => {
    const result = parseTripExport(
      exportObject({
        trips: [{ ...trip, name: 'x'.repeat(500), sneaky: 'drop me' }],
      }),
    )
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.data.trips[0].name).toHaveLength(120)
    expect('sneaky' in result.data.trips[0]).toBe(false)
  })

  it('drops malformed trips and activities instead of throwing', () => {
    const result = parseTripExport(
      exportObject({
        trips: [trip, { id: 'broken' }],
        days: [
          {
            ...day,
            activities: [{ id: 'a', title: 'ok', type: 'sight' }, { type: 'nope' }],
          },
        ],
      }),
    )
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.data.trips).toHaveLength(1)
    expect(result.data.days[0].activities).toHaveLength(1)
  })
})

describe('export round-trip', () => {
  it('re-imports what stringifyTripExport produces', () => {
    const json = stringifyTripExport([trip], [day])
    const result = parseTripExport(json)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.data).toMatchObject(createTripExport([trip], [day]))
  })
})
