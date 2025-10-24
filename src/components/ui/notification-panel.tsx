import * as React from "react"
import { cn } from "@/lib/utils"
import { useNotifications } from "@/contexts/NotificationContext"
import { Bell, X, CheckCheck, Trash2 } from "lucide-react"
import { Button } from "./button"
import { StatusIndicator } from "./status-indicator"
import { EmptyState } from "./empty-state"
import { ScrollArea } from "./scroll-area"

interface NotificationPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void
}

const NotificationPanel = React.forwardRef<HTMLDivElement, NotificationPanelProps>(
  ({ className, onClose, ...props }, ref) => {
    const { 
      notifications, 
      unreadCount, 
      markAsRead, 
      markAllAsRead, 
      removeNotification,
      clearAll 
    } = useNotifications()

    const formatTime = (date: Date) => {
      const now = new Date()
      const diff = now.getTime() - date.getTime()
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)

      if (minutes < 1) return 'Just now'
      if (minutes < 60) return `${minutes}m ago`
      if (hours < 24) return `${hours}h ago`
      if (days < 7) return `${days}d ago`
      return date.toLocaleDateString()
    }

    return (
      <div
        ref={ref}
        role="dialog"
        aria-labelledby="notification-panel-title"
        aria-describedby="notification-panel-description"
        className={cn(
          "flex h-full max-h-[600px] w-full flex-col rounded-lg border bg-popover text-popover-foreground shadow-lg md:w-[400px]",
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <h3 id="notification-panel-title" className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <span 
                className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground"
                aria-label={`${unreadCount} unread notifications`}
              >
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {notifications.length > 0 && (
              <>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    title="Mark all as read"
                  >
                    <CheckCheck className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  title="Clear all"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                title="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        {notifications.length === 0 ? (
          <EmptyState
            icon="default"
            title="No notifications"
            description="You're all caught up! Check back later for updates."
            className="flex-1"
          />
        ) : (
          <ScrollArea className="flex-1">
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "relative px-4 py-3 transition-colors hover:bg-accent/50",
                    !notification.read && "bg-accent/20"
                  )}
                >
                  {/* Unread indicator */}
                  {!notification.read && (
                    <div className="absolute left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary" />
                  )}

                  <div className="flex gap-3">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-none">
                          {notification.title}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0"
                          onClick={() => removeNotification(notification.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      {notification.description && (
                        <p className="text-sm text-muted-foreground">
                          {notification.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">
                          {formatTime(notification.timestamp)}
                        </p>
                        {notification.variant && notification.variant !== 'default' && (
                          <StatusIndicator 
                            variant={notification.variant} 
                            size="sm"
                            showIcon={false}
                            className="px-2 py-0.5"
                          >
                            {notification.variant}
                          </StatusIndicator>
                        )}
                      </div>

                      {notification.actionUrl && notification.actionLabel && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs"
                          onClick={() => {
                            markAsRead(notification.id)
                            // Handle navigation
                            window.location.href = notification.actionUrl!
                          }}
                        >
                          {notification.actionLabel}
                        </Button>
                      )}
                    </div>
                  </div>

                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 h-auto py-1 text-xs"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark as read
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    )
  }
)
NotificationPanel.displayName = "NotificationPanel"

export { NotificationPanel }
