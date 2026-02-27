export const HTTP_STATUS = {
  INTERNAL_SERVER_ERROR: 500,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  FORBIDDEN: 403,
  CREATED: 201,
  OK: 200,
}

export const ANIMATION_DURATIONS = {
  VERY_FAST: 100,
  FAST: 200,
  NORMAL: 300,
  SLOW: 600,
}

export const DURATION = {
  VERY_FAST: 0.1,
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.6,
}

export const EASING = {
  SMOOTH: [0.25, 0.46, 0.45, 0.94],
  EASE_IN: [0.4, 0, 1, 1],
  EASE_IN_OUT: [0.4, 0, 0.2, 1],
  EASE_OUT: [0, 0, 0.2, 1],
  SPRING: 'spring',
}

export const Z_INDEX = {
  DEBUG_OVERLAY: 9999,
  ERROR_OVERLAY: 200,
  NOTIFICATION: 110,
  MODAL_BACKDROP: 90,
  NAV_BACKDROP: 40,
  UI_ELEMENT: 10,
  BACKGROUND: -10,
  CONTROLS: 100,
  DROPDOWN: 110,
  LOADING: 150,
  TOOLTIP: 70,
  COUNTDOWN: 50,
  SELECT: 120,
  MODAL: 100,
  NAV: 100,
}

export const NOTIFICATION_DURATIONS = {
  SHORT: 3000,
  DEFAULT: 4000,
  LONG: 5000,
}

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  URL: /^https?:\/\/.+/,
}

export const STORAGE_KEYS = {
  SETTINGS: 'app_settings',
}
