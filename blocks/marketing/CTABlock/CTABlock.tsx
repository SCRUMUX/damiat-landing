import React from 'react';
import { SectionShell } from '../../_shared/SectionShell';
import { BlockAction } from '../../_shared/BlockAction';
import { BlockSectionHeader } from '../../_shared/BlockSectionHeader';
import { BLOCK_ACTIONS_ROW_CLASS, BLOCK_CARD_COMPACT_CLASS } from '../../_shared/blockLayout';
import { cn } from '../../../components/primitives/_shared';

export interface CTABlockAction {
  label: string;
  onClick?: () => void;
  href?: string;
}

export interface CTABlockProps {
  title: string;
  description?: string;
  action?: CTABlockAction;
  secondaryAction?: CTABlockAction;
  variant?: 'card' | 'band';
  className?: string;
}

export const CTABlock: React.FC<CTABlockProps> = ({
  title,
  description,
  action,
  secondaryAction,
  variant = 'card',
  className,
}) => {
  const band = variant === 'band';

  const actions = (action || secondaryAction) && (
    <div className={BLOCK_ACTIONS_ROW_CLASS} style={{ gap: 'var(--space-section-stack-m)' }}>
      {action && (
        <BlockAction
          label={action.label}
          onClick={action.onClick}
          href={action.href}
          appearance={band ? 'base' : 'brand'}
          size="lg"
        />
      )}
      {secondaryAction && (
        <BlockAction
          label={secondaryAction.label}
          onClick={secondaryAction.onClick}
          href={secondaryAction.href}
          appearance="outline"
          size="lg"
        />
      )}
    </div>
  );

  return (
    <SectionShell
      recipe="section.cta"
      appearance={band ? 'brand' : 'muted'}
      className={className}
      aria-label="Call to action"
    >
      <div
        className={cn(
          'flex flex-col items-start text-left w-full min-w-0',
          !band && BLOCK_CARD_COMPACT_CLASS,
        )}
        style={{
          padding: band ? undefined : 'var(--space-inset-xl)',
          gap: 'var(--space-section-content-m)',
        }}
      >
        <BlockSectionHeader title={title} subtitle={description} onBrand={band} />
        {actions}
      </div>
    </SectionShell>
  );
};

CTABlock.displayName = 'CTABlock';
