import React from 'react';
import type { GeneratedIconProps } from './GeneratedIcon.types';
import { cn } from '../_shared';

/**
 * Synaptik raster icon (PNG/WebP). Not for UI chrome — use `@ai-ds/core/icons` SVG.
 * Pass `src` / `webpSrc` from `icons.manifest.ts` after `synaptik publish`.
 */
export const GeneratedIcon = React.forwardRef<HTMLImageElement, GeneratedIconProps>(
  (
    {
      src,
      webpSrc,
      alt,
      size = 48,
      preferWebp = true,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const resolvedSrc = preferWebp && webpSrc?.trim() ? webpSrc : src;
    return (
      <img
        ref={ref}
        src={resolvedSrc}
        alt={alt}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className={cn('object-contain shrink-0', className)}
        style={{
          width: size,
          height: size,
          ...style,
        }}
        {...rest}
      />
    );
  },
);

GeneratedIcon.displayName = 'GeneratedIcon';
