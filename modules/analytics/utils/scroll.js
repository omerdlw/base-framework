export const DEFAULT_SCROLL_THRESHOLDS = [25, 50, 75, 90]

export function getScrollPercentage({ scrollHeight, viewportHeight, scrollY } = {}) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return 0
  }

  const docHeight = scrollHeight ?? document.documentElement.scrollHeight
  const viewHeight = viewportHeight ?? window.innerHeight
  const maxScroll = Math.max(0, docHeight - viewHeight)

  if (maxScroll === 0) return 100

  const currentScroll = scrollY ?? window.scrollY
  const percentage = Math.round((currentScroll / maxScroll) * 100)

  return Math.max(0, Math.min(100, percentage))
}

export function trackScrollThresholds({
  thresholds = DEFAULT_SCROLL_THRESHOLDS,
  trackedThresholds,
  percentage,
  onThreshold,
} = {}) {
  if (!trackedThresholds || typeof onThreshold !== 'function') return

  thresholds.forEach((threshold) => {
    if (percentage >= threshold && !trackedThresholds.has(threshold)) {
      trackedThresholds.add(threshold)
      onThreshold(threshold)
    }
  })
}
