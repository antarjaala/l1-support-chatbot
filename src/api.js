const WORKER_URL = 'https://hh-l1-proxy.shivaprasadsk.workers.dev'

export async function askAI(apiKey, systemPrompt, messages, provider = 'groq') {
  const isAnthropic = provider === 'anthropic'

  const body = isAnthropic
    ? {
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages
          .filter(m => m.role !== 'system')
          .map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
      }
    : {
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1024,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
            .filter(m => m.role !== 'system')
            .map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
        ],
      }

  const response = await fetch(WORKER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'x-provider': isAnthropic ? 'anthropic' : 'groq',
    },
    body: JSON.stringify(body),
  })

  const data = await response.json()

  if (!response.ok || data.error) {
    const msg = data.error?.message || 'HTTP ' + response.status
    if (response.status === 401 || msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('auth')) {
      throw new Error('AUTH_ERROR: ' + msg)
    }
    throw new Error(msg)
  }

  return isAnthropic
    ? data.content?.[0]?.text
    : data.choices?.[0]?.message?.content
}
