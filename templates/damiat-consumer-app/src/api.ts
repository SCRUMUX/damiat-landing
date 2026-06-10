/** Stub API routes — замените на реальный backend. */

const API_BASE = import.meta.env.VITE_DAMIAT_API_BASE ?? '/api';

export function getPriceApiUrl(): string | undefined {
  const url = import.meta.env.VITE_DAMIAT_PRICE_API_URL;
  return typeof url === 'string' && url.trim() ? url.trim() : `${API_BASE}/prices/potato`;
}

export function getContactApiUrl(): string {
  return `${API_BASE}/contact`;
}
