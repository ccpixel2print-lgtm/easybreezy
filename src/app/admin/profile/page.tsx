'use client';

import { useEffect, useState } from 'react';
import { useStaffAuth } from '@/context/StaffAuthContext';
import { updateStaffMe, StaffAuthError } from '@/lib/staffApi';


export default function StaffProfilePage() {
  const { staff, token, login, logout } = useStaffAuth();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Seed the form from the current staff profile once it's loaded.
  useEffect(() => {
    if (staff) {
      setFullName(staff.fullName ?? '');
      setPhone(staff.phone ?? '');
    }
  }, [staff]);

  // Enable Save only when something actually changed and name is non-empty.
  const dirty =
    staff != null &&
    (fullName.trim() !== (staff.fullName ?? '').trim() ||
      phone.trim() !== (staff.phone ?? '').trim());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    const name = fullName.trim();
    if (!name) {
      setError('Name is required.');
      return;
    }
    if (name.length > 120) {
      setError('Name must be 120 characters or fewer.');
      return;
    }
    const trimmedPhone = phone.trim();
    // Matches backend rule: optional, digits (+ optional leading +), 7-15 digits.
    if (trimmedPhone && !/^[+]?\d{7,15}$/.test(trimmedPhone)) {
      setError('Enter a valid phone number (7-15 digits, optional leading +).');
      return;
    }

    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const updated = await updateStaffMe(token, {
        fullName: name,
        // Send empty string to clear the phone (backend treats '' as clear).
        phone: trimmedPhone,
      });
      // Refresh the context so the topbar/name updates without a reload.
      login(token, updated);
      setSaved(true);
    } catch (err) {
      if (err instanceof StaffAuthError) return logout();
      setError(err instanceof Error ? err.message : 'Could not save profile.');
    } finally {
      setSaving(false);
    }
  }

  if (!staff) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">My Profile</h1>
        <p className="mt-1 text-sm text-ink/60">
          Update your name and phone number.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-black/5"
      >
        {/* Read-only identity */}
        <div>
          <label className="block text-sm font-medium text-ink/70">Email</label>
          <p className="mt-1 text-sm text-ink">{staff.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-ink/70">Role</label>
          <p className="mt-1 text-sm text-ink">{staff.role}</p>
        </div>

        {/* Editable fields */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-ink/70">
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              setSaved(false);
            }}
            maxLength={120}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-ink/70">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setSaved(false);
            }}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            placeholder="e.g. +919876543210"
          />
          <p className="mt-1 text-xs text-ink/50">
            Leave blank to remove your phone number.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
            {error}
          </div>
        )}
        {saved && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-700">
            Profile updated.
          </div>
        )}

        <button
          type="submit"
          disabled={saving || !dirty}
          className="rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
