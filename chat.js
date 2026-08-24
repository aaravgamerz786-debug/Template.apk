export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const key = process.env.GROQ_API_KEY;
  if (!key) return res.status(500).json({ error: 'API key not configured' });
  
  try {
    const { messages, temperature, max_tokens } = req.body;
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages,
        temperature: temperature || 0.7,
        max_tokens: max_tokens || 600
      })
    });
    if (!r.ok) return res.status(r.status).json({ error: await r.text() });
    return res.status(200).json(await r.json());
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
