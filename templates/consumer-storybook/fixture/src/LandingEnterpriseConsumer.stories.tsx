import type { Meta, StoryObj } from '@storybook/react';
import {
  LandingPageTemplate,
  aicadsProEnterpriseLandingArgs,
  aicadsProNavbarFixture,
  withEnterpriseHeroMedia,
} from '@ai-ds/core/blocks';

/**
 * Consumer-path proof: enterprise landing imported from installed @ai-ds/core package.
 */
const meta: Meta<typeof LandingPageTemplate> = {
  title: 'Consumer/Screens/LandingEnterprise',
  component: LandingPageTemplate,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof LandingPageTemplate>;

export const FromPackage: Story = {
  render: () => (
    <LandingPageTemplate
      {...aicadsProEnterpriseLandingArgs}
      hero={withEnterpriseHeroMedia(aicadsProEnterpriseLandingArgs.hero)}
    />
  ),
};
