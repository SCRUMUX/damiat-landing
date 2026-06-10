import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TableHeaderRow } from './TableHeaderRow';
import { TableHeaderCell } from '../TableHeaderCell/TableHeaderCell';
import { Checkbox } from '../Checkbox/Checkbox';
import type { TableHeaderRowColumn } from './TableHeaderRow.types';

const SIZES = ['sm', 'md', 'lg'] as const;

const DEFAULT_COLUMNS: TableHeaderRowColumn[] = [
  { label: 'Name',   key: 'name' },
  { label: 'Role',   key: 'role' },
  { label: 'Status', key: 'status' },
  { label: 'Score',  key: 'score' },
];

const meta: Meta<typeof TableHeaderRow> = {
  title: 'Primitives/TableHeaderRow',
  component: TableHeaderRow,
  parameters: {
    docs: {
      description: {
        component:
          'TableHeaderRow (@UI/Table/HeaderRow): строка заголовков таблицы. ' +
          'Рендерится как <tr> внутри <thead>. ' +
          'Содержит TableHeaderCell инстансы. ' +
          '3 размера (sm/md/lg). Фон: surface-1. Border: bottom border-base. ' +
          'Figma: 161:90330.',
      },
    },
  },
  argTypes: {
    size:               { control: 'select', options: SIZES },
    showCheckboxColumn: { control: 'boolean' },
  },
  decorators: [(Story) => (
    <div style={{ padding: 24 }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <Story />
        </thead>
      </table>
    </div>
  )],
};
export default meta;
type Story = StoryObj<typeof TableHeaderRow>;

/* ── Default ── */
export const Default: Story = {
  args: {
    size:    'md',
    columns: DEFAULT_COLUMNS,
  },
};

/* ── Все размеры ── */
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {SIZES.map((s) => (
        <div key={s}>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>size={s}</div>
          <table style={{ borderCollapse: 'collapse', width: 560 }}>
            <thead>
              <TableHeaderRow {...args} size={s} columns={DEFAULT_COLUMNS} />
            </thead>
          </table>
        </div>
      ))}
    </div>
  ),
  decorators: [(Story) => <div style={{ padding: 24 }}><Story /></div>],
};

/* ── С Checkbox колонкой ── */
export const WithCheckboxColumn: Story = {
  args: {
    size:               'md',
    showCheckboxColumn: true,
    checkbox:           <Checkbox size="sm" />,
    columns:            DEFAULT_COLUMNS,
  },
};

/* ── С сортировкой (статичная) ── */
export const WithSort: Story = {
  args: {
    size: 'md',
    columns: [
      { label: 'Name',   key: 'name',   sort: 'asc'  },
      { label: 'Role',   key: 'role',   sort: 'desc' },
      { label: 'Status', key: 'status', sort: 'none' },
      { label: 'Score',  key: 'score',  sort: 'none' },
    ],
  },
};

/* ── Интерактивная сортировка ── */
export const Interactive: Story = {
  render: () => {
    type SortKey = 'name' | 'role' | 'status' | 'score';
    type SortState = 'none' | 'asc' | 'desc';

    const nextSort = (s: SortState): SortState =>
      s === 'none' ? 'asc' : s === 'asc' ? 'desc' : 'none';

    const [sorts, setSorts] = useState<Record<SortKey, SortState>>({
      name: 'none', role: 'none', status: 'none', score: 'none',
    });

    const toggle = (key: SortKey) =>
      setSorts((prev) => ({ ...prev, [key]: nextSort(prev[key]) }));

    const columns: TableHeaderRowColumn[] = [
      { label: 'Name',   key: 'name',   sort: sorts.name,   onSortChange: () => toggle('name') },
      { label: 'Role',   key: 'role',   sort: sorts.role,   onSortChange: () => toggle('role') },
      { label: 'Status', key: 'status', sort: sorts.status, onSortChange: () => toggle('status') },
      { label: 'Score',  key: 'score',  sort: sorts.score,  onSortChange: () => toggle('score') },
    ];

    return (
      <div style={{ padding: 24 }}>
        <table style={{ borderCollapse: 'collapse', width: 560 }}>
          <thead>
            <TableHeaderRow size="md" columns={columns} />
          </thead>
        </table>
        <p style={{ marginTop: 12, fontSize: 12, color: 'var(--color-text-muted)' }}>
          Кликните на заголовок колонки для смены сортировки (none → asc → desc → none)
        </p>
      </div>
    );
  },
  decorators: [(Story) => <Story />],
};

/* ── Через children (ручная вёрстка) ── */
export const WithChildren: Story = {
  render: (args) => (
    <table style={{ borderCollapse: 'collapse', width: 560 }}>
      <thead>
        <TableHeaderRow {...args} size="md">
          <TableHeaderCell size="md" className="flex-1">Name</TableHeaderCell>
          <TableHeaderCell size="md" className="flex-1" sort="asc" onSortChange={() => {}}>Date</TableHeaderCell>
          <TableHeaderCell size="md" className="flex-1">Status</TableHeaderCell>
          <TableHeaderCell size="md" className="w-24">Actions</TableHeaderCell>
        </TableHeaderRow>
      </thead>
    </table>
  ),
  decorators: [(Story) => <div style={{ padding: 24 }}><Story /></div>],
};

/* ── Полная матрица sizes × sort states ── */
export const FullMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 24 }}>
      {SIZES.map((s) => (
        <div key={s}>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>size={s}</div>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <TableHeaderRow
                size={s}
                columns={[
                  { label: 'Name (none)', key: 'name', sort: 'none' },
                  { label: 'Date (asc)',  key: 'date', sort: 'asc', onSortChange: () => {} },
                  { label: 'Role (desc)', key: 'role', sort: 'desc', onSortChange: () => {} },
                  { label: 'Score',       key: 'score', sort: 'none', onSortChange: () => {} },
                ]}
              />
            </thead>
          </table>
        </div>
      ))}
    </div>
  ),
  decorators: [(Story) => <Story />],
};

/* ── В контексте реальной таблицы ── */
export const InTableContext: Story = {
  render: () => {
    const rows = [
      { name: 'Alice Johnson', role: 'Designer', status: 'Active', score: 98 },
      { name: 'Bob Smith',     role: 'Engineer', status: 'Pending', score: 73 },
      { name: 'Carol White',   role: 'Manager',  status: 'Inactive', score: 85 },
    ];

    return (
      <div style={{ padding: 24 }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <TableHeaderRow
              size="md"
              columns={[
                { label: 'Name',   key: 'name', sort: 'asc', onSortChange: () => {} },
                { label: 'Role',   key: 'role' },
                { label: 'Status', key: 'status' },
                { label: 'Score',  key: 'score' },
              ]}
            />
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} style={{ borderBottom: '1px solid var(--color-border-base)' }}>
                <td style={{ padding: '6px 16px', fontSize: 14 }}>{r.name}</td>
                <td style={{ padding: '6px 16px', fontSize: 14 }}>{r.role}</td>
                <td style={{ padding: '6px 16px', fontSize: 14 }}>{r.status}</td>
                <td style={{ padding: '6px 16px', fontSize: 14, textAlign: 'right' }}>{r.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
  decorators: [(Story) => <Story />],
};
