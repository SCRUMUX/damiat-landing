import React from 'react';
import { SectionShell } from '../../_shared/SectionShell';
import { BlockSectionHeader } from '../../_shared/BlockSectionHeader';
import { BLOCK_PROSE_CLASS } from '../../_shared/blockLayout';
import { cn } from '../../../components/primitives/_shared';
import { Input } from '../../../components/primitives/Input';
import { Button } from '../../../components/primitives/Button';

export interface NewsletterBlockProps {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  buttonLabel?: string;
  onSubmit?: (email: string) => void;
  className?: string;
}

export const NewsletterBlock: React.FC<NewsletterBlockProps> = ({
  title = 'Stay in the loop',
  subtitle,
  placeholder = 'you@company.com',
  buttonLabel = 'Subscribe',
  onSubmit,
  className,
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '');
    onSubmit?.(email);
  };

  return (
    <SectionShell recipe="section.newsletter" appearance="muted" className={className} aria-label="Newsletter">
      <div className="flex w-full min-w-0 flex-col items-start" style={{ gap: 'var(--space-section-content-m)' }}>
        <BlockSectionHeader title={title} subtitle={subtitle} />
        <form
          onSubmit={handleSubmit}
          className={cn(
            BLOCK_PROSE_CLASS,
            'flex w-full flex-col tablet:flex-row items-stretch tablet:items-center',
          )}
          style={{ gap: 'var(--space-section-stack-m)' }}
        >
          <Input
            name="email"
            type="email"
            placeholder={placeholder}
            size="lg"
            fullWidth
            aria-label="Email address"
          />
          <Button type="submit" appearance="brand" size="lg" className="shrink-0">
            {buttonLabel}
          </Button>
        </form>
      </div>
    </SectionShell>
  );
};

NewsletterBlock.displayName = 'NewsletterBlock';
