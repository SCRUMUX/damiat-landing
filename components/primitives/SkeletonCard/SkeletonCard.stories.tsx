import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SkeletonCard } from './SkeletonCard';
import type { SkeletonCardSize } from './SkeletonCard.types';

const meta: Meta<typeof SkeletonCard> = {
  title: 'Primitives/Skeleton/Card',
  component: SkeletonCard,
  parameters: {
    docs: { description: { component: '`@UI/Skeleton/Card` — шаблон-заглушка для карточки. Media + Content (Title + Desc + Actions).' } },
    layout: 'centered',
  },
  argTypes: {
    size:    { control: 'select', options: ['sm', 'md', 'lg'] },
    shimmer: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof SkeletonCard>;

export const Default: Story = { args: { size: 'sm', shimmer: true } };

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 16 }}>
      {(['sm', 'md', 'lg'] as SkeletonCardSize[]).map((s) => (
        <div key={s}>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 6 }}>size={s}</div>
          <SkeletonCard size={s} shimmer />
        </div>
      ))}
    </div>
  ),
};

export const NoShimmer: Story = { args: { size: 'sm', shimmer: false } };

export const FullMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 16 }}>
      {(['sm', 'md', 'lg'] as SkeletonCardSize[]).map((s) => (
        <div key={s} style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 4 }}>{s} shimmer</div>
            <SkeletonCard size={s} shimmer />
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 4 }}>{s} static</div>
            <SkeletonCard size={s} shimmer={false} />
          </div>
        </div>
      ))}
    </div>
  ),
};
