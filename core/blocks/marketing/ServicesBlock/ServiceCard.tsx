import React from 'react';
import { BlockAction } from '../../_shared/BlockAction';
import { BLOCK_CARD_STANDARD_INTERACTIVE_CLASS, BLOCK_CARD_STANDARD_INSET_CLASS } from '../../_shared/blockLayout';
import { Image } from '../../../components/primitives/Image';
import { cn } from '../../../components/primitives/_shared';
import type { ServiceItemAction } from './ServicesBlock.types';

export interface ServiceCardProps {
  title: string;
  description: string;
  image?: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  action?: ServiceItemAction;
  className?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  image,
  imageSrc,
  imageAlt = '',
  action,
  className,
}) => {
  const media = image ?? (
    imageSrc ? (
      <Image
        layout="image"
        size="lg"
        ratio="4:3"
        state="loaded"
        src={imageSrc}
        alt={imageAlt}
        className="w-full max-w-none"
      />
    ) : (
      <div
        className="flex aspect-[4/3] w-full items-center justify-center bg-[var(--color-surface-2)] text-style-caption text-[var(--color-text-muted)]"
        aria-hidden="true"
      >
        Service preview
      </div>
    )
  );

  return (
    <article
      className={cn(
        'group flex h-full w-full min-w-0 flex-col overflow-hidden',
        BLOCK_CARD_STANDARD_INTERACTIVE_CLASS,
        className,
      )}
    >
      <div className="w-full shrink-0 overflow-hidden">{media}</div>

      <div
        className={cn('flex min-h-0 flex-1 flex-col', BLOCK_CARD_STANDARD_INSET_CLASS)}
        style={{
          gap: 'var(--space-section-stack-m)',
        }}
      >
        <div className="flex flex-col" style={{ gap: 'var(--space-section-stack-s)' }}>
          <h3 className="m-0 text-style-h4 font-semibold text-[var(--color-text-primary)]">
            {title}
          </h3>
          <p className="m-0 text-style-body-sm text-[var(--color-text-secondary)]">{description}</p>
        </div>

        {action ? (
          <div className="mt-auto">
            <BlockAction
              label={action.label}
              href={action.href}
              onClick={action.onClick}
              appearance="outline"
              size="md"
            />
          </div>
        ) : null}
      </div>
    </article>
  );
};

ServiceCard.displayName = 'ServiceCard';
