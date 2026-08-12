'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStaffAuth } from '@/context/StaffAuthContext';
import { fetchAdminCustomers, StaffAuthError, type AdminCustomer } from '@/lib/staffApi';
import { formatRupees } from '@/lib/format';

const PAGE_SIZE = 20;

export default function AdminCustomersPage() {
  const { token, logout } = useStaffAuth();

  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAdminCustomers(token, {
        page,
        pageSize: PAGE_SIZE,
        search: appliedSearch || undefined,
      });
      setCustomers(res.data);
      setTotal(res.total);
    } catch (err) {
      if (err instanceof StaffAuthError) return logout();
      setError(err instanceof Error ? err.message : 'Could not load customers.');
    } finally {
      setLoading(false);
    }
  }, [token, page, appliedSearch, logout]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [appliedSearch]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Customers</h1>
        <p className="mt-1 text-sm text-ink/60">{total} total</p>
      </div>

      {/* Search */}
      <form
        onSubmit={(e) => { e.preventDefault(); setAppliedSearch(search.trim()); }}
        className="mb-5 flex items-end gap-2"
      >
        <div>
          <label className="mb-1 block text-xs font-medium text-ink/50">Search</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, email or phone"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-ink outline-none focus:border-brand"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          Go
        </button>
        {appliedSearch && (
          <button
            type="button"
            onClick={() => { setSearch(''); setAppliedSearch(''); }}
            className="rounded-lg px-3 py-2 text-sm font-medium text-ink/60 hover:text-brand"
          >
            Clear
          </button>
        )}
      </form>

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
        ) : customers.length === 0 ? (
          <p className="py-12 text-center text-sm text-ink/50">No customers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-ink/40">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Phone</th>
                  <th className="px-5 py-3 font-medium text-right">Orders</th>
                  <th className="px-5 py-3 font-medium text-right">Lifetime value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-cloud/50">
                    <td className="px-5 py-3 font-medium text-ink">{c.fullName ?? '—'}</td>
                    <td className="px-5 py-3 text-ink/70">{c.email ?? '—'}</td>
                    <td className="px-5 py-3 text-ink/70">{c.phone ?? '—'}</td>
                    <td className="px-5 py-3 text-right text-ink/70">{c.orderCount ?? 0}</td>
                    <td className="px-5 py-3 text-right font-semibold text-ink">
                      {formatRupees(c.lifetimeValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && customers.length > 0 && (
          <div className="flex items-center justify-between border-t border-black/5 px-5 py-3 text-sm">
            <span className="text-ink/60">Page {page} of {totalPages}</span>
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
