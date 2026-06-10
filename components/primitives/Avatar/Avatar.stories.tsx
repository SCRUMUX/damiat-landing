import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';
import { Badge } from '../Badge/Badge';

const VARIANTS = ['guest', 'registered-no-photo', 'registered-with-photo'] as const;
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

const AVATAR_SRC = '/images/Avatar.jpg';

const meta: Meta<typeof Avatar> = {
  title: 'Primitives/Avatar',
  component: Avatar,
  parameters: {
    docs: {
      description: {
        component:
          'Avatar: 3 типа (guest, registered-no-photo, registered-with-photo), 5 размеров (xs…xl). ' +
          'Badge — инстанс компонента Badge, позиция bottom-right.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    size: { control: 'select', options: SIZES },
    showBadge: { control: 'boolean' },
    initials: { control: 'text' },
    src: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof Avatar>;

/* ── Default ── */
export const Default: Story = {
  args: { variant: 'guest', size: 'md', showBadge: false },
};

/* ── All sizes — guest ── */
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
      {SIZES.map((s) => (
        <Avatar key={s} {...args} size={s} />
      ))}
    </div>
  ),
  args: { variant: 'guest', showBadge: false },
};

/* ── All variants — md ── */
export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Avatar {...args} variant="guest" />
      <Avatar {...args} variant="registered-no-photo" initials="VK" />
      <Avatar {...args} variant="registered-with-photo" src="/images/Avatar.png" initials="VK" />
    </div>
  ),
  args: { size: 'md', showBadge: false },
};

/* ── With Badge (инстанс Badge) ── */
export const WithBadge: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Avatar {...args} variant="guest" showBadge badgeContent="3" />
      <Avatar {...args} variant="registered-no-photo" initials="VK" showBadge badgeContent="12" />
      <Avatar
        {...args}
        variant="registered-with-photo"
        src="/images/Avatar.png"
        initials="VK"
        showBadge
        badgeContent="99+"
      />
    </div>
  ),
  args: { size: 'lg' },
};

/* ── Custom Badge as ReactNode ── */
export const CustomBadge: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Avatar
        variant="registered-no-photo"
        size="xl"
        initials="VK"
        showBadge
        badge={
          <Badge appearance="success" size="sm">
            ●
          </Badge>
        }
      />
      <Avatar
        variant="guest"
        size="xl"
        showBadge
        badge={
          <Badge appearance="danger" size="sm">
            !
          </Badge>
        }
      />
    </div>
  ),
};

/* ── All sizes with badge ── */
export const AllSizesWithBadge: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}>
      {SIZES.map((s) => (
        <Avatar key={s} {...args} size={s} showBadge badgeContent="3" />
      ))}
    </div>
  ),
  args: { variant: 'registered-no-photo', initials: 'VK' },
};

/* ── Full matrix: all variants × all sizes ── */
export const AllVariantsAllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {VARIANTS.map((v) => (
        <div key={v} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {SIZES.map((s) => (
            <Avatar
              key={s}
              variant={v}
              size={s}
              initials="VK"
              src={v === 'registered-with-photo' ? AVATAR_SRC : undefined}
            />
          ))}
        </div>
      ))}
    </div>
  ),
};
