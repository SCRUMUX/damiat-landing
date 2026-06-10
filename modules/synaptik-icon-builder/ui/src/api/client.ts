import { mapApiError, t } from '../i18n/ru.js';

export type ApiError = Error & {
  status?: number;
  errorCode?: string;
  existingSessionId?: string;
  isNotJson?: boolean;
};

export interface HealthResponse {
  ok: boolean;
  features?: { sessions?: boolean; sessionState?: boolean };
}

async function readBodyText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return '';
  }
}

export function parseJsonBody<T>(text: string, res: Response): T {
  const trimmed = text.trim();
  if (trimmed.startsWith('<') || trimmed.startsWith('<!')) {
    const err = new Error(t.apiNotJson) as ApiError;
    err.status = res.status;
    err.isNotJson = true;
    throw err;
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    const err = new Error(t.apiNotJson) as ApiError;
    err.status = res.status;
    err.isNotJson = true;
    throw err;
  }
}

function healthMessageForStatus(status: number): string {
  if (status === 404) return t.sessionsApiOutdated;
  if (status >= 500) return t.apiServerError(status);
  return t.apiHealthFailed(status);
}

/** Turn proxy/generic English errors into Russian hints. */
export function humanizeApiMessage(message: string, status?: number): string {
  const m = message.trim();
  if (!m || m === 'Internal Server Error' || m === 'Failed to fetch') {
    return t.apiConnectionFailed;
  }
  if (status && status >= 500 && m.length < 40) {
    return t.apiServerError(status);
  }
  return mapApiError(m);
}

export async function apiFetch<T>(
  path: string,
  body?: Record<string, unknown>,
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      method: body ? 'POST' : 'GET',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    const err = new Error(t.apiConnectionFailed) as ApiError;
    throw err;
  }

  const text = await readBodyText(res);
  const data = text
    ? parseJsonBody<
        T & { error?: string; errorCode?: string; existingSessionId?: string }
      >(text, res)
    : ({} as T & { error?: string; errorCode?: string; existingSessionId?: string });

  if (!res.ok) {
    const raw = (data as { error?: string }).error ?? res.statusText;
    const err = new Error(humanizeApiMessage(raw, res.status)) as ApiError;
    err.status = res.status;
    err.errorCode = (data as { errorCode?: string }).errorCode;
    err.existingSessionId = (data as { existingSessionId?: string }).existingSessionId;
    throw err;
  }

  return data;
}

export async function apiDelete<T>(
  path: string,
  body?: Record<string, unknown>,
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      method: 'DELETE',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    const err = new Error(t.apiConnectionFailed) as ApiError;
    throw err;
  }

  const text = await readBodyText(res);
  const data = text
    ? parseJsonBody<T & { error?: string }>(text, res)
    : ({} as T & { error?: string });

  if (!res.ok) {
    const raw = (data as { error?: string }).error ?? res.statusText;
    const err = new Error(humanizeApiMessage(raw, res.status)) as ApiError;
    err.status = res.status;
    throw err;
  }

  return data;
}

export async function checkApiHealth(): Promise<{
  ok: boolean;
  outdated: boolean;
  message?: string;
}> {
  try {
    const res = await fetch('/api/health');
    const text = await readBodyText(res);
    if (!res.ok) {
      const outdated = res.status === 404;
      return {
        ok: false,
        outdated,
        message: outdated ? t.sessionsApiOutdated : healthMessageForStatus(res.status),
      };
    }
    const data = parseJsonBody<HealthResponse>(text, res);
    if (!data.features?.sessions) {
      return { ok: false, outdated: true, message: t.sessionsApiOutdated };
    }
    return { ok: true, outdated: false };
  } catch (e) {
    if (e instanceof TypeError) {
      return { ok: false, outdated: false, message: t.apiConnectionFailed };
    }
    if ((e as ApiError).isNotJson) {
      return { ok: false, outdated: true, message: t.sessionsApiOutdated };
    }
    return { ok: false, outdated: false, message: t.apiConnectionFailed };
  }
}
