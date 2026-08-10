# Deployment Guide

Complete guide for deploying your printing shop website to production.

## Pre-Deployment Checklist

### Content Updates
- [ ] Replace all placeholder business information
- [ ] Update company name in all files
- [ ] Add real contact information
- [ ] Update business address and phone
- [ ] Add real email addresses
- [ ] Update social media links
- [ ] Replace placeholder services with actual offerings
- [ ] Add real testimonials (with permission)
- [ ] Update FAQ with actual questions
- [ ] Add real portfolio projects

### Visual Assets
- [ ] Add company logo
- [ ] Create favicon (16x16, 32x32)
- [ ] Create apple-touch-icon (180x180)
- [ ] Create Open Graph image (1200x630)
- [ ] Add service images
- [ ] Add portfolio images
- [ ] Optimize all images (compression, WebP)

### Configuration
- [ ] Update `SITE_CONFIG` in `lib/constants.ts`
- [ ] Update `contactInfo` in `data/navigation.ts`
- [ ] Update `site.webmanifest` with business info
- [ ] Update robots.txt sitemap URL
- [ ] Configure environment variables
- [ ] Set up analytics (if using)

### Code Quality
- [ ] Run `npm run build` successfully
- [ ] Fix all TypeScript errors
- [ ] Fix all ESLint warnings
- [ ] Test all forms locally
- [ ] Test all navigation links
- [ ] Verify mobile responsiveness
- [ ] Test with different browsers

### SEO & Performance
- [ ] Run Lighthouse audit (all pages)
- [ ] Verify meta tags are correct
- [ ] Check sitemap generation
- [ ] Test robots.txt accessibility
- [ ] Verify canonical URLs
- [ ] Check page load times
- [ ] Test Core Web Vitals

## Deployment to Vercel

### Step 1: Prepare Repository

```bash
# Initialize git (if not already)
git init

# Add .gitignore
echo "node_modules
.next
.env*.local
.vercel" > .gitignore

# Commit all changes
git add .
git commit -m "Initial commit - Ready for deployment"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/your-repo.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

#### Option A: Vercel Dashboard (Recommended)

1. **Sign up/Login to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub account

2. **Import Project**
   - Click "New Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   - Project Name: `your-business-name`
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Environment Variables**
   ```
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site is live!

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Step 3: Configure Custom Domain

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Click "Add Domain"
   - Enter your domain name
   - Click "Add"

2. **Configure DNS**

   For domain at registrar:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

   Or use Vercel nameservers:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

3. **Wait for DNS Propagation**
   - Usually takes 5-48 hours
   - Check status in Vercel dashboard
   - Automatic SSL certificate

### Step 4: Post-Deployment Configuration

1. **Update Site URLs**
   ```typescript
   // lib/constants.ts
   export const SITE_CONFIG = {
     url: "https://yourdomain.com", // Update this
     // ...
   };
   ```

2. **Update Robots.txt**
   ```
   Sitemap: https://yourdomain.com/sitemap.xml
   ```

3. **Redeploy**
   ```bash
   git add .
   git commit -m "Update production URLs"
   git push
   ```

## Alternative Deployment Options

### Deploy to Netlify

1. **Prepare for Netlify**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Login
   netlify login

   # Deploy
   netlify deploy --prod
   ```

2. **Or use Netlify Dashboard**
   - Connect GitHub repository
   - Build command: `npm run build`
   - Publish directory: `.next`

### Deploy to Own Server

1. **Build the Application**
   ```bash
   npm run build
   npm run start
   ```

2. **Use Process Manager**
   ```bash
   # Install PM2
   npm install -g pm2

   # Start application
   pm2 start npm --name "printing-shop" -- start

   # Save configuration
   pm2 save
   pm2 startup
   ```

3. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Post-Deployment Tasks

### SEO Setup

1. **Google Search Console**
   - Add property: https://yourdomain.com
   - Verify ownership (HTML file or DNS)
   - Submit sitemap: https://yourdomain.com/sitemap.xml
   - Monitor indexing status

2. **Google Analytics**
   - Create GA4 property
   - Add tracking code to `app/layout.tsx`
   ```tsx
   <Script
     src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
     strategy="afterInteractive"
   />
   ```

3. **Google Business Profile**
   - Create/claim business listing
   - Add photos
   - Add services
   - Collect reviews

### Performance Monitoring

1. **Vercel Analytics**
   - Enable in project settings
   - Monitor Web Vitals
   - Track user experience

2. **PageSpeed Insights**
   - Test: https://pagespeed.web.dev/
   - Target: 90+ scores
   - Fix any issues

3. **Lighthouse CI** (Optional)
   ```bash
   npm install -g @lhci/cli
   lhci autorun --upload.target=temporary-public-storage
   ```

### Security

1. **SSL Certificate**
   - Automatic with Vercel
   - Verify HTTPS works
   - Redirect HTTP to HTTPS

2. **Security Headers**
   Add to `next.config.ts`:
   ```typescript
   async headers() {
     return [
       {
         source: '/:path*',
         headers: [
           {
             key: 'X-Frame-Options',
             value: 'SAMEORIGIN',
           },
           {
             key: 'X-Content-Type-Options',
             value: 'nosniff',
           },
         ],
       },
     ];
   }
   ```

3. **Environment Variables**
   - Never commit `.env.local`
   - Use Vercel dashboard for secrets
   - Rotate any exposed keys

## Continuous Deployment

### Automatic Deployments

Vercel automatically deploys:
- **Production**: Push to `main` branch
- **Preview**: Push to any branch or PR

### Deployment Workflow

```
Developer Push → GitHub → Vercel Build → Deploy
                           ↓
                    Run Tests (optional)
                           ↓
                    Lighthouse CI (optional)
                           ↓
                    Deploy to Production
```

### Rollback Strategy

If issues occur:
1. Go to Vercel dashboard
2. Navigate to Deployments
3. Find previous working version
4. Click "Promote to Production"

Or via CLI:
```bash
vercel rollback
```

## Monitoring & Maintenance

### Regular Checks
- [ ] Monitor uptime (99.9%+)
- [ ] Check error logs
- [ ] Review analytics
- [ ] Test critical paths
- [ ] Monitor performance
- [ ] Check for broken links
- [ ] Review user feedback

### Updates
- [ ] Update dependencies monthly
- [ ] Security patches immediately
- [ ] Content updates as needed
- [ ] Add new services/portfolio
- [ ] Refresh testimonials
- [ ] Update FAQ

### Backup Strategy
- [ ] GitHub repository (code)
- [ ] Database backups (if added)
- [ ] Media files backup
- [ ] Configuration backup
- [ ] Analytics data export

## Troubleshooting

### Build Fails

```bash
# Check build locally
npm run build

# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Domain Not Working

1. Check DNS configuration
2. Wait for propagation (24-48h)
3. Verify DNS with: `nslookup yourdomain.com`
4. Check Vercel domain settings

### 404 Errors

1. Verify file structure
2. Check dynamic routes
3. Test sitemap.xml
4. Review deployment logs

### Performance Issues

1. Run Lighthouse audit
2. Check image optimization
3. Review bundle size
4. Enable caching
5. Use Vercel Analytics

## Cost Estimation

### Vercel (Recommended)
- **Hobby Plan**: Free
  - Perfect for small businesses
  - Unlimited bandwidth
  - Automatic SSL
  - Analytics included

- **Pro Plan**: $20/month
  - Team collaboration
  - Advanced analytics
  - Priority support

### Domain Registration
- **Domain**: $10-15/year
- **Registrar**: Namecheap, Google Domains, etc.

### Additional Services (Optional)
- **Email Hosting**: $5-10/month (Google Workspace, Zoho)
- **Database**: Free tier available (if needed later)
- **CDN**: Included with Vercel

## Launch Checklist

Final checks before going live:

- [ ] All content is real and accurate
- [ ] Contact information is correct
- [ ] Forms are tested and working
- [ ] All links work correctly
- [ ] Mobile version is perfect
- [ ] Images are optimized
- [ ] Lighthouse scores are good
- [ ] SEO is configured
- [ ] Analytics is set up
- [ ] Custom domain is working
- [ ] SSL certificate is active
- [ ] Social media is linked
- [ ] Google Business Profile is set up
- [ ] Backups are configured
- [ ] Monitoring is in place

## Post-Launch Marketing

1. **Announce Launch**
   - Email existing customers
   - Social media posts
   - Local business listings

2. **SEO Work**
   - Submit to search engines
   - Build backlinks
   - Create content
   - Local SEO optimization

3. **Continuous Improvement**
   - Monitor user behavior
   - A/B test CTAs
   - Collect feedback
   - Update content regularly

---

**Congratulations on deploying your printing shop website! 🎉**
