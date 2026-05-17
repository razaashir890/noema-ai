// api/conversations/[id].js
// Vercel Serverless Function - Get/Delete Conversation

export default async function handler(req, res) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  const { id } = req.query;

  if (!id) return res.status(400).json({ error: 'Conversation ID required' });

  // GET - Get conversation with messages
  if (req.method === 'GET') {
    try {
      const [convRes, msgRes] = await Promise.all([
        fetch(`${supabaseUrl}/rest/v1/conversations?id=eq.${id}`, {
          headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` },
        }),
        fetch(`${supabaseUrl}/rest/v1/messages?conversation_id=eq.${id}&select=*&order=created_at.asc`, {
          headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` },
        }),
      ]);
      const conversation = await convRes.json();
      const messages = await msgRes.json();
      return res.status(200).json({ conversation: conversation[0], messages });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // DELETE - Delete conversation (messages cascade)
  if (req.method === 'DELETE') {
    try {
      await fetch(`${supabaseUrl}/rest/v1/conversations?id=eq.${id}`, {
        method: 'DELETE',
        headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` },
      });
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // PATCH - Update title
  if (req.method === 'PATCH') {
    try {
      const { title } = req.body;
      const response = await fetch(`${supabaseUrl}/rest/v1/conversations?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({ title }),
      });
      const data = await response.json();
      return res.status(200).json(data[0] || data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
