'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStaffAuth } from '@/context/StaffAuthContext';
import { fetchAdminOrders, StaffAuthError, type AdminOrder } from '@/lib/staffApi';
import { formatRupees } from '@/lib/format';
import StatusBadge from '@/components/staff/StatusBadge';

const ORDER_STATUSES = ['', 'PENDING_PAYMENT', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
const PAYMENT_STATUSES = ['', 'PENDING', 'PAID', 'FAILED', 'REFUNDED'];
const PAGE_SIZE = 20;

export default function AdminOrdersPage() {
  const { token, logout } = useStaffAuth();

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // filters
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAdminOrders(token, {
        page,
        pageSize: PAGE_SIZE,
        status: status || undefined,
        paymentStatus: paymentStatus || undefined,
        search: appliedSearch || undefined,
      });
      setOrders(res.data);
      setTotal(res.total);
    } catch (err) {
      if (err instanceof StaffAuthError) return logout();
      setError(err instanceof Error ? err.message : 'Could not load orders.');
    } finally {
      setLoading(false);
    }
  }, [token, page, status, paymentStatus, appliedSearch, logout]);

  useEffect(() => {
    load();
  }, [load]);

  // reset to page 1 whenever a filter changes
  useEffect(() => {
    setPage(1);
  }, [status, paymentStatus, appliedSearch]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Orders</h1>
        <p className="mt-1 text-sm text-ink/60">{total} total</p>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-ink/50">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-ink outline-none focus:border-brand"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{s ? s.replace(/_/g, ' ') : 'All'}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink/50">Payment</label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-ink outline-none focus:border-brand"
          >
            {PAYMENT_STATUSES.map((s) => (
              <option key={s} value={s}>{s || 'All'}</option>
            ))}
          </select>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); setAppliedSearch(search.trim()); }}
          className="flex items-end gap-2"
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-ink/50">Search</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Order # or customer"
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-ink outline-none focus:border-brand"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Go
          </button>
          {(status || paymentStatus || appliedSearch) && (
            <button
              type="button"
              onClick={() => { setStatus(''); setPaymentStatus(''); setSearch(''); setAppliedSearch(''); }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink/60 hover:text-brand"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white shadow-soft ring-1 ring-black/5">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-sm text-red-700">{error}</p>
            <button onClick={load} className="mt-3 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
              Retry
            </button>
          </div>
        ) : orders.length === 0 ? (
          <p className="py-12 text-center text-sm text-ink/50">No orders match these filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-ink/40">
                <tr>
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Payment</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-cloud/50">
                    <td className="px-5 py-3 font-medium text-ink">{o.orderNumber ?? o.id}</td>
                    <td className="px-5 py-3 text-ink/70">
                      {o.contactName ??
                        o.customerName ??
                        o.contactEmail ??
                        o.customerEmail ??
                        ''}
                    </td>
                    <td className="px-5 py-3 text-ink/70">{formatRupees(o.totalAmount)}</td>
                    <td className="px-5 py-3">
                      {o.paymentStatus ? <StatusBadge status={o.paymentStatus} /> : '—'}
                    </td>
                    <td className="px-5 py-3">
                      {o.status ? <StatusBadge status={o.status} /> : '—'}
                    </td>
                    <td className="px-5 py-3 text-ink/60">
                      {o.placedAt
                        ? new Date(o.placedAt).toLocaleDateString('en-IN')
                        : o.createdAt
                          ? new Date(o.createdAt).toLocaleDateString('en-IN')
                          : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && orders.length > 0 && (
          <div className="flex items-center justify-between border-t border-black/5 px-5 py-3 text-sm">
            <span className="text-ink/60">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-lg border border-gray-200 px-3 py-1.5 font-medium text-ink disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-lg border border-gray-200 px-3 py-1.5 font-medium text-ink disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
