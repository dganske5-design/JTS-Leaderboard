import { supabase } from '../../../lib/supabase'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'JTS1971!'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (req.headers['x-admin-token'] !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' })

  const { year } = req.body
  if (!year) return res.status(400).json({ error: 'year required' })

  const from = `${year}-01-01`
  const to   = `${year}-12-31`

  const { error } = await supabase
    .from('daily_stats')
    .delete()
    .gte('stat_date', from)
    .lte('stat_date', to)

  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ ok: true })
}
