'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStaffAuth } from '@/context/StaffAuthContext';
import {
  fetchEmployeeJob,
  acceptEmployeeJob,
  rejectEmployeeJob,
  startEmployeeJob,
  workDoneEmployeeJob,
  uploadJobPhoto,
  StaffAuthError,
  type EmployeeJob,
  type BookingPhoto,
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
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [uploading, setUploading] = useState<'BEFORE' | 'AFTER' | null>(null);

  const beforeInput = useRef<HTMLInputElement>(null);
  const afterInput = useRef<HTMLInputElement>(null);

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

  async function runAction(fn: () => Promise<EmployeeJob>) {
    if (!token || !id) return;
    setActing(true);
    setError(null);
    try {
      const updated = await fn();
      // action responses are partial; re-load to get full job + photos
      setJob((prev) => (prev ? { ...prev, ...updated } : updated));
      await load();
    } catch (err) {
      if (err instanceof StaffAuthError) return logout();
      setError(err instanceof Error ? err.message : 'Action failed.');
    } finally {
      setActing(false);
      setRejecting(false);
    }
  }

  async function handlePhoto(kind: 'BEFORE' | 'AFTER', file?: File) {
    if (!token || !id || !file) return;
    setUploading(kind);
    setError(null);
    try {
      await uploadJobPhoto(token, id, kind.toLowerCase() as 'before' | 'after', file);
      await load();
    } catch (err) {
      if (err instanceof StaffAuthError) return logout();
      setError(err instanceof Error ? err.message : 'Photo upload failed.');
    } finally {
      setUploading(null);
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

  const photos: BookingPhoto[] = job.photos ?? [];
  const hasBefore = photos.some((p) => p.kind === 'BEFORE');
  const hasAfter = photos.some((p) => p.kind === 'AFTER');
  const address = job.address ||
    [job.addressLine1, job.addressLine2, job.area, job.city, job.pincode]
      .filter(Boolean)
      .join(', ');

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
          <Detail label="Address" value={address} full />
        </dl>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Photos: uploadable while the job is active */}
        {['ACCEPTED', 'IN_PROGRESS', 'AWAITING_CONFIRMATION'].includes(job.status) && (
          <div className="mt-6 border-t border-black/5 pt-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink">Job photos</h2>
              <span className="text-xs text-ink/50">Recommended: 1 before + 1 after</span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <PhotoSlot
                label="Before"
                has={hasBefore}
                busy={uploading === 'BEFORE'}
                onPick={() => beforeInput.current?.click()}
              />
              <PhotoSlot
                label="After"
                has={hasAfter}
                busy={uploading === 'AFTER'}
                onPick={() => afterInput.current?.click()}
              />
            </div>

            <input
              ref={beforeInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handlePhoto('BEFORE', e.target.files?.[0])}
            />
            <input
              ref={afterInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handlePhoto('AFTER', e.target.files?.[0])}
            />

            {photos.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {photos.map((p) => (
                  <a key={p.id} href={p.url} target="_blank" rel="noreferrer" className="group relative block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url} alt={`${p.kind} photo`} className="h-24 w-full rounded-lg object-cover ring-1 ring-black/5" />
                    <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white">
                      {p.kind}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions by status */}
        <div className="mt-6 border-t border-black/5 pt-5">
          {job.status === 'ASSIGNED' && !rejecting && (
            <div className="flex gap-3">
              <button
                onClick={() => runAction(() => acceptEmployeeJob(token!, id!))}
                disabled={acting}
                className="flex-1 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark active:scale-95 disabled:opacity-60"
              >
                {acting ? 'Accepting…' : 'Accept Job'}
              </button>
              <button
                onClick={() => setRejecting(true)}
                disabled={acting}
                className="rounded-full border border-red-300 px-6 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
              >
                Reject
              </button>
            </div>
          )}

          {job.status === 'ASSIGNED' && rejecting && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-ink">Reason for rejecting (optional)</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={2}
                placeholder="e.g. Not available at this time."
                className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => runAction(() => rejectEmployeeJob(token!, id!, rejectReason.trim() || undefined))}
                  disabled={acting}
                  className="flex-1 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700 active:scale-95 disabled:opacity-60"
                >
                  {acting ? 'Rejecting…' : 'Confirm Reject'}
                </button>
                <button onClick={() => setRejecting(false)} disabled={acting} className="rounded-full px-6 py-3 text-sm font-semibold text-ink/60 hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {job.status === 'ACCEPTED' && (
            <button
              onClick={() => runAction(() => startEmployeeJob(token!, id!))}
              disabled={acting}
              className="w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark active:scale-95 disabled:opacity-60"
            >
              {acting ? 'Starting…' : 'Start Job'}
            </button>
          )}

          {job.status === 'IN_PROGRESS' && (
            <div className="space-y-3">
              {(!hasBefore || !hasAfter) && (
                <p className="rounded-lg bg-amber-50 px-4 py-2.5 text-sm text-amber-800 ring-1 ring-amber-200">
                  Tip: add a {!hasBefore ? 'before' : ''}{!hasBefore && !hasAfter ? ' and ' : ''}{!hasAfter ? 'after' : ''} photo before marking done.
                </p>
              )}
              <label className="block text-sm font-medium text-ink">Work notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="e.g. Work done, customer satisfied."
                className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
              <button
                onClick={() => runAction(() => workDoneEmployeeJob(token!, id!, notes.trim() || undefined))}
                disabled={acting}
                className="w-full rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 active:scale-95 disabled:opacity-60"
              >
                {acting ? 'Submitting…' : 'Mark Work Done'}
              </button>
            </div>
          )}

          {job.status === 'AWAITING_CONFIRMATION' && (
            <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700 ring-1 ring-blue-200">
              Work submitted. Awaiting supervisor confirmation to close the job.
            </div>
          )}

          {job.status === 'COMPLETED' && (
            <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 ring-1 ring-green-200">
              This job is completed.
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

function PhotoSlot({ label, has, busy, onPick }: { label: string; has: boolean; busy: boolean; onPick: () => void }) {
  return (
    <button
      type="button"
      onClick={onPick}
      disabled={busy}
      className={`flex h-20 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-sm font-medium transition-colors disabled:opacity-60 ${
        has ? 'border-green-300 bg-green-50 text-green-700' : 'border-gray-300 text-ink/60 hover:border-brand hover:text-brand'
      }`}
    >
      {busy ? 'Uploading…' : `${has ? '✓ ' : '+ '}${label}`}
    </button>
  );
}
