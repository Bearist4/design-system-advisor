"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { 
  Download, 
  Upload, 
  Save, 
  Trash2, 
  Edit, 
  Plus, 
  Check,
  X,
  ArrowRight,
  Search,
  Settings,
  Heart,
  Star,
  Share2
} from "lucide-react"

export default function ButtonDemoPage() {
  const [loadingStates, setLoadingStates] = React.useState<Record<string, boolean>>({})

  const toggleLoading = (key: string) => {
    setLoadingStates(prev => ({ ...prev, [key]: !prev[key] }))
    // Auto-reset after 3 seconds
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [key]: false }))
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Enhanced Button Component</h1>
          <p className="text-muted-foreground">
            Comprehensive showcase of all button variants, sizes, and states
          </p>
        </div>

        {/* Size Variants */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Size Variants</h2>
            <p className="text-sm text-muted-foreground">
              All available button sizes from extra small to extra large
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="xs">Extra Small</Button>
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">Extra Large</Button>
          </div>
        </section>

        {/* Variant Types */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Variant Types</h2>
            <p className="text-sm text-muted-foreground">
              Different visual styles for various use cases
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </section>

        {/* Icon Positions */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Icon Positioning</h2>
            <p className="text-sm text-muted-foreground">
              Icons can be positioned on the left, right, or as icon-only buttons
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Left Icons</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button icon={Download} iconPosition="left">Download</Button>
                <Button icon={Upload} iconPosition="left" variant="secondary">Upload</Button>
                <Button icon={Save} iconPosition="left" variant="outline">Save</Button>
                <Button icon={Plus} iconPosition="left" variant="ghost">Add New</Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Right Icons</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button icon={ArrowRight} iconPosition="right">Continue</Button>
                <Button icon={ArrowRight} iconPosition="right" variant="secondary">Next Step</Button>
                <Button icon={ArrowRight} iconPosition="right" variant="outline">Proceed</Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Icon-Only Buttons</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button icon={Edit} iconOnly>Edit</Button>
                <Button icon={Trash2} iconOnly variant="destructive">Delete</Button>
                <Button icon={Settings} iconOnly variant="outline">Settings</Button>
                <Button icon={Search} iconOnly variant="ghost">Search</Button>
                <Button icon={Heart} iconOnly variant="secondary">Like</Button>
                <Button icon={Star} iconOnly variant="outline">Favorite</Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Icon-Only Different Sizes</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button icon={Plus} iconOnly size="xs">Add</Button>
                <Button icon={Plus} iconOnly size="sm">Add</Button>
                <Button icon={Plus} iconOnly size="default">Add</Button>
                <Button icon={Plus} iconOnly size="lg">Add</Button>
                <Button icon={Plus} iconOnly size="xl">Add</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Loading States */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Loading States</h2>
            <p className="text-sm text-muted-foreground">
              Buttons with spinner animations during async operations. Click to toggle loading state.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Standard Loading</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button 
                  isLoading={loadingStates.load1}
                  onClick={() => toggleLoading("load1")}
                >
                  {loadingStates.load1 ? "Loading..." : "Click to Load"}
                </Button>
                <Button 
                  isLoading={loadingStates.load2}
                  onClick={() => toggleLoading("load2")}
                  variant="secondary"
                  loadingText="Processing..."
                >
                  Process Data
                </Button>
                <Button 
                  isLoading={loadingStates.load3}
                  onClick={() => toggleLoading("load3")}
                  variant="outline"
                  loadingText="Saving..."
                >
                  Save Changes
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Loading with Icons</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button 
                  icon={Download}
                  iconPosition="left"
                  isLoading={loadingStates.load4}
                  onClick={() => toggleLoading("load4")}
                  loadingText="Downloading..."
                >
                  Download File
                </Button>
                <Button 
                  icon={Upload}
                  iconPosition="left"
                  isLoading={loadingStates.load5}
                  onClick={() => toggleLoading("load5")}
                  variant="secondary"
                  loadingText="Uploading..."
                >
                  Upload File
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Loading Icon-Only</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button 
                  icon={Save}
                  iconOnly
                  isLoading={loadingStates.load6}
                  onClick={() => toggleLoading("load6")}
                >
                  Save
                </Button>
                <Button 
                  icon={Trash2}
                  iconOnly
                  variant="destructive"
                  isLoading={loadingStates.load7}
                  onClick={() => toggleLoading("load7")}
                >
                  Delete
                </Button>
                <Button 
                  icon={Share2}
                  iconOnly
                  variant="outline"
                  isLoading={loadingStates.load8}
                  onClick={() => toggleLoading("load8")}
                >
                  Share
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Loading Different Sizes</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button 
                  size="xs"
                  isLoading={loadingStates.load9}
                  onClick={() => toggleLoading("load9")}
                >
                  Extra Small
                </Button>
                <Button 
                  size="sm"
                  isLoading={loadingStates.load10}
                  onClick={() => toggleLoading("load10")}
                >
                  Small
                </Button>
                <Button 
                  size="default"
                  isLoading={loadingStates.load11}
                  onClick={() => toggleLoading("load11")}
                >
                  Default
                </Button>
                <Button 
                  size="lg"
                  isLoading={loadingStates.load12}
                  onClick={() => toggleLoading("load12")}
                >
                  Large
                </Button>
                <Button 
                  size="xl"
                  isLoading={loadingStates.load13}
                  onClick={() => toggleLoading("load13")}
                >
                  Extra Large
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Disabled States */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Disabled States</h2>
            <p className="text-sm text-muted-foreground">
              Proper visual feedback for disabled buttons across all variants
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button disabled>Default Disabled</Button>
            <Button disabled variant="secondary">Secondary Disabled</Button>
            <Button disabled variant="destructive">Destructive Disabled</Button>
            <Button disabled variant="outline">Outline Disabled</Button>
            <Button disabled variant="ghost">Ghost Disabled</Button>
            <Button disabled variant="link">Link Disabled</Button>
          </div>
          
          <div className="space-y-2 pt-4">
            <h3 className="text-lg font-medium">Disabled with Icons</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button disabled icon={Download} iconPosition="left">Download</Button>
              <Button disabled icon={Edit} iconOnly>Edit</Button>
              <Button disabled icon={Trash2} iconOnly variant="destructive">Delete</Button>
            </div>
          </div>
        </section>

        {/* Hover & Focus States */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Hover & Focus States</h2>
            <p className="text-sm text-muted-foreground">
              Enhanced interaction feedback with hover effects, shadows, and scale animations
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Hover over buttons to see enhanced feedback with shadow effects and subtle scale animations.
              Focus using keyboard (Tab key) to see focus ring indicators.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button>Hover Me</Button>
              <Button variant="secondary">Hover Me</Button>
              <Button variant="destructive">Hover Me</Button>
              <Button variant="outline">Hover Me</Button>
              <Button icon={Heart} iconPosition="left">Hover with Icon</Button>
              <Button icon={Settings} iconOnly>Settings</Button>
            </div>
          </div>
        </section>

        {/* Accessibility Info */}
        <section className="space-y-4 rounded-lg border-2 border-dashed border-border p-6">
          <h2 className="text-2xl font-semibold">Accessibility Features</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ <strong>Screen reader support:</strong> All buttons announce their state correctly</li>
            <li>✓ <strong>aria-busy:</strong> Loading state is announced to screen readers</li>
            <li>✓ <strong>aria-disabled:</strong> Disabled state is properly communicated</li>
            <li>✓ <strong>aria-label:</strong> Icon-only buttons have descriptive labels</li>
            <li>✓ <strong>aria-hidden:</strong> Decorative icons are hidden from screen readers</li>
            <li>✓ <strong>Focus indicators:</strong> Clear focus rings for keyboard navigation</li>
            <li>✓ <strong>Disabled interaction:</strong> pointer-events-none prevents interaction with disabled buttons</li>
          </ul>
        </section>

        {/* Real-world Examples */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Real-world Examples</h2>
            <p className="text-sm text-muted-foreground">
              Common button patterns in real applications
            </p>
          </div>

          <div className="space-y-6">
            {/* Form Actions */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Form Actions</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button icon={Check} iconPosition="left">Submit</Button>
                <Button icon={X} iconPosition="left" variant="outline">Cancel</Button>
              </div>
            </div>

            {/* CRUD Operations */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">CRUD Operations</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button icon={Plus} iconPosition="left">Create New</Button>
                <Button icon={Edit} iconPosition="left" variant="secondary">Edit</Button>
                <Button icon={Trash2} iconPosition="left" variant="destructive">Delete</Button>
              </div>
            </div>

            {/* Action Bar */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Action Bar</h3>
              <div className="flex flex-wrap items-center gap-2">
                <Button icon={Edit} iconOnly variant="ghost">Edit</Button>
                <Button icon={Trash2} iconOnly variant="ghost">Delete</Button>
                <Button icon={Share2} iconOnly variant="ghost">Share</Button>
                <Button icon={Download} iconOnly variant="ghost">Download</Button>
                <Button icon={Heart} iconOnly variant="ghost">Like</Button>
                <Button icon={Star} iconOnly variant="ghost">Favorite</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Size Comparison Grid */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Size & Variant Comparison Grid</h2>
            <p className="text-sm text-muted-foreground">
              Complete matrix of all size and variant combinations
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 text-left">Size / Variant</th>
                  <th className="border p-2">Default</th>
                  <th className="border p-2">Secondary</th>
                  <th className="border p-2">Outline</th>
                  <th className="border p-2">Ghost</th>
                  <th className="border p-2">Destructive</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-medium">XS</td>
                  <td className="border p-2 text-center">
                    <Button size="xs">Button</Button>
                  </td>
                  <td className="border p-2 text-center">
                    <Button size="xs" variant="secondary">Button</Button>
                  </td>
                  <td className="border p-2 text-center">
                    <Button size="xs" variant="outline">Button</Button>
                  </td>
                  <td className="border p-2 text-center">
                    <Button size="xs" variant="ghost">Button</Button>
                  </td>
                  <td className="border p-2 text-center">
                    <Button size="xs" variant="destructive">Button</Button>
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium">SM</td>
                  <td className="border p-2 text-center">
                    <Button size="sm">Button</Button>
                  </td>
                  <td className="border p-2 text-center">
                    <Button size="sm" variant="secondary">Button</Button>
                  </td>
                  <td className="border p-2 text-center">
                    <Button size="sm" variant="outline">Button</Button>
                  </td>
                  <td className="border p-2 text-center">
                    <Button size="sm" variant="ghost">Button</Button>
                  </td>
                  <td className="border p-2 text-center">
                    <Button size="sm" variant="destructive">Button</Button>
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium">Default</td>
                  <td className="border p-2 text-center">
                    <Button>Button</Button>
                  </td>
                  <td className="border p-2 text-center">
                    <Button variant="secondary">Button</Button>
                  </td>
                  <td className="border p-2 text-center">
                    <Button variant="outline">Button</Button>
                  </td>
                  <td className="border p-2 text-center">
                    <Button variant="ghost">Button</Button>
                  </td>
                  <td className="border p-2 text-center">
                    <Button variant="destructive">Button</Button>
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium">LG</td>
                  <td className="border p-2 text-center">
                    <Button size="lg">Button</Button>
                  </td>
                  <td className="border p-2 text-center">
                    <Button size="lg" variant="secondary">Button</Button>
                  </td>
                  <td className="border p-2 text-center">
                    <Button size="lg" variant="outline">Button</Button>
                  </td>
                  <td className="border p-2 text-center">
                    <Button size="lg" variant="ghost">Button</Button>
                  </td>
                  <td className="border p-2 text-center">
                    <Button size="lg" variant="destructive">Button</Button>
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium">XL</td>
                  <td className="border p-2 text-center">
                    <Button size="xl">Button</Button>
                  </td>
                  <td className="border p-2 text-center">
                    <Button size="xl" variant="secondary">Button</Button>
                  </td>
                  <td className="border p-2 text-center">
                    <Button size="xl" variant="outline">Button</Button>
                  </td>
                  <td className="border p-2 text-center">
                    <Button size="xl" variant="ghost">Button</Button>
                  </td>
                  <td className="border p-2 text-center">
                    <Button size="xl" variant="destructive">Button</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
