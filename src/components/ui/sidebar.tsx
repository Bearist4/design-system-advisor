import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Upload, Home, Settings, FileText } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export interface SidebarProps {
  className?: string
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className }, ref) => {
    const pathname = usePathname()

    const navItems = [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: Home,
      },
      {
        href: "/upload",
        label: "Upload Tokens",
        icon: Upload,
      },
      {
        href: "/tokens",
        label: "All Tokens",
        icon: FileText,
      },
      {
        href: "/settings",
        label: "Settings",
        icon: Settings,
      },
    ]

    return (
      <div
        ref={ref}
        className={cn(
          "flex h-full w-64 flex-col border-r bg-background",
          className
        )}
      >
        <div className="p-6">
          <h2 className="text-lg font-semibold">Navigation</h2>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-secondary"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

export { Sidebar }
