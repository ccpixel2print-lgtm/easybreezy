'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { listMyOrders, type CustomerOrder } from '@/lib/api';

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
                    <div key={b.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
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
