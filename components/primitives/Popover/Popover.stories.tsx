import React, { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Popover } from './Popover';
import { Button } from '../Button/Button';

const meta: Meta<typeof Popover> = {
  title: 'Primitives/Popover',
  component: Popover,
  parameters: {
    docs: {
      description: {
        component:
          '`Popover` — positioned floating panel anchored to a reference element. Handles viewport flip detection. Used internally by Dropdown and Autocomplete; also available for custom popover patterns.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => {
    const anchorRef = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);

    return (
      <div style={{ position: 'relative', display: 'inline-block', padding: 40 }}>
        <Button ref={anchorRef} size="sm" onClick={() => setOpen((p) => !p)}>
          Toggle Popover
        </Button>
        <Popover anchorRef={anchorRef} open={open} aria-label="Demo popover">
          <div style={{ padding: 12 }}>
            <p style={{ margin: 0 }}>Popover content goes here.</p>
          </div>
        </Popover>
      </div>
    );
  },
};

export const WithAutoFlip: Story = {
  render: () => {
    const anchorRef = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(true);

    return (
      <div style={{ position: 'relative', display: 'inline-block', marginTop: 300 }}>
        <Button ref={anchorRef} size="sm" onClick={() => setOpen((p) => !p)}>
          Flip demo (scroll down)
        </Button>
        <Popover anchorRef={anchorRef} open={open} autoFlip aria-label="Flip demo">
          <div style={{ padding: 12 }}>
            <p style={{ margin: 0 }}>This popover will flip above the anchor if there is not enough space below.</p>
          </div>
        </Popover>
      </div>
    );
  },
};
