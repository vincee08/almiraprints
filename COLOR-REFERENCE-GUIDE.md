# AlmiraPrints Color Reference Guide

Quick reference for using the AlmiraPrints color palette in components.

---

## 🎨 Brand Color Palette

### 1. Primary Coral
```
Hex: #ED6E60
HSL: 6, 79%, 65%
RGB: 237, 110, 96
```

**Usage**: Primary CTAs, main interactions, hover states, active links
**Tailwind Classes**: `bg-primary`, `text-primary`, `border-primary`
**Custom Class**: `bg-coral`, `text-coral`, `border-coral`

**Examples**:
```tsx
<Button>Request a Quote</Button> // Primary Coral button
<Link className="hover:text-primary">Learn More</Link>
<Card className="hover:border-primary">...</Card>
```

---

### 2. Warm Peach
```
Hex: #FEBC7C
HSL: 30, 99%, 74%
RGB: 254, 188, 124
```

**Usage**: Secondary buttons, feature highlights, badges, accents
**Tailwind Classes**: `bg-secondary`, `text-secondary`, `border-secondary`
**Custom Class**: `bg-warm-peach`

**Examples**:
```tsx
<Button variant="secondary">Learn More</Button>
<Badge variant="secondary">Featured</Badge>
<div className="bg-secondary/20">...</div> // Soft background
```

---

### 3. Soft Peach
```
Hex: #F8BC95
HSL: 25, 87%, 78%
RGB: 248, 188, 149
```

**Usage**: Soft backgrounds, card highlights, subtle accents
**Tailwind Classes**: `bg-accent`, `text-accent`, `border-accent`
**Custom Class**: `bg-soft-peach`

**Examples**:
```tsx
<div className="bg-accent/30">Soft highlight</div>
<Badge variant="accent">New</Badge>
<section className="bg-accent/20">...</section>
```

---

### 4. Mint Green
```
Hex: #BFD9C3
HSL: 130, 28%, 80%
RGB: 191, 217, 195
```

**Usage**: Success states, balance accents, positive indicators
**Tailwind Classes**: `bg-success`, `text-success`, `border-success`
**Custom Class**: `bg-mint-green`

**Examples**:
```tsx
<Badge variant="success">Completed</Badge>
<CheckCircle2 className="text-success" />
<div className="bg-success/30">Success message</div>
```

---

### 5. Cream
```
Hex: #FEDFCA
HSL: 24, 97%, 89%
RGB: 254, 223, 202
```

**Usage**: Warm backgrounds, section backgrounds, soft containers
**Tailwind Classes**: `bg-muted`, `text-muted-foreground`
**Custom Class**: `bg-cream`

**Examples**:
```tsx
<section className="bg-muted">Warm section</section>
<div className="bg-cream">Soft container</div>
<p className="text-muted-foreground">Secondary text</p>
```

---

## 🎯 Usage by Component Type

### Buttons

**Primary Action** (Request Quote, Submit, etc.)
```tsx
<Button variant="default">Primary Action</Button>
// Background: Coral, Text: White
```

**Secondary Action**
```tsx
<Button variant="secondary">Secondary Action</Button>
// Background: Warm Peach, Text: Dark
```

**Outlined**
```tsx
<Button variant="outline">Outlined Action</Button>
// Border: Coral on hover, Background: Transparent
```

**Ghost/Link**
```tsx
<Button variant="ghost">Ghost Button</Button>
// Hover: Soft Peach background
```

---

### Badges

**Featured/Popular**
```tsx
<Badge variant="secondary">Featured</Badge>
// Background: Warm Peach
```

**Category**
```tsx
<Badge variant="outline">Category Name</Badge>
// Border: Coral/30
```

**Success/Completed**
```tsx
<Badge variant="success">Completed</Badge>
// Background: Mint Green
```

**Default/Primary**
```tsx
<Badge>Default</Badge>
// Background: Coral
```

---

### Service Cards

**Icon Background (by category)**:
```tsx
// Party & Event
<div className="bg-secondary">Icon</div> // Warm Peach

// Signage
<div className="bg-primary">Icon</div> // Coral

// T-Shirt
<div className="bg-accent">Icon</div> // Soft Peach

// Gifts
<div className="bg-success">Icon</div> // Mint Green

// Calendar
<div className="bg-muted">Icon</div> // Cream

// Personalized
<div className="bg-primary">Icon</div> // Coral
```

**Hover State**:
```tsx
<Card className="hover:border-primary">...</Card>
```

---

### Forms

**Input Focus**:
```tsx
<Input className="focus:ring-primary" />
// Focus ring: Coral
```

**Submit Button**:
```tsx
<Button type="submit">Submit</Button>
// Background: Coral
```

**Success State**:
```tsx
<CheckCircle2 className="text-success" />
<p className="text-success">Success message</p>
// Icon and text: Mint Green
```

---

### Sections

**Hero Background**:
```tsx
<section className="bg-gradient-to-b from-background to-muted">
  {/* Cream gradient */}
</section>
```

**Alternating Sections**:
```tsx
// Light section
<section className="bg-background">...</section>

// Warm section
<section className="bg-muted">...</section>

// Soft accent section
<section className="bg-secondary/20">...</section>
```

**CTA Section**:
```tsx
<section className="bg-gradient-to-br from-primary via-primary to-accent">
  {/* Coral to Soft Peach gradient */}
</section>
```

---

### Feature Cards

**With Color Variants**:
```tsx
<FeatureCard 
  variant="coral"       // Primary Coral icon
  variant="peach"       // Warm Peach icon
  variant="soft-peach"  // Soft Peach icon
  variant="mint"        // Mint Green icon
  variant="cream"       // Cream background icon
/>
```

---

### Process Steps

**Numbered Circles** (automatically alternate):
```tsx
<ProcessStep colorIndex={0} /> // Coral
<ProcessStep colorIndex={1} /> // Warm Peach
<ProcessStep colorIndex={2} /> // Soft Peach
<ProcessStep colorIndex={3} /> // Mint Green
```

---

## 🎨 Color Combinations

### Gradients

**Primary Gradient** (Coral → Warm Peach):
```tsx
<div className="bg-gradient-to-r from-primary to-secondary">
```

**Soft Gradient** (Warm Peach → Soft Peach):
```tsx
<div className="bg-gradient-to-r from-secondary to-accent">
```

**Subtle Gradient** (Soft Peach → Cream):
```tsx
<div className="bg-gradient-to-r from-accent to-muted">
```

**Balanced Gradient** (Mint Green → Cream):
```tsx
<div className="bg-gradient-to-r from-success to-muted">
```

---

### Opacity Variations

**Backgrounds**:
```tsx
<div className="bg-primary/10">Very light Coral</div>
<div className="bg-primary/20">Light Coral</div>
<div className="bg-primary/30">Subtle Coral</div>

<div className="bg-secondary/20">Light Warm Peach</div>
<div className="bg-accent/30">Soft Peach highlight</div>
<div className="bg-success/30">Soft Mint Green</div>
<div className="bg-muted/50">Soft Cream</div>
```

**Borders**:
```tsx
<div className="border-primary/30">Subtle Coral border</div>
<div className="border-primary/50">Medium Coral border</div>
<div className="border-primary">Full Coral border</div>
```

---

## 📋 Quick Copy-Paste Snippets

### Primary CTA Button
```tsx
<Button asChild size="lg" className="text-base">
  <Link href="/quote">
    Request a Quote
    <ArrowRight className="ml-2 h-5 w-5" />
  </Link>
</Button>
```

### Service Card Icon
```tsx
<div className="p-3 rounded-lg bg-primary text-primary-foreground">
  <IconComponent className="h-6 w-6" />
</div>
```

### Success Message
```tsx
<div className="text-center space-y-4 py-8">
  <CheckCircle2 className="h-16 w-16 text-success mx-auto" />
  <div>
    <h3 className="text-xl font-semibold mb-2">Success!</h3>
    <p className="text-muted-foreground">Your request has been submitted.</p>
  </div>
</div>
```

### Warm Section Background
```tsx
<section className="section-padding bg-muted">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    {/* Content */}
  </div>
</section>
```

### Feature Card with Icon
```tsx
<Card className="h-full hover:shadow-md transition-shadow">
  <CardHeader>
    <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4">
      <IconComponent className="h-6 w-6" />
    </div>
    <CardTitle>Feature Title</CardTitle>
    <CardDescription>Feature description</CardDescription>
  </CardHeader>
</Card>
```

### Hover Link
```tsx
<Link 
  href="/services" 
  className="text-foreground hover:text-primary transition-colors"
>
  Learn More
</Link>
```

---

## ⚠️ What NOT to Do

### ❌ Don't Hard-Code Hex Values
```tsx
// BAD
<div style={{ backgroundColor: '#ED6E60' }}>...</div>

// GOOD
<div className="bg-primary">...</div>
```

### ❌ Don't Use Palette Colors for Body Text
```tsx
// BAD - Poor readability
<p className="text-secondary">Body text in Warm Peach</p>

// GOOD
<p className="text-foreground">Body text in dark neutral</p>
<p className="text-muted-foreground">Secondary body text</p>
```

### ❌ Don't Ignore Semantic Tokens
```tsx
// BAD
<Button className="bg-[#ED6E60]">Submit</Button>

// GOOD
<Button variant="default">Submit</Button>
```

### ❌ Don't Overuse All Colors at Once
```tsx
// BAD - Too many colors competing
<div>
  <div className="bg-primary">Section 1</div>
  <div className="bg-secondary">Section 2</div>
  <div className="bg-accent">Section 3</div>
  <div className="bg-success">Section 4</div>
  <div className="bg-muted">Section 5</div>
</div>

// GOOD - Balanced use
<div>
  <div className="bg-background">Section 1</div>
  <div className="bg-muted">Section 2</div>
  <div className="bg-background">Section 3</div>
  <Button className="bg-primary">CTA</Button>
</div>
```

---

## 🔍 Debugging Colors

### Check Current Color Value
```tsx
// In browser dev tools console:
getComputedStyle(document.documentElement).getPropertyValue('--primary')
// Returns: 6 79% 65%
```

### Inspect Tailwind Class
Any element with `bg-primary` will use:
```css
background-color: hsl(var(--primary))
/* Which resolves to hsl(6, 79%, 65%) = #ED6E60 */
```

---

## 📱 Responsive Color Usage

Colors remain consistent across all breakpoints. No color changes needed for mobile/tablet/desktop - the palette works universally.

---

## 🌗 Dark Mode Colors

Colors automatically adjust in dark mode via CSS variables. No manual dark mode color classes needed - the system handles it!

```tsx
// Works in both light and dark mode
<Button variant="default">Click Me</Button>
```

---

## 🎯 Common Patterns

### Card with Category Color
```tsx
const getCategoryColor = (category: string) => {
  switch (category) {
    case "party-event": return "bg-secondary";
    case "signage": return "bg-primary";
    case "tshirt": return "bg-accent";
    case "gifts": return "bg-success";
    case "calendar": return "bg-muted";
    default: return "bg-primary";
  }
};

<div className={getCategoryColor(service.category)}>
  Icon
</div>
```

### Alternating Colors in a List
```tsx
const colors = ["bg-primary", "bg-secondary", "bg-accent", "bg-success"];

items.map((item, index) => (
  <div className={colors[index % colors.length]}>
    {item}
  </div>
))
```

---

## 📚 Additional Resources

- **Full Color Documentation**: See `COLOR-PALETTE-UPDATE-SUMMARY.md`
- **CSS Variables**: Check `app/globals.css`
- **Tailwind Config**: See `tailwind.config.ts`
- **Component Examples**: Browse `/components` directory

---

**Remember**: Use semantic color tokens, maintain accessibility, and keep the palette balanced! 🎨
