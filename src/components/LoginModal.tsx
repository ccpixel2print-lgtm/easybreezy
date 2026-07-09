'use client';

import { useState } from 'react';
import { requestCustomerOtp, verifyCustomerOtp } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { login } = useAuth();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  if (!open) return null;

  const reset = () => {
    setStep('email');
    setEmail('');
    setCode('');
    setError('');
    setInfo('');
    setLoading(false);
  };

  const close = () => {
    reset();
    onClose();
  };

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await requestCustomerOtp(email.trim());
      setStep('otp');
      setInfo(`We sent a 6-digit code to ${email.trim()}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await verifyCustomerOtp(email.trim(), code.trim());
      login(res.accessToken, res.user);
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-card sm:p-8">
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-ink/60 transition hover:bg-cloud hover:text-ink"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-extrabold text-brand">
          {step === 'email' ? 'Welcome back' : 'Enter your code'}
        </h2>
        <p className="mt-1 text-sm text-ink/70">
          {step === 'email'
            ? 'Log in or sign up with your email — no password needed.'
            : info}
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 ring-1 ring-red-100">
            {error}
          </p>
        )}

        {step === 'email' ? (
          <form onSubmit={handleRequest} className="mt-5 space-y-4">
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-200 bg-cloud px-4 py-3 text-sm text-ink placeholder:text-ink/45 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark disabled:opacity-60"
            >
              {loading ? 'Sending…' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="mt-5 space-y-4">
            <input
              type="text"
              inputMode="numeric"
              required
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="6-digit code"
              className="w-full rounded-xl border border-gray-200 bg-cloud px-4 py-3 text-center text-lg font-bold tracking-[0.4em] text-ink placeholder:tracking-normal placeholder:text-ink/45 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark disabled:opacity-60"
            >
              {loading ? 'Verifying…' : 'Verify & Log in'}
            </button>
            <button
              type="button"
              onClick={() => { setStep('email'); setError(''); setCode(''); }}
              className="w-full text-center text-xs font-medium text-ink/60 hover:text-brand"
            >
              ← Use a different email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
