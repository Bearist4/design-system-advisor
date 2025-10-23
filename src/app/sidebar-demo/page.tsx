'use client'

import { Sidebar } from "@/components/ui/sidebar"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SidebarDemoPage() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex h-screen">
      <Sidebar 
        defaultCollapsed={false}
        onCollapseChange={setIsCollapsed}
      />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Enhanced Navigation Sidebar Demo</h1>
            <p className="text-muted-foreground">
              Test the new sidebar features with collapsible sections, nested items, and responsive design.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sidebar Status</CardTitle>
              <CardDescription>Current state of the sidebar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Collapsed:</strong> {isCollapsed ? 'Yes' : 'No'}</p>
                <p className="text-sm text-muted-foreground">
                  Click the menu icon in the sidebar to toggle between full and icon-only views.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features Implemented</CardTitle>
              <CardDescription>All acceptance criteria have been met</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-sm">✓</div>
                    <div>
                      <h3 className="font-semibold">Collapsible Sections</h3>
                      <p className="text-sm text-muted-foreground">Expand/collapse menu sections with smooth animations</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-sm">✓</div>
                    <div>
                      <h3 className="font-semibold">Nested Menu Items</h3>
                      <p className="text-sm text-muted-foreground">Support for sub-navigation with proper hierarchy</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-sm">✓</div>
                    <div>
                      <h3 className="font-semibold">Icon-Only View</h3>
                      <p className="text-sm text-muted-foreground">Sidebar can be collapsed to show only icons</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-sm">✓</div>
                    <div>
                      <h3 className="font-semibold">Active States</h3>
                      <p className="text-sm text-muted-foreground">Clear indication of current page/section</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-sm">✓</div>
                    <div>
                      <h3 className="font-semibold">Mobile Responsive</h3>
                      <p className="text-sm text-muted-foreground">Slide-in sidebar for mobile devices</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-sm">✓</div>
                    <div>
                      <h3 className="font-semibold">Keyboard Navigation</h3>
                      <p className="text-sm text-muted-foreground">Full keyboard support with visible focus states</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-sm">✓</div>
                    <div>
                      <h3 className="font-semibold">Tooltips</h3>
                      <p className="text-sm text-muted-foreground">Smooth dissolve effect right next to icons</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-sm">✓</div>
                    <div>
                      <h3 className="font-semibold">ARIA Labels</h3>
                      <p className="text-sm text-muted-foreground">Screen reader compatible with proper labels</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-sm">✓</div>
                    <div>
                      <h3 className="font-semibold">Badges Support</h3>
                      <p className="text-sm text-muted-foreground">Show badges on menu items for notifications</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How to Test</CardTitle>
              <CardDescription>Try out all the features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <span className="font-mono bg-muted px-2 py-1 rounded">1</span>
                  <p>Click the menu icon in the sidebar header to toggle between full and icon-only views - notice the smooth animation</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-mono bg-muted px-2 py-1 rounded">2</span>
                  <p>Click on "Profile" in the User section to expand and see nested items</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-mono bg-muted px-2 py-1 rounded">3</span>
                  <p>Use Tab key to navigate - notice the visible focus ring on each item</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-mono bg-muted px-2 py-1 rounded">4</span>
                  <p>Collapse the sidebar and hover over icons - tooltips appear outside the sidebar without clipping</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-mono bg-muted px-2 py-1 rounded">5</span>
                  <p>Tab to collapsed icons - tooltips also show on keyboard focus</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-mono bg-muted px-2 py-1 rounded">6</span>
                  <p>Resize your browser to mobile width (&lt; 768px) to see the mobile sidebar with overlay</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-mono bg-muted px-2 py-1 rounded">7</span>
                  <p>Navigate to different pages to see active state highlighting</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technical Implementation</CardTitle>
              <CardDescription>Key features of the component</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span><strong>Smooth animations:</strong> Uses Tailwind's animate-accordion-down for expand/collapse transitions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span><strong>State management:</strong> React hooks for collapse state and expanded sections</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span><strong>Accessibility:</strong> Full ARIA labels, keyboard navigation, and focus management</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span><strong>Responsive:</strong> Desktop sidebar with mobile slide-in variant</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span><strong>Customizable:</strong> Accept custom sections and menu items as props</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span><strong>Icons & badges:</strong> Support for Lucide icons and badge components</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
