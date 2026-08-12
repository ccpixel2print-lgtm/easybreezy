'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useStaffAuth } from '@/context/StaffAuthContext';
import {
  fetchEmployeeJob,
  startEmployeeJob,
  completeEmployeeJob,
  StaffAuthError,
  type EmployeeJob,
} from '@/lib/staffApi';
import StatusBadge from '@/components/staff/StatusBadge';

export default function EmployeeJobDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const { token, logout } = useStaffAuth();

  const [job, setJob] = useState<EmployeeJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);
  const [notes, setNotes] = useState('');

  const load = useCallback(async () => {
    if (!token || !id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEmployeeJob(token, id);
      setJob(data);
      setNotes((data.notes as string) || '');
    } catch (err) {
      if (err instanceof StaffAuthError) return logout();
      setError(err instanceof Error ? err.message : 'Could not load this job.');
    } finally {
      setLoading(false);
    }
  }, [token, id, logout]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleStart() {
    if (!token || !id) return;
    setActing(true);
    setError(null);
    try {
      const updated = await startEmployeeJob(token, id);
      setJob(updated);
    } catch (err) {
      if (err instanceof StaffAuthError) return logout();
      setError(err instanceof Error ? err.message : 'Could not start the job.');
    } finally {
      setActing(false);
    }
  }

  async function handleComplete() {
    if (!token || !id) return;
    setActing(true);
    setError(null);
    try {
      const updated = await completeEmployeeJob(token, id, notes.trim() || undefined);
      setJob(updated);
    } catch (err) {
      if (err instanceof StaffAuthError) return logout();
      setError(err instanceof Error ? err.message : 'Could not complete the job.');
    } finally {
      setActing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-700">{error}</p>
        <button onClick={load} className="mt-3 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
          Retry
        </button>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={() => router.push('/employee')}
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-dark"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to My Jobs
      </button>

      <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-black/5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-ink/50">#{job.bookingNumber}</p>
            <h1 className="mt-1 text-xl font-bold text-ink">
              {job.itemName || job.subServiceName || job.serviceName || 'Service'}
            </h1>
          </div>
          <StatusBadge status={job.status} />
        </div>

        <dl className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <Detail label="Scheduled" value={[job.scheduledDate, job.scheduledTimeWindow].filter(Boolean).join(' · ')} />
          <Detail label="Customer" value={job.customerName} />
          <Detail label="Phone" value={job.customerPhone} />
          <Detail label="Pincode" value={job.pincode} />
          <Detail label="Address" value={job.address} full />
        </dl>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Actions by status */}
        <div className="mt-6 border-t border-black/5 pt-5">
          {job.status === 'ASSIGNED' && (
            <button
              onClick={handleStart}
              disabled={acting}
              className="w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark active:scale-95 disabled:opacity-60"
            >
              {acting ? 'Starting…' : 'Start Job'}
            </button>
          )}

          {job.status === 'IN_PROGRESS' && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-ink">Completion notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="e.g. Work done, customer satisfied."
                className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
              <button
                onClick={handleComplete}
                disabled={acting}
                className="w-full rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 active:scale-95 disabled:opacity-60"
              >
                {acting ? 'Completing…' : 'Mark as Complete'}
              </button>
            </div>
          )}

          {job.status === 'COMPLETED' && (
            <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 ring-1 ring-green-200">
              This job is completed{job.completedAt ? ` on ${job.completedAt}` : ''}.
              {job.notes ? <p className="mt-1 text-green-800/80">Notes: {job.notes}</p> : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value, full }: { label: string; value?: string | null; full?: boolean }) {
  if (!value) return null;
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <dt className="text-xs font-medium uppercase tracking-wide text-ink/40">{label}</dt>
      <dd className="mt-0.5 text-ink">{value}</dd>
    </div>
  );
}
