import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  AlertTriangle,
  X 
} from "lucide-react"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:text-foreground [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-border",
        success: 
          "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100 [&>svg]:text-green-600 dark:[&>svg]:text-green-400",
        warning: 
          "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400",
        error: 
          "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100 [&>svg]:text-red-600 dark:[&>svg]:text-red-400",
        info: 
          "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  dismissible?: boolean
  onDismiss?: () => void
  icon?: React.ReactNode
  showIcon?: boolean
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ 
    className, 
    variant, 
    dismissible = false, 
    onDismiss,
    icon,
    showIcon = true,
    children, 
    ...props 
  }, ref) => {
    const [isDismissed, setIsDismissed] = React.useState(false)

    const handleDismiss = () => {
      setIsDismissed(true)
      onDismiss?.()
    }

    const defaultIcon = React.useMemo(() => {
      switch (variant) {
        case "success":
          return <CheckCircle2 className="h-5 w-5" />
        case "warning":
          return <AlertTriangle className="h-5 w-5" />
        case "error":
          return <AlertCircle className="h-5 w-5" />
        case "info":
          return <Info className="h-5 w-5" />
        default:
          return <Info className="h-5 w-5" />
      }
    }, [variant])

    if (isDismissed) {
      return null
    }

    return (
      <div
        ref={ref}
        role="alert"
        aria-live="polite"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {showIcon && (icon || defaultIcon)}
        <div className="flex-1">
          {children}
        </div>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="absolute right-4 top-4 rounded-md p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Dismiss alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription, alertVariants }
