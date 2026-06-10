import { useEffect, useState } from 'react';
import type { CalculatorCropData } from './calculatorCropsData';
import { getMockPotatoCrop, fetchPotatoCropWithPrices } from './calculatorPriceApi';

export interface UseCalculatorCropDataResult {
  crop: CalculatorCropData;
  source: 'api' | 'mock' | 'loading';
}

/** Загружает crop-данные: API цен с fallback на встроенный mock. */
export function useCalculatorCropData(priceApiUrl?: string): UseCalculatorCropDataResult {
  const [crop, setCrop] = useState<CalculatorCropData>(getMockPotatoCrop());
  const [source, setSource] = useState<'api' | 'mock' | 'loading'>('loading');

  useEffect(() => {
    let cancelled = false;

    fetchPotatoCropWithPrices(priceApiUrl).then((result) => {
      if (cancelled) return;
      setCrop(result.crop);
      setSource(result.source);
    });

    return () => {
      cancelled = true;
    };
  }, [priceApiUrl]);

  return { crop, source };
}
