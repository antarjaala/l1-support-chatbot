export async function askAI(apiKey, systemPrompt, messages, provider = 'groq') {
  const response = await fetch('https://hh-l1-proxy.shivaprasadsk.workers.dev', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'x-provider': provider,
    },
    body: JSON.stringify({
      model: provider === 'anthropic' ? 'claude-3-5-sonnet-20241022' : 'llama-3.3-70b-versatile',
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
  
  if (provider === 'anthropic') {
    return data.content[0].text
  } else {
    return data.choices[0].message.content
  }
}
