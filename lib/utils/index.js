import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { REGEX_PATTERNS } from '@/lib/constants'

const DEFAULT_COLOR_FALLBACK = '#000000'
const DEFAULT_RGB = '0, 0, 0'

export function CN(...inputs) {
  return twMerge(clsx(inputs))
}

export { CN as cn }

export function IS_BROWSER() {
  return typeof window !== 'undefined'
}

export function IS_FUNCTION(value) {
  return typeof value === 'function'
}

export function IS_STRING(value) {
  return typeof value === 'string'
}

export function IS_OBJECT(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export function IS_VALID_URL(url) {
  if (!url || typeof url !== 'string') {
    return false
  }
  return REGEX_PATTERNS.URL.test(url)
}

function NORMALIZE_HEX(hex) {
  if (!IS_STRING(hex)) return null

  const value = hex.trim().replace('#', '')
  if (value.length === 3) {
    return value
      .split('')
      .map((char) => `${char}${char}`)
      .join('')
  }

  if (value.length === 6) return value
  return null
}

function PARSE_RGB_STRING(color) {
  if (!IS_STRING(color)) return null

  const trimmed = color.trim()
  if (!/^rgba?\(/i.test(trimmed)) return null

  const channels = trimmed
    .match(/\d+(?:\.\d+)?/g)
    ?.slice(0, 3)
    ?.map((value) => Math.round(Number(value)))

  if (!channels || channels.length < 3) return null

  const [r, g, b] = channels

  if ([r, g, b].some((channel) => Number.isNaN(channel) || channel < 0 || channel > 255)) {
    return null
  }

  return `${r}, ${g}, ${b}`
}

function RESOLVE_CSS_VAR(value) {
  if (!IS_STRING(value)) return value

  const trimmed = value.trim()
  const match = trimmed.match(/^var\(\s*(--[a-zA-Z0-9_-]+)\s*(?:,\s*([^)]+)\s*)?\)$/)
  if (!match) return trimmed

  const cssVarName = match[1]
  const fallbackValue = match[2]?.trim() || null

  if (!IS_BROWSER()) return fallbackValue

  const resolved = getComputedStyle(document.documentElement).getPropertyValue(cssVarName).trim()

  return resolved || fallbackValue
}

function PARSE_COLOR_TO_RGB(value) {
  const resolved = RESOLVE_CSS_VAR(value)
  if (!resolved) return null

  const rgb = PARSE_RGB_STRING(resolved)
  if (rgb) return rgb

  const normalizedHex = NORMALIZE_HEX(resolved)
  if (!normalizedHex) return null

  const r = parseInt(normalizedHex.slice(0, 2), 16)
  const g = parseInt(normalizedHex.slice(2, 4), 16)
  const b = parseInt(normalizedHex.slice(4, 6), 16)

  return `${r}, ${g}, ${b}`
}

export function HEX_TO_RGB(value, fallback = DEFAULT_COLOR_FALLBACK) {
  return PARSE_COLOR_TO_RGB(value) || PARSE_COLOR_TO_RGB(fallback) || DEFAULT_RGB
}

export function HEX_TO_RGBA(value, alpha = 1, fallback = DEFAULT_COLOR_FALLBACK) {
  const safeAlpha = Number(alpha)
  const clampedAlpha = Number.isFinite(safeAlpha) ? Math.max(0, Math.min(1, safeAlpha)) : 1

  if (IS_STRING(value) && value.trim().startsWith('var(')) {
    const percentage = Math.round(clampedAlpha * 100)
    return `color-mix(in srgb, ${value.trim()} ${percentage}%, transparent)`
  }

  const rgb = HEX_TO_RGB(value, fallback)
  return `rgba(${rgb}, ${clampedAlpha})`
}
