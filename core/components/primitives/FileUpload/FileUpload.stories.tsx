import type { Meta, StoryObj } from '@storybook/react';
import { FileUpload } from './FileUpload';

const SIZES = ['sm', 'md', 'lg'] as const;
const STATES = ['idle', 'dragover', 'uploading', 'done', 'error'] as const;

const meta: Meta<typeof FileUpload> = {
  title: 'Primitives/FileUpload',
  component: FileUpload,
  parameters: {
    docs: {
      description: {
        component: 'File upload zone with drag-and-drop. States: idle, dragover, uploading, done, error. Sizes sm/md/lg.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: SIZES },
    state: { control: 'select', options: STATES },
  },
};
export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
  args: { children: 'Drop files here or click to upload', size: 'md', state: 'idle' },
};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'stretch', padding: 16 }}>
      {SIZES.map((s) => (
        <FileUpload key={s} {...args} size={s} className="min-w-[var(--space-160)]">
          {s}
        </FileUpload>
      ))}
    </div>
  ),
  args: { state: 'idle' },
};

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, padding: 16 }}>
      {STATES.map((st) => (
        <FileUpload key={st} {...args} state={st} className="min-w-[var(--space-200)]">
          {st === 'done' ? 'Upload complete' : st === 'error' ? 'Upload failed' : st}
        </FileUpload>
      ))}
    </div>
  ),
  args: { size: 'md' },
};
