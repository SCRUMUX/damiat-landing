import React from 'react';
import { SectionShell } from '../../_shared/SectionShell';
import { BlockSectionHeader } from '../../_shared/BlockSectionHeader';
import { FAQ_ENTERPRISE_TITLE_CLASS } from '../../_shared/blockLayout';
import { cn } from '../../../components/primitives/_shared';
import { Accordion } from '../../../components/primitives/Accordion';
import { FAQEnterpriseAccordion } from './FAQEnterpriseAccordion';
import type { FAQBlockProps } from './FAQBlock.types';

export type { FAQBlockProps, FAQItem } from './FAQBlock.types';

function DefaultFAQList({ items }: Pick<FAQBlockProps, 'items'>) {
  return (
    <div className={cn('flex w-full min-w-0 flex-col')} style={{ gap: 'var(--space-section-stack-s)' }}>
      {items.map((item) => (
        <Accordion key={item.id ?? String(item.question)} size="md" fullWidth content={item.answer}>
          {item.question}
        </Accordion>
      ))}
    </div>
  );
}

export const FAQBlock: React.FC<FAQBlockProps> = ({
  variant = 'default',
  title = 'Frequently asked questions',
  subtitle,
  items,
  className,
}) => {
  if (items.length === 0) return null;

  const isEnterprise = variant === 'enterprise';

  return (
    <SectionShell
      recipe="section.faq"
      appearance="base"
      className={cn(
        isEnterprise && '!py-[var(--space-64)] min-[1024px]:!py-[var(--space-112)]',
        className,
      )}
      aria-label="FAQ"
    >
      {isEnterprise ? (
        <h2 className={FAQ_ENTERPRISE_TITLE_CLASS}>{title}</h2>
      ) : (
        <BlockSectionHeader title={title} subtitle={subtitle} />
      )}

      {isEnterprise ? <FAQEnterpriseAccordion items={items} /> : <DefaultFAQList items={items} />}
    </SectionShell>
  );
};

FAQBlock.displayName = 'FAQBlock';
