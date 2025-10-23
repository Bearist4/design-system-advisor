import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { LogOut, User } from "lucide-react"

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
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">Design System Advisor</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-2">
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="Avatar"
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                    <span className="text-sm font-medium">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={onSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button variant="default" size="sm">
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
