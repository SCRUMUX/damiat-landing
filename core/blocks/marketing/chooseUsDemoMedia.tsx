import React from 'react';
import { CHOOSE_US_DEMO_ICONS } from './ChooseUsBlock/ChooseUsBlockIcons';
import type { ChooseUsBlockProps, ChooseUsCardItem } from './ChooseUsBlock';

function attachCardIcon(card: ChooseUsCardItem): ChooseUsCardItem {
  if (card.icon || !card.id) return card;

  const icon = CHOOSE_US_DEMO_ICONS[card.id as keyof typeof CHOOSE_US_DEMO_ICONS];
  return icon ? { ...card, icon } : card;
}

/** Attach mock SVG illustrations to ChooseUs demo cards by `id`. */
export function withChooseUsDemoIcons<T extends Pick<ChooseUsBlockProps, 'cards'>>(
  content: T,
): T {
  return {
    ...content,
    cards: content.cards.map(attachCardIcon),
  };
}

/** Demo featured media — brand gradient panel (Cortel support image substitute). */
export const chooseUsFeaturedDemoMedia = (
  <div className="absolute inset-0" aria-hidden="true">
    <div className="absolute inset-0 bg-[var(--color-brand-primary)]" />
    <div
      className="absolute inset-0"
      style={{
        background:
          'linear-gradient(180deg, color-mix(in srgb, var(--color-brand-primary) 5%, transparent) 0%, color-mix(in srgb, var(--color-brand-primary) 88%, black) 100%)',
      }}
    />
    <svg viewBox="0 0 200 200" fill="none" className="absolute bottom-0 right-0 h-[70%] w-[70%] opacity-20">
      <path d="M40 160L100 60L160 160H40Z" fill="white" />
      <circle cx="140" cy="50" r="28" fill="white" opacity="0.35" />
    </svg>
  </div>
);
