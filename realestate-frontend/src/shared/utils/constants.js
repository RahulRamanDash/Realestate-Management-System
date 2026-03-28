/**
 * Design System Constants
 * Centralized configuration for spacing, colors, typography, and breakpoints
 */

export const SPACING = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
  '3xl': '4rem',  // 64px
};

export const BREAKPOINTS = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
};

export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  DANGER: 'danger',
  GHOST: 'ghost',
};

export const BUTTON_SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
};

export const CARD_VARIANTS = {
  GLASS: 'glass',
  ELEVATED: 'elevated',
  FLAT: 'flat',
  BORDERED: 'bordered',
};

export const BADGE_VARIANTS = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  NEUTRAL: 'neutral',
};

export const ROLE_TYPES = {
  BUYER: 'ROLE_BUYER',
  AGENT: 'ROLE_AGENT',
  ADMIN: 'ROLE_ADMIN',
};

export const PROPERTY_TYPES = [
  'Apartment',
  'House',
  'Villa',
  'Plot',
];

export const AVAILABILITY_OPTIONS = [
  { value: 'available', label: 'Available' },
  { value: 'sold', label: 'Sold' },
];

export const TRANSITION = {
  fast: '150ms',
  normal: '180ms',
  slow: '300ms',
};

export const Z_INDEX = {
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modal: 40,
  toast: 50,
};
