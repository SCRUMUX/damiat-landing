import { damiatHeroMainPlaceholder } from './damiatDemoPlaceholders';

const TRUST_IMAGES: Record<string, string> = {
  exhibitions: damiatHeroMainPlaceholder,
  skolkovo: damiatHeroMainPlaceholder,
  pilots: damiatHeroMainPlaceholder,
};

export function trustDemoImage(id: string): string | undefined {
  return TRUST_IMAGES[id];
}
