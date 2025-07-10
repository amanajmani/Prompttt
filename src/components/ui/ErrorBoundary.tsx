'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import { cn } from '@/utils'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  showDetails?: boolean
  className?: string
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo })
    
    // Log error to monitoring service
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Call custom error handler
    this.props.onError?.(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  handleReportBug = () => {
    // In a real app, this would open a bug report form or redirect to support
    const errorDetails = {
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }
    
    console.log('Bug report data:', errorDetails)
    // You could send this to your error tracking service
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className={cn(
          'min-h-screen flex items-center justify-center p-4 bg-primary-bg',
          this.props.className
        )}>
          <div className="max-w-md w-full text-center space-y-6">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <h1 className="text-2xl font-heading font-bold text-high">
                Something went wrong
              </h1>
              <p className="text-medium">
                We're sorry, but something unexpected happened. Please try again or contact support if the problem persists.
              </p>
            </div>

            {/* Error Details (Development) */}
            {this.props.showDetails && this.state.error && (
              <div className="text-left bg-secondary-surface border border-border rounded-lg p-4 space-y-2">
                <h3 className="font-medium text-high text-sm">Error Details:</h3>
                <div className="text-xs font-mono text-low break-all">
                  <div className="text-red-400 mb-2">{this.state.error.message}</div>
                  {this.state.error.stack && (
                    <pre className="whitespace-pre-wrap text-xs">
                      {this.state.error.stack.split('\n').slice(0, 5).join('\n')}
                    </pre>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className={cn(
                  'flex items-center justify-center gap-2 px-4 py-2 rounded-lg',
                  'bg-accent text-white hover:bg-accent/90',
                  'focus:outline-none focus:ring-2 focus:ring-accent/20 focus:ring-offset-2',
                  'transition-all duration-200 touch-target'
                )}
              >
                <RefreshCw size={16} />
                Try Again
              </button>
              
              <button
                onClick={this.handleGoHome}
                className={cn(
                  'flex items-center justify-center gap-2 px-4 py-2 rounded-lg',
                  'bg-secondary-surface text-high border border-border',
                  'hover:bg-secondary-surface/80',
                  'focus:outline-none focus:ring-2 focus:ring-accent/20 focus:ring-offset-2',
                  'transition-all duration-200 touch-target'
                )}
              >
                <Home size={16} />
                Go Home
              </button>
              
              <button
                onClick={this.handleReportBug}
                className={cn(
                  'flex items-center justify-center gap-2 px-4 py-2 rounded-lg',
                  'bg-transparent text-medium border border-border',
                  'hover:bg-secondary-surface hover:text-high',
                  'focus:outline-none focus:ring-2 focus:ring-accent/20 focus:ring-offset-2',
                  'transition-all duration-200 touch-target'
                )}
              >
                <Bug size={16} />
                Report Bug
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook version for functional components
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null)

  const resetError = () => setError(null)

  const handleError = React.useCallback((error: Error) => {
    setError(error)
  }, [])

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return { handleError, resetError }
}

// Error state components for specific scenarios
export const ErrorState: React.FC<{
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  icon?: React.ReactNode
  className?: string
}> = ({
  title = 'Something went wrong',
  description = 'An error occurred while loading this content.',
  action,
  icon,
  className
}) => {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-8 text-center space-y-4',
      className
    )}>
      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
        {icon || <AlertTriangle className="w-6 h-6 text-red-500" />}
      </div>
      
      <div className="space-y-2">
        <h3 className="font-heading font-semibold text-high">{title}</h3>
        <p className="text-medium text-sm">{description}</p>
      </div>
      
      {action && (
        <button
          onClick={action.onClick}
          className={cn(
            'px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90',
            'focus:outline-none focus:ring-2 focus:ring-accent/20 focus:ring-offset-2',
            'transition-all duration-200 touch-target'
          )}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

// Network error state
export const NetworkErrorState: React.FC<{
  onRetry?: () => void
  className?: string
}> = ({ onRetry, className }) => {
  return (
    <ErrorState
      title="Connection Error"
      description="Unable to connect to the server. Please check your internet connection and try again."
      action={onRetry ? { label: 'Retry', onClick: onRetry } : undefined}
      className={className}
    />
  )
}

// Not found error state
export const NotFoundState: React.FC<{
  title?: string
  description?: string
  onGoBack?: () => void
  className?: string
}> = ({
  title = 'Page Not Found',
  description = "The page you're looking for doesn't exist or has been moved.",
  onGoBack,
  className
}) => {
  return (
    <ErrorState
      title={title}
      description={description}
      action={onGoBack ? { label: 'Go Back', onClick: onGoBack } : undefined}
      className={className}
    />
  )
}

// Permission error state
export const PermissionErrorState: React.FC<{
  onLogin?: () => void
  className?: string
}> = ({ onLogin, className }) => {
  return (
    <ErrorState
      title="Access Denied"
      description="You don't have permission to view this content. Please log in or contact support."
      action={onLogin ? { label: 'Log In', onClick: onLogin } : undefined}
      className={className}
    />
  )
}