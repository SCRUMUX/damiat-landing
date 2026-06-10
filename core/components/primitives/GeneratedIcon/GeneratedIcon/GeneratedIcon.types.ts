import type React from 'react';

export interface GeneratedIconMeta {
  name: string;
  category?: string;
  iconSlug?: string;
  projectSlug?: string;
  sourceCard?: string;
}

/** Entry shape from Synaptik `icons.manifest.ts` (`iconsBySlug`). */
export interface GeneratedIconManifestEntry {
  png: string;
  webp: string;
  meta: GeneratedIconMeta;
}

export interface GeneratedIconProps extends Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'width' | 'height' | 'alt'
> {
  /** Raster URL (prefer `webp` from manifest). */
  src: string;
  alt: string;
  /** Square edge length in px. Default 48. */
  size?: number;
  /** When true, use WebP if `webpSrc` is set. */
  preferWebp?: boolean;
  webpSrc?: string;
  className?: string;
}
