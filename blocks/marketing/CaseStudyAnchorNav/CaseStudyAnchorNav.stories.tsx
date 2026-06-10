import type { Meta, StoryObj } from '@storybook/react';
import { CaseStudyAnchorNav } from './CaseStudyAnchorNav';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';

const meta: Meta<typeof CaseStudyAnchorNav> = {
  title: 'Blocks/Marketing/CaseStudyAnchorNav',
  component: CaseStudyAnchorNav,
  parameters: marketingBlockParameters,
  args: {
    activeId: 'case-business-results',
    items: [
      { id: 'case-business-results', label: 'Бизнес-результаты' },
      { id: 'case-implemented', label: 'Что было реализовано?' },
      { id: 'case-why', label: 'Зачем это заказчику?' },
      { id: 'case-vendor', label: 'Как искали подрядчика?' },
      { id: 'case-delivered', label: 'Что получил заказчик?' },
      { id: 'case-result', label: 'Результат' },
    ],
  },
};
export default meta;

type Story = StoryObj<typeof CaseStudyAnchorNav>;

export const Desktop: Story = { parameters: { viewport: { defaultViewport: 'desktop' } } };
