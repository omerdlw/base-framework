import { NextResponse } from 'next/server'

export function proxy(request) {
  const { method, nextUrl } = request
  const path = nextUrl.pathname

  if (process.env.NODE_ENV === 'development') {
    console.log(`[${new Date().toISOString()}] ${method} ${path}`)
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  const isDev = process.env.NODE_ENV === 'development'

  const cspHeader = `
    script-src 'self' 'nonce-${nonce}' 'unsafe-eval' 'unsafe-inline' https://www.youtube.com https://s.ytimg.com https:;
    font-src 'self' data: https:;
    connect-src 'self' https: wss:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com;
    frame-ancestors 'none';
    ${!isDev ? 'upgrade-insecure-requests;' : ''}
  `

  const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, ' ').trim()

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue)

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public/).*)'],
}
