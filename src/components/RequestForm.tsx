'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSubjectColors } from '@/lib/subjectColors';
import { createClient } from '@/lib/supabase/client';

type Step = 'form' | 'classifying' | 'preview' | 'submitting';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '0.875rem',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(180,90,40,0.18)',
  color: '#E8D5C0', outline: 'none', transition: 'all 0.15s',
};

export default function RequestForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('form');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', description: '', authorName: '' });
  const [classified, setClassified] = useState<{ subject: string; topics: string[] } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        const name = data.user.user_metadata?.display_name || data.user.email?.split('@')[0] || '';
        if (name) setForm(prev => ({ ...prev, authorName: name }));
      }
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = 'rgba(193,127,58,0.55)';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(193,127,58,0.1)';
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = 'rgba(180,90,40,0.18)';
    e.currentTarget.style.boxShadow = 'none';
  };

  const handleClassify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.authorName.trim()) { setError('All fields are required'); return; }
    setStep('classifying'); setError('');
    try {
      const res = await fetch('/api/classify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: form.title, description: form.description }) });
      if (!res.ok) throw new Error();
      setClassified(await res.json());
      setStep('preview');
    } catch { setError('Failed to classify your request. Please try again.'); setStep('form'); }
  };

  const handleConfirm = async () => {
    if (!classified) return;
    setStep('submitting'); setError('');
    try {
      const res = await fetch('/api/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, subject: classified.subject, topics: classified.topics, authorId: userId || undefined }) });
      if (!res.ok) throw new Error();
      const post = await res.json();
      router.push(`/posts/${post.id}`);
    } catch { setError('Failed to submit your request. Please try again.'); setStep('preview'); }
  };

  const colors = classified ? getSubjectColors(classified.subject) : null;
  const Spinner = () => (
    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );

  if (step === 'form' || step === 'classifying') {
    return (
      <form onSubmit={handleClassify} className="rounded-2xl p-6 space-y-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(180,90,40,0.18)', backdropFilter: 'blur(12px)' }}>
        {error && <div className="p-3 rounded-xl text-xs" style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}

        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: '#9A7A62' }}>Request Title *</label>
          <input name="title" type="text" value={form.title} onChange={handleChange} placeholder="e.g., Best resources to learn Calculus from scratch" required style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: '#9A7A62' }}>Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe what you're looking for in detail. Include your current level, what specific topics you need help with, and what format you prefer..." required rows={6} style={{ ...inputStyle, resize: 'none' }} onFocus={focusStyle} onBlur={blurStyle} />
          <p className="text-xs mt-1.5" style={{ color: '#5a3828' }}>The more detail you provide, the better our AI can classify your request.</p>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: '#9A7A62' }}>Your Display Name *</label>
          <input name="authorName" type="text" value={form.authorName} onChange={handleChange} placeholder="How should we identify you?" required style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
        </div>

        <button type="submit" disabled={step === 'classifying'} className="btn-primary w-full py-3">
          {step === 'classifying' ? (
            <span className="flex items-center justify-center gap-2"><Spinner /> Classifying with AI...</span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Classify with AI
            </span>
          )}
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(180,90,40,0.18)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-start gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #D4923F, #C17F3A)', boxShadow: '0 4px 16px rgba(193,127,58,0.35)' }}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#C8956A' }}>AI Classification Result</h3>
            <p className="text-xs mt-0.5" style={{ color: '#9A7A62' }}>Review before submitting</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#5a3828' }}>Subject</p>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold" style={colors?.style}>
              {classified?.subject}
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#5a3828' }}>Topics Identified</p>
            <div className="flex flex-wrap gap-2">
              {classified?.topics.map(topic => (
                <span key={topic} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(193,127,58,0.1)', color: '#C8956A', border: '1px solid rgba(193,127,58,0.22)' }}>
                  {topic}
                </span>
              ))}
            </div>
          </div>
          <div className="pt-3" style={{ borderTop: '1px solid rgba(180,90,40,0.12)' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#5a3828' }}>Your Request</p>
            <p className="text-sm font-semibold mb-1" style={{ color: '#C8956A', fontFamily: 'Syne, sans-serif' }}>{form.title}</p>
            <p className="text-xs line-clamp-3" style={{ color: '#9A7A62' }}>{form.description}</p>
          </div>
        </div>
      </div>

      {error && <div className="p-3 rounded-xl text-xs" style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}

      <div className="flex gap-3">
        <button onClick={handleConfirm} disabled={step === 'submitting'} className="btn-primary flex-1 py-3">
          {step === 'submitting' ? <span className="flex items-center justify-center gap-2"><Spinner /> Publishing...</span> : 'Confirm & Publish'}
        </button>
        <button onClick={() => { setStep('form'); setClassified(null); }} disabled={step === 'submitting'} className="btn-secondary px-5">
          Edit
        </button>
      </div>
    </div>
  );
}
