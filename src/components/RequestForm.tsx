'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { getSubjectColors } from '@/lib/subjectColors';

type Step = 'form' | 'classifying' | 'tags' | 'similar' | 'submitting';

const DRAFT_KEY = 'studyhub_request_draft';

const SUBJECT_OPTIONS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
  'Data Science', 'Engineering Mechanics', 'Psychology', 'Economics',
  'Statistics', 'Machine Learning', 'Electrical Engineering',
  'History', 'Literature', 'Philosophy', 'Finance',
  'Accounting', 'Business', 'Medicine', 'Law',
];

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '0.875rem',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(180,90,40,0.18)',
  color: '#E8D5C0', outline: 'none', transition: 'all 0.15s',
};

interface SimilarPost {
  id: string;
  title: string;
  description: string;
  subject: string;
  topics: string;
  author_name: string;
  created_at: string;
  resources: { count: number }[];
}

export default function RequestForm() {
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const [step, setStep] = useState<Step>('form');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', description: '' });
  const [classified, setClassified] = useState<{ subject: string; topics: string[] } | null>(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [similarPosts, setSimilarPosts] = useState<SimilarPost[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  // Restore draft from sessionStorage
  useEffect(() => {
    try {
      const draft = sessionStorage.getItem(DRAFT_KEY);
      if (draft) {
        const parsed = JSON.parse(draft);
        setForm({ title: parsed.title || '', description: parsed.description || '' });
        if (parsed.classified) {
          setClassified(parsed.classified);
          setSelectedTopics(parsed.selectedTopics || []);
          setStep(parsed.step === 'similar' ? 'similar' : 'tags');
          if (parsed.similarPosts) setSimilarPosts(parsed.similarPosts);
        }
      }
    } catch { /* ignore */ }
  }, []);

  // Save draft to sessionStorage on changes
  useEffect(() => {
    if (step === 'form' || step === 'tags' || step === 'similar') {
      try {
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify({
          title: form.title, description: form.description,
          classified, selectedTopics, step, similarPosts,
        }));
      } catch { /* ignore */ }
    }
  }, [form, classified, selectedTopics, step, similarPosts]);

  const clearDraft = () => {
    try { sessionStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
  };

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
    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and description are required');
      return;
    }
    setStep('classifying');
    setError('');
    try {
      const res = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: form.title, description: form.description }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      // Limit to max 5 tags
      const topics = (data.topics || []).slice(0, 5);
      setClassified({ subject: data.subject, topics });
      setSelectedSubject(data.subject);
      setSelectedTopics([]); // Start deselected — user picks what applies
      setStep('tags');
    } catch {
      setError('Failed to classify your request. Please try again.');
      setStep('form');
    }
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const handleFindSimilar = async () => {
    if (selectedTopics.length === 0) {
      setError('Select at least one tag');
      return;
    }
    setLoadingSimilar(true);
    setError('');
    try {
      const query = selectedTopics.join(',');
      const res = await fetch(`/api/posts?topics=${encodeURIComponent(query)}`);
      if (res.ok) {
        const posts = await res.json();
        setSimilarPosts(posts);
      }
    } catch { /* ignore */ }
    setLoadingSimilar(false);
    setStep('similar');
  };

  const handleConfirm = async () => {
    if (!classified) return;
    setStep('submitting');
    setError('');
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          subject: selectedSubject,
          topics: selectedTopics,
        }),
      });
      if (!res.ok) throw new Error();
      const post = await res.json();
      clearDraft();
      router.push(`/posts/${post.id}`);
    } catch {
      setError('Failed to submit your request. Please try again.');
      setStep('similar');
    }
  };

  const colors = selectedSubject ? getSubjectColors(selectedSubject) : null;

  const Spinner = () => (
    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );

  // Step 1: Form
  if (step === 'form' || step === 'classifying') {
    return (
      <form onSubmit={handleClassify} className="rounded-2xl p-6 space-y-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(180,90,40,0.18)', backdropFilter: 'blur(12px)' }}>
        {isSignedIn && user && (
          <div className="flex items-center gap-2 text-xs" style={{ color: '#9A7A62' }}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Posting as <span style={{ color: '#C8956A' }}>{user.username || user.firstName || 'User'}</span>
          </div>
        )}

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

  // Step 2: Tag selection
  if (step === 'tags') {
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
              <p className="text-xs mt-0.5" style={{ color: '#9A7A62' }}>Select the tags that apply to your request (max 5)</p>
            </div>
          </div>

          {/* Subject Selection */}
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#5a3828' }}>
              Subject <span className="normal-case font-normal">— AI suggested: <span style={{ color: '#C8956A' }}>{classified?.subject}</span></span>
            </p>
            <div className="flex flex-wrap gap-2">
              {/* Ensure AI subject is first if not in the list */}
              {Array.from(new Set([classified?.subject || '', ...SUBJECT_OPTIONS])).filter(Boolean).map(subj => {
                const isSelected = selectedSubject === subj;
                const subjColors = getSubjectColors(subj);
                return (
                  <button
                    key={subj}
                    onClick={() => setSelectedSubject(subj)}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150"
                    style={isSelected
                      ? subjColors.style
                      : { background: 'rgba(255,255,255,0.03)', color: '#5a3828', border: '1px solid rgba(180,90,40,0.15)' }
                    }
                  >
                    {isSelected && <span className="mr-1">✓</span>}
                    {subj}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selectable Topics */}
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#5a3828' }}>
              Topics <span className="normal-case font-normal">— tap to toggle ({selectedTopics.length}/5 selected)</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {classified?.topics.map(topic => {
                const isSelected = selectedTopics.includes(topic);
                return (
                  <button
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150"
                    style={{
                      background: isSelected ? 'rgba(193,127,58,0.15)' : 'rgba(255,255,255,0.03)',
                      color: isSelected ? '#C8956A' : '#5a3828',
                      border: `1px solid ${isSelected ? 'rgba(193,127,58,0.4)' : 'rgba(180,90,40,0.15)'}`,
                    }}
                  >
                    {isSelected && <span className="mr-1">✓</span>}
                    {topic}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Request Preview */}
          <div className="pt-3" style={{ borderTop: '1px solid rgba(180,90,40,0.12)' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#5a3828' }}>Your Request</p>
            <p className="text-sm font-semibold mb-1" style={{ color: '#C8956A', fontFamily: 'Syne, sans-serif' }}>{form.title}</p>
            <p className="text-xs line-clamp-3" style={{ color: '#9A7A62' }}>{form.description}</p>
          </div>
        </div>

        {error && <div className="p-3 rounded-xl text-xs" style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}

        <div className="flex gap-3">
          <button
            onClick={handleFindSimilar}
            disabled={loadingSimilar}
            className="btn-primary flex-1 py-3"
          >
            {loadingSimilar ? (
              <span className="flex items-center justify-center gap-2"><Spinner /> Finding similar...</span>
            ) : (
              'Continue'
            )}
          </button>
          <button onClick={() => { setStep('form'); setClassified(null); setSelectedSubject(''); setSelectedTopics([]); }} className="btn-secondary px-5">
            Edit
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Similar posts + confirm
  if (step === 'similar' || step === 'submitting') {
    return (
      <div className="space-y-4">
        {/* Similar posts section */}
        {similarPosts.length > 0 && (
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(180,90,40,0.18)', backdropFilter: 'blur(12px)' }}>
            <h3 className="font-bold mb-1" style={{ fontFamily: 'Syne, sans-serif', color: '#C8956A' }}>
              Similar Existing Requests
            </h3>
            <p className="text-xs mb-4" style={{ color: '#9A7A62' }}>
              Check if someone already asked for what you need. Your draft is saved.
            </p>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(193,127,58,0.3) transparent' }}>
              {similarPosts.map((post) => {
                const postColors = getSubjectColors(post.subject);
                let postTopics: string[] = [];
                try { postTopics = JSON.parse(post.topics); } catch { postTopics = []; }
                return (
                  <a
                    key={post.id}
                    href={`/posts/${post.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group rounded-2xl p-5 transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(180,90,40,0.18)' }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold" style={postColors.style}>
                        {post.subject}
                      </span>
                      <div className="flex items-center gap-1 text-xs shrink-0" style={{ color: '#5a3828' }}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span>{post.resources?.[0]?.count ?? 0} resources</span>
                      </div>
                    </div>
                    <h3 className="font-semibold mb-1 line-clamp-2" style={{ fontFamily: 'Syne, sans-serif', color: '#C8956A' }}>{post.title}</h3>
                    <p className="text-sm mb-2 line-clamp-2" style={{ color: '#9A7A62' }}>{post.description}</p>
                    {postTopics.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {postTopics.slice(0, 3).map(t => (
                          <span key={t} className="px-2 py-0.5 rounded-lg text-xs" style={{ background: 'rgba(193,127,58,0.08)', color: '#9A7A62', border: '1px solid rgba(180,90,40,0.15)' }}>{t}</span>
                        ))}
                        {postTopics.length > 3 && <span className="px-2 py-0.5 rounded-lg text-xs" style={{ background: 'rgba(255,255,255,0.04)', color: '#5a3828' }}>+{postTopics.length - 3}</span>}
                      </div>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {similarPosts.length === 0 && (
          <div className="rounded-2xl p-6 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(180,90,40,0.2)' }}>
            <p className="text-sm font-medium mb-1" style={{ color: '#9A7A62' }}>No similar requests found</p>
            <p className="text-xs" style={{ color: '#5a3828' }}>Looks like your request is unique! Go ahead and publish it.</p>
          </div>
        )}

        {/* Confirm section */}
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(180,90,40,0.18)' }}>
          <p className="text-sm font-semibold mb-1" style={{ color: '#C8956A', fontFamily: 'Syne, sans-serif' }}>{form.title}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold" style={colors?.style}>{selectedSubject}</span>
            {selectedTopics.map(t => (
              <span key={t} className="px-2 py-0.5 rounded-full text-xs" style={{ background: 'rgba(193,127,58,0.1)', color: '#C8956A', border: '1px solid rgba(193,127,58,0.22)' }}>{t}</span>
            ))}
          </div>
        </div>

        {error && <div className="p-3 rounded-xl text-xs" style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}

        <div className="flex gap-3">
          <button onClick={handleConfirm} disabled={step === 'submitting'} className="btn-primary flex-1 py-3">
            {step === 'submitting' ? (
              <span className="flex items-center justify-center gap-2"><Spinner /> Publishing...</span>
            ) : 'Confirm & Publish'}
          </button>
          <button onClick={() => setStep('tags')} disabled={step === 'submitting'} className="btn-secondary px-5">
            Back
          </button>
        </div>
      </div>
    );
  }

  return null;
}
