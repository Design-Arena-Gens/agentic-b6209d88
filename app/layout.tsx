import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Property Violations Finder',
  description: 'Find US properties with violations, image, skip tracing, and mortgage status.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <main className="container py-6">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Property Violations Finder</h1>
            <a
              className="text-sm text-blue-600 hover:underline"
              href="https://agentic-b6209d88.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Live
            </a>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
