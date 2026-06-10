import type { Meta, StoryObj } from '@storybook/react';
import { CaseStudyContactBlock } from './CaseStudyContactBlock';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';

const meta: Meta<typeof CaseStudyContactBlock> = {
  title: 'Blocks/Marketing/CaseStudyContactBlock',
  component: CaseStudyContactBlock,
  parameters: marketingBlockParameters,
  argTypes: {
    onSubmit: { action: 'case-contact-submit' },
  },
  args: {
    title: 'Остались вопросы по кейсу?',
    description:
      'Оставьте контакты — расскажем подробнее, как контролируемая газовая среда и генератор DAMIAT снижают потери при хранении.',
    submitLabel: 'Обсудить проект',
    labels: {
      name: 'Имя',
      company: 'Название компании',
    },
  },
};
export default meta;

type Story = StoryObj<typeof CaseStudyContactBlock>;

export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile' } } };
export const Tablet: Story = { parameters: { viewport: { defaultViewport: 'tablet' } } };
export const Desktop: Story = { parameters: { viewport: { defaultViewport: 'desktop' } } };
