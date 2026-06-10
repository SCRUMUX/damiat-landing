import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '../api/client.js';

interface StorybookUrlResponse {
  url: string;
  path: string;
  origin: string;
}

export function useStorybookUrl(projectSlug: string) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const slug = projectSlug.trim();
      const q = slug ? `?projectSlug=${encodeURIComponent(slug)}` : '';
      const data = await apiFetch<StorybookUrlResponse>(`/storybook-url${q}`);
      setUrl(data.url);
    } catch {
      setUrl('');
    } finally {
      setLoading(false);
    }
  }, [projectSlug]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { url, loading, refresh };
}
