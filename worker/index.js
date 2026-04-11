export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, x-api-key, x-provider' } })
    }
    const apiKey = request.headers.get('x-api-key')
    const provider = request.headers.get('x-provider') || 'groq'
    if (!apiKey) return new Response(JSON.stringify({ error: 'Missing API key' }), { status: 401, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } })
    const body = await request.json()
    
    let apiRes
    if (provider === 'anthropic') {
      apiRes = await fetch('https://api.anthropic.com/v1/messages', { 
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json', 
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        }, 
        body: JSON.stringify(body)
      })
    } else {
      const groqMessages = []
      if (body.system) {
        groqMessages.push({ role: 'system', content: body.system })
      }
      groqMessages.push(...(body.messages || []))
      
      apiRes = await fetch('https://api.groq.com/openai/v1/chat/completions', { 
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': 'Bearer ' + apiKey 
        }, 
        body: JSON.stringify({
          model: body.model || 'llama-3.3-70b-versatile',
          max_tokens: body.max_tokens || 1024,
          messages: groqMessages
        })
      })
    }
    
    const data = await apiRes.json()
    return new Response(JSON.stringify(data), { status: apiRes.status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } })
  },
}
