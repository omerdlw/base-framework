import { DynamicControls, DynamicNav } from '@/components/layout/dynamic-wrappers'
import { PageScaleWrapper } from '@/components/layout/page-scale-wrapper'
import { CN } from '@/lib/utils'
import { CountdownGate } from '@/modules/countdown/gate'

import { geist } from '../fonts'
import './globals.css'
import { AppProviders } from './providers'

export const metadata = {
  description: 'A robust foundation for web projects',
  title: 'My Web Base',
  openGraph: {
    description: 'A robust foundation for web projects',
    title: 'My Web Base',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang='en' suppressHydrationWarning={true}>
      <body
        suppressHydrationWarning={true}
        className={CN(
          'h-auto w-full scroll-smooth bg-black fill-white font-normal text-white antialiased',
          geist.className
        )}
      >
        <AppProviders>
          <DynamicNav />
          <CountdownGate>
            <DynamicControls />
            <PageScaleWrapper>
              <main className='h-auto w-full flex-1'>{children}</main>
            </PageScaleWrapper>
          </CountdownGate>
        </AppProviders>
      </body>
    </html>
  )
}
