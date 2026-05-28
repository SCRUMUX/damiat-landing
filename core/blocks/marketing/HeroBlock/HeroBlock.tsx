import React from 'react';
import { SectionShell } from '../../_shared/SectionShell';
import { BlockAction } from '../../_shared/BlockAction';
import { BlockSectionHeader } from '../../_shared/BlockSectionHeader';
import { BlockGrid } from '../../_shared/BlockGrid';
import {
  BLOCK_HERO_ENTERPRISE_MEDIA_WRAP_CLASS,
  BLOCK_HERO_MEDIA_FRAME_CLASS,
  BLOCK_ACTIONS_ROW_CLASS,
  BLOCK_GRID_BASE_CLASS,
  BLOCK_SPLIT_CLASS,
  SOLUTIONS_HERO_DESCRIPTION_CLASS,
  SOLUTIONS_HERO_MEDIA_WRAP_CLASS,
  SOLUTIONS_HERO_PANEL_CLASS,
  SOLUTIONS_HERO_SHELL_CLASS,
  SOLUTIONS_HERO_STAGE_CLASS,
  SOLUTIONS_HERO_TITLE_CLASS,
} from '../../_shared/blockLayout';
import { Badge } from '../../../components/primitives/Badge';
import { cn } from '../../../components/primitives/_shared';
import { ParallaxLayer } from '../../_shared/ParallaxLayer';
import { HeroMetricsBand } from './HeroMetricsBand';
import { HeroBreadcrumb, type HeroBreadcrumbItem } from './HeroBreadcrumb';
import { solutionsPageHeroMedia } from '../solutionsPageHeroMedia';

export interface HeroBlockAction {
  label: string;
  onClick?: () => void;
  href?: string;
}

export interface HeroStat {
  value: string;
  label: string;
}

export type { HeroBreadcrumbItem } from './HeroBreadcrumb';

export interface HeroBlockProps {
  title: string;
  subtitle?: string;
  badge?: string;
  /** Inner-page hero — breadcrumb trail above badge and title. */
  breadcrumbs?: HeroBreadcrumbItem[];
  align?: 'center' | 'left';
  /**
   * `centered` — classic SaaS hero (badge → title → subtitle → CTAs).
   * `split` — two-column hero with media.
   * `enterprise` — Cortel-style B2B hero: split stage + bottom metrics band.
   * `page` — inner page hero: breadcrumbs → badge → title (Cortel case study).
   * `solutions` — Cortel /solutions page: muted panel + breadcrumb + title + description + decorative media.
   */
  variant?: 'centered' | 'split' | 'enterprise' | 'page' | 'solutions';
  /** Full-bleed section background — use `brand` with overlay enterprise navbar. */
  appearance?: 'base' | 'surface' | 'muted' | 'brand' | 'inverse';
  /** Shown in split / enterprise layout (right column on desktop). */
  media?: React.ReactNode;
  stats?: HeroStat[];
  primaryAction?: HeroBlockAction;
  secondaryAction?: HeroBlockAction;
  /** When true (enterprise above-fold), stage fills remaining viewport height. */
  fillViewport?: boolean;
  /** Top rule above enterprise metrics band — default on. */
  metricsShowTopBorder?: boolean;
  /** Enterprise: layered scroll parallax on copy, media, metrics. */
  depthParallax?: boolean;
  /** Overrides when `depthParallax` — e.g. lower values during scroll loop. */
  copyParallaxFactor?: number;
  mediaParallaxFactor?: number;
  metricsParallaxFactor?: number;
  className?: string;
  style?: React.CSSProperties;
}

function HeroActions({
  primaryAction,
  secondaryAction,
  centered,
  onBrand,
  enterprise,
}: {
  primaryAction?: HeroBlockAction;
  secondaryAction?: HeroBlockAction;
  centered?: boolean;
  onBrand?: boolean;
  enterprise?: boolean;
}) {
  if (!primaryAction && !secondaryAction) return null;

  const primaryAppearance = enterprise && onBrand ? 'outline' : 'brand';

  return (
    <div
      className={cn(BLOCK_ACTIONS_ROW_CLASS, centered && 'justify-center')}
      style={{ gap: 'var(--space-section-stack-m)' }}
    >
      {primaryAction ? (
        <BlockAction
          label={primaryAction.label}
          onClick={primaryAction.onClick}
          href={primaryAction.href}
          appearance={primaryAppearance}
          size="lg"
          onBrand={onBrand}
          className={
            enterprise && onBrand
              ? 'transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[var(--color-text-on-brand)] hover:bg-[var(--color-text-on-brand)]/14 hover:shadow-elevation-2 active:translate-y-0'
              : undefined
          }
        />
      ) : null}
      {secondaryAction ? (
        <BlockAction
          label={secondaryAction.label}
          onClick={secondaryAction.onClick}
          href={secondaryAction.href}
          appearance="outline"
          size="lg"
          onBrand={onBrand}
        />
      ) : null}
    </div>
  );
}

function HeroPageLayout({
  title,
  badge,
  breadcrumbs = [],
  onBrand,
}: {
  title: string;
  badge?: string;
  breadcrumbs?: HeroBreadcrumbItem[];
  onBrand: boolean;
}) {
  return (
    <div
      className="flex w-full min-w-0 flex-col items-start text-left"
      style={{ gap: 'var(--space-section-content-m)' }}
    >
      {breadcrumbs.length > 0 ? (
        <HeroBreadcrumb items={breadcrumbs} onBrand={onBrand} />
      ) : null}

      {badge ? (
        <Badge appearance={onBrand ? 'outline' : 'brand'} size="md">
          {badge}
        </Badge>
      ) : null}

      <h1
        className={cn(
          'm-0 max-w-[var(--space-800)] text-style-display font-semibold tracking-tight',
          onBrand ? 'text-inherit' : 'text-[var(--color-text-primary)]',
        )}
      >
        {title}
      </h1>
    </div>
  );
}

function HeroSolutionsLayout({
  title,
  subtitle,
  breadcrumbs = [],
  media = solutionsPageHeroMedia,
}: Pick<HeroBlockProps, 'title' | 'subtitle' | 'breadcrumbs' | 'media'>) {
  return (
    <div className={SOLUTIONS_HERO_SHELL_CLASS}>
      <div className={SOLUTIONS_HERO_STAGE_CLASS}>
        <div className={SOLUTIONS_HERO_PANEL_CLASS}>
          {breadcrumbs.length > 0 ? (
            <HeroBreadcrumb items={breadcrumbs} onBrand={false} separator="dot" />
          ) : null}
          <div className="relative z-[3] min-w-0 min-[1024px]:max-w-[var(--space-584)]">
            <h1 className={SOLUTIONS_HERO_TITLE_CLASS}>{title}</h1>
            {subtitle ? <p className={SOLUTIONS_HERO_DESCRIPTION_CLASS}>{subtitle}</p> : null}
          </div>
        </div>
        {media ? <div className={SOLUTIONS_HERO_MEDIA_WRAP_CLASS}>{media}</div> : null}
      </div>
    </div>
  );
}

function HeroEnterpriseLayout({
  title,
  subtitle,
  badge,
  stats,
  media,
  primaryAction,
  secondaryAction,
  onBrand,
  fillViewport,
  metricsShowTopBorder,
  depthParallax,
  copyParallaxFactor = 0.05,
  mediaParallaxFactor = 0.09,
  metricsParallaxFactor = 0.04,
}: Pick<
  HeroBlockProps,
  | 'title'
  | 'subtitle'
  | 'badge'
  | 'stats'
  | 'media'
  | 'primaryAction'
  | 'secondaryAction'
  | 'fillViewport'
  | 'metricsShowTopBorder'
  | 'depthParallax'
  | 'copyParallaxFactor'
  | 'mediaParallaxFactor'
  | 'metricsParallaxFactor'
> & { onBrand: boolean }) {
  const copyColumn = (
    <>
      {badge ? (
        <Badge appearance={onBrand ? 'outline' : 'brand'} size="md">
          {badge}
        </Badge>
      ) : null}

      <h1
        className={cn(
          'm-0 max-w-[var(--space-640)] text-style-display font-semibold tracking-tight',
          onBrand ? 'text-inherit' : 'text-[var(--color-text-primary)]',
        )}
      >
        {title}
      </h1>

      <HeroActions
        primaryAction={primaryAction}
        secondaryAction={secondaryAction}
        onBrand={onBrand}
        enterprise
      />
    </>
  );

  const mediaColumn = media ? (
    <div className={BLOCK_HERO_ENTERPRISE_MEDIA_WRAP_CLASS}>{media}</div>
  ) : null;

  const metricsBand = (
    <HeroMetricsBand
      stats={stats}
      description={subtitle}
      onBrand={onBrand}
      showTopBorder={metricsShowTopBorder}
      className="pt-[var(--space-section-content-m)]"
    />
  );
  return (
    <div
      className={cn(
        'flex w-full min-w-0 flex-col',
        fillViewport && 'min-h-0 flex-1 justify-between',
      )}
      style={{
        minHeight: fillViewport ? undefined : 'var(--space-360)',
        gap: 'var(--space-section-content-l)',
      }}
    >
      <div className="flex min-h-0 flex-1 flex-col justify-center">
        <div
          className={cn(
            BLOCK_GRID_BASE_CLASS,
            media
              ? 'grid-cols-1 min-[1024px]:grid-cols-2 min-[1024px]:items-center'
              : 'grid-cols-1',
          )}
        >
          {depthParallax ? (
            <ParallaxLayer
              factor={copyParallaxFactor}
              className="flex w-full min-w-0 flex-col items-start justify-center text-left"
              style={{ gap: 'var(--space-section-content-l)' }}
            >
              {copyColumn}
            </ParallaxLayer>
          ) : (
            <div
              className="flex w-full min-w-0 flex-col items-start justify-center text-left"
              style={{ gap: 'var(--space-section-content-l)' }}
            >
              {copyColumn}
            </div>
          )}

          {mediaColumn
            ? depthParallax
              ? (
                  <ParallaxLayer factor={mediaParallaxFactor}>{mediaColumn}</ParallaxLayer>
                )
              : mediaColumn
            : null}
        </div>
      </div>

      {depthParallax ? (
        <ParallaxLayer factor={metricsParallaxFactor}>{metricsBand}</ParallaxLayer>
      ) : (
        metricsBand
      )}
    </div>
  );
}

export const HeroBlock: React.FC<HeroBlockProps> = ({
  title,
  subtitle,
  badge,
  breadcrumbs,
  align = 'center',
  variant = 'centered',
  appearance = 'base',
  media,
  stats,
  primaryAction,
  secondaryAction,
  fillViewport = false,
  metricsShowTopBorder = true,
  depthParallax = false,
  copyParallaxFactor,
  mediaParallaxFactor,
  metricsParallaxFactor,
  className,
  style,
}) => {
  const page = variant === 'page';
  const solutions = variant === 'solutions';
  const enterprise = variant === 'enterprise';
  const centered = !enterprise && !page && !solutions && variant === 'centered' && align === 'center';
  const split = variant === 'split';
  const resolvedAppearance = page && appearance === 'base' ? 'brand' : appearance;
  const onBrandResolved = resolvedAppearance === 'brand';
  const heroRecipe = page ? 'section.hero.page' : solutions ? 'section.hero.page' : 'section.hero';

  const actions = (
    <HeroActions
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
      centered={centered}
      onBrand={onBrandResolved}
    />
  );

  const statsRow = stats && stats.length > 0 && !enterprise && !page && !solutions && (
    <BlockGrid columns={Math.min(stats.length, 4) as 1 | 2 | 3 | 4}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={cn('flex flex-col', centered && 'items-center text-center')}
          style={{ gap: 'var(--space-section-stack-s)' }}
        >
          <span
            className={cn(
              'text-style-h2 font-semibold tabular-nums',
              onBrandResolved ? 'text-inherit' : 'text-[var(--color-text-primary)]',
            )}
          >
            {stat.value}
          </span>
          <span
            className={cn(
              'text-style-body-sm',
              onBrandResolved ? 'text-inherit opacity-90' : 'text-[var(--color-text-secondary)]',
            )}
          >
            {stat.label}
          </span>
        </div>
      ))}
    </BlockGrid>
  );

  const copy = solutions ? (
    <HeroSolutionsLayout title={title} subtitle={subtitle} breadcrumbs={breadcrumbs} media={media} />
  ) : page ? (
    <HeroPageLayout
      title={title}
      badge={badge}
      breadcrumbs={breadcrumbs}
      onBrand={onBrandResolved}
    />
  ) : enterprise ? (
    <HeroEnterpriseLayout
      title={title}
      subtitle={subtitle}
      badge={badge}
      stats={stats}
      media={media}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
      onBrand={onBrandResolved}
      fillViewport={fillViewport}
      metricsShowTopBorder={metricsShowTopBorder}
      depthParallax={depthParallax}
      copyParallaxFactor={copyParallaxFactor}
      mediaParallaxFactor={mediaParallaxFactor}
      metricsParallaxFactor={metricsParallaxFactor}
    />
  ) : (
    <div
      className={cn(
        'flex w-full min-w-0 flex-col',
        centered ? 'items-center text-center' : 'items-start text-left',
      )}
      style={{ gap: 'var(--space-section-content-m)' }}
    >
      {badge && !split ? (
        <Badge appearance={onBrandResolved ? 'outline' : 'brand'} size="md">
          {badge}
        </Badge>
      ) : null}
      <BlockSectionHeader
        eyebrow={split ? badge : undefined}
        title={title}
        subtitle={subtitle}
        align={centered ? 'center' : 'left'}
        titleScale="display"
        onBrand={onBrandResolved}
      />
      {actions}
      {statsRow}
    </div>
  );

  const solutionsShellStyle: React.CSSProperties | undefined = solutions
    ? {
        paddingTop: 'var(--solutions-hero-pt)',
        paddingBottom: 'var(--solutions-hero-pb)',
      }
    : undefined;

  return (
    <SectionShell
      recipe={heroRecipe}
      appearance={solutions ? 'base' : resolvedAppearance}
      parallax={onBrandResolved && page ? 'hero' : false}
      growContent={enterprise && fillViewport}
      className={cn(
        enterprise && '!bg-transparent',
        enterprise && fillViewport && 'flex min-h-0 flex-1 flex-col',
        solutions &&
          'overflow-visible [--solutions-hero-pt:var(--space-32)] [--solutions-hero-pb:var(--space-32)] min-[1024px]:[--solutions-hero-pt:var(--space-48)] min-[1024px]:[--solutions-hero-pb:var(--space-80)]',
        className,
      )}
      style={{ ...solutionsShellStyle, ...style }}
      aria-label="Hero"
      bleedMedia={!split && !enterprise && !page && !solutions && media ? media : undefined}
    >
      {split ? (
        <div className={BLOCK_SPLIT_CLASS}>
          {copy}
          {media ? (
            <div className={BLOCK_HERO_MEDIA_FRAME_CLASS}>
              {media}
            </div>
          ) : null}
        </div>
      ) : (
        <div className={cn(enterprise && fillViewport && 'flex min-h-0 flex-1 flex-col')}>{copy}</div>
      )}
    </SectionShell>
  );
};

HeroBlock.displayName = 'HeroBlock';
