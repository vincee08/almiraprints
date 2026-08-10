# SEO Implementation Guide

This document outlines the SEO features and best practices implemented in the printing shop website template.

## SEO Features Implemented

### 1. Meta Tags
- Page titles with site name
- Meta descriptions (155-160 characters)
- Open Graph tags (Facebook, LinkedIn)
- Twitter Card tags
- Viewport meta tag
- Charset declaration

### 2. Structured Data (Schema.org)
Ready for implementation:
- Organization schema
- LocalBusiness schema
- Service schema
- BreadcrumbList schema
- FAQ schema

### 3. Technical SEO

#### Robots.txt
```
User-agent: *
Allow: /
Sitemap: https://example.com/sitemap.xml
```

#### XML Sitemap
- Automatic generation from routes
- Service pages included
- Priority and change frequency defined
- Last modified dates

#### Canonical URLs
- Self-referential canonical tags
- Prevents duplicate content issues

### 4. Page Structure

#### Heading Hierarchy
```
h1: Main page title (one per page)
h2: Major sections
h3: Subsections
h4+: Minor headings
```

#### Semantic HTML
- `<header>` for site header
- `<nav>` for navigation
- `<main>` for main content
- `<section>` for content sections
- `<article>` for standalone content
- `<footer>` for site footer

### 5. Content Optimization

#### Keywords
Primary: printing services, printing shop, print solutions
Secondary: business cards, tarpaulin, banners, marketing materials

#### Content Guidelines
- Unique content on each page
- Keyword placement in titles and headings
- Alt text for images (when added)
- Descriptive link text
- Internal linking structure

### 6. URL Structure

#### Clean URLs
```
✅ /services/business-cards
✅ /portfolio
✅ /about

❌ /page?id=123
❌ /services/service.php?name=cards
```

#### URL Best Practices
- Lowercase letters
- Hyphens for word separation
- No special characters
- Descriptive and readable
- Consistent structure

### 7. Page Speed
- Server-side rendering
- Code splitting
- Image optimization ready
- Minified assets
- Efficient caching

## SEO Checklist

### On-Page SEO
- [x] Unique title tags (50-60 characters)
- [x] Meta descriptions (155-160 characters)
- [x] Heading hierarchy (h1-h6)
- [x] Semantic HTML structure
- [x] Internal linking
- [x] Mobile-friendly design
- [ ] Alt text for images (when real images added)
- [x] Fast page load times
- [x] HTTPS ready (Vercel default)

### Technical SEO
- [x] XML sitemap
- [x] Robots.txt
- [x] Canonical URLs
- [x] 404 page
- [x] Clean URL structure
- [x] Mobile responsiveness
- [x] Core Web Vitals optimization
- [ ] Structured data implementation

### Content SEO
- [x] Unique page content
- [x] Keyword optimization
- [x] Content hierarchy
- [x] Call-to-actions
- [x] Internal linking
- [ ] Blog/content strategy (future)

## Implementation Examples

### Page Metadata
```tsx
export const metadata: Metadata = {
  title: "Business Cards | Your Printing Business",
  description: "Professional business card printing services...",
  keywords: ["business cards", "printing", "professional cards"],
  openGraph: {
    title: "Business Cards",
    description: "Professional business card printing...",
    images: ["/og-business-cards.jpg"],
  },
}
```

### Structured Data
```tsx
const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Your Printing Business",
  "description": "Professional printing services",
  "url": "https://example.com",
  "telephone": "+63-XXX-XXX-XXXX",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Your Address",
    "addressLocality": "Your City",
    "addressCountry": "PH"
  },
  "openingHours": "Mo-Sa 08:00-18:00",
  "priceRange": "$$"
}
```

### Breadcrumbs
```tsx
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "Home",
    "item": "https://example.com"
  }, {
    "@type": "ListItem",
    "position": 2,
    "name": "Services",
    "item": "https://example.com/services"
  }]
}
```

## Local SEO Optimization

### Google Business Profile
1. Create/claim business listing
2. Add accurate business information
3. Upload photos
4. Collect reviews
5. Add business hours
6. Add services offered

### Local Citations
- Consistent NAP (Name, Address, Phone)
- Local business directories
- Industry-specific listings
- Social media profiles

### Location Pages
- Create location-specific content
- Include local keywords
- Add maps/directions
- List service areas

## Content Strategy

### Service Pages
Each service page should have:
- Unique title and description
- Service details (500+ words)
- Benefits and features
- Pricing information (if applicable)
- Related services
- Call-to-action
- Customer testimonials

### Blog Strategy (Future)
Recommended topics:
- Printing tips and guides
- Design best practices
- Case studies
- Industry news
- How-to articles
- Material comparisons

### FAQ Pages
- Common questions answered
- Keyword-rich questions
- Detailed answers
- Internal links to services

## Link Building

### Internal Linking
- Link from homepage to key pages
- Cross-link related services
- Use descriptive anchor text
- Create content hubs
- Maintain logical structure

### External Links
- Quality over quantity
- Relevant, authoritative sites
- Natural link profile
- Diverse anchor text
- Follow/nofollow balance

## Monitoring & Tracking

### Google Search Console
- Submit sitemap
- Monitor crawl errors
- Check mobile usability
- Review search performance
- Fix indexing issues

### Google Analytics
- Track page views
- Monitor user behavior
- Conversion tracking
- Traffic sources
- User demographics

### SEO Tools
- Google Search Console
- Google Analytics
- Ahrefs/SEMrush
- PageSpeed Insights
- Mobile-Friendly Test

## Common SEO Issues to Avoid

### ❌ Don't Do This
- Duplicate content across pages
- Keyword stuffing
- Hidden text
- Slow page load times
- Non-mobile-friendly design
- Broken links
- Missing meta descriptions
- Thin content pages

### ✅ Do This Instead
- Unique, valuable content
- Natural keyword usage
- Visible, user-focused content
- Optimize for speed
- Mobile-first design
- Regular link audits
- Complete metadata
- Comprehensive, helpful content

## Customization Guide

### Updating Site Information
1. Update `SITE_CONFIG` in `lib/constants.ts`
2. Update business info in `data/navigation.ts`
3. Update `site.webmanifest`
4. Update `robots.txt` sitemap URL
5. Add real logo and favicon
6. Update Open Graph images

### Adding New Pages
1. Create page with proper metadata
2. Add to sitemap.ts
3. Add internal links
4. Submit to Search Console
5. Monitor indexing

### Adding Structured Data
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(structuredData)
  }}
/>
```

## Launch Checklist

### Before Launch
- [ ] Update all placeholder content
- [ ] Add real business information
- [ ] Set up Google Analytics
- [ ] Set up Google Search Console
- [ ] Create Google Business Profile
- [ ] Add real logo and favicon
- [ ] Test all forms
- [ ] Check mobile responsiveness
- [ ] Run Lighthouse audit
- [ ] Submit sitemap

### After Launch
- [ ] Monitor Search Console
- [ ] Track rankings
- [ ] Build backlinks
- [ ] Create content regularly
- [ ] Collect reviews
- [ ] Update content periodically
- [ ] Fix any SEO issues
- [ ] Optimize based on data

## Resources

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Moz SEO Learning Center](https://moz.com/learn/seo)
- [Ahrefs Blog](https://ahrefs.com/blog/)
- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)
