'use client'

import { useState } from 'react'
import TokenTable from '@/components/ui/token-table'
import { DesignToken } from '@/lib/types/tokens'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTheme } from '@/contexts/ThemeContext'
import { Moon, Sun, Palette } from 'lucide-react'

/**
 * Sample Design Tokens
 * Comprehensive set of design tokens for demonstration
 */
const sampleTokens: DesignToken[] = [
  // Color Tokens
  {
    name: 'primary-50',
    value: 'hsl(214, 100%, 97%)',
    category: 'colors',
    description: 'Lightest primary color for backgrounds',
    status: 'active',
    cssVar: '--primary-50',
    tailwindClass: 'bg-primary-50',
    hex: '#f0f9ff',
    rgb: 'rgb(240, 249, 255)',
    hsl: 'hsl(214, 100%, 97%)',
    contrastRatio: 1.08,
    accessible: false,
  },
  {
    name: 'primary-500',
    value: 'hsl(217, 91%, 60%)',
    category: 'colors',
    description: 'Main primary color for interactive elements',
    status: 'active',
    cssVar: '--primary-500',
    tailwindClass: 'bg-primary-500',
    hex: '#3b82f6',
    rgb: 'rgb(59, 130, 246)',
    hsl: 'hsl(217, 91%, 60%)',
    contrastRatio: 4.5,
    accessible: true,
  },
  {
    name: 'primary-900',
    value: 'hsl(224, 64%, 33%)',
    category: 'colors',
    description: 'Darkest primary color for text',
    status: 'active',
    cssVar: '--primary-900',
    tailwindClass: 'bg-primary-900',
    hex: '#1e3a8a',
    rgb: 'rgb(30, 58, 138)',
    hsl: 'hsl(224, 64%, 33%)',
    contrastRatio: 7.2,
    accessible: true,
  },
  {
    name: 'success',
    value: 'hsl(120, 50%, 40%)',
    category: 'colors',
    description: 'Success state color',
    status: 'active',
    cssVar: '--success',
    tailwindClass: 'bg-success',
    hex: '#2d7c2d',
    rgb: 'rgb(45, 124, 45)',
    hsl: 'hsl(120, 50%, 40%)',
    contrastRatio: 5.1,
    accessible: true,
  },
  {
    name: 'warning',
    value: 'hsl(38, 70%, 50%)',
    category: 'colors',
    description: 'Warning state color',
    status: 'active',
    cssVar: '--warning',
    tailwindClass: 'bg-warning',
    hex: '#d97706',
    rgb: 'rgb(217, 119, 6)',
    hsl: 'hsl(38, 70%, 50%)',
    contrastRatio: 3.9,
    accessible: true,
  },
  {
    name: 'error',
    value: 'hsl(0, 60%, 50%)',
    category: 'colors',
    description: 'Error state color',
    status: 'active',
    cssVar: '--error',
    tailwindClass: 'bg-error',
    hex: '#cc3333',
    rgb: 'rgb(204, 51, 51)',
    hsl: 'hsl(0, 60%, 50%)',
    contrastRatio: 4.8,
    accessible: true,
  },
  {
    name: 'brand-accent',
    value: 'hsl(280, 70%, 60%)',
    category: 'colors',
    description: 'Brand accent color (deprecated)',
    status: 'deprecated',
    cssVar: '--brand-accent',
    tailwindClass: 'bg-brand-accent',
    hex: '#b366cc',
    rgb: 'rgb(179, 102, 204)',
    hsl: 'hsl(280, 70%, 60%)',
    usage: ['Use primary-500 instead'],
  },
  {
    name: 'experimental-purple',
    value: 'hsl(270, 80%, 55%)',
    category: 'colors',
    description: 'Experimental purple for testing',
    status: 'experimental',
    cssVar: '--experimental-purple',
    hex: '#a855f7',
    rgb: 'rgb(168, 85, 247)',
    hsl: 'hsl(270, 80%, 55%)',
  },

  // Typography Tokens
  {
    name: 'text-xs',
    value: 'clamp(0.6875rem, 0.65rem + 0.2vw, 0.75rem)',
    category: 'typography',
    description: 'Extra small text size',
    status: 'active',
    cssVar: '--text-xs',
    tailwindClass: 'text-xs',
    fontSize: '0.75rem',
    lineHeight: '1rem',
  },
  {
    name: 'text-sm',
    value: 'clamp(0.8125rem, 0.75rem + 0.3vw, 0.875rem)',
    category: 'typography',
    description: 'Small text size',
    status: 'active',
    cssVar: '--text-sm',
    tailwindClass: 'text-sm',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  },
  {
    name: 'text-base',
    value: 'clamp(0.9375rem, 0.875rem + 0.3vw, 1rem)',
    category: 'typography',
    description: 'Base text size',
    status: 'active',
    cssVar: '--text-base',
    tailwindClass: 'text-base',
    fontSize: '1rem',
    lineHeight: '1.5rem',
  },
  {
    name: 'text-lg',
    value: 'clamp(1.0625rem, 1rem + 0.3vw, 1.125rem)',
    category: 'typography',
    description: 'Large text size',
    status: 'active',
    cssVar: '--text-lg',
    tailwindClass: 'text-lg',
    fontSize: '1.125rem',
    lineHeight: '1.75rem',
  },
  {
    name: 'text-3xl',
    value: 'clamp(1.5rem, 1.3125rem + 0.9vw, 1.875rem)',
    category: 'typography',
    description: 'Extra large heading size',
    status: 'active',
    cssVar: '--text-3xl',
    tailwindClass: 'text-3xl',
    fontSize: '1.875rem',
    lineHeight: '2.25rem',
    fontWeight: '700',
  },
  {
    name: 'font-bold',
    value: '700',
    category: 'typography',
    description: 'Bold font weight',
    status: 'active',
    cssVar: '--font-bold',
    tailwindClass: 'font-bold',
    fontWeight: '700',
  },
  {
    name: 'leading-tight',
    value: '1.25',
    category: 'typography',
    description: 'Tight line height',
    status: 'active',
    cssVar: '--leading-tight',
    tailwindClass: 'leading-tight',
    lineHeight: '1.25',
  },

  // Spacing Tokens
  {
    name: 'space-1',
    value: '0.25rem',
    category: 'spacing',
    description: 'Extra small spacing unit',
    status: 'active',
    cssVar: '--space-1',
    tailwindClass: 'p-1',
    pixels: '4px',
    rem: '0.25rem',
  },
  {
    name: 'space-2',
    value: '0.5rem',
    category: 'spacing',
    description: 'Small spacing unit',
    status: 'active',
    cssVar: '--space-2',
    tailwindClass: 'p-2',
    pixels: '8px',
    rem: '0.5rem',
  },
  {
    name: 'space-4',
    value: '1rem',
    category: 'spacing',
    description: 'Base spacing unit',
    status: 'active',
    cssVar: '--space-4',
    tailwindClass: 'p-4',
    pixels: '16px',
    rem: '1rem',
  },
  {
    name: 'space-8',
    value: '2rem',
    category: 'spacing',
    description: 'Large spacing unit',
    status: 'active',
    cssVar: '--space-8',
    tailwindClass: 'p-8',
    pixels: '32px',
    rem: '2rem',
  },
  {
    name: 'space-16',
    value: '4rem',
    category: 'spacing',
    description: 'Extra large spacing unit',
    status: 'active',
    cssVar: '--space-16',
    tailwindClass: 'p-16',
    pixels: '64px',
    rem: '4rem',
  },

  // Border Radius Tokens
  {
    name: 'radius-sm',
    value: '0.125rem',
    category: 'radius',
    description: 'Small border radius',
    status: 'active',
    cssVar: '--radius-sm',
    tailwindClass: 'rounded-sm',
    pixels: '2px',
  },
  {
    name: 'radius-base',
    value: '0.25rem',
    category: 'radius',
    description: 'Base border radius',
    status: 'active',
    cssVar: '--radius-base',
    tailwindClass: 'rounded',
    pixels: '4px',
  },
  {
    name: 'radius-md',
    value: '0.375rem',
    category: 'radius',
    description: 'Medium border radius',
    status: 'active',
    cssVar: '--radius-md',
    tailwindClass: 'rounded-md',
    pixels: '6px',
  },
  {
    name: 'radius-lg',
    value: '0.5rem',
    category: 'radius',
    description: 'Large border radius',
    status: 'active',
    cssVar: '--radius-lg',
    tailwindClass: 'rounded-lg',
    pixels: '8px',
  },
  {
    name: 'radius-full',
    value: '9999px',
    category: 'radius',
    description: 'Full/circular border radius',
    status: 'active',
    cssVar: '--radius-full',
    tailwindClass: 'rounded-full',
    pixels: '9999px',
  },

  // Shadow Tokens
  {
    name: 'shadow-sm',
    value: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    category: 'shadow',
    description: 'Small shadow for subtle elevation',
    status: 'active',
    cssVar: '--shadow-sm',
    tailwindClass: 'shadow-sm',
    elevation: 1,
  },
  {
    name: 'shadow-base',
    value: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    category: 'shadow',
    description: 'Base shadow for cards',
    status: 'active',
    cssVar: '--shadow-base',
    tailwindClass: 'shadow',
    elevation: 2,
  },
  {
    name: 'shadow-md',
    value: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    category: 'shadow',
    description: 'Medium shadow for elevated elements',
    status: 'active',
    cssVar: '--shadow-md',
    tailwindClass: 'shadow-md',
    elevation: 3,
  },
  {
    name: 'shadow-lg',
    value: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    category: 'shadow',
    description: 'Large shadow for modals',
    status: 'active',
    cssVar: '--shadow-lg',
    tailwindClass: 'shadow-lg',
    elevation: 4,
  },

  // Transition Tokens
  {
    name: 'transition-fast',
    value: '150ms',
    category: 'transition',
    description: 'Fast transition duration',
    status: 'active',
    cssVar: '--transition-fast',
    tailwindClass: 'duration-150',
    duration: '150ms',
    easing: 'ease-in-out',
  },
  {
    name: 'transition-base',
    value: '200ms',
    category: 'transition',
    description: 'Base transition duration',
    status: 'active',
    cssVar: '--transition-base',
    tailwindClass: 'duration-200',
    duration: '200ms',
    easing: 'ease-in-out',
  },
  {
    name: 'transition-slow',
    value: '300ms',
    category: 'transition',
    description: 'Slow transition duration',
    status: 'active',
    cssVar: '--transition-slow',
    tailwindClass: 'duration-300',
    duration: '300ms',
    easing: 'ease-in-out',
  },

  // Z-Index Tokens
  {
    name: 'z-dropdown',
    value: '1000',
    category: 'zIndex',
    description: 'Z-index for dropdown menus',
    status: 'active',
    cssVar: '--z-dropdown',
    tailwindClass: 'z-dropdown',
    level: 1000,
  },
  {
    name: 'z-modal',
    value: '1400',
    category: 'zIndex',
    description: 'Z-index for modal dialogs',
    status: 'active',
    cssVar: '--z-modal',
    tailwindClass: 'z-modal',
    level: 1400,
  },
  {
    name: 'z-tooltip',
    value: '1600',
    category: 'zIndex',
    description: 'Z-index for tooltips',
    status: 'active',
    cssVar: '--z-tooltip',
    tailwindClass: 'z-tooltip',
    level: 1600,
  },

  // Breakpoint Tokens
  {
    name: 'breakpoint-sm',
    value: '640px',
    category: 'breakpoint',
    description: 'Small device breakpoint',
    status: 'active',
    cssVar: '--breakpoint-sm',
    tailwindClass: 'sm:',
    pixels: '640px',
  },
  {
    name: 'breakpoint-md',
    value: '768px',
    category: 'breakpoint',
    description: 'Medium device breakpoint',
    status: 'active',
    cssVar: '--breakpoint-md',
    tailwindClass: 'md:',
    pixels: '768px',
  },
  {
    name: 'breakpoint-lg',
    value: '1024px',
    category: 'breakpoint',
    description: 'Large device breakpoint',
    status: 'active',
    cssVar: '--breakpoint-lg',
    tailwindClass: 'lg:',
    pixels: '1024px',
  },
]

export default function TokenTableDemoPage() {
  const { resolvedTheme, setTheme } = useTheme()
  const [selectedToken, setSelectedToken] = useState<DesignToken | null>(null)

  const handleTokenSelect = (token: DesignToken) => {
    setSelectedToken(token)
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Token Table Component</h1>
              <p className="text-lg text-muted-foreground mt-2">
                Comprehensive design token management and documentation
              </p>
            </div>
            <Button
              variant="outline"
              size="lg"
              icon={resolvedTheme === 'dark' ? Sun : Moon}
              iconPosition="left"
              onClick={toggleTheme}
            >
              {resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode
            </Button>
          </div>

          {/* Features */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                <CardTitle>Features</CardTitle>
              </div>
              <CardDescription>
                This component provides comprehensive token management capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Badge variant="default">Search & Filter</Badge>
                  <p className="text-sm text-muted-foreground">
                    Real-time search across all token properties
                  </p>
                </div>
                <div className="space-y-1">
                  <Badge variant="default">Live Previews</Badge>
                  <p className="text-sm text-muted-foreground">
                    Visual previews for colors, typography, and spacing
                  </p>
                </div>
                <div className="space-y-1">
                  <Badge variant="default">Copy to Clipboard</Badge>
                  <p className="text-sm text-muted-foreground">
                    One-click copying of token values
                  </p>
                </div>
                <div className="space-y-1">
                  <Badge variant="default">Export Options</Badge>
                  <p className="text-sm text-muted-foreground">
                    Export as JSON, CSS, SCSS, or TypeScript
                  </p>
                </div>
                <div className="space-y-1">
                  <Badge variant="default">Token Status</Badge>
                  <p className="text-sm text-muted-foreground">
                    Track active, deprecated, and experimental tokens
                  </p>
                </div>
                <div className="space-y-1">
                  <Badge variant="default">Bulk Selection</Badge>
                  <p className="text-sm text-muted-foreground">
                    Select multiple tokens for batch operations
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{sampleTokens.length}</div>
                <p className="text-xs text-muted-foreground">Total Tokens</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {sampleTokens.filter((t) => t.category === 'colors').length}
                </div>
                <p className="text-xs text-muted-foreground">Color Tokens</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {sampleTokens.filter((t) => t.status === 'active').length}
                </div>
                <p className="text-xs text-muted-foreground">Active Tokens</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {new Set(sampleTokens.map((t) => t.category)).size}
                </div>
                <p className="text-xs text-muted-foreground">Categories</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Token Table */}
        <TokenTable
          tokens={sampleTokens}
          title="Design System Tokens"
          description="Browse, search, and export design tokens from the Nitro Design System"
          showSearch={true}
          showFilters={true}
          showExport={true}
          showCopy={true}
          showPreview={true}
          onTokenSelect={handleTokenSelect}
        />

        {/* Selected Token Details */}
        {selectedToken && (
          <Card>
            <CardHeader>
              <CardTitle>Selected Token Details</CardTitle>
              <CardDescription>
                Detailed information about the selected token
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p className="text-lg font-mono">{selectedToken.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Value</p>
                    <p className="text-lg font-mono">{selectedToken.value}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Category</p>
                    <Badge variant="outline" className="capitalize mt-1">
                      {selectedToken.category}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge
                      variant={
                        selectedToken.status === 'deprecated'
                          ? 'destructive'
                          : selectedToken.status === 'experimental'
                          ? 'secondary'
                          : 'default'
                      }
                      className="capitalize mt-1"
                    >
                      {selectedToken.status || 'active'}
                    </Badge>
                  </div>
                </div>
                {selectedToken.description && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                    <p className="text-sm">{selectedToken.description}</p>
                  </div>
                )}
                {selectedToken.cssVar && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">CSS Variable</p>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {selectedToken.cssVar}
                    </code>
                  </div>
                )}
                {selectedToken.tailwindClass && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tailwind Class</p>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {selectedToken.tailwindClass}
                    </code>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
