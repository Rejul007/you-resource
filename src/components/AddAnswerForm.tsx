'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

type Step = 'idle' | 'link' | 'language' | 'price' | 'type' | 'comment' | 'posting';

const LANGUAGES = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Portuguese', 'Russian', 'Other'];
const PRICES = ['Free', 'Paid'];
const TYPES = ['Link', 'Video', 'PDF', 'Article', 'Course', 'Book', 'Other'];

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '0.875rem',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(180,90,40,0.18)',
  color: '#E8D5C0', outline: 'none', transition: 'all 0.15s',
};

const chipBase: React.CSSProperties = {
  padding: '6px 14px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500,
  cursor: 'pointer', transition: 'all 0.15s', border: '1px solid rgba(180,90,40,0.2)',
  background: 'rgba(255,255,255,0.03)', color: '#9A7A62',
};

const chipSelected: React.CSSProperties = {
  ...chipBase,
  background: 'rgba(193,127,58,0.15)', color: '#C8956A', border: '1px solid rgba(193,127,58,0.4)',
};

export default function AddAnswerForm({ postId, onResourceAdded }: { postId: string; onResourceAdded?: () => void }) {
  const { isSignedIn } = useUser();
  const [step, setStep] = useState<Step>('idle');
  const [url, setUrl] = useState('');
  const [language, setLanguage] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('Link');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const reset = () => {
    setStep('idle');
    setUrl('');
    setLanguage('');
    setPrice('');
    setType('Link');
    setComment('');
    setError('');
  };

  const handlePost = async () => {
    setStep('posting');
    setError('');
    try {
      const res = await fetch(`/api/posts/${postId}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, language, price, type, description: comment }),
      });
      if (!res.ok) throw new Error();
      reset();
      onResourceAdded?.();
    } catch {
      setError('Failed to post your answer. Please try again.');
      setStep('comment');
    }
  };

  if (!isSignedIn) {
    return (
      <div className="rounded-xl p-4 text-center text-xs" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(180,90,40,0.2)', color: '#5a3828' }}>
        Sign in to share a resource
      </div>
    );
  }

  if (step === 'idle') {
    return (
      <button
        onClick={() => setStep('link')}
        className="w-full rounded-xl p-3 text-sm font-medium transition-all duration-150 flex items-center justify-center gap-2"
        style={{ background: 'rgba(193,127,58,0.08)', border: '1px solid rgba(193,127,58,0.22)', color: '#C8956A' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(193,127,58,0.15)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(193,127,58,0.08)'; }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Share a Resource
      </button>
    );
  }

  const StepIndicator = ({ current }: { current: number }) => (
    <div className="flex items-center gap-1.5 mb-4">
      {['Link', 'Language', 'Price', 'Type', 'Comment'].map((label, i) => (
        <div key={label} className="flex items-center gap-1.5">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{
              background: i < current ? 'rgba(16,185,129,0.15)' : i === current ? 'rgba(193,127,58,0.2)' : 'rgba(255,255,255,0.05)',
              color: i < current ? '#6ee7b7' : i === current ? '#C8956A' : '#5a3828',
              border: `1px solid ${i < current ? 'rgba(16,185,129,0.3)' : i === current ? 'rgba(193,127,58,0.4)' : 'rgba(180,90,40,0.12)'}`,
            }}
          >
            {i < current ? '✓' : i + 1}
          </div>
          {i < 4 && <div className="w-4 h-px" style={{ background: i < current ? 'rgba(16,185,129,0.3)' : 'rgba(180,90,40,0.12)' }} />}
        </div>
      ))}
    </div>
  );

  const stepIndex = { link: 0, language: 1, price: 2, type: 3, comment: 4, posting: 4 }[step] ?? 0;

  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(180,90,40,0.18)' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold" style={{ color: '#C8956A', fontFamily: 'Syne, sans-serif' }}>Share a Resource</h3>
        <button onClick={reset} className="text-xs transition-colors" style={{ color: '#5a3828' }} onMouseEnter={e => e.currentTarget.style.color = '#9A7A62'} onMouseLeave={e => e.currentTarget.style.color = '#5a3828'}>
          Cancel
        </button>
      </div>

      <StepIndicator current={stepIndex} />

      {error && (
        <div className="p-2.5 rounded-lg text-xs mb-3" style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' }}>
          {error}
        </div>
      )}

      {/* Step 1: Link */}
      {step === 'link' && (
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: '#9A7A62' }}>Resource URL *</label>
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com/resource"
            style={inputStyle}
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter' && url.trim()) setStep('language'); }}
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={() => url.trim() && setStep('language')}
              disabled={!url.trim()}
              className="btn-primary text-xs px-4 py-2 disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Language */}
      {step === 'language' && (
        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: '#9A7A62' }}>Language *</label>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map(lang => (
              <button
                key={lang}
                onClick={() => { setLanguage(lang); setStep('price'); }}
                style={language === lang ? chipSelected : chipBase}
                onMouseEnter={e => { if (language !== lang) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { if (language !== lang) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
              >
                {lang}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-3">
            <button onClick={() => setStep('link')} className="text-xs" style={{ color: '#9A7A62' }}>← Back</button>
          </div>
        </div>
      )}

      {/* Step 3: Price */}
      {step === 'price' && (
        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: '#9A7A62' }}>Price *</label>
          <div className="flex flex-wrap gap-2">
            {PRICES.map(p => (
              <button
                key={p}
                onClick={() => { setPrice(p); setStep('type'); }}
                style={price === p ? chipSelected : chipBase}
                onMouseEnter={e => { if (price !== p) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { if (price !== p) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-3">
            <button onClick={() => setStep('language')} className="text-xs" style={{ color: '#9A7A62' }}>← Back</button>
          </div>
        </div>
      )}

      {/* Step 4: Type */}
      {step === 'type' && (
        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: '#9A7A62' }}>Resource Type</label>
          <div className="flex flex-wrap gap-2">
            {TYPES.map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                style={type === t ? chipSelected : chipBase}
                onMouseEnter={e => { if (type !== t) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { if (type !== t) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-3">
            <button onClick={() => setStep('price')} className="text-xs" style={{ color: '#9A7A62' }}>← Back</button>
            <button onClick={() => setStep('comment')} className="btn-primary text-xs px-4 py-2">Next →</button>
          </div>
        </div>
      )}

      {/* Step 5: Comment */}
      {(step === 'comment' || step === 'posting') && (
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: '#9A7A62' }}>Comment (optional)</label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Any additional notes about this resource..."
            rows={3}
            style={{ ...inputStyle, resize: 'none' }}
          />

          {/* Preview */}
          <div className="mt-3 p-3 rounded-lg text-xs space-y-1" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(180,90,40,0.1)' }}>
            <p style={{ color: '#5a3828' }}>Preview:</p>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 rounded-full" style={{ background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)' }}>{language}</span>
              <span className="px-2 py-0.5 rounded-full" style={{ background: price === 'Free' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: price === 'Free' ? '#6ee7b7' : '#fca5a5', border: `1px solid ${price === 'Free' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}` }}>{price}</span>
              {type !== 'Link' && <span className="px-2 py-0.5 rounded-full" style={{ background: 'rgba(193,127,58,0.1)', color: '#C8956A', border: '1px solid rgba(193,127,58,0.2)' }}>{type}</span>}
            </div>
            <p className="break-all" style={{ color: '#818cf8' }}>{url}</p>
            {comment && <p style={{ color: '#9A7A62' }}>{comment}</p>}
          </div>

          <div className="flex justify-between mt-3">
            <button onClick={() => setStep('type')} className="text-xs" style={{ color: '#9A7A62' }}>← Back</button>
            <button
              onClick={handlePost}
              disabled={step === 'posting'}
              className="btn-primary text-xs px-5 py-2 disabled:opacity-50"
            >
              {step === 'posting' ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Posting...
                </span>
              ) : 'Post Answer'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
