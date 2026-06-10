import type { Meta, StoryObj } from '@storybook/react';
import { SectionShell } from './SectionShell';
import { listRecipeIds } from '../../recipes/spacing-recipes';
import { Paragraph } from '../../components/primitives/Paragraph';

const meta: Meta = {
  title: 'Blocks/_shared/RecipeShowcase',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const AllMarketingRecipes: Story = {
  render: () => (
    <div className="flex flex-col">
      {listRecipeIds()
        .filter((id) => id.startsWith('section.') && id !== 'section.app-shell')
        .map((id) => (
          <SectionShell key={id} recipe={id}>
            <Paragraph size="md" className="font-mono text-[var(--color-text-primary)]">
              {id}
            </Paragraph>
            <Paragraph size="sm" className="text-[var(--color-text-secondary)]">
              Token-driven section padding and inner gap from spacing recipes.
            </Paragraph>
          </SectionShell>
        ))}
    </div>
  ),
};
