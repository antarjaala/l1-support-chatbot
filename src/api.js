const WORKER_URL = 'https://hh-l1-proxy.shivaprasadsk.workers.dev'

export async function askGroq(apiKey, systemPrompt, messages) {
  const response = await fetch(WORKER_URL, {
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
