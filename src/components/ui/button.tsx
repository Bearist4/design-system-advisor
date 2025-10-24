import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { LucideIcon } from "lucide-react"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md active:scale-[0.98] disabled:bg-primary/50 disabled:shadow-none",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-md active:scale-[0.98] disabled:bg-destructive/50 disabled:shadow-none",
        outline:
          "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/50 active:scale-[0.98] disabled:border-input/50 disabled:text-muted-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-sm active:scale-[0.98] disabled:bg-secondary/50 disabled:shadow-none",
        ghost: "hover:bg-accent hover:text-accent-foreground active:scale-[0.98] disabled:text-muted-foreground disabled:bg-transparent",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80 disabled:text-primary/50 disabled:no-underline",
      },
      size: {
        xs: "h-7 px-2 text-xs rounded-sm",
        sm: "h-8 sm:h-9 px-2.5 sm:px-3 text-xs sm:text-sm rounded-md",
        default: "h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm py-1.5 sm:py-2",
        lg: "h-10 sm:h-11 px-6 sm:px-8 text-sm sm:text-base rounded-md",
        xl: "h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg rounded-lg",
        icon: "h-9 w-9 sm:h-10 sm:w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  loadingText?: string
  icon?: LucideIcon
  iconPosition?: "left" | "right"
  iconOnly?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    isLoading, 
    loadingText,
    disabled, 
    children, 
    icon: Icon,
    iconPosition = "left",
    iconOnly = false,
    ...props 
  }, ref) => {
    // Determine spinner size based on button size
    const spinnerSize = 
      size === "xs" ? "xs" :
      size === "sm" ? "sm" :
      size === "lg" || size === "xl" ? "sm" :
      "xs"

    // Determine icon size based on button size
    const iconSize = 
      size === "xs" ? "h-3 w-3" :
      size === "sm" ? "h-4 w-4" :
      size === "lg" ? "h-5 w-5" :
      size === "xl" ? "h-6 w-6" :
      "h-4 w-4"

    // Icon-only buttons should use the icon size variant
    const effectiveSize = iconOnly ? "icon" : size

    const content = (
      <>
        {isLoading ? (
          <>
            <LoadingSpinner 
              size={spinnerSize} 
              className="flex-shrink-0"
              aria-hidden="true"
            />
            {!iconOnly && (
              <span>{loadingText || children}</span>
            )}
          </>
        ) : (
          <>
            {iconOnly && Icon ? (
              <Icon className={cn(iconSize, "flex-shrink-0")} aria-hidden="true" />
            ) : (
              <>
                {Icon && iconPosition === "left" && (
                  <Icon className={cn(iconSize, "flex-shrink-0")} aria-hidden="true" />
                )}
                <span>{children}</span>
                {Icon && iconPosition === "right" && (
                  <Icon className={cn(iconSize, "flex-shrink-0")} aria-hidden="true" />
                )}
              </>
            )}
          </>
        )}
      </>
    )

    return (
      <button
        className={cn(
          buttonVariants({ variant, size: effectiveSize, className }),
          iconOnly && "aspect-square"
        )}
        ref={ref}
        disabled={disabled || isLoading}
        aria-disabled={disabled || isLoading}
        aria-busy={isLoading}
        aria-label={iconOnly ? (typeof children === "string" ? children : undefined) : undefined}
        {...props}
      >
        {content}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
