'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface AddResourceFormProps {
  postId: string;
}

export default function AddResourceForm({ postId }: AddResourceFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [form, setForm] = useState({
    url: '',
    title: '',
    description: '',
    language: 'English',
    price: 'Free',
    type: 'Article',
    submittedBy: '',
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        const displayName = data.user.user_metadata?.display_name || data.user.email?.split('@')[0] || '';
        if (displayName) {
          setForm(prev => ({ ...prev, submittedBy: displayName }));
        }
      }
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
        body: JSON.stringify({
          ...form,
          submittedById: userId || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add resource');
      }

      setSuccess(true);
      setForm({
        url: '',
        title: '',
        description: '',
        language: 'English',
        price: 'Free',
        type: 'Article',
        submittedBy: '',
      });
      router.refresh();
      setTimeout(() => {
        setSuccess(false);
        setOpen(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900">Share a Resource</span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-gray-200 p-5">
          {success ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg text-green-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Resource added successfully!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="label">URL *</label>
                <input
                  type="url"
                  name="url"
                  value={form.url}
                  onChange={handleChange}
                  placeholder="https://..."
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Resource title"
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Description *</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Brief description of this resource..."
                  required
                  rows={3}
                  className="input-field resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="label">Language</label>
                  <select name="language" value={form.language} onChange={handleChange} className="input-field">
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                    <option>Portuguese</option>
                    <option>Chinese</option>
                    <option>Japanese</option>
                    <option>Arabic</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="label">Price</label>
                  <select name="price" value={form.price} onChange={handleChange} className="input-field">
                    <option>Free</option>
                    <option>Freemium</option>
                    <option>Paid</option>
                  </select>
                </div>
                <div>
                  <label className="label">Type</label>
                  <select name="type" value={form.type} onChange={handleChange} className="input-field">
                    <option>Article</option>
                    <option>Video</option>
                    <option>Book</option>
                    <option>Course</option>
                    <option>PDF</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Your Name *</label>
                <input
                  type="text"
                  name="submittedBy"
                  value={form.submittedBy}
                  onChange={handleChange}
                  placeholder="Display name"
                  required
                  className="input-field"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  {loading ? 'Submitting...' : 'Submit Resource'}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="btn-secondary"
                >
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
