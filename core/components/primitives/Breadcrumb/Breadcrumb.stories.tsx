import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb } from './Breadcrumb';
import { Badge } from '../Badge/Badge';
import { BellIcon } from '../../icons';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Primitives/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    docs: {
      description: {
        component:
          'Breadcrumb (@UI/Breadcrumb): 4 уровня вложенности. ' +
          'Каждый item — инстанс SectionHeader. Разделитель — ChevronRight 12×12. ' +
          'Figma: 160:72559.',
      },
    },
  },
  argTypes: {
    levels: { control: 'select', options: ['1', '2', '3', '4'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};
export default meta;
type Story = StoryObj<typeof Breadcrumb>;

/* ── Default: 1 level ── */
export const Default: Story = {
  args: { levels: '1', size: 'sm' },
};

/* ── All levels ── */
export const AllLevels: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(['1', '2', '3', '4'] as const).map((l) => (
        <Breadcrumb key={l} {...args} levels={l} />
      ))}
    </div>
  ),
  args: { size: 'sm' },
};

/* ── Custom items ── */
export const CustomItems: Story = {
  args: {
    size: 'sm',
    items: [
      { label: 'Home', href: '#' },
      { label: 'Products', href: '#' },
      { label: 'Electronics', href: '#' },
      { label: 'Laptops' },
    ],
  },
};

/* ── With icons and badge ── */
export const WithSlotsInItems: Story = {
  args: {
    size: 'sm',
    items: [
      {
        label: 'Dashboard',
        href: '#',
        iconLeft: <BellIcon style={{ width: '100%', height: '100%' }} />,
      },
      {
        label: 'Reports',
        href: '#',
        badge: <Badge appearance="brand" size="sm">12</Badge>,
      },
      { label: 'Monthly' },
    ],
  },
};

/* ── All sizes ── */
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <Breadcrumb
          key={s}
          size={s}
          items={[
            { label: 'Section', href: '#' },
            { label: 'Category', href: '#' },
            { label: 'Current page' },
          ]}
        />
      ))}
    </div>
  ),
};

/* ── Single item (levels=1) ── */
export const SingleItem: Story = {
  args: {
    size: 'sm',
    items: [{ label: 'Current page' }],
  },
};
