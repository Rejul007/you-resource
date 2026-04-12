'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

const COLLAPSED = 56;
const EXPANDED = 224;

const navItems = [
  {
    href: '/resources',
    label: 'Resources',
    icon: (
      <svg className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  },
  {
    href: '/internships',
    label: 'Internships',
    icon: (
      <svg className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: '/competitions',
    label: 'Competitions',
    icon: (
      <svg className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

export default function LeftSidebar() {
  const [expanded, setExpanded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Guest';
  const email = user?.email || '';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div
      className="fixed left-0 z-40 flex flex-col"
      style={{
        top: '60px',
        height: 'calc(100vh - 60px)',
        width: expanded ? `${EXPANDED}px` : `${COLLAPSED}px`,
        transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
        background: 'rgba(10,4,1,0.97)',
        borderRight: '1px solid rgba(180,90,40,0.15)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        overflow: 'hidden',
        boxShadow: expanded ? '4px 0 24px rgba(0,0,0,0.4)' : 'none',
      }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Top spacer */}
      <div className="h-3" />

      {/* Nav items */}
      <nav className="flex-1 px-2 space-y-0.5">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl transition-colors duration-150"
              style={active
                ? { background: 'rgba(193,127,58,0.15)', color: '#C8956A' }
                : { color: '#9A7A62' }
              }
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(193,127,58,0.07)';
                  e.currentTarget.style.color = '#C8956A';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#9A7A62';
                }
              }}
            >
              {/* Icon container — fixed width so it never shifts */}
              <span className="flex items-center justify-center shrink-0" style={{ width: '20px' }}>
                {item.icon}
              </span>

              {/* Label fades in */}
              <span
                className="text-sm font-medium whitespace-nowrap"
                style={{
                  opacity: expanded ? 1 : 0,
                  transform: expanded ? 'translateX(0)' : 'translateX(-4px)',
                  transition: 'opacity 0.18s ease, transform 0.18s ease',
                  transitionDelay: expanded ? '0.06s' : '0s',
                }}
              >
                {item.label}
              </span>

              {/* Active indicator dot */}
              {active && (
                <span
                  className="ml-auto shrink-0 w-1.5 h-1.5 rounded-full"
                  style={{
                    background: '#C17F3A',
                    opacity: expanded ? 1 : 0,
                    transition: 'opacity 0.15s ease',
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User profile */}
      <div
        className="px-2 py-3 flex items-center gap-3"
        style={{ borderTop: '1px solid rgba(180,90,40,0.13)' }}
      >
        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold uppercase shrink-0"
          style={{
            background: user ? 'rgba(193,127,58,0.18)' : 'rgba(90,56,40,0.15)',
            color: user ? '#C8956A' : '#5a3828',
            border: `1px solid ${user ? 'rgba(193,127,58,0.28)' : 'rgba(90,56,40,0.2)'}`,
            minWidth: '32px',
          }}
        >
          {user ? initial : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>

        {/* Name + email */}
        <div
          style={{
            opacity: expanded ? 1 : 0,
            transform: expanded ? 'translateX(0)' : 'translateX(-4px)',
            transition: 'opacity 0.18s ease, transform 0.18s ease',
            transitionDelay: expanded ? '0.06s' : '0s',
            overflow: 'hidden',
            minWidth: 0,
          }}
        >
          {user ? (
            <>
              <p
                className="text-sm font-semibold leading-tight truncate"
                style={{ color: '#C8956A', maxWidth: `${EXPANDED - COLLAPSED - 20}px` }}
              >
                {displayName}
              </p>
              <p
                className="text-xs leading-tight truncate mt-0.5"
                style={{ color: '#5a3828', maxWidth: `${EXPANDED - COLLAPSED - 20}px` }}
              >
                {email}
              </p>
            </>
          ) : (
            <p className="text-xs" style={{ color: '#5a3828' }}>Not signed in</p>
          )}
        </div>
      </div>
    </div>
  );
}
