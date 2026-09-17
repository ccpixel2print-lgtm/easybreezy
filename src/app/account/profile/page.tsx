'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { updateMe } from '@/lib/api';

export default function AccountProfilePage() {
  const { user, token, loading, login } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect unauthenticated visitors once auth has resolved.
  useEffect(() => {
    if (!loading && !token) router.replace('/login');
  }, [loading, token, router]);

  // Seed the form from the current user.
  useEffect(() => {
    if (user) {
      setFullName(user.fullName ?? '');
      setPhone(user.phone ?? '');
    }
  }, [user]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setError(null);
    setSaved(false);
    setSaving(true);
    try {
      const updated = await updateMe(token, {
        fullName: fullName.trim(),
        phone: phone.trim(),
      });
      // Refresh the context user (keep the same token).
      login(token, updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update your profile.');
    } finally {
      setSaving(false);
    }
  }

  if (loading || !user) {
    return (
      <main className="mx-auto max-w-2xl px-4 pb-16 pt-28 sm:px-6">
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 pb-16 pt-28 sm:px-6">
      <h1 className="text-2xl font-bold text-ink">My Profile</h1>
      <p className="mt-1 text-sm text-ink/60">Update your name and contact number.</p>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="mt-6 space-y-5 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-black/5">
        <div>
          <label className="text-sm font-semibold text-ink">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-ink/60"
          />
          <p className="mt-1 text-xs text-ink/40">Email can&apos;t be changed.</p>
        </div>
        <div>
          <label className="text-sm font-semibold text-ink">Full name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
            className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-ink">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="10-digit mobile number"
            className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
          />
        </div>
        <div className="flex items-center gap-3 border-t border-gray-100 pt-5">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          {saved && <span className="text-sm font-medium text-green-600">Saved ✓</span>}
        </div>
      </form>
    </main>
  );
}
