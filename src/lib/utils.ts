import { type ClassValue, clsx } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function categorizeTokens(filename: string, content: unknown): string {
  const lowerFilename = filename.toLowerCase()
  const contentStr = JSON.stringify(content).toLowerCase()
  
  // Helper function to check if content has specific patterns
  const hasContentPattern = (patterns: string[]) => {
    return patterns.some(pattern => contentStr.includes(pattern))
  }
  
  // Helper function to check if filename has specific patterns
  const hasFilenamePattern = (patterns: string[]) => {
    return patterns.some(pattern => lowerFilename.includes(pattern))
  }
  
  // Check for foundation tokens (colors, typography, fonts)
  const foundationPatterns = ['color', 'type', 'font', 'typography', 'text', 'heading']
  if (hasFilenamePattern(foundationPatterns) || hasContentPattern(foundationPatterns)) {
    return 'foundation'
  }
  
  // Check for spacing tokens (spacing, grid, layout, margin, padding)
  const spacingPatterns = ['spacing', 'grid', 'layout', 'margin', 'padding', 'gap', 'space']
  if (hasFilenamePattern(spacingPatterns) || hasContentPattern(spacingPatterns)) {
    return 'spacing'
  }
  
  // Check for brand tokens
  const brandPatterns = ['brand', 'logo', 'identity', 'theme']
  if (hasFilenamePattern(brandPatterns) || hasContentPattern(brandPatterns)) {
    return 'brand'
  }
  
  // Check for component tokens (buttons, inputs, cards, etc.)
  const componentPatterns = ['component', 'button', 'input', 'card', 'modal', 'dropdown', 'form', 'field']
  if (hasFilenamePattern(componentPatterns) || hasContentPattern(componentPatterns)) {
    return 'component'
  }
  
  // Check for platform tokens (iOS, Android, web)
  const platformPatterns = ['ios', 'android', 'web', 'mobile', 'desktop', 'native']
  if (hasFilenamePattern(platformPatterns) || hasContentPattern(platformPatterns)) {
    return 'platform'
  }
  
  // Check for animation tokens
  const animationPatterns = ['animation', 'transition', 'duration', 'easing', 'timing']
  if (hasFilenamePattern(animationPatterns) || hasContentPattern(animationPatterns)) {
    return 'animation'
  }
  
  // Check for elevation/shadow tokens
  const elevationPatterns = ['elevation', 'shadow', 'depth', 'z-index']
  if (hasFilenamePattern(elevationPatterns) || hasContentPattern(elevationPatterns)) {
    return 'elevation'
  }
  
  return 'misc'
}
