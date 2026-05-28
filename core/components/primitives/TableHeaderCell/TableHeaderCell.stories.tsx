import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TableHeaderCell } from './TableHeaderCell';
import type { TableHeaderCellSort } from './TableHeaderCell.types';
import { SearchIcon } from '../../icons';

const SIZES = ['sm', 'md', 'lg'] as const;
const SORTS = ['none', 'asc', 'desc'] as const;

const meta: Meta<typeof TableHeaderCell> = {
  title: 'Primitives/TableHeaderCell',
  component: TableHeaderCell,
  parameters: {
    docs: {
      description: {
        component:
          'TableHeaderCell (@UI/Table/HeaderCell): ячейка заголовка таблицы. ' +
          'Рендерится как <th>. Используется инстансами в TableHeaderRow → Table. ' +
          '3 размера (sm/md/lg), 3 состояния сортировки (none/asc/desc). ' +
          'sort=none → label: text-muted. sort=asc/desc → label: text-primary + иконка. ' +
          'Figma: 161:89256.',
      },
    },
  },
  argTypes: {
    size:         { control: 'select', options: SIZES },
    sort:         { control: 'select', options: SORTS },
    showIconLeft: { control: 'boolean' },
  },
  decorators: [(Story) => (
    <div style={{ padding: 24 }}>
      <table style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <Story />
          </tr>
        </thead>
      </table>
    </div>
  )],
};
export default meta;
type Story = StoryObj<typeof TableHeaderCell>;

/* ── Default ── */
export const Default: Story = {
  args: {
    size:     'md',
    sort:     'none',
    children: 'Column',
  },
};

/* ── Все варианты sort ── */
export const AllSorts: Story = {
  render: (args) => (
    <table style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {SORTS.map((s) => (
            <TableHeaderCell key={s} {...args} sort={s}>
              {s === 'none' ? 'Column' : s === 'asc' ? 'Name ↑' : 'Name ↓'}
            </TableHeaderCell>
          ))}
        </tr>
      </thead>
    </table>
  ),
  args: { size: 'md' },
  decorators: [(Story) => <div style={{ padding: 24 }}><Story /></div>],
};

/* ── Все размеры ── */
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {SIZES.map((s) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 24, fontSize: 12, color: 'var(--color-text-muted)', flexShrink: 0 }}>{s}</span>
          <table style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <TableHeaderCell size={s} sort="none">Column</TableHeaderCell>
                <TableHeaderCell size={s} sort="asc">Name</TableHeaderCell>
                <TableHeaderCell size={s} sort="desc">Date</TableHeaderCell>
              </tr>
            </thead>
          </table>
        </div>
      ))}
    </div>
  ),
  decorators: [(Story) => <div style={{ padding: 24 }}><Story /></div>],
};

/* ── С иконкой слева ── */
export const WithIconLeft: Story = {
  render: (args) => (
    <table style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <TableHeaderCell {...args} showIconLeft iconLeft={<SearchIcon size={16} />} sort="none">Search</TableHeaderCell>
          <TableHeaderCell {...args} showIconLeft iconLeft={<SearchIcon size={16} />} sort="asc">Name</TableHeaderCell>
          <TableHeaderCell {...args} sort="none">No icon</TableHeaderCell>
        </tr>
      </thead>
    </table>
  ),
  args: { size: 'md' },
  decorators: [(Story) => <div style={{ padding: 24 }}><Story /></div>],
};

/* ── Интерактивная сортировка ── */
export const Interactive: Story = {
  render: (args) => {
    const [sorts, setSorts] = useState<Record<string, TableHeaderCellSort>>({
      name:   'none',
      date:   'asc',
      status: 'none',
      amount: 'desc',
    });

    const handleSort = (col: string) => (next: TableHeaderCellSort) => {
      // Сброс остальных при смене
      setSorts(() => {
        const fresh: Record<string, TableHeaderCellSort> = {
          name: 'none', date: 'none', status: 'none', amount: 'none'
        };
        fresh[col] = next;
        return fresh;
      });
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
          Нажмите на заголовок для сортировки
        </div>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              {Object.entries(sorts).map(([col, s]) => (
                <TableHeaderCell
                  key={col}
                  {...args}
                  sort={s}
                  onSortChange={handleSort(col)}
                  style={{ width: '25%' }}
                >
                  {col.charAt(0).toUpperCase() + col.slice(1)}
                </TableHeaderCell>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {['Alice', 'Jan 1', 'Active', '$100'].map((v, i) => (
                <td key={i} style={{
                  padding: '6px 16px',
                  fontSize: 14,
                  borderBottom: '1px solid var(--color-border-base)',
                  color: 'var(--color-text-primary)',
                }}>{v}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  },
  args: { size: 'md' },
  decorators: [(Story) => <div style={{ padding: 24, maxWidth: 600 }}><Story /></div>],
};

/* ── Полная матрица: sizes × sorts ── */
export const FullMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {SIZES.map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            size={s}
          </div>
          <table style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {SORTS.map((st) => (
                  <TableHeaderCell key={st} size={s} sort={st}>
                    {st === 'none' ? 'Column' : st === 'asc' ? 'Name' : 'Date'}
                  </TableHeaderCell>
                ))}
                <TableHeaderCell size={s} sort="none" showIconLeft iconLeft={<SearchIcon size={s === 'lg' ? 20 : 16} />}>
                  With icon
                </TableHeaderCell>
              </tr>
            </thead>
          </table>
        </div>
      ))}
    </div>
  ),
  decorators: [(Story) => <div style={{ padding: 24 }}><Story /></div>],
};
