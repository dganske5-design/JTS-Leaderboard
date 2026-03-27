import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Nav() {
  const router = useRouter()
  const isAdmin = router.pathname === '/admin'

  return (
    <nav className="top-nav">
      <div className="nav-brand">
        <div className="nav-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/jts-logo.png"
            alt="JTS"
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block' }}
          />
          <span style={{ display: 'none', fontFamily: '"Bebas Neue",sans-serif', fontSize: 13, color: '#fff' }}>JTS</span>
        </div>
        <span className="nav-title">Sales Scoreboard</span>
      </div>
      <div className="nav-links">
        <Link href="/" className={`nav-link${!isAdmin ? ' is-active' : ''}`}>
          📊 Scoreboard
        </Link>
        <Link href="/admin" className={`nav-link admin-link${isAdmin ? ' is-active' : ''}`}>
          ⚙ Admin Panel
        </Link>
      </div>
    </nav>
  )
}
