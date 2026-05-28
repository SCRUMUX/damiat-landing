import React, { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { SkeletonCard } from '../SkeletonCard/SkeletonCard';

const VARIANTS = ['base', 'outlined', 'elevated', 'filled'] as const;
const SIZES    = ['sm', 'md', 'lg'] as const;
const STATES   = ['base', 'hover', 'focus', 'disabled'] as const;

const SAMPLE_TITLE       = 'Card title';
const SAMPLE_DESCRIPTION = 'Card content. Описание, метрики или другой контент.';

const meta: Meta<typeof Card> = {
  title: 'Primitives/Card',
  component: Card,
  parameters: {
    docs: {
      description: {
        component:
          'Card (@UI/Card): контейнер для контента. ' +
          '4 варианта (base/outlined/elevated/filled), 3 размера (sm/md/lg), 4 состояния. ' +
          'Слоты: title, description, header, footer, children. ' +
          'Figma: 160:75500.',
      },
    },
  },
  argTypes: {
    variant:     { control: 'select', options: VARIANTS },
    size:        { control: 'select', options: SIZES },
    state:       { control: 'select', options: STATES },
    title:       { control: 'text' },
    description: { control: 'text' },
    disabled:    { control: 'boolean' },
  },
  decorators: [(Story) => (
    <div style={{ padding: 24 }}>
      <Story />
    </div>
  )],
};
export default meta;
type Story = StoryObj<typeof Card>;

/* ── Default ── */
export const Default: Story = {
  args: {
    variant:     'base',
    size:        'md',
    title:       SAMPLE_TITLE,
    description: SAMPLE_DESCRIPTION,
  },
};

/* ── Все варианты ── */
export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
      {VARIANTS.map((v) => (
        <div key={v} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ width: 64, fontSize: 12, color: 'var(--color-text-muted)', paddingTop: 10, flexShrink: 0 }}>{v}</span>
          <Card {...args} variant={v} />
        </div>
      ))}
    </div>
  ),
  args: {
    size:        'md',
    title:       SAMPLE_TITLE,
    description: SAMPLE_DESCRIPTION,
  },
};

/* ── Все размеры ── */
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {SIZES.map((s) => (
        <div key={s} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ width: 24, fontSize: 12, color: 'var(--color-text-muted)', paddingTop: 10, flexShrink: 0 }}>{s}</span>
          <Card {...args} size={s} style={{ maxWidth: s === 'sm' ? 320 : s === 'md' ? 480 : 640 }} />
        </div>
      ))}
    </div>
  ),
  args: {
    variant:     'base',
    title:       SAMPLE_TITLE,
    description: SAMPLE_DESCRIPTION,
  },
};

/* ── Все состояния ── */
export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480 }}>
      {STATES.map((st) => (
        <div key={st} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ width: 60, fontSize: 12, color: 'var(--color-text-muted)', paddingTop: 10, flexShrink: 0 }}>{st}</span>
          <Card {...args} state={st} />
        </div>
      ))}
    </div>
  ),
  args: {
    size:        'md',
    variant:     'base',
    title:       SAMPLE_TITLE,
    description: SAMPLE_DESCRIPTION,
  },
};

/* ── Полная матрица: variants × states ── */
export const FullMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {VARIANTS.map((v) => (
        <div key={v} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            {v}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {STATES.map((st) => (
              <div key={st} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{st}</span>
                <Card
                  variant={v}
                  state={st}
                  size="sm"
                  title={SAMPLE_TITLE}
                  description={SAMPLE_DESCRIPTION}
                  style={{ width: 220 }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

/* ── С header и footer slots ── */
export const WithSlots: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480 }}>
      <Card
        {...args}
        header={
          <div style={{
            height: 120,
            background: 'var(--color-surface-3)',
            borderRadius: '4px 4px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-muted)',
            fontSize: 12,
          }}>
            Header / Image slot
          </div>
        }
        footer={
          <div style={{
            paddingTop: 8,
            borderTop: '1px solid var(--color-border-base)',
            display: 'flex',
            gap: 8,
            justifyContent: 'flex-end',
          }}>
            <button style={{
              padding: '4px 12px',
              fontSize: 12,
              background: 'transparent',
              border: '1px solid var(--color-border-base)',
              borderRadius: 4,
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
            }}>
              Cancel
            </button>
            <button style={{
              padding: '4px 12px',
              fontSize: 12,
              background: 'var(--color-brand-primary)',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              color: 'white',
            }}>
              Action
            </button>
          </div>
        }
      />
    </div>
  ),
  args: {
    size:        'md',
    variant:     'outlined',
    title:       SAMPLE_TITLE,
    description: SAMPLE_DESCRIPTION,
  },
};

/* ── Elevated shadow ── */
export const Elevated: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      {SIZES.map((s) => (
        <Card
          key={s}
          variant="elevated"
          size={s}
          title={SAMPLE_TITLE}
          description={SAMPLE_DESCRIPTION}
          style={{ width: s === 'sm' ? 240 : s === 'md' ? 320 : 400 }}
        />
      ))}
    </div>
  ),
};

/* ── Loading → Content transition (skeleton integration) ── */
export const WithSkeleton: Story = {
  render: () => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      const t = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(t);
    }, []);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {SIZES.map((s) =>
            loading ? (
              <SkeletonCard key={s} size={s} shimmer />
            ) : (
              <Card
                key={s}
                variant="base"
                size={s}
                title={SAMPLE_TITLE}
                description={SAMPLE_DESCRIPTION}
                style={{ width: s === 'sm' ? 320 : s === 'md' ? 480 : 800 }}
                header={
                  <div style={{
                    height: s === 'sm' ? 80 : s === 'md' ? 110 : 150,
                    background: 'var(--color-surface-3)',
                    borderRadius: '4px 4px 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-text-muted)',
                    fontSize: 12,
                  }}>
                    Image
                  </div>
                }
              />
            ),
          )}
        </div>
        <button
          onClick={() => setLoading(true)}
          style={{
            alignSelf: 'flex-start',
            padding: '6px 16px',
            fontSize: 12,
            borderRadius: 4,
            border: '1px solid var(--color-border-base)',
            background: 'var(--color-surface-1)',
            color: 'var(--color-text-primary)',
            cursor: 'pointer',
          }}
        >
          Reload (2s delay)
        </button>
      </div>
    );
  },
};
