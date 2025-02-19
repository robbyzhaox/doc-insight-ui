import '@/app/globals.css'

export const metadata = {
  title: 'Document Extractor',
  description: 'Extract information from documents Via AI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <main className="max-w-4xl mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  )
}