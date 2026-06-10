import { imageToDataUrl } from './images.js';

export async function anthropicVisionJsonCompletion<T>(
  systemPrompt: string,
  userText: string,
  imagePaths: string[],
): Promise<T> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is required when SYNAPTIK_VISION_PROVIDER=anthropic');
  }

  const model = process.env.SYNAPTIK_ANTHROPIC_MODEL ?? 'claude-3-5-haiku-20241022';

  const content: Array<{ type: string; text?: string; source?: { type: string; media_type: string; data: string } }> = [
    { type: 'text', text: `${systemPrompt}\n\n${userText}` },
  ];

  for (const p of imagePaths.slice(0, 4)) {
    const dataUrl = await imageToDataUrl(p);
    const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) continue;
    content.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: match[1],
        data: match[2],
      },
    });
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      temperature: 0.2,
      messages: [{ role: 'user', content }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic vision failed (${res.status}): ${err}`);
  }

  const data = (await res.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };
  const text = data.content?.find((c) => c.type === 'text')?.text;
  if (!text) throw new Error('Empty Anthropic vision response');

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Anthropic response did not contain JSON');
  return JSON.parse(jsonMatch[0]) as T;
}
