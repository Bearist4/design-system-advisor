import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react"

const toastVariants = cva(
  "pointer-events-auto relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-lg border p-4 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        success: "border-success bg-success text-success-foreground",
        error: "border-error bg-error text-error-foreground", 
        warning: "border-warning bg-warning text-warning-foreground",
        info: "border-info bg-info text-info-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  title?: string
  description?: string
  action?: React.ReactNode
  onClose?: () => void
  showIcon?: boolean
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ 
    className, 
    variant = "default", 
    title, 
    description, 
    action,
    onClose,
    showIcon = true,
    children,
    ...props 
  }, ref) => {
    const Icon = variant && variant !== "default" ? iconMap[variant] : null

    return (
      <div
        ref={ref}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className={cn(toastVariants({ variant }), className)}
        {...props}
      >
        <div className="flex gap-3 flex-1">
          {Icon && showIcon && (
            <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
          )}
          <div className="flex flex-col gap-1 flex-1">
            {title && (
              <div className="text-sm font-semibold">
                {title}
              </div>
            )}
            {description && (
              <div className="text-sm opacity-95">
                {description}
              </div>
            )}
            {children}
            {action && (
              <div className="mt-2">
                {action}
              </div>
            )}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-md p-1 opacity-80 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current transition-opacity"
            aria-label="Close toast"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }
)
Toast.displayName = "Toast"

export { Toast, toastVariants }
