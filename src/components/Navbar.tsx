'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';

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
        <div className="flex items-center justify-between h-15" style={{ height: '60px' }}>
          {/* Logo + Nav */}
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

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link href="/request" className="btn-primary text-sm">
              <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Request
            </Link>
            {user ? (
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold uppercase"
                  style={{ background: 'rgba(193,127,58,0.15)', color: '#C8956A', border: '1px solid rgba(193,127,58,0.3)' }}
                >
                  {displayName.charAt(0)}
                </div>
                <span className="hidden sm:block text-sm font-medium" style={{ color: '#9A7A62' }}>{displayName}</span>
                <button
                  onClick={handleSignOut}
                  className="text-xs px-2.5 py-1.5 rounded-lg transition-all duration-150"
                  style={{ color: '#5a3828', border: '1px solid rgba(180,90,40,0.15)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#9A7A62'; e.currentTarget.style.borderColor = 'rgba(180,90,40,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#5a3828'; e.currentTarget.style.borderColor = 'rgba(180,90,40,0.15)'; }}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login" className="text-sm font-medium transition-colors duration-150 px-3 py-1.5" style={{ color: '#9A7A62' }}>
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-sm font-semibold px-3 py-1.5 rounded-xl transition-all duration-150"
                  style={{ background: 'rgba(255,255,255,0.06)', color: '#C8956A', border: '1px solid rgba(180,90,40,0.25)' }}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
