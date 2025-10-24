'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusIndicator, StatusDot } from '@/components/ui/status-indicator';
import { LoadingSpinner, LoadingOverlay, Skeleton } from '@/components/ui/loading-spinner';
import { Progress, CircularProgress } from '@/components/ui/progress';
import { EmptyState, EmptyStateCompact } from '@/components/ui/empty-state';
import { useToast, useToastHelpers } from '@/contexts/ToastContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { NotificationPanel } from '@/components/ui/notification-panel';
import { Bell } from 'lucide-react';

export default function FeedbackDemoPage() {
  const [progress, setProgress] = useState(30);
  const [showLoading, setShowLoading] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  
  const { toast } = useToast();
  const toastHelpers = useToastHelpers();
  const { addNotification, unreadCount } = useNotifications();

  const handleProgressIncrease = () => {
    setProgress((prev) => Math.min(prev + 10, 100));
  };

  const handleProgressDecrease = () => {
    setProgress((prev) => Math.max(prev - 10, 0));
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Feedback Components</h1>
        <p className="text-muted-foreground">
          Interactive showcase of all feedback and status components
        </p>
      </div>

      <div className="grid gap-6">
        {/* Status Indicators */}
        <Card>
          <CardHeader>
            <CardTitle>Status Indicators</CardTitle>
            <CardDescription>
              Color-coded status messages with icons
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <StatusIndicator variant="success">
                Operation completed successfully
              </StatusIndicator>
              <StatusIndicator variant="warning">
                This action requires your attention
              </StatusIndicator>
              <StatusIndicator variant="error">
                An error occurred while processing
              </StatusIndicator>
              <StatusIndicator variant="info">
                Here's some helpful information
              </StatusIndicator>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-3">With close button:</p>
              <StatusIndicator variant="success" onClose={() => alert('Dismissed')}>
                Dismissible status message
              </StatusIndicator>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-3">Status dots (compact):</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <StatusDot variant="success" />
                  <span className="text-sm">Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusDot variant="warning" />
                  <span className="text-sm">Warning</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusDot variant="error" />
                  <span className="text-sm">Error</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusDot variant="info" />
                  <span className="text-sm">Info</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading Spinners */}
        <Card>
          <CardHeader>
            <CardTitle>Loading Spinners</CardTitle>
            <CardDescription>
              Various loading state indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm font-medium mb-3">Sizes:</p>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <LoadingSpinner size="xs" />
                  <span className="text-xs text-muted-foreground">XS</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <LoadingSpinner size="sm" />
                  <span className="text-xs text-muted-foreground">SM</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <LoadingSpinner size="default" />
                  <span className="text-xs text-muted-foreground">Default</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <LoadingSpinner size="lg" />
                  <span className="text-xs text-muted-foreground">LG</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <LoadingSpinner size="xl" />
                  <span className="text-xs text-muted-foreground">XL</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-3">Variants:</p>
              <div className="flex items-center gap-6">
                <LoadingSpinner variant="default" label="Default" />
                <LoadingSpinner variant="success" label="Success" />
                <LoadingSpinner variant="warning" label="Warning" />
                <LoadingSpinner variant="error" label="Error" />
                <LoadingSpinner variant="muted" label="Muted" />
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-3">Loading overlay:</p>
              <Button onClick={() => {
                setShowLoading(true);
                setTimeout(() => setShowLoading(false), 2000);
              }}>
                Show Loading Overlay
              </Button>
              {showLoading && <LoadingOverlay label="Loading data..." />}
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-3">Skeleton loaders:</p>
              <div className="space-y-3">
                <Skeleton variant="text" className="w-3/4" />
                <Skeleton variant="text" className="w-1/2" />
                <div className="flex items-center gap-3">
                  <Skeleton variant="circular" />
                  <div className="flex-1 space-y-2">
                    <Skeleton variant="text" className="w-full" />
                    <Skeleton variant="text" className="w-2/3" />
                  </div>
                </div>
                <Skeleton variant="rectangular" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Indicators */}
        <Card>
          <CardHeader>
            <CardTitle>Progress Indicators</CardTitle>
            <CardDescription>
              Linear and circular progress bars
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm font-medium mb-3">Linear progress:</p>
              <div className="space-y-4">
                <Progress value={progress} showLabel />
                <div className="flex gap-2">
                  <Button onClick={handleProgressDecrease} variant="outline" size="sm">
                    Decrease
                  </Button>
                  <Button onClick={handleProgressIncrease} variant="outline" size="sm">
                    Increase
                  </Button>
                  <Button onClick={() => setProgress(0)} variant="outline" size="sm">
                    Reset
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-3">Variants:</p>
              <div className="space-y-3">
                <Progress value={75} variant="default" showLabel />
                <Progress value={50} variant="success" showLabel />
                <Progress value={65} variant="warning" showLabel />
                <Progress value={40} variant="error" showLabel />
                <Progress value={85} variant="info" showLabel />
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-3">Circular progress:</p>
              <div className="flex items-center gap-8">
                <CircularProgress value={progress} size={100} />
                <CircularProgress value={75} variant="success" size={100} />
                <CircularProgress value={50} variant="warning" size={100} />
                <CircularProgress value={25} variant="error" size={100} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Toast Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Toast Notifications</CardTitle>
            <CardDescription>
              Temporary messages that auto-dismiss
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => toastHelpers.success('Success!', 'Operation completed')}>
                Success Toast
              </Button>
              <Button onClick={() => toastHelpers.error('Error!', 'Something went wrong')}>
                Error Toast
              </Button>
              <Button onClick={() => toastHelpers.warning('Warning!', 'Please be careful')}>
                Warning Toast
              </Button>
              <Button onClick={() => toastHelpers.info('Info', 'Just so you know')}>
                Info Toast
              </Button>
              <Button onClick={() => toast({
                title: 'With action',
                description: 'This toast has an action button',
                variant: 'success',
                action: {
                  label: 'Undo',
                  onClick: () => alert('Action clicked!')
                }
              })}>
                Toast with Action
              </Button>
              <Button onClick={() => toast({
                title: 'Persistent',
                description: 'This won\'t auto-dismiss',
                variant: 'info',
                duration: 0
              })}>
                Persistent Toast
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Notification System</CardTitle>
                <CardDescription>
                  Persistent notifications with management
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowNotificationPanel(!showNotificationPanel)}
                className="relative"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-error text-[10px] text-error-foreground">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => addNotification({
                title: 'New message',
                description: 'You have a new message from John',
                variant: 'info'
              })}>
                Add Info
              </Button>
              <Button onClick={() => addNotification({
                title: 'Task completed',
                description: 'Your task has been completed successfully',
                variant: 'success'
              })}>
                Add Success
              </Button>
              <Button onClick={() => addNotification({
                title: 'Warning',
                description: 'Your subscription is expiring soon',
                variant: 'warning',
                actionUrl: '/settings',
                actionLabel: 'Renew now'
              })}>
                Add Warning
              </Button>
              <Button onClick={() => addNotification({
                title: 'Error occurred',
                description: 'Failed to sync your data',
                variant: 'error'
              })}>
                Add Error
              </Button>
            </div>

            {showNotificationPanel && (
              <div className="pt-4 border-t">
                <NotificationPanel onClose={() => setShowNotificationPanel(false)} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Empty States */}
        <Card>
          <CardHeader>
            <CardTitle>Empty States</CardTitle>
            <CardDescription>
              Placeholder content when no data is available
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <EmptyState
              icon="search"
              title="No results found"
              description="Try adjusting your search or filter to find what you're looking for."
              action={{
                label: 'Clear filters',
                onClick: () => alert('Filters cleared')
              }}
            />

            <div className="pt-4 border-t">
              <EmptyStateCompact
                icon="file"
                title="No files yet"
                description="Upload your first file to get started"
                action={{
                  label: 'Upload file',
                  onClick: () => alert('Upload clicked')
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
