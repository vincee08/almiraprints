# Customization Guide

Detailed guide for customizing the printing shop website template to match your brand and business needs.

## Quick Customization Checklist

- [ ] Update business information
- [ ] Change colors and branding
- [ ] Add your logo
- [ ] Customize services
- [ ] Update contact details
- [ ] Add real portfolio items
- [ ] Update testimonials
- [ ] Modify FAQ content
- [ ] Add real images
- [ ] Configure social media links

## Business Information

### Site Configuration

Edit `lib/constants.ts`:

```typescript
export const SITE_CONFIG = {
  name: "Your Printing Business",        // Your business name
  tagline: "Print Your Ideas",           // Your tagline
  description: "Your description...",     // Meta description
  url: "https://yourdomain.com",         // Your domain
  ogImage: "/og-image.png",              // Social media preview image
  links: {
    facebook: "https://facebook.com/yourpage",
    instagram: "https://instagram.com/yourpage",
    messenger: "https://m.me/yourpage",
  },
};

export const COMPANY_INFO = {
  legalName: "Your Company Legal Name",
  address: "123 Your Street, Your City",
  city: "Your City",
  state: "Your State/Province",
  zipCode: "12345",
  country: "Philippines",
  phone: "+63 XXX XXX XXXX",
  email: "contact@yourbusiness.com",
  businessHours: {
    weekdays: "8:00 AM - 6:00 PM",
    saturday: "9:00 AM - 5:00 PM",
    sunday: "Closed",
  },
};
```

### Contact Information

Edit `data/navigation.ts`:

```typescript
export const contactInfo = {
  address: "123 Your Street, Your City",
  phone: "+63 XXX XXX XXXX",
  email: "contact@yourbusiness.com",
  hours: "Monday - Saturday: 8:00 AM - 6:00 PM",
};

export const socialLinks: SocialLink[] = [
  {
    platform: "Facebook",
    url: "https://facebook.com/yourpage",
    icon: "Facebook",
  },
  // Add or remove social platforms
];
```

## Branding & Design

### Colors

Edit `app/globals.css` in the `:root` section:

```css
:root {
  /* Change primary color (main brand color) */
  --primary: 217 91% 35%;     /* HSL format */
  
  /* Change accent color (highlights, CTAs) */
  --accent: 199 89% 48%;
  
  /* Other customizable colors */
  --secondary: 220 13% 91%;
  --muted: 220 13% 91%;
  --destructive: 0 84% 60%;
}
```

#### Color Conversion
Use [HSL Color Picker](https://hslpicker.com/) to convert your brand colors:
- Input your hex color (e.g., #1e40af)
- Get HSL values (e.g., 217° 91% 35%)
- Enter in format: `217 91% 35%` (no degree symbol, no %)

### Typography

Change font in `app/layout.tsx`:

```typescript
import { Inter, Roboto, Poppins } from "next/font/google";

// Replace Inter with your preferred font
const customFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-custom",
  display: "swap",
});

// Update body className
<body className={`${customFont.className} antialiased`}>
```

### Logo

#### Text Logo (Current)
Located in `components/layout/navbar.tsx`:

```tsx
<Link href="/" className="flex items-center space-x-2">
  <div className="h-8 w-8 rounded-lg bg-primary">
    <span className="text-sm font-bold">YP</span>
  </div>
  <span>{SITE_CONFIG.name}</span>
</Link>
```

#### Image Logo (Replace with)
```tsx
import Image from 'next/image';

<Link href="/" className="flex items-center">
  <Image
    src="/logo.png"
    alt="Your Business Name"
    width={180}
    height={40}
    priority
  />
</Link>
```

#### Favicon
Replace these files in `/public`:
- `favicon.ico` (16x16, 32x32)
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` (180x180)
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`

Use [Favicon Generator](https://realfavicongenerator.net/) for all formats.

## Services

### Adding a New Service

1. Open `data/services.ts`
2. Add to the appropriate category:

```typescript
{
  id: "unique-id",
  title: "Service Name",
  slug: "service-name",  // Used in URL
  category: serviceCategories[0],  // Choose category
  description: "Brief description for card",
  icon: "IconName",  // Lucide React icon name
  featured: true,  // Show on homepage
  details: "Detailed description of the service...",
  benefits: [
    "Benefit 1",
    "Benefit 2",
    "Benefit 3",
  ],
  specifications: [
    { label: "Paper Type", value: "Glossy/Matte" },
    { label: "Sizes", value: "A4, A5, Custom" },
  ],
  priceStarting: "Starting from ₱500",
}
```

### Adding a New Service Category

```typescript
export const serviceCategories: ServiceCategory[] = [
  // Existing categories...
  {
    id: "new-category",
    name: "New Category Name",
    slug: "new-category",
    description: "Category description",
    icon: "IconName",
  },
];
```

### Removing a Service

Simply delete the service object from `data/services.ts`.

### Available Icons

Browse [Lucide Icons](https://lucide.dev/icons/) for icon names.

Examples:
- `Printer`, `FileText`, `Image`, `Package`
- `Briefcase`, `Calendar`, `Award`, `Heart`
- `Tag`, `Box`, `Frame`, `Palette`

## Portfolio

### Adding Portfolio Items

Edit `data/portfolio.ts`:

```typescript
{
  id: "unique-id",
  title: "Project Title",
  slug: "project-slug",
  category: "Category Name",
  description: "Project description...",
  imageUrl: "/portfolio/project-image.jpg",  // Optional
  tags: ["Tag1", "Tag2", "Tag3"],
}
```

### Adding Images

1. Add images to `/public/portfolio/`
2. Optimize images (compress, resize)
3. Update `imageUrl` in portfolio data
4. Modify `PortfolioCard` component:

```tsx
// Replace placeholder with
<Image
  src={item.imageUrl || "/placeholder.jpg"}
  alt={item.title}
  width={400}
  height={300}
  className="object-cover"
/>
```

## Testimonials

Edit `data/testimonials.ts`:

```typescript
{
  id: "unique-id",
  name: "Customer Name",
  role: "Job Title",           // Optional
  company: "Company Name",      // Optional
  content: "Testimonial text...",
  rating: 5,                    // 1-5 stars
}
```

**Important**: Only use testimonials you have permission to display.

## FAQ

Edit `data/faq.ts`:

```typescript
{
  id: "unique-id",
  question: "Your question?",
  answer: "Detailed answer to the question...",
}
```

### FAQ Best Practices
- Use actual customer questions
- Provide clear, helpful answers
- Include relevant keywords
- Link to related pages when appropriate
- Update regularly based on customer inquiries

## Statistics

Edit `lib/constants.ts`:

```typescript
export const STATS = [
  {
    label: "Years in Business",
    value: "10+",
  },
  {
    label: "Happy Clients",
    value: "500+",
  },
  {
    label: "Projects Completed",
    value: "1000+",
  },
  {
    label: "Quality Guarantee",
    value: "100%",
  },
];
```

## Forms

### Contact Form

Edit fields in `components/forms/contact-form.tsx` if needed.

### Quote Form

Customize fields in `components/forms/quote-form.tsx`:

```typescript
// Add custom field
<div className="space-y-2">
  <Label htmlFor="customField">
    Custom Field <span className="text-destructive">*</span>
  </Label>
  <Input
    id="customField"
    {...register("customField")}
  />
  {errors.customField && (
    <p className="text-sm text-destructive">
      {errors.customField.message}
    </p>
  )}
</div>
```

Update validation in `lib/validations.ts`:

```typescript
export const quoteFormSchema = z.object({
  // Existing fields...
  customField: z.string().min(1, "Custom field is required"),
});
```

### Form Submission

Currently forms show success message locally. To add backend:

1. **Option A: Email API**
```typescript
const response = await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
```

2. **Option B: Third-party Service**
- Formspree
- Getform
- EmailJS
- SendGrid

3. **Option C: Database**
- Add database (Prisma + PostgreSQL)
- Store submissions
- Send email notifications

## Navigation

Edit `data/navigation.ts`:

```typescript
export const mainNavigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  // Add new page
  { label: "Gallery", href: "/gallery" },
  // Remove unwanted pages
];
```

## Homepage Sections

### Reorder Sections

Edit `app/page.tsx`:

```tsx
<MainLayout>
  <HeroSection />
  <StatsSection />
  {/* Reorder or comment out sections */}
  <ServicesSection />
  <WhyChooseUsSection />
  {/* <TestimonialsSection /> - Hide if not ready */}
  <CTASection />
</MainLayout>
```

### Modify Section Content

Each section is in `components/sections/`:
- `hero.tsx` - Main hero section
- `services.tsx` - Service categories
- `featured-services.tsx` - Featured services
- `why-choose-us.tsx` - Benefits
- `process.tsx` - How it works
- `portfolio.tsx` - Portfolio grid
- `about.tsx` - Company info
- `testimonials.tsx` - Customer reviews
- `faq.tsx` - FAQ accordion
- `cta.tsx` - Call to action

## Images

### Hero Section

Replace CSS placeholders with images:

```tsx
<div className="relative h-96">
  <Image
    src="/hero-image.jpg"
    alt="Printing Services"
    fill
    className="object-cover rounded-lg"
    priority
  />
</div>
```

### Service Images

Add images to service cards in `components/services/service-card.tsx`.

### Optimization

Use Next.js Image component:
- Automatic optimization
- Lazy loading
- Responsive sizing
- WebP format

```tsx
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  quality={85}
  placeholder="blur"
  blurDataURL="data:image/..."
/>
```

## Adding New Pages

1. **Create page file**
```tsx
// app/gallery/page.tsx
import { Metadata } from "next";
import { MainLayout } from "@/components/layout/main-layout";

export const metadata: Metadata = {
  title: "Gallery",
  description: "View our printing gallery",
};

export default function GalleryPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <h1>Gallery</h1>
        {/* Your content */}
      </div>
    </MainLayout>
  );
}
```

2. **Add to navigation**
```typescript
// data/navigation.ts
{ label: "Gallery", href: "/gallery" }
```

3. **Add to sitemap**
```typescript
// app/sitemap.ts
{
  url: `${baseUrl}/gallery`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.8,
}
```

## Styling Tips

### Custom Button Variant

```tsx
// components/ui/button.tsx
// Add to buttonVariants:
brand: "bg-gradient-to-r from-primary to-accent text-white",
```

### Custom Colors

```tsx
className="bg-[#YOUR_HEX] text-white"
```

### Responsive Utilities

```tsx
className="
  text-sm sm:text-base md:text-lg
  p-4 sm:p-6 lg:p-8
  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
"
```

## Common Customizations

### Change CTA Button Text

Search for "Get a Quote" or "Request a Quote" and replace globally.

### Add WhatsApp Link

```tsx
<a
  href="https://wa.me/63XXXXXXXXXX"
  className="flex items-center gap-2"
>
  <MessageCircle />
  Chat on WhatsApp
</a>
```

### Add Live Chat

```tsx
// app/layout.tsx
<Script
  src="your-chat-widget.js"
  strategy="lazyOnload"
/>
```

### Google Maps

```tsx
<iframe
  src="https://www.google.com/maps/embed?..."
  width="100%"
  height="400"
  style={{ border: 0 }}
  loading="lazy"
/>
```

## Testing Customizations

1. **Visual Testing**
   - Check on mobile device
   - Test in different browsers
   - Verify responsive breakpoints

2. **Functionality Testing**
   - Test all links
   - Submit all forms
   - Navigate all pages

3. **Performance Testing**
   - Run Lighthouse audit
   - Check image sizes
   - Verify load times

## Getting Help

If you need help with customizations:

1. Check the relevant documentation file
2. Review component code and comments
3. Test changes in development first
4. Use browser DevTools to debug
5. Check Next.js and Tailwind documentation

---

**Remember**: Always test changes locally before deploying to production!
