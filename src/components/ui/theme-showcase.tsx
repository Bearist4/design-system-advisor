'use client';

import React from 'react';
import { Card } from './card';

export function ThemeShowcase() {
  return (
    <div className="space-y-8 p-8">
      <section>
        <h2 className="text-3xl font-bold mb-4">Design System Theme Tokens</h2>
        <p className="text-muted-foreground mb-8">
          A comprehensive theme system with design tokens supporting light and dark modes.
        </p>
      </section>

      {/* Color Palette */}
      <section>
        <h3 className="text-2xl font-semibold mb-4">Color Palette</h3>
        
        <div className="space-y-6">
          {/* Primary Colors */}
          <div>
            <h4 className="text-lg font-medium mb-3">Primary Colors</h4>
            <div className="grid grid-cols-10 gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <div key={shade} className="flex flex-col items-center">
                  <div
                    className={`w-full h-16 rounded-lg border`}
                    style={{ backgroundColor: `hsl(var(--primary-${shade}))` }}
                  />
                  <span className="text-xs mt-1">{shade}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Neutral Colors */}
          <div>
            <h4 className="text-lg font-medium mb-3">Neutral Colors</h4>
            <div className="grid grid-cols-10 gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <div key={shade} className="flex flex-col items-center">
                  <div
                    className={`w-full h-16 rounded-lg border`}
                    style={{ backgroundColor: `hsl(var(--neutral-${shade}))` }}
                  />
                  <span className="text-xs mt-1">{shade}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status Colors */}
          <div>
            <h4 className="text-lg font-medium mb-3">Status Colors</h4>
            <div className="grid grid-cols-4 gap-4">
              <Card className="p-4 bg-success text-success-foreground">
                <div className="font-semibold">Success</div>
                <div className="text-sm opacity-90">Positive actions</div>
              </Card>
              <Card className="p-4 bg-warning text-warning-foreground">
                <div className="font-semibold">Warning</div>
                <div className="text-sm opacity-90">Caution needed</div>
              </Card>
              <Card className="p-4 bg-error text-error-foreground">
                <div className="font-semibold">Error</div>
                <div className="text-sm opacity-90">Critical issues</div>
              </Card>
              <Card className="p-4 bg-info text-info-foreground">
                <div className="font-semibold">Info</div>
                <div className="text-sm opacity-90">Information</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section>
        <h3 className="text-2xl font-semibold mb-4">Typography Scale</h3>
        <div className="space-y-2">
          <div className="text-xs">Extra Small - 12px</div>
          <div className="text-sm">Small - 14px</div>
          <div className="text-base">Base - 16px</div>
          <div className="text-lg">Large - 18px</div>
          <div className="text-xl">Extra Large - 20px</div>
          <div className="text-2xl">2XL - 24px</div>
          <div className="text-3xl">3XL - 30px</div>
          <div className="text-4xl">4XL - 36px</div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="font-light">Light Weight</div>
          <div className="font-normal">Normal Weight</div>
          <div className="font-medium">Medium Weight</div>
          <div className="font-semibold">Semibold Weight</div>
          <div className="font-bold">Bold Weight</div>
          <div className="font-extrabold">Extrabold Weight</div>
        </div>
      </section>

      {/* Spacing */}
      <section>
        <h3 className="text-2xl font-semibold mb-4">Spacing Scale</h3>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32].map((size) => (
            <div key={size} className="flex items-center gap-4">
              <span className="w-12 text-sm text-muted-foreground">{size}</span>
              <div
                className="bg-primary h-4"
                style={{ width: `var(--space-${size})` }}
              />
              <span className="text-xs text-muted-foreground">
                {size * 4}px
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Border Radius */}
      <section>
        <h3 className="text-2xl font-semibold mb-4">Border Radius</h3>
        <div className="grid grid-cols-5 gap-4">
          {['none', 'sm', 'base', 'md', 'lg', 'xl', '2xl', '3xl'].map((size) => (
            <Card key={size} className="p-4 text-center" style={{ borderRadius: `var(--radius-${size})` }}>
              <div className="font-medium mb-1">{size}</div>
              <div className="text-xs text-muted-foreground">
                radius-{size}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Shadows */}
      <section>
        <h3 className="text-2xl font-semibold mb-4">Shadow System</h3>
        <div className="grid grid-cols-4 gap-6">
          {['xs', 'sm', 'base', 'md', 'lg', 'xl', '2xl'].map((size) => (
            <Card
              key={size}
              className="p-6 text-center"
              style={{ boxShadow: `var(--shadow-${size})` }}
            >
              <div className="font-medium">Shadow {size}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Semantic UI Elements */}
      <section>
        <h3 className="text-2xl font-semibold mb-4">Semantic Elements</h3>
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <h4 className="font-semibold mb-2">Card Component</h4>
            <p className="text-sm text-muted-foreground">
              Using background and foreground colors
            </p>
          </Card>
          <Card className="p-4 bg-muted">
            <h4 className="font-semibold mb-2">Muted Card</h4>
            <p className="text-sm text-muted-foreground">
              Using muted background variant
            </p>
          </Card>
          <Card className="p-4 bg-primary text-primary-foreground">
            <h4 className="font-semibold mb-2">Primary Card</h4>
            <p className="text-sm opacity-90">
              Using primary color scheme
            </p>
          </Card>
          <Card className="p-4 bg-secondary text-secondary-foreground">
            <h4 className="font-semibold mb-2">Secondary Card</h4>
            <p className="text-sm opacity-90">
              Using secondary color scheme
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
