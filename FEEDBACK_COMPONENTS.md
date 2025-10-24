# Feedback Components Documentation

Complete user feedback component library for better UX communication.

## Overview

This component library provides a comprehensive set of feedback components including:
- **Status Indicators** - Color-coded status messages
- **Loading Spinners** - Various loading state indicators
- **Progress Indicators** - Linear and circular progress bars
- **Empty States** - Placeholder content when no data
- **Toast Notifications** - Temporary success/error messages
- **Notification System** - Persistent notification management

## Installation

All components are already integrated into the application. The providers are set up in `/src/app/layout.tsx`.

## Components

### 1. Status Indicators

Display color-coded status messages with icons.

#### Basic Usage

```tsx
import { StatusIndicator, StatusDot } from '@/components/ui/status-indicator';

// Full status indicator
<StatusIndicator variant="success">
  Operation completed successfully
</StatusIndicator>

// With close button
<StatusIndicator variant="error" onClose={() => handleClose()}>
  An error occurred
</StatusIndicator>

// Compact status dot
<StatusDot variant="success" />
```

#### Variants
- `success` - Green, for successful operations
- `warning` - Yellow, for warnings
- `error` - Red, for errors
- `info` - Blue, for informational messages

#### Props
- `variant` - Status type (success | warning | error | info)
- `size` - Size variant (sm | default | lg)
- `showIcon` - Show/hide icon (default: true)
- `onClose` - Optional close handler

---

### 2. Loading Spinners

Various loading state indicators.

#### Basic Usage

```tsx
import { LoadingSpinner, LoadingOverlay, Skeleton } from '@/components/ui/loading-spinner';

// Simple spinner
<LoadingSpinner size="lg" />

// Full page loading overlay
<LoadingOverlay label="Loading data..." />

// Skeleton loaders
<Skeleton variant="text" className="w-3/4" />
<Skeleton variant="circular" />
<Skeleton variant="rectangular" />
```

#### Spinner Sizes
- `xs` - 3x3
- `sm` - 4x4
- `default` - 6x6
- `lg` - 8x8
- `xl` - 12x12

#### Spinner Variants
- `default` - Primary color
- `muted` - Muted color
- `success` - Success color
- `warning` - Warning color
- `error` - Error color

---

### 3. Progress Indicators

Linear and circular progress bars.

#### Basic Usage

```tsx
import { Progress, CircularProgress } from '@/components/ui/progress';

// Linear progress
<Progress value={75} max={100} showLabel />

// With variant
<Progress value={50} variant="success" showLabel />

// Circular progress
<CircularProgress value={75} size={120} />
<CircularProgress value={50} variant="warning" />
```

#### Progress Variants
- `default` - Primary color
- `success` - Success color
- `warning` - Warning color
- `error` - Error color
- `info` - Info color

#### Props

**Linear Progress:**
- `value` - Current value (0-100)
- `max` - Maximum value (default: 100)
- `variant` - Color variant
- `size` - Bar height (sm | default | lg)
- `showLabel` - Show percentage label

**Circular Progress:**
- `value` - Current value (0-100)
- `max` - Maximum value (default: 100)
- `size` - Circle diameter in pixels
- `strokeWidth` - Stroke width in pixels
- `variant` - Color variant
- `showLabel` - Show percentage in center

---

### 4. Empty States

Placeholder content when no data is available.

#### Basic Usage

```tsx
import { EmptyState, EmptyStateCompact } from '@/components/ui/empty-state';

// Full empty state
<EmptyState
  icon="search"
  title="No results found"
  description="Try adjusting your search or filter to find what you're looking for."
  action={{
    label: 'Clear filters',
    onClick: handleClearFilters
  }}
  secondaryAction={{
    label: 'Reset',
    onClick: handleReset
  }}
/>

// Compact variant
<EmptyStateCompact
  icon="file"
  title="No files yet"
  description="Upload your first file"
  action={{
    label: 'Upload',
    onClick: handleUpload
  }}
/>
```

#### Icon Options
- `default` - Inbox icon
- `search` - Search icon
- `file` - File icon
- `database` - Database icon
- `error` - Error icon
- Custom React node

---

### 5. Toast Notifications

Temporary messages that auto-dismiss.

#### Setup

Toast provider is already set up in the app layout. Use the hooks to show toasts.

#### Basic Usage

```tsx
import { useToast, useToastHelpers } from '@/contexts/ToastContext';

function MyComponent() {
  const { toast } = useToast();
  const toastHelpers = useToastHelpers();

  // Using helpers (recommended)
  toastHelpers.success('Success!', 'Operation completed');
  toastHelpers.error('Error!', 'Something went wrong');
  toastHelpers.warning('Warning!', 'Be careful');
  toastHelpers.info('Info', 'Just so you know');

  // Using toast directly with options
  toast({
    title: 'Custom toast',
    description: 'With custom options',
    variant: 'success',
    duration: 5000,
    action: {
      label: 'Undo',
      onClick: handleUndo
    }
  });

  // Persistent toast (won't auto-dismiss)
  toast({
    title: 'Important',
    description: 'This stays until dismissed',
    duration: 0 // 0 means no auto-dismiss
  });
}
```

#### Toast Options
- `title` - Toast title
- `description` - Toast description
- `variant` - Toast type (default | success | error | warning | info)
- `duration` - Auto-dismiss time in ms (default: 5000, 0 = persistent)
- `action` - Optional action button `{ label, onClick }`
- `showIcon` - Show/hide icon (default: true)

#### Features
- **Queue Management** - Automatically manages multiple toasts
- **Auto-dismiss** - Configurable auto-dismiss duration
- **Actions** - Optional action buttons
- **Limit** - Max 5 toasts shown at once
- **Animations** - Smooth slide-in/out animations

---

### 6. Notification System

Persistent notification management.

#### Setup

Notification provider is already set up in the app layout.

#### Basic Usage

```tsx
import { useNotifications } from '@/contexts/NotificationContext';
import { NotificationPanel } from '@/components/ui/notification-panel';
import { Bell } from 'lucide-react';

function MyComponent() {
  const { 
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  } = useNotifications();

  const [showPanel, setShowPanel] = useState(false);

  // Add notification
  addNotification({
    title: 'New message',
    description: 'You have a new message',
    variant: 'info',
    actionUrl: '/messages',
    actionLabel: 'View message'
  });

  return (
    <>
      {/* Notification bell with badge */}
      <button onClick={() => setShowPanel(!showPanel)}>
        <Bell />
        {unreadCount > 0 && (
          <span className="badge">{unreadCount}</span>
        )}
      </button>

      {/* Notification panel */}
      {showPanel && (
        <NotificationPanel onClose={() => setShowPanel(false)} />
      )}
    </>
  );
}
```

#### Notification Object
```typescript
interface Notification {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}
```

#### Context Methods
- `addNotification(notification)` - Add new notification
- `markAsRead(id)` - Mark notification as read
- `markAllAsRead()` - Mark all as read
- `removeNotification(id)` - Remove specific notification
- `clearAll()` - Clear all notifications

#### Features
- **Persistent State** - Notifications persist until dismissed
- **Read/Unread** - Track notification read status
- **Actions** - Optional action links
- **Management** - Full CRUD operations
- **Panel UI** - Pre-built notification panel component

---

## Demo Page

View all components in action at `/feedback-demo`

The demo page includes:
- Interactive examples of all components
- Different variants and states
- Real-time interactions
- Code-ready examples

## Accessibility

All components follow accessibility best practices:

- ✅ Proper ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Screen reader announcements
- ✅ Focus management
- ✅ Color contrast compliance
- ✅ Semantic HTML

### ARIA Attributes
- Status indicators use `role="status"` and `aria-live="polite"`
- Toasts use `role="alert"` and `aria-live="assertive"`
- Progress bars use `role="progressbar"` with proper values
- Loading states include `aria-label` for screen readers

## Styling

All components use the design system tokens:

- Colors from theme tokens (success, error, warning, info)
- Consistent spacing and sizing
- Smooth transitions and animations
- Full dark mode support
- Responsive design

## Best Practices

### Toast Notifications
- Use sparingly - don't overwhelm users
- Keep messages concise and actionable
- Use appropriate variants (success/error/warning/info)
- Set reasonable auto-dismiss durations (3-5 seconds)
- Provide actions when users can undo or respond

### Notifications
- Use for important, persistent updates
- Allow users to mark as read/unread
- Provide actions when relevant
- Group similar notifications
- Implement notification preferences

### Loading States
- Show immediately for operations > 200ms
- Use appropriate spinner sizes for context
- Provide meaningful loading messages
- Use skeleton loaders for content previews
- Consider progressive loading for large datasets

### Progress Indicators
- Show for operations with known duration
- Update frequently (every 100-500ms)
- Use appropriate variants (success for completion, error for failures)
- Provide percentage labels when helpful
- Consider circular for compact spaces

### Empty States
- Provide clear, helpful messaging
- Suggest next actions
- Use appropriate icons
- Include action buttons when possible
- Consider different states (no data, no results, error)

### Status Indicators
- Use consistent colors (green=success, red=error, etc.)
- Keep messages brief and clear
- Allow dismissal when appropriate
- Use dots for compact status displays
- Consider grouping related statuses

## File Structure

```
/workspace/
├── src/
│   ├── app/
│   │   ├── layout.tsx (Providers integrated)
│   │   └── feedback-demo/
│   │       └── page.tsx (Demo page)
│   ├── components/
│   │   └── ui/
│   │       ├── status-indicator.tsx
│   │       ├── loading-spinner.tsx
│   │       ├── progress.tsx
│   │       ├── empty-state.tsx
│   │       ├── toast.tsx
│   │       ├── notification-panel.tsx
│   │       ├── scroll-area.tsx
│   │       └── feedback/
│   │           └── index.ts (Centralized exports)
│   └── contexts/
│       ├── ToastContext.tsx
│       └── NotificationContext.tsx
└── FEEDBACK_COMPONENTS.md (This file)
```

## Integration Checklist

- ✅ All components created
- ✅ Context providers implemented
- ✅ Providers added to app layout
- ✅ Demo page created
- ✅ TypeScript types defined
- ✅ Accessibility implemented
- ✅ Animations and transitions
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Documentation complete

## Examples

### Complete Toast Example

```tsx
'use client';

import { useToastHelpers } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/button';

export default function MyPage() {
  const { success, error, warning, info } = useToastHelpers();

  const handleSave = async () => {
    try {
      await saveData();
      success('Saved!', 'Your changes have been saved successfully');
    } catch (err) {
      error('Save failed', 'Could not save your changes. Please try again.');
    }
  };

  return (
    <Button onClick={handleSave}>
      Save Changes
    </Button>
  );
}
```

### Complete Notification Example

```tsx
'use client';

import { useState } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { NotificationPanel } from '@/components/ui/notification-panel';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

export default function Header() {
  const { unreadCount } = useNotifications();
  const [showPanel, setShowPanel] = useState(false);

  return (
    <div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowPanel(!showPanel)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-error text-xs">
            {unreadCount}
          </span>
        )}
      </Button>

      {showPanel && (
        <div className="absolute right-0 top-12 z-50">
          <NotificationPanel onClose={() => setShowPanel(false)} />
        </div>
      )}
    </div>
  );
}
```

## Testing

All components have been tested with:
- ✅ Build verification (no TypeScript errors)
- ✅ Component rendering
- ✅ Interactive functionality
- ✅ Dark mode compatibility
- ✅ Responsive behavior

Run the demo page to test all components interactively:
```bash
npm run dev
# Navigate to /feedback-demo
```

## Support

For issues or questions:
1. Check this documentation
2. Review the demo page at `/feedback-demo`
3. Inspect component source code
4. Test in browser DevTools

---

**Created**: 2025-10-24  
**Status**: Complete ✅  
**Linear Issue**: DSA-42
