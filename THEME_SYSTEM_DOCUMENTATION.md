# Theme System Documentation

## Overview

A comprehensive theme system has been implemented for the Design System Advisor application with complete design tokens supporting light and dark modes.

## Features Implemented

### ✅ Design Tokens

#### 1. **Color Tokens**
- **Semantic Colors**: Background, foreground, primary, secondary, muted, accent, destructive
- **Status Colors**: Success, warning, error, info with proper foregrounds
- **Brand Colors**: Complete primary scale (50-900)
- **Neutral Colors**: Complete gray scale (50-900)
- All colors are HSL-based for better flexibility

#### 2. **Typography Tokens**
- **Font Families**: Sans-serif and monospace system fonts
- **Font Sizes**: 10 sizes from xs (12px) to 6xl (60px)
- **Font Weights**: 6 weights from light (300) to extrabold (800)
- **Line Heights**: 6 options from none to loose
- **Letter Spacing**: 6 options from tighter to widest

#### 3. **Spacing Tokens**
- Complete spacing scale from 0 to 32 (0px to 128px)
- Follows 4px base grid system
- Available as CSS variables and Tailwind utilities

#### 4. **Border Radius Tokens**
- 9 radius options from none to full
- Consistent corner rounding across components

#### 5. **Shadow Tokens**
- 7 elevation levels (xs to 2xl)
- Inner shadow support
- Darker shadows in dark mode for better depth

#### 6. **Additional Tokens**
- Transition durations (fast, base, slow, slower)
- Z-index scale for proper layering
- All tokens support both light and dark modes

### ✅ Theme Provider

#### ThemeContext (`/src/contexts/ThemeContext.tsx`)
- React Context API implementation
- Three theme modes: `light`, `dark`, `system`
- Automatic system preference detection
- Real-time system theme change tracking
- localStorage persistence
- Prevents flash of unstyled content (FOUC)

#### Usage
```tsx
import { useTheme } from '@/contexts/ThemeContext';

function MyComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme('dark')}>
      Current: {theme} (Resolved: {resolvedTheme})
    </button>
  );
}
```

### ✅ Theme Toggle Component

#### ThemeToggle (`/src/components/ui/theme-toggle.tsx`)
Two variants provided:
1. **ThemeToggle**: Button with icon and label
2. **ThemeToggleIcon**: Icon-only button for compact spaces

Features:
- Cycles through light → dark → system
- Visual icons for each mode (sun, moon, monitor)
- Accessible labels
- Smooth transitions

### ✅ Theme Showcase

#### ThemeShowcase (`/src/components/ui/theme-showcase.tsx`)
Interactive showcase displaying:
- Complete color palette with all scales
- Typography sizes and weights
- Spacing scale visualization
- Border radius examples
- Shadow elevation system
- Semantic UI elements

### ✅ Integration

#### Updated Files:
1. **`/src/app/layout.tsx`**: Added ThemeProvider wrapper
2. **`/src/app/globals.css`**: Complete design tokens
3. **`/tailwind.config.js`**: Extended with all tokens
4. **`/src/components/ui/navbar.tsx`**: Added theme toggle
5. **`/src/app/settings/page.tsx`**: Added theme settings and showcase
6. **`/src/app/dashboard/page.tsx`**: Added theme settings link

## File Structure

```
/workspace/
├── src/
│   ├── app/
│   │   ├── layout.tsx (ThemeProvider integration)
│   │   ├── globals.css (Design tokens)
│   │   ├── settings/
│   │   │   └── page.tsx (Theme settings UI)
│   │   └── dashboard/
│   │       └── page.tsx (Updated with theme link)
│   ├── components/
│   │   └── ui/
│   │       ├── theme-toggle.tsx (Theme toggle component)
│   │       ├── theme-showcase.tsx (Token showcase)
│   │       └── navbar.tsx (Updated with toggle)
│   ├── contexts/
│   │   └── ThemeContext.tsx (Theme provider)
│   └── lib/
│       └── theme-utils.ts (Utility functions)
└── tailwind.config.js (Extended with tokens)
```

## Design Token Reference

### Colors

#### Usage in Tailwind
```tsx
<div className="bg-primary-500 text-primary-foreground">
<div className="bg-neutral-100 dark:bg-neutral-900">
<div className="bg-success text-success-foreground">
```

#### Usage in CSS
```css
.custom-element {
  background-color: hsl(var(--primary-500));
  color: hsl(var(--foreground));
  border-color: hsl(var(--border));
}
```

### Typography

#### Usage in Tailwind
```tsx
<h1 className="text-4xl font-bold leading-tight">
<p className="text-base font-normal leading-normal">
<code className="text-sm font-mono">
```

#### Usage in CSS
```css
.heading {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
}
```

### Spacing

#### Usage in Tailwind
```tsx
<div className="p-4 m-6 gap-2">
<div className="mt-8 mb-12">
```

#### Usage in CSS
```css
.container {
  padding: var(--space-4);
  margin-top: var(--space-8);
  gap: var(--space-2);
}
```

### Shadows

#### Usage in Tailwind
```tsx
<Card className="shadow-md">
<div className="shadow-xl">
```

#### Usage in CSS
```css
.card {
  box-shadow: var(--shadow-md);
}
```

### Border Radius

#### Usage in Tailwind
```tsx
<div className="rounded-lg">
<button className="rounded-full">
```

#### Usage in CSS
```css
.button {
  border-radius: var(--radius-lg);
}
```

## Theme Switching

### Programmatic Theme Change
```tsx
import { useTheme } from '@/contexts/ThemeContext';

function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  
  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );
}
```

### Theme Persistence
- Theme preference is automatically saved to `localStorage`
- Key: `'theme'`
- Value: `'light' | 'dark' | 'system'`
- Persists across sessions

## Accessibility

### Contrast Ratios
- All color combinations meet WCAG AA standards (4.5:1 for normal text)
- Status colors have high contrast foregrounds
- Dark mode uses appropriately adjusted colors

### Screen Readers
- Theme toggle has proper `aria-label`
- Current theme is announced
- Smooth transitions don't affect accessibility

## Browser Support

- Modern browsers supporting:
  - CSS custom properties (variables)
  - `prefers-color-scheme` media query
  - `localStorage` API
- Graceful degradation for older browsers

## Performance

- Zero runtime overhead for token access
- CSS variables enable instant theme switching
- No flash of unstyled content (FOUC)
- localStorage caching prevents recomputation

## Testing

### Manual Testing Checklist
- [ ] Theme toggle works in navbar
- [ ] Theme persists on page reload
- [ ] System theme detection works
- [ ] Dark mode applies correctly
- [ ] All color scales visible in showcase
- [ ] Typography scales work
- [ ] Shadows appear correctly
- [ ] Smooth transitions occur

### Viewing the Theme System
1. Navigate to `/settings`
2. Click "View Theme Showcase" to see all tokens
3. Toggle theme using the navbar button
4. Verify persistence by refreshing the page

## Customization

### Adding Custom Colors
1. Edit `/src/app/globals.css`
2. Add color tokens under `:root` and `.dark`
3. Update `/tailwind.config.js` to expose them
4. Use in components

### Modifying Existing Tokens
1. Edit CSS variable values in `globals.css`
2. Changes apply instantly across the app
3. Maintain both light and dark variants

## Future Enhancements

Potential additions:
- [ ] Additional theme presets (high contrast, colorblind modes)
- [ ] Per-component theme overrides
- [ ] Theme preview before applying
- [ ] Export/import custom themes
- [ ] Advanced color customization UI
- [ ] Animation/motion preferences

## Support

For issues or questions:
1. Check this documentation
2. Review `/src/components/ui/theme-showcase.tsx` for examples
3. Inspect CSS variables in browser DevTools
4. Test with different system preferences

---

**Last Updated**: 2025-10-23
**Version**: 1.0.0
