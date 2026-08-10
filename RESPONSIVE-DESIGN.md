# Responsive Design Documentation

This document outlines the responsive design strategy implemented in the printing shop website template.

## Breakpoint System

The website uses Tailwind CSS's default breakpoint system:

```
sm:  640px  - Small tablets
md:  768px  - Tablets
lg:  1024px - Laptops
xl:  1280px - Desktops
2xl: 1536px - Large screens
```

## Mobile-First Approach

All styles are written mobile-first, with larger screen styles added via media queries.

### Base (Mobile)
- Single column layouts
- Full-width containers
- Stacked navigation
- Touch-optimized buttons (min 44x44px)
- Larger font sizes for readability

### Tablet (sm/md)
- 2-column grids where appropriate
- Reduced padding on larger screens
- Side-by-side CTAs
- Horizontal navigation starts appearing

### Desktop (lg+)
- Multi-column layouts (3-4 columns)
- Full navigation bar
- Optimized white space
- Larger typography scale
- Hover states become more prominent

## Component Responsiveness

### Navigation (Navbar)
- **Mobile**: Hamburger menu with slide-out sheet
- **Desktop**: Full horizontal navigation with inline links
- Sticky header behavior on scroll
- Logo scales appropriately

### Hero Section
- **Mobile**: Stacked layout (text then visual)
- **Desktop**: Side-by-side with 50/50 split
- Typography scales: 4xl → 5xl → 6xl
- CTA buttons stack on mobile, inline on tablet+

### Service Cards
- **Mobile**: 1 column
- **Tablet**: 2 columns
- **Desktop**: 3-4 columns depending on section
- Equal height maintained across rows

### Forms
- **Mobile**: Full-width inputs, stacked fields
- **Tablet**: Some fields in 2-column grid (email/phone)
- Form labels remain above inputs for clarity

### Footer
- **Mobile**: Stacked sections (1 column)
- **Tablet**: 2 columns
- **Desktop**: 4 columns
- Links remain easily tappable on mobile

## Container Strategy

```css
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem (mobile);
  padding: 1.5rem (tablet);
  padding: 2rem (desktop);
}
```

## Typography Scaling

Responsive font sizes are implemented throughout:

```
h1: 2.25rem → 3rem → 3.75rem
h2: 1.875rem → 2.25rem → 3rem
h3: 1.5rem → 1.875rem → 2.25rem
body: 1rem → 1rem → 1.125rem
```

## Spacing System

Consistent spacing across breakpoints:

```
section-padding:
  py-12 (mobile)
  py-16 (tablet)
  py-20 (desktop)
```

## Image Handling

- All image placeholders are responsive
- Aspect ratios maintained across devices
- CSS-based placeholders scale properly
- Future images should use Next.js Image component

## Grid Layouts

Common grid patterns used:

```jsx
// Service categories
grid-cols-1 sm:grid-cols-2 lg:grid-cols-4

// Service cards
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3

// Portfolio items
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3

// Stats
grid-cols-2 md:grid-cols-4
```

## Touch Targets

All interactive elements meet minimum touch target sizes:
- Buttons: min 44x44px
- Links: min 44x44px tap area
- Form inputs: min 44px height
- Sufficient spacing between tap targets

## Testing Checklist

### Viewports to Test
- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone 12/13)
- [ ] 390px (iPhone 14)
- [ ] 412px (Android)
- [ ] 768px (iPad)
- [ ] 1024px (iPad Pro)
- [ ] 1366px (Laptop)
- [ ] 1920px (Desktop)

### Features to Verify
- [ ] Navigation works at all sizes
- [ ] Forms are usable on mobile
- [ ] Cards don't break layout
- [ ] Typography is readable
- [ ] Images scale properly
- [ ] No horizontal scroll
- [ ] Touch targets are adequate
- [ ] Content reflows correctly

## Performance Considerations

- Responsive images should use srcset
- CSS Grid over float-based layouts
- Flexbox for component alignment
- No layout shift on viewport resize
- Optimized font loading

## Common Responsive Patterns Used

### Stack to Horizontal
```jsx
flex flex-col sm:flex-row
```

### Hide/Show Elements
```jsx
hidden md:block (show on desktop)
block md:hidden (hide on desktop)
```

### Responsive Padding
```jsx
px-4 sm:px-6 lg:px-8
py-12 sm:py-16 lg:py-20
```

### Responsive Gap
```jsx
gap-4 sm:gap-6 lg:gap-8
```

## Browser Support

The website is optimized for:
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile Safari (iOS 13+)
- Chrome Mobile (Android 10+)

## Future Enhancements

- Container queries for more granular control
- Advanced responsive images with Next.js Image
- Responsive font sizing with clamp()
- Viewport-based spacing with fluid typography
