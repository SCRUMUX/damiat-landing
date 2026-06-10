import React from 'react';
import { cn } from '../../components/primitives/_shared';
import { Badge } from '../../components/primitives/Badge';
import { BLOCK_PROSE_CLASS } from './blockLayout';

export interface BlockSectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Substring of `subtitle` rendered in brand primary (must appear in subtitle text). */
  subtitleAccent?: string;
  /**
   * Section header alignment. Default `left` — matches landing layout contract.
   * Use `center` only for standalone centered hero (`marketing.hero.centered`).
   */
  align?: 'center' | 'left';
  titleScale?: 'display' | 'section' | 'compact';
  onBrand?: boolean;
  className?: string;
}

/** Marketing section heading — anchored to the content column start edge by default. */
export const BlockSectionHeader: React.FC<BlockSectionHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  subtitleAccent,
  align = 'left',
  titleScale = 'section',
  onBrand = false,
  className,
}) => {
  const centered = align === 'center';
  const TitleTag = titleScale === 'display' ? 'h1' : 'h2';
  const titleStyleClass =
    titleScale === 'display'
      ? 'text-style-display'
      : titleScale === 'compact'
        ? 'text-style-h2'
        : 'text-style-h1 w-full';

  return (
    <div
      className={cn(
        'flex flex-col w-full min-w-0',
        centered ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
      style={{ gap: 'var(--space-section-stack-m)' }}
    >
      {eyebrow && (
        <Badge appearance={onBrand ? 'outline' : 'brand'} size="sm">
          {eyebrow}
        </Badge>
      )}
      <div
        className="flex flex-col w-full min-w-0"
        style={{ gap: 'var(--space-section-stack-s)' }}
      >
        <TitleTag
          className={cn(
            'm-0 font-semibold tracking-tight',
            titleStyleClass,
            onBrand ? 'text-inherit' : 'text-[var(--color-text-primary)]',
            titleScale === 'display' && !centered && BLOCK_PROSE_CLASS,
            titleScale === 'display' && centered && 'max-w-[var(--space-640)]',
          )}
        >
          {title}
        </TitleTag>
        {subtitle && (
          <p
            className={cn(
              'm-0 text-style-body-lg',
              onBrand ? 'text-inherit opacity-90' : 'text-[var(--color-text-secondary)]',
              BLOCK_PROSE_CLASS,
            )}
          >
            {subtitleAccent && subtitle.includes(subtitleAccent) ? (
              <>
                {subtitle.split(subtitleAccent)[0]}
                <span className="font-medium text-[var(--color-brand-primary)]">
                  {subtitleAccent}
                </span>
                {subtitle.split(subtitleAccent)[1]}
              </>
            ) : (
              subtitle
            )}
          </p>
        )}
      </div>
    </div>
  );
};

BlockSectionHeader.displayName = 'BlockSectionHeader';
