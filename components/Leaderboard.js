import { formatTalkTime } from '../lib/dateHelpers'

const RANK_LABELS = ['1ST', '2ND', '3RD', '4TH', '5TH', '6TH']

function RankBadge({ rank }) {
  if (rank === 0) return (
    <span style={{
      fontFamily: '"Bebas Neue",sans-serif', fontSize: 'clamp(18px,3vw,25px)',
      letterSpacing: '.06em', lineHeight: 1,
      background: 'linear-gradient(135deg,#b8860b,#ffd700,#b8860b)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      backgroundClip: 'text', filter: 'drop-shadow(0 0 4px rgba(255,215,0,.5))',
    }}>1ST</span>
  )
  if (rank === 1) return <span style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 'clamp(18px,3vw,25px)', color: '#c0c0c0' }}>2ND</span>
  if (rank === 2) return <span style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 'clamp(18px,3vw,25px)', color: '#cd7f32' }}>3RD</span>
  return <span style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 'clamp(18px,3vw,25px)', color: '#1e2e40' }}>{RANK_LABELS[rank] || `${rank + 1}`}</span>
}

export default function Leaderboard({ items, valueKey }) {
  if (!items || items.length === 0) {
    return <div style={{ textAlign: 'center', padding: 24, color: '#1a2a40', fontSize: 13 }}>No reps yet</div>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, padding: '7px 0' }}>
      {items.map((rep, i) => {
        const val = valueKey === 'calls' ? (rep.calls || 0) : (rep.talk || 0)
        const display = valueKey === 'calls' ? val.toLocaleString() : formatTalkTime(val)
        const isFirst = i === 0

        return (
          <div
            key={rep.id || rep.name}
            className={`score-row${isFirst ? ' rf' : ''}`}
          >
            {isFirst && <div className="first-bar" />}

            {/* Rank */}
            <div style={{ width: 54, textAlign: 'center', flexShrink: 0 }}>
              <RankBadge rank={i} />
            </div>

            {/* Name */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 'clamp(14px,2.5vw,19px)', fontWeight: 600,
                letterSpacing: '.06em', color: isFirst ? '#fff' : '#6a8aaa',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {rep.name.toUpperCase()}
              </div>
              {isFirst && (
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.15em', color: '#c9a227', marginTop: 1 }}>
                  ◆ LEADING
                </div>
              )}
            </div>

            {/* Score */}
            <div style={{ flexShrink: 0, textAlign: 'right' }}>
              <span style={{
                fontFamily: '"Orbitron",monospace',
                fontSize: 'clamp(20px,3.5vw,36px)',
                fontWeight: 900, letterSpacing: '-.02em',
                color: isFirst ? '#00bfff' : '#1e2e40',
                textShadow: isFirst ? '0 0 10px rgba(0,191,255,.5), 0 0 28px rgba(0,191,255,.15)' : 'none',
              }}>
                {display}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
