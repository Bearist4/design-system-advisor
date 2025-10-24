import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const statusIndicatorVariants = cva(
  "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        success: "bg-success text-success-foreground border border-success",
        warning: "bg-warning text-warning-foreground border border-warning",
        error: "bg-error text-error-foreground border border-error",
        info: "bg-info text-info-foreground border border-info",
      },
      size: {
        sm: "px-2 py-1 text-xs",
        default: "px-3 py-1.5 text-sm",
        lg: "px-4 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "info",
      size: "default",
    },
  }
)

const iconMap = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
}

export interface StatusIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusIndicatorVariants> {
  showIcon?: boolean
  onClose?: () => void
}

const StatusIndicator = React.forwardRef<HTMLDivElement, StatusIndicatorProps>(
  ({ className, variant = "info", size, showIcon = true, onClose, children, ...props }, ref) => {
    const Icon = variant ? iconMap[variant] : Info

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className={cn(statusIndicatorVariants({ variant, size, className }))}
        {...props}
      >
        {showIcon && <Icon className="h-4 w-4 flex-shrink-0" />}
        <span className="flex-1">{children}</span>
        {onClose && (
          <Button
            onClick={onClose}
            icon={X}
            iconOnly
            size="xs"
            variant="ghost"
            className="ml-1 opacity-80 hover:opacity-100"
            aria-label="Close status indicator"
          />
        )}
      </div>
    )
  }
)
StatusIndicator.displayName = "StatusIndicator"

// Dot variant for compact status display
const StatusDot = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { variant?: "success" | "warning" | "error" | "info" }
>(({ className, variant = "info", ...props }, ref) => {
  const dotColors = {
    success: "bg-success",
    warning: "bg-warning",
    error: "bg-error",
    info: "bg-info",
  }

  return (
    <span
      ref={ref}
      className={cn(
        "inline-block h-2 w-2 rounded-full",
        dotColors[variant],
        className
      )}
      role="status"
      aria-label={`${variant} status`}
      {...props}
    />
  )
})
StatusDot.displayName = "StatusDot"

export { StatusIndicator, StatusDot, statusIndicatorVariants }
