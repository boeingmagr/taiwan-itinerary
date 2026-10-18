import {
  ACTIVITY_TYPES,
  HOLIDAY_STATUSES,
  TRANSPORT_MODES,
  VIBES,
  type Activity,
  type Day,
  type HolidayInfo,
  type LocalInfo,
  type Place,
  type Transit,
  type Trip,
  type TripExport,
} from '@/types'

// Imported itineraries are untrusted input: JSON from another device (or a
// hand-edited file). Everything below validates, clamps lengths, and strips
// prototype-pollution keys before the data is used.

export const EXPORT_APP = 'taiwanna'
export const EXPORT_VERSION = 1

export type ParseResult = { ok: true; data: TripExport } | { ok: false; error: string }

const LIMITS = {
  id: 100,
  name: 120,
  area: 80,
  short: 160,
  note: 2000,
  tip: 400,
  stamp: 40,
  companions: 20,
  lists: 500,
}

const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype'])

function sanitize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitize)
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value)) {
      if (DANGEROUS_KEYS.has(key)) continue
      out[key] = sanitize(val)
    }
    return out
  }
  return value
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

function str(value: unknown, max: number): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed
}

function num(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

function oneOf<T extends string>(value: unknown, allowed: readonly T[]): T | undefined {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : undefined
}

function strList(value: unknown, maxItems: number, maxLen: number): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => str(item, maxLen))
    .filter((item): item is string => Boolean(item))
    .slice(0, maxItems)
}

function isDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(value)
  return !Number.isNaN(date.getTime())
}

function isTime(value: unknown): value is string {
  return typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
}

function parseMrt(value: unknown): Transit['mrt'] | undefined {
  const o = asRecord(value)
  if (!o) return undefined
  const station = str(o.station, LIMITS.short)
  const line = str(o.line, LIMITS.short)
  if (!station || !line) return undefined
  const exit = str(o.exit, LIMITS.short)
  return exit ? { station, line, exit } : { station, line }
}

function parseTransit(value: unknown): Transit | undefined {
  const o = asRecord(value)
  if (!o) return undefined
  const transit: Transit = {}
  const mrt = parseMrt(o.mrt)
  if (mrt) transit.mrt = mrt
  const tra = str(o.tra, LIMITS.short)
  if (tra) transit.tra = tra
  const thsr = str(o.thsr, LIMITS.short)
  if (thsr) transit.thsr = thsr
  const bus = strList(o.bus, 20, LIMITS.short)
  if (bus.length) transit.bus = bus
  const youbike = str(o.youbike, LIMITS.short)
  if (youbike) transit.youbike = youbike
  const notes = str(o.notes, LIMITS.tip)
  if (notes) transit.notes = notes
  return Object.keys(transit).length ? transit : undefined
}

function parseLocalInfo(value: unknown): LocalInfo | undefined {
  const o = asRecord(value)
  if (!o) return undefined
  const vibe = oneOf(o.vibe, VIBES)
  if (!vibe) return undefined
  const info: LocalInfo = { vibe }
  const whatToOrder = str(o.whatToOrder, LIMITS.tip)
  if (whatToOrder) info.whatToOrder = whatToOrder
  const bestTime = str(o.bestTime, LIMITS.short)
  if (bestTime) info.bestTime = bestTime
  const tips = str(o.tips, LIMITS.tip)
  if (tips) info.tips = tips
  return info
}

function parseHolidayInfo(value: unknown): HolidayInfo | undefined {
  const o = asRecord(value)
  if (!o) return undefined
  const status = oneOf(o.status, HOLIDAY_STATUSES)
  if (!status) return undefined
  const note = str(o.note, LIMITS.tip)
  return note ? { status, note } : { status }
}

export function parsePlace(value: unknown): Place | null {
  const o = asRecord(value)
  if (!o) return null
  const id = str(o.id, LIMITS.id)
  const name = str(o.name, LIMITS.name)
  const area = str(o.area, LIMITS.area)
  const lat = num(o.lat)
  const lng = num(o.lng)
  if (!id || !name || !area || lat === undefined || lng === undefined) return null
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null

  const place: Place = { id, name, area, lat, lng }
  const nameZh = str(o.nameZh, LIMITS.name)
  if (nameZh) place.nameZh = nameZh
  const transit = parseTransit(o.transit)
  if (transit) place.transit = transit
  const localInfo = parseLocalInfo(o.localInfo)
  if (localInfo) place.localInfo = localInfo
  const holidayInfo = parseHolidayInfo(o.holidayInfo)
  if (holidayInfo) place.holidayInfo = holidayInfo
  return place
}

export function parseActivity(value: unknown): Activity | null {
  const o = asRecord(value)
  if (!o) return null
  const id = str(o.id, LIMITS.id)
  const title = str(o.title, LIMITS.name)
  const type = oneOf(o.type, ACTIVITY_TYPES)
  if (!id || !title || !type) return null

  const activity: Activity = {
    id,
    title,
    type,
    done: o.done === true,
    locked: o.locked === true,
  }
  if (isTime(o.time)) activity.time = o.time
  const durationMin = num(o.durationMin)
  if (durationMin !== undefined && durationMin >= 0) activity.durationMin = durationMin
  const costTWD = num(o.costTWD)
  if (costTWD !== undefined && costTWD >= 0) activity.costTWD = costTWD
  const notes = str(o.notes, LIMITS.note)
  if (notes) activity.notes = notes
  const placeId = str(o.placeId, LIMITS.id)
  if (placeId) activity.placeId = placeId
  const lat = num(o.lat)
  const lng = num(o.lng)
  if (lat !== undefined && lng !== undefined) {
    activity.lat = lat
    activity.lng = lng
  }
  return activity
}

export function parseDay(value: unknown): Day | null {
  const o = asRecord(value)
  if (!o) return null
  const id = str(o.id, LIMITS.id)
  const tripId = str(o.tripId, LIMITS.id)
  if (!id || !tripId || !isDate(o.date)) return null

  const day: Day = { id, tripId, date: o.date, activities: [] }
  const title = str(o.title, LIMITS.name)
  if (title) day.title = title
  const transportMode = oneOf(o.transportMode, TRANSPORT_MODES)
  if (transportMode) day.transportMode = transportMode
  if (Array.isArray(o.activities)) {
    day.activities = o.activities
      .map(parseActivity)
      .filter((item): item is Activity => item !== null)
      .slice(0, LIMITS.lists)
  }
  return day
}

export function parseTrip(value: unknown): Trip | null {
  const o = asRecord(value)
  if (!o) return null
  const id = str(o.id, LIMITS.id)
  const name = str(o.name, LIMITS.name)
  const startDate = isDate(o.startDate) ? o.startDate : null
  const endDate = isDate(o.endDate) ? o.endDate : null
  if (!id || !name || !startDate || !endDate) return null

  const now = new Date().toISOString()
  return {
    id,
    name,
    startDate,
    endDate,
    companions: strList(o.companions, LIMITS.companions, LIMITS.short),
    createdAt: str(o.createdAt, LIMITS.stamp) ?? now,
    updatedAt: str(o.updatedAt, LIMITS.stamp) ?? now,
  }
}

export function createTripExport(trips: Trip[], days: Day[]): TripExport {
  return {
    app: EXPORT_APP,
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    trips,
    days,
  }
}

export function stringifyTripExport(trips: Trip[], days: Day[]): string {
  return JSON.stringify(createTripExport(trips, days), null, 2)
}

export function parseTripExport(input: unknown): ParseResult {
  let raw = input
  if (typeof input === 'string') {
    try {
      raw = JSON.parse(input)
    } catch {
      return { ok: false, error: 'Not valid JSON.' }
    }
  }

  const o = asRecord(sanitize(raw))
  if (!o) return { ok: false, error: 'Expected a JSON object.' }
  if (o.app !== EXPORT_APP) return { ok: false, error: 'Not a Taiwanna export file.' }

  const version = num(o.version)
  if (version === undefined) return { ok: false, error: 'Missing export version.' }
  if (version > EXPORT_VERSION) {
    return { ok: false, error: `Unsupported export version ${version}.` }
  }
  if (!Array.isArray(o.trips)) return { ok: false, error: 'Missing trips list.' }

  const trips = o.trips
    .map(parseTrip)
    .filter((trip): trip is Trip => trip !== null)
    .slice(0, LIMITS.lists)
  const days = Array.isArray(o.days)
    ? o.days
        .map(parseDay)
        .filter((day): day is Day => day !== null)
        .slice(0, LIMITS.lists)
    : []

  return {
    ok: true,
    data: {
      app: EXPORT_APP,
      version,
      exportedAt: str(o.exportedAt, LIMITS.stamp) ?? new Date().toISOString(),
      trips,
      days,
    },
  }
}
