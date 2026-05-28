import type React from 'react';

export interface ShowcasePanelAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface ShowcasePanelItem {
  id: string;
  title: string;
  bullets: string[];
  action?: ShowcasePanelAction;
  imageSrc?: string;
  imageAlt?: string;
  /** Preview slot for Storybook render() — not CSF args. */
  preview?: React.ReactNode;
}

export interface ShowcasePanelBlockProps {
  title?: string;
  /** Optional line break in title on mobile (Cortel inserts `<br>` before last phrase). */
  titleBreakBefore?: string;
  panels: ShowcasePanelItem[];
  /** Cortel parallax cubes — disable when section sits on `BrandPhotoHeroSection`. */
  parallax?: 'section' | false;
  className?: string;
}
