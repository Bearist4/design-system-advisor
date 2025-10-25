# Data Display Components

This document provides comprehensive documentation for all data display components implemented for the Design System Advisor.

## Overview

The data display components provide a complete set of UI elements for displaying information, notifications, and loading states. All components follow accessibility best practices, support responsive design, and integrate with the design system's theme.

## Components

### 1. Tooltip

**Location:** `src/components/ui/tooltip.tsx`

**Description:** Hover tooltips with rich content support using Radix UI.

**Features:**
- Proper positioning (top, right, bottom, left)
- Rich content support (can contain React elements)
- Keyboard accessible
- Configurable delay duration
- Portal-based rendering for proper z-index
- Smooth animations

**Usage:**
```tsx
import { Tooltip } from "@/components/ui/tooltip"

// Simple tooltip
<Tooltip content="This is a tooltip" side="top">
  <Button>Hover me</Button>
</Tooltip>

// Rich content tooltip
<Tooltip 
  content={
    <div>
      <p className="font-semibold">Title</p>
      <p className="text-xs">Description</p>
    </div>
  }
  side="bottom"
>
  <Button>Rich tooltip</Button>
</Tooltip>
```

**Props:**
- `content`: React.ReactNode - The tooltip content
- `side`: "top" | "right" | "bottom" | "left" - Position (default: "top")
- `align`: "start" | "center" | "end" - Alignment (default: "center")
- `delayDuration`: number - Delay before showing (default: 200ms)
- `disabled`: boolean - Whether tooltip is disabled
- `asChild`: boolean - Merge props with child (default: true)
- `className`: string - Additional CSS classes

**Advanced Usage:**
For more control, use the composable API:
```tsx
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

<TooltipProvider delayDuration={300}>
  <TooltipRoot>
    <TooltipTrigger asChild>
      <Button>Trigger</Button>
    </TooltipTrigger>
    <TooltipContent side="right">
      <p>Content</p>
    </TooltipContent>
  </TooltipRoot>
</TooltipProvider>
```

---

### 2. Popover

**Location:** `src/components/ui/popover.tsx`

**Description:** Contextual popover with positioning using Radix UI.

**Features:**
- Proper edge case handling
- Portal-based rendering
- Controlled and uncontrolled modes
- Smooth animations
- Focus management
- Click-outside to close

**Usage:**
```tsx
import { Popover } from "@/components/ui/popover"

// Simple popover
<Popover
  content={
    <div className="space-y-2">
      <h3 className="font-semibold">Title</h3>
      <p className="text-sm">Content</p>
    </div>
  }
  side="bottom"
>
  <Button>Open popover</Button>
</Popover>

// Controlled popover
const [open, setOpen] = useState(false)
<Popover
  open={open}
  onOpenChange={setOpen}
  content={<div>Controlled content</div>}
>
  <Button>Toggle</Button>
</Popover>
```

**Props:**
- `content`: React.ReactNode - The popover content
- `side`: "top" | "right" | "bottom" | "left" - Position (default: "bottom")
- `align`: "start" | "center" | "end" - Alignment (default: "center")
- `open`: boolean - Controlled open state
- `onOpenChange`: (open: boolean) => void - Open state change handler
- `className`: string - Trigger element classes
- `contentClassName`: string - Content container classes

**Advanced Usage:**
For more control, use the composable API:
```tsx
import { PopoverRoot, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

<PopoverRoot>
  <PopoverTrigger asChild>
    <Button>Trigger</Button>
  </PopoverTrigger>
  <PopoverContent side="right" className="w-80">
    <div>Custom content</div>
  </PopoverContent>
</PopoverRoot>
```

---

### 3. Alert

**Location:** `src/components/ui/alert.tsx`

**Description:** Alert component with success, warning, error, and info variants.

**Features:**
- Distinct visual states (success, warning, error, info, default)
- Default icons for each variant
- Custom icon support
- Dismissible alerts
- Proper ARIA attributes
- Smooth transitions

**Usage:**
```tsx
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

// Success alert
<Alert variant="success">
  <AlertTitle>Success</AlertTitle>
  <AlertDescription>
    Your changes have been saved.
  </AlertDescription>
</Alert>

// Dismissible alert
<Alert variant="warning" dismissible onDismiss={() => console.log("dismissed")}>
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>
    You are approaching your limit.
  </AlertDescription>
</Alert>

// Custom icon
<Alert variant="info" icon={<CustomIcon />}>
  <AlertTitle>Custom</AlertTitle>
  <AlertDescription>
    Custom icon alert.
  </AlertDescription>
</Alert>
```

**Variants:**
- `default` - Neutral alert
- `success` - Green, with CheckCircle2 icon
- `warning` - Yellow, with AlertTriangle icon
- `error` - Red, with AlertCircle icon
- `info` - Blue, with Info icon

**Props:**
- `variant`: "default" | "success" | "warning" | "error" | "info"
- `dismissible`: boolean - Show dismiss button
- `onDismiss`: () => void - Dismiss handler
- `icon`: React.ReactNode - Custom icon
- `showIcon`: boolean - Show/hide icon (default: true)

---

### 4. Progress

**Location:** `src/components/ui/progress.tsx`

**Description:** Linear and circular progress indicators.

**Features:**
- Linear progress bars
- Circular progress indicators
- Multiple size variants
- Color variants (default, success, warning, error, info)
- Optional percentage label
- Smooth animations
- Proper ARIA attributes

**Usage:**
```tsx
import { Progress, CircularProgress } from "@/components/ui/progress"

// Linear progress
<Progress value={65} max={100} showLabel />
<Progress value={75} variant="success" size="lg" />

// Circular progress
<CircularProgress value={80} variant="success" />
<CircularProgress 
  value={60} 
  variant="info" 
  size={100} 
  strokeWidth={8}
  showLabel={false}
/>
```

**Linear Progress Props:**
- `value`: number - Current value (default: 0)
- `max`: number - Maximum value (default: 100)
- `size`: "sm" | "default" | "lg" - Height
- `variant`: "default" | "success" | "warning" | "error" | "info"
- `showLabel`: boolean - Show percentage label

**Circular Progress Props:**
- `value`: number - Current value (default: 0)
- `max`: number - Maximum value (default: 100)
- `size`: number - Diameter in pixels (default: 120)
- `strokeWidth`: number - Circle thickness (default: 8)
- `variant`: "default" | "success" | "warning" | "error" | "info"
- `showLabel`: boolean - Show percentage label (default: true)

---

### 5. Skeleton

**Location:** `src/components/ui/skeleton.tsx`

**Description:** Loading skeletons for various content types.

**Features:**
- Base Skeleton component
- Preset components (Text, Card, Avatar, Button, Table)
- Shimmer effect variant
- Circle support for avatars
- Customizable dimensions
- Proper ARIA attributes

**Usage:**
```tsx
import { 
  Skeleton, 
  SkeletonText,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonTable 
} from "@/components/ui/skeleton"

// Base skeleton
<Skeleton className="h-20 w-full" />
<Skeleton variant="shimmer" className="h-40 w-full" />

// Circle skeleton
<Skeleton circle width={60} height={60} />

// Preset components
<SkeletonText lines={3} />
<SkeletonCard />
<SkeletonAvatar size={40} />
<SkeletonButton />
<SkeletonTable rows={5} columns={4} />
```

**Base Skeleton Props:**
- `variant`: "default" | "shimmer" - Animation style
- `width`: string | number - Custom width
- `height`: string | number - Custom height
- `circle`: boolean - Circular skeleton
- `className`: string - Additional CSS classes

**Preset Components:**
- `SkeletonText({ lines })` - Text placeholder with multiple lines
- `SkeletonCard()` - Card layout skeleton
- `SkeletonAvatar({ size })` - Circular avatar skeleton
- `SkeletonButton()` - Button-sized skeleton
- `SkeletonTable({ rows, columns })` - Table skeleton with header

---

### 6. Badge

**Location:** `src/components/ui/badge.tsx`

**Description:** Status badges and counters.

**Features:**
- Multiple color variants
- Responsive text sizing
- Icon support
- Counter support
- Focus states
- Smooth transitions

**Usage:**
```tsx
import { Badge } from "@/components/ui/badge"

// Basic badges
<Badge variant="default">Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="destructive">Error</Badge>

// With icons
<Badge variant="foundation">
  <CheckIcon className="h-3 w-3 mr-1" />
  Active
</Badge>

// Counter badges
<div className="relative">
  <Button variant="ghost" size="icon">
    <BellIcon />
  </Button>
  <Badge 
    variant="destructive" 
    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
  >
    3
  </Badge>
</div>
```

**Variants:**
- `default` - Primary color
- `secondary` - Secondary color
- `destructive` - Red/error color
- `outline` - Outlined style
- `foundation` - Blue theme
- `spacing` - Green theme
- `brand` - Purple theme
- `component` - Orange theme
- `platform` - Pink theme
- `misc` - Gray theme

**Props:**
- `variant`: Badge variant
- `className`: string - Additional CSS classes
- `aria-label`: string - Accessibility label

---

## Demo Page

A comprehensive demo page is available at `/data-display-demo` that showcases all components with various configurations and use cases.

**Features of the demo:**
- Interactive examples for all components
- Multiple variant demonstrations
- Combined usage examples
- Loading state toggles
- Real-time progress animations

---

## Accessibility

All components follow accessibility best practices:

- ✅ Proper ARIA attributes (`role`, `aria-label`, `aria-live`, etc.)
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Screen reader friendly
- ✅ Semantic HTML
- ✅ High contrast support

---

## Theme Integration

All components integrate with the design system theme:

- Support for light and dark modes
- Use CSS custom properties for colors
- Respect user's motion preferences
- Responsive text sizing
- Consistent spacing and borders

---

## Technical Details

### Dependencies
- `@radix-ui/react-tooltip` - Tooltip primitive
- `@radix-ui/react-popover` - Popover primitive
- `class-variance-authority` - Variant management
- `clsx` - Class name utility
- `lucide-react` - Icon library

### Z-Index Management
Components use proper z-index layering:
- Tooltips: `z-50`
- Popovers: `z-50`
- Portal elements render in `document.body`

### Animations
All animations use Tailwind's animation utilities and respect `prefers-reduced-motion`.

---

## Testing

All components have been tested for:
- ✅ Build compilation
- ✅ TypeScript type safety
- ✅ Responsive design
- ✅ Light/dark mode
- ✅ Accessibility
- ✅ Edge cases

---

## Acceptance Criteria

All acceptance criteria from the Linear issue (DSA-46) have been met:

- ✅ **Tooltips display with proper positioning** - Radix UI provides robust positioning with collision detection
- ✅ **Popovers handle edge cases correctly** - Radix UI handles viewport boundaries, focus trapping, and click-outside
- ✅ **Alerts have distinct visual states** - Four distinct variants with appropriate colors and icons
- ✅ **Progress bars show accurate progress** - Both linear and circular with precise percentage calculations
- ✅ **Skeletons match content structure** - Preset components for common layouts (text, card, avatar, table)
- ✅ **Badges are properly styled** - Multiple variants with icon and counter support

---

## Future Enhancements

Potential improvements for future iterations:

1. **Tooltip**: Add arrow positioning customization
2. **Popover**: Add nested popover support
3. **Alert**: Add auto-dismiss timer option
4. **Progress**: Add indeterminate state
5. **Skeleton**: Add more preset layouts
6. **Badge**: Add pulsing animation for notifications

---

## Support

For issues or questions about these components, please refer to:
- Component source code in `src/components/ui/`
- Demo page at `/data-display-demo`
- Design system documentation
