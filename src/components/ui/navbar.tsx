import * as React from "react"
import Image from "next/image"
import { Button } from "./button"
import { LogOut, User } from "lucide-react"
import { ThemeToggleIcon } from "./theme-toggle"

export interface NavbarProps {
  user?: {
    email?: string
    user_metadata?: {
      full_name?: string
      avatar_url?: string
    }
  } | null
  onSignOut: () => void
}

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ user, onSignOut }, ref) => {
    return (
      <nav
        ref={ref}
        className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 md:h-16 items-center justify-between gap-2 sm:gap-4">
            {/* Logo/Brand - Responsive Text */}
            <div className="flex items-center min-w-0 flex-shrink">
              <h1 className="text-base sm:text-lg md:text-xl font-bold truncate">
                <span className="hidden sm:inline">Design System Advisor</span>
                <span className="sm:hidden">DS Advisor</span>
              </h1>
            </div>
            
            {/* Actions - Responsive Layout */}
            <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4 flex-shrink-0">
              <ThemeToggleIcon />
              {user ? (
                <>
                  {/* User Info - Hidden on small screens */}
                  <div className="hidden md:flex items-center gap-2">
                    {user.user_metadata?.avatar_url ? (
                      <Image
                        src={user.user_metadata.avatar_url}
                        alt="Avatar"
                        width={32}
                        height={32}
                        className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
                      />
                    ) : (
                      <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </div>
                    )}
                    <span className="text-xs sm:text-sm font-medium truncate max-w-[120px] lg:max-w-[200px]">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                  </div>
                  {/* Sign Out Button - Responsive */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onSignOut}
                    className="text-xs sm:text-sm"
                  >
                    <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </Button>
                </>
              ) : (
                <Button variant="default" size="sm" className="text-xs sm:text-sm">
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
    )
  }
)
Navbar.displayName = "Navbar"

export { Navbar }
