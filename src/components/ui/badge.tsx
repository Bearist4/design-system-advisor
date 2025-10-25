import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs sm:text-sm font-semibold",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
        foundation: "border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        spacing: "border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        brand: "border-transparent bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
        component: "border-transparent bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
        platform: "border-transparent bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
        misc: "border-transparent bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  'aria-label'?: string
}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div 
      className={cn(badgeVariants({ variant }), className)} 
      role="status"
      {...props} 
    />
  )
}

export { Badge, badgeVariants }
