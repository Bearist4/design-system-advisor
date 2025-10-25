'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useNotifications } from "@/contexts/NotificationContext"
import { Bell, Search, User, Menu, Keyboard } from "lucide-react"

export default function TopNavDemo() {
  const { addNotification } = useNotifications()

  const addTestNotification = (variant: 'default' | 'success' | 'error' | 'warning' | 'info') => {
    const messages = {
      default: { title: 'New Message', description: 'You have a new message' },
      success: { title: 'Success!', description: 'Your changes have been saved' },
      error: { title: 'Error', description: 'Something went wrong' },
      warning: { title: 'Warning', description: 'Please review your settings' },
      info: { title: 'Info', description: 'New features are available' },
    }

    addNotification({
      ...messages[variant],
      variant,
      actionUrl: '/dashboard',
      actionLabel: 'View'
    })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Top Navigation Bar Demo</h1>
        <p className="text-muted-foreground">
          A comprehensive top navigation bar with search, notifications, user menu, and breadcrumbs.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Search Feature */}
        <Card className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Global Search</h2>
              <p className="text-sm text-muted-foreground">Search with debouncing and autocomplete</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm">
            <li>✅ 300ms debounce delay</li>
            <li>✅ Real-time filtering</li>
            <li>✅ Keyboard navigation (↑/↓ arrows)</li>
            <li>✅ Quick access with ⌘K / Ctrl+K</li>
            <li>✅ Mobile-responsive modal</li>
          </ul>
          <div className="mt-4 p-3 bg-muted rounded-md text-xs">
            <strong>Try it:</strong> Click the search bar or press ⌘K / Ctrl+K
          </div>
        </Card>

        {/* Notifications Feature */}
        <Card className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Notifications</h2>
              <p className="text-sm text-muted-foreground">Bell icon with notification count</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm mb-4">
            <li>✅ Unread count badge</li>
            <li>✅ Click to mark as read</li>
            <li>✅ Mark all as read</li>
            <li>✅ Clear all notifications</li>
            <li>✅ Action URLs for navigation</li>
          </ul>
          <div className="space-y-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full"
              onClick={() => addTestNotification('default')}
            >
              Add Default Notification
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full"
              onClick={() => addTestNotification('success')}
            >
              Add Success Notification
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full"
              onClick={() => addTestNotification('error')}
            >
              Add Error Notification
            </Button>
          </div>
        </Card>

        {/* User Menu Feature */}
        <Card className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">User Menu</h2>
              <p className="text-sm text-muted-foreground">Profile dropdown with actions</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm">
            <li>✅ User avatar or icon</li>
            <li>✅ Display name and email</li>
            <li>✅ Profile link</li>
            <li>✅ Settings link</li>
            <li>✅ Sign out action</li>
            <li>✅ Responsive layout</li>
          </ul>
          <div className="mt-4 p-3 bg-muted rounded-md text-xs">
            <strong>Try it:</strong> Click your user avatar in the top-right
          </div>
        </Card>

        {/* Mobile Menu Feature */}
        <Card className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Menu className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Mobile Menu</h2>
              <p className="text-sm text-muted-foreground">Hamburger menu for mobile devices</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm">
            <li>✅ Responsive breakpoints</li>
            <li>✅ Mobile search bar</li>
            <li>✅ Mobile breadcrumbs</li>
            <li>✅ Smooth transitions</li>
            <li>✅ Accessible controls</li>
          </ul>
          <div className="mt-4 p-3 bg-muted rounded-md text-xs">
            <strong>Try it:</strong> Resize your browser window or use mobile view
          </div>
        </Card>

        {/* Breadcrumbs Feature */}
        <Card className="p-6 md:col-span-2">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Menu className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Breadcrumb Navigation</h2>
              <p className="text-sm text-muted-foreground">Show current page hierarchy</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm mb-4">
            <li>✅ Auto-generated from route</li>
            <li>✅ Clickable navigation</li>
            <li>✅ Current page indicator</li>
            <li>✅ Responsive (desktop only on XL+)</li>
            <li>✅ Mobile version in hamburger menu</li>
          </ul>
          <div className="p-3 bg-muted rounded-md text-xs">
            <strong>Current breadcrumbs:</strong> Home → Topnav Demo
          </div>
        </Card>

        {/* Keyboard Shortcuts */}
        <Card className="p-6 md:col-span-2">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Keyboard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Keyboard Navigation</h2>
              <p className="text-sm text-muted-foreground">Full keyboard accessibility support</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Search Shortcuts</h3>
              <ul className="space-y-1 text-sm">
                <li><kbd className="px-2 py-1 bg-muted rounded text-xs">⌘K</kbd> or <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+K</kbd> - Open search</li>
                <li><kbd className="px-2 py-1 bg-muted rounded text-xs">↑</kbd> <kbd className="px-2 py-1 bg-muted rounded text-xs">↓</kbd> - Navigate results</li>
                <li><kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd> - Select result</li>
                <li><kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd> - Close search</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">General Navigation</h3>
              <ul className="space-y-1 text-sm">
                <li><kbd className="px-2 py-1 bg-muted rounded text-xs">Tab</kbd> - Navigate between elements</li>
                <li><kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd> - Activate buttons</li>
                <li><kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd> - Close dropdowns</li>
                <li>All interactive elements are keyboard accessible</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Feature Summary */}
      <Card className="p-6 bg-primary/5">
        <h2 className="text-xl font-semibold mb-4">✨ All Features Implemented</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <h3 className="font-medium text-sm mb-2">🔍 Search</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Debounced search (300ms)</li>
              <li>• Keyboard shortcuts</li>
              <li>• Mobile responsive</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-sm mb-2">🔔 Notifications</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Badge with unread count</li>
              <li>• Mark as read/unread</li>
              <li>• Clear functionality</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-sm mb-2">👤 User Menu</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Profile information</li>
              <li>• Quick actions</li>
              <li>• Sign out</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-sm mb-2">🗂️ Breadcrumbs</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Auto-generated</li>
              <li>• Clickable navigation</li>
              <li>• Current page highlight</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-sm mb-2">📱 Responsive</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Mobile hamburger menu</li>
              <li>• Breakpoint optimized</li>
              <li>• Touch-friendly</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-sm mb-2">⌨️ Accessibility</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Full keyboard support</li>
              <li>• ARIA labels</li>
              <li>• Screen reader friendly</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
