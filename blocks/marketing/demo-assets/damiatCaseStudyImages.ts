/**
 * Case study card covers — aerial / satellite-style repo photos, mapped per case.
 */
import agroHoldingCover from '../../../damiat-gpd-case-bg.png';
import belgorodCover from '../../../potato-storage-monitoring-bg.png';
import severpromCover from '../../../agro-tech-storage-bg.png';
import volgaCover from '../../../agro-economic-landscape-bg.png';
import uralsCover from '../../../damiat-hero-main-bg.png';

export interface DamiatCaseStudyImage {
  imageSrc: string;
  imageAlt: string;
  /** Per-card satellite crop anchor. */
  imageObjectPosition?: string;
}

export const damiatCaseStudyImagesById: Record<string, DamiatCaseStudyImage> = {
  'agro-holding': {
    imageSrc: agroHoldingCover,
    imageAlt: 'Спутниковый снимок хранилища — Краснодарский край',
    imageObjectPosition: '55% 42%',
  },
  'belgorod-potato': {
    imageSrc: belgorodCover,
    imageAlt: 'Спутниковый снимок полей и склада — Белгородская область',
    imageObjectPosition: '48% 38%',
  },
  severprom: {
    imageSrc: severpromCover,
    imageAlt: 'Спутниковый снимок агрокластера — Ленинградская область',
    imageObjectPosition: '62% 45%',
  },
  'volga-agro': {
    imageSrc: volgaCover,
    imageAlt: 'Спутниковый снимок агроландшафта — Саратовская область',
    imageObjectPosition: '40% 50%',
  },
  'urals-tubers': {
    imageSrc: uralsCover,
    imageAlt: 'Спутниковый снимок хранилища — Свердловская область',
    imageObjectPosition: '50% 35%',
  },
};

export function damiatCaseStudyImage(id?: string): DamiatCaseStudyImage | undefined {
  if (!id) return undefined;
  return damiatCaseStudyImagesById[id];
}
