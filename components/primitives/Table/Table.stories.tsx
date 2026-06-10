import React, { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Table } from './Table';
import { TableRow } from '../TableRow/TableRow';
import { TableCell } from '../TableCell/TableCell';
import { TableHeaderRow } from '../TableHeaderRow/TableHeaderRow';
import { Badge } from '../Badge/Badge';
import { Checkbox } from '../Checkbox/Checkbox';
import { SkeletonTable } from '../SkeletonTable/SkeletonTable';
import { PersonIcon } from '../../icons';
import type { TableColumn } from './Table.types';

const SIZES = ['sm', 'md', 'lg'] as const;
const APPEARANCES = ['base', 'striped', 'bordered'] as const;

/* ── Демо-данные ── */
interface Person {
  id: number;
  name: string;
  role: string;
  status: 'Active' | 'Pending' | 'Inactive';
  score: number;
  joined: string;
}

const DEMO_ROWS: Person[] = [
  { id: 1, name: 'Alice Johnson', role: 'Designer',  status: 'Active',   score: 98, joined: '2023-01-15' },
  { id: 2, name: 'Bob Smith',     role: 'Engineer',  status: 'Pending',  score: 73, joined: '2023-06-20' },
  { id: 3, name: 'Carol White',   role: 'Manager',   status: 'Active',   score: 85, joined: '2022-11-05' },
  { id: 4, name: 'Dave Brown',    role: 'Designer',  status: 'Inactive', score: 60, joined: '2024-02-10' },
];

const statusAppearance = (s: string): 'success' | 'warning' | 'danger' =>
  s === 'Active' ? 'success' : s === 'Pending' ? 'warning' : 'danger';

const DEMO_COLUMNS: TableColumn<Person>[] = [
  {
    key: 'name',
    label: 'Name',
    cellIconLeft: <PersonIcon size={16} />,
    render: (row) => row.name,
  },
  {
    key: 'role',
    label: 'Role',
    render: (row) => row.role,
  },
  {
    key: 'status',
    label: 'Status',
    cellType: 'badge',
    render: (row) => (
      <Badge appearance={statusAppearance(row.status)} size="sm">{row.status}</Badge>
    ),
  },
  {
    key: 'score',
    label: 'Score',
    cellType: 'numeric',
    render: (row) => String(row.score),
  },
];

const meta: Meta<typeof Table> = {
  title: 'Primitives/Table',
  component: Table,
  parameters: {
    docs: {
      description: {
        component:
          'Table (@UI/Table): полная таблица. ' +
          'Рендерится как семантический <table>. ' +
          'Содержит TableHeaderRow + TableRow инстансы. ' +
          '3 размера (sm/md/lg), 3 варианта (base/striped/bordered). ' +
          'Figma: 161:92875.',
      },
    },
  },
  argTypes: {
    size:               { control: 'select', options: SIZES },
    appearance:         { control: 'select', options: APPEARANCES },
    showCheckboxColumn: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Table>;

/* ── Default ── */
export const Default: Story = {
  render: (args) => (
    <div style={{ padding: 24 }}>
      <Table {...args} columns={DEMO_COLUMNS} rows={DEMO_ROWS} getRowKey={(r) => r.id} />
    </div>
  ),
  args: { size: 'md', appearance: 'base' },
  decorators: [(Story) => <Story />],
};

/* ── Все варианты (appearance) ── */
export const AllAppearances: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 24 }}>
      {APPEARANCES.map((a) => (
        <div key={a}>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 8 }}>appearance={a}</div>
          <Table size="md" appearance={a} columns={DEMO_COLUMNS} rows={DEMO_ROWS} getRowKey={(r) => r.id} />
        </div>
      ))}
    </div>
  ),
  decorators: [(Story) => <Story />],
};

/* ── Все размеры ── */
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 24 }}>
      {SIZES.map((s) => (
        <div key={s}>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 8 }}>size={s}</div>
          <Table size={s} appearance="base" columns={DEMO_COLUMNS} rows={DEMO_ROWS} getRowKey={(r) => r.id} />
        </div>
      ))}
    </div>
  ),
  decorators: [(Story) => <Story />],
};

/* ── Striped подробно ── */
export const Striped: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <Table size="md" appearance="striped" columns={DEMO_COLUMNS} rows={DEMO_ROWS} getRowKey={(r) => r.id} />
    </div>
  ),
  decorators: [(Story) => <Story />],
};

/* ── Bordered подробно ── */
export const Bordered: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <Table size="md" appearance="bordered" columns={DEMO_COLUMNS} rows={DEMO_ROWS} getRowKey={(r) => r.id} />
    </div>
  ),
  decorators: [(Story) => <Story />],
};

/* ── С сортировкой ── */
export const WithSort: Story = {
  render: () => {
    type SortKey = 'name' | 'role' | 'score';
    type SortState = 'none' | 'asc' | 'desc';
    const nextSort = (s: SortState): SortState =>
      s === 'none' ? 'asc' : s === 'asc' ? 'desc' : 'none';

    const [sorts, setSorts] = useState<Record<SortKey, SortState>>({
      name: 'none', role: 'none', score: 'none',
    });

    const toggle = (key: SortKey) =>
      setSorts((prev) => ({ ...prev, [key]: nextSort(prev[key]) }));

    const columns: TableColumn<Person>[] = [
      {
        key: 'name', label: 'Name',
        sort: sorts.name, onSortChange: () => toggle('name'),
        render: (row) => row.name,
      },
      {
        key: 'role', label: 'Role',
        sort: sorts.role, onSortChange: () => toggle('role'),
        render: (row) => row.role,
      },
      {
        key: 'status', label: 'Status', cellType: 'badge',
        render: (row) => <Badge appearance={statusAppearance(row.status)} size="sm">{row.status}</Badge>,
      },
      {
        key: 'score', label: 'Score', cellType: 'numeric',
        sort: sorts.score, onSortChange: () => toggle('score'),
        render: (row) => String(row.score),
      },
    ];

    return (
      <div style={{ padding: 24 }}>
        <Table size="md" appearance="base" columns={columns} rows={DEMO_ROWS} getRowKey={(r) => r.id} />
        <p style={{ marginTop: 12, fontSize: 12, color: 'var(--color-text-muted)' }}>
          Кликните заголовок для сортировки
        </p>
      </div>
    );
  },
  decorators: [(Story) => <Story />],
};

/* ── С выбором строк ── */
export const WithRowSelection: Story = {
  render: () => {
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    const toggleRow = (id: number) =>
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });

    const toggleAll = () =>
      setSelectedIds(selectedIds.size === DEMO_ROWS.length
        ? new Set()
        : new Set(DEMO_ROWS.map((r) => r.id)));

    const isAll = selectedIds.size === DEMO_ROWS.length;
    const isPartial = selectedIds.size > 0 && !isAll;

    return (
      <div style={{ padding: 24 }}>
        <Table
          size="md"
          appearance="base"
          showCheckboxColumn
          headerCheckbox={
            <Checkbox size="sm" checked={isAll} indeterminate={isPartial} onChange={toggleAll} />
          }
          columns={DEMO_COLUMNS}
          rows={DEMO_ROWS}
          getRowKey={(r) => r.id}
          selectedRowKeys={[...selectedIds]}
          getRowCheckbox={(row) => (
            <Checkbox
              size="sm"
              checked={selectedIds.has(row.id)}
              onChange={() => toggleRow(row.id)}
            />
          )}
          onRowSelect={(row) => toggleRow(row.id)}
        />
        <p style={{ marginTop: 12, fontSize: 12, color: 'var(--color-text-muted)' }}>
          Выбрано: {selectedIds.size} из {DEMO_ROWS.length}
        </p>
      </div>
    );
  },
  decorators: [(Story) => <Story />],
};

/* ── С disabled строками ── */
export const WithDisabledRows: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <Table
        size="md"
        appearance="base"
        columns={DEMO_COLUMNS}
        rows={DEMO_ROWS}
        getRowKey={(r) => r.id}
        disabledRowKeys={[2, 4]}
      />
      <p style={{ marginTop: 12, fontSize: 12, color: 'var(--color-text-muted)' }}>
        Строки 2 и 4 заблокированы
      </p>
    </div>
  ),
  decorators: [(Story) => <Story />],
};

/* ── Ручная вёрстка через children ── */
export const ManualLayout: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <Table size="md" appearance="bordered">
        <TableHeaderRow
          size="md"
          columns={[
            { key: 'name',   label: 'Name' },
            { key: 'role',   label: 'Role' },
            { key: 'status', label: 'Status' },
            { key: 'score',  label: 'Score' },
          ]}
        />
        {DEMO_ROWS.map((r) => (
          <TableRow key={r.id} size="md">
            <TableCell size="md" type="text">{r.name}</TableCell>
            <TableCell size="md" type="text">{r.role}</TableCell>
            <TableCell size="md" type="badge" showBadge
              badge={<Badge appearance={statusAppearance(r.status)} size="sm">{r.status}</Badge>}
            />
            <TableCell size="md" type="numeric">{r.score}</TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  ),
  decorators: [(Story) => <Story />],
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
      <div style={{ padding: 24 }}>
        {loading ? (
          <SkeletonTable size="md" shimmer rows={4} cols={4} />
        ) : (
          <Table size="md" appearance="base" columns={DEMO_COLUMNS} rows={DEMO_ROWS} getRowKey={(r) => r.id} />
        )}
        <button
          onClick={() => setLoading(true)}
          style={{
            marginTop: 12,
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
  decorators: [(Story) => <Story />],
};

/* ── Полная матрица sizes × appearances ── */
export const FullMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40, padding: 24 }}>
      {APPEARANCES.map((a) => (
        <div key={a}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 16 }}>
            appearance={a}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {SIZES.map((s) => (
              <div key={s}>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 6 }}>size={s}</div>
                <Table size={s} appearance={a} columns={DEMO_COLUMNS} rows={DEMO_ROWS} getRowKey={(r) => r.id} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
  decorators: [(Story) => <Story />],
};
