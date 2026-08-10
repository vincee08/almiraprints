# Accessibility Features

This document outlines the accessibility features implemented in the printing shop website template.

## WCAG 2.1 Compliance

The website follows WCAG 2.1 Level AA guidelines where applicable.

## Implemented Features

### 1. Semantic HTML
- Proper heading hierarchy (h1, h2, h3, etc.)
- Semantic elements (header, nav, main, section, footer)
- Lists for navigation and grouped content
- Proper form labels and fieldsets

### 2. Keyboard Navigation
- All interactive elements are keyboard accessible
- Proper focus indicators on all focusable elements
- Tab order follows logical reading order
- Sheet/Dialog components trap focus appropriately
- Skip-to-content functionality through semantic structure

### 3. Screen Reader Support
- Descriptive labels for all form inputs
- ARIA labels for icon-only buttons
- ARIA attributes where appropriate (aria-invalid, aria-label)
- Alternative text placeholders for images
- Status messages announced via sr-only classes
- Proper form validation messages

### 4. Visual Accessibility
- Color contrast ratios meet WCAG AA standards
- Focus-visible states for keyboard users
- Information not conveyed by color alone
- Consistent visual hierarchy
- Adequate text spacing and line height
- Responsive typography that scales appropriately

### 5. Motion & Animation
- Respects `prefers-reduced-motion` media query
- All animations can be disabled via system preferences
- No auto-playing content
- Smooth scroll behavior (optional based on user preference)

### 6. Form Accessibility
- Required fields marked with asterisk and aria-required
- Clear error messages associated with inputs
- Labels properly associated with form controls
- Validation feedback is clear and actionable
- Success/error states clearly communicated

### 7. Responsive Design
- Mobile-first approach
- Touch targets meet minimum size requirements (44x44px)
- Content reflows without horizontal scrolling
- Text resizes up to 200% without loss of functionality
- Responsive navigation with mobile menu

### 8. Focus Management
- Visible focus indicators on all interactive elements
- Focus ring respects system preferences
- Custom focus styles for consistency
- No focus traps (except in modal contexts)

## Testing Recommendations

### Manual Testing
1. **Keyboard Navigation**: Tab through all pages
2. **Screen Reader**: Test with NVDA, JAWS, or VoiceOver
3. **Color Contrast**: Verify using browser dev tools
4. **Zoom**: Test at 200% zoom level
5. **Mobile**: Test on actual devices

### Automated Testing
- Use axe DevTools browser extension
- Run Lighthouse accessibility audits
- Consider Pa11y or similar CI tools

## Known Limitations

### Placeholder Content
- Portfolio images are placeholders - actual images need alt text
- Map integration on contact page needs proper ARIA labels

### Future Improvements
- Add skip-to-content link in navigation
- Implement live region announcements for dynamic content
- Add ARIA landmarks for better navigation
- Consider adding keyboard shortcuts for power users

## Best Practices for Customization

When customizing this template:

1. **Always include alt text** for real images
2. **Test with keyboard only** before deploying
3. **Maintain color contrast** when changing colors
4. **Keep focus indicators** visible and clear
5. **Test forms** with screen readers
6. **Verify responsive behavior** on real devices
7. **Run automated tests** before each deployment

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Articles](https://webaim.org/articles/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
