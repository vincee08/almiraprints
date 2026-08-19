# AlmiraPrints Logo - Visual Verification Guide

## Quick Visual Test Checklist

After starting the development server (`npm run dev`), verify these visual elements:

### 1. Homepage Navbar
```
┌─────────────────────────────────────────────────────────────────┐
│  [LOGO] AlmiraPrints    Home Services Portfolio About Contact   │
│                                                    [Get a Quote]  │
└─────────────────────────────────────────────────────────────────┘
```

**Expected**:
- Logo should appear as actual AlmiraPrints branded image (not "AP" text)
- Logo size: ~40x40 pixels
- Logo should be crisp and clear
- Text "AlmiraPrints" visible on screens ≥640px
- Logo + text together form clickable link to homepage
- No distortion or stretching

### 2. Mobile Navbar (<640px)
```
┌──────────────────────────────────┐
│  [LOGO]              ☰           │
└──────────────────────────────────┘
```

**Expected**:
- Logo appears without text (compact mode)
- Logo size: ~40x40 pixels
- Hamburger menu on the right
- Logo clickable to homepage

### 3. Mobile Menu Sheet
```
┌──────────────────────────────────┐
│  [LOGO] AlmiraPrints        ✕    │
│                                   │
│  Home                            │
│  Services                        │
│  Portfolio                       │
│  About                           │
│  Contact                         │
│                                   │
│  [Get a Quote]                   │
└──────────────────────────────────┘
```

**Expected**:
- Logo appears in sheet header (32x32)
- Logo + "AlmiraPrints" text visible
- Menu items below

### 4. Footer
```
┌─────────────────────────────────────────────────────────────────┐
│  [LOGO] AlmiraPrints                                             │
│  Professional printing and advertising solutions                 │
│  [Facebook] [Instagram] [Messenger]                              │
│                                                                   │
│  Company        Services         Contact Us                      │
│  About Us       Party & Event    📍 Address                      │
│  Services       Signage          📞 Phone                        │
│  Portfolio      T-Shirt          ✉ Email                         │
│  Contact        Gifts            ⏰ Hours                         │
└─────────────────────────────────────────────────────────────────┘
```

**Expected**:
- Logo appears at top of footer (40x40)
- Logo + "AlmiraPrints" text form clickable link
- Logo maintains brand consistency with navbar

### 5. Browser Tab
```
Browser Tab:
[🎨] AlmiraPrints | Professional Printing & Advertising
 ↑
This should show your actual logo as favicon
```

**Expected**:
- Browser tab displays AlmiraPrints logo
- Logo visible in:
  - Active tab
  - Inactive tabs
  - Browser history
  - Bookmarks

### 6. Responsive Breakpoints

#### Desktop (≥1024px)
```
Full navbar with logo + text, all navigation links visible
Logo size: 40x40px
Text: Visible
```

#### Tablet (640px - 1023px)
```
Navbar with logo + text, navigation may wrap or condense
Logo size: 40x40px
Text: Visible on ≥640px
```

#### Mobile (<640px)
```
Logo only, hamburger menu
Logo size: 40x40px
Text: Hidden, accessible via mobile menu
```

### 7. Logo Quality Checks

#### ✅ Good Implementation
- Logo is sharp and clear
- No pixelation or blurriness
- Maintains original colors
- No stretching or distortion
- Square aspect ratio maintained
- Appropriate size for context

#### ❌ Issues to Watch For
- Blurry or pixelated logo
- Stretched or squashed appearance
- Wrong aspect ratio
- Too large (dominates navbar)
- Too small (unreadable)
- Broken image icon
- Wrong file loaded

### 8. Interaction Tests

#### Logo Click Test
1. Click logo in navbar → Should go to homepage
2. Click logo in footer → Should go to homepage
3. Keyboard navigation: Tab to logo → Enter → Homepage
4. Mobile: Tap logo → Homepage

#### Hover Test (Desktop)
- Navbar logo link should show focus/hover state
- Cursor should change to pointer
- Footer logo link should show focus/hover state

### 9. Page-Specific Checks

Test logo appearance on all major pages:
- [ ] `/` (Homepage)
- [ ] `/services` (Services page)
- [ ] `/services/[slug]` (Any service detail page)
- [ ] `/about` (About page)
- [ ] `/portfolio` (Portfolio page)
- [ ] `/contact` (Contact page)
- [ ] `/quote` (Quote page)
- [ ] `/faq` (FAQ page)

Logo should appear consistently across all pages.

### 10. Social Media Preview Test

#### Open Graph Test
Use Facebook Debugger or similar tools:
1. Go to https://developers.facebook.com/tools/debug/
2. Enter your website URL
3. Check preview image → Should show AlmiraPrints logo

#### Twitter Card Test
Use Twitter Card Validator:
1. Go to https://cards-dev.twitter.com/validator
2. Enter your website URL
3. Check card image → Should show AlmiraPrints logo

### 11. Browser DevTools Verification

#### Network Tab Check
```
Filter by: almiraprints-logo.png

Expected entries:
- /almiraprints-logo.png (navbar, footer)
- /_next/image?url=%2Falmiraprints-logo.png&w=... (optimized versions)

Status: 200 OK
Type: image/png or image/webp (if optimized)
```

#### Elements Inspector
```html
<!-- Navbar -->
<img 
  alt="AlmiraPrints" 
  src="/_next/image?url=%2Falmiraprints-logo.png&w=96&q=75"
  style="object-fit: contain;"
  width="40"
  height="40"
>

<!-- Footer -->
<img 
  alt="AlmiraPrints" 
  src="/_next/image?url=%2Falmiraprints-logo.png&w=96&q=75"
  style="object-fit: contain;"
  width="40"
  height="40"
>
```

### 12. Mobile Device Testing

If possible, test on actual devices:

#### iOS (iPhone/iPad)
- [ ] Logo in navbar
- [ ] Logo in footer
- [ ] Logo in mobile menu
- [ ] Favicon in Safari tabs
- [ ] Home screen icon (if added to home screen)

#### Android
- [ ] Logo in navbar
- [ ] Logo in footer
- [ ] Logo in mobile menu
- [ ] Favicon in Chrome tabs
- [ ] PWA icon (if installed as PWA)

### 13. Performance Verification

Check that logo doesn't cause performance issues:

#### Lighthouse Audit
```
Performance:
- Largest Contentful Paint: Logo should not delay LCP significantly
- Cumulative Layout Shift: No shift when logo loads (width/height set)

Accessibility:
- All logo images have alt text
- Logo links are accessible

Best Practices:
- Images served in modern formats (WebP)
- Proper image sizing
```

#### Core Web Vitals
- Logo uses `priority` attribute on navbar (good for LCP)
- Other logos lazy load (good for initial load)
- No layout shift (explicit dimensions)

### 14. Dark Mode Check (if applicable)

If your website supports dark mode:
- [ ] Logo visible in light mode
- [ ] Logo visible in dark mode
- [ ] Logo has sufficient contrast in both modes
- [ ] Consider logo variant if needed

### 15. Print Preview

Test print preview (Ctrl+P / Cmd+P):
- [ ] Logo appears in print preview
- [ ] Logo doesn't waste ink unnecessarily
- [ ] Logo maintains quality in print

### 16. Accessibility Tools

Use browser accessibility checker:
- [ ] Logo `<img>` has alt="AlmiraPrints"
- [ ] Logo links have accessible name
- [ ] Keyboard focus visible on logo link
- [ ] Screen reader announces logo correctly

### Common Issues & Solutions

#### Issue: Logo not appearing
**Solution**: Check browser console for 404 errors. Verify file path is `/almiraprints-logo.png`

#### Issue: Logo stretched or distorted
**Solution**: Verify `object-contain` class is applied and width/height match aspect ratio

#### Issue: Logo too large on mobile
**Solution**: Check responsive classes, ensure proper sizing on small screens

#### Issue: Broken favicon
**Solution**: Clear browser cache, verify `app/icon.png` exists

#### Issue: Wrong logo in social preview
**Solution**: Update Open Graph metadata, clear Facebook/Twitter cache

### Expected File Sizes After Build

```
public/almiraprints-logo.png:     ~826 KB (original)
app/icon.png:                     ~826 KB (original)
app/apple-icon.png:               ~826 KB (original)

Generated by Next.js:
/_next/image/...&w=48:            ~5-15 KB (WebP)
/_next/image/...&w=96:            ~10-30 KB (WebP)
/_next/image/...&w=128:           ~15-40 KB (WebP)
```

### Quick Screenshot Checklist

Take screenshots of these views for documentation:
1. Desktop homepage with logo in navbar
2. Mobile homepage with logo in navbar
3. Mobile menu open showing logo
4. Footer with logo
5. Browser tab showing favicon
6. Social media preview with logo

---

## Final Verification Command

Run the development server and test:

```bash
npm run dev
```

Then visit:
- http://localhost:3000 (homepage)
- Check all elements listed above
- Test responsive behavior
- Verify browser tab favicon

If all checks pass, the logo integration is successful! ✅
