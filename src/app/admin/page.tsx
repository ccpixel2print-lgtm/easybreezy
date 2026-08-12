'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useStaffAuth } from '@/context/StaffAuthContext';
import { fetchDashboard, StaffAuthError, type DashboardSummary } from '@/lib/staffApi';
import { formatRupees } from '@/lib/format';
import StatusBadge from '@/components/staff/StatusBadge';

export default function AdminOverviewPage() {
  const { token, staff, logout } = useStaffAuth();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchDashboard(token);
      setData(res);
    } catch (err) {
      if (err instanceof StaffAuthError) return logout();
      setError(err instanceof Error ? err.message : 'Could not load dashboard.');
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-700">{error}</p>
        <button onClick={load} className="mt-3 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
          Retry
        </button>
      </div>
    );
  }

  const revenue = data?.revenue ?? {};
  const ops = data?.operations ?? {};
  const orders = data?.orders?.byStatus ?? {};
  const bookings = data?.bookings?.byStatus ?? {};
  const staffCounts = data?.staff?.byRole ?? {};
  const customers = data?.customers ?? {};
  const recent = (data?.recentOrders as RecentOrder[] | undefined) ?? [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Overview</h1>
        <p className="mt-1 text-sm text-ink/60">Welcome back, {staff?.fullName || staff?.email}.</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Paid revenue" value={formatRupees(revenue.paidRevenue)} accent />
        <MetricCard label="Booked revenue" value={formatRupees(revenue.bookedRevenue)} />
        <MetricCard label="Today's jobs" value={String(ops.todaysJobs ?? 0)} />
        <MetricCard
          label="Unassigned queue"
          value={String(ops.unassignedQueue ?? 0)}
          href="/admin/bookings"
        />
      </div>

      {/* Breakdown panels */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <BreakdownPanel title="Orders by status" data={orders} />
        <BreakdownPanel title="Bookings by status" data={bookings} isStatus />
        <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-black/5">
          <h3 className="text-sm font-semibold text-ink">Team</h3>
          <div className="mt-3 space-y-2 text-sm">
            {(['ADMIN', 'SUPERVISOR', 'EMPLOYEE'] as const).map((r) => (
              <div key={r} className="flex justify-between">
                <span className="text-ink/60">{r}</span>
                <span className="font-semibold text-ink">{staffCounts[r] ?? 0}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-black/5 pt-2">
              <span className="text-ink/60">Customers</span>
              <span className="font-semibold text-ink">{customers.total ?? 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="mt-6 rounded-2xl bg-white shadow-soft ring-1 ring-black/5">
        <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
          <h3 className="text-sm font-semibold text-ink">Recent orders</h3>
          <Link href="/admin/orders" className="text-sm font-semibold text-brand hover:underline">
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-ink/50">No recent orders.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-ink/40">
                <tr>
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {recent.map((o) => (
                  <tr key={o.id}>
                    <td className="px-5 py-3 font-medium text-ink">{o.orderNumber ?? o.id}</td>
                    <td className="px-5 py-3 text-ink/70">{o.customerName ?? '—'}</td>
                    <td className="px-5 py-3 text-ink/70">{formatRupees(o.totalAmount)}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={o.status ?? o.paymentStatus ?? 'UNKNOWN'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

interface RecentOrder {
  id: string;
  orderNumber?: string;
  customerName?: string;
  totalAmount?: number;
  status?: string;
  paymentStatus?: string;
}

function MetricCard({
  label,
  value,
  accent,
  href,
}: {
  label: string;
  value: string;
  accent?: boolean;
  href?: string;
}) {
  const card = (
    <div
      className={`rounded-2xl p-5 shadow-soft ring-1 ring-black/5 transition-shadow ${
        accent ? 'bg-brand text-white' : 'bg-white'
      } ${href ? 'hover:shadow-card' : ''}`}
    >
      <p className={`text-xs font-medium ${accent ? 'text-white/70' : 'text-ink/50'}`}>{label}</p>
      <p className={`mt-2 text-2xl font-extrabold ${accent ? 'text-white' : 'text-ink'}`}>{value}</p>
    </div>
  );
  return href ? <Link href={href}>{card}</Link> : card;
}

function BreakdownPanel({
  title,
  data,
  isStatus,
}: {
  title: string;
  data: Record<string, number>;
  isStatus?: boolean;
}) {
  const entries = Object.entries(data);
  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-black/5">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      {entries.length === 0 ? (
        <p className="mt-3 text-sm text-ink/50">No data.</p>
      ) : (
        <div className="mt-3 space-y-2 text-sm">
          {entries.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between">
              {isStatus ? <StatusBadge status={k} /> : <span className="text-ink/60">{k.replace(/_/g, ' ')}</span>}
              <span className="font-semibold text-ink">{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
