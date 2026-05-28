import type { Meta, StoryObj } from '@storybook/react';
import { DamiatLandingPage } from './DamiatLandingPage';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';
import { damiatLandingArgs } from '../damiatLandingFixtures';
import {
  damiatScenarioWithMedia,
  damiatDeviceIntroWithMedia,
  withDamiatHeroMedia,
} from '../damiatDemoMedia';
import { damiatLandingHeroBackgrounds } from '../demo-assets/damiatLandingHeroBackgrounds';
import { withTrustFeaturedCover } from '../trustDemoMedia';
import { withPartnersDemoMedia } from '../partnersDemoMedia';

const DAMIAT_UX_PRINCIPLE = `
**UX-воронка лендинга:**
1. Калькулятор и сценарии — рассчитайте выгоду, выберите момент продажи.
2. Генератор этилена — управляйте микроклиматом и потерями.
3. Платформа и кейс «Агро холдинг» — контролируйте хранение, подтвердите доход на объёме.

**Скролл:** зацикленный вертикальный loop (как Corn); отключите \`scrollLoop\` для embed. \`prefers-reduced-motion\` отключает loop и 3D.
`;

const damiatLandingStoryProps = {
  ...damiatLandingArgs,
  hero: withDamiatHeroMedia(damiatLandingArgs.hero),
  heroBackgroundImage: damiatLandingHeroBackgrounds.main,
  sectionBackgrounds: damiatLandingHeroBackgrounds,
  scenario: damiatScenarioWithMedia,
  deviceIntro: damiatDeviceIntroWithMedia,
  trust: withTrustFeaturedCover(damiatLandingArgs.trust),
  partners: withPartnersDemoMedia(damiatLandingArgs.partners),
};

const meta: Meta<typeof DamiatLandingPage> = {
  title: 'Screens/DAMIAT Product Landing',
  component: DamiatLandingPage,
  parameters: {
    ...marketingBlockParameters,
    layout: 'fullscreen',
    docs: {
      description: {
        component: DAMIAT_UX_PRINCIPLE,
      },
    },
  },
  argTypes: {
    scrollLoop: {
      control: 'boolean',
      description: 'Infinite vertical scroll (duplicate segment + inert clone)',
    },
  },
  args: {
    scrollLoop: true,
  },
};
export default meta;

type Story = StoryObj<typeof DamiatLandingPage>;

export const DamiatProductLanding: Story = {
  render: (args) => <DamiatLandingPage {...damiatLandingStoryProps} {...args} />,
  parameters: {
    viewport: { defaultViewport: 'desktop' },
  },
};

export const DamiatProductLandingTablet: Story = {
  ...DamiatProductLanding,
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
};

export const DamiatProductLandingMobile: Story = {
  ...DamiatProductLanding,
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
};

export const DamiatProductLandingNoLoop: Story = {
  render: (args) => (
    <DamiatLandingPage {...damiatLandingStoryProps} {...args} scrollLoop={false} />
  ),
  args: { scrollLoop: false },
  parameters: {
    viewport: { defaultViewport: 'desktop' },
  },
};
