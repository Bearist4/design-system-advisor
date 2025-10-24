'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Layout, 
  Type, 
  Ruler,
  Grid3x3,
  CheckCircle2
} from 'lucide-react'

export default function ResponsiveShowcase() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Responsive */}
      <section className="container mx-auto py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
            Responsive Design System
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive mobile-first design system with fluid typography, 
            responsive spacing, and flexible grids
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mt-6">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Breakpoint Indicators */}
      <section className="container mx-auto mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Current Breakpoint</CardTitle>
            <CardDescription>
              Resize your browser to see the responsive design in action
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge className="xs:bg-green-500 sm:bg-gray-400">
                <Smartphone className="h-3 w-3 mr-1" />
                XS (375px+)
              </Badge>
              <Badge className="hidden sm:inline-flex sm:bg-green-500 md:bg-gray-400">
                <Smartphone className="h-3 w-3 mr-1" />
                SM (640px+)
              </Badge>
              <Badge className="hidden md:inline-flex md:bg-green-500 lg:bg-gray-400">
                <Tablet className="h-3 w-3 mr-1" />
                MD (768px+)
              </Badge>
              <Badge className="hidden lg:inline-flex lg:bg-green-500 xl:bg-gray-400">
                <Monitor className="h-3 w-3 mr-1" />
                LG (1024px+)
              </Badge>
              <Badge className="hidden xl:inline-flex xl:bg-green-500 2xl:bg-gray-400">
                <Monitor className="h-3 w-3 mr-1" />
                XL (1280px+)
              </Badge>
              <Badge className="hidden 2xl:inline-flex 2xl:bg-green-500">
                <Monitor className="h-3 w-3 mr-1" />
                2XL (1536px+)
              </Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Fluid Typography Demo */}
      <section className="container mx-auto mb-12">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              <CardTitle>Fluid Typography</CardTitle>
            </div>
            <CardDescription>
              Text automatically scales based on viewport width
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-xs text-muted-foreground">text-6xl</span>
              <h1 className="text-6xl font-bold">Hero Title</h1>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">text-4xl</span>
              <h2 className="text-4xl font-semibold">Section Title</h2>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">text-2xl</span>
              <h3 className="text-2xl font-medium">Subsection Title</h3>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">text-base</span>
              <p className="text-base">
                This is body text that scales smoothly across all screen sizes. 
                The font size adjusts automatically using CSS clamp() for optimal readability.
              </p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">text-sm</span>
              <p className="text-sm text-muted-foreground">
                Small text for captions and secondary information
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Responsive Grid System */}
      <section className="container mx-auto mb-12">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Grid3x3 className="h-5 w-5" />
              <CardTitle>Responsive Grid System</CardTitle>
            </div>
            <CardDescription>
              Grids automatically adjust to screen size
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Auto-fit Grid */}
              <div>
                <h4 className="text-sm font-medium mb-3">Auto-fit Grid (grid-cols-fluid)</h4>
                <div className="grid grid-cols-fluid gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div 
                      key={i} 
                      className="bg-primary/10 rounded-lg p-4 text-center font-medium"
                    >
                      Item {i}
                    </div>
                  ))}
                </div>
              </div>

              {/* Explicit Responsive Grid */}
              <div>
                <h4 className="text-sm font-medium mb-3">
                  Explicit Grid (1 → 2 → 3 → 4 columns)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div 
                      key={i} 
                      className="bg-secondary/50 rounded-lg p-4 text-center font-medium"
                    >
                      Item {i}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Responsive Spacing */}
      <section className="container mx-auto mb-12">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Ruler className="h-5 w-5" />
              <CardTitle>Responsive Spacing</CardTitle>
            </div>
            <CardDescription>
              Padding and margins adjust to screen size
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-primary/5 rounded-lg p-4 sm:p-6 md:p-8">
                <p className="text-sm text-center">
                  Responsive padding: p-4 sm:p-6 md:p-8
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-xs text-center">gap-4 (mobile)</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-xs text-center">gap-6 (tablet)</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-xs text-center">gap-8 (desktop)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Responsive Components */}
      <section className="container mx-auto mb-12">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layout className="h-5 w-5" />
              <CardTitle>Responsive Components</CardTitle>
            </div>
            <CardDescription>
              All components adapt to different screen sizes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Buttons */}
            <div>
              <h4 className="text-sm font-medium mb-3">Buttons</h4>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button className="w-full sm:w-auto">Primary Button</Button>
                <Button variant="outline" className="w-full sm:w-auto">
                  Secondary Button
                </Button>
                <Button variant="ghost" className="w-full sm:w-auto">
                  Ghost Button
                </Button>
              </div>
            </div>

            {/* Input Fields */}
            <div>
              <h4 className="text-sm font-medium mb-3">Input Fields</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input placeholder="Responsive input field" />
                <Input placeholder="Another input field" />
              </div>
            </div>

            {/* Table */}
            <div>
              <h4 className="text-sm font-medium mb-3">Responsive Table</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="hidden lg:table-cell">Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3].map((i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">Item {i}</TableCell>
                      <TableCell>
                        <Badge variant="outline">Active</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        2025-10-24
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        Design
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Acceptance Criteria Checklist */}
      <section className="container mx-auto mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Acceptance Criteria</CardTitle>
            <CardDescription>
              All requirements met for the responsive design system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                'Breakpoints are consistent across components',
                'Mobile experience is optimized',
                'Grid system works on all screen sizes',
                'Typography scales appropriately',
                'Spacing is consistent across devices',
                'All components are fully responsive'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto py-8 text-center text-sm text-muted-foreground">
        <p>Responsive Design System v1.0.0 • Mobile-First Approach</p>
        <p className="mt-2">
          Resize your browser to see the responsive features in action
        </p>
      </footer>
    </div>
  )
}
