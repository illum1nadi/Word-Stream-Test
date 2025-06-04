export async function fetchGeminiResponse(prompt: string): Promise<string> {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    throw new Error('Failed to fetch response');
  }

  const data = await res.json();
  return data.text;
}
