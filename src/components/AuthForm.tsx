'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '0.875rem',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(180,90,40,0.2)',
  color: '#E8D5C0', outline: 'none', transition: 'all 0.15s',
};

export default function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(''); setMessage('');

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { display_name: displayName } } });
      if (error) { setError(error.message); setLoading(false); return; }
      setMessage('Check your email to confirm your account!');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      router.push('/'); router.refresh();
    }
    setLoading(false);
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'rgba(193,127,58,0.55)';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(193,127,58,0.1)';
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'rgba(180,90,40,0.2)';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(180,90,40,0.2)', backdropFilter: 'blur(16px)', boxShadow: '0 16px 60px rgba(0,0,0,0.5)' }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #D4923F, #C17F3A)', boxShadow: '0 4px 20px rgba(193,127,58,0.4)' }}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#C8956A' }}>
            {mode === 'login' ? 'Welcome back' : 'Join StudyHub'}
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#9A7A62' }}>
            {mode === 'login' ? 'Sign in to your account' : 'Create your account to get started'}
          </p>
        </div>

        {error && <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}
        {message && <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(16,185,129,0.1)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.2)' }}>{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#9A7A62' }}>Display Name *</label>
              <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="How others will see you" required style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </div>
          )}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#9A7A62' }}>Email *</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#9A7A62' }}>Password *</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'} required minLength={6} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: '#9A7A62' }}>
          {mode === 'login' ? (
            <>Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="font-semibold transition-colors" style={{ color: '#C8956A' }}>Sign up</Link>
            </>
          ) : (
            <>Already have an account?{' '}
              <Link href="/auth/login" className="font-semibold transition-colors" style={{ color: '#C8956A' }}>Sign in</Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
