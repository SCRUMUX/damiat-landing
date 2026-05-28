import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SkeletonPage } from './SkeletonPage';
import type { SkeletonPageSize } from './SkeletonPage.types';

const meta: Meta<typeof SkeletonPage> = {
  title: 'Primitives/Skeleton/Page',
  component: SkeletonPage,
  parameters: {
    docs: { description: { component: '`@UI/Skeleton/Page` — шаблон-заглушка для полной страницы. Nav + Hero + субтитры + теги + сетка 3 карточек.' } },
    layout: 'centered',
  },
  argTypes: {
    size:    { control: 'select', options: ['sm', 'md', 'lg'] },
    shimmer: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof SkeletonPage>;

export const Default: Story = { args: { size: 'sm', shimmer: true } };

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 16 }}>
      {(['sm', 'md', 'lg'] as SkeletonPageSize[]).map((s) => (
        <div key={s}>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 6 }}>size={s}</div>
          <SkeletonPage size={s} shimmer />
        </div>
      ))}
    </div>
  ),
};

export const NoShimmer: Story = { args: { size: 'sm', shimmer: false } };

export const FullMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 16 }}>
      {(['sm', 'md', 'lg'] as SkeletonPageSize[]).map((s) => (
        <div key={s} style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 4 }}>{s} shimmer</div>
            <SkeletonPage size={s} shimmer />
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 4 }}>{s} static</div>
            <SkeletonPage size={s} shimmer={false} />
          </div>
        </div>
      ))}
    </div>
  ),
};
