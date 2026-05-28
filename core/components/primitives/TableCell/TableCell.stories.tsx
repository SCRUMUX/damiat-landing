import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TableCell } from './TableCell';
import { Checkbox } from '../Checkbox/Checkbox';
import { Badge } from '../Badge/Badge';
import { SearchIcon, PersonIcon, GearIcon } from '../../icons';

const SIZES = ['sm', 'md', 'lg'] as const;
const TYPES = ['text', 'badge', 'tag', 'actions', 'numeric'] as const;

const meta: Meta<typeof TableCell> = {
  title: 'Primitives/TableCell',
  component: TableCell,
  parameters: {
    docs: {
      description: {
        component:
          'TableCell (@UI/Table/Cell): ячейка данных таблицы. ' +
          'Рендерится как <td>. Используется инстансами в TableRow → Table. ' +
          '3 размера (sm/md/lg), 5 типов (text/badge/tag/actions/numeric). ' +
          'Слоты: checkbox, iconLeft, label, badge, iconAction. ' +
          'Figma: 161:89473.',
      },
    },
  },
  argTypes: {
    size:           { control: 'select', options: SIZES },
    type:           { control: 'select', options: TYPES },
    showCheckbox:   { control: 'boolean' },
    showIconLeft:   { control: 'boolean' },
    showBadge:      { control: 'boolean' },
    showIconAction: { control: 'boolean' },
  },
  decorators: [(Story) => (
    <div style={{ padding: 24 }}>
      <table style={{ borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <Story />
          </tr>
        </tbody>
      </table>
    </div>
  )],
};
export default meta;
type Story = StoryObj<typeof TableCell>;

/* ── Default — text ── */
export const Default: Story = {
  args: {
    size:     'md',
    type:     'text',
    children: 'Cell content',
  },
};

/* ── Все типы ── */
export const AllTypes: Story = {
  render: (args) => (
    <table style={{ borderCollapse: 'collapse' }}>
      <tbody>
        <tr>
          <TableCell {...args} type="text">Cell content</TableCell>
          <TableCell {...args} type="badge" showBadge badge={<Badge appearance="brand" size="sm">Active</Badge>}>
            With badge
          </TableCell>
          <TableCell {...args} type="tag" showBadge badge={<Badge appearance="outline" size="sm">Tag</Badge>}>
            With tag
          </TableCell>
          <TableCell {...args} type="actions" showIconAction iconAction={<GearIcon size={16} />}>
            Actions
          </TableCell>
          <TableCell {...args} type="numeric">1 234 567</TableCell>
        </tr>
      </tbody>
    </table>
  ),
  args: { size: 'md' },
  decorators: [(Story) => <div style={{ padding: 24 }}><Story /></div>],
};

/* ── Все размеры ── */
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {SIZES.map((s) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 24, fontSize: 12, color: 'var(--color-text-muted)', flexShrink: 0 }}>{s}</span>
          <table style={{ borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <TableCell {...args} size={s} type="text">Cell content</TableCell>
                <TableCell {...args} size={s} type="numeric">1 234</TableCell>
                <TableCell {...args} size={s} type="badge" showBadge badge={<Badge appearance="brand" size={'sm'}>Active</Badge>}>
                  Badge
                </TableCell>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  ),
  decorators: [(Story) => <div style={{ padding: 24 }}><Story /></div>],
};

/* ── Со всеми слотами ── */
export const AllSlots: Story = {
  render: (args) => (
    <table style={{ borderCollapse: 'collapse' }}>
      <tbody>
        <tr>
          <TableCell
            {...args}
            showCheckbox
            checkbox={<Checkbox size="sm" />}
            showIconLeft
            iconLeft={<PersonIcon size={16} />}
            showBadge
            badge={<Badge appearance="brand" size="sm">New</Badge>}
            showIconAction
            iconAction={<GearIcon size={16} />}
          >
            All slots visible
          </TableCell>
        </tr>
      </tbody>
    </table>
  ),
  args: { size: 'md', type: 'text' },
  decorators: [(Story) => <div style={{ padding: 24 }}><Story /></div>],
};

/* ── Полная матрица: sizes × types ── */
export const FullMatrix: Story = {
  render: () => (
    <div style={{ overflowX: 'auto', padding: 24 }}>
      <table style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '4px 16px 8px 0', fontSize: 11, color: 'var(--color-text-muted)', textAlign: 'left', fontWeight: 400 }}>size</th>
            {TYPES.map((t) => (
              <th key={t} style={{ padding: '4px 16px 8px', fontSize: 11, color: 'var(--color-text-muted)', textAlign: 'left', fontWeight: 400 }}>{t}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SIZES.map((s) => (
            <tr key={s}>
              <td style={{ padding: '4px 16px 4px 0', fontSize: 12, color: 'var(--color-text-muted)' }}>{s}</td>
              <TableCell size={s} type="text">Cell content</TableCell>
              <TableCell size={s} type="badge" showBadge badge={<Badge appearance="brand" size={'sm'}>Active</Badge>}>
                Badge
              </TableCell>
              <TableCell size={s} type="tag" showBadge badge={<Badge appearance="outline" size={'sm'}>Tag</Badge>}>
                Tag
              </TableCell>
              <TableCell size={s} type="actions" showIconAction iconAction={<GearIcon size={s === 'lg' ? 20 : 16} />}>
                Actions
              </TableCell>
              <TableCell size={s} type="numeric">1 234 567</TableCell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
  decorators: [(Story) => <Story />],
};

/* ── Реальная таблица ── */
export const RealTable: Story = {
  render: () => {
    const rows = [
      { name: 'Alice Johnson', role: 'Designer', status: 'Active', score: 98.5, joined: '2023-01-15' },
      { name: 'Bob Smith',     role: 'Engineer', status: 'Pending', score: 73.2, joined: '2023-06-20' },
      { name: 'Carol White',   role: 'Manager',  status: 'Inactive', score: 85.0, joined: '2022-11-05' },
    ];
    const statusAppearance = (s: string) =>
      s === 'Active' ? 'success' : s === 'Pending' ? 'warning' : 'danger';

    return (
      <div style={{ padding: 24, overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name}>
                <TableCell size="md" type="text" showIconLeft iconLeft={<PersonIcon size={16} />}>
                  {r.name}
                </TableCell>
                <TableCell size="md" type="text">{r.role}</TableCell>
                <TableCell size="md" type="badge" showBadge badge={
                  <Badge appearance={statusAppearance(r.status) as any} size="sm">{r.status}</Badge>
                } />
                <TableCell size="md" type="numeric">{r.score.toFixed(1)}</TableCell>
                <TableCell size="md" type="text">{r.joined}</TableCell>
                <TableCell size="md" type="actions" showIconAction iconAction={<GearIcon size={16} />} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
  decorators: [(Story) => <Story />],
};
