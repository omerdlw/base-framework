'use client'

import React from 'react'

import { EVENT_TYPES, globalEvents } from '@/lib/events'

import { getErrorReporter } from './reporter'

export class ErrorBoundaryCore extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      errorInfo: null,
      error: null,
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.resetKey !== state.lastResetKey) {
      return {
        lastResetKey: props.resetKey,
        hasError: false,
        errorInfo: null,
        error: null,
      }
    }
    return null
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })

    const errorContext = {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      route: typeof window !== 'undefined' ? window.location.pathname : null,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      name: this.props.name || this.props.title,
      variant: this.props.variant,
      source: 'ErrorBoundary',
    }

    if (this.props.onError) {
      this.props.onError(error, errorInfo, errorContext)
    }

    if (!this.props.silent) {
      globalEvents.emit(EVENT_TYPES.APP_ERROR, {
        message: this.props.message || error?.message || 'Beklenmeyen bir hata oluştu.',
        error,
        errorInfo,
        resetError: this.resetError,
      })
    }

    const reporter = getErrorReporter()
    if (reporter.handlers.length > 0) {
      reporter.captureError(error, errorContext)
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorBoundary]', error, errorContext)
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      errorInfo: null,
      error: null,
    })

    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback({
            resetError: this.resetError,
            error: this.state.error,
          })
        }
        return this.props.fallback
      }

      return (
        <div className='flex h-full w-full flex-col items-center justify-center p-4'>
          <div className='rounded-lg bg-red-500/10 px-6 py-4 text-center text-red-500/80 backdrop-blur-sm'>
            <p className='text-lg font-medium'>Bir bileşen yüklenemedi</p>
            {this.props.message && <p className='mt-2 text-sm opacity-80'>{this.props.message}</p>}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
