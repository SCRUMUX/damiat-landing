import type { Meta, StoryObj } from '@storybook/react';
import { BlogBlock } from './BlogBlock';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';
import { aicadsBlogDemoContent } from '../marketingDemoContent';
import { withBlogDemoMedia } from '../blogDemoMedia';

const meta: Meta<typeof BlogBlock> = {
  title: 'Blocks/Marketing/BlogBlock',
  component: BlogBlock,
  parameters: {
    ...marketingBlockParameters,
    controls: { disable: true },
  },
};
export default meta;

type Story = StoryObj<typeof BlogBlock>;

const renderBlogDemo = () => <BlogBlock {...withBlogDemoMedia({ ...aicadsBlogDemoContent })} />;

/** Cortel-style blog band — horizontal card slider with prev/next and view-all. */
export const Default: Story = {
  render: () => renderBlogDemo(),
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const Mobile: Story = {
  render: () => renderBlogDemo(),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};

export const Tablet: Story = {
  render: () => renderBlogDemo(),
  parameters: { viewport: { defaultViewport: 'tablet' } },
};

export const Desktop: Story = {
  render: () => renderBlogDemo(),
  parameters: { viewport: { defaultViewport: 'desktop' } },
};
