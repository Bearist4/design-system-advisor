import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const skeletonVariants = cva(
  "animate-pulse rounded-md bg-muted",
  {
    variants: {
      variant: {
        default: "bg-muted",
        shimmer: "relative overflow-hidden bg-muted before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number
  height?: string | number
  circle?: boolean
}

function Skeleton({
  className,
  variant,
  width,
  height,
  circle = false,
  style,
  ...props
}: SkeletonProps) {
  const combinedStyle = {
    width,
    height,
    ...(circle && { borderRadius: "50%", aspectRatio: "1" }),
    ...style,
  }

  return (
    <div
      className={cn(
        skeletonVariants({ variant }),
        circle && "rounded-full",
        className
      )}
      style={combinedStyle}
      aria-busy="true"
      aria-live="polite"
      {...props}
    />
  )
}

// Preset skeleton components for common use cases
function SkeletonText({ 
  lines = 1, 
  className,
}: { 
  lines?: number
  className?: string 
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className="h-4 w-full" 
          style={{ 
            width: i === lines - 1 && lines > 1 ? "80%" : "100%" 
          }}
        />
      ))}
    </div>
  )
}

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      <Skeleton className="h-48 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}

function SkeletonAvatar({ 
  size = 40,
  className,
}: { 
  size?: number
  className?: string 
}) {
  return (
    <Skeleton 
      circle 
      width={size} 
      height={size}
      className={className}
    />
  )
}

function SkeletonButton({ className }: { className?: string }) {
  return <Skeleton className={cn("h-10 w-24", className)} />
}

function SkeletonTable({ 
  rows = 5,
  columns = 4,
  className,
}: { 
  rows?: number
  columns?: number
  className?: string 
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-8 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-12 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export { 
  Skeleton, 
  SkeletonText,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonTable,
  skeletonVariants 
}
