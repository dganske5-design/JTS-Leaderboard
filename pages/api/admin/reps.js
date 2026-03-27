import { supabase } from '../../../lib/supabase'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'JTS1971!'

function auth(req) {
  return req.headers['x-admin-token'] === ADMIN_PASSWORD
}

export default async function handler(req, res) {
  if (!auth(req)) return res.status(401).json({ error: 'Unauthorized' })

  // POST — add rep
  if (req.method === 'POST') {
    const { name } = req.body
    if (!name?.trim()) return res.status(400).json({ error: 'Name required' })

    const { data, error } = await supabase
      .from('reps')
      .insert([{ name: name.trim() }])
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json({ rep: data })
  }

  // PUT — rename rep
  if (req.method === 'PUT') {
    const { id, name } = req.body
    if (!id || !name?.trim()) return res.status(400).json({ error: 'id and name required' })

    const { data, error } = await supabase
      .from('reps')
      .update({ name: name.trim() })
      .eq('id', id)
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ rep: data })
  }

  // DELETE — remove rep (cascades to daily_stats)
  if (req.method === 'DELETE') {
    const { id } = req.body
    if (!id) return res.status(400).json({ error: 'id required' })

    const { error } = await supabase.from('reps').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ ok: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
