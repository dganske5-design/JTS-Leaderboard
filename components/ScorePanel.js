import BarChart from './BarChart'
import Leaderboard from './Leaderboard'

export default function ScorePanel({ icon, title, subtitle, chartLabel, items, valueKey, updatedAt, repCount }) {
  const sorted = [...(items || [])].sort((a, b) => {
    const av = valueKey === 'calls' ? (a.calls || 0) : (a.talk || 0)
    const bv = valueKey === 'calls' ? (b.calls || 0) : (b.talk || 0)
    return bv - av
  })

  return (
    <div className="panel">
      {/* Header */}
      <div className="panel-hd">
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24, lineHeight: 1 }}>{icon}</span>
            <div>
              <div style={{
                fontFamily: '"Bebas Neue",sans-serif',
                fontSize: 'clamp(20px,3.5vw,32px)',
                letterSpacing: '.1em', color: '#fff',
              }}>{title}</div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', color: '#4a7fb5', marginTop: 2 }}>
                {subtitle}
              </div>
            </div>
          </div>
          {/* Live pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', borderRadius: 999,
            border: '1px solid rgba(201,162,39,.35)',
            background: 'rgba(201,162,39,.07)',
          }}>
            <div className="live-dot" style={{ background: '#c9a227', boxShadow: '0 0 5px #c9a227' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', color: '#c9a227' }}>LIVE</span>
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div style={{ padding: '16px 22px 12px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.13em', color: '#1e2e40', marginBottom: 12 }}>
          {chartLabel}
        </div>
        {sorted.length > 0 ? (
          <BarChart items={sorted} valueKey={valueKey} />
        ) : (
          <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a2a40', fontSize: 13 }}>
            No data yet
          </div>
        )}
      </div>

      {/* Column headers */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '7px 12px',
        borderBottom: '1px solid rgba(0,70,200,.09)',
        borderTop: '1px solid rgba(0,70,200,.09)',
        background: 'rgba(0,0,0,.18)',
      }}>
        <div style={{ width: 60, textAlign: 'center', fontSize: 10, fontWeight: 700, letterSpacing: '.12em', color: '#1a2a40' }}>RANK</div>
        <div style={{ flex: 1, paddingLeft: 8, fontSize: 10, fontWeight: 700, letterSpacing: '.12em', color: '#1a2a40' }}>REP</div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', color: '#1a2a40' }}>
          {valueKey === 'calls' ? 'CALLS' : 'TALK TIME'}
        </div>
      </div>

      {/* Leaderboard */}
      <div style={{ padding: '0 10px 8px' }}>
        <Leaderboard items={sorted} valueKey={valueKey} />
      </div>

      {/* Footer */}
      <div style={{
        padding: '7px 22px', borderTop: '1px solid rgba(0,70,200,.08)',
        background: 'rgba(0,0,0,.13)', display: 'flex', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 10, color: '#1a2a40', letterSpacing: '.05em' }}>
          {repCount} rep{repCount !== 1 ? 's' : ''} competing
        </span>
        {updatedAt && (
          <span style={{ fontSize: 10, color: '#1a2a40', letterSpacing: '.05em' }}>
            Updated {new Date(updatedAt).toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  )
}
