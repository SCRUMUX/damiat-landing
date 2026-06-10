import React from 'react';
import type { ImageProps, ImageLayout, ImageRatio, ImageState } from './Image.types';
import { cn, findClasses, IconSlot, type VR } from '../_shared';
import contract from '../../../contracts/components/Image.contract.json';

const rules = (contract.variantRules || []) as unknown as VR[];

/* aspect-ratio по ratio — contract хранит ratioValue, не tailwind-классы */
const RATIO_STYLE: Record<ImageRatio, React.CSSProperties> = {
  '1:1':  { aspectRatio: '1 / 1' },
  '4:3':  { aspectRatio: '4 / 3' },
  '16:9': { aspectRatio: '16 / 9' },
  '3:2':  { aspectRatio: '3 / 2' },
};

const ShimmerOverlay: React.FC = () => (
  <span
    className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]"
    style={{
      background:
        'linear-gradient(90deg, transparent 0%, var(--color-surface-2) 50%, transparent 100%)',
    }}
    aria-hidden="true"
  />
);

const ImagePlaceholderIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="5.5" cy="5.5" r="1.5" fill="currentColor" />
    <path d="M1 11l3.5-3.5L7 10l3-3 5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Image = React.forwardRef<HTMLDivElement, ImageProps>((props, ref) => {
  const {
    layout = 'image',
    size = 'md',
    ratio = '1:1',
    state = 'empty',
    src,
    alt = '',
    errorText = 'Failed to load',
    emptyText = 'No image',
    icon,
    onLoad,
    onError,
    className,
    style,
    ...rest
  } = props;

  const isHero = layout === 'hero-full' || layout === 'hero-half';

  const variantClasses = findClasses(rules, {
    layout,
    ...(layout === 'image' ? { size } : {}),
    state,
  });

  const containerStyle: React.CSSProperties = isHero
    ? {
        width: layout === 'hero-full' ? '100%' : '50%',
        height: '100%',
        minHeight: 'var(--space-480)',
        ...style,
      }
    : {
        ...RATIO_STYLE[ratio],
        ...style,
      };

  const iconNode = icon ?? <ImagePlaceholderIcon />;

  return (
    <div
      ref={ref}
      className={cn(
        'relative overflow-hidden shrink-0',
        ...variantClasses,
        className,
      )}
      style={containerStyle}
      data-hero={isHero ? 'true' : undefined}
      data-shimmer={state === 'loading' ? 'true' : undefined}
      role={state === 'loaded' ? 'img' : undefined}
      aria-label={state === 'loaded' ? alt : undefined}
      {...rest}
    >
      {state === 'loading' && (
        <>
          <span className="absolute inset-0 bg-[var(--color-surface-3)]" aria-hidden="true" />
          <ShimmerOverlay />
          {src && (
            <img
              src={src}
              alt=""
              className="sr-only"
              onLoad={onLoad}
              onError={onError}
              aria-hidden="true"
            />
          )}
          <span className="sr-only">Loading…</span>
        </>
      )}

      {state === 'loaded' && (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      )}

      {(state === 'error' || state === 'empty') && (
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3">
          <IconSlot icon={iconNode} size="16px" />
          <span
            className={cn(
              'text-center select-none text-[var(--label-color,var(--color-text-muted))]',
              state === 'error' ? 'text-style-caption font-medium' : 'text-style-caption-xs',
            )}
          >
            {state === 'error' ? errorText : emptyText}
          </span>
        </span>
      )}
    </div>
  );
});

Image.displayName = 'Image';
