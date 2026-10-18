// 'en' renders TWD as "NT$120"; the zh-TW locale drops the "NT" prefix.
const twd = new Intl.NumberFormat('en', {
  style: 'currency',
  currency: 'TWD',
  maximumFractionDigits: 0,
})

export function formatTWD(value: number | null | undefined): string {
  const amount = typeof value === 'number' && Number.isFinite(value) ? value : 0
  return twd.format(amount)
}

function parseISODate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!match) return null
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  return Number.isNaN(date.getTime()) ? null : date
}

const dayMonth = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' })
const full = new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})
const month = new Intl.DateTimeFormat('en', { month: 'short' })

/** e.g. "Feb 1 – 16, 2027", "Feb 28 – Mar 3, 2027", "Dec 30, 2026 – Jan 2, 2027". */
export function tripDateRange(start: string, end: string): string {
  const from = parseISODate(start)
  const to = parseISODate(end)
  if (!from || !to) return ''

  if (from.getTime() === to.getTime()) return full.format(from)
  if (from.getFullYear() !== to.getFullYear()) {
    return `${full.format(from)} – ${full.format(to)}`
  }
  if (from.getMonth() === to.getMonth()) {
    return `${month.format(from)} ${from.getDate()} – ${to.getDate()}, ${to.getFullYear()}`
  }
  return `${dayMonth.format(from)} – ${full.format(to)}`
}
