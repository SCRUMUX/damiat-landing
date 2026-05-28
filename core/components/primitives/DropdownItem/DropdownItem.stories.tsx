/**
 * AUTO-GENERATED – do not edit by hand.
 * Regenerate: npm run stories:generate
 */
import type { Meta, StoryObj } from '@storybook/react';
import { DropdownItem } from './DropdownItem';
import { SearchIcon, ChevronRightIcon } from '../../icons';
import { Checkbox } from '../Checkbox/Checkbox';
import { Badge } from '../Badge/Badge';

const meta: Meta<typeof DropdownItem> = {
  title: 'Primitives/DropdownItem',
  component: DropdownItem,
  parameters: {
    docs: { description: { component: "DropdownItem: пункт меню для Popover/Submenu. Оси: size (sm/md/lg) × itemType (default/primary/danger). Каждый вариант всегда содержит все 4 слота: Icon (left), Label, Badge, Icon (right). Видимость слотов управляется BOOLEAN props. Icon (right) — chevron или check через INSTANCE_SWAP. Используется в @UI/Dropdown через instance swap." } },
  },
  argTypes: {
    size: { control: 'select', options: ["sm","md","lg"] },
    appearance: { control: 'select', options: ["default","primary","danger"] },
    showCheckbox: { control: 'boolean' },
    showIconLeft: { control: 'boolean' },
    showBadge: { control: 'boolean' },
    showIconRight: { control: 'boolean' },
    checkbox: { control: false },
    badge: { control: false },
  },
};
export default meta;
type Story = StoryObj<typeof DropdownItem>;

export const Default: Story = {
  args: { children: 'Option', size: 'sm', appearance: 'default', iconLeft: <SearchIcon style={{ width: '1em', height: '1em' }} />, iconRight: <ChevronRightIcon style={{ width: '1em', height: '1em' }} />, checkbox: <Checkbox size="sm" />, badge: <Badge appearance="outline" size="sm">5</Badge>, showCheckbox: true, showIconLeft: true, showBadge: true, showIconRight: true },
};

export const AllSlotsVisible: Story = {
  args: { children: 'Option', size: 'sm', appearance: 'default', showCheckbox: true, showIconLeft: true, showBadge: true, showIconRight: true, iconLeft: <SearchIcon style={{ width: '1em', height: '1em' }} />, iconRight: <ChevronRightIcon style={{ width: '1em', height: '1em' }} />, checkbox: <Checkbox size="sm" />, badge: <Badge appearance="outline" size="sm">5</Badge> },
};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      {["sm","md","lg"].map((s) => (
        <DropdownItem key={s} {...args} size={s as any}>{s}</DropdownItem>
      ))}
    </div>
  ),
  args: { size: 'sm', appearance: 'default', iconLeft: <SearchIcon style={{ width: '1em', height: '1em' }} />, iconRight: <ChevronRightIcon style={{ width: '1em', height: '1em' }} />, checkbox: <Checkbox size="sm" />, badge: <Badge appearance="outline" size="sm">5</Badge>, showCheckbox: true, showIconLeft: true, showBadge: true, showIconRight: true },
};

export const AllAppearances: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      {["default","primary","danger"].map((v) => (
        <DropdownItem key={v} {...args} appearance={v as any}>{v}</DropdownItem>
      ))}
    </div>
  ),
  args: { size: 'sm', appearance: 'default', iconLeft: <SearchIcon style={{ width: '1em', height: '1em' }} />, iconRight: <ChevronRightIcon style={{ width: '1em', height: '1em' }} />, checkbox: <Checkbox size="sm" />, badge: <Badge appearance="outline" size="sm">5</Badge>, showCheckbox: true, showIconLeft: true, showBadge: true, showIconRight: true },
};
