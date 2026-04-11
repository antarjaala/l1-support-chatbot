export async function askAI(apiKey, systemPrompt, messages, provider = 'groq') {
  if (provider === 'anthropic') {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.map(msg => ({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content
        })),
      }),
    })
    const data = await response.json()
    if (!response.ok || data.error) {
      throw new Error(data.error?.message || 'HTTP ' + response.status)
    }
    return data.content[0].text
  } else {
    // Groq via worker
    const response = await fetch('https://hh-l1-proxy.shivaprasadsk.workers.dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1024,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
      }),
    })
    const data = await response.json()
    if (!response.ok || data.error) {
      throw new Error(data.error?.message || 'HTTP ' + response.status)
    }
    return data.choices[0].message.content
  }
}
