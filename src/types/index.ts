// Domain model. Single source of truth for the persisted/exported shapes.

export const ACTIVITY_TYPES = ['sight', 'food', 'transport', 'hotel', 'shop'] as const
export type ActivityType = (typeof ACTIVITY_TYPES)[number]

export const TRANSPORT_MODES = ['walk', 'mrt', 'drive'] as const
export type TransportMode = (typeof TRANSPORT_MODES)[number]

export const VIBES = [
  'hidden-gem',
  'local-favorite',
  'tourist-classic',
  'food-ritual',
] as const
export type Vibe = (typeof VIBES)[number]

export const HOLIDAY_STATUSES = ['open', 'likely-closed', 'packed'] as const
export type HolidayStatus = (typeof HOLIDAY_STATUSES)[number]

export interface MrtAccess {
  station: string
  line: string
  exit?: string
}

// Curated static transit info (Tier A — no live APIs).
export interface Transit {
  mrt?: MrtAccess
  tra?: string
  thsr?: string
  bus?: string[]
  youbike?: string
  notes?: string
}

export interface LocalInfo {
  vibe: Vibe
  whatToOrder?: string
  bestTime?: string
  tips?: string
}

// CNY-aware closure/crowd expectations (see T-24).
export interface HolidayInfo {
  status: HolidayStatus
  note?: string
}

export interface Place {
  id: string
  name: string
  /** Chinese name for showing a taxi driver, e.g. 龍山寺. */
  nameZh?: string
  area: string
  lat: number
  lng: number
  transit?: Transit
  localInfo?: LocalInfo
  holidayInfo?: HolidayInfo
}

export interface Activity {
  id: string
  title: string
  type: ActivityType
  /** 'HH:mm' */
  time?: string
  durationMin?: number
  costTWD?: number
  notes?: string
  done: boolean
  /** Pinned by the route optimizer (T-21). */
  locked: boolean
  /** Attached Place, or custom coords below. */
  placeId?: string
  lat?: number
  lng?: number
}

export interface Day {
  id: string
  tripId: string
  /** 'YYYY-MM-DD' */
  date: string
  title?: string
  transportMode?: TransportMode
  activities: Activity[]
}

export interface Trip {
  id: string
  name: string
  /** 'YYYY-MM-DD' */
  startDate: string
  endDate: string
  companions: string[]
  createdAt: string
  updatedAt: string
}

export interface TripExport {
  app: 'taiwanna'
  version: number
  exportedAt: string
  trips: Trip[]
  days: Day[]
}
