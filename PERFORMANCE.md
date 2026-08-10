# Performance Optimization Guide

This document outlines the performance optimizations implemented in the printing shop website template.

## Core Web Vitals Targets

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

## Implemented Optimizations

### 1. Next.js Built-in Features

#### App Router
- Server Components by default (zero JS for static content)
- Automatic code splitting
- Prefetching on link hover
- Optimized routing

#### Image Optimization
- Next.js Image component ready for real images
- Automatic lazy loading
- WebP/AVIF format support
- Responsive image sizing

#### Font Optimization
- Google Fonts with `next/font`
- Self-hosted fonts with preloading
- Font subsetting
- FOUT/FOIT prevention

### 2. Code Optimization

#### Bundle Size
- Tree-shaking enabled
- Dynamic imports for heavy components
- Modular component architecture
- Minimal external dependencies

#### JavaScript
- Server Components for static content
- Client Components only when needed
- Async loading for non-critical features
- Code splitting per route

#### CSS
- Tailwind CSS with PurgeCSS
- Critical CSS inlined
- Utility-first approach (smaller bundle)
- No unused styles in production

### 3. Asset Optimization

#### Images
- Placeholder gradients instead of images
- CSS-based visual elements
- Icon components (Lucide React)
- SVG for graphics when possible

#### Fonts
- Inter font with subset
- Display: swap strategy
- Preconnect to font CDN
- Variable fonts for better performance

### 4. Loading Strategies

#### Above the Fold
- Critical CSS inlined
- Hero section prioritized
- Defer non-critical JS
- Preload key resources

#### Below the Fold
- Lazy load images
- Defer heavy components
- Intersection Observer for animations
- Progressive enhancement

### 5. Caching Strategy

#### Static Generation
- All pages pre-rendered where possible
- ISR (Incremental Static Regeneration) ready
- Service routes with generateStaticParams
- Build-time optimization

#### Browser Caching
```
Assets: 1 year (immutable)
HTML: no-cache (always fresh)
API: appropriate TTL
```

### 6. Network Optimization

#### Compression
- Gzip/Brotli compression (Vercel default)
- Minified HTML/CSS/JS
- Optimized API responses

#### HTTP/2
- Multiplexing
- Server push (where beneficial)
- Header compression

#### CDN
- Vercel Edge Network
- Global distribution
- Automatic failover

### 7. Runtime Performance

#### React Optimization
- Proper key props
- useMemo/useCallback where needed
- Avoid unnecessary re-renders
- Virtual scrolling ready (if needed)

#### State Management
- Minimal client-side state
- Server state when possible
- Optimistic updates for forms
- Debounced inputs

### 8. Third-Party Scripts

#### Current Implementation
- No third-party analytics (add as needed)
- No external tracking scripts
- Self-hosted dependencies
- Async/defer for all scripts

#### Adding Third-Party Scripts
```tsx
// Use Next.js Script component
import Script from 'next/script'

<Script
  src="external-script.js"
  strategy="lazyOnload" // or "afterInteractive"
/>
```

## Monitoring & Metrics

### Tools to Use

1. **Lighthouse**
   - Run on each deployment
   - Target: 90+ scores

2. **Web Vitals**
   - Monitor in production
   - Track user metrics

3. **Bundle Analyzer**
   ```bash
   npm install @next/bundle-analyzer
   ```

4. **Vercel Analytics**
   - Real user metrics
   - Performance insights

### Testing Checklist

- [ ] Lighthouse score > 90 (all categories)
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Time to Interactive < 3.8s
- [ ] First Contentful Paint < 1.8s
- [ ] Total bundle size < 200KB (gzipped)

## Performance Budget

```
JavaScript: < 200KB (gzipped)
CSS: < 50KB (gzipped)
Fonts: < 100KB
Images: Lazy loaded, < 200KB each
Total Page Weight: < 1MB
```

## Optimization Opportunities

### When Adding Real Images
```tsx
import Image from 'next/image'

<Image
  src="/service-image.jpg"
  alt="Service description"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/..."
/>
```

### Code Splitting Example
```tsx
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // if client-only
})
```

### API Route Optimization
```tsx
export const revalidate = 3600; // ISR every hour

export async function generateStaticParams() {
  // Pre-render popular routes
}
```

## Common Performance Issues to Avoid

### ❌ Don't Do This
```tsx
// Importing entire icon library
import * as Icons from 'lucide-react'

// Large client components
'use client'
export default function WholePage() { }

// Inline large images
<img src="large-image.jpg" />
```

### ✅ Do This Instead
```tsx
// Import specific icons
import { Check, X } from 'lucide-react'

// Server components by default
export default function Page() { }

// Next.js Image with optimization
<Image src="/image.jpg" ... />
```

## Production Deployment

### Vercel Optimization
- Automatic compression
- Edge caching
- Image optimization
- Analytics built-in

### Environment Variables
```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Build Command
```bash
npm run build
```

### Performance Checks
```bash
npm run build && npm start
# Run Lighthouse on localhost:3000
```

## Continuous Monitoring

1. Set up Vercel Analytics
2. Monitor Web Vitals dashboard
3. Track bundle size over time
4. Regular Lighthouse audits
5. User feedback on performance

## Future Enhancements

- [ ] Implement service worker for offline support
- [ ] Add image optimization for user uploads
- [ ] Implement virtual scrolling for long lists
- [ ] Add route prefetching strategies
- [ ] Optimize form submissions with optimistic UI
- [ ] Consider edge API routes for dynamic content
