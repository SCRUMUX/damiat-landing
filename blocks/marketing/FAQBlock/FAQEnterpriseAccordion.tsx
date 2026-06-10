import React from 'react';
import { cn } from '../../../components/primitives/_shared';
import { RadixAccordion } from '../../../components/primitives/_internal/Accordion';
import {
  FAQ_ENTERPRISE_ANSWER_CLASS,
  FAQ_ENTERPRISE_ITEM_CLASS,
  FAQ_ENTERPRISE_LIST_CLASS,
  FAQ_ENTERPRISE_QUESTION_CLASS,
  FAQ_ENTERPRISE_TOGGLE_CLASS,
  FAQ_ENTERPRISE_TRIGGER_CLASS,
} from '../../_shared/blockLayout';
import { FAQPlusIcon } from './FAQBlockIcons';
import type { FAQItem } from './FAQBlock.types';

export interface FAQEnterpriseAccordionProps {
  items: FAQItem[];
}

export const FAQEnterpriseAccordion: React.FC<FAQEnterpriseAccordionProps> = ({ items }) => (
  <RadixAccordion.Root type="single" collapsible className={FAQ_ENTERPRISE_LIST_CLASS}>
    {items.map((item, index) => {
      const value = item.id ?? `faq-${index}`;

      return (
        <RadixAccordion.Item key={value} value={value} className={FAQ_ENTERPRISE_ITEM_CLASS}>
          <RadixAccordion.Header className="m-0">
            <RadixAccordion.Trigger className={FAQ_ENTERPRISE_TRIGGER_CLASS}>
              <span className={FAQ_ENTERPRISE_QUESTION_CLASS}>{item.question}</span>
              <span className={FAQ_ENTERPRISE_TOGGLE_CLASS}>
                <FAQPlusIcon className="transition-transform duration-200 group-data-[state=open]:rotate-45" />
              </span>
            </RadixAccordion.Trigger>
          </RadixAccordion.Header>
          <RadixAccordion.Content
            className={cn(
              'overflow-hidden',
              'data-[state=closed]:animate-accordion-close data-[state=open]:animate-accordion-open',
            )}
          >
            <div className={FAQ_ENTERPRISE_ANSWER_CLASS}>{item.answer}</div>
          </RadixAccordion.Content>
        </RadixAccordion.Item>
      );
    })}
  </RadixAccordion.Root>
);

FAQEnterpriseAccordion.displayName = 'FAQEnterpriseAccordion';
