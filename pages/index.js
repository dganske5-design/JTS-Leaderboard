import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import Nav from '../components/Nav'
import ScorePanel from '../components/ScorePanel'
import { currentWeekRange, dateRangeKeys, todayKey, MONTHS } from '../lib/dateHelpers'

const POLL_MS = 20000 // refresh every 20s

function getViewConfig(view) {
  const today = new Date()
  const year  = today.getFullYear()
  const mon   = today.getMonth()
  const day   = today.getDate()

  if (view === 'today') {
    const key = todayKey()
    return {
      from: key, to: key,
      label: today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
      short: 'Today',
    }
  }
  if (view === 'week') {
    const { start, end } = currentWeekRange(today)
    const from = `${start.getFullYear()}-${String(start.getMonth()+1).padStart(2,'0')}-${String(start.getDate()).padStart(2,'0')}`
    const to   = `${end.getFullYear()}-${String(end.getMonth()+1).padStart(2,'0')}-${String(end.getDate()).padStart(2,'0')}`
    const label = `${start.toLocaleDateString('en-US',{month:'short',day:'numeric'})} – ${end.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}`
    return { from, to, label, short: 'This Week' }
  }
  // month
  const dim  = new Date(year, mon + 1, 0).getDate()
  const from = `${year}-${String(mon+1).padStart(2,'0')}-01`
  const to   = `${year}-${String(mon+1).padStart(2,'0')}-${String(dim).padStart(2,'0')}`
  return {
    from, to,
    label: today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    short: 'This Month',
  }
}

export default function Home() {
  const [view, setView]     = useState('today')
  const [reps, setReps]     = useState([])
  const [repData, setRepData] = useState([]) // [{id, name, calls, talk}]
  const [lastFetch, setLastFetch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  const cfg = getViewConfig(view)

  const fetchAll = useCallback(async () => {
    try {
      const [rRes, sRes] = await Promise.all([
        fetch('/api/reps'),
        fetch(`/api/stats?from=${cfg.from}&to=${cfg.to}`),
      ])
      if (!rRes.ok || !sRes.ok) throw new Error('Fetch failed')
      const { reps: repsData }   = await rRes.json()
      const { stats: statsData } = await sRes.json()

      // Aggregate stats per rep
      const totals = {}
      statsData.forEach(row => {
        if (!totals[row.rep_id]) totals[row.rep_id] = { calls: 0, talk: 0 }
        totals[row.rep_id].calls += row.calls    || 0
        totals[row.rep_id].talk  += row.talk_mins || 0
      })

      const merged = repsData.map(rep => ({
        ...rep,
        calls: totals[rep.id]?.calls || 0,
        talk:  totals[rep.id]?.talk  || 0,
      }))

      setReps(repsData)
      setRepData(merged)
      setLastFetch(new Date().toISOString())
      setError(null)
    } catch (e) {
      setError('Unable to load scoreboard data.')
    } finally {
      setLoading(false)
    }
  }, [cfg.from, cfg.to])

  useEffect(() => {
    setLoading(true)
    fetchAll()
    const t = setInterval(fetchAll, POLL_MS)
    return () => clearInterval(t)
  }, [fetchAll])

  const tabs = [
    { key: 'today', label: '📅 Today',      gold: false },
    { key: 'week',  label: '📊 This Week',  gold: false },
    { key: 'month', label: '🏆 This Month', gold: true  },
  ]

  return (
    <>
      <Head><title>JTS Sales Scoreboard</title></Head>

      <div className="arena-bg" style={{ minHeight: '100vh' }}>
        <Nav />

        {/* Header */}
        <header style={{ padding: '20px 20px 14px', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 50% -20%, rgba(0,70,200,.2) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.18em', color: '#c9a227', marginBottom: 3 }}>
                JANUARY TECHNOLOGY SOLUTIONS
              </div>
              <div style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 'clamp(28px,6vw,56px)', letterSpacing: '.08em', lineHeight: 1, color: '#fff' }}>
                Sales Scoreboard
              </div>
              <div style={{ fontSize: 'clamp(12px,2vw,16px)', letterSpacing: '.1em', color: '#4a7fb5', marginTop: 3 }}>
                {cfg.label}
              </div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '5px 12px', borderRadius: 999,
              background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.3)',
              marginLeft: 'auto',
            }}>
              <div className="live-dot" />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.13em', color: '#22c55e' }}>LIVE</span>
            </div>
          </div>
        </header>

        {/* View tabs */}
        <div style={{ padding: '0 20px 14px', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setView(t.key)}
              style={{
                padding: '6px 16px', borderRadius: 999, fontSize: 12, fontWeight: 700,
                letterSpacing: '.09em', cursor: 'pointer', border: '1px solid',
                whiteSpace: 'nowrap', fontFamily: 'inherit', transition: 'all .18s',
                ...(view === t.key
                  ? t.gold
                    ? { background: 'linear-gradient(135deg,#6b3a00,#c9a227)', color: '#fff', borderColor: 'rgba(201,162,39,.6)', boxShadow: '0 0 10px rgba(201,162,39,.22)' }
                    : { background: 'linear-gradient(135deg,#003087,#0046c8)', color: '#fff', borderColor: 'rgba(0,70,200,.6)', boxShadow: '0 0 10px rgba(0,70,200,.22)' }
                  : { background: 'rgba(0,0,0,.3)', color: '#3a5070', borderColor: 'rgba(0,70,200,.2)' }
                ),
              }}
            >
              {t.label}
            </button>
          ))}
          <span style={{ fontSize: 11, color: '#1a2a40', letterSpacing: '.07em', marginLeft: 4 }}>{cfg.label}</span>
        </div>

        {/* Error */}
        {error && (
          <div style={{ margin: '0 20px 14px', padding: '10px 16px', borderRadius: 10, background: 'rgba(220,38,38,.15)', border: '1px solid rgba(220,38,38,.3)', color: '#fca5a5', fontSize: 13 }}>
            ⚠ {error}
          </div>
        )}

        {/* Panels */}
        <main style={{ maxWidth: 860, margin: '0 auto', padding: '0 18px 44px' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
              <div style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 40, color: '#003087', letterSpacing: '.1em', marginBottom: 16 }}>LOADING...</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width: 10, height: 10, borderRadius: '50%', background: '#003087',
                    animation: `plive 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <ScorePanel
                icon="📞" title="Call Count"
                subtitle={`Calls — ${cfg.short}`}
                chartLabel={`CALL COUNT · ${cfg.short.toUpperCase()}`}
                items={repData} valueKey="calls"
                updatedAt={lastFetch} repCount={reps.length}
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '2px 0' }}>
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right,transparent,rgba(0,70,200,.2),transparent)' }} />
                <span style={{ color: '#1a2a40', fontSize: 11 }}>◆</span>
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right,transparent,rgba(0,70,200,.2),transparent)' }} />
              </div>

              <ScorePanel
                icon="🎙️" title="Talk Time"
                subtitle={`Talk Time — ${cfg.short}`}
                chartLabel={`TALK TIME · ${cfg.short.toUpperCase()}`}
                items={repData} valueKey="talk"
                updatedAt={lastFetch} repCount={reps.length}
              />
            </div>
          )}
        </main>

        <footer style={{ textAlign: 'center', padding: 12, borderTop: '1px solid rgba(0,70,200,.06)' }}>
          <p style={{ fontSize: 10, letterSpacing: '.09em', color: '#0d1a2a' }}>JTS Internal Use Only · {new Date().getFullYear()}</p>
        </footer>
      </div>
    </>
  )
}
