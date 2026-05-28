import React from 'react';
import { cn } from '../../components/primitives/_shared';

export type ParallaxBrandSceneVariant = 'hero' | 'section';

export interface ParallaxBrandSceneProps {
  variant?: ParallaxBrandSceneVariant;
  className?: string;
}

function ParallaxCubePrimary({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'h-[var(--space-160)] w-[var(--space-160)] opacity-80 min-[1024px]:h-[var(--space-360)] min-[1024px]:w-[var(--space-360)]',
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 200" fill="none" className="h-full w-full">
        <path d="M40 120L100 40L160 120L100 200Z" fill="var(--color-brand-hover)" opacity="0.72" />
        <path d="M100 40L160 120V160L100 200L40 160V120Z" fill="var(--color-brand-primary)" opacity="0.58" />
        <path d="M100 40L160 120H40Z" fill="var(--color-brand-muted)" opacity="0.82" />
      </svg>
    </div>
  );
}

function ParallaxCubeSecondary({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'h-[var(--space-120)] w-[var(--space-120)] opacity-75 min-[1024px]:h-[var(--space-280)] min-[1024px]:w-[var(--space-280)]',
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 200" fill="none" className="h-full w-full">
        <rect x="36" y="56" width="128" height="128" rx="24" fill="var(--color-brand-hover)" opacity="0.58" />
        <rect x="56" y="36" width="128" height="128" rx="24" fill="var(--color-brand-primary)" opacity="0.72" />
      </svg>
    </div>
  );
}

/** Decorative brand parallax layers — cubes + blur orb (cortel.cloud reference). */
export const ParallaxBrandScene: React.FC<ParallaxBrandSceneProps> = ({
  variant = 'section',
  className,
}) => (
  <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden="true">
    <div
      className={cn(
        'absolute z-0 rotate-45 blur-[120px] filter min-[1024px]:blur-[460px]',
        'h-[var(--space-480)] w-[var(--space-480)] min-[1024px]:h-[var(--space-800)] min-[1024px]:w-[var(--space-800)]',
        'right-[-30%] top-[-35%] min-[1024px]:right-[-50%] min-[1024px]:top-[-50%]',
        'bg-[color-mix(in_srgb,var(--color-brand-hover)_82%,white)]',
      )}
    />

    {variant === 'hero' ? (
      <div
        className={cn(
          'absolute z-[1] h-[var(--space-280)] w-full min-[1024px]:h-[var(--space-480)]',
          'left-[10%] top-[-10%] min-[1024px]:left-[40%] min-[1024px]:top-[-60px]',
          'max-w-[var(--space-480)] min-[1024px]:max-w-[var(--space-640)]',
          'will-change-transform transition-transform duration-100 ease-linear',
        )}
        style={{ transform: 'translateY(calc(var(--parallax-offset, 0px) - 100px))' }}
      >
        <div
          className="h-full w-full opacity-40"
          style={{
            background:
              'linear-gradient(135deg, color-mix(in srgb, white 48%, transparent), transparent 55%)',
            clipPath: 'polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)',
          }}
        />
      </div>
    ) : null}

    <div
      className={cn(
        'absolute z-[1] max-w-[var(--space-160)] min-[1024px]:max-w-[var(--space-480)]',
        'right-[-80px] top-[-10%] min-[1024px]:right-[-270px] min-[1024px]:top-[-50%]',
        'will-change-transform transition-transform duration-100 ease-linear',
      )}
      style={{ transform: 'translateY(var(--parallax-offset, 0px))' }}
    >
      <ParallaxCubePrimary />
    </div>

    <div
      className={cn(
        'absolute z-[1] max-w-[var(--space-160)] min-[1024px]:max-w-[var(--space-460)]',
        'bottom-[10%] left-[-80px] min-[1024px]:bottom-[-40%] min-[1024px]:left-0',
        'will-change-transform transition-transform duration-100 ease-linear',
      )}
      style={{ transform: 'translateY(calc(var(--parallax-offset, 0px) * -1))' }}
    >
      <ParallaxCubeSecondary />
    </div>
  </div>
);

ParallaxBrandScene.displayName = 'ParallaxBrandScene';
