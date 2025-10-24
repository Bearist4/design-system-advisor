import * as React from "react"
import { cn } from "@/lib/utils"
import { FileX, Inbox, Search, Database, AlertCircle } from "lucide-react"
import { Button } from "./button"

const iconMap = {
  default: Inbox,
  search: Search,
  file: FileX,
  database: Database,
  error: AlertCircle,
}

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: "default" | "search" | "file" | "database" | "error" | React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ 
    className, 
    icon = "default", 
    title, 
    description, 
    action,
    secondaryAction,
    children,
    ...props 
  }, ref) => {
    const IconComponent = typeof icon === "string" ? iconMap[icon] : null

    return (
      <div
        ref={ref}
        role="status"
        aria-label="Empty state"
        className={cn(
          "flex flex-col items-center justify-center py-12 px-4 text-center",
          className
        )}
        {...props}
      >
        <div className="mb-4 rounded-full bg-muted p-6">
          {IconComponent ? (
            <IconComponent className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
          ) : (
            icon
          )}
        </div>
        
        <h3 className="mb-2 text-xl font-semibold text-foreground">
          {title}
        </h3>
        
        {description && (
          <p className="mb-6 max-w-md text-sm text-muted-foreground">
            {description}
          </p>
        )}

        {children}

        {(action || secondaryAction) && (
          <div className="flex flex-wrap gap-3 mt-4">
            {action && (
              <Button onClick={action.onClick}>
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button variant="outline" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    )
  }
)
EmptyState.displayName = "EmptyState"

// Compact empty state for smaller spaces
const EmptyStateCompact = React.forwardRef<
  HTMLDivElement,
  Omit<EmptyStateProps, "secondaryAction">
>(({ className, icon = "default", title, description, action, ...props }, ref) => {
  const IconComponent = typeof icon === "string" ? iconMap[icon] : null

  return (
    <div
      ref={ref}
      role="status"
      aria-label="Empty state"
      className={cn(
        "flex flex-col items-center justify-center py-8 px-4 text-center",
        className
      )}
      {...props}
    >
      {IconComponent ? (
        <IconComponent className="h-8 w-8 text-muted-foreground mb-3" aria-hidden="true" />
      ) : (
        <div className="mb-3">{icon}</div>
      )}
      
      <p className="text-sm font-medium text-foreground mb-1">{title}</p>
      
      {description && (
        <p className="text-xs text-muted-foreground mb-3 max-w-xs">
          {description}
        </p>
      )}

      {action && (
        <Button size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
})
EmptyStateCompact.displayName = "EmptyStateCompact"

export { EmptyState, EmptyStateCompact }
