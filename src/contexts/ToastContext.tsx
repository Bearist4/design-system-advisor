'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Toast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';

export interface ToastOptions {
  id?: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  showIcon?: boolean;
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextType {
  toasts: ToastItem[];
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    const id = options.id || Math.random().toString(36).substr(2, 9);
    const duration = options.duration ?? 5000;

    const newToast: ToastItem = {
      ...options,
      id,
    };

    setToasts((prev) => {
      // Limit to 5 toasts at a time
      const updatedToasts = [...prev, newToast];
      if (updatedToasts.length > 5) {
        return updatedToasts.slice(-5);
      }
      return updatedToasts;
    });

    // Auto dismiss after duration (unless duration is 0)
    if (duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }

    return id;
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss, dismissAll }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastViewport({ 
  toasts, 
  onDismiss 
}: { 
  toasts: ToastItem[]; 
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-0 z-tooltip flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
      style={{ pointerEvents: 'none' }}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          variant={toast.variant}
          title={toast.title}
          description={toast.description}
          showIcon={toast.showIcon}
          onClose={() => onDismiss(toast.id)}
          action={
            toast.action ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  toast.action?.onClick();
                  onDismiss(toast.id);
                }}
              >
                {toast.action.label}
              </Button>
            ) : undefined
          }
        />
      ))}
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Helper functions for common toast types
export const useToastHelpers = () => {
  const { toast } = useToast();

  return {
    success: (title: string, description?: string, options?: Partial<ToastOptions>) =>
      toast({ title, description, variant: 'success', ...options }),
    
    error: (title: string, description?: string, options?: Partial<ToastOptions>) =>
      toast({ title, description, variant: 'error', ...options }),
    
    warning: (title: string, description?: string, options?: Partial<ToastOptions>) =>
      toast({ title, description, variant: 'warning', ...options }),
    
    info: (title: string, description?: string, options?: Partial<ToastOptions>) =>
      toast({ title, description, variant: 'info', ...options }),
  };
};
