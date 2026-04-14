'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

export default function Navbar() {
  const pathname = usePathname();
  const { isSignedIn, user } = useUser();

  const displayName = user?.username || user?.firstName || 'User';

  const navLink = (href: string, label: string) => {
    const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
    return (
      <Link
        href={href}
        className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150"
        style={active
          ? { background: 'rgba(193,127,58,0.12)', color: '#C8956A' }
          : { color: '#9A7A62' }
        }
      >
        {label}
      </Link>
    );
  };

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(17,7,3,0.85)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(180,90,40,0.15)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between" style={{ height: '60px' }}>
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #D4923F, #C17F3A)', boxShadow: '0 2px 12px rgba(193,127,58,0.4)' }}
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-lg font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#C8956A' }}>
                <span style={{ color: '#C17F3A', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85em', marginRight: '2px' }}>✦</span>StudyHub
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {navLink('/', 'Home')}
              {navLink('/posts', 'Browse')}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isSignedIn && (
              <Link href="/request" className="btn-primary text-sm">
                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Request
              </Link>
            )}
            {isSignedIn ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:block text-sm font-medium" style={{ color: '#9A7A62' }}>{displayName}</span>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: { width: '32px', height: '32px' },
                    },
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <SignInButton mode="redirect">
                  <button className="text-sm font-medium transition-colors duration-150 px-3 py-1.5" style={{ color: '#9A7A62' }}>
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="redirect">
                  <button
                    className="text-sm font-semibold px-3 py-1.5 rounded-xl transition-all duration-150"
                    style={{ background: 'rgba(255,255,255,0.06)', color: '#C8956A', border: '1px solid rgba(180,90,40,0.25)' }}
                  >
                    Sign up
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
