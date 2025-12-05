import './globals.css'
import Script from 'next/script'

export const metadata = {
  title: 'Stranger Things Lights',
  description: 'Communicate through the Upside Down',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        {children}
        <Script src="https://www.youtube.com/iframe_api" strategy="lazyOnload" />
      </body>
    </html>
  )
}
