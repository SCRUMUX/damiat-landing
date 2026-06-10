import React from 'react';
import { cn } from '../../../components/primitives/_shared';
import { DEMO_PALETTE } from '../demo-assets/demoMediaPalette';

const ICON_CLASS = 'h-[var(--space-32)] w-[var(--space-32)] shrink-0 min-[1024px]:h-[var(--space-24)] min-[1024px]:w-[var(--space-24)]';
const DEMO_WHITE = DEMO_PALETTE.white;

function CatalogIcon({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={ICON_CLASS} aria-hidden="true" title={label}>
      {children}
    </svg>
  );
}

/** Mock — stacked blocks (marketing patterns). */
export function SolutionPatternsIcon({ className }: { className?: string }) {
  return (
    <CatalogIcon label="Mock: pattern blocks">
      <path d="M14.334 26.845L2 19.718L14.275 12.624L26.693 19.742L14.334 26.845Z" fill="url(#sol-p0)" />
      <path d="M14.334 21.533L2 14.406L14.275 7.312L26.693 14.43L14.334 21.533Z" fill="url(#sol-p1)" />
      <path d="M14.334 16.221L2 9.094L14.275 2L26.693 9.118L14.334 16.221Z" fill="var(--color-brand-primary)" />
      <defs>
        <linearGradient id="sol-p0" x1="32" y1="20" x2="-10" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor={`color-mix(in srgb, var(--color-brand-primary) 35%, ${DEMO_WHITE})`} />
          <stop offset="1" stopColor={`color-mix(in srgb, var(--color-brand-primary) 8%, ${DEMO_WHITE})`} />
        </linearGradient>
        <linearGradient id="sol-p1" x1="25" y1="11" x2="-8" y2="15" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-brand-primary)" />
          <stop offset="1" stopColor={DEMO_WHITE} />
        </linearGradient>
      </defs>
    </CatalogIcon>
  );
}

/** Mock — layered primitives. */
export function SolutionPrimitivesIcon({ className }: { className?: string }) {
  return (
    <CatalogIcon label="Mock: semantic primitives">
      <path d="M27 14.08L13.906 21.571L1 14.265L14.103 6.714L27 14.08Z" fill="var(--color-brand-primary)" />
      <path d="M27 17.794L13.906 25.286L1 17.98L14.103 10.429L27 17.794Z" fill="var(--color-brand-primary)" opacity="0.3" />
      <path d="M14.109 4.593L24.212 10.365L13.904 16.264L3.793 10.538L14.109 4.593ZM14.105 3L1 10.551L13.908 17.857L27 10.365L14.105 3Z" fill="url(#sol-pr)" />
      <defs>
        <linearGradient id="sol-pr" x1="14" y1="3" x2="14" y2="19" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-brand-primary)" />
          <stop offset="1" stopColor={`color-mix(in srgb, var(--color-brand-primary) 25%, ${DEMO_WHITE})`} />
        </linearGradient>
      </defs>
    </CatalogIcon>
  );
}

/** Mock — shield / isolation contract. */
export function SolutionIsolationIcon({ className }: { className?: string }) {
  return (
    <CatalogIcon label="Mock: isolation contract">
      <path
        d="M17.704 13.597C17.713 14.12 17.695 14.626 17.704 15.148C17.765 18.44 17.839 21.897 16.686 24.258C15.507 26.67 13.189 27.345 10.474 26.846C8.165 24.639 5.929 21.653 4.644 18.422C2.671 13.464 3.013 9.036 3.038 4.785C5.135 6.063 7.172 6.761 8.918 6.499C9.474 6.414 9.972 6.209 10.464 5.994C12.372 9.428 15.044 12.05 17.704 13.599V13.597Z"
        fill="var(--color-brand-primary)"
      />
      <path
        d="M21.702 10.811C21.711 11.334 21.693 11.84 21.702 12.363C21.763 15.655 21.836 19.112 20.684 21.473C19.505 23.885 17.187 24.56 14.471 24.061C12.162 21.854 9.926 18.868 8.642 15.637C6.671 10.679 7.013 6.251 7.038 2C9.135 3.278 11.172 3.976 12.918 3.713C13.474 3.629 13.972 3.424 14.465 3.209C16.372 6.643 19.044 9.265 21.704 10.814L21.702 10.811Z"
        fill="var(--color-brand-primary)"
        opacity="0.6"
      />
      <path
        d="M25.704 8.814C25.713 9.336 25.695 9.843 25.704 10.365C25.765 13.658 25.839 17.114 24.686 19.476C23.507 21.887 21.189 22.563 18.474 22.063C16.165 19.857 13.929 16.87 12.644 13.639C10.671 8.679 11.013 4.251 11.038 0C13.135 1.278 15.172 1.976 16.918 1.713C17.474 1.629 17.972 1.424 18.464 1.209C20.372 4.643 23.044 7.265 25.704 8.814Z"
        fill="var(--color-brand-primary)"
        opacity="0.2"
      />
      <path d="M10.761 20.078L13.954 20.352V19.475L10.761 16.04V17.072L12.989 19.34L10.761 19.051V20.078Z" fill={DEMO_WHITE} />
    </CatalogIcon>
  );
}

/** Mock — token stack. */
export function SolutionTokensIcon({ className }: { className?: string }) {
  return (
    <CatalogIcon label="Mock: design tokens">
      <path d="M14.136 14.533L25.988 21.43L26 7.554L14.067 0.648L14.136 14.533Z" fill="var(--color-brand-primary)" opacity="0.4" />
      <path d="M17.017 26.257L23.039 21.966V9.028L16.95 12.447L17.017 26.257Z" fill="url(#sol-t0)" />
      <path d="M23.05 9.018L16.948 12.447L4.95 5.565L11.064 2.123L23.05 9.018Z" fill="url(#sol-t1)" />
      <defs>
        <linearGradient id="sol-t0" x1="20" y1="9" x2="20" y2="27" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-brand-primary)" />
          <stop offset="1" stopColor={`color-mix(in srgb, var(--color-brand-primary) 30%, ${DEMO_WHITE})`} />
        </linearGradient>
        <linearGradient id="sol-t1" x1="14" y1="2" x2="14" y2="13" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-brand-primary)" />
          <stop offset="1" stopColor={DEMO_WHITE} />
        </linearGradient>
      </defs>
    </CatalogIcon>
  );
}

/** Mock — viewport / Storybook. */
export function SolutionStorybookIcon({ className }: { className?: string }) {
  return (
    <CatalogIcon label="Mock: Storybook VRT">
      <rect x="3" y="5" width="22" height="18" rx="3" fill="var(--color-brand-primary)" opacity="0.15" />
      <rect x="6" y="8" width="16" height="10" rx="2" fill="var(--color-brand-primary)" opacity="0.55" />
      <path d="M9 20H19" stroke="var(--color-brand-primary)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="21" cy="7" r="2" fill="var(--color-brand-hover)" />
    </CatalogIcon>
  );
}

/** Mock — manifest / AI assembly. */
export function SolutionManifestIcon({ className }: { className?: string }) {
  return (
    <CatalogIcon label="Mock: AI manifest">
      <rect x="4" y="3" width="20" height="22" rx="3" fill="var(--color-brand-primary)" opacity="0.12" />
      <path d="M8 10H20" stroke="var(--color-brand-primary)" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M8 14H17" stroke="var(--color-brand-hover)" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M8 18H14" stroke="var(--color-brand-primary)" strokeWidth="1.75" strokeLinecap="round" opacity="0.55" />
      <circle cx="20" cy="18" r="3" fill="var(--color-brand-primary)" />
      <path d="M19 18L19.8 18.8L21.2 17.2" stroke={DEMO_WHITE} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </CatalogIcon>
  );
}

export const SOLUTION_CATALOG_DEMO_ICONS = {
  patterns: <SolutionPatternsIcon />,
  primitives: <SolutionPrimitivesIcon />,
  isolation: <SolutionIsolationIcon />,
  tokens: <SolutionTokensIcon />,
  storybook: <SolutionStorybookIcon />,
  manifest: <SolutionManifestIcon />,
} as const;
