// Format a date as YYYY-MM-DD (Supabase DATE column format)
export function toDateKey(year, month0, day) {
  return `${year}-${String(month0 + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

// Parse a YYYY-MM-DD string into { year, month0, day }
export function parseDateKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return { year: y, month0: m - 1, day: d }
}

export function daysInMonth(year, month0) {
  return new Date(year, month0 + 1, 0).getDate()
}

export function firstDayOfWeek(year, month0) {
  return new Date(year, month0, 1).getDay() // 0 = Sun
}

// Returns the Monday–Sunday range containing today
export function currentWeekRange(today = new Date()) {
  const dow = today.getDay()
  const diffToMon = dow === 0 ? -6 : 1 - dow
  const mon = new Date(today)
  mon.setDate(today.getDate() + diffToMon)
  const sun = new Date(mon)
  sun.setDate(mon.getDate() + 6)
  return { start: mon, end: sun }
}

// Returns array of YYYY-MM-DD strings for a date range
export function dateRangeKeys(startDate, endDate) {
  const keys = []
  const d = new Date(startDate)
  while (d <= endDate) {
    keys.push(toDateKey(d.getFullYear(), d.getMonth(), d.getDate()))
    d.setDate(d.getDate() + 1)
  }
  return keys
}

export function todayKey() {
  const t = new Date()
  return toDateKey(t.getFullYear(), t.getMonth(), t.getDate())
}

export function formatTalkTime(minutes) {
  if (!minutes) return '0m'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`
}

export const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

export const DAY_ABBR = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
