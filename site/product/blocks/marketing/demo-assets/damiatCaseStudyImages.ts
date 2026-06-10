/**
 * Case study card covers — SVG placeholders when repo PNGs are absent.
 */
import {
  damiatHeroCasePlaceholder,
  damiatHeroCtaPlaceholder,
  damiatHeroMainPlaceholder,
  damiatHeroPlatformPlaceholder,
  damiatHeroScenariosPlaceholder,
} from './damiatDemoPlaceholders';

export interface DamiatCaseStudyImage {
  imageSrc: string;
  imageAlt: string;
  imageObjectPosition?: string;
}

export const damiatCaseStudyImagesById: Record<string, DamiatCaseStudyImage> = {
  'agro-holding': {
    imageSrc: damiatHeroCasePlaceholder,
    imageAlt: 'Спутниковый снимок хранилища — Краснодарский край',
    imageObjectPosition: '55% 42%',
  },
  'belgorod-potato': {
    imageSrc: damiatHeroPlatformPlaceholder,
    imageAlt: 'Спутниковый снимок полей и склада — Белгородская область',
    imageObjectPosition: '48% 38%',
  },
  severprom: {
    imageSrc: damiatHeroCtaPlaceholder,
    imageAlt: 'Спутниковый снимок агрокластера — Ленинградская область',
    imageObjectPosition: '62% 45%',
  },
  'volga-agro': {
    imageSrc: damiatHeroScenariosPlaceholder,
    imageAlt: 'Спутниковый снимок агроландшафта — Саратовская область',
    imageObjectPosition: '40% 50%',
  },
  'urals-tubers': {
    imageSrc: damiatHeroMainPlaceholder,
    imageAlt: 'Спутниковый снимок хранилища — Свердловская область',
    imageObjectPosition: '50% 35%',
  },
};

export function damiatCaseStudyImage(id?: string): DamiatCaseStudyImage | undefined {
  if (!id) return undefined;
  return damiatCaseStudyImagesById[id];
}
