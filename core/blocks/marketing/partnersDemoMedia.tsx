import { partnersDemoLogo } from './demo-assets/partnersDemoLogos';
import type { PartnersBlockProps } from './PartnersBlock/PartnersBlock.types';

/** Attach partner demo logos in Storybook render() — keep out of CSF args. */
export function withPartnersDemoMedia(props: PartnersBlockProps): PartnersBlockProps {
  return {
    ...props,
    partners: props.partners.map((partner) => ({
      ...partner,
      imageSrc: partner.imageSrc ?? (partner.id ? partnersDemoLogo(partner.id) : undefined),
      imageAlt: partner.imageAlt ?? `${partner.name} logo`,
    })),
  };
}
