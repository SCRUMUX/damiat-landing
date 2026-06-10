import type { GeneratedIconSlug } from './damiatGeneratedIcons';
import {
  damiatWhyUsCardIcon,
  damiatWhyUsFeaturedMedia,
} from './damiatGeneratedIcons';
import type { WhyUsBlockProps, WhyUsCardItem } from '@ai-ds/core/blocks/WhyUsBlock';

const DEVICE_INTRO_ICON_BY_ID: Record<string, GeneratedIconSlug> = {
  autonomy: 'card-c9df3dc074',
  sensors: '6',
  connectivity: 'card-4e104b1c87',
  monitoring: '24-7',
  'ozone-fuel': 'card-9068874dff',
};

const DEVICE_INTRO_FEATURED_SLUG: GeneratedIconSlug = 'card-00904f5c23';

function attachDeviceIntroCardIcon(card: WhyUsCardItem): WhyUsCardItem {
  if (card.icon || !card.id) return card;
  const slug = DEVICE_INTRO_ICON_BY_ID[card.id];
  return slug ? { ...card, icon: damiatWhyUsCardIcon(slug) } : card;
}

/** Attach published Synaptik icons to «Промышленный генератор» WhyUs block. */
export function withDamiatDeviceIntroMedia(content: WhyUsBlockProps): WhyUsBlockProps {
  return {
    ...content,
    primaryCards: content.primaryCards.map(attachDeviceIntroCardIcon),
    secondaryCards: content.secondaryCards.map(attachDeviceIntroCardIcon),
    featured: {
      ...content.featured,
      media: damiatWhyUsFeaturedMedia(DEVICE_INTRO_FEATURED_SLUG),
    },
  };
}
