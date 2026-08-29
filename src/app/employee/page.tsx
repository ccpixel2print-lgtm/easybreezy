'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useStaffAuth } from '@/context/StaffAuthContext';
import { fetchEmployeeJobs, StaffAuthError, type EmployeeJob } from '@/lib/staffApi';
import StatusBadge from '@/components/staff/StatusBadge';

const FILTERS = [
  'ALL',
  'ASSIGNED',
  'ACCEPTED',
  'IN_PROGRESS',
  'AWAITING_CONFIRMATION',
  'COMPLETED',
] as const;

export default function EmployeeJobsPage() {
  const { token, logout } = useStaffAuth();
  const [jobs, setJobs] = useState<EmployeeJob[]>([]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEmployeeJobs(token, filter === 'ALL' ? undefined : filter);
      setJobs(data);
    } catch (err) {
      if (err instanceof StaffAuthError) {
        logout();
        return;
      }
      setError(err instanceof Error ? err.message : 'Could not load jobs.');
    } finally {
      setLoading(false);
    }
  }, [token, filter, logout]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">My Jobs</h1>
        <p className="mt-1 text-sm text-ink/60">Your assigned bookings.</p>
      </div>

      {/* Filter tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-brand text-white'
                : 'bg-white text-ink/70 ring-1 ring-black/5 hover:bg-brand-tint'
            }`}
          >
            {f.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={load}
            className="mt-3 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Retry
          </button>
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center ring-1 ring-black/5">
          <p className="text-sm text-ink/60">No jobs to show here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/employee/jobs/${job.id}`}
              className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-black/5 transition-shadow hover:shadow-card"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-ink/50">#{job.bookingNumber}</span>
                <StatusBadge status={job.status} />
              </div>
              <h3 className="font-bold text-ink">
                {job.itemName || job.subServiceName || job.serviceName || 'Service'}
              </h3>
              <div className="space-y-1 text-sm text-ink/60">
                {job.scheduledDate && (
                  <p>
                    {job.scheduledDate}
                    {job.scheduledTimeWindow ? ` · ${job.scheduledTimeWindow}` : ''}
                  </p>
                )}
                {job.customerName && <p>{job.customerName}</p>}
                {job.pincode && <p>Pincode: {job.pincode}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
