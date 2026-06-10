import { imageToDataUrl } from './images.js';

export async function openaiVisionJsonCompletion<T>(
  systemPrompt: string,
  userText: string,
  imagePaths: string[],
): Promise<T> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is required when SYNAPTIK_VISION_PROVIDER=openai');

  const model = process.env.SYNAPTIK_VISION_MODEL ?? 'gpt-4o-mini';
  const baseUrl = (process.env.OPENAI_BASE_URL ?? 'https://api.openai.com/v1').replace(/\/$/, '');
  const images = await Promise.all(
    imagePaths.slice(0, 4).map(async (p) => ({
      type: 'image_url' as const,
      image_url: { url: await imageToDataUrl(p) },
    })),
  );

  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  if (baseUrl.includes('openrouter.ai')) {
    headers['HTTP-Referer'] = process.env.OPENROUTER_HTTP_REFERER ?? 'https://github.com/SCRUMUX/AICADS-PRO';
    headers['X-Title'] = process.env.OPENROUTER_APP_TITLE ?? 'Synaptik Icon Builder';
  }

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: [{ type: 'text', text: userText }, ...images] },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI vision failed (${res.status}): ${err}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty OpenAI vision response');
  return JSON.parse(content) as T;
}
