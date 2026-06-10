import type { Meta, StoryObj } from '@storybook/react';
import { FAQBlock } from './FAQBlock';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';
import { aicadsEnterpriseFaqDemo } from '../marketingDemoContent';

const meta: Meta<typeof FAQBlock> = {
  title: 'Blocks/Marketing/FAQBlock',
  component: FAQBlock,
  parameters: marketingBlockParameters,
  args: {
    subtitle: 'Everything you need to know about AICADS pattern blocks.',
    items: [
      {
        question: 'What are pattern blocks?',
        answer:
          'Pre-composed marketing sections built from AICADS primitives with fixed spacing recipes and ai-patterns.json metadata for AI assemblers.',
      },
      {
        question: 'Can I customize spacing?',
        answer:
          'Section rhythm uses `--space-section-*` tokens. Override tokens in your theme or pass className on the block shell.',
      },
      {
        question: 'Do blocks work in consumer Storybook?',
        answer:
          'Yes — import stories from `@ai-ds/core/blocks/**` via the consumer Storybook template.',
      },
    ],
  },
};
export default meta;

type Story = StoryObj<typeof FAQBlock>;

export const Default: Story = {
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile' } } };
export const Tablet: Story = { parameters: { viewport: { defaultViewport: 'tablet' } } };
export const Desktop: Story = { parameters: { viewport: { defaultViewport: 'desktop' } } };

/** Cortel vmware-style FAQ — grey card items, plus toggle, single collapsible. */
export const Enterprise: Story = {
  args: aicadsEnterpriseFaqDemo,
  parameters: { viewport: { defaultViewport: 'desktop' }, controls: { disable: true } },
};

export const EnterpriseMobile: Story = {
  args: aicadsEnterpriseFaqDemo,
  parameters: { viewport: { defaultViewport: 'mobile' }, controls: { disable: true } },
};

export const EnterpriseTablet: Story = {
  args: aicadsEnterpriseFaqDemo,
  parameters: { viewport: { defaultViewport: 'tablet' }, controls: { disable: true } },
};

export const EnterpriseDesktop: Story = {
  args: aicadsEnterpriseFaqDemo,
  parameters: { viewport: { defaultViewport: 'desktop' }, controls: { disable: true } },
};
