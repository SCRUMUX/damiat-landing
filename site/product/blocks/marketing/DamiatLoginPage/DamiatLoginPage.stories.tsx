import type { Meta, StoryObj } from '@storybook/react';
import { DamiatLoginPage } from './DamiatLoginPage';
import { marketingBlockParameters } from '@ai-ds/core/blocks/_shared/blockStoryViewports';
import { damiatLoginContent, damiatLoginWithErrorContent } from '../damiatLoginFixtures';

const meta: Meta<typeof DamiatLoginPage> = {
  title: 'Screens/DAMIAT Login',
  component: DamiatLoginPage,
  parameters: {
    ...marketingBlockParameters,
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Split-screen вход DAMIAT: слева photo backdrop как на лендинге (scrim, grain, parallax), справа форма.',
      },
    },
  },
  argTypes: {
    onSubmit: { action: 'login' },
  },
};
export default meta;

type Story = StoryObj<typeof DamiatLoginPage>;

export const Default: Story = {
  render: () => <DamiatLoginPage {...damiatLoginContent} />,
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const WithError: Story = {
  render: () => <DamiatLoginPage {...damiatLoginWithErrorContent} />,
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const Mobile: Story = {
  render: () => <DamiatLoginPage {...damiatLoginContent} />,
  parameters: { viewport: { defaultViewport: 'mobile' } },
};

export const Tablet: Story = {
  render: () => <DamiatLoginPage {...damiatLoginContent} />,
  parameters: { viewport: { defaultViewport: 'tablet' } },
};

export const Desktop: Story = {
  render: () => <DamiatLoginPage {...damiatLoginContent} />,
  parameters: { viewport: { defaultViewport: 'desktop' } },
};
