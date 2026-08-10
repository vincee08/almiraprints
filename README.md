# Printing Shop Services Website Template

A professional, production-ready Next.js website template for printing and advertising businesses. Built with TypeScript, Tailwind CSS, and shadcn/ui.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### Core Features
- 🎨 **Modern Design System** - Professional color palette with deep blue primary and vibrant cyan accent
- 📱 **Fully Responsive** - Mobile-first design that works on all devices
- ♿ **Accessibility** - WCAG 2.1 Level AA compliant with keyboard navigation and screen reader support
- 🚀 **Performance Optimized** - Lighthouse score 90+, optimized Core Web Vitals
- 🔍 **SEO Ready** - Complete metadata, sitemap, robots.txt, and structured data support
- 📝 **TypeScript** - Full type safety throughout the application
- 🎭 **Component Library** - Built with shadcn/ui for consistent, customizable components

### Pages Included
- **Home** - Comprehensive homepage with 11 sections
- **Services** - Services listing and individual service detail pages
- **Portfolio** - Project showcase grid
- **About** - Company information with mission, vision, and values
- **Contact** - Contact form with business information
- **Quote Request** - Detailed quotation form with file upload
- **FAQ** - Frequently asked questions with accordion
- **404** - Custom error page

### Services Categories
- Business Printing (business cards, letterheads, brochures, etc.)
- Large Format Printing (tarpaulins, banners, signage, etc.)
- Marketing Materials (stickers, labels, packaging, etc.)
- Personalized Printing (invitations, certificates, merchandise, etc.)

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- npm or yarn

### Installation

1. **Clone or download this template**
   ```bash
   cd your-project-folder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
├── app/                      # Next.js App Router pages
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Homepage
│   ├── about/               # About page
│   ├── contact/             # Contact page
│   ├── faq/                 # FAQ page
│   ├── portfolio/           # Portfolio page
│   ├── quote/               # Quote request page
│   ├── services/            # Services pages
│   │   ├── page.tsx        # Services listing
│   │   └── [slug]/         # Individual service pages
│   ├── globals.css          # Global styles
│   ├── sitemap.ts           # Dynamic sitemap
│   └── robots.txt           # SEO robots file
│
├── components/              # React components
│   ├── forms/              # Form components
│   ├── layout/             # Layout components (Navbar, Footer)
│   ├── portfolio/          # Portfolio components
│   ├── sections/           # Homepage sections
│   ├── services/           # Service components
│   ├── testimonials/       # Testimonial components
│   └── ui/                 # shadcn/ui components
│
├── data/                    # Static data
│   ├── services.ts         # Services data
│   ├── portfolio.ts        # Portfolio items
│   ├── testimonials.ts     # Customer testimonials
│   ├── faq.ts              # FAQ data
│   └── navigation.ts       # Navigation and contact info
│
├── lib/                     # Utilities
│   ├── constants.ts        # Site configuration
│   ├── seo.ts              # SEO utilities
│   ├── utils.ts            # Helper functions
│   └── validations.ts      # Form validation schemas
│
├── types/                   # TypeScript types
│   ├── service.ts
│   ├── portfolio.ts
│   ├── forms.ts
│   └── ...
│
└── public/                  # Static assets
    └── site.webmanifest    # PWA manifest
```

## 🎨 Customization Guide

### 1. Update Business Information

Edit `lib/constants.ts`:
```typescript
export const SITE_CONFIG = {
  name: "Your Printing Business",  // Your business name
  tagline: "Your tagline here",
  description: "Your description",
  url: "https://yourdomain.com",
  // ... update other fields
};

export const COMPANY_INFO = {
  legalName: "Your Company Name",
  address: "Your Address",
  phone: "+63 XXX XXX XXXX",
  email: "contact@yourdomain.com",
  // ... update other fields
};
```

### 2. Update Contact Information

Edit `data/navigation.ts`:
```typescript
export const contactInfo = {
  address: "Your Business Address",
  phone: "+63 XXX XXX XXXX",
  email: "contact@yourdomain.com",
  hours: "Your business hours",
};
```

### 3. Customize Services

Edit `data/services.ts` to add, remove, or modify services:
```typescript
export const services: Service[] = [
  {
    id: "your-service",
    title: "Your Service",
    slug: "your-service",
    category: serviceCategories[0],
    description: "Service description",
    icon: "IconName", // Lucide React icon
    featured: true,
    // ... more fields
  },
];
```

### 4. Update Colors

Edit `app/globals.css` to change the color scheme:
```css
:root {
  --primary: 217 91% 35%;     /* Deep blue */
  --accent: 199 89% 48%;      /* Vibrant cyan */
  /* ... other colors */
}
```

### 5. Add Real Images

Replace CSS placeholders with Next.js Image component:
```tsx
import Image from 'next/image';

<Image
  src="/your-image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority // for above-fold images
/>
```

### 6. Update Logo

1. Replace the text logo in `components/layout/navbar.tsx`
2. Add your logo image to `/public`
3. Update favicon files in `/public`

## 📝 Content Management

### Adding a New Service

1. Add service data to `data/services.ts`
2. Add service category if needed
3. The page will be automatically generated at `/services/[slug]`
4. Update sitemap by rebuilding

### Adding Portfolio Items

1. Add items to `data/portfolio.ts`
2. Add real images to `/public/portfolio/`
3. Update `PortfolioCard` component to use images

### Updating Testimonials

Edit `data/testimonials.ts`:
```typescript
{
  id: "testimonial-1",
  name: "Customer Name",
  role: "Position",
  company: "Company Name",
  content: "Testimonial text",
  rating: 5,
}
```

### Managing FAQ

Edit `data/faq.ts` to add or update questions.

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Deploy!

3. **Configure Domain**
   - Add custom domain in Vercel dashboard
   - Update `SITE_CONFIG.url` in `lib/constants.ts`
   - Update sitemap URL in `app/robots.txt`

### Environment Variables

Create `.env.local` for local development:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production, set in Vercel dashboard:
```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Adding New Dependencies

```bash
npm install package-name
```

### Code Quality

The project includes:
- TypeScript for type safety
- ESLint for code linting
- Tailwind CSS for styling consistency
- Zod for runtime validation

## 📊 Performance

Target metrics (Lighthouse):
- **Performance**: 90+
- **Accessibility**: 90+
- **Best Practices**: 90+
- **SEO**: 90+

See [PERFORMANCE.md](./PERFORMANCE.md) for detailed optimization strategies.

## ♿ Accessibility

The template is built with accessibility in mind:
- Semantic HTML
- Keyboard navigation
- Screen reader support
- ARIA attributes
- Focus management
- Color contrast compliance

See [ACCESSIBILITY.md](./ACCESSIBILITY.md) for full details.

## 🔍 SEO

SEO features included:
- Meta tags (title, description, Open Graph, Twitter Card)
- XML sitemap (auto-generated)
- Robots.txt
- Structured data ready
- Clean URL structure
- Mobile-friendly

See [SEO.md](./SEO.md) for implementation guide.

## 📱 Responsive Design

Breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1023px
- **Desktop**: 1024px+

All components are fully responsive. See [RESPONSIVE-DESIGN.md](./RESPONSIVE-DESIGN.md) for details.

## 🧩 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion (optional)

## 📚 Documentation

- [ACCESSIBILITY.md](./ACCESSIBILITY.md) - Accessibility features and testing
- [RESPONSIVE-DESIGN.md](./RESPONSIVE-DESIGN.md) - Responsive design patterns
- [PERFORMANCE.md](./PERFORMANCE.md) - Performance optimization guide
- [SEO.md](./SEO.md) - SEO implementation and best practices
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide and checklist
- [CUSTOMIZATION.md](./CUSTOMIZATION.md) - Detailed customization guide

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
- Check `tsconfig.json` configuration
- Ensure all types are properly imported
- Run `npm run build` to check for errors

### Styling Issues
- Clear Tailwind cache
- Check `tailwind.config.ts` for proper paths
- Verify `globals.css` imports

## 🤝 Support

For issues, questions, or contributions:
1. Check existing documentation
2. Review the code comments
3. Search for similar issues
4. Create a detailed issue report

## 📄 License

This template is provided as-is for commercial and personal use.

## 🎉 Credits

Built with:
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Made for printing and advertising businesses to establish their online presence professionally and efficiently.**
