# Quick Reference Guide - Component Library

## Component Imports

```jsx
// All components
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  Badge,
  PropertyCard,
  FormField,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Spinner,
  SkeletonLoader,
  PropertyCardSkeleton,
  PageLoader,
  Avatar,
  Section,
} from '@/components';

// All utilities
import {
  cn,
  formatPrice,
  formatDate,
  truncate,
  getInitials,
  isValidEmail,
  isValidPhone,
  getPropertyId,
  calculateDaysAgo,
} from '@/shared';

// All hooks
import {
  useMediaQuery,
  useIsMobile,
  useAsync,
  useLocalStorage,
  useDebouncedValue,
} from '@/shared';

// All constants
import {
  BUTTON_VARIANTS,
  BUTTON_SIZES,
  BADGE_VARIANTS,
  PROPERTY_TYPES,
  BREAKPOINTS,
} from '@/shared';
```

## Common Patterns

### Form with Validation
```jsx
const [email, setEmail] = useState('');
const [error, setError] = useState('');

const handleChange = (e) => {
  const value = e.target.value;
  setEmail(value);
  setError(!isValidEmail(value) ? 'Invalid email' : '');
};

return (
  <FormField label="Email" error={error} required>
    <Input
      type="email"
      value={email}
      onChange={handleChange}
      error={Boolean(error)}
      success={isValidEmail(email)}
    />
  </FormField>
);
```

### Loading List
```jsx
if (loading) {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}

if (error) {
  return <ErrorState title="Error" description={error} />;
}

if (items.length === 0) {
  return <EmptyState title="No items found" />;
}

return (
  <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {items.map(item => <PropertyCard key={item.id} property={item} />)}
  </div>
);
```

### Responsive Navigation
```jsx
const isMobile = useIsMobile();
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

return (
  <nav className="sticky top-0 z-50 navbar-shell">
    {/* Desktop */}
    {!isMobile && <DesktopNav />}
    
    {/* Mobile */}
    {isMobile && (
      <>
        <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
        {mobileMenuOpen && <MobileNav />}
      </>
    )}
  </nav>
);
```

### Debounced Search
```jsx
const [searchTerm, setSearchTerm] = useState('');
const debouncedTerm = useDebouncedValue(searchTerm, 500);

useEffect(() => {
  if (debouncedTerm) {
    performSearch(debouncedTerm);
  }
}, [debouncedTerm]);

return (
  <Input
    type="text"
    placeholder="Search..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
);
```

## Button Usage

```jsx
// Primary (default)
<Button>Click me</Button>

// Secondary
<Button variant="secondary">Cancel</Button>

// Danger
<Button variant="danger">Delete</Button>

// Ghost (transparent)
<Button variant="ghost">Learn more</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Loading state
<Button loading={isLoading} disabled={isLoading}>
  {isLoading ? 'Saving...' : 'Save'}
</Button>

// Disabled
<Button disabled>Disabled</Button>

// With icon
<Button>
  <SearchIcon className="h-4 w-4" />
  Search
</Button>
```

## Badge Variants

```jsx
<Badge variant="success">Available</Badge>    {/* Green */}
<Badge variant="error">Sold</Badge>          {/* Red */}
<Badge variant="warning">Pending</Badge>     {/* Yellow */}
<Badge variant="info">Featured</Badge>       {/* Blue */}
<Badge variant="neutral">Draft</Badge>       {/* Gray */}

{/* Sizes */}
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

## PropertyCard

```jsx
<PropertyCard
  property={{
    id: '123',
    title: 'Beautiful House',
    price: 500000,
    location: '123 Main St',
    city: 'New York',
    type: 'House',
    availability: 'available',
    imageUrl: 'https://...',
    bedrooms: 3,
    bathrooms: 2,
    area: 2000,
  }}
  user={currentUser}
  onBuy={handleBuy}
  onEdit={handleEdit}
  onDelete={handleDelete}
  isOwned={false}
  showContactAgent={true}
  actionLoading={false}
/>
```

## Responsive Classes

```jsx
// Hide on mobile, show on desktop
<div className="hidden lg:block">Desktop only</div>

// Show on mobile, hide on desktop
<div className="lg:hidden">Mobile only</div>

// Grid layouts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* 1 col on mobile, 2 on tablet, 3 on desktop */}
</div>

// Padding
<div className="px-4 py-6 md:px-6 md:py-8">
  {/* Responsive padding */}
</div>

// Text sizes
<h1 className="text-2xl md:text-3xl lg:text-4xl">Title</h1>
```

## Error Handling

```jsx
import { getErrorMessage } from '@/shared';

try {
  const result = await api.post('/endpoint', data);
} catch (error) {
  const message = getErrorMessage(error);
  setError(message); // "User-friendly error message"
}
```

## Format Helpers

```jsx
formatPrice(500000);           // "$500,000"
formatPrice(null);             // "Price on request"

formatDate(new Date());        // "Mar 27, 2026"

truncate("Long text...", 20);  // "Long text..."

getInitials("John Doe");       // "JD"

calculateDaysAgo(date);        // "2d ago"
getPropertyId(property);       // property.id || property._id
```

## Component Props Summary

### Button
```jsx
<Button
  variant="primary"              // primary|secondary|danger|ghost
  size="md"                      // sm|md|lg
  disabled={false}
  loading={false}
  onClick={handler}
  className="custom-class"
>
  Content
</Button>
```

### Input
```jsx
<Input
  type="text"
  name="field"
  placeholder="Enter..."
  value={value}
  onChange={handler}
  error={false}
  success={false}
  disabled={false}
/>
```

### FormField
```jsx
<FormField
  label="Field Label"
  error="Error message"
  hint="Helper text"
  required={true}
>
  {/* Input component */}
</FormField>
```

### Badge
```jsx
<Badge
  variant="success"              // success|error|warning|info|neutral
  size="md"                      // sm|md|lg
>
  Label
</Badge>
```

### Avatar
```jsx
<Avatar
  src="url"
  name="John Doe"
  size="md"                      // xs|sm|md|lg|xl
  fallbackBg="bg-emerald-500"
/>
```

## Accessibility Tips

```jsx
// ARIA labels on interactive elements
<button aria-label="Close menu">✕</button>

// Semantic HTML
<nav>Navigation</nav>
<main>Content</main>
<section>Section</section>

// Form labels
<label htmlFor="email">Email</label>
<input id="email" />

// Expanded state
<button aria-expanded={open}>Menu</button>

// Required fields
<FormField required>
  {/* Shows red asterisk */}
</FormField>
```

## Performance Tips

```jsx
// Use debounced values for search
const debouncedSearch = useDebouncedValue(searchTerm, 500);

// Load data with useAsync
const { data, loading, error } = useAsync(fetchData);

// Use SkeletonLoader for perceived speed
{loading && <SkeletonLoader count={3} />}

// Lazy load images
<img src={url} loading="lazy" />

// Store in localStorage to reduce API calls
const [user, setUser] = useLocalStorage('user', null);
```

---

**For more details**, see `COMPONENTS.md` and individual component files.
