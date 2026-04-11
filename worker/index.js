export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, x-api-key, x-provider',
        },
      })
    }
    const apiKey = request.headers.get('x-api-key')
    const provider = request.headers.get('x-provider') || 'groq'
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing API key' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }
    const body = await request.json()
    const isAnthropic = provider === 'anthropic'
    const apiUrl = isAnthropic
      ? 'https://api.anthropic.com/v1/messages'
      : 'https://api.groq.com/openai/v1/chat/completions'
    const headers = isAnthropic
      ? { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' }
      : { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey }
    const res = await fetch(apiUrl, { method: 'POST', headers, body: JSON.stringify(body) })
    const data = await res.json()
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  },
}
