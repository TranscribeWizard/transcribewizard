import './globals.css'

export const metadata = {
  title: 'TranscribeWizard',
  description: 'Transcribe Your Content With Transcribe Wizard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="dark">
      <body>{children}</body>
    </html>
  )
}
