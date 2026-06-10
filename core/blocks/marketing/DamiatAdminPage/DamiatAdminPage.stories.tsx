import type { Meta, StoryObj } from '@storybook/react';
import { DamiatAdminPage } from './DamiatAdminPage';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';
import {
  damiatAdminArgs,
  damiatAdminCasePublished,
  damiatAdminEventDraft,
} from '../damiatAdminFixtures';

const meta: Meta<typeof DamiatAdminPage> = {
  title: 'Screens/DAMIAT Admin',
  component: DamiatAdminPage,
  parameters: {
    ...marketingBlockParameters,
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Админ-панель DAMIAT — кейсы, мероприятия, пользователи и партнёры. Front-only: локальный state, без API и роутинга.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof DamiatAdminPage>;

export const CasesList: Story = {
  render: () => <DamiatAdminPage {...damiatAdminArgs} defaultSection="cases" />,
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const CaseEditor: Story = {
  render: () => (
    <DamiatAdminPage
      {...damiatAdminArgs}
      defaultSection="cases"
      initialContentView="edit"
      initialContentSelectedId={damiatAdminCasePublished.id}
    />
  ),
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const EventsList: Story = {
  render: () => <DamiatAdminPage {...damiatAdminArgs} defaultSection="events" />,
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const EventEditor: Story = {
  render: () => (
    <DamiatAdminPage
      {...damiatAdminArgs}
      defaultSection="events"
      initialContentView="edit"
      initialContentSelectedId={damiatAdminEventDraft.id}
    />
  ),
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const Users: Story = {
  render: () => <DamiatAdminPage {...damiatAdminArgs} defaultSection="users" />,
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const Partners: Story = {
  render: () => <DamiatAdminPage {...damiatAdminArgs} defaultSection="partners" />,
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const Mobile: Story = {
  render: () => <DamiatAdminPage {...damiatAdminArgs} defaultSection="cases" />,
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
