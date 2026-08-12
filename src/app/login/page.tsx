'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { requestCustomerOtp, verifyCustomerOtp } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

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
      router.push('/'); // send them home after login
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-tint via-white to-white px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo / home link */}
        <div className="mb-8 flex justify-center">
          <Link href="/" aria-label="Back to home">
            <Logo />
          </Link>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-black/5 sm:p-8">
          <h1 className="text-2xl font-extrabold text-brand">
            {step === 'email' ? 'Welcome back' : 'Enter your code'}
          </h1>
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

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-dark active:scale-95 disabled:opacity-60"
              >
                {loading ? 'Sending code…' : 'Send OTP'}
              </button>

              {/* Small register link under the Send OTP button */}
              <p className="text-center text-xs text-ink/60">
                New here?{' '}
                <Link href="/register" className="font-semibold text-brand hover:underline">
                  Register
                </Link>
              </p>

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

          {/* Register link */}
          <p className="mt-6 text-center text-sm text-ink/60">
            New to Easy Breezy?{' '}
            <Link href="/register" className="font-semibold text-brand hover:text-brand-dark">
              Create an account
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-ink/50">
          <Link href="/" className="hover:text-brand">← Back to home</Link>
        </p>
      </div>
    </main>
  );
}
