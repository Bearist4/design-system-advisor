# Accessibility Implementation Guide

This document outlines the comprehensive accessibility features implemented across all UI components in the Design System Advisor application.

## Overview

All components have been enhanced with WCAG 2.1 Level AA compliance features including:

- ✅ ARIA labels and semantic HTML
- ✅ Full keyboard navigation support
- ✅ Focus management and trapping
- ✅ Screen reader announcements
- ✅ Color contrast compliance
- ✅ Motion preference support

## Table of Contents

1. [Accessibility Utilities](#accessibility-utilities)
2. [Component Enhancements](#component-enhancements)
3. [Keyboard Navigation](#keyboard-navigation)
4. [Screen Reader Support](#screen-reader-support)
5. [Motion Preferences](#motion-preferences)
6. [Testing Guide](#testing-guide)

---

## Accessibility Utilities

### Location
`src/lib/accessibility.ts`

### Available Utilities

#### 1. Focus Trap Hook
```typescript
const focusTrapRef = useFocusTrap(isActive: boolean)
```
Traps keyboard focus within a container (essential for modals and dialogs).

**Features:**
- Automatically focuses first focusable element
- Cycles Tab/Shift+Tab within container
- Restores focus on unmount
- Works with all standard focusable elements

#### 2. Screen Reader Announcements
```typescript
announce(message: string, priority?: 'polite' | 'assertive')
```
Creates live region announcements for dynamic content changes.

**Usage:**
- `polite`: Non-interrupting announcements (default)
- `assertive`: Immediate, interrupting announcements

#### 3. Motion Preference Hook
```typescript
const prefersReducedMotion = useReducedMotion()
```
Detects and respects user's motion preferences.

**Returns:** Boolean indicating if user prefers reduced motion

#### 4. Roving Tabindex
```typescript
const { getItemProps, currentIndex, setCurrentIndex } = useRovingTabIndex<T>()
```
Manages keyboard navigation in lists (menus, toolbars, etc.).

**Supports:**
- Arrow key navigation
- Home/End keys
- Automatic focus management

#### 5. Unique ID Generation
```typescript
const id = useId(prefix?: string)
```
Generates stable, unique IDs for ARIA relationships.

#### 6. Skip to Content
```typescript
<SkipToContent targetId="main-content" />
```
Provides keyboard users quick navigation to main content.

#### 7. Visually Hidden
```typescript
<VisuallyHidden>Screen reader only text</VisuallyHidden>
```
Hides content visually while keeping it accessible to screen readers.

---

## Component Enhancements

### Button Component
**File:** `src/components/ui/button.tsx`

**Accessibility Features:**
- ✅ Proper ARIA attributes (`aria-disabled`, `aria-busy`)
- ✅ Loading state with spinner and `aria-busy`
- ✅ Focus visible styles
- ✅ Disabled state handling

**Usage:**
```tsx
<Button 
  isLoading={loading}
  aria-label="Submit form"
>
  Submit
</Button>
```

### Input Component
**File:** `src/components/ui/input.tsx`

**Accessibility Features:**
- ✅ Error state with `aria-invalid`
- ✅ Associated error messages via `aria-describedby`
- ✅ Helper text support
- ✅ Label association

**Usage:**
```tsx
<Label htmlFor="email" required>Email</Label>
<Input
  id="email"
  type="email"
  error="Invalid email"
  helperText="Enter your email address"
  aria-describedby="email-error email-helper"
/>
```

### Modal Component
**File:** `src/components/ui/modal.tsx`

**Accessibility Features:**
- ✅ Focus trapping with `useFocusTrap`
- ✅ Escape key handling
- ✅ Role="dialog" with aria-modal
- ✅ Title and description association
- ✅ Screen reader announcements on open
- ✅ Respects motion preferences
- ✅ Focus restoration on close

**Usage:**
```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirm Action"
  description="This action cannot be undone"
>
  <p>Modal content</p>
</Modal>
```

### Sidebar Component
**File:** `src/components/ui/sidebar.tsx`

**Accessibility Features:**
- ✅ Semantic navigation structure
- ✅ ARIA labels for navigation regions
- ✅ Keyboard navigation (Enter, Space, Arrow keys)
- ✅ aria-expanded for collapsible sections
- ✅ aria-current for active items
- ✅ Screen reader announcements for state changes
- ✅ Motion preference support

**Keyboard Shortcuts:**
- `Enter` or `Space`: Activate item
- `Arrow Keys`: Navigate items
- `Tab`: Move between interactive elements

### Table Component
**File:** `src/components/ui/table.tsx`

**Accessibility Features:**
- ✅ Scrollable region with aria-label
- ✅ Proper table semantics
- ✅ scope="col" on headers
- ✅ aria-sort for sortable columns
- ✅ aria-selected for row selection

**Usage:**
```tsx
<Table aria-label="User data">
  <TableHeader>
    <TableRow>
      <TableHead sortable sortDirection="asc">Name</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow selected>
      <TableCell>John Doe</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Tooltip Component
**File:** `src/components/ui/tooltip.tsx`

**Accessibility Features:**
- ✅ role="tooltip"
- ✅ aria-describedby on trigger
- ✅ Keyboard focus support
- ✅ Respects motion preferences
- ✅ Unique ID association

**Usage:**
```tsx
<Tooltip content="Delete item">
  <Button>Delete</Button>
</Tooltip>
```

### Navbar Component
**File:** `src/components/ui/navbar.tsx`

**Accessibility Features:**
- ✅ role="navigation" with aria-label
- ✅ Semantic structure
- ✅ Descriptive button labels
- ✅ Image alt text
- ✅ User status announcements

### Badge Component
**File:** `src/components/ui/badge.tsx`

**Accessibility Features:**
- ✅ role="status"
- ✅ Optional aria-label
- ✅ Enhanced dark mode contrast

### Card Component
**File:** `src/components/ui/card.tsx`

**Accessibility Features:**
- ✅ Semantic HTML (article/section option)
- ✅ Proper heading hierarchy
- ✅ Flexible heading levels

### Label Component
**File:** `src/components/ui/label.tsx`

**Accessibility Features:**
- ✅ Required indicator with aria-label
- ✅ Error variant styling
- ✅ Disabled state support

### Textarea Component
**File:** `src/components/ui/textarea.tsx`

**Accessibility Features:**
- ✅ Error state with aria-invalid
- ✅ Associated messages via aria-describedby
- ✅ Helper text support

---

## Keyboard Navigation

### Global Shortcuts
- `Tab`: Move forward through interactive elements
- `Shift + Tab`: Move backward through interactive elements
- `Escape`: Close modals and dialogs
- `Enter` or `Space`: Activate buttons and links

### Component-Specific

#### Sidebar
- `Arrow Up/Down`: Navigate menu items
- `Arrow Left/Right`: Navigate menu items (horizontal)
- `Enter` or `Space`: Activate/expand item
- `Home`: Jump to first item
- `End`: Jump to last item

#### Modal
- `Tab`: Cycle through focusable elements (trapped)
- `Shift + Tab`: Reverse cycle
- `Escape`: Close modal

#### Tables
- `Arrow Keys`: Navigate cells
- `Home`: Jump to first cell in row
- `End`: Jump to last cell in row

---

## Screen Reader Support

### Live Regions
A global live region announcer is included in the root layout:

```tsx
<ScreenReaderAnnouncer />
```

### Usage Examples

```typescript
// Polite announcement (non-interrupting)
announcementManager.announce('Item added to cart', 'polite')

// Assertive announcement (interrupting)
announcementManager.announce('Error: Form submission failed', 'assertive')
```

### Automatic Announcements

The following actions trigger automatic screen reader announcements:

- Modal opening/closing
- Sidebar collapse/expand
- Form errors
- Loading states
- Success/error messages

---

## Motion Preferences

### Respecting prefers-reduced-motion

All animations respect the user's motion preferences via:

1. **CSS Media Query**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

2. **React Hook**
```typescript
const prefersReducedMotion = useReducedMotion()

// Conditionally apply animations
<div className={cn(
  "base-styles",
  !prefersReducedMotion && "animate-fade-in"
)} />
```

### Affected Components
- Modal (fade-in animations)
- Sidebar (width transitions)
- Tooltip (fade-in)
- Accordion (expand/collapse)

---

## Color Contrast

### WCAG AA Compliance

All color combinations meet WCAG 2.1 Level AA standards:

- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio
- **UI components**: Minimum 3:1 contrast ratio

### High Contrast Mode

Enhanced styles for users with high contrast preferences:

```css
@media (prefers-contrast: high) {
  /* Thicker borders and outlines */
  *:focus-visible {
    outline-width: 3px;
  }
  
  /* Increased border visibility */
  button {
    border: 2px solid currentColor;
  }
}
```

### Dark Mode

All components support dark mode with maintained contrast ratios:

- Adjusted color palettes for dark backgrounds
- Enhanced shadow visibility
- Proper text contrast on all surfaces

---

## Testing Guide

### Manual Testing Checklist

#### ✅ Keyboard Navigation
- [ ] All interactive elements are reachable via Tab
- [ ] Tab order is logical and follows visual order
- [ ] Focus indicators are clearly visible
- [ ] Escape key closes modals and dismissible elements
- [ ] Enter/Space activate buttons and links
- [ ] Arrow keys work in navigation components

#### ✅ Screen Reader Testing
- [ ] Test with NVDA (Windows), JAWS (Windows), or VoiceOver (Mac/iOS)
- [ ] All images have descriptive alt text
- [ ] Form inputs have associated labels
- [ ] Buttons have descriptive text or aria-labels
- [ ] Dynamic content changes are announced
- [ ] Error messages are associated with form fields
- [ ] Modal titles and descriptions are read

#### ✅ Visual Testing
- [ ] Focus indicators are visible on all interactive elements
- [ ] Color contrast meets WCAG AA standards
- [ ] Text is readable at different zoom levels (up to 200%)
- [ ] Content reflows properly on small screens
- [ ] No information is conveyed by color alone

#### ✅ Motion Testing
- [ ] Enable "Reduce motion" in OS settings
- [ ] Verify animations are disabled/reduced
- [ ] Ensure functionality works without animations

### Automated Testing

#### ESLint Plugin
Consider adding `eslint-plugin-jsx-a11y` for automated accessibility linting:

```json
{
  "extends": ["plugin:jsx-a11y/recommended"]
}
```

#### Testing Tools
- **Lighthouse**: Audit accessibility score
- **axe DevTools**: Browser extension for accessibility testing
- **WAVE**: Web accessibility evaluation tool
- **Playwright**: Automated accessibility tests

### Example Playwright Test

```typescript
import { test, expect } from '@playwright/test'

test('modal has proper ARIA attributes', async ({ page }) => {
  await page.goto('/dashboard')
  await page.click('[aria-label="Open modal"]')
  
  const modal = page.locator('[role="dialog"]')
  await expect(modal).toHaveAttribute('aria-modal', 'true')
  await expect(modal).toHaveAttribute('aria-labelledby')
})

test('keyboard navigation works', async ({ page }) => {
  await page.goto('/dashboard')
  
  // Tab through interactive elements
  await page.keyboard.press('Tab')
  await expect(page.locator(':focus')).toBeVisible()
  
  // Activate with Enter
  await page.keyboard.press('Enter')
})
```

---

## Best Practices

### 1. Always Provide Text Alternatives
```tsx
// ✅ Good
<Button aria-label="Close dialog">
  <X aria-hidden="true" />
</Button>

// ❌ Bad
<Button>
  <X />
</Button>
```

### 2. Use Semantic HTML
```tsx
// ✅ Good
<nav aria-label="Main navigation">
  <ul role="list">
    <li><Link href="/">Home</Link></li>
  </ul>
</nav>

// ❌ Bad
<div>
  <div onClick={handleClick}>Home</div>
</div>
```

### 3. Manage Focus Properly
```tsx
// ✅ Good - Focus trap in modal
const focusTrapRef = useFocusTrap(isOpen)

// ✅ Good - Restore focus on close
React.useEffect(() => {
  const previousFocus = document.activeElement
  return () => previousFocus?.focus()
}, [])
```

### 4. Provide Status Updates
```tsx
// ✅ Good
announcementManager.announce('Item added to cart', 'polite')

// ✅ Good
<div role="status" aria-live="polite">
  {message}
</div>
```

### 5. Test with Real Users
- Recruit users with disabilities for testing
- Use actual assistive technologies
- Get feedback on usability

---

## Resources

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

### Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Testing
- [Screen Reader Shortcuts](https://dequeuniversity.com/screenreaders/)
- [Keyboard Testing Guide](https://webaim.org/articles/keyboard/)

---

## Support

For questions or issues related to accessibility features:

1. Check this documentation
2. Review component-specific examples
3. Test with accessibility tools
4. Consult WCAG guidelines

## Changelog

### Version 1.0.0 (Current)
- Initial implementation of accessibility features
- All components enhanced with ARIA support
- Focus management utilities added
- Screen reader announcements implemented
- Motion preference support added
- Color contrast verified
- Comprehensive keyboard navigation
