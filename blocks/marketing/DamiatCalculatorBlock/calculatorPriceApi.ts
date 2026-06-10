import type { CalculatorCropData } from './calculatorCropsData';
import { POTATO_CROP } from './calculatorCropsData';

/** Ответ API прогноза оптовых цен (₽/т, 12 месяцев: сент → август). */
export interface PotatoPriceApiResponse {
  forecast: number[];
  past?: number[];
}

const STORAGE_MONTHS = 12;

function isValidPriceSeries(values: unknown): values is number[] {
  return (
    Array.isArray(values) &&
    values.length === STORAGE_MONTHS &&
    values.every((v) => typeof v === 'number' && Number.isFinite(v) && v > 0)
  );
}

/** Встроенный mock — fallback при ошибке сети или невалидном ответе. */
export function getMockPotatoCrop(): CalculatorCropData {
  return POTATO_CROP;
}

/**
 * Загружает прогноз цен с API. При ошибке возвращает mock из `calculatorCropsData`.
 *
 * Env (Vite consumer): `VITE_DAMIAT_PRICE_API_URL`
 * Props: `DamiatCalculatorBlock.priceApiUrl`
 */
export async function fetchPotatoCropWithPrices(
  apiUrl?: string,
): Promise<{ crop: CalculatorCropData; source: 'api' | 'mock' }> {
  const url = apiUrl?.trim();

  if (!url) {
    return { crop: getMockPotatoCrop(), source: 'mock' };
  }

  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = (await res.json()) as PotatoPriceApiResponse;
    if (!isValidPriceSeries(data.forecast)) throw new Error('Invalid forecast series');

    const past = isValidPriceSeries(data.past) ? data.past : POTATO_CROP.priceStoragePast;

    return {
      crop: {
        ...POTATO_CROP,
        priceStorageForecast: data.forecast,
        priceStoragePast: past ?? POTATO_CROP.priceStoragePast,
      },
      source: 'api',
    };
  } catch {
    return { crop: getMockPotatoCrop(), source: 'mock' };
  }
}
