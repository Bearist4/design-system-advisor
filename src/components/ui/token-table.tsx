'use client'

import * as React from 'react'
import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import {
  DesignToken,
  TokenCategory,
  TokenStatus,
  TokenTableProps,
  ColorToken,
  TypographyToken,
  SpacingToken,
  TokenExportFormat
} from '@/lib/types/tokens'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner, EmptyState } from '@/components/ui/feedback'
import {
  Search,
  X,
  Copy,
  Check,
  Download,
  Filter,
  Eye,
  AlertCircle,
  Sparkles,
} from 'lucide-react'

/**
 * TokenTable Component
 * 
 * A specialized table component for displaying design tokens with enhanced features
 * for design system documentation and management.
 * 
 * Features:
 * - Token display organized by categories
 * - Real-time search and filtering
 * - Live preview of tokens (colors, fonts, spacing)
 * - Copy to clipboard functionality
 * - Token categories and status indicators
 * - Export functionality (JSON, CSS, etc.)
 * - Dark/Light mode support
 * - Responsive design
 */
export const TokenTable = React.forwardRef<HTMLDivElement, TokenTableProps>(
  (
    {
      tokens,
      title = 'Design Tokens',
      description = 'Browse and manage your design system tokens',
      showSearch = true,
      showFilters = true,
      showExport = true,
      showCopy = true,
      showPreview = true,
      defaultCategory,
      onTokenSelect,
      className,
    },
    ref
  ) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<TokenCategory | 'all'>(
      defaultCategory || 'all'
    )
    const [selectedStatus, setSelectedStatus] = useState<TokenStatus | 'all'>('all')
    const [copiedToken, setCopiedToken] = useState<string | null>(null)
    const [isExporting, setIsExporting] = useState(false)
    const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set())

    // Get unique categories from tokens
    const categories: (TokenCategory | 'all')[] = useMemo(() => {
      const uniqueCategories = new Set(tokens.map((token) => token.category))
      return ['all', ...Array.from(uniqueCategories)]
    }, [tokens])

    // Filter tokens based on search and filters
    const filteredTokens = useMemo(() => {
      let filtered = tokens

      // Filter by category
      if (selectedCategory !== 'all') {
        filtered = filtered.filter((token) => token.category === selectedCategory)
      }

      // Filter by status
      if (selectedStatus !== 'all') {
        filtered = filtered.filter((token) => token.status === selectedStatus)
      }

      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(
          (token) =>
            token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            token.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
            token.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            token.cssVar?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      return filtered
    }, [tokens, selectedCategory, selectedStatus, searchTerm])

    // Copy token value to clipboard
    const handleCopy = async (token: DesignToken) => {
      try {
        await navigator.clipboard.writeText(token.value)
        setCopiedToken(token.name)
        setTimeout(() => setCopiedToken(null), 2000)
      } catch (error) {
        console.error('Failed to copy:', error)
      }
    }

    // Toggle token selection
    const toggleTokenSelection = (tokenName: string) => {
      const newSelected = new Set(selectedTokens)
      if (newSelected.has(tokenName)) {
        newSelected.delete(tokenName)
      } else {
        newSelected.add(tokenName)
      }
      setSelectedTokens(newSelected)
    }

    // Export tokens in various formats
    const handleExport = (format: TokenExportFormat['format']) => {
      setIsExporting(true)

      try {
        let exportData: string
        const tokensToExport =
          selectedTokens.size > 0
            ? filteredTokens.filter((t) => selectedTokens.has(t.name))
            : filteredTokens

        switch (format) {
          case 'json':
            exportData = JSON.stringify(tokensToExport, null, 2)
            break
          case 'css':
            exportData = exportToCSS(tokensToExport)
            break
          case 'scss':
            exportData = exportToSCSS(tokensToExport)
            break
          case 'javascript':
            exportData = exportToJavaScript(tokensToExport)
            break
          case 'typescript':
            exportData = exportToTypeScript(tokensToExport)
            break
          default:
            exportData = JSON.stringify(tokensToExport, null, 2)
        }

        // Download file
        const blob = new Blob([exportData], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `tokens.${format === 'javascript' ? 'js' : format === 'typescript' ? 'ts' : format}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } catch (error) {
        console.error('Export failed:', error)
      } finally {
        setIsExporting(false)
      }
    }

    // Clear all filters
    const clearFilters = () => {
      setSearchTerm('')
      setSelectedCategory('all')
      setSelectedStatus('all')
      setSelectedTokens(new Set())
    }

    const hasActiveFilters =
      searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'

    return (
      <div ref={ref} className={cn('w-full space-y-4', className)}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {filteredTokens.length} of {tokens.length}
            </Badge>
            {selectedTokens.size > 0 && (
              <Badge variant="default" className="flex items-center gap-1">
                {selectedTokens.size} selected
              </Badge>
            )}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <CardTitle className="text-base">Filters</CardTitle>
              </div>
              <CardDescription>Search and filter tokens by category and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Search */}
                {showSearch && (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search tokens by name, value, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-10"
                    />
                    {searchTerm && (
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={X}
                        iconOnly
                        onClick={() => setSearchTerm('')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                        aria-label="Clear search"
                      />
                    )}
                  </div>
                )}

                {/* Category Filters */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <div className="flex gap-2 flex-wrap">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="capitalize"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Status Filters */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <div className="flex gap-2 flex-wrap">
                    {['all', 'active', 'deprecated', 'experimental'].map((status) => (
                      <Button
                        key={status}
                        variant={
                          selectedStatus === status ? 'default' : 'outline'
                        }
                        size="sm"
                        onClick={() => setSelectedStatus(status as TokenStatus | 'all')}
                        className="capitalize"
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Active Filters Summary */}
                {hasActiveFilters && (
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-muted-foreground">Active filters:</span>
                      {searchTerm && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          Search: &quot;{searchTerm}&quot;
                          <button
                            onClick={() => setSearchTerm('')}
                            className="ml-1 hover:bg-muted rounded-full p-0.5"
                            aria-label="Clear search filter"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                      {selectedCategory !== 'all' && (
                        <Badge variant="secondary" className="flex items-center gap-1 capitalize">
                          {selectedCategory}
                          <button
                            onClick={() => setSelectedCategory('all')}
                            className="ml-1 hover:bg-muted rounded-full p-0.5"
                            aria-label="Clear category filter"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                      {selectedStatus !== 'all' && (
                        <Badge variant="secondary" className="flex items-center gap-1 capitalize">
                          {selectedStatus}
                          <button
                            onClick={() => setSelectedStatus('all')}
                            className="ml-1 hover:bg-muted rounded-full p-0.5"
                            aria-label="Clear status filter"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Export Actions */}
        {showExport && (filteredTokens.length > 0 || selectedTokens.size > 0) && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Export Tokens</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedTokens.size > 0
                      ? `Export ${selectedTokens.size} selected token${selectedTokens.size > 1 ? 's' : ''}`
                      : `Export all ${filteredTokens.length} token${filteredTokens.length > 1 ? 's' : ''}`}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('json')}
                    disabled={isExporting}
                    icon={Download}
                    iconPosition="left"
                  >
                    JSON
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('css')}
                    disabled={isExporting}
                    icon={Download}
                    iconPosition="left"
                  >
                    CSS
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('scss')}
                    disabled={isExporting}
                    icon={Download}
                    iconPosition="left"
                  >
                    SCSS
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('typescript')}
                    disabled={isExporting}
                    icon={Download}
                    iconPosition="left"
                  >
                    TS
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tokens Table */}
        <Card>
          <CardContent className="pt-6">
            {filteredTokens.length === 0 ? (
              <EmptyState
                icon={tokens.length === 0 ? 'file' : 'search'}
                title={
                  tokens.length === 0
                    ? 'No tokens available'
                    : 'No tokens match your filters'
                }
                description={
                  tokens.length === 0
                    ? 'Add design tokens to get started'
                    : 'Try adjusting your search or filter criteria'
                }
                action={
                  hasActiveFilters
                    ? {
                        label: 'Clear Filters',
                        onClick: clearFilters,
                      }
                    : undefined
                }
              />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <input
                          type="checkbox"
                          checked={
                            filteredTokens.length > 0 &&
                            filteredTokens.every((t) => selectedTokens.has(t.name))
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTokens(
                                new Set(filteredTokens.map((t) => t.name))
                              )
                            } else {
                              setSelectedTokens(new Set())
                            }
                          }}
                          className="h-4 w-4 rounded border-input"
                          aria-label="Select all tokens"
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Value</TableHead>
                      {showPreview && <TableHead>Preview</TableHead>}
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      {showCopy && <TableHead className="text-right">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTokens.map((token) => (
                      <TableRow
                        key={token.name}
                        className={cn(
                          'cursor-pointer transition-colors',
                          selectedTokens.has(token.name) && 'bg-muted/50'
                        )}
                        onClick={() => {
                          toggleTokenSelection(token.name)
                          onTokenSelect?.(token)
                        }}
                      >
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedTokens.has(token.name)}
                            onChange={() => toggleTokenSelection(token.name)}
                            onClick={(e) => e.stopPropagation()}
                            className="h-4 w-4 rounded border-input"
                            aria-label={`Select ${token.name}`}
                          />
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          <div className="space-y-1">
                            <div className="font-medium">{token.name}</div>
                            {token.cssVar && (
                              <div className="text-muted-foreground text-xs">
                                {token.cssVar}
                              </div>
                            )}
                            {token.description && (
                              <div className="text-muted-foreground text-xs max-w-xs">
                                {token.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {token.value}
                        </TableCell>
                        {showPreview && (
                          <TableCell>
                            <TokenPreview token={token} />
                          </TableCell>
                        )}
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {token.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <TokenStatusBadge status={token.status} />
                        </TableCell>
                        {showCopy && (
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={copiedToken === token.name ? Check : Copy}
                              iconOnly
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCopy(token)
                              }}
                              className={cn(
                                'h-8 w-8',
                                copiedToken === token.name && 'text-success'
                              )}
                              aria-label={`Copy ${token.name} value`}
                            />
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }
)

TokenTable.displayName = 'TokenTable'

/**
 * Token Preview Component
 * Renders visual previews for different token types
 */
const TokenPreview: React.FC<{ token: DesignToken }> = ({ token }) => {
  switch (token.category) {
    case 'colors':
      return <ColorPreview token={token as ColorToken} />
    case 'typography':
      return <TypographyPreview token={token as TypographyToken} />
    case 'spacing':
      return <SpacingPreview token={token as SpacingToken} />
    case 'radius':
      return <RadiusPreview token={token} />
    case 'shadow':
      return <ShadowPreview token={token} />
    default:
      return <span className="text-xs text-muted-foreground">-</span>
  }
}

const ColorPreview: React.FC<{ token: ColorToken }> = ({ token }) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-8 w-8 rounded border-2 border-border shadow-sm"
        style={{ backgroundColor: token.value }}
        aria-label={`Color preview for ${token.name}`}
      />
      {token.hex && (
        <span className="text-xs text-muted-foreground font-mono">{token.hex}</span>
      )}
    </div>
  )
}

const TypographyPreview: React.FC<{ token: TypographyToken }> = ({ token }) => {
  return (
    <div
      className="text-foreground"
      style={{
        fontSize: token.fontSize || token.value,
        fontWeight: token.fontWeight,
        lineHeight: token.lineHeight,
        letterSpacing: token.letterSpacing,
        fontFamily: token.fontFamily,
      }}
    >
      Aa
    </div>
  )
}

const SpacingPreview: React.FC<{ token: SpacingToken }> = ({ token }) => {
  const size = token.pixels || token.value
  return (
    <div className="flex items-center gap-2">
      <div
        className="bg-primary/20 border-2 border-primary rounded"
        style={{
          width: size,
          height: '16px',
        }}
        aria-label={`Spacing preview for ${token.name}`}
      />
      <span className="text-xs text-muted-foreground">{size}</span>
    </div>
  )
}

const RadiusPreview: React.FC<{ token: DesignToken }> = ({ token }) => {
  return (
    <div
      className="h-8 w-8 bg-primary/20 border-2 border-primary"
      style={{ borderRadius: token.value }}
      aria-label={`Border radius preview for ${token.name}`}
    />
  )
}

const ShadowPreview: React.FC<{ token: DesignToken }> = ({ token }) => {
  return (
    <div
      className="h-8 w-8 bg-background border border-border rounded"
      style={{ boxShadow: token.value }}
      aria-label={`Shadow preview for ${token.name}`}
    />
  )
}

const TokenStatusBadge: React.FC<{ status?: TokenStatus }> = ({ status = 'active' }) => {
  const variants = {
    active: { variant: 'default' as const, icon: null },
    deprecated: { variant: 'destructive' as const, icon: AlertCircle },
    experimental: { variant: 'secondary' as const, icon: Sparkles },
  }

  const config = variants[status]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className="capitalize flex items-center gap-1 w-fit">
      {Icon && <Icon className="h-3 w-3" />}
      {status}
    </Badge>
  )
}

// Export helper functions
function exportToCSS(tokens: DesignToken[]): string {
  const lines = [':root {']
  tokens.forEach((token) => {
    const varName = token.cssVar || `--${token.name}`
    lines.push(`  ${varName}: ${token.value};`)
  })
  lines.push('}')
  return lines.join('\n')
}

function exportToSCSS(tokens: DesignToken[]): string {
  const lines: string[] = []
  tokens.forEach((token) => {
    const varName = token.name.replace(/\./g, '-')
    lines.push(`$${varName}: ${token.value};`)
  })
  return lines.join('\n')
}

function exportToJavaScript(tokens: DesignToken[]): string {
  const obj: Record<string, string> = {}
  tokens.forEach((token) => {
    obj[token.name] = token.value
  })
  return `export const tokens = ${JSON.stringify(obj, null, 2)};`
}

function exportToTypeScript(tokens: DesignToken[]): string {
  const obj: Record<string, string> = {}
  tokens.forEach((token) => {
    obj[token.name] = token.value
  })
  return `export const tokens: Record<string, string> = ${JSON.stringify(obj, null, 2)} as const;`
}

export default TokenTable
