'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { requestCustomerOtp, verifyCustomerOtp } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

// Fields we collect now but will persist to the backend later
// (via a future PATCH /auth/me endpoint — see the marked TODO below).
interface ProfileDraft {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  pincode: string;
}

const EMPTY: ProfileDraft = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  pincode: '',
};

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [form, setForm] = useState<ProfileDraft>(EMPTY);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const update =
    (field: keyof ProfileDraft) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  function validateDetails(): string | null {
    if (!form.fullName.trim()) return 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      return 'Please enter a valid email address.';
    if (!/^[0-9]{10}$/.test(form.phone.trim()))
      return 'Please enter a valid 10-digit phone number.';
    if (!form.address.trim()) return 'Please enter your address.';
    if (!/^[0-9]{6}$/.test(form.pincode.trim()))
      return 'Please enter a valid 6-digit pincode.';
    return null;
  }

  async function handleDetailsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const msg = validateDetails();
    if (msg) {
      setError(msg);
      return;
    }
    setLoading(true);
    try {
      await requestCustomerOtp(form.email.trim());
      setInfo(`We sent a 6-digit code to ${form.email.trim()}.`);
      setStep('otp');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not send code. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await verifyCustomerOtp(form.email.trim(), otp.trim());

      // TODO (backend later): once PATCH /auth/me exists, persist the
      // collected profile fields here before logging in, e.g.
      //   await updateMyProfile(res.accessToken, {
      //     fullName: form.fullName,
      //     phone: form.phone,
      //     address: form.address,
      //     pincode: form.pincode,
      //   });
      // For now the extra fields are validated and collected only.

      login(res.accessToken, res.user);
      router.push('/');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Invalid or expired code. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-tint/40 px-4 py-24">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-soft">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-ink">Create your account</h1>
          <p className="mt-1 text-sm text-ink/60">
            {step === 'details'
              ? 'Tell us a bit about you to get started.'
              : 'Enter the code we emailed you to finish.'}
          </p>
        </div>

        {/* Placeholder note — profile saving wired up later */}
        <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          Your name, phone, and address are collected now. Saving them to your
          profile will be enabled shortly — for now, registering signs you in via
          email verification.
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {info && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {info}
          </div>
        )}

        {step === 'details' ? (
          <form onSubmit={handleDetailsSubmit} className="space-y-4">
            <Field
              label="Full name"
              value={form.fullName}
              onChange={update('fullName')}
              placeholder="Priya Sharma"
              autoFocus
            />
            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={update('email')}
              placeholder="you@example.com"
            />
            <Field
              label="Phone"
              type="tel"
              value={form.phone}
              onChange={update('phone')}
              placeholder="9876543210"
              inputMode="numeric"
              maxLength={10}
            />
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">
                Address
              </label>
              <textarea
                value={form.address}
                onChange={update('address')}
                placeholder="Flat / House no, street, area"
                rows={2}
                className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <Field
              label="Pincode"
              value={form.pincode}
              onChange={update('pincode')}
              placeholder="500001"
              inputMode="numeric"
              maxLength={6}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-dark active:scale-95 disabled:opacity-60"
            >
              {loading ? 'Sending code…' : 'Continue'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <Field
              label="6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              inputMode="numeric"
              maxLength={6}
              autoFocus
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-dark active:scale-95 disabled:opacity-60"
            >
              {loading ? 'Verifying…' : 'Verify & create account'}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('details');
                setOtp('');
                setError(null);
                setInfo(null);
              }}
              className="w-full text-center text-sm font-medium text-brand hover:underline"
            >
              ← Change details
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-ink/60">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-brand hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ink">{label}</label>
      <input
        {...props}
        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
    </div>
  );
}
