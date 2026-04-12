'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSubjectColors } from '@/lib/subjectColors';
import { createClient } from '@/lib/supabase/client';

type Step = 'form' | 'classifying' | 'preview' | 'submitting';

export default function RequestForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('form');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    authorName: '',
  });

  const [classified, setClassified] = useState<{
    subject: string;
    topics: string[];
  } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        const displayName = data.user.user_metadata?.display_name || data.user.email?.split('@')[0] || '';
        if (displayName) {
          setForm(prev => ({ ...prev, authorName: displayName }));
        }
      }
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleClassify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.authorName.trim()) {
      setError('All fields are required');
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

      if (!res.ok) throw new Error('Classification failed');

      const data = await res.json();
      setClassified(data);
      setStep('preview');
    } catch {
      setError('Failed to classify your request. Please try again.');
      setStep('form');
    }
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
          authorName: form.authorName,
          subject: classified.subject,
          topics: classified.topics,
          authorId: userId || undefined,
        }),
      });

      if (!res.ok) throw new Error('Failed to create post');

      const post = await res.json();
      router.push(`/posts/${post.id}`);
    } catch {
      setError('Failed to submit your request. Please try again.');
      setStep('preview');
    }
  };

  const handleEdit = () => {
    setStep('form');
    setClassified(null);
  };

  const colors = classified ? getSubjectColors(classified.subject) : null;

  return (
    <div>
      {step === 'form' || step === 'classifying' ? (
        <form onSubmit={handleClassify} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="label" htmlFor="title">
              Request Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., Best resources to learn Calculus from scratch"
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="label" htmlFor="description">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe what you're looking for in detail. Include your current level, what specific topics you need help with, and what format you prefer (videos, articles, exercises, etc.)."
              required
              rows={6}
              className="input-field resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              The more detail you provide, the better our AI can classify your request.
            </p>
          </div>

          <div>
            <label className="label" htmlFor="authorName">
              Your Display Name *
            </label>
            <input
              id="authorName"
              name="authorName"
              type="text"
              value={form.authorName}
              onChange={handleChange}
              placeholder="How should we identify you?"
              required
              className="input-field"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={step === 'classifying'}
              className="btn-primary w-full py-3 text-base"
            >
              {step === 'classifying' ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Classifying with AI...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Classify with AI
                </span>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {/* Classification Preview */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Classification Result</h3>
                <p className="text-sm text-gray-500">Review the classification before submitting</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Subject</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${colors?.bg} ${colors?.text} ${colors?.border}`}>
                  {classified?.subject}
                </span>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Topics Identified</p>
                <div className="flex flex-wrap gap-2">
                  {classified?.topics.map((topic) => (
                    <span key={topic} className="inline-flex items-center px-2.5 py-1 rounded-full text-sm bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Your Request</p>
                <p className="text-sm font-medium text-gray-900 mb-1">{form.title}</p>
                <p className="text-sm text-gray-500 line-clamp-3">{form.description}</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleConfirm}
              disabled={step === 'submitting'}
              className="btn-primary flex-1 py-3 text-base"
            >
              {step === 'submitting' ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Publishing...
                </span>
              ) : (
                'Confirm & Publish'
              )}
            </button>
            <button
              onClick={handleEdit}
              disabled={step === 'submitting'}
              className="btn-secondary px-5"
            >
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
