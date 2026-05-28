import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Drawer } from './Drawer';
import type { DrawerSize, DrawerSide } from './Drawer.types';
import { Button } from '../Button/Button';

const SIZES: DrawerSize[] = ['sm', 'md', 'lg'];
const SIDES: DrawerSide[] = ['left', 'right'];

const meta: Meta<typeof Drawer> = {
  title: 'Primitives/Drawer',
  component: Drawer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '`@UI/Drawer` — боковая панель с overlay. Выезжает слева или справа. ' +
          'Размеры: sm (320px) / md (480px) / lg (640px). ' +
          'Props: `open`, `onClose`, `title`, `content`, `showClose`.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: SIZES },
    side: { control: 'select', options: SIDES },
    showClose: { control: 'boolean' },
    title: { control: 'text' },
    content: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof Drawer>;

const DrawerDemo: React.FC<{
  size?: DrawerSize;
  side?: DrawerSide;
  title?: string;
  content?: React.ReactNode;
  showClose?: boolean;
}> = ({
  size = 'sm',
  side = 'left',
  title = 'Drawer title',
  content = 'Drawer content goes here.',
  showClose = true,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ padding: 24 }}>
      <Button appearance="brand" size="sm" onClick={() => setOpen(true)}>
        Open drawer ({side}, {size})
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        size={size}
        side={side}
        title={title}
        content={content}
        showClose={showClose}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => (
    <DrawerDemo
      title="Navigation"
      content="Side panel content. Press ×, Escape, or click the overlay to close."
    />
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, padding: 24, flexWrap: 'wrap' }}>
      {SIZES.map((s) => (
        <DrawerDemo key={s} size={s} title={`Size ${s}`} content={`Drawer width: ${s}`} />
      ))}
    </div>
  ),
};

export const AllSides: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, padding: 24 }}>
      {SIDES.map((side) => (
        <DrawerDemo key={side} side={side} title={`${side} drawer`} content={`Slides from ${side}.`} />
      ))}
    </div>
  ),
};

export const NoCloseButton: Story = {
  render: () => (
    <DrawerDemo
      showClose={false}
      title="No close button"
      content="Close via overlay click or Escape."
    />
  ),
};

export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [side, setSide] = useState<DrawerSide>('left');
    const [size, setSize] = useState<DrawerSize>('md');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SIDES.map((s) => (
            <Button key={s} appearance={side === s ? 'brand' : 'outline'} size="sm" onClick={() => setSide(s)}>
              {s}
            </Button>
          ))}
          {SIZES.map((s) => (
            <Button key={s} appearance={size === s ? 'brand' : 'outline'} size="sm" onClick={() => setSize(s)}>
              {s}
            </Button>
          ))}
        </div>
        <Button appearance="brand" size="sm" onClick={() => setOpen(true)}>
          Open drawer
        </Button>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          side={side}
          size={size}
          title="Settings"
          content="Configure your preferences here. Drag or swipe to dismiss on touch devices."
        />
      </div>
    );
  },
};
