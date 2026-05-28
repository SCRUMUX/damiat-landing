/** AICADS layout breakpoints — matches tailwind.config.cjs screens. */
export const MARKETING_VIEWPORTS = {
  mobile: {
    name: 'Mobile (375)',
    styles: { width: '375px', height: '812px' },
    type: 'mobile' as const,
  },
  tablet: {
    name: 'Tablet (768)',
    styles: { width: '768px', height: '1024px' },
    type: 'tablet' as const,
  },
  desktop: {
    name: 'Desktop (1440)',
    styles: { width: '1440px', height: '900px' },
    type: 'desktop' as const,
  },
};

export const marketingBlockParameters = {
  layout: 'fullscreen' as const,
};
