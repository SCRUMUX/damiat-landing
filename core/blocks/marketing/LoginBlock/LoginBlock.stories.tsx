import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LoginBlock } from './LoginBlock';
import { LoginLegalFooter } from './LoginLegalFooter';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';
import { damiatLoginContent, damiatLoginWithErrorContent } from '../damiatLoginFixtures';
import { LOGIN_FORM_INNER_CLASS, LOGIN_FORM_PANEL_CLASS } from '../../_shared/blockLayout';

const meta: Meta<typeof LoginBlock> = {
  title: 'Blocks/Marketing/LoginBlock',
  component: LoginBlock,
  parameters: {
    ...marketingBlockParameters,
    controls: { disable: true },
  },
};
export default meta;

type Story = StoryObj<typeof LoginBlock>;

const formPanelDecorator = (Story: () => React.JSX.Element) => (
  <div className={LOGIN_FORM_PANEL_CLASS}>
    <div className={LOGIN_FORM_INNER_CLASS}>
      <Story />
    </div>
    <LoginLegalFooter links={damiatLoginContent.legalLinks} />
  </div>
);

/** Cortel console-style login form — right white panel only. */
export const Default: Story = {
  render: () => <LoginBlock {...damiatLoginContent} />,
  decorators: [formPanelDecorator],
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const WithError: Story = {
  render: () => <LoginBlock {...damiatLoginWithErrorContent} />,
  decorators: [formPanelDecorator],
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const Mobile: Story = {
  render: () => <LoginBlock {...damiatLoginContent} />,
  decorators: [formPanelDecorator],
  parameters: { viewport: { defaultViewport: 'mobile' } },
};

export const Tablet: Story = {
  render: () => <LoginBlock {...damiatLoginContent} />,
  decorators: [formPanelDecorator],
  parameters: { viewport: { defaultViewport: 'tablet' } },
};

export const Desktop: Story = {
  render: () => <LoginBlock {...damiatLoginContent} />,
  decorators: [formPanelDecorator],
  parameters: { viewport: { defaultViewport: 'desktop' } },
};
