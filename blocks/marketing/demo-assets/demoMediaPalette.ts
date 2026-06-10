/**
 * Hex mirrors of AICADS core / semantic tokens for inline SVG data URIs.
 * CSS variables cannot be resolved inside encoded SVG — keep values synced with tokens.css.
 */
export const DEMO_PALETTE = {
  white: '#FFFFFF',
  brandPrimary: '#5B9CFF',
  brandMid: '#4A8AE6',
  brandDeep: '#3578D4',
  brandTint: '#E7F0FF',
  brandSoft: '#E2EBFF',
  gray5Alt: '#F7F8FA',
  gray10: '#F3F4F6',
  gray10Alt: '#E6EEF8',
  gray15: '#E5E7EB',
  gray20: '#EDF2F8',
  gray25: '#CBD5E1',
  gray40: '#9CA3AF',
  gray50: '#9AA6B2',
  gray60: '#6B7280',
  gray65: '#485B76',
  gray70: '#2A3547',
  gray80: '#1A2330',
  gray90: '#161E28',
  red50: '#FF4D4F',
  green50: '#1DB954',
  green99: '#11261B',
  teal10: '#14B8A6',
  cyan50: '#06B6D4',
  violet50: '#6B5BFF',
  yellow50: '#FFB020',
  rose60: '#E11D48',
} as const;

/** Matches --radius-section (16px), --radius-2xl (12px), --radius-large (6px). */
export const DEMO_RADIUS = {
  section: 16,
  panel: 12,
  control: 8,
  chip: 6,
} as const;
