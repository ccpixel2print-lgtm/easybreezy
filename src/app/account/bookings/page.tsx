'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { listMyOrders, payQuote, type CustomerOrder } from '@/lib/api';

function inr(paise?: number | null): string {
  return `₹${((paise ?? 0) / 100).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function statusStyle(status: string): string {
  const s = status.toUpperCase();
  if (s === 'COMPLETED' || s === 'PAID' || s === 'CONFIRMED')
    return 'bg-green-50 text-green-700 ring-green-200';
  if (s === 'CANCELLED' || s === 'REFUNDED' || s === 'FAILED')
    return 'bg-red-50 text-red-700 ring-red-200';
  if (s === 'PENDING_PAYMENT' || s === 'PENDING')
    return 'bg-amber-50 text-amber-700 ring-amber-200';
  return 'bg-gray-50 text-gray-700 ring-gray-200';
}

function fmtDate(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AccountBookingsPage() {
  const { token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);

  const handlePayQuote = useCallback(
    async (quoteId: string) => {
      if (!token) return;
      setPayingId(quoteId);
      setPayError(null);
      try {
        const res = await payQuote(token, quoteId);
        if (res.redirectUrl) {
          window.location.href = res.redirectUrl; // full-page redirect to PhonePe
        } else {
          setPayError('Payment could not be started. Please try again.');
          setPayingId(null);
        }
      } catch (err) {
        setPayError(
          err instanceof Error ? err.message : 'Could not start payment.',
        );
        setPayingId(null);
      }
    },
    [token],
  );

  useEffect(() => {
    if (!authLoading && !token) router.replace('/login');
  }, [authLoading, token, router]);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      setOrders(await listMyOrders(token));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load your bookings.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) load();
  }, [token, load]);

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-28 sm:px-6">
      <h1 className="text-2xl font-bold text-ink">My Bookings</h1>
      <p className="mt-1 text-sm text-ink/60">Your orders and their current status.</p>

      {payError && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700">
          {payError}
        </div>
      )}

      {loading || authLoading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        </div>
      ) : error ? (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={load} className="mt-3 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
            Retry
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-6 rounded-xl bg-white p-12 text-center ring-1 ring-black/5">
          <p className="text-sm text-ink/60">You have no bookings yet.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-black/5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-ink">#{o.orderNumber}</p>
                  <p className="text-xs text-ink/50">{fmtDate(o.placedAt ?? o.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${statusStyle(o.paymentStatus)}`}>
                    {o.paymentStatus.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm font-bold text-ink">{inr(o.totalAmount)}</span>
                </div>
              </div>

              {o.bookings && o.bookings.length > 0 && (
                <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                  {o.bookings.map((b) => (
                    <div key={b.id} className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                        <div>
                          <p className="font-medium text-ink">{b.itemName || 'Service'}</p>
                          <p className="text-xs text-ink/50">
                            {b.scheduledDate ? fmtDate(b.scheduledDate) : ''}
                            {b.scheduledTimeWindow ? ` · ${b.scheduledTimeWindow}` : ''}
                            {b.pincode ? ` · ${b.pincode}` : ''}
                          </p>
                        </div>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${statusStyle(b.status)}`}>
                          {b.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      {/* Extra-work quotes for this booking */}
                      {b.quotes && b.quotes.length > 0 && (
                        <div className="space-y-2">
                          {b.quotes.map((q) => (
                            <div
                              key={q.id}
                              className={`rounded-xl p-3 ring-1 ${
                                q.status === 'PAID'
                                  ? 'bg-green-50/50 ring-green-200'
                                  : 'bg-amber-50/60 ring-amber-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold text-ink">
                                  Extra work · {q.quoteNumber}
                                </p>
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${statusStyle(
                                    q.status,
                                  )}`}
                                >
                                  {q.status === 'AWAITING_PAYMENT'
                                    ? 'Payment due'
                                    : q.status.replace(/_/g, ' ')}
                                </span>
                              </div>

                              <ul className="mt-2 space-y-1">
                                {q.items.map((it) => (
                                  <li
                                    key={it.id}
                                    className="flex items-start justify-between gap-3 text-xs text-ink/70"
                                  >
                                    <span>
                                      {it.name}
                                      {it.quantity > 1 ? ` × ${it.quantity}` : ''}
                                      {it.description ? (
                                        <span className="block text-ink/45">
                                          {it.description}
                                        </span>
                                      ) : null}
                                    </span>
                                    <span className="whitespace-nowrap font-medium text-ink">
                                      {inr(it.lineTotal)}
                                    </span>
                                  </li>
                                ))}
                              </ul>

                              <div className="mt-2 space-y-0.5 border-t border-black/5 pt-2 text-xs">
                                <div className="flex justify-between text-ink/60">
                                  <span>Subtotal</span>
                                  <span>{inr(q.subtotal)}</span>
                                </div>
                                {q.taxAmount > 0 && (
                                  <div className="flex justify-between text-ink/60">
                                    <span>GST ({(q.gstRate / 100).toFixed(0)}%)</span>
                                    <span>{inr(q.taxAmount)}</span>
                                  </div>
                                )}
                                <div className="flex justify-between font-semibold text-ink">
                                  <span>Total</span>
                                  <span>{inr(q.totalAmount)}</span>
                                </div>
                              </div>

                              {q.status === 'AWAITING_PAYMENT' && (
                                <button
                                  onClick={() => handlePayQuote(q.id)}
                                  disabled={payingId === q.id}
                                  className="mt-3 w-full rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
                                >
                                  {payingId === q.id
                                    ? 'Redirecting…'
                                    : `Pay ${inr(q.totalAmount)}`}
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
