import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}
