import type { Meta, StoryObj } from '@storybook/react';
import { DamiatCaseDetailPage } from './DamiatCaseDetailPage';
import { marketingBlockParameters } from '@ai-ds/core/blocks/_shared/blockStoryViewports';
import { damiatCaseDetailArgs } from '../damiatCaseDetailFixtures';

const meta: Meta<typeof DamiatCaseDetailPage> = {
  title: 'Screens/DAMIAT Case Detail',
  component: DamiatCaseDetailPage,
  parameters: {
    ...marketingBlockParameters,
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Детальная страница кейса DAMIAT — Cortel long-read: photo-hero с title, белый intro с brand-метриками, anchor nav, stats cards, related projects, landing contact+footer closing band.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof DamiatCaseDetailPage>;

export const Default: Story = {
  render: () => <DamiatCaseDetailPage {...damiatCaseDetailArgs} />,
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const Mobile: Story = {
  render: () => <DamiatCaseDetailPage {...damiatCaseDetailArgs} />,
  parameters: { viewport: { defaultViewport: 'mobile' } },
};

export const Tablet: Story = {
  render: () => <DamiatCaseDetailPage {...damiatCaseDetailArgs} />,
  parameters: { viewport: { defaultViewport: 'tablet' } },
};

export const Desktop: Story = {
  render: () => <DamiatCaseDetailPage {...damiatCaseDetailArgs} />,
  parameters: { viewport: { defaultViewport: 'desktop' } },
};
