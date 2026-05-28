import React from 'react';
import type { SupportBlockProps } from './SupportBlock/SupportBlock.types';
import { supportDemoImage } from './demo-assets/supportDemoImages';
import {
  SupportDocsIcon,
  SupportGithubIcon,
  SupportStorybookIcon,
} from './SupportBlock/SupportBlockIcons';

const STAT_IMAGE_IDS = ['response-time', 'patterns', 'migrations'] as const;

const CONTACT_ICONS: Record<string, React.ReactNode> = {
  github: <SupportGithubIcon />,
  docs: <SupportDocsIcon />,
  storybook: <SupportStorybookIcon />,
};

/** Attach demo stat + mobile images for Storybook render() — keep out of CSF args. */
export function withSupportDemoMedia(props: SupportBlockProps): SupportBlockProps {
  return {
    ...props,
    mobileImageSrc: props.mobileImageSrc ?? supportDemoImage('mobile'),
    mobileImageAlt: props.mobileImageAlt ?? 'AICADS support metrics',
    stats: props.stats.map((stat, index) => {
      const imageId = stat.id && supportDemoImage(stat.id) ? stat.id : STAT_IMAGE_IDS[index];
      const imageSrc = stat.imageSrc ?? (imageId ? supportDemoImage(imageId) : undefined);

      return {
        ...stat,
        imageSrc,
        imageAlt: stat.imageAlt ?? `${stat.value} — ${stat.label}`,
      };
    }),
    contacts: props.contacts.map((contact) => ({
      ...contact,
      icon: contact.icon ?? (contact.id ? CONTACT_ICONS[contact.id] : undefined),
    })),
  };
}
