export async function askGemini(apiKey, systemPrompt, messages) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      })),
      generationConfig: {
        maxOutputTokens: 1024,
      },
    }),
  })
  const data = await response.json()
  if (!response.ok || data.error) {
    throw new Error(data.error?.message || 'HTTP ' + response.status)
  }
  return data.candidates[0].content.parts[0].text
}
