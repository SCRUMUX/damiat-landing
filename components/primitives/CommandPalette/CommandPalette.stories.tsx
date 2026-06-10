import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CommandPalette } from './CommandPalette';

const meta: Meta<typeof CommandPalette> = {
  title: 'Primitives/CommandPalette',
  component: CommandPalette,
  parameters: {
    docs: {
      description: {
        component: 'CommandPalette — searchable command dialog (cmdk + Radix Dialog).',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof CommandPalette>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <button type="button" onClick={() => setOpen(true)}>Open Command Palette</button>
        <CommandPalette
          open={open}
          onOpenChange={setOpen}
          actions={[
            { id: 'home', label: 'Go to Home', group: 'Navigation', onSelect: () => alert('Home') },
            { id: 'settings', label: 'Settings', group: 'Navigation', shortcut: '⌘ ,' },
            { id: 'new', label: 'New Project', group: 'Actions', shortcut: '⌘ N' },
            { id: 'logout', label: 'Sign out', group: 'Account' },
          ]}
        />
      </>
    );
  },
};
