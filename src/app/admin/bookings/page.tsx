'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStaffAuth } from '@/context/StaffAuthContext';
import {
  fetchAdminBookings,
  fetchStaffList,
  assignBooking,
  reassignBooking,
  unassignBooking,
  StaffAuthError,
  type AdminBooking,
  type StaffMember,
} from '@/lib/staffApi';
import StatusBadge from '@/components/staff/StatusBadge';
import AssignModal from '@/components/staff/AssignModal';

const STATUS_FILTERS = ['CONFIRMED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', ''];

export default function AdminBookingsPage() {
  const { token, logout } = useStaffAuth();

  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [employees, setEmployees] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [status, setStatus] = useState('CONFIRMED');
  const [onlyUnassigned, setOnlyUnassigned] = useState(false);

  const [modal, setModal] = useState<{ booking: AdminBooking; mode: 'assign' | 'reassign' } | null>(null);

  const isActiveEmployee = (s: StaffMember) =>
    s.role === 'EMPLOYEE' && (s.active ?? s.status !== 'INACTIVE');

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [bk, staff] = await Promise.all([
        fetchAdminBookings(token, {
          status: status || undefined,
          assigned: onlyUnassigned ? false : undefined,
        }),
        fetchStaffList(token),
      ]);
      setBookings(bk);
      setEmployees(staff.filter(isActiveEmployee));
    } catch (err) {
      if (err instanceof StaffAuthError) return logout();
      setError(err instanceof Error ? err.message : 'Could not load bookings.');
    } finally {
      setLoading(false);
    }
  }, [token, status, onlyUnassigned, logout]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleUnassign(b: AdminBooking) {
    if (!token) return;
    setActionError(null);
    try {
      await unassignBooking(token, b.id);
      await load();
    } catch (err) {
      if (err instanceof StaffAuthError) return logout();
      setActionError(err instanceof Error ? err.message : 'Could not unassign.');
    }
  }

  async function handleAssignConfirm(employeeId: string) {
    if (!token || !modal) return;
    const fn = modal.mode === 'assign' ? assignBooking : reassignBooking;
    await fn(token, modal.booking.id, employeeId); // throws bubble up to modal
    await load();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Bookings</h1>
        <p className="mt-1 text-sm text-ink/60">Assign employees to confirmed bookings.</p>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s || 'ALL'}
              onClick={() => setStatus(s)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                status === s
                  ? 'bg-brand text-white'
                  : 'bg-white text-ink/70 ring-1 ring-black/5 hover:bg-brand-tint'
              }`}
            >
              {s ? s.replace(/_/g, ' ') : 'All'}
            </button>
          ))}
        </div>
        <label className="ml-auto flex items-center gap-2 text-sm text-ink/70">
          <input
            type="checkbox"
            checked={onlyUnassigned}
            onChange={(e) => setOnlyUnassigned(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
          />
          Unassigned only
        </label>
      </div>

      {actionError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {actionError}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={load} className="mt-3 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
            Retry
          </button>
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center ring-1 ring-black/5">
          <p className="text-sm text-ink/60">No bookings match these filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {bookings.map((b) => {
            const assigned = b.assignedEmployee || b.assignedEmployeeId;
            const canAssign = b.status === 'CONFIRMED';
            const canReassign = b.status === 'ASSIGNED' || b.status === 'IN_PROGRESS';
            return (
              <div key={b.id} className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-black/5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-ink/50">#{b.bookingNumber ?? b.id}</p>
                    <h3 className="mt-0.5 font-bold text-ink">
                      {b.itemName || b.subServiceName || b.serviceName || 'Service'}
                    </h3>
                  </div>
                  <StatusBadge status={b.status ?? 'UNKNOWN'} />
                </div>

                <div className="mt-3 space-y-1 text-sm text-ink/60">
                  {b.scheduledDate && (
                    <p>{[b.scheduledDate, b.scheduledTimeWindow].filter(Boolean).join(' · ')}</p>
                  )}
                  {b.customerName && <p>{b.customerName}{b.customerPhone ? ` · ${b.customerPhone}` : ''}</p>}
                  {b.pincode && <p>Pincode: {b.pincode}</p>}
                  <p className="pt-1">
                    {assigned ? (
                      <span className="font-medium text-ink">
                        Assigned to: {b.assignedEmployee?.fullName || b.assignedEmployee?.email || b.assignedEmployeeId}
                      </span>
                    ) : (
                      <span className="text-amber-700">Unassigned</span>
                    )}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-wrap gap-2 border-t border-black/5 pt-4">
                  {canAssign && (
                    <button
                      onClick={() => setModal({ booking: b, mode: 'assign' })}
                      className="rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-dark"
                    >
                      Assign
                    </button>
                  )}
                  {canReassign && (
                    <>
                      <button
                        onClick={() => setModal({ booking: b, mode: 'reassign' })}
                        className="rounded-full border border-brand px-4 py-1.5 text-sm font-semibold text-brand hover:bg-brand-tint"
                      >
                        Reassign
                      </button>
                      <button
                        onClick={() => handleUnassign(b)}
                        className="rounded-full px-4 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                      >
                        Unassign
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <AssignModal
          booking={modal.booking}
          employees={employees}
          mode={modal.mode}
          onClose={() => setModal(null)}
          onConfirm={handleAssignConfirm}
        />
      )}
    </div>
  );
}
