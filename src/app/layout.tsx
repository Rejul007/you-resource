import type { Metadata } from 'next';
import { DM_Sans, Syne, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', weight: ['400', '500', '600', '700'] });
const syne = Syne({ subsets: ['latin'], variable: '--font-syne', weight: ['400', '600', '700', '800'] });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', weight: ['400', '500'] });

export const metadata: Metadata = {
  title: 'StudyHub — Community Study Resources',
  description: 'Find and share study resources for any subject. AI-powered classification.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${syne.variable} ${jetbrainsMono.variable}`}>
      <body style={{ backgroundColor: '#110703', minHeight: '100vh' }}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <footer className="mt-20 py-8" style={{ borderTop: '1px solid rgba(180,90,40,0.15)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm" style={{ color: '#5a3828' }}>
            <p>StudyHub — A community platform for sharing study resources</p>
            <p className="mt-1">Built with Next.js, Supabase, and Google Gemini AI</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
