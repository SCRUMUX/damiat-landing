import type { Meta, StoryObj } from '@storybook/react';
import { CaseStudyInlineStatsBlock } from './CaseStudyInlineStatsBlock';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';

const meta: Meta<typeof CaseStudyInlineStatsBlock> = {
  title: 'Blocks/Marketing/CaseStudyInlineStatsBlock',
  component: CaseStudyInlineStatsBlock,
  parameters: marketingBlockParameters,
  args: {
    title: 'Бизнес-результаты',
    stats: [
      { value: '4–6,5%', label: 'потери с КГС и генератором DAMIAT' },
      { value: '38,25 млн ₽', label: 'чистый экономический эффект за сезон' },
    ],
  },
};
export default meta;

type Story = StoryObj<typeof CaseStudyInlineStatsBlock>;

export const Desktop: Story = { parameters: { viewport: { defaultViewport: 'desktop' } } };
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile' } } };
