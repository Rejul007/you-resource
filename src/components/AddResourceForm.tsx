'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: '10px',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(180,90,40,0.18)',
  color: '#E8D5C0', fontSize: '0.875rem', outline: 'none', transition: 'all 0.15s',
};

const selectStyle: React.CSSProperties = { ...inputStyle, cursor: 'pointer', backgroundColor: '#1a0c06' };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: '#9A7A62' }}>{label}</label>
      {children}
    </div>
  );
}

export default function AddResourceForm({ postId }: { postId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [form, setForm] = useState({
    url: '', title: '', description: '', language: 'English', price: 'Free', type: 'Article', submittedBy: '',
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        const name = data.user.user_metadata?.display_name || data.user.email?.split('@')[0] || '';
        if (name) setForm(prev => ({ ...prev, submittedBy: name }));
      }
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/posts/${postId}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, submittedById: userId || undefined }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed'); }
      setSuccess(true);
      setForm({ url: '', title: '', description: '', language: 'English', price: 'Free', type: 'Article', submittedBy: '' });
      router.refresh();
      setTimeout(() => { setSuccess(false); setOpen(false); }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(180,90,40,0.18)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-all duration-150"
        style={{ background: 'transparent' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(193,127,58,0.05)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4923F, #C17F3A)' }}>
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="font-semibold text-sm" style={{ color: '#C8956A', fontFamily: 'Syne, sans-serif' }}>Share a Resource</span>
        </div>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          style={{ color: '#5a3828' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="p-5" style={{ borderTop: '1px solid rgba(180,90,40,0.12)' }}>
          {success ? (
            <div className="flex items-center gap-3 p-4 rounded-xl text-sm" style={{ background: 'rgba(16,185,129,0.1)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.2)' }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Resource added successfully!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl text-xs" style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' }}>
                  {error}
                </div>
              )}
              <Field label="URL *">
                <input type="url" name="url" value={form.url} onChange={handleChange} placeholder="https://..." required style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(193,127,58,0.55)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(193,127,58,0.1)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(180,90,40,0.18)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </Field>
              <Field label="Title *">
                <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Resource title" required style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(193,127,58,0.55)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(193,127,58,0.1)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(180,90,40,0.18)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </Field>
              <Field label="Description *">
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Brief description..." required rows={3}
                  style={{ ...inputStyle, resize: 'none' }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(193,127,58,0.55)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(193,127,58,0.1)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(180,90,40,0.18)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </Field>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Language">
                  <select name="language" value={form.language} onChange={handleChange} style={selectStyle}>
                    {['English','Hindi','Spanish','French','German','Portuguese','Chinese','Japanese','Arabic','Other'].map(l => <option key={l}>{l}</option>)}
                  </select>
                </Field>
                <Field label="Price">
                  <select name="price" value={form.price} onChange={handleChange} style={selectStyle}>
                    {['Free','Freemium','Paid'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </Field>
                <Field label="Type">
                  <select name="type" value={form.type} onChange={handleChange} style={selectStyle}>
                    {['Article','Video','Book','Course','PDF','Other'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Your Name *">
                <input type="text" name="submittedBy" value={form.submittedBy} onChange={handleChange} placeholder="Display name" required style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(193,127,58,0.55)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(193,127,58,0.1)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(180,90,40,0.18)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </Field>
              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={loading} className="btn-primary flex-1 text-sm">
                  {loading ? 'Submitting...' : 'Submit Resource'}
                </button>
                <button type="button" onClick={() => setOpen(false)} className="btn-secondary text-sm px-4">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
