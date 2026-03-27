import { supabase } from '../../lib/supabase'

// GET /api/stats?from=YYYY-MM-DD&to=YYYY-MM-DD
// Returns all daily_stats rows in that date range
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { from, to } = req.query

  if (!from || !to) return res.status(400).json({ error: 'from and to dates required' })

  const { data, error } = await supabase
    .from('daily_stats')
    .select('rep_id, stat_date, calls, talk_mins')
    .gte('stat_date', from)
    .lte('stat_date', to)

  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ stats: data })
}
