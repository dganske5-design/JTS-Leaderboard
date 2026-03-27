import { formatTalkTime } from '../lib/dateHelpers'

const BAR_COLORS = ['#00bfff', '#c9a227', '#cd7f32', '#7ab0e0', '#4a7fb5', '#2a5070']
const RANK_LABELS = ['1ST', '2ND', '3RD', '4TH', '5TH', '6TH']
const RANK_COLORS = ['#c9a227', '#c0c0c0', '#cd7f32']

export default function BarChart({ items, valueKey }) {
  // items: [{ name, calls, talk }] sorted descending
  const values = items.map(r => valueKey === 'calls' ? (r.calls || 0) : (r.talk || 0))
  const maxV = Math.max(...values, 1)

  const fmt = valueKey === 'calls'
    ? v => v.toLocaleString()
    : v => formatTalkTime(v)

  const ySteps = [maxV, Math.round(maxV * 0.75), Math.round(maxV * 0.5), Math.round(maxV * 0.25), 0]

  return (
    <div style={{ position: 'relative', height: 150, display: 'flex', paddingLeft: 38 }}>
      {/* Y axis grid lines */}
      <div style={{
        position: 'absolute', left: 38, right: 0, top: 0, bottom: 0,
        background: 'repeating-linear-gradient(to top, rgba(0,70,200,.07) 0, rgba(0,70,200,.07) 1px, transparent 1px, transparent 25%)',
        pointerEvents: 'none',
      }} />

      {/* Y labels */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 34,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        {ySteps.map((v, i) => (
          <span key={i} style={{ fontSize: 9, color: '#1e2e40', textAlign: 'right', lineHeight: 1, letterSpacing: '.03em' }}>
            {fmt(v)}
          </span>
        ))}
      </div>

      {/* Bars */}
      {items.map((rep, i) => {
        const val = values[i]
        const pct = maxV > 0 ? Math.max((val / maxV) * 100, val > 0 ? 2 : 0) : 0
        const color = BAR_COLORS[i] || BAR_COLORS[BAR_COLORS.length - 1]
        const rankColor = RANK_COLORS[i] || '#1e2e40'
        const firstName = rep.name.split(' ')[0].toUpperCase()

        return (
          <div key={rep.id || rep.name} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'flex-end',
            height: '100%', padding: '0 5px', position: 'relative',
          }}>
            {/* Bar area */}
            <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', height: 'calc(100% - 30px)' }}>
              <div
                title={`${rep.name}: ${fmt(val)}`}
                style={{
                  width: 'min(52px, 85%)',
                  height: `${pct}%`,
                  minHeight: val > 0 ? 3 : 0,
                  borderRadius: '5px 5px 0 0',
                  background: `linear-gradient(to top, ${color}bb, ${color})`,
                  position: 'relative',
                  transition: 'height .55s cubic-bezier(.22,1,.36,1)',
                  cursor: 'default',
                }}
              >
                {/* Value label above bar */}
                <span style={{
                  position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)',
                  fontFamily: '"Orbitron",monospace', fontSize: 9, fontWeight: 700,
                  color: color, whiteSpace: 'nowrap', letterSpacing: '-.01em',
                }}>
                  {fmt(val)}
                </span>
              </div>
            </div>

            {/* Name */}
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '.05em', textAlign: 'center',
              marginTop: 6, color: i === 0 ? '#fff' : '#4a7fb5',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              maxWidth: '100%', padding: '0 2px',
            }}>
              {firstName}
            </div>

            {/* Rank */}
            <div style={{
              fontFamily: '"Bebas Neue",sans-serif', fontSize: 13, textAlign: 'center',
              marginTop: 1, color: rankColor,
            }}>
              {RANK_LABELS[i] || `${i + 1}`}
            </div>
          </div>
        )
      })}
    </div>
  )
}
