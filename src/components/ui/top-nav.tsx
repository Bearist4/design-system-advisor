'use client'

import * as React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"
import { 
  Search, 
  Bell, 
  User, 
  LogOut, 
  Settings, 
  ChevronRight,
  Menu,
  X,
  Home,
  Check,
  Trash2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Badge } from "./badge"
import { Input } from "./input"
import { ThemeToggleIcon } from "./theme-toggle"
import { useNotifications } from "@/contexts/NotificationContext"

export interface TopNavProps {
  user?: {
    email?: string
    user_metadata?: {
      full_name?: string
      avatar_url?: string
    }
  } | null
  onSignOut: () => void
}

interface SearchResult {
  id: string
  title: string
  description?: string
  url: string
  type: 'page' | 'action' | 'content'
}

// Mock search data - replace with actual search implementation
const mockSearchData: SearchResult[] = [
  { id: '1', title: 'Dashboard', description: 'View your dashboard', url: '/dashboard', type: 'page' },
  { id: '2', title: 'Profile', description: 'Manage your profile', url: '/profile', type: 'page' },
  { id: '3', title: 'Settings', description: 'Application settings', url: '/settings', type: 'page' },
  { id: '4', title: 'Tokens', description: 'Manage design tokens', url: '/tokens', type: 'page' },
  { id: '5', title: 'Upload', description: 'Upload files', url: '/upload', type: 'page' },
]

export function TopNav({ user, onSignOut }: TopNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotifications()
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchFocusIndex, setSearchFocusIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  
  // Notification state
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  
  // User menu state
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Generate breadcrumbs from pathname
  const breadcrumbs = React.useMemo(() => {
    const paths = pathname.split('/').filter(Boolean)
    const crumbs = [{ label: 'Home', path: '/' }]
    
    let currentPath = ''
    paths.forEach((path) => {
      currentPath += `/${path}`
      crumbs.push({
        label: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' '),
        path: currentPath
      })
    })
    
    return crumbs
  }, [pathname])

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const timer = setTimeout(() => {
      // Filter mock data based on query
      const filtered = mockSearchData.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setSearchResults(filtered)
      setSearchFocusIndex(-1)
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard navigation for search
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!searchResults.length) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSearchFocusIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSearchFocusIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (searchFocusIndex >= 0 && searchResults[searchFocusIndex]) {
          handleSearchResultClick(searchResults[searchFocusIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsSearchOpen(false)
        setSearchQuery('')
        searchInputRef.current?.blur()
        break
    }
  }

  const handleSearchResultClick = (result: SearchResult) => {
    router.push(result.url)
    setIsSearchOpen(false)
    setSearchQuery('')
  }

  const handleNotificationClick = (notificationId: string, actionUrl?: string) => {
    markAsRead(notificationId)
    if (actionUrl) {
      router.push(actionUrl)
      setIsNotificationOpen(false)
    }
  }

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
        searchInputRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <nav
      className="sticky top-0 z-sticky border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo/Brand */}
          <div className="flex items-center min-w-0 flex-shrink">
            <h1 className="text-base sm:text-lg md:text-xl font-bold truncate">
              <span className="hidden sm:inline">Design System Advisor</span>
              <span className="sm:hidden">DSA</span>
            </h1>
          </div>

          {/* Breadcrumbs - Desktop only */}
          <div className="hidden xl:flex items-center gap-2 text-sm text-muted-foreground flex-1 min-w-0">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.path}>
                {index > 0 && <ChevronRight className="h-4 w-4 flex-shrink-0" />}
                <button
                  onClick={() => router.push(crumb.path)}
                  className={cn(
                    "hover:text-foreground transition-colors truncate",
                    index === breadcrumbs.length - 1 && "text-foreground font-medium"
                  )}
                  aria-current={index === breadcrumbs.length - 1 ? "page" : undefined}
                >
                  {index === 0 ? <Home className="h-4 w-4" /> : crumb.label}
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 xl:flex-none xl:w-80 max-w-md" ref={searchRef}>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                ref={searchInputRef}
                type="search"
                placeholder="Search... (⌘K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                onKeyDown={handleSearchKeyDown}
                className="pl-9 pr-4"
                aria-label="Search"
                aria-expanded={isSearchOpen && searchResults.length > 0}
                aria-controls="search-results"
              />
              
              {/* Search Results Dropdown */}
              {isSearchOpen && searchResults.length > 0 && (
                <div
                  id="search-results"
                  className="absolute top-full mt-2 w-full bg-popover border rounded-md shadow-lg overflow-hidden z-dropdown"
                  role="listbox"
                >
                  {searchResults.map((result, index) => (
                    <button
                      key={result.id}
                      onClick={() => handleSearchResultClick(result)}
                      className={cn(
                        "w-full text-left px-4 py-3 hover:bg-accent transition-colors",
                        "focus:bg-accent focus:outline-none",
                        index === searchFocusIndex && "bg-accent"
                      )}
                      role="option"
                      aria-selected={index === searchFocusIndex}
                    >
                      <div className="font-medium text-sm">{result.title}</div>
                      {result.description && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {result.description}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Search Button - Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Theme Toggle */}
            <ThemeToggleIcon />

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                aria-label={`Notifications (${unreadCount} unread)`}
                aria-expanded={isNotificationOpen}
                className="relative"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    variant="destructive"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Button>

              {/* Notifications Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-popover border rounded-md shadow-lg overflow-hidden z-dropdown">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                    {notifications.length > 0 && (
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={markAllAsRead}
                          className="text-xs h-7"
                        >
                          Mark all read
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearAll}
                          className="text-xs h-7"
                        >
                          Clear all
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground text-sm">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={cn(
                            "p-4 border-b hover:bg-accent transition-colors cursor-pointer group",
                            !notification.read && "bg-accent/50"
                          )}
                          onClick={() => handleNotificationClick(notification.id, notification.actionUrl)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm truncate">{notification.title}</p>
                                {!notification.read && (
                                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                                )}
                              </div>
                              {notification.description && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {notification.description}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(notification.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeNotification(notification.id)
                              }}
                              aria-label="Remove notification"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            {user && (
              <div className="relative" ref={userMenuRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="gap-2"
                  aria-label="User menu"
                  aria-expanded={isUserMenuOpen}
                >
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="hidden lg:inline text-sm max-w-[120px] truncate">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                </Button>

                {/* User Menu Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-popover border rounded-md shadow-lg overflow-hidden z-dropdown">
                    <div className="p-4 border-b">
                      <p className="font-medium text-sm truncate">
                        {user.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {user.email}
                      </p>
                    </div>
                    
                    <div className="py-2">
                      <button
                        onClick={() => {
                          router.push('/profile')
                          setIsUserMenuOpen(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors flex items-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          router.push('/settings')
                          setIsUserMenuOpen(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors flex items-center gap-2"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </button>
                    </div>
                    
                    <div className="border-t py-2">
                      <button
                        onClick={onSignOut}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors flex items-center gap-2 text-destructive"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Mobile Breadcrumbs */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.path}>
                  {index > 0 && <ChevronRight className="h-4 w-4" />}
                  <button
                    onClick={() => {
                      router.push(crumb.path)
                      setIsMobileMenuOpen(false)
                    }}
                    className={cn(
                      "hover:text-foreground transition-colors",
                      index === breadcrumbs.length - 1 && "text-foreground font-medium"
                    )}
                  >
                    {index === 0 ? <Home className="h-4 w-4" /> : crumb.label}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Search Modal */}
      {isSearchOpen && (
        <div className="md:hidden fixed inset-0 z-modal bg-background/95 backdrop-blur">
          <div className="container mx-auto p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="pl-9"
                  autoFocus
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsSearchOpen(false)
                  setSearchQuery('')
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-2">
                {searchResults.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => handleSearchResultClick(result)}
                    className={cn(
                      "w-full text-left p-4 rounded-md hover:bg-accent transition-colors",
                      index === searchFocusIndex && "bg-accent"
                    )}
                  >
                    <div className="font-medium text-sm">{result.title}</div>
                    {result.description && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {result.description}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
