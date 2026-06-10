import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TableRow } from './TableRow';
import { TableCell } from '../TableCell/TableCell';
import { TableHeaderRow } from '../TableHeaderRow/TableHeaderRow';
import { Checkbox } from '../Checkbox/Checkbox';
import { Badge } from '../Badge/Badge';
import { PersonIcon, GearIcon } from '../../icons';

const SIZES = ['sm', 'md', 'lg'] as const;
const STATES = ['base', 'hover', 'selected', 'disabled'] as const;

const meta: Meta<typeof TableRow> = {
  title: 'Primitives/TableRow',
  component: TableRow,
  parameters: {
    docs: {
      description: {
        component:
          'TableRow (@UI/Table/Row): строка данных таблицы. ' +
          'Рендерится как <tr> внутри <tbody>. ' +
          '3 размера (sm/md/lg), 4 состояния (base/hover/selected/disabled). ' +
          'Фон: base=surface-1, hover=surface-2, selected=brand-muted, disabled=surface-2+opacity50. ' +
          'Figma: 161:90212.',
      },
    },
  },
  argTypes: {
    size:               { control: 'select', options: SIZES },
    state:              { control: 'select', options: STATES },
    selected:           { control: 'boolean' },
    disabled:           { control: 'boolean' },
    showCheckboxColumn: { control: 'boolean' },
  },
  decorators: [(Story) => (
    <div style={{ padding: 24 }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <tbody>
          <Story />
        </tbody>
      </table>
    </div>
  )],
};
export default meta;
type Story = StoryObj<typeof TableRow>;

/* ── Default ── */
export const Default: Story = {
  args: {
    size: 'md',
  },
  render: (args) => (
    <TableRow {...args}>
      <TableCell size={args.size ?? 'md'} type="text">Alice Johnson</TableCell>
      <TableCell size={args.size ?? 'md'} type="text">Designer</TableCell>
      <TableCell size={args.size ?? 'md'} type="badge" showBadge badge={<Badge appearance="success" size="sm">Active</Badge>} />
      <TableCell size={args.size ?? 'md'} type="numeric">98.5</TableCell>
    </TableRow>
  ),
};

/* ── Все состояния ── */
export const AllStates: Story = {
  render: () => (
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <tbody>
        {STATES.map((st) => (
          <TableRow key={st} size="md" state={st}>
            <TableCell size="md" type="text" style={{ minWidth: 80 }}>{st}</TableCell>
            <TableCell size="md" type="text">Alice Johnson</TableCell>
            <TableCell size="md" type="text">Designer</TableCell>
            <TableCell size="md" type="numeric">98.5</TableCell>
          </TableRow>
        ))}
      </tbody>
    </table>
  ),
  decorators: [(Story) => <div style={{ padding: 24 }}><Story /></div>],
};

/* ── Все размеры ── */
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {SIZES.map((s) => (
        <div key={s}>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>size={s}</div>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <tbody>
              <TableRow size={s}>
                <TableCell size={s} type="text">Alice Johnson</TableCell>
                <TableCell size={s} type="text">Designer</TableCell>
                <TableCell size={s} type="badge" showBadge badge={<Badge appearance="success" size="sm">Active</Badge>} />
                <TableCell size={s} type="numeric">98.5</TableCell>
              </TableRow>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  ),
  decorators: [(Story) => <div style={{ padding: 24 }}><Story /></div>],
};

/* ── С Checkbox колонкой ── */
export const WithCheckboxColumn: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <tbody>
          <TableRow
            size="md"
            selected={checked}
            showCheckboxColumn
            checkbox={
              <Checkbox
                size="sm"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
              />
            }
          >
            <TableCell size="md" type="text">Alice Johnson</TableCell>
            <TableCell size="md" type="text">Designer</TableCell>
            <TableCell size="md" type="badge" showBadge badge={<Badge appearance="success" size="sm">Active</Badge>} />
            <TableCell size="md" type="numeric">98.5</TableCell>
          </TableRow>
        </tbody>
      </table>
    );
  },
  decorators: [(Story) => <div style={{ padding: 24 }}><Story /></div>],
};

/* ── Интерактивный выбор строк ── */
export const Interactive: Story = {
  render: () => {
    const rows = [
      { id: 1, name: 'Alice Johnson', role: 'Designer', status: 'Active', score: 98 },
      { id: 2, name: 'Bob Smith',     role: 'Engineer', status: 'Pending', score: 73 },
      { id: 3, name: 'Carol White',   role: 'Manager',  status: 'Active',  score: 85 },
      { id: 4, name: 'Dave Brown',    role: 'Designer', status: 'Inactive', score: 60 },
    ];
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const statusBadge = (s: string) =>
      s === 'Active' ? 'success' : s === 'Pending' ? 'warning' : 'danger';

    return (
      <div style={{ padding: 24 }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <TableHeaderRow
              size="md"
              columns={[
                { label: 'Name',   key: 'name' },
                { label: 'Role',   key: 'role' },
                { label: 'Status', key: 'status' },
                { label: 'Score',  key: 'score' },
              ]}
            />
          </thead>
          <tbody>
            {rows.map((r) => (
              <TableRow
                key={r.id}
                size="md"
                selected={selectedId === r.id}
                onSelect={() => setSelectedId(selectedId === r.id ? null : r.id)}
              >
                <TableCell size="md" type="text">{r.name}</TableCell>
                <TableCell size="md" type="text">{r.role}</TableCell>
                <TableCell size="md" type="badge" showBadge
                  badge={<Badge appearance={statusBadge(r.status) as any} size="sm">{r.status}</Badge>}
                />
                <TableCell size="md" type="numeric">{r.score}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: 12, fontSize: 12, color: 'var(--color-text-muted)' }}>
          Кликните строку для выбора / снятия выбора
        </p>
      </div>
    );
  },
  decorators: [(Story) => <Story />],
};

/* ── Полная матрица sizes × states ── */
export const FullMatrix: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      {SIZES.map((s) => (
        <div key={s} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>size={s}</div>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <TableHeaderRow size={s} columns={[
                { label: 'State', key: 'state' },
                { label: 'Name',  key: 'name' },
                { label: 'Role',  key: 'role' },
                { label: 'Score', key: 'score' },
              ]} />
            </thead>
            <tbody>
              {STATES.map((st) => (
                <TableRow key={st} size={s} state={st}>
                  <TableCell size={s} type="text" style={{ minWidth: 80, color: 'var(--color-text-muted)', fontSize: 11 }}>{st}</TableCell>
                  <TableCell size={s} type="text">Alice Johnson</TableCell>
                  <TableCell size={s} type="text">Designer</TableCell>
                  <TableCell size={s} type="numeric">98.5</TableCell>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  ),
  decorators: [(Story) => <Story />],
};

/* ── Реальная таблица с Checkbox выбором ── */
export const RealTableWithSelection: Story = {
  render: () => {
    const rows = [
      { id: 1, name: 'Alice Johnson', role: 'Designer',  status: 'Active',   score: 98 },
      { id: 2, name: 'Bob Smith',     role: 'Engineer',  status: 'Pending',  score: 73 },
      { id: 3, name: 'Carol White',   role: 'Manager',   status: 'Active',   score: 85 },
      { id: 4, name: 'Dave Brown',    role: 'Designer',  status: 'Inactive', score: 60 },
      { id: 5, name: 'Eve Davis',     role: 'Engineer',  status: 'Active',   score: 91 },
    ];

    const [selected, setSelected] = useState<Set<number>>(new Set());
    const toggleRow = (id: number) =>
      setSelected((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    const toggleAll = () =>
      setSelected(selected.size === rows.length ? new Set() : new Set(rows.map((r) => r.id)));

    const isAllSelected = selected.size === rows.length;
    const isPartialSelected = selected.size > 0 && !isAllSelected;

    const statusBadge = (s: string) =>
      s === 'Active' ? 'success' : s === 'Pending' ? 'warning' : 'danger';

    return (
      <div style={{ padding: 24 }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <TableHeaderRow
              size="md"
              showCheckboxColumn
              checkbox={
                <Checkbox
                  size="sm"
                  checked={isAllSelected}
                  indeterminate={isPartialSelected}
                  onChange={toggleAll}
                />
              }
              columns={[
                { label: 'Name',   key: 'name' },
                { label: 'Role',   key: 'role' },
                { label: 'Status', key: 'status' },
                { label: 'Score',  key: 'score' },
              ]}
            />
          </thead>
          <tbody>
            {rows.map((r) => (
              <TableRow
                key={r.id}
                size="md"
                selected={selected.has(r.id)}
                showCheckboxColumn
                checkbox={
                  <Checkbox
                    size="sm"
                    checked={selected.has(r.id)}
                    onChange={() => toggleRow(r.id)}
                  />
                }
                onSelect={() => toggleRow(r.id)}
              >
                <TableCell size="md" type="text" showIconLeft iconLeft={<PersonIcon size={16} />}>{r.name}</TableCell>
                <TableCell size="md" type="text">{r.role}</TableCell>
                <TableCell size="md" type="badge" showBadge
                  badge={<Badge appearance={statusBadge(r.status) as any} size="sm">{r.status}</Badge>}
                />
                <TableCell size="md" type="numeric">{r.score}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: 12, fontSize: 12, color: 'var(--color-text-muted)' }}>
          Выбрано: {selected.size} из {rows.length}
        </p>
      </div>
    );
  },
  decorators: [(Story) => <Story />],
};
