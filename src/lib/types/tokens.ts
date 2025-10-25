/**
 * Design Token Type Definitions
 * Comprehensive types for managing design tokens across the design system
 */

export type TokenCategory = 
  | 'colors' 
  | 'typography' 
  | 'spacing' 
  | 'radius' 
  | 'shadow' 
  | 'transition' 
  | 'zIndex'
  | 'breakpoint'

export type TokenStatus = 'active' | 'deprecated' | 'experimental'

export interface BaseToken {
  name: string
  value: string
  category: TokenCategory
  description?: string
  status?: TokenStatus
  cssVar?: string
  tailwindClass?: string
  usage?: string[]
  relatedTokens?: string[]
}

export interface ColorToken extends BaseToken {
  category: 'colors'
  hex?: string
  rgb?: string
  hsl?: string
  contrastRatio?: number
  accessible?: boolean
}

export interface TypographyToken extends BaseToken {
  category: 'typography'
  fontSize?: string
  fontWeight?: string
  lineHeight?: string
  letterSpacing?: string
  fontFamily?: string
}

export interface SpacingToken extends BaseToken {
  category: 'spacing'
  pixels?: string
  rem?: string
}

export interface RadiusToken extends BaseToken {
  category: 'radius'
  pixels?: string
}

export interface ShadowToken extends BaseToken {
  category: 'shadow'
  elevation?: number
}

export interface TransitionToken extends BaseToken {
  category: 'transition'
  duration?: string
  easing?: string
}

export interface ZIndexToken extends BaseToken {
  category: 'zIndex'
  level?: number
}

export interface BreakpointToken extends BaseToken {
  category: 'breakpoint'
  pixels?: string
}

export type DesignToken = 
  | ColorToken 
  | TypographyToken 
  | SpacingToken 
  | RadiusToken 
  | ShadowToken 
  | TransitionToken 
  | ZIndexToken
  | BreakpointToken

export interface TokenCollection {
  name: string
  description?: string
  tokens: DesignToken[]
}

export interface TokenExportFormat {
  format: 'json' | 'css' | 'scss' | 'javascript' | 'typescript'
  data: string
}

export interface TokenTableFilters {
  category?: TokenCategory
  status?: TokenStatus
  searchTerm?: string
}

export interface TokenTableProps {
  tokens: DesignToken[]
  title?: string
  description?: string
  showSearch?: boolean
  showFilters?: boolean
  showExport?: boolean
  showCopy?: boolean
  showPreview?: boolean
  defaultCategory?: TokenCategory
  onTokenSelect?: (token: DesignToken) => void
  className?: string
}
