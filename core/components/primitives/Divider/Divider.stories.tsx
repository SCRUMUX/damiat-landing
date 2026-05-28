import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './Divider';
import type { DividerOrientation, DividerSize, DividerAppearance } from './Divider.types';

const meta: Meta<typeof Divider> = {
  title: 'Primitives/Divider',
  component: Divider,
  parameters: {
    docs: {
      description: {
        component:
          '`@UI/Divider` — линия-разделитель. ' +
          'orientation: horizontal | vertical. ' +
          'size: sm (4px) | md (6px) | lg (8px) — толщина. ' +
          'appearance: base | strong.',
      },
    },
    layout: 'centered',
  },
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    size:        { control: 'select', options: ['sm', 'md', 'lg'] },
    appearance:  { control: 'select', options: ['base', 'strong'] },
  },
};
export default meta;
type Story = StoryObj<typeof Divider>;

// ─── Default ─────────────────────────────────────────────────────────────────
export const Default: Story = {
  render: (args) => (
    <div style={{ width: 240 }}>
      <Divider {...args} />
    </div>
  ),
  args: {
    orientation: 'horizontal',
    size: 'sm',
    appearance: 'base',
  },
};

// ─── All Sizes ────────────────────────────────────────────────────────────────
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 240 }}>
      {(['sm', 'md', 'lg'] as DividerSize[]).map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>size={s}</span>
          <Divider size={s} orientation="horizontal" appearance="base" />
        </div>
      ))}
    </div>
  ),
};

// ─── All Appearances ──────────────────────────────────────────────────────────
export const AllAppearances: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 240 }}>
      {(['base', 'strong'] as DividerAppearance[]).map((a) => (
        <div key={a} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>appearance={a}</span>
          <Divider size="md" orientation="horizontal" appearance={a} />
        </div>
      ))}
    </div>
  ),
};

// ─── Vertical ─────────────────────────────────────────────────────────────────
export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'row', gap: 24, alignItems: 'center' }}>
      {(['sm', 'md', 'lg'] as DividerSize[]).map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>size={s}</span>
          <div style={{ height: 60, display: 'flex', alignItems: 'center' }}>
            <Divider size={s} orientation="vertical" appearance="base" />
          </div>
        </div>
      ))}
    </div>
  ),
};

// ─── In Context ───────────────────────────────────────────────────────────────
export const InContext: Story = {
  render: () => (
    <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 0, padding: 16, background: 'var(--color-surface-1)', borderRadius: 8 }}>
      <div style={{ paddingBottom: 12, fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>Section A</div>
      <Divider size="sm" orientation="horizontal" appearance="base" />
      <div style={{ paddingTop: 12, paddingBottom: 12, fontSize: 14, color: 'var(--color-text-secondary)' }}>Some content here</div>
      <Divider size="sm" orientation="horizontal" appearance="strong" />
      <div style={{ paddingTop: 12, fontSize: 14, color: 'var(--color-text-secondary)' }}>Section B</div>
    </div>
  ),
};

// ─── Horizontal + Vertical in same layout ─────────────────────────────────────
export const HorizontalAndVertical: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, background: 'var(--color-surface-1)', borderRadius: 8 }}>
      <span style={{ fontSize: 14, color: 'var(--color-text-primary)' }}>Item A</span>
      <div style={{ height: 20, display: 'flex', alignItems: 'center' }}>
        <Divider size="sm" orientation="vertical" appearance="base" />
      </div>
      <span style={{ fontSize: 14, color: 'var(--color-text-primary)' }}>Item B</span>
      <div style={{ height: 20, display: 'flex', alignItems: 'center' }}>
        <Divider size="sm" orientation="vertical" appearance="strong" />
      </div>
      <span style={{ fontSize: 14, color: 'var(--color-text-primary)' }}>Item C</span>
    </div>
  ),
};

// ─── Full Matrix ─────────────────────────────────────────────────────────────
export const FullMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 16 }}>
      {(['horizontal', 'vertical'] as DividerOrientation[]).map((o) => (
        <div key={o}>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 8 }}>orientation={o}</div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            {(['sm', 'md', 'lg'] as DividerSize[]).map((s) =>
              (['base', 'strong'] as DividerAppearance[]).map((a) => (
                <div key={`${s}-${a}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{s}/{a}</span>
                  {o === 'horizontal' ? (
                    <div style={{ width: 80 }}>
                      <Divider size={s} orientation={o} appearance={a} />
                    </div>
                  ) : (
                    <div style={{ height: 40, display: 'flex', alignItems: 'center' }}>
                      <Divider size={s} orientation={o} appearance={a} />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  ),
};
