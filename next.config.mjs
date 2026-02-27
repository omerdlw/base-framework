import { ZONES_CONFIG } from './config/zones.config.mjs'

if (process.env.NODE_ENV === 'production') {
  const requiredServerEnvVars = ['MONGODB_URI', 'MONGODB_DB']
  const requiredEnvVars = ['NEXT_PUBLIC_API_URL']

  const missingVars = []
  requiredEnvVars.forEach((key) => {
    if (!process.env[key]) missingVars.push(key)
  })
  requiredServerEnvVars.forEach((key) => {
    if (!process.env[key]) missingVars.push(key)
  })

  if (missingVars.length > 0) {
    console.error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    )
    process.exit(1)
  }
  console.log('Environment validation passed')
}

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-XSS-Protection', value: '0' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

const nextConfig = {
  devIndicators: false,
  env: {
    BUILD_DATE: new Date().toISOString().split('T')[0],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  async rewrites() {
    if (!ZONES_CONFIG.enabled) return []

    const zones = ZONES_CONFIG.apps.map((app) => ({
      source: `${app.path}/:path*`,
      destination: `${app.destination}/:path*`,
    }))

    return zones
  },
}

export default nextConfig
