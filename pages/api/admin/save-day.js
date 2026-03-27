import { supabase } from '../../../lib/supabase'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'JTS1971!'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (req.headers['x-admin-token'] !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' })

  // Body: { date: 'YYYY-MM-DD', entries: [{ rep_id, calls, talk_mins }] }
  const { date, entries } = req.body

  if (!date || !Array.isArray(entries)) {
    return res.status(400).json({ error: 'date and entries[] required' })
  }

  // Upsert each rep's stats for this date
  const rows = entries.map(e => ({
    rep_id:     e.rep_id,
    stat_date:  date,
    calls:      Number(e.calls)     || 0,
    talk_mins:  Number(e.talk_mins) || 0,
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from('daily_stats')
    .upsert(rows, { onConflict: 'rep_id,stat_date' })

  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ ok: true, saved: rows.length })
}
