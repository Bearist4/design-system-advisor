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
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">Design System Advisor</h1>
            </div>
            
            <div className="flex items-center space-x-4" role="group" aria-label="User menu">
              <ThemeToggleIcon />
              {user ? (
                <>
                  <div 
                    className="flex items-center space-x-2"
                    role="status"
                    aria-label={`Logged in as ${user.user_metadata?.full_name || user.email}`}
                  >
                    {user.user_metadata?.avatar_url ? (
                      <Image
                        src={user.user_metadata.avatar_url}
                        alt={`${user.user_metadata?.full_name || user.email}'s avatar`}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div 
                        className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center"
                        aria-hidden="true"
                      >
                        <User className="h-4 w-4" />
                      </div>
                    )}
                    <span className="text-sm font-medium">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onSignOut}
                    aria-label="Sign out"
                  >
                    <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button variant="default" size="sm" aria-label="Sign in to your account">
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
