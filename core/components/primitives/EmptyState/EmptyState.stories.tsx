import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';
import type { EmptyStateAppearance, EmptyStateLayout, EmptyStateSize } from './EmptyState.types';
import { SearchIcon, BellIcon, GearIcon, BookmarkFrameIcon, PersonIcon } from '../../icons';
import { Button } from '../Button/Button';

const meta: Meta<typeof EmptyState> = {
  title: 'Primitives/EmptyState',
  component: EmptyState,
  parameters: {
    docs: {
      description: {
        component:
          '`@UI/EmptyState` — пустое состояние с иконкой, заголовком, описанием и CTA-кнопками. ' +
          'Оси: size (sm/md/lg) × appearance (base/info/success/warning/danger) × layout (vertical/horizontal).',
      },
    },
  },
  argTypes: {
    size:          { control: 'select', options: ['sm', 'md', 'lg'] },
    appearance:    { control: 'select', options: ['base', 'info', 'success', 'warning', 'danger'] },
    layout:        { control: 'select', options: ['vertical', 'horizontal'] },
    title:         { control: 'text' },
    description:   { control: 'text' },
    showIcon:      { control: 'boolean' },
    showCta:       { control: 'boolean' },
    showSecondary: { control: 'boolean' },
    icon:            { control: false },
    ctaButton:       { control: false },
    secondaryButton: { control: false },
  },
};
export default meta;
type Story = StoryObj<typeof EmptyState>;

// ─── Shared slots ────────────────────────────────────────────────────────────
const makeShared = (size: EmptyStateSize = 'sm') => ({
  icon: <SearchIcon size={size === 'sm' ? 32 : size === 'md' ? 48 : 64} />,
  ctaButton: <Button appearance="brand" size="sm">Add item</Button>,
  secondaryButton: <Button appearance="ghost" size="sm">Learn more</Button>,
});

const sharedMdSlots = {
  icon: <SearchIcon size={48} />,
  ctaButton: <Button appearance="brand" size="sm">Add item</Button>,
  secondaryButton: <Button appearance="ghost" size="sm">Learn more</Button>,
};

// ─── Default ─────────────────────────────────────────────────────────────────
export const Default: Story = {
  args: {
    size: 'md',
    appearance: 'base',
    layout: 'vertical',
    title: 'No items yet',
    description: 'Add your first item to get started.',
    showIcon: true,
    showCta: true,
    showSecondary: true,
    icon: sharedMdSlots.icon,
    ctaButton: sharedMdSlots.ctaButton,
    secondaryButton: sharedMdSlots.secondaryButton,
  },
};

// ─── All Appearances ─────────────────────────────────────────────────────────
export const AllAppearances: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' }}>
      {(['base', 'info', 'success', 'warning', 'danger'] as EmptyStateAppearance[]).map((a) => (
        <EmptyState
          key={a}
          size="md"
          appearance={a}
          layout="vertical"
          title={`appearance=${a}`}
          description="Add your first item to get started."
          showIcon
          showCta
          showSecondary={false}
          icon={<SearchIcon size={48} />}
          ctaButton={<Button appearance={a === 'base' || a === 'info' ? 'brand' : a} size="sm">Add item</Button>}
        />
      ))}
    </div>
  ),
};

// ─── All Sizes ───────────────────────────────────────────────────────────────
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' }}>
      {(['sm', 'md', 'lg'] as EmptyStateSize[]).map((s) => (
        <EmptyState
          key={s}
          size={s}
          appearance="base"
          layout="vertical"
          title={`size=${s}`}
          description="Add your first item to get started."
          showIcon
          showCta
          showSecondary={false}
          {...makeShared(s)}
        />
      ))}
    </div>
  ),
};

// ─── All Layouts ─────────────────────────────────────────────────────────────
export const AllLayouts: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {(['vertical', 'horizontal'] as EmptyStateLayout[]).map((l) => (
        <div key={l}>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 8 }}>layout={l}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' }}>
            {(['sm', 'md', 'lg'] as EmptyStateSize[]).map((s) => (
              <EmptyState
                key={s}
                size={s}
                appearance="base"
                layout={l}
                title="No items yet"
                description="Add your first item to get started."
                showIcon
                showCta
                showSecondary
                {...makeShared(s)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

// ─── Vertical — no actions ────────────────────────────────────────────────────
export const IconOnly: Story = {
  args: {
    size: 'md',
    appearance: 'base',
    layout: 'vertical',
    title: 'Nothing to show',
    description: 'This section is currently empty.',
    showIcon: true,
    showCta: false,
    showSecondary: false,
    icon: <SearchIcon size={48} />,
  },
};

// ─── Horizontal layout ────────────────────────────────────────────────────────
export const Horizontal: Story = {
  args: {
    size: 'md',
    appearance: 'base',
    layout: 'horizontal',
    title: 'No items yet',
    description: 'Add your first item to get started.',
    showIcon: true,
    showCta: true,
    showSecondary: true,
    icon: sharedMdSlots.icon,
    ctaButton: sharedMdSlots.ctaButton,
    secondaryButton: sharedMdSlots.secondaryButton,
  },
};

// ─── Semantic appearances ─────────────────────────────────────────────────────
export const Info: Story = {
  args: {
    size: 'md',
    appearance: 'info',
    layout: 'vertical',
    title: 'Get started',
    description: 'Follow the steps below to set up your workspace.',
    showIcon: true,
    showCta: true,
    showSecondary: true,
    icon: <BellIcon size={48} />,
    ctaButton: <Button appearance="brand" size="sm">Get started</Button>,
    secondaryButton: <Button appearance="ghost" size="sm">Learn more</Button>,
  },
};

export const Success: Story = {
  args: {
    size: 'md',
    appearance: 'success',
    layout: 'vertical',
    title: 'All done!',
    description: 'Your data has been saved successfully.',
    showIcon: true,
    showCta: true,
    showSecondary: false,
    icon: <GearIcon size={48} />,
    ctaButton: <Button appearance="success" size="sm">Continue</Button>,
  },
};

export const Warning: Story = {
  args: {
    size: 'md',
    appearance: 'warning',
    layout: 'vertical',
    title: 'No results',
    description: 'Check your filters or try a different search.',
    showIcon: true,
    showCta: true,
    showSecondary: true,
    icon: <SearchIcon size={48} />,
    ctaButton: <Button appearance="warning" size="sm">Reset filters</Button>,
    secondaryButton: <Button appearance="ghost" size="sm">Help</Button>,
  },
};

export const Danger: Story = {
  args: {
    size: 'md',
    appearance: 'danger',
    layout: 'vertical',
    title: 'Failed to load',
    description: 'Something went wrong. Please try again later.',
    showIcon: true,
    showCta: true,
    showSecondary: true,
    icon: <PersonIcon size={48} />,
    ctaButton: <Button appearance="danger" size="sm">Retry</Button>,
    secondaryButton: <Button appearance="ghost" size="sm">Contact support</Button>,
  },
};

// ─── Full Matrix ─────────────────────────────────────────────────────────────
export const FullMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {(['base', 'info', 'success', 'warning', 'danger'] as EmptyStateAppearance[]).map((a) => (
        <div key={a}>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 8 }}>appearance={a}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' }}>
            {(['sm', 'md', 'lg'] as EmptyStateSize[]).map((s) => (
              <div key={s} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>size={s} / vertical</div>
                <EmptyState
                  size={s}
                  appearance={a}
                  layout="vertical"
                  title="No items yet"
                  description="Add your first item to get started."
                  showIcon
                  showCta
                  showSecondary={false}
                  icon={<SearchIcon size={s === 'sm' ? 32 : s === 'md' ? 48 : 64} />}
                  ctaButton={<Button appearance={a === 'base' || a === 'info' ? 'brand' : a} size="sm">Add item</Button>}
                />
                <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>size={s} / horizontal</div>
                <EmptyState
                  size={s}
                  appearance={a}
                  layout="horizontal"
                  title="No items yet"
                  description="Add your first item to get started."
                  showIcon
                  showCta
                  showSecondary={false}
                  icon={<SearchIcon size={s === 'sm' ? 32 : s === 'md' ? 48 : 64} />}
                  ctaButton={<Button appearance={a === 'base' || a === 'info' ? 'brand' : a} size="sm">Add item</Button>}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

// ─── Real-world examples ──────────────────────────────────────────────────────
export const EmptyList: Story = {
  args: {
    size: 'lg',
    appearance: 'base',
    layout: 'vertical',
    title: 'No tasks found',
    description: "You haven't created any tasks yet. Start by clicking the button below.",
    showIcon: true,
    showCta: true,
    showSecondary: true,
    icon: <BookmarkFrameIcon size={64} />,
    ctaButton: <Button appearance="brand" size="sm">Create task</Button>,
    secondaryButton: <Button appearance="outline" size="sm">Import</Button>,
  },
};

export const LoadError: Story = {
  args: {
    size: 'md',
    appearance: 'danger',
    layout: 'horizontal',
    title: 'Connection failed',
    description: "We couldn't reach the server. Check your connection and try again.",
    showIcon: true,
    showCta: true,
    showSecondary: false,
    icon: <GearIcon size={48} />,
    ctaButton: <Button appearance="danger" size="sm">Retry</Button>,
  },
};
