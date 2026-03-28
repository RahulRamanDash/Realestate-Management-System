# Real Estate Management System - Component Library

## Overview

This document outlines the modern, production-ready component library built for the Real Estate Management System. All components follow consistent design patterns, are fully responsive, and integrate with the existing design system.

## Component Structure

```
src/
├── components/
│   ├── Button/
│   │   └── Button.jsx           # Primary, secondary, danger, ghost variants
│   ├── Card/
│   │   ├── Card.jsx             # Generic card component with variants
│   │   ├── Badge.jsx            # Status badges (success, error, warning, info)
│   │   └── PropertyCard.jsx      # Modern property listing card
│   ├── Form/
│   │   └── FormField.jsx         # Form inputs with validation UI
│   ├── Loader/
│   │   └── Loader.jsx            # Spinner, skeleton, and page loaders
│   ├── Avatar/
│   │   └── Avatar.jsx            # User avatar with fallback initials
│   ├── Navigation/
│   ├── Section.jsx               # Container wrapper with padding
│   ├── HomeNavbar.jsx            # Public-facing navigation
│   ├── DashboardNavbar.jsx       # Authenticated user navigation
│   └── index.js                  # Centralized exports
├── shared/
│   ├── hooks/
│   │   └── useMediaQuery.js      # Responsive utilities, async handling
│   ├── utils/
│   │   ├── constants.js          # Design tokens and enums
│   │   └── helpers.js            # Utility functions
│   └── index.js                  # Centralized exports
└── modules/
    ├── Home.jsx                  # Refactored landing page
    ├── property/
    │   ├── components/
    │   │   └── PropertyCard.jsx   # Re-export from components/Card
    │   └── pages/
    │       ├── PropertyBrowse.jsx # Refactored property listing
    │       ├── AddProperty.jsx    # Property creation/edit form
    │       └── ...
    └── user/
        └── pages/
            ├── UserAuth.jsx      # Login/register
            └── Dashboard.jsx     # User dashboard
```

## Reusable Components

### Button

```jsx
import { Button } from '@/components';
import { BUTTON_VARIANTS, BUTTON_SIZES } from '@/shared';

<Button variant="primary" size="md" disabled={false} loading={false}>
  Click me
</Button>
```

**Variants**: `primary`, `secondary`, `danger`, `ghost`  
**Sizes**: `sm`, `md`, `lg`  
**Features**: Automatic spinner on loading, disabled state, smooth transitions

### Card

```jsx
import { Card, EmptyState, ErrorState } from '@/components';
import { CARD_VARIANTS } from '@/shared';

<Card variant="glass">
  <h3>Title</h3>
  <p>Content</p>
</Card>

<EmptyState
  icon={SearchIcon}
  title="No results"
  description="Try adjusting filters"
  action={<Button>Reset</Button>}
/>
```

**Variants**: `glass`, `elevated`, `flat`, `bordered`

### PropertyCard

Modern listing card with image, price, badges, and actions:

```jsx
import { PropertyCard } from '@/components';

<PropertyCard
  property={propertyObject}
  user={currentUser}
  onBuy={handleBuy}
  onEdit={handleEdit}
  onDelete={handleDelete}
  isOwned={boolean}
  showContactAgent={boolean}
  actionLoading={boolean}
/>
```

**Features**:
- Responsive image with lazy loading and fallback
- Property type and availability badges
- Bed, bath, area icons in image footer
- Favorite button (non-owned properties)
- Hover effects with scale animation
- Role-based action buttons
- Sold state overlay

### Form Components

```jsx
import { FormField, Input, Textarea, Select, Checkbox } from '@/components';

<FormField
  label="Email"
  error={errorMessage}
  hint="We'll never share your email"
  required
>
  <Input
    type="email"
    name="email"
    placeholder="you@example.com"
    error={Boolean(errorMessage)}
    success={isValid}
  />
</FormField>
```

**Features**: Error/success states, validation UI, helper text, required indicator

### Loaders

```jsx
import { Spinner, SkeletonLoader, PropertyCardSkeleton, PageLoader } from '@/components';

<Spinner size="md" />

<SkeletonLoader count={3} height="h-6" width="w-full" />

<PropertyCardSkeleton />

<PageLoader message="Loading..." />
```

### Badge

```jsx
import { Badge } from '@/components';
import { BADGE_VARIANTS } from '@/shared';

<Badge variant="success" size="md">Available</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Sold</Badge>
```

## Shared Utilities

### Hooks

```jsx
import {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useAsync,
  useLocalStorage,
  useScrollPosition,
  useInView,
  useDebouncedValue,
  usePrevious,
} from '@/shared';

const isMobile = useIsMobile();
const [value, debouncedValue] = useDebouncedValue(searchTerm, 500);
const [stored, setStored] = useLocalStorage('key', initialValue);
```

### Helpers

```jsx
import {
  cn,
  formatPrice,
  formatDate,
  truncate,
  getInitials,
  isValidEmail,
  isValidPhone,
  getErrorMessage,
  debounce,
  throttle,
  getPropertyId,
  calculateDaysAgo,
} from '@/shared';

formatPrice(500000);        // "$500,000"
formatDate(new Date());     // "Mar 27, 2026"
getInitials("John Doe");    // "JD"
calculateDaysAgo(date);     // "2d ago"
```

### Constants

```jsx
import {
  BUTTON_VARIANTS,
  BUTTON_SIZES,
  CARD_VARIANTS,
  BADGE_VARIANTS,
  PROPERTY_TYPES,
  ROLE_TYPES,
  BREAKPOINTS,
  Z_INDEX,
} from '@/shared';

// Use in components
Object.entries(PROPERTY_TYPES).map(type => (
  <option key={type} value={type}>{type}</option>
))
```

## Design System

### Color Palette
- **Primary**: Emerald (#10b981, #4ade80, #86efac)
- **Surfaces**: White with opacity for glass effect
- **Text**: Slate grays for hierarchy
- **Success**: Emerald
- **Warning**: Amber
- **Error**: Red

### Spacing Scale
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px

### Typography
- **Headlines**: Space Grotesk (bold, 700)
- **Body**: Manrope (regular, 400-600)
- **Sizing**: sm (12px), base (16px), lg (18px), xl (20px)

### Breakpoints
- Mobile: 320px - 640px
- Tablet: 768px - 1023px
- Desktop: 1024px+
- Wide: 1280px+

## Design Patterns

### Loading States
1. Show skeleton loaders while fetching
2. Replace with actual content on success
3. Show error state on failure with retry button

### Empty States
- Icon, title, description
- Optional action button
- Consistent styling

### Forms
- Clear labels with optional/required indicator
- Validation feedback inline or below
- Success/error states with visual indicators
- Disabled submit button when invalid

### Modals & Dropdowns
- Escape key to close
- Click outside to close
- Smooth animations
- Proper z-index stacking

### Responsive Design
- Mobile-first approach
- Hamburger menu on screens < 1024px
- Grid layouts adapt to viewport
- Touch-friendly button sizes (min 44px)

## Accessibility

### ARIA Labels
- All interactive elements have aria-label or aria-labelledby
- Modals have aria-modal="true"
- Buttons have aria-expanded for toggle states

### Semantic HTML
- Use `<nav>`, `<main>`, `<section>`, `<article>`
- Form inputs with `<label>`
- Links use `<a>` tags with href

### Keyboard Navigation
- Tab through all interactive elements
- Enter/Space to activate buttons
- Escape to close modals/dropdowns
- Arrow keys for menu items

### Color Contrast
- WCAG AA compliance (4.5:1 for text)
- Don't rely on color alone for meaning
- Use icons + text for status badges

## Usage Examples

### Property Listing Page

```jsx
import { PropertyCard, PropertyCardSkeleton, EmptyState } from '@/components';

{loading && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
  </div>
)}

{error && <EmptyState title="Error" description={error} />}

{properties.length === 0 && !loading && <EmptyState title="No properties" />}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {properties.map(prop => (
    <PropertyCard key={prop.id} property={prop} {...props} />
  ))}
</div>
```

### Responsive Navigation

```jsx
const { isMobile } = useMediaQuery();

return (
  <nav className="sticky top-0 z-50 navbar-shell">
    {/* Desktop nav */}
    <ul className="hidden lg:flex">
      {items.map(item => <Link key={item} to={item}>{item}</Link>)}
    </ul>

    {/* Mobile menu */}
    {isMobile && menuOpen && (
      <div className="menu-surface">
        {items.map(item => <Link key={item} to={item}>{item}</Link>)}
      </div>
    )}
  </nav>
);
```

## Performance Optimizations

- Lazy loading of property images
- Skeleton loaders for perceived speed
- Debounced search/filter inputs
- Memoized components where appropriate
- Code splitting by route
- CSS is minified and optimized

## Migration Guide

### From Old PropertyCard to New

**Old**:
```jsx
<PropertyCard
  property={prop}
  user={user}
  onBuy={handleBuy}
  deleteLoading={false}
  actionLoading={false}
/>
```

**New**:
```jsx
<PropertyCard
  property={prop}
  user={user}
  onBuy={handleBuy}
  onEdit={handleEdit}
  onDelete={handleDelete}
  isOwned={false}
  showContactAgent={true}
  actionLoading={false}
/>
```

The new component supports edit/delete actions and better role-based rendering.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS 13+, Android 9+)

## Future Enhancements

- [ ] Animation library integration (Framer Motion extended)
- [ ] Dark mode toggle (already supported via CSS vars)
- [ ] Internationalization (i18n)
- [ ] Advanced form validation library
- [ ] Storybook for component documentation
- [ ] Accessibility testing automation
- [ ] Performance monitoring
