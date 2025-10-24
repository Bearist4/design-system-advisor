import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react"

/* ========== INPUT FIELD VARIANTS ========== */
const inputFieldVariants = cva(
  [
    // Base styles
    "flex w-full rounded-md border bg-background ring-offset-background",
    "file:border-0 file:bg-transparent file:font-medium",
    "placeholder:text-muted-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "transition-all duration-200",
    // Responsive text size for file input
    "file:text-xs sm:file:text-sm",
  ],
  {
    variants: {
      // Size variants
      size: {
        sm: [
          "h-8 sm:h-9",
          "px-2 sm:px-2.5 py-1 sm:py-1.5",
          "text-xs sm:text-sm",
        ],
        md: [
          "h-9 sm:h-10 md:h-11",
          "px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2",
          "text-xs sm:text-sm md:text-base",
        ],
        lg: [
          "h-11 sm:h-12 md:h-13",
          "px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3",
          "text-sm sm:text-base md:text-lg",
        ],
      },
      // Validation state variants
      state: {
        default: [
          "border-input",
          "focus-visible:ring-ring",
        ],
        success: [
          "border-success",
          "focus-visible:ring-success",
          "focus-visible:border-success",
        ],
        error: [
          "border-error",
          "focus-visible:ring-error",
          "focus-visible:border-error",
        ],
        warning: [
          "border-warning",
          "focus-visible:ring-warning",
          "focus-visible:border-warning",
        ],
      },
    },
    defaultVariants: {
      size: "md",
      state: "default",
    },
  }
)

/* ========== HELPER TEXT VARIANTS ========== */
const helperTextVariants = cva(
  "text-xs sm:text-sm mt-1.5 transition-colors duration-200",
  {
    variants: {
      state: {
        default: "text-muted-foreground",
        success: "text-success",
        error: "text-error",
        warning: "text-warning",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
)

/* ========== LABEL VARIANTS ========== */
const labelVariants = cva(
  "text-sm sm:text-base font-medium leading-none mb-2 block transition-colors duration-200",
  {
    variants: {
      state: {
        default: "text-foreground",
        success: "text-success",
        error: "text-error",
        warning: "text-warning",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      state: "default",
      disabled: false,
    },
  }
)

/* ========== ICON CONTAINER VARIANTS ========== */
const iconContainerVariants = cva(
  "absolute top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none transition-colors duration-200",
  {
    variants: {
      position: {
        left: "left-2 sm:left-3",
        right: "right-2 sm:right-3",
      },
      size: {
        sm: "w-4 h-4",
        md: "w-4 h-4 sm:w-5 sm:h-5",
        lg: "w-5 h-5 sm:w-6 sm:h-6",
      },
      state: {
        default: "text-muted-foreground",
        success: "text-success",
        error: "text-error",
        warning: "text-warning",
      },
    },
    defaultVariants: {
      position: "left",
      size: "md",
      state: "default",
    },
  }
)

/* ========== TYPE DEFINITIONS ========== */
export interface InputFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputFieldVariants> {
  /**
   * Label text for the input field
   */
  label?: string
  /**
   * Helper text displayed below the input
   */
  helperText?: string
  /**
   * Error message (overrides helperText when present)
   */
  errorMessage?: string
  /**
   * Success message (overrides helperText when present)
   */
  successMessage?: string
  /**
   * Warning message (overrides helperText when present)
   */
  warningMessage?: string
  /**
   * Icon to display on the left side of the input
   */
  leftIcon?: React.ReactNode
  /**
   * Icon to display on the right side of the input
   */
  rightIcon?: React.ReactNode
  /**
   * Whether to show validation icon automatically
   */
  showValidationIcon?: boolean
  /**
   * Container className
   */
  containerClassName?: string
  /**
   * Label className
   */
  labelClassName?: string
  /**
   * Helper text className
   */
  helperTextClassName?: string
}

/* ========== VALIDATION ICONS ========== */
const ValidationIcon = ({ 
  state, 
  size = "md" 
}: { 
  state: "success" | "error" | "warning"
  size?: "sm" | "md" | "lg" 
}) => {
  const iconClass = cn(iconContainerVariants({ position: "right", size, state }))
  
  switch (state) {
    case "success":
      return (
        <div className={iconClass} aria-hidden="true">
          <CheckCircle2 className="w-full h-full" />
        </div>
      )
    case "error":
      return (
        <div className={iconClass} aria-hidden="true">
          <AlertCircle className="w-full h-full" />
        </div>
      )
    case "warning":
      return (
        <div className={iconClass} aria-hidden="true">
          <AlertTriangle className="w-full h-full" />
        </div>
      )
    default:
      return null
  }
}

/* ========== INPUT FIELD COMPONENT ========== */
const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      className,
      type = "text",
      size = "md",
      state,
      label,
      helperText,
      errorMessage,
      successMessage,
      warningMessage,
      leftIcon,
      rightIcon,
      showValidationIcon = true,
      containerClassName,
      labelClassName,
      helperTextClassName,
      disabled,
      required,
      id,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref
  ) => {
    // Generate unique IDs for accessibility
    const generatedId = React.useId()
    const inputId = id || generatedId
    const helperTextId = `${inputId}-helper`
    const errorId = `${inputId}-error`
    
    // Determine current state based on messages
    const currentState = React.useMemo(() => {
      if (errorMessage) return "error"
      if (successMessage) return "success"
      if (warningMessage) return "warning"
      return state || "default"
    }, [errorMessage, successMessage, warningMessage, state])
    
    // Determine message to display
    const displayMessage = errorMessage || successMessage || warningMessage || helperText
    
    // Determine if validation icon should be shown
    const shouldShowValidationIcon = 
      showValidationIcon && 
      !rightIcon && 
      (currentState === "success" || currentState === "error" || currentState === "warning")
    
    // Calculate padding based on icons
    const hasLeftIcon = Boolean(leftIcon)
    const hasRightIcon = Boolean(rightIcon) || shouldShowValidationIcon
    
    const inputPaddingClass = cn({
      "pl-8 sm:pl-9": hasLeftIcon && size === "sm",
      "pl-9 sm:pl-10 md:pl-11": hasLeftIcon && size === "md",
      "pl-10 sm:pl-11 md:pl-12": hasLeftIcon && size === "lg",
      "pr-8 sm:pr-9": hasRightIcon && size === "sm",
      "pr-9 sm:pr-10 md:pr-11": hasRightIcon && size === "md",
      "pr-10 sm:pr-11 md:pr-12": hasRightIcon && size === "lg",
    })
    
    // Build aria-describedby
    const describedBy = React.useMemo(() => {
      const ids = []
      if (displayMessage) {
        ids.push(currentState === "error" ? errorId : helperTextId)
      }
      if (ariaDescribedBy) {
        ids.push(ariaDescribedBy)
      }
      return ids.length > 0 ? ids.join(" ") : undefined
    }, [displayMessage, currentState, errorId, helperTextId, ariaDescribedBy])
    
    return (
      <div className={cn("w-full", containerClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              labelVariants({ state: currentState, disabled: disabled || false }),
              labelClassName
            )}
          >
            {label}
            {required && (
              <span className="text-error ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        )}
        
        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div
              className={cn(
                iconContainerVariants({ 
                  position: "left", 
                  size, 
                  state: currentState 
                })
              )}
              aria-hidden="true"
            >
              {leftIcon}
            </div>
          )}
          
          {/* Input */}
          <input
            ref={ref}
            type={type}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-invalid={currentState === "error" || ariaInvalid}
            aria-describedby={describedBy}
            aria-required={required}
            className={cn(
              inputFieldVariants({ size, state: currentState }),
              inputPaddingClass,
              className
            )}
            {...props}
          />
          
          {/* Right Icon or Validation Icon */}
          {rightIcon && (
            <div
              className={cn(
                iconContainerVariants({ 
                  position: "right", 
                  size, 
                  state: currentState 
                })
              )}
              aria-hidden="true"
            >
              {rightIcon}
            </div>
          )}
          
          {shouldShowValidationIcon && (
            <ValidationIcon state={currentState as "success" | "error" | "warning"} size={size} />
          )}
        </div>
        
        {/* Helper Text / Error Message */}
        {displayMessage && (
          <div
            id={currentState === "error" ? errorId : helperTextId}
            className={cn(
              helperTextVariants({ state: currentState }),
              helperTextClassName
            )}
            role={currentState === "error" ? "alert" : "status"}
            aria-live={currentState === "error" ? "assertive" : "polite"}
          >
            {displayMessage}
          </div>
        )}
        
        {/* Screen reader announcements for validation state changes */}
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {currentState === "error" && errorMessage && `Error: ${errorMessage}`}
          {currentState === "success" && successMessage && `Success: ${successMessage}`}
          {currentState === "warning" && warningMessage && `Warning: ${warningMessage}`}
        </div>
      </div>
    )
  }
)

InputField.displayName = "InputField"

export { InputField, inputFieldVariants, helperTextVariants, labelVariants }
