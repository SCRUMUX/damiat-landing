import React from 'react';
import { SectionShell } from '../../_shared/SectionShell';
import {
  BLOCK_SUPPORT_MOBILE_HERO_SHELL_CLASS,
  SUPPORT_CONTACTS_STACK_CLASS,
  SUPPORT_DESKTOP_ROW_CLASS,
  SUPPORT_HEADER_SPLIT_CLASS,
  SUPPORT_SIDE_STATS_CLASS,
} from '../../_shared/blockLayout';
import { cn } from '../../../components/primitives/_shared';
import { SupportContactRow } from './SupportContactRow';
import { SupportStatCard } from './SupportStatCard';
import type { SupportBlockProps } from './SupportBlock.types';

export type {
  SupportBlockProps,
  SupportStatItem,
  SupportContactItem,
} from './SupportBlock.types';

function SupportTitle({
  titleLine1,
  titleLine2,
  titleAccent,
}: Pick<SupportBlockProps, 'titleLine1' | 'titleLine2' | 'titleAccent'>) {
  return (
    <h2 className="m-0 font-medium text-style-h1 text-[var(--color-text-primary)]">
      {titleLine1 ? (
        <>
          {titleLine1}
          <br />
        </>
      ) : null}
      {titleLine2 ? `${titleLine2} ` : null}
      {titleAccent ? (
        <span className="text-[var(--color-brand-primary)]">{titleAccent}</span>
      ) : null}
    </h2>
  );
}

function SupportMobileStats({
  stats,
  mobileImageSrc,
  mobileImageAlt,
  mobileCover,
}: Pick<
  SupportBlockProps,
  'stats' | 'mobileImageSrc' | 'mobileImageAlt' | 'mobileCover'
>) {
  const heroImage = mobileImageSrc ?? stats[0]?.imageSrc;
  const heroCover = mobileCover ?? stats[0]?.cover;

  return (
    <div className={BLOCK_SUPPORT_MOBILE_HERO_SHELL_CLASS}>
      {heroImage ? (
        <img src={heroImage} alt={mobileImageAlt ?? stats[0]?.imageAlt ?? ''} className="absolute inset-0 z-0 h-full w-full object-cover" />
      ) : null}
      {heroCover ? <div className="absolute inset-0 z-0">{heroCover}</div> : null}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[var(--color-brand-primary)]/20 via-[var(--color-brand-primary)]/75 to-[var(--color-brand-hover)]/90"
        aria-hidden="true"
      />
      <div className="relative z-[2] flex flex-col gap-[var(--space-section-content-l)] text-[var(--color-text-on-brand)]">
        {stats.map((stat) => (
          <div key={stat.id ?? stat.value}>
            <p className="m-0 font-medium text-style-h1">{stat.value}</p>
            <p className="m-0 mt-[var(--space-section-stack-s)] text-style-body-sm opacity-90">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export const SupportBlock: React.FC<SupportBlockProps> = ({
  titleLine1 = 'В каждой интеграции,',
  titleLine2 = 'поддержка',
  titleAccent = 'всегда на связи',
  description,
  stats,
  mobileImageSrc,
  mobileImageAlt,
  mobileCover,
  contacts,
  className,
}) => {
  if (stats.length === 0) return null;

  const [featuredStat, ...sideStats] = stats;
  const resolvedSideStats = sideStats.length >= 2 ? sideStats.slice(0, 2) : sideStats;

  return (
    <SectionShell recipe="section.support" className={className} aria-label="Support">
      <div className={SUPPORT_HEADER_SPLIT_CLASS}>
        <SupportTitle titleLine1={titleLine1} titleLine2={titleLine2} titleAccent={titleAccent} />
        <p className="m-0 max-w-[var(--space-600)] text-style-body text-[var(--color-text-secondary)] min-[1024px]:text-style-body-lg">
          {description}
        </p>
      </div>

      <div className="min-[1024px]:hidden">
        <SupportMobileStats
          stats={stats}
          mobileImageSrc={mobileImageSrc}
          mobileImageAlt={mobileImageAlt}
          mobileCover={mobileCover}
        />
        {contacts.length > 0 ? (
          <div className={cn(SUPPORT_CONTACTS_STACK_CLASS, 'mt-[var(--space-section-stack-s)]')}>
            {contacts.map((contact) => (
              <SupportContactRow key={contact.id ?? contact.label} {...contact} />
            ))}
          </div>
        ) : null}
      </div>

      <div className={cn(SUPPORT_DESKTOP_ROW_CLASS, 'hidden min-[1024px]:flex')}>
        <div className="flex min-w-[var(--space-460)] flex-1 flex-col">
          {featuredStat ? <SupportStatCard {...featuredStat} compact /> : null}
          {contacts.length > 0 ? (
            <div className={cn(SUPPORT_CONTACTS_STACK_CLASS, 'mt-[var(--space-section-content-m)]')}>
              {contacts.map((contact) => (
                <SupportContactRow key={contact.id ?? contact.label} {...contact} />
              ))}
            </div>
          ) : null}
        </div>

        {resolvedSideStats.length > 0 ? (
          <div className={SUPPORT_SIDE_STATS_CLASS}>
            {resolvedSideStats.map((stat) => (
              <SupportStatCard key={stat.id ?? stat.value} {...stat} className="min-w-0 flex-1" />
            ))}
          </div>
        ) : null}
      </div>
    </SectionShell>
  );
};

SupportBlock.displayName = 'SupportBlock';
