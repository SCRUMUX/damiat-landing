import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './Pagination';

const APPEARANCES = ['brand', 'base', 'ghost'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;
const VARIANTS = ['with-numbers', 'compact', 'minimal'] as const;

const meta: Meta<typeof Pagination> = {
  title: 'Primitives/Pagination',
  component: Pagination,
  parameters: {
    docs: {
      description: {
        component:
          'Pagination (@UI/Pagination): Prev/Next + страницы. ' +
          'Варианты: with-numbers (Button instances), compact (N / Total), minimal (только навигация). ' +
          '3 размера (sm/md/lg), 3 appearance (brand/base/ghost). ' +
          'Figma: 160:86574.',
      },
    },
  },
  argTypes: {
    size:        { control: 'select',  options: SIZES,       description: 'Размер' },
    appearance:  { control: 'select',  options: APPEARANCES, description: 'Визуальный стиль' },
    variant:     { control: 'select',  options: VARIANTS,    description: 'Вариант: with-numbers / compact / minimal' },
    currentPage: { control: { type: 'number', min: 1 }, description: 'Текущая страница' },
    totalPages:  { control: { type: 'number', min: 1 }, description: 'Всего страниц' },
    onPageChange: { action: 'page-changed', description: 'Вызывается при смене страницы' },
    onPrev:       { action: 'prev-clicked', description: 'Клик "Назад"' },
    onNext:       { action: 'next-clicked', description: 'Клик "Вперёд"' },
  },
  args: {
    appearance: 'brand',
    size: 'sm',
    variant: 'with-numbers',
    currentPage: 1,
    totalPages: 10,
  },
};
export default meta;
type Story = StoryObj<typeof Pagination>;

/* ── Default (интерактивная) ── */
export const Default: Story = {
  args: {
    appearance: 'brand',
    size: 'sm',
    variant: 'with-numbers',
    totalPages: 10,
  },
};

/* ── All appearances ── */
export const AllAppearances: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
      {APPEARANCES.map((a) => (
        <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 60, fontSize: 12, color: 'var(--color-text-muted)' }}>{a}</span>
          <Pagination {...args} appearance={a} />
        </div>
      ))}
    </div>
  ),
  args: { size: 'sm', variant: 'with-numbers', totalPages: 10, currentPage: 3 },
};

/* ── All sizes ── */
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
      {SIZES.map((s) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 24, fontSize: 12, color: 'var(--color-text-muted)' }}>{s}</span>
          <Pagination {...args} size={s} />
        </div>
      ))}
    </div>
  ),
  args: { appearance: 'brand', variant: 'with-numbers', totalPages: 10, currentPage: 3 },
};

/* ── All variants ── */
export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
      {VARIANTS.map((v) => (
        <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 100, fontSize: 12, color: 'var(--color-text-muted)' }}>{v}</span>
          <Pagination {...args} variant={v} />
        </div>
      ))}
    </div>
  ),
  args: { appearance: 'brand', size: 'sm', totalPages: 10, currentPage: 3 },
};

/* ── Full matrix: appearances × variants ── */
export const FullMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 16 }}>
      {APPEARANCES.map((a) => (
        <div key={a} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{a}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {VARIANTS.map((v) => (
              <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 100, fontSize: 12, color: 'var(--color-text-muted)' }}>{v}</span>
                <Pagination appearance={a} variant={v} size="sm" totalPages={10} currentPage={3} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

/* ── Interactive (с состоянием) ── */
export const Interactive: Story = {
  render: (args) => {
    const [page, setPage] = useState(1);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16, alignItems: 'flex-start' }}>
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
          Страница {page} из {args.totalPages}
        </div>
        <Pagination
          {...args}
          currentPage={page}
          onPageChange={setPage}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          {VARIANTS.map((v) => (
            <button
              key={v}
              onClick={() => {}}
              style={{
                padding: '2px 8px',
                fontSize: 11,
                cursor: 'pointer',
                borderRadius: 4,
                border: '1px solid var(--color-border-base)',
                background: 'transparent',
                color: 'var(--color-text-muted)',
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
    );
  },
  args: { appearance: 'brand', size: 'md', variant: 'with-numbers', totalPages: 10 },
};

/* ── Edge cases: первая и последняя страница ── */
export const EdgeCases: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
      <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Первая страница (Prev disabled)</div>
      <Pagination appearance="brand" size="sm" variant="with-numbers" totalPages={10} currentPage={1} />
      <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Последняя страница (Next disabled)</div>
      <Pagination appearance="brand" size="sm" variant="with-numbers" totalPages={10} currentPage={10} />
      <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Одна страница (оба disabled)</div>
      <Pagination appearance="brand" size="sm" variant="with-numbers" totalPages={1} currentPage={1} />
    </div>
  ),
};
