import React from 'react';
import { cn } from '../../../components/primitives/_shared';
import { SectionShell } from '../../_shared/SectionShell';
import {
  CONTACT_HERO_COPY_CLASS,
  CONTACT_HERO_DESCRIPTION_CLASS,
  CONTACT_HERO_FORM_COLUMN_CLASS,
  CONTACT_HERO_SPLIT_CLASS,
} from '../../_shared/blockLayout';
import { ContactHeroForm } from './ContactHeroForm';
import type { ContactHeroBlockProps } from './ContactHeroBlock.types';

export type {
  ContactHeroBlockProps,
  ContactHeroFormLabels,
  ContactHeroFormValues,
} from './ContactHeroBlock.types';

const BRAND_BOTTOM_GRADIENT = (
  <>
    <div
      className="absolute inset-x-0 bottom-0 hidden h-[var(--space-680)] min-[1024px]:block"
      style={{
        background:
          'linear-gradient(180deg, color-mix(in srgb, var(--color-brand-primary) 0%, transparent) 3.79%, var(--color-brand-primary) 61.76%)',
      }}
    />
    <div
      className="absolute inset-x-0 bottom-0 h-[var(--space-152)] min-[1024px]:hidden"
      style={{
        background:
          'linear-gradient(180deg, color-mix(in srgb, var(--color-brand-primary) 0%, transparent) 0%, var(--color-brand-primary) 100%)',
      }}
    />
  </>
);

export const ContactHeroBlock: React.FC<ContactHeroBlockProps> = ({
  title = 'Поможем с дизайн-системой уже сегодня',
  description = 'Оставьте контакты — расскажем, как AICADS ускорит разработку интерфейсов, снизит расходы на UI и обеспечит единый стандарт для продуктовых команд.',
  embeddedInPhotoHero = false,
  className,
  ...formProps
}) => (
  <SectionShell
    recipe="section.contact-hero"
    appearance="brand"
    parallax={embeddedInPhotoHero ? false : 'hero'}
    overlay={embeddedInPhotoHero ? undefined : BRAND_BOTTOM_GRADIENT}
    className={cn(
      embeddedInPhotoHero
        ? '!bg-transparent min-[1024px]:!pt-[var(--space-section-y-l)] min-[1024px]:!pb-[var(--space-section-y-m)]'
        : 'min-[1024px]:!pt-[var(--space-178)] min-[1024px]:!pb-[var(--space-120)]',
      className,
    )}
    aria-label="Contact hero"
  >
    <div className={CONTACT_HERO_SPLIT_CLASS}>
      <div className={CONTACT_HERO_COPY_CLASS}>
        <h2
          className={cn(
            'm-0 text-[var(--color-text-on-brand)] text-balance min-[1024px]:max-w-[var(--space-640)] min-[1024px]:whitespace-pre-line',
            embeddedInPhotoHero
              ? 'text-style-display font-semibold tracking-tight'
              : 'font-medium text-style-h0',
          )}
        >
          {title}
        </h2>
        {description ? <p className={CONTACT_HERO_DESCRIPTION_CLASS}>{description}</p> : null}
      </div>

      <div className={CONTACT_HERO_FORM_COLUMN_CLASS}>
        <ContactHeroForm {...formProps} />
      </div>
    </div>
  </SectionShell>
);

ContactHeroBlock.displayName = 'ContactHeroBlock';
