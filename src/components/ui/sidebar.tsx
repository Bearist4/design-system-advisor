'use client'

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Badge } from "./badge"
import { Upload, Home, Settings, FileText, ChevronDown, ChevronRight, Menu, X, User, Shield, Building } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LucideIcon } from "lucide-react"

export interface MenuItem {
  href?: string
  label: string
  icon: LucideIcon
  badge?: string | number
  children?: MenuItem[]
}

export interface MenuSection {
  title?: string
  items: MenuItem[]
}

export interface SidebarProps {
  className?: string
  sections?: MenuSection[]
  defaultCollapsed?: boolean
  onCollapseChange?: (collapsed: boolean) => void
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, sections: customSections, defaultCollapsed = false, onCollapseChange }, ref) => {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
    const [expandedSections, setExpandedSections] = React.useState<Set<string>>(new Set())
    const [isMobileOpen, setIsMobileOpen] = React.useState(false)

    // Default sections if none provided
    const defaultSections: MenuSection[] = [
      {
        title: "Main",
        items: [
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
        ],
      },
      {
        title: "User",
        items: [
          {
            label: "Profile",
            icon: User,
            children: [
              {
                href: "/profile",
                label: "My Profile",
                icon: User,
              },
              {
                href: "/test-profile",
                label: "Test RBAC",
                icon: Shield,
              },
            ],
          },
        ],
      },
      {
        title: "System",
        items: [
          {
            href: "/settings",
            label: "Settings",
            icon: Settings,
          },
        ],
      },
    ]

    const sections = customSections || defaultSections

    const toggleCollapse = React.useCallback(() => {
      const newState = !isCollapsed
      setIsCollapsed(newState)
      onCollapseChange?.(newState)
    }, [isCollapsed, onCollapseChange])

    const toggleSection = React.useCallback((itemLabel: string) => {
      setExpandedSections((prev) => {
        const next = new Set(prev)
        if (next.has(itemLabel)) {
          next.delete(itemLabel)
        } else {
          next.add(itemLabel)
        }
        return next
      })
    }, [])

    const isItemActive = (item: MenuItem): boolean => {
      if (item.href && pathname === item.href) return true
      if (item.children) {
        return item.children.some((child) => child.href === pathname)
      }
      return false
    }

    const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        action()
      }
    }

    const renderMenuItem = (item: MenuItem, depth: number = 0) => {
      const isActive = isItemActive(item)
      const hasChildren = item.children && item.children.length > 0
      const isExpanded = expandedSections.has(item.label)

      if (hasChildren) {
        return (
          <div key={item.label} className="space-y-1">
            <div
              role="button"
              tabIndex={0}
              aria-expanded={isExpanded}
              aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${item.label}`}
              onClick={() => toggleSection(item.label)}
              onKeyDown={(e) => handleKeyDown(e, () => toggleSection(item.label))}
              className={cn(
                "flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-all cursor-pointer",
                "hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                isActive && "bg-secondary text-secondary-foreground",
                depth > 0 && "pl-9"
              )}
            >
              <div className="flex items-center flex-1 min-w-0">
                <item.icon className={cn(
                  "h-4 w-4 shrink-0",
                  isCollapsed ? "" : "mr-3"
                )} />
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
                {!isCollapsed && item.badge && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </div>
              {!isCollapsed && (
                <div className="ml-2 shrink-0">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              )}
            </div>
            {isExpanded && !isCollapsed && (
              <div className="ml-2 space-y-1 animate-accordion-down" role="group" aria-label={`${item.label} submenu`}>
                {item.children!.map((child) => renderMenuItem(child, depth + 1))}
              </div>
            )}
          </div>
        )
      }

      const content = (
        <div
          className={cn(
            "flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-all",
            "hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
            isActive && "bg-secondary text-secondary-foreground font-medium",
            depth > 0 && "pl-9"
          )}
        >
          <div className="flex items-center flex-1 min-w-0">
            <item.icon className={cn(
              "h-4 w-4 shrink-0",
              isCollapsed ? "" : "mr-3"
            )} />
            {!isCollapsed && (
              <span className="truncate">{item.label}</span>
            )}
          </div>
          {!isCollapsed && item.badge && (
            <Badge variant="secondary" className="ml-2 shrink-0">
              {item.badge}
            </Badge>
          )}
        </div>
      )

      if (item.href) {
        return (
          <Link
            key={item.href}
            href={item.href}
            className="block focus:outline-none"
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
          >
            {content}
          </Link>
        )
      }

      return <div key={item.label}>{content}</div>
    }

    const sidebarContent = (
      <>
        <div className={cn(
          "flex items-center justify-between p-4 border-b",
          isCollapsed && "justify-center"
        )}>
          {!isCollapsed && (
            <h2 className="text-lg font-semibold truncate">Navigation</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="shrink-0 h-8 w-8"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!isCollapsed}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-6" role="navigation" aria-label="Main navigation">
          {sections.map((section, index) => (
            <div key={section.title || index} className="space-y-2">
              {section.title && !isCollapsed && (
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1" role="list">
                {section.items.map((item) => renderMenuItem(item))}
              </div>
            </div>
          ))}
        </nav>
      </>
    )

    return (
      <>
        {/* Mobile Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="fixed top-4 left-4 z-50 md:hidden"
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Mobile Overlay */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Desktop Sidebar */}
        <div
          ref={ref}
          className={cn(
            "hidden md:flex h-full flex-col border-r bg-background transition-all duration-300 ease-in-out",
            isCollapsed ? "w-16" : "w-64",
            className
          )}
          aria-label="Sidebar navigation"
        >
          {sidebarContent}
        </div>

        {/* Mobile Sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex md:hidden w-64 flex-col border-r bg-background transition-transform duration-300 ease-in-out",
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
          aria-label="Mobile sidebar navigation"
        >
          {sidebarContent}
        </div>
      </>
    )
  }
)
Sidebar.displayName = "Sidebar"

export { Sidebar }
