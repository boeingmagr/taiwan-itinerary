import { describe, expect, it } from 'vitest'
import { formatTWD, tripDateRange } from '@/utils/format'

describe('formatTWD', () => {
  it('formats whole TWD amounts with the NT$ prefix', () => {
    expect(formatTWD(120)).toBe('NT$120')
    expect(formatTWD(1234)).toBe('NT$1,234')
    expect(formatTWD(0)).toBe('NT$0')
  })

  it('falls back to zero for missing or non-finite values', () => {
    expect(formatTWD(undefined)).toBe('NT$0')
    expect(formatTWD(null)).toBe('NT$0')
    expect(formatTWD(Number.NaN)).toBe('NT$0')
  })
})

describe('tripDateRange', () => {
  it('collapses a same-month range', () => {
    expect(tripDateRange('2027-02-01', '2027-02-16')).toBe('Feb 1 – 16, 2027')
  })

  it('shows both months across a month boundary', () => {
    expect(tripDateRange('2027-02-28', '2027-03-03')).toBe('Feb 28 – Mar 3, 2027')
  })

  it('shows both years across a year boundary', () => {
    expect(tripDateRange('2026-12-30', '2027-01-02')).toBe('Dec 30, 2026 – Jan 2, 2027')
  })

  it('handles a single-day trip', () => {
    expect(tripDateRange('2027-02-01', '2027-02-01')).toBe('Feb 1, 2027')
  })

  it('returns an empty string for malformed dates', () => {
    expect(tripDateRange('', '2027-02-16')).toBe('')
    expect(tripDateRange('2027/02/01', '2027-02-16')).toBe('')
  })
})
