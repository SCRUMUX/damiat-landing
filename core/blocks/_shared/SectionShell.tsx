import React from 'react';
import { cn } from '../../components/primitives/_shared';
import { mergeRefs } from '../../hooks/mergeRefs';
import { useParallaxOffset } from '../../hooks/useParallaxOffset';
import { resolveRecipe, type SpacingRecipeId } from '../../recipes/spacing-recipes';
import { BLOCK_CONTENT_CLASS } from './blockLayout';
import { ParallaxBrandScene, type ParallaxBrandSceneVariant } from './ParallaxBrandScene';

export type SectionAppearance = 'base' | 'surface' | 'muted' | 'brand' | 'inverse';

export interface SectionShellProps extends React.HTMLAttributes<HTMLElement> {
  /** Named spacing recipe — enforces vertical rhythm across blocks. */
  recipe: SpacingRecipeId;
  as?: 'section' | 'div' | 'footer' | 'header' | 'nav';
  /** Full-bleed background treatment on the outer section. */
  appearance?: SectionAppearance;
  /** Cortel-style scroll parallax on brand sections. */
  parallax?: ParallaxBrandSceneVariant | false;
  /** Optional media/background slot rendered edge-to-edge above the content column. */
  bleedMedia?: React.ReactNode;
  /** Optional absolute overlay above parallax layers, below content (brand gradients). */
  overlay?: React.ReactNode;
  /** Extra classes on the inner content column (e.g. flex-1 for viewport-fill hero). */
  contentClassName?: string;
  /** Stretch content column to fill a flex parent (viewport-fill hero). */
  growContent?: boolean;
  children: React.ReactNode;
}

const APPEARANCE_CLASS: Record<SectionAppearance, string> = {
  base: 'bg-[var(--color-bg-base)] text-[var(--color-text-primary)]',
  surface: 'bg-[var(--color-surface-1)] text-[var(--color-text-primary)]',
  muted: 'bg-[var(--color-surface-2)] text-[var(--color-text-primary)]',
  brand: 'bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)]',
  inverse: 'bg-[var(--color-text-primary)] text-[var(--color-bg-base)]',
};

/**
 * Full-bleed section background + unified content column for marketing blocks.
 * Background spans the viewport; content uses `--grid-*-offset` on every section.
 */
export const SectionShell = React.forwardRef<HTMLElement, SectionShellProps>(
  (
    {
      recipe,
      as: Tag = 'section',
      appearance = 'base',
      parallax = false,
      bleedMedia,
      overlay,
      contentClassName,
      growContent = false,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    const resolved = resolveRecipe(recipe);
    const parallaxFactor = parallax === 'hero' ? 0.1 : 0.12;
    const parallaxRef = useParallaxOffset(parallaxFactor, Boolean(parallax));
    const mergedRef = parallax ? mergeRefs(ref, parallaxRef) : ref;

    return (
      <Tag
        ref={mergedRef as React.Ref<HTMLDivElement>}
        className={cn(
          'w-full',
          APPEARANCE_CLASS[appearance],
          parallax && 'relative overflow-hidden',
          className,
        )}
        style={{
          ...resolved.style,
          ...style,
        }}
        {...rest}
      >
        {parallax ? <ParallaxBrandScene variant={parallax} /> : null}
        {overlay ? (
          <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">{overlay}</div>
        ) : null}
        {bleedMedia ? <div className="w-full">{bleedMedia}</div> : null}
        <div
          className={cn(
            BLOCK_CONTENT_CLASS,
            parallax && 'relative z-20',
            growContent && 'flex min-h-0 flex-1 flex-col',
            contentClassName,
          )}
        >
          <div
            className={cn('flex min-h-0 w-full min-w-0 flex-col', growContent && 'flex-1')}
            style={resolved.innerStyle}
          >
            {children}
          </div>
        </div>
      </Tag>
    );
  },
);

SectionShell.displayName = 'SectionShell';
