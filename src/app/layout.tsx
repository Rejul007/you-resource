import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StudyHub — Community Study Resources',
  description: 'Find and share study resources for any subject. AI-powered classification.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <footer className="bg-white border-t border-gray-200 mt-16 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
            <p>StudyHub &mdash; A community platform for sharing study resources</p>
            <p className="mt-1">Built with Next.js, Supabase, and Google Gemini AI</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
