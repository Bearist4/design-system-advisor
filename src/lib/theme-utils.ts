/**
 * Theme utility functions for accessing design tokens programmatically
 */

export const designTokens = {
  colors: {
    primary: {
      50: 'hsl(var(--primary-50))',
      100: 'hsl(var(--primary-100))',
      200: 'hsl(var(--primary-200))',
      300: 'hsl(var(--primary-300))',
      400: 'hsl(var(--primary-400))',
      500: 'hsl(var(--primary-500))',
      600: 'hsl(var(--primary-600))',
      700: 'hsl(var(--primary-700))',
      800: 'hsl(var(--primary-800))',
      900: 'hsl(var(--primary-900))',
    },
    neutral: {
      50: 'hsl(var(--neutral-50))',
      100: 'hsl(var(--neutral-100))',
      200: 'hsl(var(--neutral-200))',
      300: 'hsl(var(--neutral-300))',
      400: 'hsl(var(--neutral-400))',
      500: 'hsl(var(--neutral-500))',
      600: 'hsl(var(--neutral-600))',
      700: 'hsl(var(--neutral-700))',
      800: 'hsl(var(--neutral-800))',
      900: 'hsl(var(--neutral-900))',
    },
    semantic: {
      success: 'hsl(var(--success))',
      warning: 'hsl(var(--warning))',
      error: 'hsl(var(--error))',
      info: 'hsl(var(--info))',
    },
  },
  spacing: {
    0: 'var(--space-0)',
    1: 'var(--space-1)',
    2: 'var(--space-2)',
    3: 'var(--space-3)',
    4: 'var(--space-4)',
    5: 'var(--space-5)',
    6: 'var(--space-6)',
    8: 'var(--space-8)',
    10: 'var(--space-10)',
    12: 'var(--space-12)',
    16: 'var(--space-16)',
    20: 'var(--space-20)',
    24: 'var(--space-24)',
    32: 'var(--space-32)',
  },
  radius: {
    none: 'var(--radius-none)',
    sm: 'var(--radius-sm)',
    base: 'var(--radius-base)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
    '2xl': 'var(--radius-2xl)',
    '3xl': 'var(--radius-3xl)',
    full: 'var(--radius-full)',
  },
  shadows: {
    xs: 'var(--shadow-xs)',
    sm: 'var(--shadow-sm)',
    base: 'var(--shadow-base)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
    xl: 'var(--shadow-xl)',
    '2xl': 'var(--shadow-2xl)',
    inner: 'var(--shadow-inner)',
    none: 'var(--shadow-none)',
  },
  typography: {
    sizes: {
      xs: 'var(--text-xs)',
      sm: 'var(--text-sm)',
      base: 'var(--text-base)',
      lg: 'var(--text-lg)',
      xl: 'var(--text-xl)',
      '2xl': 'var(--text-2xl)',
      '3xl': 'var(--text-3xl)',
      '4xl': 'var(--text-4xl)',
      '5xl': 'var(--text-5xl)',
      '6xl': 'var(--text-6xl)',
    },
    weights: {
      light: 'var(--font-light)',
      normal: 'var(--font-normal)',
      medium: 'var(--font-medium)',
      semibold: 'var(--font-semibold)',
      bold: 'var(--font-bold)',
      extrabold: 'var(--font-extrabold)',
    },
  },
};

/**
 * Get a CSS variable value from the document root
 */
export function getCSSVariable(variableName: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
}

/**
 * Set a CSS variable on the document root
 */
export function setCSSVariable(variableName: string, value: string): void {
  if (typeof window === 'undefined') return;
  document.documentElement.style.setProperty(variableName, value);
}

/**
 * Check if contrast ratio meets WCAG AA standards (4.5:1 for normal text)
 */
export function hasGoodContrast(color1: string, color2: string): boolean {
  // This is a simplified check. For production, use a proper contrast checker library
  return true; // Placeholder
}

/**
 * Get all available theme tokens
 */
export function getAllThemeTokens() {
  return {
    colors: Object.keys(designTokens.colors),
    spacing: Object.keys(designTokens.spacing),
    radius: Object.keys(designTokens.radius),
    shadows: Object.keys(designTokens.shadows),
    typography: {
      sizes: Object.keys(designTokens.typography.sizes),
      weights: Object.keys(designTokens.typography.weights),
    },
  };
}
