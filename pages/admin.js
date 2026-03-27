import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import Nav from '../components/Nav'
import {
  MONTHS, DAY_ABBR,
  daysInMonth, firstDayOfWeek, toDateKey,
  formatTalkTime, todayKey, dateRangeKeys,
  currentWeekRange,
} from '../lib/dateHelpers'

// ─── helpers ────────────────────────────────────────────────────────
const TODAY  = new Date()
const CUR_Y  = TODAY.getFullYear()
const CUR_M  = TODAY.getMonth()
const CUR_D  = TODAY.getDate()
const TODAY_KEY = todayKey()

function s(label, val) {
  return (
    <div style={{ background: 'rgba(13,30,56,.95)', border: '1px solid rgba(0,70,200,.16)', borderRadius: 12, padding: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.15em', color: '#1a2a40', marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: '"Orbitron",monospace', fontSize: 'clamp(14px,2.5vw,20px)', fontWeight: 900, color: '#00bfff' }}>{val}</div>
    </div>
  )
}

// ─── Password Gate ───────────────────────────────────────────────────
function PasswordGate({ onUnlock }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setLoading(true); setErr('')
    const res = await fetch('/api/verify-admin', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    })
    setLoading(false)
    if (res.ok) { sessionStorage.setItem('jts_tok', pw); onUnlock(pw) }
    else { setErr('Incorrect password.'); setPw('') }
  }

  return (
    <div className="admin-bg" style={{ minHeight: '100vh' }}>
      <Nav />
      <div style={{ minHeight: 'calc(100vh - 50px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ width: '100%', maxWidth: 370, background: 'linear-gradient(135deg,rgba(13,30,56,.95),rgba(5,13,26,1))', border: '1px solid rgba(0,70,200,.2)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 20px 80px rgba(0,0,0,.8)' }}>
          <div style={{ padding: 24, textAlign: 'center', background: 'linear-gradient(135deg,#001a52,#003087)', borderBottom: '2px solid rgba(0,70,200,.38)' }}>
            <div style={{ fontSize: 32, marginBottom: 7 }}>🔐</div>
            <div style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 28, letterSpacing: '.1em', color: '#fff' }}>Admin Access</div>
            <div style={{ fontSize: 11, letterSpacing: '.1em', color: '#4a7fb5', marginTop: 3 }}>JTS Scoreboard Management</div>
          </div>
          <form onSubmit={submit} style={{ padding: 24 }}>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '.14em', color: '#2a3a50', marginBottom: 7 }}>PASSWORD</label>
            <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Enter admin password" autoFocus required />
            {err && <div style={{ fontSize: 12, color: '#f87171', textAlign: 'center', marginTop: 9 }}>{err}</div>}
            <button type="submit" disabled={loading || !pw} style={{ width: '100%', padding: 11, borderRadius: 8, background: 'linear-gradient(135deg,#003087,#0046c8)', color: '#fff', border: '1px solid rgba(0,70,200,.5)', fontFamily: 'inherit', fontSize: 15, fontWeight: 700, letterSpacing: '.13em', cursor: 'pointer', marginTop: 13, opacity: loading ? .6 : 1 }}>
              {loading ? 'Verifying...' : 'Unlock →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ─── Calendar Grid ───────────────────────────────────────────────────
function CalendarGrid({ year, month, selectedDay, statsMap, onSelectDay }) {
  const dim  = daysInMonth(year, month)
  const fday = firstDayOfWeek(year, month)
  const cells = []

  // Empty prefix
  for (let i = 0; i < fday; i++) cells.push(null)
  for (let d = 1; d <= dim; d++) cells.push(d)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3, minWidth: 300 }}>
      {DAY_ABBR.map(a => (
        <div key={a} style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: '#1a2a40', textAlign: 'center', padding: '4px 0' }}>{a}</div>
      ))}
      {cells.map((d, i) => {
        if (d === null) return <div key={`e${i}`} style={{ minHeight: 44 }} />
        const key      = toDateKey(year, month, d)
        const isToday  = key === TODAY_KEY
        const isSel    = d === selectedDay
        const dayTotal = statsMap[key] || 0
        const hasData  = dayTotal > 0

        return (
          <div
            key={d}
            onClick={() => onSelectDay(d)}
            title={`${MONTHS[month]} ${d}, ${year}`}
            style={{
              borderRadius: 6, padding: '4px 3px', textAlign: 'center',
              cursor: 'pointer', minHeight: 44,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1,
              border: '1px solid',
              borderColor: isSel ? 'rgba(0,191,255,.45)' : isToday ? 'rgba(34,197,94,.4)' : hasData ? 'rgba(0,70,200,.2)' : 'transparent',
              background: isSel ? 'rgba(0,48,135,.4)' : isToday ? 'rgba(34,197,94,.06)' : hasData ? 'rgba(0,70,200,.06)' : 'transparent',
              transition: 'all .15s',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: isSel ? '#fff' : isToday ? '#22c55e' : hasData ? '#7ab0e0' : '#2a3a50', lineHeight: 1 }}>
              {d}
            </div>
            {hasData && (
              <div style={{ fontSize: 9, color: '#00bfff', fontFamily: '"Orbitron",monospace', fontWeight: 700, lineHeight: 1 }}>
                {dayTotal}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Main Admin Dashboard ────────────────────────────────────────────
function AdminDashboard({ token }) {
  const [reps, setReps]         = useState([])
  const [admYear, setAdmYear]   = useState(CUR_Y)
  const [admMonth, setAdmMonth] = useState(CUR_M)
  const [admDay, setAdmDay]     = useState(null)
  const [statsMap, setStatsMap] = useState({}) // key → total calls (for calendar dots)
  const [dayStats, setDayStats] = useState({}) // repId → {calls, talk_mins}
  const [savingDay, setSavingDay]   = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)

  // Rep management state
  const [addRepOpen, setAddRepOpen] = useState(false)
  const [newRepName, setNewRepName] = useState('')
  const [editingRepId, setEditingRepId] = useState(null)
  const [editingRepName, setEditingRepName] = useState('')
  const [rstPend, setRstPend] = useState(false)

  // Summary stats
  const [statToday, setStatToday]   = useState(0)
  const [statMonth, setStatMonth]   = useState(0)
  const [statYear, setStatYear]     = useState(0)

  const headers = { 'Content-Type': 'application/json', 'x-admin-token': token }

  // ── Fetch reps ──
  const fetchReps = useCallback(async () => {
    const res = await fetch('/api/reps')
    if (res.ok) { const d = await res.json(); setReps(d.reps || []) }
  }, [])

  // ── Fetch stats for current month (calendar dots) ──
  const fetchMonthStats = useCallback(async () => {
    const dim  = daysInMonth(admYear, admMonth)
    const from = toDateKey(admYear, admMonth, 1)
    const to   = toDateKey(admYear, admMonth, dim)
    const res  = await fetch(`/api/stats?from=${from}&to=${to}`)
    if (!res.ok) return
    const { stats } = await res.json()
    const map = {}
    stats.forEach(row => {
      map[row.stat_date] = (map[row.stat_date] || 0) + (row.calls || 0)
    })
    setStatsMap(map)
  }, [admYear, admMonth])

  // ── Fetch summary stats ──
  const fetchSummaryStats = useCallback(async () => {
    // today
    const tRes = await fetch(`/api/stats?from=${TODAY_KEY}&to=${TODAY_KEY}`)
    if (tRes.ok) {
      const { stats } = await tRes.json()
      setStatToday(stats.reduce((s, r) => s + (r.calls || 0), 0))
    }
    // this month
    const dim  = daysInMonth(CUR_Y, CUR_M)
    const mRes = await fetch(`/api/stats?from=${toDateKey(CUR_Y, CUR_M, 1)}&to=${toDateKey(CUR_Y, CUR_M, dim)}`)
    if (mRes.ok) {
      const { stats } = await mRes.json()
      const byRep = {}
      stats.forEach(r => { byRep[r.rep_id] = (byRep[r.rep_id] || 0) + (r.calls || 0) })
      setStatMonth(Math.max(0, ...Object.values(byRep)))
    }
    // this year
    const yRes = await fetch(`/api/stats?from=${CUR_Y}-01-01&to=${CUR_Y}-12-31`)
    if (yRes.ok) {
      const { stats } = await yRes.json()
      const byRep = {}
      stats.forEach(r => { byRep[r.rep_id] = (byRep[r.rep_id] || 0) + (r.calls || 0) })
      setStatYear(Math.max(0, ...Object.values(byRep)))
    }
  }, [])

  // ── Fetch a specific day's stats for the editor ──
  const fetchDayStats = useCallback(async (year, month, day) => {
    const key = toDateKey(year, month, day)
    const res = await fetch(`/api/stats?from=${key}&to=${key}`)
    if (!res.ok) return
    const { stats } = await res.json()
    const map = {}
    stats.forEach(row => { map[row.rep_id] = { calls: row.calls || 0, talk_mins: row.talk_mins || 0 } })
    setDayStats(map)
  }, [])

  useEffect(() => { fetchReps(); fetchSummaryStats() }, [fetchReps, fetchSummaryStats])
  useEffect(() => { fetchMonthStats() }, [fetchMonthStats])

  function selectDay(d) {
    setAdmDay(d)
    fetchDayStats(admYear, admMonth, d)
  }

  function closeDayEditor() { setAdmDay(null); setDayStats({}) }

  // ── Save a day ──
  async function saveDay() {
    if (admDay === null) return
    setSavingDay(true)
    const date    = toDateKey(admYear, admMonth, admDay)
    const entries = reps.map(rep => ({
      rep_id:    rep.id,
      calls:     parseInt(document.getElementById(`dc-${rep.id}`)?.value) || 0,
      talk_mins: parseInt(document.getElementById(`dt-${rep.id}`)?.value) || 0,
    }))
    const res = await fetch('/api/admin/save-day', {
      method: 'POST', headers, body: JSON.stringify({ date, entries }),
    })
    setSavingDay(false)
    if (res.ok) {
      setSavedFlash(true); setTimeout(() => setSavedFlash(false), 2500)
      fetchMonthStats(); fetchSummaryStats()
    }
  }

  // ── Rep management ──
  async function addRep() {
    if (!newRepName.trim()) return
    const res = await fetch('/api/admin/reps', { method: 'POST', headers, body: JSON.stringify({ name: newRepName }) })
    if (res.ok) { setNewRepName(''); setAddRepOpen(false); fetchReps(); fetchSummaryStats() }
  }

  async function saveRepName(id) {
    if (!editingRepName.trim()) return
    await fetch('/api/admin/reps', { method: 'PUT', headers, body: JSON.stringify({ id, name: editingRepName }) })
    setEditingRepId(null); fetchReps()
  }

  async function deleteRep(id, name) {
    if (!window.confirm(`Remove ${name}? This also deletes all their stats.`)) return
    await fetch('/api/admin/reps', { method: 'DELETE', headers, body: JSON.stringify({ id }) })
    fetchReps(); fetchSummaryStats()
  }

  async function resetYear() {
    if (!rstPend) { setRstPend(true); return }
    await fetch('/api/admin/reset-year', { method: 'POST', headers, body: JSON.stringify({ year: admYear }) })
    setRstPend(false); fetchMonthStats(); fetchSummaryStats(); closeDayEditor()
  }

  function adminLogout() { sessionStorage.removeItem('jts_tok'); window.location.reload() }

  const years = [CUR_Y - 1, CUR_Y, CUR_Y + 1]

  // ── Styles ──────────────────────────────────────────────────────────
  const btnS = { background: 'linear-gradient(135deg,#003087,#0046c8)', color: '#fff', border: '1px solid rgba(0,70,200,.5)', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, letterSpacing: '.09em', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap' }
  const btnE = { background: 'rgba(0,48,135,.28)', color: '#4a7fb5', border: '1px solid rgba(0,70,200,.2)', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, letterSpacing: '.09em', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap' }
  const btnG = { background: 'rgba(0,0,0,.3)', color: '#3a5070', border: '1px solid rgba(0,70,200,.13)', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, letterSpacing: '.09em', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap' }
  const btnD = { background: 'rgba(220,38,38,.1)', color: '#f87171', border: '1px solid rgba(220,38,38,.28)', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, letterSpacing: '.09em', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap' }
  const card = { background: 'rgba(13,30,56,.95)', border: '1px solid rgba(0,70,200,.18)', borderRadius: 14, overflow: 'hidden' }
  const inputScore = { fontFamily: '"Orbitron",monospace', color: '#00bfff', fontSize: 15, fontWeight: 700 }

  return (
    <div className="admin-bg" style={{ minHeight: '100vh' }}>
      <Nav />

      {/* Admin header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(0,70,200,.14)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 'clamp(22px,5vw,40px)', letterSpacing: '.08em', color: '#fff' }}>Admin Panel</div>
          <div style={{ fontSize: 12, color: '#4a7fb5', letterSpacing: '.06em', marginTop: 2 }}>Full Calendar Year {admYear} · Enter Daily Stats</div>
        </div>
        <button onClick={adminLogout} style={btnG}>Logout</button>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '18px 18px 60px', display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Summary stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
          {s('Total Reps', reps.length)}
          {s("Today's Top Calls", statToday.toLocaleString())}
          {s('This Month Top', statMonth.toLocaleString())}
          {s(`${CUR_Y} Year Top`, statYear.toLocaleString())}
        </div>

        {/* ── CALENDAR SECTION ── */}
        <div>
          <div style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 18, letterSpacing: '.1em', color: '#fff', marginBottom: 10 }}>
            📅 Enter Daily Stats
          </div>

          <div style={{ background: 'rgba(13,30,56,.95)', border: '1px solid rgba(0,70,200,.2)', borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Year + Month row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em', color: '#1e2e40' }}>YEAR:</span>
              <select
                value={admYear}
                onChange={e => { setAdmYear(Number(e.target.value)); closeDayEditor() }}
                style={{ width: 90, padding: '5px 10px', fontSize: 13, borderRadius: 8, cursor: 'pointer' }}
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            {/* Month pills */}
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {MONTHS.map((m, i) => {
                const isCur = i === CUR_M && admYear === CUR_Y
                const isAct = i === admMonth
                return (
                  <button key={m} onClick={() => { setAdmMonth(i); setAdmDay(null) }} style={{
                    padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                    letterSpacing: '.07em', cursor: 'pointer', fontFamily: 'inherit',
                    whiteSpace: 'nowrap', transition: 'all .18s',
                    border: isAct ? '1px solid rgba(0,70,200,.6)' : isCur ? '1px solid rgba(201,162,39,.35)' : '1px solid rgba(0,70,200,.18)',
                    background: isAct ? 'linear-gradient(135deg,#003087,#0046c8)' : 'rgba(0,0,0,.3)',
                    color: isAct ? '#fff' : isCur ? 'rgba(201,162,39,.8)' : '#2a3a50',
                  }}>
                    {m.slice(0, 3)}
                    {isCur && !isAct ? ' ★' : ''}
                  </button>
                )
              })}
            </div>

            {/* Calendar grid */}
            <div style={{ overflowX: 'auto' }}>
              <CalendarGrid
                year={admYear} month={admMonth}
                selectedDay={admDay}
                statsMap={statsMap}
                onSelectDay={selectDay}
              />
            </div>

            <div style={{ fontSize: 11, color: '#1a2a40', letterSpacing: '.06em' }}>
              ★ = current month &nbsp;·&nbsp; Cyan number = total calls entered &nbsp;·&nbsp; Click any day to edit stats
            </div>
          </div>

          {/* Day Editor */}
          {admDay !== null && (
            <div style={{ marginTop: 12, background: 'rgba(13,30,56,.95)', border: '1px solid rgba(0,191,255,.22)', borderRadius: 14, padding: 16 }}>
              <div style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 20, letterSpacing: '.1em', color: '#fff', marginBottom: 12 }}>
                Editing: {MONTHS[admMonth]} {admDay}, {admYear}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {reps.length === 0 ? (
                  <div style={{ color: '#1a2a40', fontSize: 13, padding: '12px 0' }}>Add reps first using the section below.</div>
                ) : reps.map(rep => {
                  const cur = dayStats[rep.id] || { calls: 0, talk_mins: 0 }
                  return (
                    <div key={rep.id} style={{ background: 'rgba(0,0,0,.25)', border: '1px solid rgba(0,70,200,.15)', borderRadius: 10, padding: '12px 14px' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 10, letterSpacing: '.05em' }}>{rep.name}</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '.12em', color: '#2a3a50', marginBottom: 6 }}>📞 CALL COUNT</label>
                          <input type="number" min="0" id={`dc-${rep.id}`} defaultValue={cur.calls} key={`${toDateKey(admYear, admMonth, admDay)}-${rep.id}-c`} style={inputScore} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '.12em', color: '#2a3a50', marginBottom: 6 }}>🎙️ TALK TIME (min)</label>
                          <input type="number" min="0" id={`dt-${rep.id}`} defaultValue={cur.talk_mins} key={`${toDateKey(admYear, admMonth, admDay)}-${rep.id}-t`} style={inputScore} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                <button onClick={saveDay} disabled={savingDay} style={{ ...btnS, background: 'linear-gradient(135deg,#6b3a00,#c9a227)', borderColor: 'rgba(201,162,39,.5)', opacity: savingDay ? .6 : 1 }}>
                  {savingDay ? 'Saving...' : '💾 Save Day'}
                </button>
                <button onClick={closeDayEditor} style={btnG}>Close</button>
                {savedFlash && <span style={{ fontSize: 12, color: '#22c55e', letterSpacing: '.08em' }}>✓ Saved!</span>}
              </div>
            </div>
          )}
        </div>

        {/* ── REP MANAGEMENT ── */}
        <div style={card}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0,70,200,.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 17, letterSpacing: '.1em', color: '#fff' }}>Manage Reps</div>
            <button onClick={() => setAddRepOpen(v => !v)} style={btnE}>
              {addRepOpen ? 'Cancel' : '+ Add Rep'}
            </button>
          </div>

          {reps.length === 0 && !addRepOpen && (
            <div style={{ padding: 20, color: '#1a2a40', fontSize: 13, textAlign: 'center' }}>No reps yet. Add one below.</div>
          )}

          <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 7 }}>
            {reps.map(rep => (
              <div key={rep.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '9px 12px', background: 'rgba(0,0,0,.2)', borderRadius: 8, border: '1px solid rgba(0,70,200,.12)', flexWrap: 'wrap' }}>
                {editingRepId === rep.id ? (
                  <>
                    <input
                      type="text" value={editingRepName}
                      onChange={e => setEditingRepName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && saveRepName(rep.id)}
                      style={{ flex: 1, minWidth: 150 }}
                      autoFocus
                    />
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => saveRepName(rep.id)} style={btnS}>Save</button>
                      <button onClick={() => setEditingRepId(null)} style={btnG}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{rep.name}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => { setEditingRepId(rep.id); setEditingRepName(rep.name) }} style={btnE}>Rename</button>
                      <button onClick={() => deleteRep(rep.id, rep.name)} style={btnD}>Remove</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Add rep form */}
          {addRepOpen && (
            <div style={{ padding: '10px 12px 14px', borderTop: '1px solid rgba(0,70,200,.1)', background: 'rgba(0,191,255,.03)', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, minWidth: 160 }}>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '.12em', color: '#2a3a50', marginBottom: 6 }}>REP NAME</label>
                <input
                  type="text" value={newRepName}
                  onChange={e => setNewRepName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addRep()}
                  placeholder="Full name" autoFocus
                />
              </div>
              <button onClick={addRep} style={btnS}>Add Rep →</button>
            </div>
          )}
        </div>

        {/* ── DANGER ZONE ── */}
        <div style={{ background: 'rgba(13,30,56,.95)', border: '1px solid rgba(220,38,38,.15)', borderRadius: 14, padding: 16 }}>
          <div style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 18, letterSpacing: '.1em', color: '#f87171', marginBottom: 5 }}>⚠ Danger Zone</div>
          <div style={{ fontSize: 12, color: '#2a3a50', marginBottom: 12, lineHeight: 1.5 }}>
            Reset ALL stats for the entire {admYear} calendar year. Every day's call count and talk time will be permanently cleared. This cannot be undone.
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={resetYear}
              style={{ ...btnD, background: rstPend ? 'rgba(220,38,38,.25)' : 'rgba(220,38,38,.1)' }}
            >
              {rstPend ? `⚠ Confirm — Clear ALL ${admYear} Data` : `Reset ${admYear} Year`}
            </button>
            {rstPend && (
              <button onClick={() => setRstPend(false)} style={btnG}>Cancel</button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

// ─── Page entry ──────────────────────────────────────────────────────
export default function AdminPage() {
  const [token, setToken] = useState(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const saved = sessionStorage.getItem('jts_tok')
    if (saved) setToken(saved)
    setChecked(true)
  }, [])

  if (!checked) return null

  return (
    <>
      <Head><title>JTS Admin · Scoreboard</title></Head>
      {token ? <AdminDashboard token={token} /> : <PasswordGate onUnlock={setToken} />}
    </>
  )
}
