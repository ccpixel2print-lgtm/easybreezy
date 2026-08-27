'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchPhonePeStatus, type PhonePeState } from '@/lib/api';

const rupeesFromPaise = (paise: number) =>
  `₹${Math.round(paise / 100).toLocaleString('en-IN')}`;

function StatusInner() {
  const params = useSearchParams();
  const orderId = params.get('orderId');

  const [state, setState] = useState<PhonePeState | 'CHECKING' | 'ERROR'>('CHECKING');
  const [orderNumber, setOrderNumber] = useState<string | undefined>();
  const [amount, setAmount] = useState<number | undefined>();

  useEffect(() => {
    if (!orderId) {
      setState('ERROR');
      return;
    }

    let cancelled = false;
    let attempts = 0;

    // Poll a few times: the webhook may settle the order a moment after redirect.
    const poll = async () => {
      try {
        const res = await fetchPhonePeStatus(orderId);
        if (cancelled) return;

        setOrderNumber(res.orderNumber);
        setAmount(res.totalAmount);

        if (res.state === 'PAID' || res.state === 'FAILED') {
          setState(res.state);
          return;
        }

        // Still pending — retry up to 5 times, 2s apart.
        if (attempts < 5) {
          attempts += 1;
          setTimeout(poll, 2000);
        } else {
          setState('PENDING');
        }
      } catch {
        if (!cancelled) setState('ERROR');
      }
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const checking = state === 'CHECKING';
  const paid = state === 'PAID';
  const failed = state === 'FAILED';
  const pending = state === 'PENDING';
  const error = state === 'ERROR';

  return (
    <div className="mx-auto max-w-md rounded-3xl bg-white p-10 text-center shadow-card ring-1 ring-black/5">
      <span
        className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
          paid
            ? 'bg-green-100 text-green-600'
            : failed || error
              ? 'bg-red-100 text-red-600'
              : 'bg-brand-tint text-brand'
        }`}
      >
        {checking ? (
          <svg className="h-10 w-10 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
          </svg>
        ) : (
          <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {paid ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.007M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            )}
          </svg>
        )}
      </span>

      <h1 className="mt-5 text-2xl font-extrabold text-brand">
        {checking && 'Confirming your payment…'}
        {paid && 'Payment successful!'}
        {failed && 'Payment failed'}
        {pending && 'Payment pending'}
        {error && 'Something went wrong'}
      </h1>

      {orderNumber && (
        <p className="mt-2 text-sm text-ink/70">
          Order <strong className="text-ink">{orderNumber}</strong>
        </p>
      )}
      {typeof amount === 'number' && (
        <p className="mt-1 text-sm text-ink/70">
          Amount: <strong className="text-ink">{rupeesFromPaise(amount)}</strong>
        </p>
      )}

      {paid && (
        <p className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-700 ring-1 ring-green-100">
          Thank you! Your payment is confirmed and your booking is being processed.
        </p>
      )}
      {failed && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700 ring-1 ring-red-100">
          Your payment could not be completed. You can try booking again.
        </p>
      )}
      {pending && (
        <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 ring-1 ring-amber-100">
          We haven’t received a final confirmation yet. If money was debited, it will
          reflect shortly — our team will confirm your booking.
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700 ring-1 ring-red-100">
          We couldn’t verify your payment status. Please contact support if money was debited.
        </p>
      )}

      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default function CheckoutStatusPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[68px]">
        <section className="bg-cloud py-16">
          <Suspense
            fallback={
              <div className="mx-auto max-w-md rounded-3xl bg-white p-10 text-center shadow-card ring-1 ring-black/5">
                <p className="text-sm text-ink/70">Loading…</p>
              </div>
            }
          >
            <StatusInner />
          </Suspense>
        </section>
      </main>
      <Footer />
    </>
  );
}
