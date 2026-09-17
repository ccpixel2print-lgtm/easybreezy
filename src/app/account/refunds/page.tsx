'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { listMyOrders, cancelMyOrder, type CustomerOrder } from '@/lib/api';

function inr(paise?: number | null): string {
  return `₹${((paise ?? 0) / 100).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** An order can be cancelled by the customer only while it's unpaid and not already terminal. */
function isCancellable(o: CustomerOrder): boolean {
  const ps = o.paymentStatus.toUpperCase();
  const s = o.status.toUpperCase();
  return ps === 'PENDING' || ps === 'PENDING_PAYMENT'
    ? s !== 'CANCELLED'
    : false;
}

export default function AccountRefundsPage() {
  const { token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);

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
      setError(err instanceof Error ? err.message : 'Could not load your orders.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) load();
  }, [token, load]);

  async function handleCancel(orderId: string) {
    if (!token) return;
    if (!window.confirm('Cancel this order? This cannot be undone.')) return;
    setCancelling(orderId);
    setError(null);
    try {
      await cancelMyOrder(token, orderId);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not cancel this order.');
    } finally {
      setCancelling(null);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-28 sm:px-6">
      <h1 className="text-2xl font-bold text-ink">Refunds &amp; Cancellations</h1>
      <p className="mt-1 text-sm text-ink/60">
        Cancel an unpaid order here. For refunds on paid orders, see our{' '}
        <Link href="/cancellation-refund" className="font-medium text-brand hover:underline">
          cancellation &amp; refund policy
        </Link>{' '}
        or contact support.
      </p>

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
          <p className="text-sm text-ink/60">You have no orders.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-black/5">
              <div>
                <p className="text-sm font-bold text-ink">#{o.orderNumber}</p>
                <p className="text-xs text-ink/50">
                  {o.paymentStatus.replace(/_/g, ' ')} · {inr(o.totalAmount)}
                </p>
              </div>
              {isCancellable(o) ? (
                <button
                  type="button"
                  onClick={() => handleCancel(o.id)}
                  disabled={cancelling === o.id}
                  className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
                >
                  {cancelling === o.id ? 'Cancelling…' : 'Cancel order'}
                </button>
              ) : (
                <span className="text-xs text-ink/40">Not cancellable</span>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
