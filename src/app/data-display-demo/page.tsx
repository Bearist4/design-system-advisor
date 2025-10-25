'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress, CircularProgress } from "@/components/ui/progress"
import { Tooltip } from "@/components/ui/tooltip"
import { Popover } from "@/components/ui/popover"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { 
  Skeleton, 
  SkeletonText, 
  SkeletonCard,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonTable 
} from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { 
  Info, 
  HelpCircle, 
  Settings, 
  User,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Bell,
  Mail,
  ShoppingCart,
} from "lucide-react"

export default function DataDisplayDemo() {
  const [progress, setProgress] = React.useState(0)
  const [circularProgress, setCircularProgress] = React.useState(0)
  const [showSkeleton, setShowSkeleton] = React.useState(true)
  const [popoverOpen, setPopoverOpen] = React.useState(false)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 10
        return next > 100 ? 0 : next
      })
      setCircularProgress((prev) => {
        const next = prev + 5
        return next > 100 ? 0 : next
      })
    }, 800)

    return () => clearInterval(timer)
  }, [])

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Data Display Components
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Comprehensive showcase of tooltips, popovers, alerts, progress bars, skeletons, and badges
          </p>
        </div>

        {/* Tooltips Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Tooltips</h2>
          <Card className="p-6">
            <div className="flex flex-wrap gap-4">
              <Tooltip content="This is a tooltip on top" side="top">
                <Button variant="outline">
                  <Info className="h-4 w-4 mr-2" />
                  Top Tooltip
                </Button>
              </Tooltip>

              <Tooltip content="This is a tooltip on the right" side="right">
                <Button variant="outline">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Right Tooltip
                </Button>
              </Tooltip>

              <Tooltip content="This is a tooltip on the bottom" side="bottom">
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Bottom Tooltip
                </Button>
              </Tooltip>

              <Tooltip content="This is a tooltip on the left" side="left">
                <Button variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  Left Tooltip
                </Button>
              </Tooltip>

              <Tooltip 
                content={
                  <div className="space-y-1">
                    <p className="font-semibold">Rich Content Tooltip</p>
                    <p className="text-xs">Tooltips can contain rich content with multiple lines and formatting</p>
                  </div>
                }
                side="top"
              >
                <Button>Rich Content</Button>
              </Tooltip>
            </div>
          </Card>
        </section>

        {/* Popovers Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Popovers</h2>
          <Card className="p-6">
            <div className="flex flex-wrap gap-4">
              <Popover
                content={
                  <div className="space-y-3">
                    <h3 className="font-semibold">Popover Title</h3>
                    <p className="text-sm text-muted-foreground">
                      This is a popover with rich content. It can contain any React elements.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm">Action</Button>
                      <Button size="sm" variant="outline">Cancel</Button>
                    </div>
                  </div>
                }
                side="bottom"
              >
                <Button variant="outline">Open Popover (Bottom)</Button>
              </Popover>

              <Popover
                content={
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium">User Menu</span>
                    </div>
                    <div className="space-y-1">
                      <button className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent">
                        Profile
                      </button>
                      <button className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent">
                        Settings
                      </button>
                      <button className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent text-destructive">
                        Logout
                      </button>
                    </div>
                  </div>
                }
                side="right"
              >
                <Button variant="outline">User Menu (Right)</Button>
              </Popover>

              <Popover
                open={popoverOpen}
                onOpenChange={setPopoverOpen}
                content={
                  <div className="space-y-3">
                    <h3 className="font-semibold">Controlled Popover</h3>
                    <p className="text-sm text-muted-foreground">
                      This popover is controlled by state.
                    </p>
                    <Button 
                      size="sm" 
                      onClick={() => setPopoverOpen(false)}
                    >
                      Close
                    </Button>
                  </div>
                }
              >
                <Button>Controlled Popover</Button>
              </Popover>
            </div>
          </Card>
        </section>

        {/* Alerts Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Alerts</h2>
          <div className="space-y-4">
            <Alert variant="success">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Your changes have been saved successfully.
              </AlertDescription>
            </Alert>

            <Alert variant="warning">
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                You are approaching your storage limit. Consider upgrading your plan.
              </AlertDescription>
            </Alert>

            <Alert variant="error">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to connect to the server. Please check your internet connection and try again.
              </AlertDescription>
            </Alert>

            <Alert variant="info">
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>
                We&apos;ve updated our privacy policy. Please review the changes.
              </AlertDescription>
            </Alert>

            <Alert variant="info" dismissible>
              <AlertTitle>Dismissible Alert</AlertTitle>
              <AlertDescription>
                This alert can be dismissed by clicking the X button.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Progress Bars Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Progress Bars</h2>
          <Card className="p-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Linear Progress</h3>
              <Progress value={progress} showLabel />
              <Progress value={progress} variant="success" />
              <Progress value={progress} variant="warning" />
              <Progress value={progress} variant="error" />
              <Progress value={progress} variant="info" size="sm" />
              <Progress value={75} variant="success" size="lg" showLabel />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Circular Progress</h3>
              <div className="flex flex-wrap gap-6">
                <CircularProgress value={circularProgress} variant="default" />
                <CircularProgress value={circularProgress} variant="success" size={100} strokeWidth={6} />
                <CircularProgress value={circularProgress} variant="warning" size={80} />
                <CircularProgress value={circularProgress} variant="error" size={80} />
                <CircularProgress value={circularProgress} variant="info" size={80} showLabel={false} />
              </div>
            </div>
          </Card>
        </section>

        {/* Skeletons Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Skeletons</h2>
          <div className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-medium">Loading States</h3>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setShowSkeleton(!showSkeleton)}
                >
                  Toggle
                </Button>
              </div>
              
              {showSkeleton ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <SkeletonAvatar size={60} />
                    <div className="flex-1">
                      <SkeletonText lines={2} />
                    </div>
                  </div>
                  <SkeletonCard />
                  <div className="flex gap-2">
                    <SkeletonButton />
                    <SkeletonButton />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-[60px] w-[60px] rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">John Doe</h4>
                      <p className="text-sm text-muted-foreground">john@example.com</p>
                    </div>
                  </div>
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Content Loaded</h4>
                    <p className="text-sm text-muted-foreground">
                      This is the actual content that appears after loading.
                    </p>
                  </Card>
                  <div className="flex gap-2">
                    <Button>Action 1</Button>
                    <Button variant="outline">Action 2</Button>
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Skeleton Variants</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Default</p>
                  <Skeleton className="h-20 w-full" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Shimmer Effect</p>
                  <Skeleton variant="shimmer" className="h-20 w-full" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Table Skeleton</p>
                  <SkeletonTable rows={3} columns={3} />
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Badges Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Badges</h2>
          <Card className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Variant Badges</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="foundation">Foundation</Badge>
                  <Badge variant="spacing">Spacing</Badge>
                  <Badge variant="brand">Brand</Badge>
                  <Badge variant="component">Component</Badge>
                  <Badge variant="platform">Platform</Badge>
                  <Badge variant="misc">Misc</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Status Badges</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="foundation">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                  <Badge variant="spacing">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                  <Badge variant="destructive">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Error
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Counter Badges</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="relative">
                    <Button variant="ghost" size="icon">
                      <Bell className="h-5 w-5" />
                    </Button>
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      3
                    </Badge>
                  </div>
                  <div className="relative">
                    <Button variant="ghost" size="icon">
                      <Mail className="h-5 w-5" />
                    </Button>
                    <Badge 
                      variant="default" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      12
                    </Badge>
                  </div>
                  <div className="relative">
                    <Button variant="ghost" size="icon">
                      <ShoppingCart className="h-5 w-5" />
                    </Button>
                    <Badge 
                      variant="foundation" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      5
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Combined Examples */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Combined Examples</h2>
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-medium">Task Progress</h3>
                  <Badge variant="foundation">In Progress</Badge>
                </div>
                <Tooltip content="View task details">
                  <Button variant="ghost" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                </Tooltip>
              </div>
              <Progress value={65} variant="success" showLabel />
              <p className="text-sm text-muted-foreground">
                13 of 20 tasks completed
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Recent Activity</h3>
              <Popover
                content={
                  <div className="space-y-2">
                    <button className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent">
                      View All
                    </button>
                    <button className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent">
                      Mark as Read
                    </button>
                    <button className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent">
                      Settings
                    </button>
                  </div>
                }
              >
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </Popover>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border">
                  <SkeletonAvatar size={40} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">User {i}</span>
                      <Badge variant="outline" className="text-xs">2h ago</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Completed task #{i}
                    </p>
                  </div>
                  <Tooltip content="View details">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Tooltip>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}
