export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, x-api-key' } })
    }
    const apiKey = request.headers.get('x-api-key')
    if (!apiKey) return new Response(JSON.stringify({ error: 'Missing API key' }), { status: 401, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } })
    const body = await request.json()
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey }, body: JSON.stringify(body) })
    const data = await groqRes.json()
    return new Response(JSON.stringify(data), { status: groqRes.status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } })
  },
}
