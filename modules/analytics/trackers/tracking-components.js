'use client'

import React, { forwardRef } from 'react'

import { useAnalytics, useTrack } from '@/modules/analytics'

export const TrackableLink = forwardRef(
  ({ href, children, eventName, eventParams, className, ...props }, ref) => {
    const track = useTrack()

    const handleClick = (e) => {
      const isExternal = href && (href.startsWith('http') || href.startsWith('//'))
      const isDownload = href && /\.(pdf|doc|docx|xls|xlsx|zip|rar)$/i.test(href)

      if (isDownload) {
        track('download', {
          file_url: href,
          file_name: href.split('/').pop(),
          file_extension: href.split('.').pop(),
        })
      } else if (isExternal) {
        try {
          const linkDomain = new URL(href, window.location.origin).hostname
          track('outbound_link', {
            link_url: href,
            link_domain: linkDomain,
          })
        } catch {
          track('outbound_link', {
            link_url: href,
            link_domain: 'unknown',
          })
        }
      }

      if (eventName) {
        track(eventName, {
          link_url: href,
          link_text: typeof children === 'string' ? children : 'Link',
          ...eventParams,
        })
      }

      if (props.onClick) {
        props.onClick(e)
      }
    }

    return (
      <a ref={ref} href={href} className={className} onClick={handleClick} {...props}>
        {children}
      </a>
    )
  }
)

TrackableLink.displayName = 'TrackableLink'

export const TrackableButton = forwardRef(
  ({ children, eventName, eventParams, className, ...props }, ref) => {
    const track = useTrack()

    const handleClick = (e) => {
      if (eventName) {
        track(eventName, {
          button_text: typeof children === 'string' ? children : 'Button',
          ...eventParams,
        })
      }

      if (props.onClick) {
        props.onClick(e)
      }
    }

    return (
      <button ref={ref} className={className} onClick={handleClick} {...props}>
        {children}
      </button>
    )
  }
)

TrackableButton.displayName = 'TrackableButton'

export const TrackableForm = forwardRef(
  ({ children, eventName, eventParams, className, ...props }, ref) => {
    const track = useTrack()

    const handleSubmit = (e) => {
      const formData = new FormData(e.target)

      track(eventName || 'form_submit', {
        form_id: props.id || 'unknown',
        form_fields: Array.from(formData.keys()),
        ...eventParams,
      })

      if (props.onSubmit) {
        props.onSubmit(e)
      }
    }

    return (
      <form ref={ref} className={className} onSubmit={handleSubmit} {...props}>
        {children}
      </form>
    )
  }
)

TrackableForm.displayName = 'TrackableForm'

export const TrackableSearch = forwardRef(
  ({ onSearch, eventName, eventParams, className, ...props }, ref) => {
    const track = useTrack()

    const handleSearch = (query) => {
      if (query.trim().length > 2) {
        track(eventName || 'search', {
          search_term: query,
          search_type: 'manual',
          ...eventParams,
        })
      }

      if (onSearch) {
        onSearch(query)
      }
    }

    const handleChange = (e) => {
      if (props.onSearch) {
        props.onSearch(e.target.value)
      }
    }

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSearch(e.target.value)
      }
    }

    return (
      <input
        ref={ref}
        className={className}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        {...props}
      />
    )
  }
)

TrackableSearch.displayName = 'TrackableSearch'

export const TrackableVideo = forwardRef(
  ({ children, eventName, eventParams, className, ...props }, ref) => {
    const track = useTrack()

    const handlePlay = () => {
      track(eventName || 'video_play', {
        video_id: props.id || 'unknown',
        video_title: props.title || 'unknown',
        ...eventParams,
      })
    }

    const handlePause = () => {
      track(eventName || 'video_pause', {
        video_id: props.id || 'unknown',
        video_title: props.title || 'unknown',
        ...eventParams,
      })
    }

    const handleEnded = () => {
      track(eventName || 'video_complete', {
        video_id: props.id || 'unknown',
        video_title: props.title || 'unknown',
        ...eventParams,
      })
    }

    return (
      <video
        ref={ref}
        className={className}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        {...props}
      >
        {children}
      </video>
    )
  }
)

TrackableVideo.displayName = 'TrackableVideo'

export const PageViewTracker = ({ path, properties }) => {
  const analytics = useAnalytics()

  React.useEffect(() => {
    analytics.page(path, properties)
  }, [analytics, path, properties])

  return null
}

export const ScrollDepthTracker = ({ thresholds = [25, 50, 75, 90] }) => {
  const track = useTrack()
  const trackedThresholds = React.useRef(new Set())

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPosition = window.scrollY
      const scrollPercentage = Math.round((scrollPosition / scrollHeight) * 100)

      thresholds.forEach((threshold) => {
        if (scrollPercentage >= threshold && !trackedThresholds.current.has(threshold)) {
          trackedThresholds.current.add(threshold)
          track('scroll_depth', {
            scroll_percentage: threshold,
            scroll_position: scrollPosition,
          })
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [track, thresholds])

  return null
}

export const AnalyticsErrorBoundary = ({ children, fallback }) => {
  return children || fallback || <div>Something went wrong.</div>
}

export { WorkingTracker } from './working-tracker'
