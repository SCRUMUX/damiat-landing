import React from 'react';
import { SectionShell } from '../../_shared/SectionShell';
import { BlockAction } from '../../_shared/BlockAction';
import { BlockSectionHeader } from '../../_shared/BlockSectionHeader';
import { BlockGrid } from '../../_shared/BlockGrid';
import { BLOCK_CARD_COMPACT_CLASS, BLOCK_CARD_COMPACT_INSET_CLASS } from '../../_shared/blockLayout';
import { Paragraph } from '../../../components/primitives/Paragraph';
import { Badge } from '../../../components/primitives/Badge';
import { Divider } from '../../../components/primitives/Divider';
import { cn } from '../../../components/primitives/_shared';

export interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  actionLabel?: string;
  onAction?: () => void;
  href?: string;
}

export interface PricingBlockProps {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  tiers: PricingTier[];
  highlightedIndex?: number;
  className?: string;
}

export const PricingBlock: React.FC<PricingBlockProps> = ({
  title = 'Pricing',
  subtitle,
  eyebrow,
  tiers,
  highlightedIndex = 1,
  className,
}) => (
  <SectionShell recipe="section.pricing" className={className} aria-label="Pricing">
    <BlockSectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
    <BlockGrid columns={3}>
      {tiers.map((tier, index) => {
        const highlighted = index === highlightedIndex;
        return (
          <div
            key={tier.name}
            className={cn(
              'flex flex-col h-full w-full min-w-0',
              BLOCK_CARD_COMPACT_CLASS,
              BLOCK_CARD_COMPACT_INSET_CLASS,
              highlighted
                ? 'border-[var(--color-brand-primary)] bg-[var(--color-surface-2)] shadow-elevation-2'
                : '',
            )}
            style={{ gap: 'var(--space-section-stack-m)' }}
          >
            <div
              className="flex items-center justify-between flex-wrap"
              style={{ gap: 'var(--space-section-stack-s)' }}
            >
              <h3 className="m-0 text-style-h4 font-semibold text-[var(--color-text-primary)]">
                {tier.name}
              </h3>
              {highlighted && (
                <Badge appearance="brand" size="sm">
                  Popular
                </Badge>
              )}
            </div>
            <div
              className="flex items-baseline flex-wrap"
              style={{ gap: 'var(--space-content-xs)' }}
            >
              <span className="text-style-h1 font-semibold text-[var(--color-text-primary)]">
                {tier.price}
              </span>
              {tier.period && (
                <span className="text-style-body-sm text-[var(--color-text-muted)]">
                  /{tier.period}
                </span>
              )}
            </div>
            {tier.description && (
              <Paragraph size="sm" className="text-[var(--color-text-secondary)] m-0">
                {tier.description}
              </Paragraph>
            )}
            <Divider appearance="base" size="sm" />
            <ul
              className="flex flex-col m-0 p-0 list-none flex-1"
              style={{ gap: 'var(--space-section-stack-s)' }}
            >
              {tier.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start text-style-body-sm text-[var(--color-text-primary)]"
                  style={{ gap: 'var(--space-content-xs)' }}
                >
                  <span aria-hidden className="text-[var(--color-brand-primary)] shrink-0">
                    ✓
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            {tier.actionLabel && (
              <BlockAction
                label={tier.actionLabel}
                onClick={tier.onAction}
                href={tier.href}
                appearance={highlighted ? 'brand' : 'outline'}
                size="md"
                className="w-full justify-center mt-auto"
              />
            )}
          </div>
        );
      })}
    </BlockGrid>
  </SectionShell>
);

PricingBlock.displayName = 'PricingBlock';
