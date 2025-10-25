import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const spinnerVariants = cva(
  "animate-spin",
  {
    variants: {
      size: {
        xs: "h-3 w-3",
        sm: "h-4 w-4",
        default: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
      },
      variant: {
        default: "text-primary",
        muted: "text-muted-foreground",
        success: "text-success",
        warning: "text-warning",
        error: "text-error",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
)

export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size, variant, label, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        aria-label={label || "Loading"}
        className={cn("inline-flex items-center justify-center", className)}
        {...props}
      >
        <Loader2 className={cn(spinnerVariants({ size, variant }))} />
        {label && <span className="sr-only">{label}</span>}
      </div>
    )
  }
)
LoadingSpinner.displayName = "LoadingSpinner"

// Full page loading overlay
interface LoadingOverlayProps {
  label?: string
  backdrop?: boolean
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  label = "Loading...", 
  backdrop = true 
}) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-modal flex items-center justify-center",
        backdrop && "bg-background/80 backdrop-blur-sm"
      )}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="xl" />
        {label && (
          <p className="text-sm text-muted-foreground">{label}</p>
        )}
      </div>
    </div>
  )
}
LoadingOverlay.displayName = "LoadingOverlay"

export { LoadingSpinner, LoadingOverlay, spinnerVariants }
